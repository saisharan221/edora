from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db import get_session
from app.models.comment import (
    Comment, 
    CommentCreate, 
    CommentRead, 
    CommentWithAuthor
)
from app.models.post import Post
from app.api.auth import current_user
from app.models.user import User
from app.gamification.service import GamificationService
from app.gamification.models import ActionType

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
    # Check if post exists
    post = session.get(Post, payload.post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Create comment
    comment = Comment(
        content=payload.content,
        post_id=payload.post_id,
        author_id=current.id
    )
    session.add(comment)
    session.commit()
    session.refresh(comment)
    
    # Award points for comment (5 points)
    gamification_service = GamificationService(session)
    gamification_service.award_points(
        user_id=current.id,
        points=5,
        action_type=ActionType.COMMENT,
        description=f"Commented on post '{post.title}'",
        related_entity_id=comment.id,
        related_entity_type="comment"
    )
    
    return comment


@router.get(
    "/post/{post_id}",
    response_model=List[CommentWithAuthor],
)
def list_post_comments(
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
    
    # Get all comments for the post with author information
    stmt = (
        select(
            Comment.id,
            Comment.content,
            Comment.post_id,
            Comment.author_id,
            Comment.created_at,
            Comment.updated_at,
            User.email.label("author_email"),
            User.username.label("author_username")
        )
        .join(User, Comment.author_id == User.id)
        .where(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
    )
    
    results = session.exec(stmt).all()
    
    # Convert to CommentWithAuthor objects
    comments = []
    for row in results:
        comment = CommentWithAuthor(
            id=row.id,
            content=row.content,
            post_id=row.post_id,
            author_id=row.author_id,
            created_at=row.created_at,
            updated_at=row.updated_at,
            author_email=row.author_email,
            author_username=row.author_username
        )
        comments.append(comment)
    
    return comments


@router.delete(
    "/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_comment(
    comment_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    # Get comment
    comment = session.get(Comment, comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check if user owns the comment
    if comment.author_id != current.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own comments"
        )
    
    # Delete comment
    session.delete(comment)
    session.commit()
    return None 