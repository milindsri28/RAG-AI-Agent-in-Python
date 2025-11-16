# RAG AI Agent - Complete Setup Guide

## 🎯 Overview

You now have a **React/Next.js frontend** with modern features.
**Backend stays the same** – all functionality preserved! ✅

---

## 🚀 Quick Start (React Frontend)

### Step 1: Start Backend

```bash
# In project root directory
python -m uvicorn main:app --reload --port 8000
```

### Step 2: Start Inngest Dev Server

```bash
# In another terminal
npx inngest-cli@latest dev
```

### Step 3: Start React Frontend

```bash
# In another terminal
cd frontend-react
npm install
npm run dev
```

### Step 4: Open Browser

Go to: **http://localhost:3000**

---

## 📦 Installation Details

### Backend (No Changes Required!)

Your existing backend works perfectly:

```bash
# Already installed from before
uv sync
# or
pip install -r requirements.txt
```

### React Frontend

```bash
cd frontend-react
npm install
```

---

## 🎨 What's New in React Frontend

### Advanced Features

✨ **Drag & Drop File Upload**
- Visual hover effects
- Progress bars
- Instant feedback

🎭 **Smooth Animations**
- Framer Motion powered
- Page transitions
- Micro-interactions

📊 **Better UX**
- Real-time progress indicators
- Typing animations
- Loading states

🎯 **Interactive Elements**
- Parallax backgrounds
- Hover effects
- Click animations

📱 **Perfect Responsive**
- Mobile first
- Tablet optimized
- Desktop enhanced

### Component Architecture

```
FileUpload → Upload PDFs with drag & drop
QueryForm → Ask questions with validation
AnswerDisplay → Beautiful answer presentation
ParallaxBackground → Dynamic floating elements
Header → Animated header with gradients
FeatureCards → Feature showcase
```

---

## 🔧 Configuration

### Backend API (already configured)

`api_routes.py` provides:
- `/api/upload` - File upload endpoint
- `/api/query` - Question answering endpoint
- `/api/health` - Health check

### CORS (already added to main.py)

Allows React frontend on localhost:3000 to connect to backend on localhost:8000

---

## 🎯 Functionality Comparison
React provides a richer UX with drag & drop uploads, real-time progress, smooth animations, and excellent performance — while backend functionality remains 100% the same. ✅

---

## 🎬 Run the App

### Terminal 1: Backend
```bash
python -m uvicorn main:app --reload --port 8000
```

### Terminal 2: Inngest
```bash
npx inngest-cli@latest dev
```

### Terminal 3: React
```bash
cd frontend-react && npm run dev
# Runs on http://localhost:3000
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9  # Mac/Linux
# or change port
uvicorn main:app --port 8001
```

**Qdrant not found:**
```bash
# Install Qdrant
docker pull qdrant/qdrant
docker run -p 6333:6333 qdrant/qdrant
```

### React Issues

**Port 3000 in use:**
```bash
# React will ask to use 3001 automatically
# or manually:
npm run dev -- -p 3001
```

**Dependencies error:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

**CORS errors:**
- Make sure backend is running
- Check CORS middleware in main.py
- Verify API URL in components (localhost:8000)

---

## 📊 API Endpoints

### Upload PDF
```javascript
POST http://localhost:8000/api/upload
Content-Type: multipart/form-data
Body: { file: File }

Response: {
  filename: string,
  file_id: string,
  status: string,
  message: string
}
```

### Query Documents
```javascript
POST http://localhost:8000/api/query
Content-Type: application/json
Body: { question: string, top_k: number }

Response: {
  answer: string,
  sources: string[],
  num_contexts: number
}
```

---

## ✅ Verification Checklist

- [ ] Python backend running on :8000
- [ ] Inngest dev server running on :8288
- [ ] React frontend running on :3000
- [ ] Can upload PDF successfully
- [ ] Can query and get answers
- [ ] Animations working smoothly
- [ ] No console errors

---

## 🎨 Customization

### Change Colors (tailwind.config.ts)

```typescript
colors: {
  primary: {
    500: '#8b5cf6',  // Change this!
    // ...
  }
}
```

### Modify API URL

In components, change:
```typescript
axios.post('http://localhost:8000/api/...', ...)
```

### Add Features

Components are modular - easy to extend!

---

## 🚀 Deployment

### Backend
- Deploy to Vercel, Railway, or Render
- Set environment variables
- Configure CORS for production domain

### Frontend
- `npm run build`
- Deploy to Vercel (recommended)
- Update API URL to production backend

---

## 💡 Tips
1. **Development**: Use the React frontend for the best experience
2. **Production**: Deploy React for end users
3. **Backend**: No changes needed for the frontend choice

---

## 🎉 Summary

You now have a **professional, modern React frontend** with all the latest features while keeping your backend **exactly the same**!

**No functionality lost** - **Tons of features gained**! 🚀

Enjoy your upgraded RAG AI Agent! ✨

