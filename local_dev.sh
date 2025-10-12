#!/bin/bash

echo "🚀 Starting RAG PDF Assistant - Beautiful Frontend Edition"
echo "================================================"

# Check if .env file exists and has OPENAI_API_KEY
if [ ! -f ".env" ] || ! grep -q "OPENAI_API_KEY" .env || grep -q "OPENAI_API_KEY=#" .env; then
    echo "⚠️  Please set your OPENAI_API_KEY in the .env file"
    echo "   Edit .env and replace 'OPENAI_API_KEY=#' with your actual key"
    echo ""
fi

echo "📋 Setup Instructions:"
echo "1. Make sure Docker is running for Qdrant database"
echo "2. Set your OPENAI_API_KEY in .env file"
echo "3. Run the following commands in separate terminals:"
echo ""
echo "🐳 Terminal 1 - Start Qdrant Database:"
echo "docker run -d --name qdrant -p 6333:6333 -v \$(pwd)/qdrant_storage:/qdrant/storage:z qdrant/qdrant:latest"
echo ""
echo "⚙️  Terminal 2 - Start Inngest Dev Server:"
echo "npx inngest-cli@latest dev"
echo ""
echo "🔧 Terminal 3 - Start FastAPI Backend:"
echo "cd /app && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
echo ""
echo "🎨 Terminal 4 - Start Beautiful React Frontend:"
echo "cd /app/frontend && yarn start"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "Enjoy your beautiful RAG PDF Assistant! ✨"