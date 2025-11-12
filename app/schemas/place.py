from pydantic import BaseModel
from typing import List, Optional

class Place(BaseModel):
    id: Optional[str]
    name: str
    category: str
    location: str
    budget_level: str
    tags: List[str]
    accessibility: bool
    description: Optional[str] = None
    rating: Optional[float] = 0.0
