from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi import status
from typing import List, Optional
from bson import ObjectId
import os

from ..database import db
from ..schemas.place import PlaceCreate
from ..utils.auth import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["admin"])


# --------- Helpers ---------

def _serialize_place(place: dict) -> dict:
  """Convert Mongo place document to JSON-serializable dict with id and image field."""
  place["id"] = str(place["_id"])
  del place["_id"]
  return place


# --------- Places management ---------

@router.get("/places")
async def admin_list_places(current_admin: dict = Depends(get_current_admin_user)):
  places_cursor = db.places.find()
  places: List[dict] = []
  async for p in places_cursor:
      places.append(_serialize_place(p))
  return places


@router.post("/places", status_code=status.HTTP_201_CREATED)
async def admin_create_place(place: PlaceCreate, current_admin: dict = Depends(get_current_admin_user)):
  place_dict = place.dict()
  res = await db.places.insert_one(place_dict)
  created = await db.places.find_one({"_id": res.inserted_id})
  return _serialize_place(created)


@router.put("/places/{place_id}")
async def admin_update_place(place_id: str, place: PlaceCreate, current_admin: dict = Depends(get_current_admin_user)):
  try:
      obj_id = ObjectId(place_id)
  except Exception:
      raise HTTPException(status_code=400, detail="Invalid place id")

  update_data = {k: v for k, v in place.dict().items() if v is not None}
  result = await db.places.update_one({"_id": obj_id}, {"$set": update_data})
  if result.matched_count == 0:
      raise HTTPException(status_code=404, detail="Place not found")

  updated = await db.places.find_one({"_id": obj_id})
  return _serialize_place(updated)


@router.delete("/places/{place_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_place(place_id: str, current_admin: dict = Depends(get_current_admin_user)):
  try:
      obj_id = ObjectId(place_id)
  except Exception:
      raise HTTPException(status_code=400, detail="Invalid place id")

  result = await db.places.delete_one({"_id": obj_id})
  if result.deleted_count == 0:
      raise HTTPException(status_code=404, detail="Place not found")
  return {"status": "deleted"}


# --------- Image upload for places ---------

STATIC_PLACES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "places")
os.makedirs(STATIC_PLACES_DIR, exist_ok=True)


@router.post("/places/upload-image")
async def upload_place_image(
    file: UploadFile = File(...),
    current_admin: dict = Depends(get_current_admin_user),
):
  """Upload an image file for a place.

  Saves the file under backend/app/static/places and returns a URL path
  that the frontend can store as the place.image value.
  """
  filename = file.filename
  if not filename:
      raise HTTPException(status_code=400, detail="Missing filename")

  # Basic extension check
  _, ext = os.path.splitext(filename)
  if ext.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
      raise HTTPException(status_code=400, detail="Unsupported image type")

  # Ensure unique-ish filename
  safe_name = filename.replace(" ", "_")

  dest_path = os.path.join(STATIC_PLACES_DIR, safe_name)

  contents = await file.read()
  with open(dest_path, "wb") as out_file:
      out_file.write(contents)

  # URL path that FastAPI will serve via StaticFiles (mounted in main.py)
  url_path = f"/static/places/{safe_name}"
  return {"image": url_path}


# --------- Users management (basic list) ---------

@router.get("/users")
async def admin_list_users(current_admin: dict = Depends(get_current_admin_user)):
  cursor = db.users.find()
  users: List[dict] = []
  async for u in cursor:
      users.append(
          {
              "id": str(u["_id"]),
              "name": u.get("name"),
              "email": u.get("email"),
              "role": u.get("role", "user"),
              "created_at": u.get("created_at"),
          }
      )
  return users
