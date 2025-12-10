from mongoengine import connect
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/malta_trip_buddy")

connect(host=MONGO_URL)
