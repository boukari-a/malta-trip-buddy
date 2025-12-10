# Profile Page Fix - INSTRUCTIONS

## The Problem
The authentication token wasn't being saved to localStorage properly, causing 401 Unauthorized errors.

## What Was Fixed
1. ✅ Login.jsx now saves token to localStorage
2. ✅ App.jsx loads token from localStorage on startup  
3. ✅ Profile.jsx improved error handling
4. ✅ Logout properly clears localStorage

## IMPORTANT: You MUST Follow These Steps

### Step 1: Clear Old Data
Open your browser console (F12) and run:
```javascript
localStorage.clear();
```
OR simply **Logout** if you see a logout button.

### Step 2: Close and Reopen Browser
Completely close your browser and reopen it to ensure clean state.

### Step 3: Login Again
1. Go to http://localhost:5174
2. Enter your credentials and login
3. The token will NOW be properly saved to localStorage

### Step 4: Test Profile Page
1. Click on "Profile" in the navigation
2. Your profile should load (or show empty form if new)
3. Fill in your details
4. Click "Save Profile"
5. Data should save successfully!

## How to Verify It's Working

Open browser console (F12) and check:
```javascript
console.log(localStorage.getItem("token"));
```
You should see a JWT token string. If it's `null`, you're not logged in.

## Common Issues

**Still getting 401 errors?**
- Make sure you cleared localStorage and logged in fresh
- Check that backend is running on http://127.0.0.1:8000
- Verify your login credentials are correct

**Profile not saving?**
- Make sure you're logged in (check token in localStorage)
- Check browser console for specific error messages
- Backend must be running

## Backend Status
Backend server should be running at: http://127.0.0.1:8000
Frontend should be at: http://localhost:5174

If backend isn't running, start it with:
```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
