from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import auth, recommendations, users, places, profile   # import your routers
from app.routers import admin

app = FastAPI(title="Malta Trip Buddy API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only. Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router)  # /users routes
app.include_router(recommendations.router)  # /recommendations routes
app.include_router(places.router, prefix="/places", tags=["places"])
app.include_router(profile.router)  # /profile routes
app.include_router(admin.router)  # /admin routes

# Serve static files for uploaded place images
app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
async def root():
    return {"message": "Malta Trip Buddy API is running!"}
