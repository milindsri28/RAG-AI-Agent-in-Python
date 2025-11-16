# 🚀 Deployment Guide

## Pre-Deployment Checklist

✅ **Completed:**
- Removed unused dependencies (streamlit)
- Fixed Python version requirement (3.11+)
- Added missing dependencies (requests)
- Code linting passed
- All files structured correctly

⚠️ **Before Deploying:**

1. **Update CORS in `main.py`** - Add your production frontend URL
2. **Update API URLs in frontend** - Replace `localhost:8000` with production backend URL
3. **Set Environment Variables:**
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `INNGEST_API_BASE` - Inngest API base URL (if using cloud)
   - `QDRANT_URL` - Qdrant database URL (if using cloud)

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Frontend Deployment:
```bash
cd frontend-react
npm run build
# Deploy via Vercel CLI or GitHub integration
vercel --prod
```

**Environment Variables in Vercel:**
- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., `https://your-backend.railway.app`)

#### Backend Deployment:
Deploy to Railway, Render, or similar:
- Set startup command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add environment variables

### Option 2: Railway (Full Stack)

1. Connect GitHub repository
2. Add services:
   - **Backend Service**: Python app
   - **Frontend Service**: Node.js app (from `frontend-react` folder)
3. Set environment variables for each service

### Option 3: Render

#### Backend:
- New Web Service
- Build: `pip install -r requirements.txt` (or use `uv sync`)
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Frontend:
- New Static Site
- Build: `cd frontend-react && npm install && npm run build`
- Publish: `frontend-react/.next`

## Required Changes for Production

### 1. Update CORS in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-frontend-domain.vercel.app",  # Add your production URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Update Frontend API URLs:

Create `frontend-react/.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

Then update components to use:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

### 3. Qdrant Setup:

**Option A: Local Qdrant (Development)**
```bash
docker run -p 6333:6333 qdrant/qdrant
```

**Option B: Qdrant Cloud (Production)**
- Sign up at https://cloud.qdrant.io
- Get cluster URL and API key
- Update `vector_db.py` to use cloud URL

### 4. Inngest Setup:

**Development:**
```bash
npx inngest-cli@latest dev
```

**Production:**
- Sign up at https://www.inngest.com
- Get production API key
- Update `main.py` to use production Inngest client

## Environment Variables Summary

### Backend:
- `OPENAI_API_KEY` - Required
- `INNGEST_API_BASE` - Optional (defaults to localhost)
- `QDRANT_URL` - Optional (defaults to localhost:6333)
- `PORT` - Set by hosting platform

### Frontend:
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Post-Deployment

1. Test all endpoints
2. Verify file uploads work
3. Test query functionality
4. Check CORS is working
5. Monitor logs for errors

## Troubleshooting

**CORS Errors:**
- Ensure frontend URL is in CORS allow_origins
- Check backend is accessible from frontend domain

**API Connection Errors:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend is running and accessible

**Qdrant Connection:**
- Verify Qdrant is running (local) or URL is correct (cloud)
- Check network connectivity

