# tools/seed_places.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

PLACES = [
    # --- Beaches ---
    {
        "name": "Blue Lagoon (Comino)",
        "category": "beach",
        "description": "Crystal clear turquoise waters between Comino and Cominotto — perfect for swimming and snorkeling.",
        "location": {"lat": 36.013, "lng": 14.334},
        "price_level": "low",
        "tags": ["beach", "swimming", "snorkeling", "nature", "boat"]
    },
    {
        "name": "Golden Bay",
        "category": "beach",
        "description": "One of Malta’s most popular sandy beaches, great for sunsets and swimming.",
        "location": {"lat": 35.933, "lng": 14.345},
        "price_level": "low",
        "tags": ["beach", "family", "sunset", "outdoor"]
    },
    {
        "name": "Mellieħa Bay (Għadira Bay)",
        "category": "beach",
        "description": "Largest sandy beach in Malta, shallow waters ideal for families.",
        "location": {"lat": 35.967, "lng": 14.349},
        "price_level": "low",
        "tags": ["beach", "family", "swimming", "outdoor"]
    },
    {
        "name": "St. Peter’s Pool",
        "category": "beach",
        "description": "Natural rocky swimming pool with crystal clear waters near Marsaxlokk.",
        "location": {"lat": 35.821, "lng": 14.562},
        "price_level": "low",
        "tags": ["beach", "swimming", "cliff jumping", "adventure"]
    },

    # --- Historical / Cultural ---
    {
        "name": "Mdina (The Silent City)",
        "category": "culture",
        "description": "Ancient walled city with medieval streets, stunning views, and rich history.",
        "location": {"lat": 35.887, "lng": 14.406},
        "price_level": "low",
        "tags": ["history", "architecture", "museum", "walking"]
    },
    {
        "name": "Valletta",
        "category": "culture",
        "description": "Malta’s capital city — UNESCO World Heritage site filled with museums, cathedrals, and cafes.",
        "location": {"lat": 35.899, "lng": 14.514},
        "price_level": "medium",
        "tags": ["history", "architecture", "shopping", "museum"]
    },
    {
        "name": "St. John’s Co-Cathedral",
        "category": "culture",
        "description": "Baroque masterpiece in Valletta famous for its ornate interior and Caravaggio paintings.",
        "location": {"lat": 35.898, "lng": 14.513},
        "price_level": "low",
        "tags": ["church", "museum", "art", "history"]
    },
    {
        "name": "Ħaġar Qim Temples",
        "category": "history",
        "description": "Prehistoric temple complex dating back to 3600 BC overlooking the sea.",
        "location": {"lat": 35.830, "lng": 14.437},
        "price_level": "medium",
        "tags": ["history", "archaeology", "museum", "outdoor"]
    },
    {
        "name": "National Museum of Archaeology",
        "category": "museum",
        "description": "Showcases Malta’s prehistoric treasures from Neolithic to Bronze Age.",
        "location": {"lat": 35.897, "lng": 14.511},
        "price_level": "low",
        "tags": ["museum", "history", "education"]
    },

    # --- Nature / Outdoor ---
    {
        "name": "Dingli Cliffs",
        "category": "nature",
        "description": "Spectacular coastal cliffs offering panoramic views and sunset walks.",
        "location": {"lat": 35.848, "lng": 14.382},
        "price_level": "low",
        "tags": ["hiking", "sunset", "nature", "outdoor"]
    },
    {
        "name": "Blue Grotto",
        "category": "nature",
        "description": "Famous sea caves with brilliant blue reflections — best seen by boat.",
        "location": {"lat": 35.819, "lng": 14.454},
        "price_level": "medium",
        "tags": ["boat", "photography", "nature", "outdoor"]
    },
    {
        "name": "Buskett Gardens",
        "category": "park",
        "description": "Green woodland area ideal for picnics and walks — one of the few forested spots in Malta.",
        "location": {"lat": 35.854, "lng": 14.394},
        "price_level": "low",
        "tags": ["nature", "park", "walking", "family"]
    },

    # --- Entertainment / Nightlife ---
    {
        "name": "St. Julian’s & Paceville",
        "category": "nightlife",
        "description": "Lively area packed with clubs, bars, and restaurants.",
        "location": {"lat": 35.915, "lng": 14.49},
        "price_level": "medium",
        "tags": ["nightlife", "bars", "restaurants", "party"]
    },
    {
        "name": "The Point Shopping Mall (Sliema)",
        "category": "shopping",
        "description": "Large modern shopping mall with international brands and food court.",
        "location": {"lat": 35.909, "lng": 14.509},
        "price_level": "high",
        "tags": ["shopping", "indoor", "restaurants"]
    },
    {
        "name": "Malta National Aquarium",
        "category": "family",
        "description": "Great for kids and families — diverse marine life exhibits and sea views.",
        "location": {"lat": 35.957, "lng": 14.418},
        "price_level": "medium",
        "tags": ["family", "education", "indoor"]
    },

    # --- Religious Sites ---
    {
        "name": "Mosta Dome (Rotunda of Mosta)",
        "category": "religion",
        "description": "Massive church with one of the largest unsupported domes in the world.",
        "location": {"lat": 35.910, "lng": 14.426},
        "price_level": "low",
        "tags": ["church", "architecture", "history"]
    },
    {
        "name": "Ta' Pinu Basilica (Gozo)",
        "category": "religion",
        "description": "Beautiful basilica and pilgrimage site surrounded by countryside views.",
        "location": {"lat": 36.057, "lng": 14.222},
        "price_level": "low",
        "tags": ["church", "religion", "architecture", "history"]
    },

    # --- Gozo Attractions ---
    {
        "name": "Victoria (Rabat) and the Citadel",
        "category": "culture",
        "description": "Gozo’s capital city with a stunning hilltop citadel and charming old streets.",
        "location": {"lat": 36.045, "lng": 14.239},
        "price_level": "low",
        "tags": ["history", "architecture", "museum"]
    },
    {
        "name": "Ramla Bay (Gozo)",
        "category": "beach",
        "description": "Golden-red sandy beach surrounded by hills — a favorite among locals.",
        "location": {"lat": 36.056, "lng": 14.283},
        "price_level": "low",
        "tags": ["beach", "nature", "family", "outdoor"]
    },

    # --- Unique Experiences ---
    {
        "name": "Popeye Village",
        "category": "theme park",
        "description": "Colorful film set from the 1980 Popeye movie — now a family attraction.",
        "location": {"lat": 35.960, "lng": 14.340},
        "price_level": "medium",
        "tags": ["family", "photography", "fun", "outdoor"]
    },
    {
        "name": "Marsaxlokk Fishing Village",
        "category": "culture",
        "description": "Traditional fishing village famous for its colorful boats and Sunday market.",
        "location": {"lat": 35.841, "lng": 14.544},
        "price_level": "low",
        "tags": ["market", "seafood", "photography", "culture"]
    },
    {
        "name": "Gozo Azure Window Ruins (Dwejra Bay)",
        "category": "nature",
        "description": "Former site of the iconic Azure Window — still scenic for diving and sunsets.",
        "location": {"lat": 36.056, "lng": 14.189},
        "price_level": "low",
        "tags": ["diving", "photography", "sunset", "nature"]
    },
]

async def seed():
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.MONGO_DB]
    count = await db.places.count_documents({})
    if count == 0:
        print("🌍 Seeding Malta places...")
        await db.places.insert_many(PLACES)
        print(f"✅ Inserted {len(PLACES)} places.")
    else:
        print("⚠️ Places collection already has data, skipping seeding.")

if __name__ == "__main__":
    asyncio.run(seed())
