# ✅ Deployment Checklist

Use this checklist to ensure everything is deployed correctly.

## Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] OpenAI API key ready
- [ ] Qdrant Cloud account created
- [ ] Qdrant cluster URL and API key copied

## Step 1: Qdrant Cloud Setup

- [ ] Signed up at https://cloud.qdrant.io
- [ ] Created free cluster
- [ ] Copied cluster URL (format: `https://xxx-xxx-xxx.qdrant.io`)
- [ ] Copied API key
- [ ] Tested connection (optional: run `python test_qdrant_connection.py`)

## Step 2: Backend Deployment (Render)

- [ ] Created Render account
- [ ] Created new Web Service
- [ ] Connected GitHub repository
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Added environment variable: `OPENAI_API_KEY`
- [ ] Added environment variable: `QDRANT_URL`
- [ ] Added environment variable: `QDRANT_API_KEY`
- [ ] Added environment variable: `PORT=10000`
- [ ] Deployed successfully
- [ ] Copied backend URL (e.g., `https://rag-ai-backend.onrender.com`)
- [ ] Tested backend health: `https://your-backend.onrender.com/api/health`

## Step 3: Frontend Deployment (Netlify)

- [ ] Created Netlify account
- [ ] Imported GitHub repository
- [ ] Set base directory to: `frontend-react`
- [ ] Added environment variable: `NEXT_PUBLIC_API_URL` = your Render backend URL
- [ ] Deployed successfully
- [ ] Copied frontend URL (e.g., `https://your-app.netlify.app`)

## Step 4: Final Configuration

- [ ] Added `FRONTEND_URL` environment variable in Render (your Netlify URL)
- [ ] Backend redeployed (auto or manual)
- [ ] CORS updated automatically

## Testing

- [ ] Frontend loads correctly
- [ ] Can upload PDF file
- [ ] File uploads successfully
- [ ] Can ask questions
- [ ] Gets AI responses
- [ ] No console errors
- [ ] No CORS errors

## Post-Deployment

- [ ] Bookmarked frontend URL
- [ ] Shared with team/users
- [ ] Monitored first few requests
- [ ] Checked Render logs for errors
- [ ] Verified all features work

---

## 🎉 Deployment Complete!

If all items are checked, your app is successfully deployed! 🚀

---

## Quick Links

- **Frontend**: https://your-app.netlify.app
- **Backend**: https://rag-ai-backend.onrender.com
- **Render Dashboard**: https://dashboard.render.com
- **Netlify Dashboard**: https://app.netlify.com
- **Qdrant Dashboard**: https://cloud.qdrant.io

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Backend not responding | Check Render logs, wait 30-60s for cold start |
| CORS errors | Verify FRONTEND_URL in Render matches Netlify URL |
| Frontend can't connect | Check NEXT_PUBLIC_API_URL in Netlify, redeploy if changed |
| Upload fails | Check backend logs, verify Qdrant connection |
| No AI responses | Verify OPENAI_API_KEY is set correctly |

---

**Need help? Check `EASY_DEPLOY.md` for detailed steps!**

