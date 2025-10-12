import logging
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import inngest
import inngest.fast_api
from inngest.experimental import ai
from dotenv import load_dotenv
import uuid
import os
import datetime
import shutil
from pathlib import Path
from data_loader import load_and_chunk_pdf, embed_text
from vector_db import QdrantStorage
from custom_types import RAGchunckandsrc, RAGQueryResult, RAGSearchResult, RAGUpsertResult

load_dotenv()

inngest_client = inngest.Inngest(
    app_id= "rag_app",
    logger = logging.getLogger("uvicorn"),
    is_production = False,
    serializer = inngest.PydanticSerializer(),
)

@inngest_client.create_function(
    fn_id = "rag: ingest PDF",
    trigger= inngest.TriggerEvent(event="rag/ingest_pdf")
)
async def rag_ingest_pdf(ctx: inngest.Context):
    def _load(ctx: inngest.Context) -> RAGchunckandsrc:
        pdf_path = ctx.event.data.get("pdf_path")
        source_id = ctx.event.data.get("source_id", pdf_path) 
        chunks = load_and_chunk_pdf(pdf_path)
        return RAGchunckandsrc(Chunks=chunks, Source_id=source_id)
    
    def _upsert(chuks_and_src: RAGchunckandsrc) -> RAGUpsertResult:
        chunks = chuks_and_src.Chunks
        source_id = chuks_and_src.Source_id
        vecs = embed_text(chunks)
        ids = [str(uuid.uuid5(uuid.NAMESPACE_URL, name=f"{source_id}:{i}")) for i in range(len(chunks))]
        payloads = [{"text":chunks[i], "source":source_id} for i in range(len(chunks))]
        QdrantStorage().upsert(ids, vecs, payloads)
        return RAGUpsertResult(ingested=len(chunks))
        
    chunks_and_src = await ctx.step.run("load-an-chunk", lambda:_load(ctx), output_type=RAGchunckandsrc)
    ingested = await ctx.step.run("embed-and-upsert", lambda:_upsert(chunks_and_src), output_type=RAGUpsertResult)
    return ingested.model_dump()

@inngest_client.create_function(
    fn_id="RAG: Query PDF",
    trigger=inngest.TriggerEvent(event="rag/query_pdf_ai")
)
async def rag_query_pdf_ai(ctx: inngest.Context):
    def _search(question: str, top_k: int = 5) -> RAGSearchResult:
        query_vec = embed_text([question])[0]
        store = QdrantStorage()
        found = store.search(query_vec, top_k)
        return RAGSearchResult(contexts=found["contexts"], sources=found["sources"])

    question = ctx.event.data["question"]
    top_k = int(ctx.event.data.get("top_k", 5))

    found = await ctx.step.run("embed-and-search", lambda: _search(question, top_k), output_type=RAGSearchResult)

    context_block = "\n\n".join(f"- {c}" for c in found.contexts)
    user_content = (
        "Use the following context to answer the question.\n\n"
        f"Context:\n{context_block}\n\n"
        f"Question: {question}\n"
        "Answer concisely using the context above."
    )

    adapter = ai.openai.Adapter(
        auth_key=os.getenv("OPENAI_API_KEY"),
        model="gpt-4o-mini"
    )

    res = await ctx.step.ai.infer(
        "llm-answer",
        adapter=adapter,
        body={
            "max_tokens": 1024,
            "temperature": 0.2,
            "messages": [
                {"role": "system", "content": "You answer questions using only the provided context."},
                {"role": "user", "content": user_content}
            ]
        }
    )

    answer = res["choices"][0]["message"]["content"].strip()
    return {"answer": answer, "sources": found.sources, "num_contexts": len(found.contexts)}

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests
class IngestRequest(BaseModel):
    pdf_path: str
    source_id: str

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5

# REST API endpoints
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and save PDF file"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Ensure uploads directory exists
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(parents=True, exist_ok=True)
    
    # Save file
    file_path = uploads_dir / file.filename
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return JSONResponse({
            "message": "File uploaded successfully",
            "file_path": str(file_path.resolve()),
            "filename": file.filename
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

@app.post("/api/ingest")
async def trigger_ingest(request: IngestRequest):
    """Trigger PDF ingestion workflow"""
    try:
        event_result = await inngest_client.send(
            inngest.Event(
                name="rag/ingest_pdf",
                data={
                    "pdf_path": request.pdf_path,
                    "source_id": request.source_id,
                },
            )
        )
        
        return JSONResponse({
            "message": "Ingestion started",
            "event_id": event_result[0] if event_result else None
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to trigger ingestion: {str(e)}")

@app.post("/api/query")
async def trigger_query(request: QueryRequest):
    """Trigger PDF query workflow"""
    try:
        event_result = await inngest_client.send(
            inngest.Event(
                name="rag/query_pdf_ai",
                data={
                    "question": request.question,
                    "top_k": request.top_k,
                },
            )
        )
        
        return JSONResponse({
            "message": "Query started",
            "event_id": event_result[0] if event_result else None
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to trigger query: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "RAG API is running"}

inngest.fast_api.serve(app, inngest_client, functions= [rag_ingest_pdf, rag_query_pdf_ai])