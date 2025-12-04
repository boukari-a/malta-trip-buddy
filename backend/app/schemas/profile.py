# app/schemas/profile.py
from pydantic import BaseModel
from typing import List, Optional
from pydantic import Field

class ProfileCreate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    travel_style: Optional[str] = None   # e.g. "adventure", "relaxation", "culture"
    budget_range: Optional[str] = None   # e.g. "low","medium","high"
    interests: Optional[List[str]] = Field(default_factory=list)  # e.g. ["beaches","museums"]
    accessibility_needs: Optional[bool] = False

class ProfileOut(ProfileCreate):
    id: str
    user_id: str
