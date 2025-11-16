# ⚡ Quick Start - Deploy in 15 Minutes

## TL;DR - Fastest Way

1. **Qdrant**: https://cloud.qdrant.io → Create cluster → Copy URL & API key
2. **Backend**: https://render.com → New Web Service → Connect GitHub → Add env vars → Deploy
3. **Frontend**: https://vercel.com → Import GitHub → Set root to `frontend-react` → Add `NEXT_PUBLIC_API_URL` → Deploy
4. **Done!** 🎉

---

## Environment Variables Needed

### Backend (Render):
```
OPENAI_API_KEY=sk-...
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-key
PORT=10000
```

### Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### After Frontend Deploys (Render):
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## Commands Reference

**Backend Start Command (Render):**
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Backend Build Command (Render):**
```
pip install -r requirements.txt
```

**Frontend Root Directory (Vercel):**
```
frontend-react
```

---

## Links You'll Need

- Render: https://render.com
- Vercel: https://vercel.com
- Qdrant Cloud: https://cloud.qdrant.io
- OpenAI: https://platform.openai.com

---

**For detailed steps, see `EASY_DEPLOY.md`**

