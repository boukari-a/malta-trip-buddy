# app/routes/profile.py
from fastapi import APIRouter, Depends, HTTPException, Header
from bson import ObjectId
from typing import Optional
from ..database import db
from ..utils.jwt_handler import decode_token
from ..schemas.profile import ProfileCreate, ProfileOut

router = APIRouter(prefix="/profile", tags=["profile"])

async def get_current_user_id(authorization: Optional[str] = Header(None)):
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
    else:
        res = await db.profiles.insert_one(profile_dict)
        updated = await db.profiles.find_one({"_id": res.inserted_id})
        updated["id"] = str(updated["_id"])
        updated["user_id"] = str(updated["user_id"])
        del updated["_id"]

    # Also sync travel_style onto the user document for recommendations
    travel_style = profile_dict.get("travel_style")
    if travel_style:
        try:
            await db["users"].update_one(
                {"_id": obj_id},
                {"$set": {"travel_style": travel_style}}
            )
        except Exception:
            # Fail silently if user update fails; profile update still succeeds
            pass

    return updated

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
