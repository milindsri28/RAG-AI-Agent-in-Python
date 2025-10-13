import logging
from fastapi import FastAPI
import inngest
import inngest.fast_api
from inngest.experimental import ai
from dotenv import load_dotenv
import uuid
import os
import datetime
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
    def _search(question: str, top_k: int = 5, source_file: str = None) -> RAGSearchResult:
        query_vec = embed_text([question])[0]
        store = QdrantStorage()
        found = store.search(query_vec, top_k, source_filter=source_file)
        return RAGSearchResult(contexts=found["contexts"], sources=found["sources"])

    question = ctx.event.data["question"]
    top_k = int(ctx.event.data.get("top_k", 5))
    source_file = ctx.event.data.get("source_file")

    found = await ctx.step.run("embed-and-search", lambda: _search(question, top_k, source_file), output_type=RAGSearchResult)

    context_block = "\n\n".join(f"- {c}" for c in found.contexts)
    user_content = (
        "Use the following context from the document to answer the question.\n\n"
        f"Context:\n{context_block}\n\n"
        f"Question: {question}\n"
        "Provide a detailed and helpful answer based on the context above."
    )

    adapter = ai.openai.Adapter(
        auth_key=os.getenv("OPENAI_API_KEY"),
        model="gpt-4o-mini"
    )

    system_prompt = """You are a helpful AI assistant that answers questions based on provided document context.

Your guidelines:
1. Provide detailed, comprehensive answers using the context provided
2. If the context contains the information, expand on it and explain thoroughly
3. Structure your answers clearly with proper formatting
4. If the context mentions topics but lacks details, acknowledge what's available and what's missing
5. Be helpful and informative - don't be overly restrictive
6. If asked to list or enumerate items from the context, do so clearly
7. When the context has partial information, provide what's available rather than refusing to answer

Always base your answers on the provided context, but be as helpful and detailed as possible."""

    res = await ctx.step.ai.infer(
        "llm-answer",
        adapter=adapter,
        body={
            "max_tokens": 2048,  # Increased for more detailed answers
            "temperature": 0.3,  # Slightly increased for more natural responses
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ]
        }
    )

    answer = res["choices"][0]["message"]["content"].strip()
    return {"answer": answer, "sources": found.sources, "num_contexts": len(found.contexts)}

app = FastAPI()

# Enable CORS for React frontend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes for React frontend
from api_routes import router as api_router
app.include_router(api_router)

inngest.fast_api.serve(app, inngest_client, functions= [rag_ingest_pdf, rag_query_pdf_ai])