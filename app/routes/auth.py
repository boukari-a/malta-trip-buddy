from fastapi import APIRouter, HTTPException
from ..database import db
from app.schemas.user import UserCreate, UserLogin, UserOut
from ..utils.hashing import hash_password, verify_password
from ..utils.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

# Registration
@router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_dict = user.dict()
    user_dict["password_hash"] = hash_password(user_dict.pop("password"))
    res = await db.users.insert_one(user_dict)
    inserted = await db.users.find_one({"_id": res.inserted_id})
    inserted["id"] = str(inserted["_id"])  # convert ObjectId to string
    return {"id": inserted["id"], "email": inserted["email"]}

# Login
@router.post("/login")
async def login(form_data: UserLogin):
    user = await db.users.find_one({"email": form_data.email})
    if not user or not verify_password(form_data.password, user.get("password_hash","")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(subject=str(user["_id"]))
    return {"access_token": token, "token_type": "bearer"}
