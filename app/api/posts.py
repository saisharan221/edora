# app/api/posts.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db import get_session
from app.models.post import Post, PostCreate, PostRead
from app.api.auth import current_user
from app.models.user import User
from app.models.channel import Channel

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
    # Check if channel exists
    channel = session.get(Channel, payload.channel_id)
    if not channel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found"
        )
    
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

@router.get(
    "/search",
    response_model=List[PostRead],
)
def search_posts(
    q: str,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    """Search posts by title and content."""
    query = select(Post).where(
        Post.title.ilike(f"%{q}%") | Post.content.ilike(f"%{q}%")
    )
    return session.exec(query).all()

@router.get(
    "/{post_id}",
    response_model=PostRead,
)
def get_post(
    post_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    """Get a specific post by ID."""
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return post
