# app/api/posts.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db import get_session
from app.models.post import Post, PostCreate, PostRead
from app.api.auth import current_user
from app.models.user import User

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post(
    "/",
    response_model=PostRead,
    status_code=status.HTTP_201_CREATED,
)
def create_post(
    payload: PostCreate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),            # ← inject current_user
):
    # ensure title uniqueness in the same channel (optional)
    exists = session.exec(
        select(Post).where(
            Post.title == payload.title,
            Post.channel_id == payload.channel_id,
        )
    ).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post with that title already exists in this channel",
        )
    post = Post(**payload.dict(), author_id=current.id)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

@router.get(
    "/",
    response_model=List[PostRead],
)
def list_posts(
    session: Session = Depends(get_session),
):
    return session.exec(select(Post)).all()
