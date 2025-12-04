# Malta Trip Buddy - Setup Guide

## Prerequisites
- Python 3.11+ installed
- Node.js and npm installed
- MongoDB installed and running (or MongoDB Atlas account)

## Backend Setup

### 1. Create Virtual Environment
Open a PowerShell or Command Prompt window and navigate to the project:

```powershell
cd "c:\malta trip\malta-trip-buddy"
python -m venv venv
```

### 2. Activate Virtual Environment

**PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Command Prompt:**
```cmd
venv\Scripts\activate.bat
```

You should see `(venv)` appear in your terminal prompt.

### 3. Install Python Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Set Up Environment Variables
Create a `.env` file in the `malta-trip-buddy` directory:

```env
MONGO_URL=mongodb://localhost:27017
MONGO_DB=malta_trip_buddy
JWT_SECRET=your-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
```

**Important:** Change the `JWT_SECRET` to a secure random string in production!

### 5. Start MongoDB
Make sure MongoDB is running on your system. If using MongoDB locally:

```powershell
mongod
```

Or if you have MongoDB as a Windows service, ensure it's running.

### 6. Seed Database (Optional)
Populate the database with initial places data:

```powershell
python seed_places.py
```

### 7. Run Backend Server
```powershell
uvicorn app.main:app --reload
```

The backend will be available at `http://127.0.0.1:8000`

## Frontend Setup

### 1. Navigate to Frontend Directory
Open a new terminal window:

```powershell
cd "c:\malta trip\malta-trip-buddy\frontend"
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Run Development Server
```powershell
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port shown in the terminal)

## Known Issues & Fixes

### Issue 1: Missing Routes in Backend
The `places` router is not included in `app/main.py`. 

**Fix:** Add this line to `app/main.py`:
```python
from app.routes import auth, users, places  # Add places

app.include_router(places.router)  # Add this line
```

### Issue 2: CORS Error
The backend needs CORS middleware to communicate with the frontend.

**Fix:** Add to `app/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 3: Permission Errors When Installing Packages
This occurs when trying to install packages globally on Windows.

**Solution:** Always use a virtual environment (see steps above)

## Testing the Application

### 1. Test Backend API
Visit `http://127.0.0.1:8000/docs` to see the interactive API documentation (Swagger UI).

### 2. Test Frontend
1. Open `http://localhost:5173` in your browser
2. You should see the login page
3. Register a new user (you'll need to create a registration page or use the API directly)

### 3. Register a User via API
Using the Swagger UI at `http://127.0.0.1:8000/docs`:
1. Go to POST `/auth/register`
2. Click "Try it out"
3. Enter:
   ```json
   {
     "email": "test@example.com",
     "password": "testpassword123"
   }
   ```
4. Click "Execute"

### 4. Login via Frontend
1. Go to the frontend at `http://localhost:5173`
2. Enter the credentials you just created
3. You should be logged in and see your token

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- For MongoDB Atlas, use the full connection string with credentials

### Virtual Environment Not Activating
- On Windows, you may need to allow script execution:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### Port Already in Use
- Backend (8000): Change the port with `uvicorn app.main:app --reload --port 8001`
- Frontend (5173): Vite will automatically try the next available port

## Next Steps

After setup, consider implementing:
1. User profile page
2. Places listing page with filtering
3. Recommendations system
4. Favorites/bookmarks feature
5. Interactive map integration
6. Better UI/UX design

## Documentation

- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/
- MongoDB Docs: https://www.mongodb.com/docs/
- Vite Docs: https://vite.dev/
