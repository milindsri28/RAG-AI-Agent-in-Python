"""
Services module for RAG application backend operations.
Handles Inngest client, event sending, and API interactions.
"""

import os
import time
from pathlib import Path
import requests
import inngest
from dotenv import load_dotenv

load_dotenv()


class InngestService:
    """Service for managing Inngest client and event operations."""
    
    def __init__(self):
        self._client = None
    
    @property
    def client(self) -> inngest.Inngest:
        """Get or create Inngest client instance."""
        if self._client is None:
            self._client = inngest.Inngest(app_id="rag_app", is_production=False)
        return self._client
    
    async def send_ingest_event(self, pdf_path: Path) -> None:
        """
        Send PDF ingestion event to Inngest.
        
        Args:
            pdf_path: Path to the PDF file to ingest
        """
        await self.client.send(
            inngest.Event(
                name="rag/ingest_pdf",
                data={
                    "pdf_path": str(pdf_path.resolve()),
                    "source_id": pdf_path.name,
                },
            )
        )
    
    async def send_query_event(self, question: str, top_k: int) -> str:
        """
        Send query event to Inngest.
        
        Args:
            question: User's question
            top_k: Number of chunks to retrieve
            
        Returns:
            Event ID for tracking the query
        """
        result = await self.client.send(
            inngest.Event(
                name="rag/query_pdf_ai",
                data={
                    "question": question,
                    "top_k": top_k,
                },
            )
        )
        return result[0]


class FileService:
    """Service for file operations."""
    
    @staticmethod
    def save_uploaded_pdf(file) -> Path:
        """
        Save uploaded PDF file to uploads directory.
        
        Args:
            file: Uploaded file object
            
        Returns:
            Path to saved file
        """
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(parents=True, exist_ok=True)
        file_path = uploads_dir / file.name
        file_bytes = file.getbuffer()
        file_path.write_bytes(file_bytes)
        return file_path


class InngestAPIService:
    """Service for interacting with Inngest API."""
    
    @staticmethod
    def get_api_base() -> str:
        """Get Inngest API base URL from environment or default."""
        return os.getenv("INNGEST_API_BASE", "http://127.0.0.1:8288/v1")
    
    @classmethod
    def fetch_runs(cls, event_id: str) -> list[dict]:
        """
        Fetch runs for a given event ID.
        
        Args:
            event_id: Event ID to fetch runs for
            
        Returns:
            List of run data
        """
        url = f"{cls.get_api_base()}/events/{event_id}/runs"
        resp = requests.get(url)
        resp.raise_for_status()
        data = resp.json()
        return data.get("data", [])
    
    @classmethod
    def wait_for_run_output(
        cls, 
        event_id: str, 
        timeout_s: float = 120.0, 
        poll_interval_s: float = 0.5
    ) -> dict:
        """
        Poll for run output until completion or timeout.
        
        Args:
            event_id: Event ID to monitor
            timeout_s: Maximum time to wait in seconds
            poll_interval_s: Time between polls in seconds
            
        Returns:
            Output data from the completed run
            
        Raises:
            RuntimeError: If run fails or is cancelled
            TimeoutError: If timeout is reached
        """
        start = time.time()
        last_status = None
        
        while True:
            runs = cls.fetch_runs(event_id)
            if runs:
                run = runs[0]
                status = run.get("status")
                last_status = status or last_status
                
                if status in ("Completed", "Succeeded", "Success", "Finished"):
                    return run.get("output") or {}
                
                if status in ("Failed", "Cancelled"):
                    raise RuntimeError(f"Function run {status}")
            
            if time.time() - start > timeout_s:
                raise TimeoutError(
                    f"Timed out waiting for run output (last status: {last_status})"
                )
            
            time.sleep(poll_interval_s)

