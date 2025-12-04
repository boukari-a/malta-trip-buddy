import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

async def test_connection():
    # Load environment variables
    load_dotenv()
    
    mongo_url = os.getenv("MONGO_URL")
    mongo_db = os.getenv("MONGO_DB")
    
    if not mongo_url:
        print("❌ MONGO_URL not found in .env file!")
        print("💡 Create a .env file with your MongoDB Atlas connection string")
        return
    
    print("=" * 60)
    print("🧪 Testing MongoDB Atlas Connection")
    print("=" * 60)
    print(f"📍 Connection: {mongo_url[:50]}...")
    print(f"📚 Database: {mongo_db}")
    print()
    
    try:
        # Create client
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        
        # Test connection with ping
        print("⏳ Connecting to MongoDB Atlas...")
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        print()
        
        # Get database
        db = client[mongo_db]
        
        # List collections
        collections = await db.list_collection_names()
        print(f"📋 Collections in '{mongo_db}':")
        if collections:
            for collection in collections:
                count = await db[collection].count_documents({})
                print(f"   - {collection}: {count} documents")
        else:
            print("   No collections yet (this is normal for a new database)")
        
        print()
        print("=" * 60)
        print("🎉 Connection test successful!")
        print("=" * 60)
        print("Next steps:")
        print("1. Run: python seed_places.py")
        print("2. Start backend: uvicorn app.main:app --reload")
        print("3. Start frontend: cd frontend && npm run dev")
        
        client.close()
        
    except Exception as e:
        print()
        print("=" * 60)
        print("❌ Connection failed!")
        print("=" * 60)
        print(f"Error: {str(e)}")
        print()
        print("💡 Troubleshooting tips:")
        print("=" * 60)
        print("1. Check your .env file:")
        print("   - Make sure MONGO_URL is correct")
        print("   - Username and password must be correct")
        print("   - No < > brackets in the connection string")
        print()
        print("2. In MongoDB Atlas Dashboard:")
        print("   - Network Access: Add your IP or allow from anywhere")
        print("   - Database Access: Verify user exists with correct permissions")
        print("   - Cluster: Make sure it's running (not paused)")
        print()
        print("3. Special characters in password:")
        print("   - Encode special chars: ! → %21, @ → %40, # → %23")
        print()
        print("4. Wait a few minutes:")
        print("   - Changes in Atlas can take 1-2 minutes to propagate")
        print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_connection())
