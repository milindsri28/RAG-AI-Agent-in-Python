#!/bin/bash

echo "Setting up RAG PDF Assistant..."

# Install Python dependencies
echo "Installing Python dependencies..."
cd /app
pip install -r requirements.txt

# Check if Docker is available for Qdrant
if command -v docker &> /dev/null; then
    echo "Docker is available for Qdrant"
else
    echo "Warning: Docker not found. You'll need to install Qdrant manually or use Docker Desktop"
fi

# Check if npm/yarn is available for React
if command -v yarn &> /dev/null; then
    echo "Yarn is available for React frontend"
else
    echo "Installing yarn..."
    npm install -g yarn 2>/dev/null || echo "Please install Node.js and yarn manually"
fi

# Install Inngest CLI if not present
if ! command -v inngest &> /dev/null; then
    echo "Installing Inngest CLI..."
    npm install -g inngest-cli 2>/dev/null || echo "Please install inngest-cli manually: npm install -g inngest-cli"
fi

# Install React dependencies
echo "Installing React dependencies..."
cd /app/frontend
yarn install

echo "Setup complete!"
echo "To start the application, run: ./start_services.sh"
echo ""
echo "Make sure you have:"
echo "1. OpenAI API key in your environment (OPENAI_API_KEY)"
echo "2. Docker running (for Qdrant database)"