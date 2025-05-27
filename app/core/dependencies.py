from fastapi import Depends, HTTPException, status
from app.models.user import User
from app.api.auth import current_user

def require_moderator(user: User = Depends(current_user)):
    if getattr(user, 'role', 'user') not in ("moderator", "admin"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user 