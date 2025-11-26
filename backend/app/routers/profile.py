# app/routes/profile.py
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from ..database import db
from ..utils.jwt_handler import decode_token
from ..schemas.profile import ProfileCreate, ProfileOut

router = APIRouter(prefix="/profile", tags=["profile"])

async def get_current_user_id(authorization: str = None):
    # called via Depends in endpoints below: FastAPI will provide headers if named 'authorization' if you use Header(...)
    # but we'll keep it simple: you likely have a get_current_user elsewhere; use that instead if present.
    from fastapi import Header
    if authorization is None:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication header")
    token = authorization.split(" ", 1)[1]
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_id

# create or update profile for current user
@router.put("/me", response_model=ProfileOut)
async def create_or_update_profile(profile: ProfileCreate, authorization: str = Depends(get_current_user_id)):
    user_id = authorization
    obj_id = ObjectId(user_id)
    existing = await db.profiles.find_one({"user_id": obj_id})
    profile_dict = profile.dict()
    profile_dict["user_id"] = obj_id
    if existing:
        await db.profiles.update_one({"_id": existing["_id"]}, {"$set": profile_dict})
        updated = await db.profiles.find_one({"_id": existing["_id"]})
        updated["id"] = str(updated["_id"])
        updated["user_id"] = str(updated["user_id"])
        del updated["_id"]
        return updated
    else:
        res = await db.profiles.insert_one(profile_dict)
        inserted = await db.profiles.find_one({"_id": res.inserted_id})
        inserted["id"] = str(inserted["_id"])
        inserted["user_id"] = str(inserted["user_id"])
        del inserted["_id"]
        return inserted

# get current user's profile
@router.get("/me", response_model=ProfileOut)
async def get_my_profile(authorization: str = Depends(get_current_user_id)):
    user_id = ObjectId(authorization)
    prof = await db.profiles.find_one({"user_id": user_id})
    if not prof:
        raise HTTPException(status_code=404, detail="Profile not found")
    prof["id"] = str(prof["_id"])
    prof["user_id"] = str(prof["user_id"])
    del prof["_id"]
    return prof
