from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db import get_session
from app.models.comment import Comment, CommentCreate, CommentRead
from app.models.post import Post
from app.api.auth import current_user
from app.models.user import User

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
    return comment


@router.get(
    "/post/{post_id}",
    response_model=List[CommentRead],
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
    
    # Get all comments for the post, ordered by creation date
    comments = session.exec(
        select(Comment)
        .where(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
    ).all()
    
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