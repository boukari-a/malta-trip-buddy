from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from typing import List
import random

from ..database import db
from ..utils.auth import get_current_user

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

BUDGET_ORDER = {"low": 0, "medium": 1, "high": 2}

STYLE_TAGS = {
    "family": {"family", "kids", "playground", "easy"},
    "nightlife": {"nightlife", "bar", "club", "music"},
    "relaxed": {"relax", "chill", "spa", "beach"},
    "adventurous": {"hiking", "cliff", "dive", "adventure"},
    # extend with whatever travel_style values you actually use
}

@router.get("/")
async def recommend_places(current_user: dict = Depends(get_current_user)):
    """Improved rule-based recommendation system (no external AI).

    Takes into account:
    - user_interests vs place.tags & description
    - user_budget vs place.price_level
    - travel_style vs style-specific tags
    """
    places = await db.places.find().to_list(1000)

    if not places:
        raise HTTPException(status_code=404, detail="No places found")

    # Extract and normalize user preferences
    raw_interests: List[str] = current_user.get("interests", []) or []
    user_interests = [i.lower().strip() for i in raw_interests if isinstance(i, str)]

    raw_budget = (current_user.get("budget") or "medium").lower()
    user_budget_idx = BUDGET_ORDER.get(raw_budget, 1)  # default to medium

    raw_style = (current_user.get("travel_style") or "").lower().strip()
    style_tags = STYLE_TAGS.get(raw_style, set())

    scored: List[dict] = []

    for place in places:
        score = 0.0

        desc = (place.get("description") or "").lower()
        category = (place.get("category") or "").lower()
        tags = {t.lower() for t in (place.get("tags") or []) if isinstance(t, str)}

        # 1) Interests vs tags & description
        for interest in user_interests:
            if interest in tags:
                score += 3
            elif interest and interest in desc:
                score += 1

        # 2) Category match with interests
        if category and category in user_interests:
            score += 3

        # 3) Budget vs price_level
        price_level_raw = (place.get("price_level") or "medium").lower()
        place_budget_idx = BUDGET_ORDER.get(price_level_raw, 1)
        diff = abs(user_budget_idx - place_budget_idx)
        if diff == 0:
            score += 4  # perfect budget match
        elif diff == 1:
            score += 2  # close enough
        # else: no extra points (or score -= 1 if you want to punish)

        # 4) Travel style vs tags
        if style_tags:
            overlap = style_tags.intersection(tags)
            score += 2 * len(overlap)
            if category in style_tags:
                score += 2

        # 5) Optional: rating as tie-breaker if stored on place
        rating = place.get("rating")
        if isinstance(rating, (int, float)):
            score += (float(rating) / 5.0) * 2  # normalize 0-5 into ~0-2

        # 6) Small random jitter to avoid always identical order for equal scores
        score += random.uniform(0, 0.3)

        place["score"] = round(score, 3)
        place["id"] = str(place["_id"])
        del place["_id"]
        scored.append(place)

    scored.sort(key=lambda x: x["score"], reverse=True)
    top = scored[:5]

    return {"recommendations": top}
