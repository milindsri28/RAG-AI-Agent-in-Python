"""
Test script to verify Qdrant Cloud connection
Run this to test your Qdrant Cloud setup
"""

from qdrant_client import QdrantClient
import os
from dotenv import load_dotenv

load_dotenv()

# Get credentials from environment variables
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

# If not in .env, you can set them here temporarily for testing:
# QDRANT_URL = "https://your-cluster-id.qdrant.io"  # Replace with your actual cluster URL
# QDRANT_API_KEY = "your-api-key-here"  # Replace with your actual API key

if not QDRANT_URL:
    print("❌ QDRANT_URL not found in environment variables!")
    print("💡 Add QDRANT_URL to your .env file or set it in this script")
    exit(1)

if not QDRANT_API_KEY:
    print("❌ QDRANT_API_KEY not found in environment variables!")
    print("💡 Add QDRANT_API_KEY to your .env file or set it in this script")
    exit(1)

print("🔍 Testing Qdrant Cloud Connection...")
print(f"URL: {QDRANT_URL}")
print(f"API Key: {QDRANT_API_KEY[:20]}..." if QDRANT_API_KEY else "No API Key")

try:
    # Initialize client
    qdrant_client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )
    
    # Test connection by getting collections
    print("\n📋 Fetching collections...")
    collections = qdrant_client.get_collections()
    
    print(f"✅ Connection successful!")
    print(f"📊 Found {len(collections.collections)} collection(s):")
    
    for collection in collections.collections:
        print(f"  - {collection.name}")
        # Get collection info
        info = qdrant_client.get_collection(collection.name)
        print(f"    Points: {info.points_count}")
        print(f"    Vectors: {info.vectors_count}")
    
    if len(collections.collections) == 0:
        print("  (No collections yet - this is normal for a new cluster)")
    
    print("\n✅ Qdrant Cloud is ready to use!")
    
except Exception as e:
    print(f"\n❌ Connection failed: {e}")
    print("\n💡 Troubleshooting:")
    print("1. Check your QDRANT_URL includes 'https://'")
    print("2. Verify your API key is correct")
    print("3. Ensure your cluster is active in Qdrant Cloud dashboard")
    print("4. Check if your cluster hostname is correct")

