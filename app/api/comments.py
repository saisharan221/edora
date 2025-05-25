from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db import get_session
from app.models.comment import Comment, CommentCreate, CommentRead
from app.api.auth import current_user
from app.models.user import User
from app.api.leaderboard import update_user_points

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post(
    "/",
    response_model=CommentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_comment(
    payload: CommentCreate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    comment = Comment(**payload.dict(), author_id=current.id)
    session.add(comment)
    session.commit()
    session.refresh(comment)
    
    # Award points for creating a comment
    update_user_points(current.id, 5, session)  # Award 5 points for creating a comment
    
    return comment

@router.get(
    "/post/{post_id}",
    response_model=List[CommentRead],
)
def list_comments(
    post_id: int,
    session: Session = Depends(get_session),
):
    return session.exec(select(Comment).where(Comment.post_id == post_id)).all() 