from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db import get_session
from app.models.saved_post import SavedPost, SavedPostCreate, SavedPostRead
from app.models.post import Post, PostRead, PostWithAuthor
from app.models.media_file import MediaFile
from app.models.user import User
from app.api.auth import current_user

router = APIRouter(prefix="/saved-posts", tags=["saved-posts"])


@router.post(
    "/",
    response_model=SavedPostRead,
    status_code=status.HTTP_201_CREATED,
)
def save_post(
    payload: SavedPostCreate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    """Save a post to user's saved collection."""
    # Check if post exists
    post = session.get(Post, payload.post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if post is already saved by this user
    existing_save = session.exec(
        select(SavedPost).where(
            SavedPost.user_id == current.id,
            SavedPost.post_id == payload.post_id
        )
    ).first()
    
    if existing_save:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Post already saved"
        )
    
    # Create saved post
    saved_post = SavedPost(
        user_id=current.id,
        post_id=payload.post_id
    )
    session.add(saved_post)
    session.commit()
    session.refresh(saved_post)
    return saved_post


@router.delete(
    "/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def unsave_post(
    post_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    """Remove a post from user's saved collection."""
    # Find the saved post
    saved_post = session.exec(
        select(SavedPost).where(
            SavedPost.user_id == current.id,
            SavedPost.post_id == post_id
        )
    ).first()
    
    if not saved_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved post not found"
        )
    
    # Delete the saved post
    session.delete(saved_post)
    session.commit()
    return None


@router.get(
    "/",
    response_model=List[PostWithAuthor],
)
def get_saved_posts(
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    """Get all posts saved by the current user with author information."""
    # Get saved posts with post and author details using JOIN
    stmt = (
        select(
            Post.id,
            Post.title,
            Post.content,
            Post.channel_id,
            Post.author_id,
            Post.created_at,
            Post.updated_at,
            User.email.label("author_email"),
            User.username.label("author_username"),
            SavedPost.saved_at
        )
        .join(Post, SavedPost.post_id == Post.id)
        .join(User, Post.author_id == User.id)
        .where(SavedPost.user_id == current.id)
        .order_by(SavedPost.saved_at.desc())
    )
    
    results = session.exec(stmt).all()
    
    # Convert to PostWithAuthor objects
    posts = []
    for row in results:
        # Get files for this post
        files = session.exec(
            select(MediaFile).where(MediaFile.post_id == row.id)
        ).all()
        
        post = PostWithAuthor(
            id=row.id,
            title=row.title,
            content=row.content,
            channel_id=row.channel_id,
            author_id=row.author_id,
            created_at=row.created_at,
            updated_at=row.updated_at,
            author_email=row.author_email,
            author_username=row.author_username,
            files=[file.dict() for file in files],
            like_count=0,  # Will be populated separately if needed
            dislike_count=0,  # Will be populated separately if needed
            is_saved=True
        )
        posts.append(post)
    
    return posts


@router.get(
    "/check/{post_id}",
    response_model=dict,
)
def check_if_saved(
    post_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    """Check if a post is saved by the current user."""
    saved_post = session.exec(
        select(SavedPost).where(
            SavedPost.user_id == current.id,
            SavedPost.post_id == post_id
        )
    ).first()
    
    return {"is_saved": saved_post is not None} 