#!/bin/bash

# Start Qdrant database
echo "Starting Qdrant database..."
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -v $(pwd)/qdrant_storage:/qdrant/storage:z \
  qdrant/qdrant:latest || echo "Qdrant container might already be running"

# Wait a moment for Qdrant to start
sleep 3

# Start Inngest dev server
echo "Starting Inngest dev server..."
inngest-cli dev &

# Wait a moment for Inngest to start
sleep 3

# Start FastAPI backend
echo "Starting FastAPI backend..."
cd /app && uvicorn main:app --host 0.0.0.0 --port 8000 --reload &

# Start React frontend
echo "Starting React frontend..."
cd /app/frontend && yarn start &

echo "All services started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "Qdrant: http://localhost:6333"
echo "Inngest: http://localhost:8288"

wait