# RAG PDF Assistant - Beautiful Modern Frontend

A beautiful, modern React-based frontend for your RAG (Retrieval-Augmented Generation) PDF assistant. Upload PDF documents and ask AI-powered questions with an intuitive, responsive interface.

## ✨ Features

- **🎨 Modern Design**: Beautiful parallax backgrounds, glass-morphism effects, and smooth animations
- **🌓 Dark/Light Mode**: Toggle between themes with a single click
- **📁 Drag & Drop Upload**: Intuitive file upload with visual feedback
- **💬 Intelligent Q&A**: Ask questions about your PDFs and get AI-powered answers
- **📊 Source Citations**: See exactly which parts of your documents were used
- **⚡ Real-time Processing**: Live progress updates during document processing
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🛠️ Technology Stack

- **Frontend**: React 18 with Framer Motion animations
- **Styling**: Tailwind CSS with custom glass effects
- **Backend**: FastAPI with Inngest workflows
- **AI**: OpenAI GPT-4o-mini for answers, text-embedding-3-large for search
- **Database**: Qdrant vector database for document storage
- **Document Processing**: LlamaIndex for PDF parsing and chunking

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher) and **yarn**
2. **Python** (v3.11 or higher) 
3. **Docker** (for Qdrant database)
4. **OpenAI API Key**

### Setup Instructions

1. **Clone and Setup**:
   ```bash
   cd /app
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Set your OpenAI API Key**:
   ```bash
   export OPENAI_API_KEY="your-openai-api-key-here"
   ```

3. **Start All Services**:
   ```bash
   ./start_services.sh
   ```

4. **Open Your Browser**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Qdrant Database: http://localhost:6333
   - Inngest Dashboard: http://localhost:8288

## 📖 How to Use

### Step 1: Upload Your PDF
- Drag and drop a PDF file into the upload zone, or click to browse
- Watch the beautiful loading animation while your document is processed
- The app will chunk your document and create embeddings for search

### Step 2: Ask Questions  
- Type your question about the uploaded document
- Adjust the number of chunks to retrieve (1-20) for more comprehensive answers
- Click "Ask Question" and watch the AI generate an answer in real-time
- Review the sources to see which parts of your document were used

### Features in Detail

- **Smart Chunking**: Documents are intelligently split into searchable chunks
- **Semantic Search**: Find relevant information using AI-powered similarity search  
- **Context-Aware Answers**: AI responses are generated using only your document content
- **Source Transparency**: See exactly which document sections were used for each answer
- **Multi-Document Support**: Upload different PDFs and switch between them easily

## 🎨 Design Highlights

- **Parallax Background**: Dynamic moving shapes create depth and visual interest
- **Glass Morphism**: Modern frosted glass effects throughout the interface
- **Smooth Animations**: Framer Motion powers fluid transitions and micro-interactions
- **Responsive Layout**: Adapts beautifully to any screen size
- **Dark Mode**: Easy on the eyes with a sophisticated dark theme
- **Loading States**: Beautiful spinners and progress indicators keep users informed

## 🔧 Manual Installation (Alternative)

If the setup script doesn't work, follow these manual steps:

1. **Install Python Dependencies**:
   ```bash
   cd /app
   pip install fastapi uvicorn inngest openai llama-index-core llama-index-readers-file qdrant-client python-dotenv streamlit
   ```

2. **Install React Dependencies**:
   ```bash
   cd /app/frontend
   yarn install
   ```

3. **Start Qdrant Database**:
   ```bash
   docker run -d --name qdrant -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage:z qdrant/qdrant:latest
   ```

4. **Start Services**:
   ```bash
   # Terminal 1: Start Inngest
   inngest-cli dev
   
   # Terminal 2: Start Backend
   cd /app && uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   
   # Terminal 3: Start Frontend  
   cd /app/frontend && yarn start
   ```

## 📁 Project Structure

```
/app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Custom animations and effects
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles and Tailwind
│   ├── public/              # Static assets
│   ├── package.json         # React dependencies
│   └── tailwind.config.js   # Tailwind configuration
├── main.py                  # FastAPI backend with Inngest workflows
├── data_loader.py          # PDF processing and embeddings
├── vector_db.py            # Qdrant database operations
├── custom_types.py         # Pydantic data models
├── requirements.txt        # Python dependencies
├── setup.sh               # Automated setup script
├── start_services.sh      # Service startup script
└── README.md              # This file
```

## 🔍 API Endpoints

- `POST /upload` - Upload PDF file
- `POST /api/ingest` - Trigger document ingestion
- `POST /api/query` - Ask questions about documents
- `GET /health` - Health check

## 🎯 Customization

### Styling
- Modify `tailwind.config.js` for custom colors and animations
- Edit `App.css` for additional custom effects
- Update theme colors in the Tailwind configuration

### Functionality
- Adjust chunk size and overlap in `data_loader.py`
- Modify AI model parameters in `main.py`
- Add new features to the React components

## 🐛 Troubleshooting

**Frontend won't start?**
- Ensure Node.js and yarn are installed
- Run `yarn install` in the frontend directory

**Backend API errors?**
- Check that your OpenAI API key is set correctly
- Ensure Qdrant is running on port 6333
- Verify Inngest dev server is running on port 8288

**Document upload fails?**
- Check file is a valid PDF
- Ensure uploads directory has write permissions
- Verify backend is running and accessible

**No answers generated?**
- Confirm document was successfully processed
- Check that chunks were properly embedded and stored
- Verify OpenAI API key has sufficient credits

## 🎉 Enjoy Your Beautiful PDF Assistant!

You now have a modern, professional-looking interface for your RAG application. The combination of powerful AI capabilities with beautiful UX makes document analysis both effective and enjoyable!