from fastapi import APIRouter, HTTPException
from ..database import db
from app.schemas.user import UserCreate, UserLogin, UserOut
from ..utils.hashing import hash_password, verify_password
from ..utils.jwt_handler import create_access_token
from app.database import users_collection
from pymongo.errors import DuplicateKeyError  

from pydantic import BaseModel, EmailStr

router = APIRouter()

# Pydantic model for registration
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

users_collection = db["users"]

@router.post("/register")
async def register(user: UserCreate):
    from datetime import datetime
    hashed_password = hash_password(user.password)
    user_dict = {
        "name": user.name,
        "email": user.email,
        "password_hash": hashed_password,
        "role": "user",  # default role
        "created_at": datetime.utcnow()
    }

    try:
        new_user = await users_collection.insert_one(user_dict)
        return {"status": "success", "user_id": str(new_user.inserted_id)}
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="User already exists")

# Login
@router.post("/login")
async def login(form_data: UserLogin):
    user = await db.users.find_one({"email": form_data.email})
    if not user or not verify_password(form_data.password, user.get("password_hash","")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(subject=str(user["_id"]))
    return {"access_token": token, "token_type": "bearer"}
