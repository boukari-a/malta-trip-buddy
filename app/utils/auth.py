from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.models.user import User  # your MongoEngine model

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # decode your JWT here; for now, simulate:
    user_id = "replace_with_decoded_token_id"
    user = User.objects(id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "travel_style": user.travel_style,
        "budget": user.budget,
        "group_type": user.group_type,
        "accessibility_needs": user.accessibility_needs,
        "interests": user.interests
    }
