from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, Filter, FieldCondition, MatchValue
import os
from dotenv import load_dotenv

load_dotenv()

class QdrantStorage:
    def __init__(self, url=None, api_key=None, collection="docs", dim=3072): 
        # Get from environment variables if not provided
        url = url or os.getenv("QDRANT_URL", "http://localhost:6333")
        api_key = api_key or os.getenv("QDRANT_API_KEY")
        
        # Initialize client with or without API key
        if api_key:
            self.client = QdrantClient(url=url, api_key=api_key, timeout=30)
        else:
            self.client = QdrantClient(url=url, timeout=30)
        
        self.collection = collection
        if not self.client.collection_exists(self.collection):
            self.client.create_collection(
                collection_name=self.collection,
                vectors_config=VectorParams(size=dim, distance=Distance.COSINE)
            )
            
    def upsert(self, ids, vectors, payloads):
        points = [PointStruct(id=ids[i], vector=vectors[i], payload=payloads[i]) for i in range(len(ids))]
        self.client.upsert(collection_name=self.collection, points=points)
        
    def search(self, query_vector, top_k: int = 5, source_filter: str = None):
        # Build query filter if source is specified
        # If source_filter is "__ALL__", search across all documents
        query_filter = None
        if source_filter and source_filter != "__ALL__":
            query_filter = Filter(
                must=[
                    FieldCondition(
                        key="source",
                        match=MatchValue(value=source_filter)
                    )
                ]
            )
        
        results = self.client.search(
            collection_name=self.collection,
            query_vector=query_vector,
            query_filter=query_filter,
            with_payload=True,
            limit=top_k
        )
        contexts = []
        sources = set()
        
        for r in results:
            payload = getattr(r, 'payload', None) or {}
            text = payload.get('text', '')
            source = payload.get('source', '')
            if text:
                contexts.append(text)
                sources.add(source)
        
        return {"contexts": contexts, "sources": list(sources)}
        