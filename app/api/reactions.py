from typing import Dict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func

from app.db import get_session
from app.models.post_reaction import (
    PostReaction, 
    PostReactionCreate, 
    PostReactionRead,
    ReactionType
)
from app.models.post import Post
from app.api.auth import current_user
from app.models.user import User

router = APIRouter(prefix="/reactions", tags=["reactions"])


@router.post(
    "/",
    response_model=PostReactionRead,
    status_code=status.HTTP_201_CREATED,
)
def create_or_update_reaction(
    payload: PostReactionCreate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    # Check if post exists
    post = session.get(Post, payload.post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user already has a reaction on this post
    existing_reaction = session.exec(
        select(PostReaction).where(
            PostReaction.post_id == payload.post_id,
            PostReaction.user_id == current.id
        )
    ).first()
    
    if existing_reaction:
        # Update existing reaction
        existing_reaction.reaction_type = payload.reaction_type
        session.add(existing_reaction)
        session.commit()
        session.refresh(existing_reaction)
        return existing_reaction
    else:
        # Create new reaction
        reaction = PostReaction(
            reaction_type=payload.reaction_type,
            post_id=payload.post_id,
            user_id=current.id
        )
        session.add(reaction)
        session.commit()
        session.refresh(reaction)
        return reaction


@router.delete(
    "/post/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_reaction(
    post_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    # Check if post exists
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Find user's reaction
    reaction = session.exec(
        select(PostReaction).where(
            PostReaction.post_id == post_id,
            PostReaction.user_id == current.id
        )
    ).first()
    
    if not reaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No reaction found"
        )
    
    # Delete reaction
    session.delete(reaction)
    session.commit()
    return None


@router.get(
    "/post/{post_id}/counts",
    response_model=Dict[str, int],
)
def get_reaction_counts(
    post_id: int,
    session: Session = Depends(get_session),
):
    # Check if post exists
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Count likes
    like_count = session.exec(
        select(func.count(PostReaction.id)).where(
            PostReaction.post_id == post_id,
            PostReaction.reaction_type == ReactionType.LIKE
        )
    ).one()
    
    # Count dislikes
    dislike_count = session.exec(
        select(func.count(PostReaction.id)).where(
            PostReaction.post_id == post_id,
            PostReaction.reaction_type == ReactionType.DISLIKE
        )
    ).one()
    
    return {
        "like_count": like_count,
        "dislike_count": dislike_count
    }


@router.get(
    "/post/{post_id}/user",
    response_model=PostReactionRead | None,
)
def get_user_reaction(
    post_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    # Check if post exists
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Get user's reaction
    reaction = session.exec(
        select(PostReaction).where(
            PostReaction.post_id == post_id,
            PostReaction.user_id == current.id
        )
    ).first()
    
    return reaction 