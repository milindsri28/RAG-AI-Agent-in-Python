"""
API Routes for React Frontend
Exposes existing functionality without changing core logic
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
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

