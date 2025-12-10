from fastapi import APIRouter, HTTPException
from ..database import db
from bson import ObjectId

router = APIRouter(prefix="/places", tags=["places"])

@router.get("/")
async def list_places():
    try:
        cursor = db.places.find({})
        results = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            del doc["_id"]  # Remove _id to avoid serialization issues
            results.append(doc)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching places: {str(e)}")
