# test_db.py
import asyncio
from app.database import db
from app.config import settings

async def test():
    # insert a test document
    test_user = {"name": "Ahmed", "email": "test@malta.com"}
    result = await db.users.insert_one(test_user)
    print("Inserted id:", result.inserted_id)

    # fetch it
    found = await db.users.find_one({"email": "test@malta.com"})
    print("Found:", found)

    # clean up
    await db.users.delete_one({"email": "test@malta.com"})

asyncio.run(test())
