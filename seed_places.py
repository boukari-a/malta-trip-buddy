# seed_db.py
import asyncio
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from app.database import db

places = [
    {
        "name": "St. John's Co-Cathedral",
        "type": "Museum",
        "location": "Valletta",
        "description": "A beautiful Baroque cathedral with rich history.",
        "rating": 4.8
    },
    {
        "name": "Blue Lagoon",
        "type": "Beach",
        "location": "Comino",
        "description": "Crystal-clear waters perfect for swimming.",
        "rating": 4.9
    },
    {
        "name": "Mdina Old City",
        "type": "Historical Site",
        "location": "Mdina",
        "description": "Medieval walled city, also called the Silent City.",
        "rating": 4.7
    },
    {
        "name": "Popeye Village",
        "type": "Theme Park",
        "location": "Mellieha",
        "description": "Fun family attraction with colorful sets.",
        "rating": 4.5
    },
]

async def seed():
    result = await db.places.insert_many(places)
    print(f"Inserted {len(result.inserted_ids)} places")

asyncio.run(seed())
