# Code Fixes Required

This document lists the critical fixes needed to make the Malta Trip Buddy application fully functional.

## Critical Fixes

### 1. Fix app/main.py - Add Missing Routes and CORS

**Current Code:**
```python
from fastapi import FastAPI
from app.routes import auth, users

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
```

**Fixed Code:**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users, places

app = FastAPI(title="Malta Trip Buddy API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(places.router)

@app.get("/")
def root():
    return {"message": "Welcome to Malta Trip Buddy API"}
```

### 2. Create app/routes/users.py - Implement User Endpoints

**File:** `app/routes/users.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from ..database import db
from ..utils.deps import get_current_user
from ..schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserOut)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current logged-in user information"""
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"]
    }
```

### 3. Create app/utils/deps.py - Add Authentication Dependency

**File:** `app/utils/deps.py`

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..database import db
from .jwt_handler import decode_token
from bson import ObjectId

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependency to get the current authenticated user from JWT token
    """
    token = credentials.credentials
    user_id = decode_token(token)
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID",
        )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return user
```

### 4. Update app/config.py - Use Environment Variables Properly

**Current Code:**
```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    MONGO_URL: str = "mongodb://localhost:27017"
    MONGO_DB: str = "malta_trip_buddy"
    JWT_SECRET: str = "supersecretkey"
    JWT_ALGORITHM: str = "HS256"

settings = Settings()
```

**Fixed Code:**
```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    MONGO_URL: str = "mongodb://localhost:27017"
    MONGO_DB: str = "malta_trip_buddy"
    JWT_SECRET: str = "supersecretkey-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

**Note:** If using Pydantic v1.x (as in requirements.txt), keep `BaseSettings` from `pydantic`. If upgrading to v2.x, use `pydantic_settings`.

### 5. Update requirements.txt - Add Missing Dependencies

Add to `requirements.txt`:
```
python-multipart==0.0.6
```

This is needed for form data handling.

### 6. Create .env File

**File:** `.env` (in malta-trip-buddy directory)

```env
MONGO_URL=mongodb://localhost:27017
MONGO_DB=malta_trip_buddy
JWT_SECRET=your-super-secret-key-change-this-please
JWT_ALGORITHM=HS256
```

### 7. Update frontend/src/api.js - Fix Duplicate Export

**Current Issue:** There are two api.js files (src/api.js and src/services/api.js)

**Solution:** Keep only one and ensure it's properly structured:

**File:** `frontend/src/api.js`

```javascript
const BASE_URL = "http://127.0.0.1:8000";

export async function register(email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Registration failed");
  }

  return await response.json();
}

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  return await response.json();
}

export async function getCurrentUser(token) {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) throw new Error("Failed to get current user");

  return await response.json();
}

export async function getPlaces() {
  const response = await fetch(`${BASE_URL}/places/`);

  if (!response.ok) throw new Error("Failed to fetch places");

  return await response.json();
}
```

Then delete `frontend/src/services/api.js` (duplicate).

## Optional Improvements

### 8. Add Registration Page to Frontend

**File:** `frontend/src/Register.jsx`

```jsx
import { useState } from "react";
import { register } from "./api";

export default function Register({ onRegisterSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      await register(email, password);
      setSuccess(true);
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return <div><h2>Registration successful! Redirecting to login...</h2></div>;
  }

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{color: "red"}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
```

### 9. Update App.jsx to Include Registration

```jsx
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (!token) {
    if (showRegister) {
      return (
        <div>
          <Register onRegisterSuccess={() => setShowRegister(false)} />
          <p>
            Already have an account? 
            <button onClick={() => setShowRegister(false)}>Login</button>
          </p>
        </div>
      );
    }
    
    return (
      <div>
        <Login setToken={setToken} />
        <p>
          Don't have an account? 
          <button onClick={() => setShowRegister(true)}>Register</button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome! You are logged in.</h1>
      <p>Your token: {token}</p>
      <button onClick={() => setToken(null)}>Logout</button>
    </div>
  );
}

export default App;
```

### 10. Add Token Persistence (localStorage)

Update `App.jsx` to persist token:

```jsx
import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('auth_token') || null;
  });
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  // ... rest of the code
}

export default App;
```

## Priority Order

1. **Fix app/main.py** - Critical (app won't work without CORS and places route)
2. **Create app/utils/deps.py** - Critical (needed for /users/me endpoint)
3. **Create/Update app/routes/users.py** - Critical (frontend expects this)
4. **Create .env file** - Important (better security)
5. **Fix frontend api.js** - Important (remove duplicates)
6. **Add registration page** - Nice to have
7. **Add token persistence** - Nice to have

## Testing After Fixes

1. Start backend: `uvicorn app.main:app --reload`
2. Visit http://127.0.0.1:8000/docs - should see all endpoints
3. Start frontend: `npm run dev`
4. Test registration and login flow
5. Verify CORS is working (no console errors)
