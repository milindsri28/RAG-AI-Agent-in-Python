# 🚀 Easy Deployment Guide - Step by Step

Follow these steps to deploy your RAG AI Agent in **15 minutes**!

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] GitHub account
- [ ] OpenAI API key (get from https://platform.openai.com)
- [ ] Qdrant Cloud account (free at https://cloud.qdrant.io)
- [ ] All your code pushed to GitHub

---

## 🎯 Deployment Strategy (Easiest)

**Frontend**: Vercel (Free, Automatic)  
**Backend**: Render (Free, Simple)  
**Database**: Qdrant Cloud (Free)

---

## Step 1: Setup Qdrant Cloud (5 minutes)

1. Go to https://cloud.qdrant.io
2. Sign up (free)
3. Click "Create Cluster"
4. Choose "Free" plan
5. Wait for cluster to be created
6. Copy these values:
   - **Cluster URL**: `https://xxxxx-xxxxx-xxxxx.qdrant.io`
   - **API Key**: Click "API Keys" → Copy the key

**Save these - you'll need them!**

---

## Step 2: Deploy Backend to Render (5 minutes)

### 2.1 Create Account
1. Go to https://render.com
2. Sign up with GitHub (free)

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your repo: `RAG-AI-Agent-in-Python`

### 2.3 Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `rag-ai-backend` (or any name you like)
- **Region**: Choose closest to you
- **Branch**: `main` (or your branch)
- **Root Directory**: Leave empty (root of repo)
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Plan:**
- Select **Free** plan

### 2.4 Add Environment Variables
Click "Advanced" → "Add Environment Variable" and add:

```
OPENAI_API_KEY = sk-your-openai-key-here
QDRANT_URL = https://your-cluster-id.qdrant.io
QDRANT_API_KEY = your-qdrant-api-key
PORT = 10000
```

**Important**: Replace with your actual values!

### 2.5 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Copy your backend URL: `https://rag-ai-backend.onrender.com`

**Note**: First deployment takes longer. Free tier spins down after 15 min inactivity.

---

## Step 3: Deploy Frontend to Vercel (3 minutes)

### 3.1 Create Account
1. Go to https://vercel.com
2. Sign up with GitHub (free)

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Select: `RAG-AI-Agent-in-Python`

### 3.3 Configure Project
Vercel auto-detects Next.js! Just verify:

**Framework Preset:**
- Should show: `Next.js` ✅

**Root Directory:**
- Click "Edit" → Set to: `frontend-react`

**Build Settings:**
- Build Command: `npm run build` (auto)
- Output Directory: `.next` (auto)
- Install Command: `npm install` (auto)

### 3.4 Add Environment Variable
Click "Environment Variables" → Add:

```
NEXT_PUBLIC_API_URL = https://rag-ai-backend.onrender.com
```

**Important**: Replace with your actual Render backend URL!

### 3.5 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app is live! 🎉

You'll get a URL like: `https://your-app.vercel.app`

---

## Step 4: Update CORS (2 minutes)

After getting your Vercel frontend URL:

1. Go back to Render dashboard
2. Find your backend service
3. Click "Environment" tab
4. Add new variable:

```
FRONTEND_URL = https://your-app.vercel.app
```

5. Update `main.py` CORS (or I can do this for you):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        os.getenv("FRONTEND_URL", ""),  # Your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

6. Redeploy backend (Render auto-redeploys on code changes)

---

## ✅ Verification Checklist

Test your deployment:

- [ ] Frontend loads at Vercel URL
- [ ] Can upload PDF files
- [ ] Can ask questions
- [ ] Gets AI responses
- [ ] No CORS errors in browser console

---

## 🎉 You're Done!

Your app is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://rag-ai-backend.onrender.com`

---

## 🐛 Quick Troubleshooting

### Backend not responding?
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set
- Wait 30-60 seconds (free tier cold start)

### CORS errors?
- Verify `FRONTEND_URL` is set in Render
- Check `NEXT_PUBLIC_API_URL` in Vercel matches backend URL
- Ensure CORS in `main.py` includes your Vercel URL

### Frontend can't connect?
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running (check Render dashboard)
- Test backend directly: `https://your-backend.onrender.com/api/health`

---

## 💡 Pro Tips

1. **Custom Domain**: Add your domain in Vercel (free)
2. **Monitor Usage**: Check Render dashboard for resource usage
3. **Auto-Deploy**: Both platforms auto-deploy on git push
4. **Environment Variables**: Update in dashboard, no code changes needed

---

## 📞 Need Help?

If something doesn't work:
1. Check the logs in Render/Vercel dashboard
2. Verify all environment variables are set
3. Test backend health endpoint
4. Check browser console for errors

---

**That's it! Your app is deployed and ready to use! 🚀**

