# 🌐 Netlify Deployment Guide

Quick guide for deploying the frontend to Netlify.

---

## 📋 Prerequisites

- Netlify account (free at https://netlify.com)
- GitHub repository with your code
- Backend deployed and URL ready

---

## 🚀 Deploy to Netlify (5 minutes)

### Step 1: Create Account
1. Go to https://netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Netlify

### Step 2: Import Project
1. Click "Add new site" button
2. Select "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository: `RAG-AI-Agent-in-Python`
5. Authorize repository access if needed

### Step 3: Configure Build Settings

Netlify will auto-detect Next.js! Configure these settings:

**Site Settings:**
- **Site name**: Choose a name (e.g., `rag-ai-agent`)
- **Branch to deploy**: `final` (or `main`)

**Build Settings:**
- **Base directory**: `frontend-react`
- **Build command**: `npm run build` (auto-detected)
- **Publish directory**: `.next` (auto-detected)
- **Functions directory**: Leave empty

**Build Environment:**
- Node version: 18.x (auto-detected)

### Step 4: Add Environment Variables

**Before deploying**, scroll down to "Environment variables":

1. Click "Add environment variables"
2. Add variable:
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://your-backend.onrender.com
   ```
3. Replace with your actual Render backend URL

### Step 5: Deploy

1. Click "Deploy site"
2. Wait 2-3 minutes for build
3. Your site is live!

You'll get a URL like: `https://your-site-name.netlify.app`

---

## 🔧 Post-Deployment Configuration

### Update Backend CORS

1. Go to Render dashboard
2. Find your backend service
3. Go to "Environment" tab
4. Add new variable:
   ```
   FRONTEND_URL=https://your-site-name.netlify.app
   ```
5. Save (backend will auto-redeploy)

---

## 🎨 Customize Your Site

### Change Site Name
1. Go to Netlify dashboard
2. Click on your site
3. Go to "Site settings" → "General"
4. Click "Change site name"
5. Enter new name
6. Update `FRONTEND_URL` in Render

### Add Custom Domain
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions
4. Update `FRONTEND_URL` in Render with your domain

---

## 🔄 Auto-Deploy on Git Push

Netlify automatically deploys when you push to your branch:

1. Make changes to your code
2. Commit and push to GitHub
3. Netlify detects changes
4. Automatically rebuilds and deploys

**No manual deployment needed!**

---

## 📊 Monitor Your Deployment

### View Build Logs
1. Go to Netlify dashboard
2. Click on your site
3. Go to "Deploys" tab
4. Click on latest deploy
5. View build logs

### Check Deploy Status
- **Published**: Site is live ✅
- **Building**: In progress 🔄
- **Failed**: Check logs ❌

---

## 🐛 Troubleshooting

### Build Failed?

**Check build logs:**
1. Go to failed deploy
2. Click "Deploy log"
3. Look for error messages

**Common issues:**
- Missing dependencies: Check `package.json`
- Build command error: Verify `npm run build` works locally
- Environment variables: Ensure `NEXT_PUBLIC_API_URL` is set

### Site Not Loading?

1. Check deploy status (should be "Published")
2. Clear browser cache
3. Check browser console for errors
4. Verify `NEXT_PUBLIC_API_URL` is correct

### CORS Errors?

1. Verify `FRONTEND_URL` is set in Render
2. Check it matches your Netlify URL exactly
3. Wait for backend to redeploy
4. Clear browser cache

### Environment Variable Changes Not Working?

After changing environment variables:
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait for rebuild

---

## 💡 Pro Tips

1. **Preview Deploys**: Netlify creates preview URLs for pull requests
2. **Deploy Previews**: Test changes before merging
3. **Rollback**: Easy one-click rollback to previous deploys
4. **Analytics**: Enable Netlify Analytics for visitor insights
5. **Forms**: Can add serverless forms if needed
6. **Functions**: Can add Netlify Functions for serverless backend

---

## ✅ Verification Checklist

- [ ] Site is published and accessible
- [ ] Frontend loads without errors
- [ ] Can upload PDF files
- [ ] Can query documents
- [ ] Gets AI responses
- [ ] No CORS errors in console
- [ ] `FRONTEND_URL` set in Render backend

---

## 🎉 You're Done!

Your frontend is now deployed on Netlify!

**Site URL**: `https://your-site-name.netlify.app`

---

## 📚 Additional Resources

- Netlify Docs: https://docs.netlify.com
- Next.js on Netlify: https://docs.netlify.com/frameworks/next-js/
- Netlify Support: https://answers.netlify.com

---

**Need help? Check the main `EASY_DEPLOY.md` guide!**

