# 🆓 FREE Deployment Guide (0 Rupees!)

This guide will help you deploy your RAG AI Agent **completely FREE** using free tiers of various services.

## 📋 Free Services We'll Use

1. **Frontend**: Vercel (Free Forever) ✅
2. **Backend**: Render or Railway (Free Tier) ✅
3. **Vector DB**: Qdrant Cloud (Free Tier) ✅
4. **Workflow**: Inngest Cloud (Free Tier) ✅
5. **AI**: OpenAI (Pay-as-you-go, ~$5-10/month) 💰

**Total Cost: ~$5-10/month** (only for OpenAI API calls)

---

## 🚀 Step-by-Step Deployment

### Step 1: Setup Qdrant Cloud (Free Tier)

1. Go to https://cloud.qdrant.io
2. Sign up for free account
3. Create a new cluster (Free tier: 1GB storage)
4. Copy your cluster URL and API key
5. Save these for later:
   - `QDRANT_URL`: `https://your-cluster-id.qdrant.io`
   - `QDRANT_API_KEY`: `your-api-key`

### Step 2: Setup Inngest Cloud (Free Tier)

1. Go to https://www.inngest.com
2. Sign up for free account
3. Create a new app
4. Get your:
   - `INNGEST_EVENT_KEY`: Your event key
   - `INNGEST_SIGNING_KEY`: Your signing key
5. Update `main.py` to use production Inngest:
   ```python
   inngest_client = inngest.Inngest(
       app_id="rag_app",
       is_production=True,  # Change to True
   )
   ```

### Step 3: Deploy Backend to Render (Free)

1. Go to https://render.com
2. Sign up (free)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `rag-ai-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt` (or `uv sync`)
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
6. Add Environment Variables:
   ```
   OPENAI_API_KEY=your_openai_key
   QDRANT_URL=https://your-cluster.qdrant.io
   QDRANT_API_KEY=your_qdrant_key
   INNGEST_EVENT_KEY=your_inngest_key
   INNGEST_SIGNING_KEY=your_signing_key
   PORT=10000
   ```
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy your backend URL: `https://rag-ai-backend.onrender.com`

**Note**: Free tier spins down after 15 min inactivity. First request may take 30-60 seconds.

### Step 4: Deploy Frontend to Vercel (Free Forever)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend-react`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
6. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://rag-ai-backend.onrender.com
   ```
7. Click "Deploy"
8. Wait 2-3 minutes
9. Your app is live! 🎉

### Step 5: Update CORS in Backend

After getting your frontend URL, update `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-app.vercel.app",  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Redeploy backend after this change.

---

## 🔄 Alternative: Railway (Full Stack)

Railway offers a better free tier with no spin-down:

### Backend on Railway:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add service → "Empty Service"
6. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables (same as Render)
8. Railway auto-deploys!

### Frontend on Railway:

1. In same project, add another service
2. Select `frontend-react` folder
3. Railway auto-detects Next.js
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

**Railway Free Tier**: $5 credit/month (usually enough for small apps)

---

## 📝 Environment Variables Summary

### Backend (.env or Platform Settings):
```bash
OPENAI_API_KEY=sk-...
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-key
INNGEST_EVENT_KEY=your-key
INNGEST_SIGNING_KEY=your-key
PORT=10000  # Render sets this automatically
```

### Frontend (Vercel/Railway):
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## 🎯 Quick Deploy Commands

### Option 1: Render + Vercel (Recommended)

**Backend (Render):**
1. Connect GitHub repo
2. Set build/start commands
3. Add env vars
4. Deploy

**Frontend (Vercel):**
1. Import GitHub repo
2. Set root to `frontend-react`
3. Add `NEXT_PUBLIC_API_URL`
4. Deploy

### Option 2: Railway (All-in-One)

1. Create new project
2. Add backend service
3. Add frontend service
4. Configure both
5. Deploy

---

## ⚠️ Free Tier Limitations

### Render:
- ✅ Free forever
- ⚠️ Spins down after 15 min inactivity
- ⚠️ First request after spin-down: 30-60s delay
- ✅ 750 hours/month free

### Railway:
- ✅ $5 credit/month (usually free for small apps)
- ✅ No spin-down
- ✅ Faster cold starts
- ⚠️ May need to upgrade for heavy usage

### Vercel:
- ✅ Free forever
- ✅ No spin-down
- ✅ Global CDN
- ✅ Unlimited bandwidth
- ✅ Perfect for Next.js

### Qdrant Cloud:
- ✅ 1GB free storage
- ✅ 1 cluster free
- ✅ Perfect for small-medium apps

### Inngest:
- ✅ Free tier available
- ✅ Sufficient for most use cases

---

## 🐛 Troubleshooting

### Backend won't start:
- Check environment variables are set
- Verify Qdrant URL is accessible
- Check logs in Render/Railway dashboard

### CORS errors:
- Ensure frontend URL is in CORS allow_origins
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running

### Slow first request (Render):
- Normal for free tier (cold start)
- Consider Railway for faster starts
- Or upgrade Render plan

### Qdrant connection failed:
- Verify QDRANT_URL includes `https://`
- Check API key is correct
- Ensure cluster is active

---

## 💡 Pro Tips

1. **Use Railway for backend** if you want no spin-down
2. **Use Vercel for frontend** - best free tier for Next.js
3. **Monitor OpenAI usage** - set budget alerts
4. **Use Qdrant Cloud** - easier than self-hosting
5. **Test locally first** - use `.env` file

---

## 🎉 You're Done!

Your app should now be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Total cost: **$0** (except OpenAI API usage) 🎊

---

## 📚 Next Steps

1. Test all features
2. Set up custom domain (optional)
3. Monitor usage
4. Scale as needed

Enjoy your free deployment! 🚀

