# seed_places.py
import asyncio
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from app.database import db

places = [
    {
        "name": "Valletta Waterfront",
        "type": "attraction",
        "category": "attraction",
        "location": "Valletta Waterfront, Floriana, Malta",
        "description": "Beautiful historic waterfront with stunning architecture, restaurants, and harbor views. Perfect for evening walks and dining.",
        "rating": 4.6,
        "reviews": 1250,
        "duration": "2h",
        "price": "€€",
        "image_placeholder": "blue"
    },
    {
        "name": "Blue Lagoon, Comino",
        "type": "beach",
        "category": "beach",
        "location": "Comino Island, Malta",
        "description": "Crystal clear turquoise waters perfect for swimming, snorkeling, and relaxation. Malta's most famous beach destination.",
        "rating": 4.8,
        "reviews": 3400,
        "duration": "4h",
        "price": "€",
        "image_placeholder": "beach"
    },
    {
        "name": "St. John's Co-Cathedral",
        "type": "church",
        "category": "church",
        "location": "Triq San Gwann, Valletta VLT 1165, Malta",
        "description": "Magnificent baroque cathedral with ornate interior, Caravaggio paintings, and rich history. A must-visit cultural site.",
        "rating": 4.7,
        "reviews": 2800,
        "duration": "1h",
        "price": "€",
        "image_placeholder": "blue"
    },
    {
        "name": "Mdina - The Silent City",
        "type": "attraction",
        "category": "attraction",
        "location": "Mdina, Malta",
        "description": "Medieval fortified city with narrow streets, ancient architecture, and panoramic views. Perfect for history lovers.",
        "rating": 4.5,
        "reviews": 4200,
        "duration": "3h",
        "price": "€",
        "image_placeholder": "beige"
    },
    {
        "name": "Ħaġar Qim Temples",
        "type": "museum",
        "category": "museum",
        "location": "Triq Hagar Qim, Qrendi QRD 2501, Malta",
        "description": "UNESCO World Heritage megalithic temples dating back 5,000 years. Among the oldest free-standing structures on Earth.",
        "rating": 4.4,
        "reviews": 1800,
        "duration": "2h",
        "price": "€",
        "image_placeholder": "blue"
    },
    {
        "name": "Palazzo Preca Restaurant",
        "type": "restaurant",
        "category": "restaurant",
        "location": "54 Triq San Girgor, Valletta VLT 1432, Malta",
        "description": "Fine dining restaurant in Valletta serving modern Mediterranean cuisine with a focus on local Maltese ingredients.",
        "rating": 4.3,
        "reviews": 890,
        "duration": "2h",
        "price": "€€€",
        "image_placeholder": "restaurant"
    }
]

async def seed():
    # Clear existing places
    await db.places.delete_many({})
    print("Cleared existing places")
    
    # Insert new places
    result = await db.places.insert_many(places)
    print(f"Inserted {len(result.inserted_ids)} places")
    
    # Display inserted places
    for place in places:
        print(f"  - {place['name']} ({place['category']})")

if __name__ == "__main__":
    asyncio.run(seed())
