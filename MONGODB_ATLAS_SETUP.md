# MongoDB Atlas Setup Guide

Complete guide to connect your Malta Trip Buddy app to MongoDB Atlas cloud database.

## 📋 Prerequisites

✅ MongoDB Atlas account created
✅ Cluster created and running

## 🔐 Step 1: Get Your Connection String

### From MongoDB Atlas Dashboard:

1. **Log in to MongoDB Atlas**: https://cloud.mongodb.com
2. **Find your cluster** (should be listed on the dashboard)
3. Click **"Connect"** button on your cluster
4. Choose **"Connect your application"**
5. Select:
   - **Driver**: Python
   - **Version**: 3.12 or later
6. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Important Notes:
- Replace `<username>` with your actual MongoDB username
- Replace `<password>` with your actual MongoDB password
- **DO NOT** include `<` and `>` characters

### Example:
If your username is `maltauser` and password is `MyPass123`:
```
mongodb+srv://maltauser:MyPass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

## 📝 Step 2: Create/Update .env File

Create a file named `.env` in your `malta-trip-buddy` directory:

**Location:** `c:\malta trip\malta-trip-buddy\.env`

**Content:**
```env
# MongoDB Atlas Connection
MONGO_URL=mongodb+srv://<your-username>:<your-password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGO_DB=malta_trip_buddy

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production-malta2024
JWT_ALGORITHM=HS256
```

### Replace:
- `<your-username>` - Your MongoDB Atlas username
- `<your-password>` - Your MongoDB Atlas password
- `cluster0.xxxxx.mongodb.net` - Your actual cluster address
- `JWT_SECRET` - Change to a random secure string

### Example .env file:
```env
MONGO_URL=mongodb+srv://maltauser:MyPass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
MONGO_DB=malta_trip_buddy
JWT_SECRET=malta-secret-key-2024-super-secure-random-string
JWT_ALGORITHM=HS256
```

## 🔒 Step 3: Configure Network Access

MongoDB Atlas requires you to whitelist IP addresses:

1. In MongoDB Atlas Dashboard, click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Choose one option:
   - **For Development:** Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - **For Production:** Add your specific IP address
4. Click **"Confirm"**

**⚠️ Security Note:** "Allow Access from Anywhere" is convenient for development but less secure. For production, use specific IPs.

## 👤 Step 4: Create Database User (if needed)

If you haven't created a database user:

1. Click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - **Username**: `maltauser` (or your choice)
   - **Password**: Create a strong password
5. **Database User Privileges**: Select **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

**💡 Important:** Remember this username and password for your connection string!

## ✅ Step 5: Test the Connection

### Option 1: Quick Test Script

Create this test file in your project root:

**File:** `malta-trip-buddy/test_mongodb_atlas.py`

```python
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

async def test_connection():
    # Load environment variables
    load_dotenv()
    
    mongo_url = os.getenv("MONGO_URL")
    mongo_db = os.getenv("MONGO_DB")
    
    print(f"Testing connection to: {mongo_url[:50]}...")
    
    try:
        # Create client
        client = AsyncIOMotorClient(mongo_url)
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        
        # Get database
        db = client[mongo_db]
        
        # List collections
        collections = await db.list_collection_names()
        print(f"📚 Database: {mongo_db}")
        print(f"📋 Collections: {collections if collections else 'No collections yet'}")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print("\n💡 Troubleshooting tips:")
        print("1. Check your connection string in .env")
        print("2. Verify username and password are correct")
        print("3. Check Network Access in MongoDB Atlas")
        print("4. Make sure cluster is running")

if __name__ == "__main__":
    asyncio.run(test_connection())
```

**Run the test:**
```powershell
cd "c:\malta trip\malta-trip-buddy"
.\venv\Scripts\Activate.ps1
python test_mongodb_atlas.py
```

### Option 2: Test with Backend Server

```powershell
cd "c:\malta trip\malta-trip-buddy"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

If it starts without errors, the connection works! Visit http://127.0.0.1:8000/docs

