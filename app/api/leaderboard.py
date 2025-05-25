from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.user import User
from app.db import get_session
from app.api.auth import current_user

router = APIRouter()

@router.get("/leaderboard", response_model=List[User])
async def get_leaderboard(
    limit: int = 10,
    session: Session = Depends(get_session),
    current_user: User = Depends(current_user)
):
    """
    Get the top users by points
    """
    statement = select(User).order_by(User.points.desc()).limit(limit)
    users = session.exec(statement).all()
    return users

@router.get("/leaderboard/rank", response_model=int)
async def get_user_rank(
    session: Session = Depends(get_session),
    current_user: User = Depends(current_user)
):
    """
    Get the current user's rank in the leaderboard
    """
    # Count users with more points than current user
    statement = select(User).where(User.points > current_user.points)
    users_with_higher_points = session.exec(statement).all()
    return len(users_with_higher_points) + 1

def update_user_points(user_id: int, points_to_add: int, session: Session):
    """
    Helper function to update user points
    """
    user = session.get(User, user_id)
    if user:
        user.points += points_to_add
        session.add(user)
        session.commit()
        session.refresh(user) 