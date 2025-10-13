"""
API Routes for React Frontend
Exposes existing functionality without changing core logic
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import asyncio
from pathlib import Path
import uuid
from typing import Optional
import inngest
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Request/Response models
class QueryRequest(BaseModel):
    question: str
    top_k: int = 5
    source_file: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    sources: list[str]
    num_contexts: int

class UploadResponse(BaseModel):
    filename: str
    file_id: str
    status: str
    message: str

# Inngest client for sending events
inngest_client = inngest.Inngest(app_id="rag_app", is_production=False)


@router.post("/api/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload PDF and trigger ingestion
    """
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Save file
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(parents=True, exist_ok=True)
        
        file_id = str(uuid.uuid4())
        file_path = uploads_dir / f"{file_id}_{file.filename}"
        
        # Write file
        content = await file.read()
        file_path.write_bytes(content)
        
        # Trigger Inngest event (using existing function)
        await inngest_client.send(
            inngest.Event(
                name="rag/ingest_pdf",
                data={
                    "pdf_path": str(file_path.resolve()),
                    "source_id": file.filename,
                },
            )
        )
        
        return UploadResponse(
            filename=file.filename,
            file_id=file_id,
            status="success",
            message=f"Successfully uploaded and processing {file.filename}"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """
    Query documents and get AI response
    """
    try:
        # Send query event to Inngest (using existing function)
        result = await inngest_client.send(
            inngest.Event(
                name="rag/query_pdf_ai",
                data={
                    "question": request.question,
                    "top_k": request.top_k,
                    "source_file": request.source_file,
                },
            )
        )
        
        event_id = result[0]
        
        # Poll for results (reusing existing logic)
        import time
        import requests
        import os
        
        def get_inngest_api_base():
            return os.getenv("INNGEST_API_BASE", "http://127.0.0.1:8288/v1")
        
        def fetch_runs(event_id: str):
            url = f"{get_inngest_api_base()}/events/{event_id}/runs"
            resp = requests.get(url)
            resp.raise_for_status()
            data = resp.json()
            return data.get("data", [])
        
        # Wait for completion
        timeout = 120
        start = time.time()
        last_status = None
        
        while True:
            runs = fetch_runs(event_id)
            if runs:
                run = runs[0]
                status = run.get("status")
                last_status = status or last_status
                
                if status in ("Completed", "Succeeded", "Success", "Finished"):
                    output = run.get("output") or {}
                    return QueryResponse(
                        answer=output.get("answer", "No answer generated"),
                        sources=output.get("sources", []),
                        num_contexts=output.get("num_contexts", 0)
                    )
                
                if status in ("Failed", "Cancelled"):
                    raise HTTPException(status_code=500, detail=f"Query processing {status}")
            
            if time.time() - start > timeout:
                raise HTTPException(status_code=408, detail="Query timeout")
            
            await asyncio.sleep(0.5)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "RAG AI Agent API is running"}


@router.get("/api/files")
async def list_files():
    """
    List all uploaded PDF files with metadata
    """
    try:
        uploads_dir = Path("uploads")
        if not uploads_dir.exists():
            return {"files": []}
        
        # Get all files with metadata
        files = []
        for file_path in uploads_dir.glob("*.pdf"):
            filename = file_path.name
            # Extract original filename (format: uuid_originalname.pdf)
            if "_" in filename:
                original_name = "_".join(filename.split("_")[1:])
            else:
                original_name = filename
            
            # Get file stats
            stats = file_path.stat()
            file_size_bytes = stats.st_size
            
            # Format file size
            if file_size_bytes < 1024:
                size_str = f"{file_size_bytes} B"
            elif file_size_bytes < 1024 * 1024:
                size_str = f"{file_size_bytes / 1024:.1f} KB"
            else:
                size_str = f"{file_size_bytes / (1024 * 1024):.1f} MB"
            
            # Get upload date (file creation/modification time)
            from datetime import datetime
            upload_date = datetime.fromtimestamp(stats.st_mtime).isoformat()
            
            files.append({
                "name": original_name,
                "size": size_str,
                "size_bytes": file_size_bytes,
                "upload_date": upload_date,
                "path": str(file_path)
            })
        
        # Sort by upload date (most recent first)
        files.sort(key=lambda x: x["upload_date"], reverse=True)
        
        return {"files": files}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/api/delete/{filename}")
async def delete_file(filename: str):
    """
    Delete a specific PDF file
    """
    try:
        uploads_dir = Path("uploads")
        if not uploads_dir.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Find the file with the matching original name (after UUID_)
        deleted = False
        for file_path in uploads_dir.glob("*.pdf"):
            if file_path.name.endswith(f"_{filename}"):
                file_path.unlink()
                deleted = True
                break
        
        if not deleted:
            raise HTTPException(status_code=404, detail="File not found")
        
        return {
            "status": "success",
            "message": f"Successfully deleted {filename}"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class RenameRequest(BaseModel):
    old_name: str
    new_name: str


@router.put("/api/rename")
async def rename_file(request: RenameRequest):
    """
    Rename a specific PDF file
    """
    try:
        uploads_dir = Path("uploads")
        if not uploads_dir.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Validate new name
        if not request.new_name.endswith('.pdf'):
            request.new_name += '.pdf'
        
        # Find the file with the matching original name (after UUID_)
        renamed = False
        for file_path in uploads_dir.glob("*.pdf"):
            if file_path.name.endswith(f"_{request.old_name}"):
                # Extract UUID prefix
                uuid_prefix = file_path.name.split("_")[0]
                new_path = uploads_dir / f"{uuid_prefix}_{request.new_name}"
                
                # Check if new name already exists
                if new_path.exists():
                    raise HTTPException(status_code=400, detail="A file with this name already exists")
                
                file_path.rename(new_path)
                renamed = True
                break
        
        if not renamed:
            raise HTTPException(status_code=404, detail="File not found")
        
        return {
            "status": "success",
            "message": f"Successfully renamed to {request.new_name}",
            "new_name": request.new_name
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/download/{filename}")
async def download_file(filename: str):
    """
    Download a specific PDF file
    """
    try:
        uploads_dir = Path("uploads")
        if not uploads_dir.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Find the file with the matching original name (after UUID_)
        for file_path in uploads_dir.glob("*.pdf"):
            if file_path.name.endswith(f"_{filename}"):
                return FileResponse(
                    path=file_path,
                    filename=filename,
                    media_type='application/pdf'
                )
        
        raise HTTPException(status_code=404, detail="File not found")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))