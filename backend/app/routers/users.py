from fastapi import APIRouter, Depends, HTTPException, Header
from bson import ObjectId
from ..database import db
from ..utils.jwt_handler import decode_token

router = APIRouter(prefix="/users", tags=["users"])

async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication")
    token = authorization.split(" ")[1]
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        obj_id = ObjectId(user_id)  # <-- convert string to ObjectId
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = await db.users.find_one({"_id": obj_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]), 
        "email": user["email"],
        "name": user.get("name"),
        "role": user.get("role", "user"),
        "created_at": user.get("created_at"),
    }

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
