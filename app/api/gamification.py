from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.db import get_session
from app.api.auth import current_user
from app.models.user import User
from app.gamification.service import GamificationService
from app.gamification.models import (
    PointTransactionRead, 
    UserPointsRead
)

router = APIRouter(prefix="/api/gamification", tags=["gamification"])


@router.get("/my-points", response_model=dict)
def get_my_points(
    current_user: User = Depends(current_user),
    session: Session = Depends(get_session)
):
    """Get current user's points."""
    service = GamificationService(session)
    points = service.get_user_points(current_user.id)
    return {"points": points}


@router.get("/my-transactions", response_model=List[PointTransactionRead])
def get_my_transactions(
    limit: int = 50,
    current_user: User = Depends(current_user),
    session: Session = Depends(get_session)
):
    """Get current user's point transaction history."""
    service = GamificationService(session)
    transactions = service.get_user_transactions(current_user.id, limit)
    return transactions


@router.get("/leaderboard", response_model=List[UserPointsRead])
def get_leaderboard(
    limit: int = 10,
    session: Session = Depends(get_session)
):
    """Get the points leaderboard."""
    if limit > 100:
        limit = 100  # Cap the limit for performance
    
    service = GamificationService(session)
    return service.get_leaderboard(limit)


@router.get("/user/{user_id}/points", response_model=dict)
def get_user_points(
    user_id: int,
    current_user: User = Depends(current_user),
    session: Session = Depends(get_session)
):
    """Get points for a specific user (public information)."""
    service = GamificationService(session)
    points = service.get_user_points(user_id)
    
    if points is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"user_id": user_id, "points": points} 