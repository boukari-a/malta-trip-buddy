from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from ..database import db
from ..utils.auth import get_current_user

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("/")
async def recommend_places(current_user: dict = Depends(get_current_user)):
    """
    Simple AI-like recommendation system
    """
    places = await db.places.find().to_list(1000)

    if not places:
        raise HTTPException(status_code=404, detail="No places found")

    user_interests = current_user.get("interests", [])
    user_budget = current_user.get("budget", "medium")
    user_travel_style = current_user.get("travel_style", "")

    scored = []
    for place in places:
        score = 0
        desc = place.get("description", "").lower()

        for interest in user_interests:
            if interest.lower() in desc:
                score += 2

        if user_budget in ["low", "medium", "high"]:
            score += 1

        if user_travel_style and user_travel_style.lower() in desc:
            score += 1

        place["score"] = score
        place["id"] = str(place["_id"])
        del place["_id"]
        scored.append(place)

    scored = sorted(scored, key=lambda x: x["score"], reverse=True)
    return {"recommendations": scored[:5]}