## 🌱 Step 6: Seed Your Database

Once connected, add initial data:

```powershell
cd "c:\malta trip\malta-trip-buddy"
.\venv\Scripts\Activate.ps1
python seed_places.py
```

This will add the 4 Malta locations to your database.

## 🔍 Step 7: Verify Data in MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. Click **"Browse Collections"** on your cluster
3. You should see:
   - Database: `malta_trip_buddy`
   - Collections: `places`, `users` (after first registration)

## 🚀 Step 8: Run Your Application

### Start Backend:
```powershell
cd "c:\malta trip\malta-trip-buddy"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Start Frontend (new terminal):
```powershell
cd "c:\malta trip\malta-trip-buddy\frontend"
npm run dev
```

### Test Everything:
1. Visit http://localhost:5173
2. Click **"Create one"** to register
3. Enter email and password
4. Register successfully
5. Login with your credentials
6. See the dashboard!

## 🐛 Common Issues & Solutions

### Issue 1: "Authentication failed"
**Solution:** 
- Check username/password in connection string
- Make sure there are no special characters that need URL encoding
- Verify the user exists in Database Access

### Issue 2: "Connection timeout"
**Solution:**
- Check Network Access settings
- Add "Allow Access from Anywhere" (0.0.0.0/0)
- Wait a few minutes for changes to propagate

### Issue 3: "Database user not found"
**Solution:**
- Create a database user in Database Access
- Make sure user has "Atlas admin" or "Read and write" privileges

### Issue 4: Special characters in password
If your password has special characters (!, @, #, $, etc.), you need to URL encode them:

**URL Encoding:**
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `^` → `%5E`
- `&` → `%26`
- `*` → `%2A`

Example: Password `MyP@ss!123` becomes `MyP%40ss%21123`

### Issue 5: ".env file not loaded"
**Solution:**
- Make sure `.env` is in the root directory (`malta-trip-buddy/.env`)
- Check that `python-dotenv` is installed: `pip install python-dotenv`
- Restart your terminal/server after creating .env

## 📊 Monitor Your Database

### In MongoDB Atlas:
1. **Metrics Tab**: See database usage, operations, connections
2. **Collections Tab**: Browse and edit data directly
3. **Logs Tab**: View connection logs and errors

### Useful Queries (in Atlas Collections):

**View all users:**
```javascript
db.users.find({})
```

**View all places:**
```javascript
db.places.find({})
```

**Count documents:**
```javascript
db.users.countDocuments({})
db.places.countDocuments({})
```

## 🔐 Security Best Practices

1. **Never commit .env file to Git**
   - Already in `.gitignore`
   - Contains sensitive credentials

2. **Use strong passwords**
   - Mix of letters, numbers, symbols
   - At least 12 characters

3. **Rotate credentials regularly**
   - Change database passwords periodically
   - Update JWT_SECRET in production

4. **Limit IP access in production**
   - Don't use "Allow from anywhere"
   - Whitelist specific server IPs

5. **Use separate databases for dev/prod**
   - Development: `malta_trip_buddy_dev`
   - Production: `malta_trip_buddy_prod`

## ✅ Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created with password
- [ ] Network access configured (IP whitelisted)
- [ ] Connection string copied
- [ ] .env file created with correct values
- [ ] Test script runs successfully
- [ ] Backend starts without errors
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Data appears in MongoDB Atlas Collections

## 🎉 Next Steps

Once connected successfully:

1. **Register your first user** through the frontend
2. **Check MongoDB Atlas** to see user data
3. **Test login** with registered credentials
4. **Add more places** by modifying `seed_places.py`
5. **Start building features** (recommendations, favorites, etc.)

## 📚 Additional Resources

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Connection Troubleshooting: https://docs.atlas.mongodb.com/troubleshoot-connection/
- Motor (Python MongoDB Driver): https://motor.readthedocs.io/

---

Need help? Check the troubleshooting section or review the error messages in your terminal!
