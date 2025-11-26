from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, recommendations, users, places   # import your routers

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

@app.get("/")
async def root():
    return {"message": "Malta Trip Buddy API is running!"}
