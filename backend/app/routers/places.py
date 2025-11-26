from fastapi import APIRouter, HTTPException
from ..database import db

router = APIRouter(tags=["places"])

@router.get("/")
async def get_all_places():
    places = await db.places.find().to_list(1000)
    for place in places:
        place["id"] = str(place["_id"])
        del place["_id"]
    return places

@router.get("/{place_id}")
async def get_place(place_id: str):
    from bson import ObjectId
    place = await db.places.find_one({"_id": ObjectId(place_id)})
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    place["id"] = str(place["_id"])
    del place["_id"]
    return place
