# app/schemas/place.py
from pydantic import BaseModel
from typing import List, Optional
 
class PlaceCreate(BaseModel):
    name: str
    category: str             # e.g. "beach", "museum", "restaurant"
    description: Optional[str] = None
    location: Optional[dict] = None   # {"lat": 35.9, "lng": 14.5}
    price_level: Optional[str] = None # "low"|"medium"|"high"
    tags: Optional[List[str]] = []    # extra tags e.g. ["family","outdoor"]
    image: Optional[str] = None       # URL or path to an image for this place
    duration: Optional[str] = None    # e.g. "2h", "Half day", "All day"
