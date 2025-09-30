import pydantic

class RAGchunckandsrc(pydantic.BaseModel):
    Chunks: list[str]
    Source_id: str = None


class RAGUpsertResult(pydantic.BaseModel):
    ingested: int
    
    
class RAGSearchResult(pydantic.BaseModel):
    contexts: list[str]
    sources: list[str]
    
class RAGQueryResult(pydantic.BaseModel):
    answer: str
    num_contexts: int
    sources: list[str]