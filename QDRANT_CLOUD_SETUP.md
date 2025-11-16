# 🔧 Qdrant Cloud Setup Guide

## ✅ What's Been Updated

Your `vector_db.py` now supports Qdrant Cloud with API key authentication! It will automatically:
- Use `QDRANT_URL` from environment variables
- Use `QDRANT_API_KEY` from environment variables
- Fall back to localhost if not set

---

## 📝 Setup Instructions

### Step 1: Get Your Actual Cluster URL

Your Qdrant Cloud cluster URL should look like:
```
https://xxxxx-xxxxx-xxxxx.qdrant.io
```

**NOT** `https://<waiting-for-cluster-host>:6333`

The format is:
- ✅ `https://your-cluster-id.qdrant.io` (no port needed)
- ❌ `https://<waiting-for-cluster-host>:6333` (placeholder)

### Step 2: Update Your .env File

Add these to your `.env` file:

```bash
# Qdrant Cloud Configuration
QDRANT_URL=https://your-actual-cluster-id.qdrant.io
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.IL09Gc9_lakfX2LV21l86inaXCx8BJMj8b7C-LNJlH8
```

**Important**: 
- Replace `your-actual-cluster-id` with your real cluster hostname
- Remove `:6333` port (not needed for cloud)
- Use `https://` not `http://`

### Step 3: Find Your Cluster URL

1. Go to https://cloud.qdrant.io
2. Log in to your account
3. Click on your cluster
4. Look for "Cluster URL" or "Endpoint"
5. It should look like: `https://abc123-def456-ghi789.qdrant.io`

### Step 4: Test Connection

Once you have the correct URL, run:

```bash
python test_qdrant_connection.py
```

This will:
- ✅ Test the connection
- ✅ List all collections
- ✅ Show collection statistics
- ✅ Verify everything is working

---

## 🔍 Quick Test Script

You can also test directly in Python:

```python
from qdrant_client import QdrantClient
import os
from dotenv import load_dotenv

load_dotenv()

# Get from .env file
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

# Initialize client
qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

# Test connection
print("Testing connection...")
collections = qdrant_client.get_collections()
print(f"✅ Connected! Found {len(collections.collections)} collection(s)")
```

---

## 🚀 Using in Your App

Your app will automatically use Qdrant Cloud when you set the environment variables:

```python
from vector_db import QdrantStorage

# Automatically uses QDRANT_URL and QDRANT_API_KEY from .env
storage = QdrantStorage()  # No parameters needed!

# Or override if needed:
storage = QdrantStorage(
    url="https://your-cluster.qdrant.io",
    api_key="your-api-key"
)
```

---

## ⚠️ Common Issues

### Issue 1: "Connection refused"
- **Solution**: Check your `QDRANT_URL` includes `https://`
- **Solution**: Remove `:6333` port from URL
- **Solution**: Verify cluster is active in Qdrant Cloud dashboard

### Issue 2: "Unauthorized" or "Invalid API key"
- **Solution**: Verify your API key is correct
- **Solution**: Check if API key has expired
- **Solution**: Regenerate API key in Qdrant Cloud dashboard

### Issue 3: "Host not found"
- **Solution**: Verify cluster hostname is correct
- **Solution**: Check cluster status in dashboard
- **Solution**: Ensure cluster is not paused

---

## 📋 Environment Variables for Production

When deploying to Render/Railway, add these environment variables:

```
QDRANT_URL=https://your-cluster-id.qdrant.io
QDRANT_API_KEY=your-api-key-here
```

**Note**: Never commit your `.env` file or API keys to GitHub!

---

## ✅ Verification Checklist

- [ ] Cluster URL is correct (no placeholder, no port)
- [ ] API key is set in `.env` file
- [ ] `test_qdrant_connection.py` runs successfully
- [ ] Collections can be listed
- [ ] Ready for production deployment

---

## 🎉 Next Steps

Once connection is verified:
1. Your app will automatically use Qdrant Cloud
2. No code changes needed
3. Ready to deploy!

Test your connection and let me know if you need help! 🚀

