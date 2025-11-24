# 🚀 START HERE - Complete Setup Guide

Follow these steps **in order** to get your Malta Trip Buddy app running!

## ✅ Step 1: Create Virtual Environment

Open PowerShell in the malta-trip-buddy folder:

```powershell
cd "c:\malta trip\malta-trip-buddy"
python -m venv venv
```

This creates a new `venv` folder with Python packages.

## ✅ Step 2: Activate Virtual Environment

```powershell
.\venv\Scripts\Activate.ps1
```

**If you get an error** about execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then try activating again.

**Success indicator:** You should see `(venv)` at the start of your terminal line.

## ✅ Step 3: Install Python Dependencies

```powershell
pip install -r requirements.txt
```

Wait for all packages to install (takes 1-2 minutes).

## ✅ Step 4: Create .env File

Create a file named `.env` in the `malta-trip-buddy` folder:

**Windows:**
```powershell
notepad .env
```

**Paste this content** (replace with your MongoDB Atlas details):
```env
MONGO_URL=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGO_DB=malta_trip_buddy
JWT_SECRET=malta-secret-2024-change-this-to-something-random
JWT_ALGORITHM=HS256
```

**Save and close** the file.

### How to get MONGO_URL:
1. Go to https://cloud.mongodb.com
2. Click your cluster → "Connect" → "Connect your application"
3. Copy the connection string
4. Replace `<username>` and `<password>` with your actual MongoDB Atlas credentials

## ✅ Step 5: Configure MongoDB Atlas

### A. Network Access:
1. In MongoDB Atlas, go to **"Network Access"** (left menu)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### B. Database User:
1. Go to **"Database Access"** (left menu)
2. If no user exists, click **"Add New Database User"**
3. Create username and password
4. Set privileges to **"Atlas admin"**
5. Click **"Add User"**

## ✅ Step 6: Test MongoDB Connection

```powershell
python test_mongodb_atlas.py
```

**Expected output:**
```
✅ Successfully connected to MongoDB Atlas!
```

**If it fails:** Check your .env file and MongoDB Atlas settings.

## ✅ Step 7: Seed Database with Places

```powershell
python seed_places.py
```

This adds 4 Malta locations to your database.

## ✅ Step 8: Start Backend Server

```powershell
uvicorn app.main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Keep this terminal open!**

## ✅ Step 9: Start Frontend (New Terminal)

Open a **NEW PowerShell window**:

```powershell
cd "c:\malta trip\malta-trip-buddy\frontend"
npm install
npm run dev
```

**Expected output:**
```
Local: http://localhost:5173/
```

## ✅ Step 10: Test Your App!

1. Open browser: http://localhost:5173
2. Click **"Create one"** to register
3. Enter email: `test@malta.com`
4. Enter password: `malta123`
5. Confirm password: `malta123`
6. Click **"Create Account"**
7. See success message!
8. Login with same credentials
9. **You're in!** 🎉

## 🐛 Troubleshooting

### Issue: "python is not recognized"
**Solution:** Install Python from https://www.python.org/downloads/

### Issue: "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Execution policy error" when activating venv
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: "uvicorn not found" after pip install
**Solution:** Deactivate and reactivate venv:
```powershell
deactivate
.\venv\Scripts\Activate.ps1
```

### Issue: MongoDB connection fails
**Solution:**
1. Check .env file has correct connection string
2. Verify Network Access in MongoDB Atlas
3. Make sure database user exists
4. Wait 1-2 minutes for Atlas changes to propagate

### Issue: CORS error in browser console
**Solution:** Add CORS to `app/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📂 Project Structure

```
malta-trip-buddy/
├── venv/                  # Virtual environment (created in step 1)
├── .env                   # Your config (created in step 4)
├── app/                   # Backend code
│   ├── main.py           # FastAPI app
│   ├── routes/           # API endpoints
│   ├── models/           # Database models
│   └── utils/            # Helper functions
├── frontend/             # React frontend
│   ├── src/
│   │   ├── App.jsx      # Main app
│   │   ├── Login.jsx    # Login page
│   │   └── Register.jsx # Registration page
│   └── package.json
├── requirements.txt      # Python dependencies
└── seed_places.py       # Database seeder

```

## ✅ Success Checklist

- [ ] Virtual environment created (`venv` folder exists)
- [ ] Virtual environment activated (see `(venv)` in terminal)
- [ ] Python packages installed (pip install successful)
- [ ] .env file created with MongoDB connection string
- [ ] MongoDB Atlas network access configured
- [ ] MongoDB Atlas database user created
- [ ] test_mongodb_atlas.py runs successfully
- [ ] seed_places.py adds data
- [ ] Backend starts on http://127.0.0.1:8000
- [ ] Frontend starts on http://localhost:5173
- [ ] Can register new user
- [ ] Can login successfully

## 🎉 Next Steps

Once everything works:
1. **Explore the app** - Beautiful Malta-themed UI!
2. **Check MongoDB Atlas** - See your data in the cloud
3. **Read documentation**:
   - `MONGODB_ATLAS_SETUP.md` - Detailed MongoDB guide
   - `REGISTRATION_COMPLETE.md` - Registration system info
   - `QUICKSTART.md` - Quick reference

## 💡 Quick Commands Reference

**Activate venv:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Start backend:**
```powershell
uvicorn app.main:app --reload
```

**Start frontend:**
```powershell
cd frontend
npm run dev
```

**Deactivate venv:**
```powershell
deactivate
```

---

**Need help?** Check the troubleshooting section above or review error messages carefully!
