# app/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    MONGO_URL: str = "mongodb://localhost:27017"
    MONGO_DB: str = "malta_trip_buddy"
    JWT_SECRET: str = "supersecretkey"
    JWT_ALGORITHM: str = "HS256"

settings = Settings()
