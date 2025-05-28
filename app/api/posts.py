# app/api/posts.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db import get_session
from app.models.post import Post, PostCreate, PostRead, PostUpdate
from app.api.auth import current_user
from app.models.user import User
from app.models.channel import Channel
from app.core.permissions import (
    require_post_edit_permission,
    require_post_delete_permission
)

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
    current: User = Depends(current_user),
):
    posts = session.exec(select(Post)).all()
    # Add permission flags to each post
    result = []
    for post in posts:
        post_dict = post.dict()
        can_edit = current.role == "admin" or post.author_id == current.id
        can_delete = current.role == "admin" or post.author_id == current.id
        post_dict["can_edit"] = can_edit
        post_dict["can_delete"] = can_delete
        result.append(post_dict)
    return result

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
    posts = session.exec(query).all()
    # Add permission flags to each post
    result = []
    for post in posts:
        post_dict = post.dict()
        can_edit = current.role == "admin" or post.author_id == current.id
        can_delete = current.role == "admin" or post.author_id == current.id
        post_dict["can_edit"] = can_edit
        post_dict["can_delete"] = can_delete
        result.append(post_dict)
    return result

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

@router.put(
    "/{post_id}",
    response_model=PostRead,
)
def update_post(
    post_id: int,
    payload: PostUpdate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    """Update a post. Only the author or admin can edit."""
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check permissions
    require_post_edit_permission(current, post)
    
    # Check if new title is unique in the channel (if title is being changed)
    if payload.title and payload.title != post.title:
        exists = session.exec(
            select(Post).where(
                Post.title == payload.title,
                Post.channel_id == post.channel_id,
                Post.id != post.id  # Exclude current post
            )
        ).first()
        if exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Post with that title already exists in this channel",
            )
    
    # Update fields
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)
    
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    """Delete a post. Only the author or admin can delete."""
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check permissions
    require_post_delete_permission(current, post)
    
    session.delete(post)
    session.commit()
    return {"message": "Post deleted successfully"}
