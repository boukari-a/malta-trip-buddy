# app/schemas/profile.py
from pydantic import BaseModel
from typing import List, Optional
from pydantic import Field

class ProfileCreate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    nationality: Optional[str] = None
    travel_style: Optional[str] = None   # e.g. "Foodie", "Explorer", etc.
    accessibility_needs: Optional[str] = None  # Changed to string for detailed needs

class ProfileOut(ProfileCreate):
    id: str
    user_id: str
