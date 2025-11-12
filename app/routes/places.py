from fastapi import APIRouter
from ..database import db

router = APIRouter(prefix="/places", tags=["places"])

@router.get("/")
async def list_places():
    cursor = db.places.find({})
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        results.append(doc)
    return results
