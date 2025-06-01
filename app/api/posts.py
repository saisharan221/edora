# app/api/posts.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db import get_session
from app.models.post import Post, PostCreate, PostRead, PostWithAuthor
from app.api.auth import current_user
from app.models.user import User
from app.models.channel import Channel
from app.core.dependencies import require_moderator
from app.models.flagged_word import FlaggedWord
from app.gamification.service import GamificationService
from app.gamification.models import ActionType
from app.models.media_file import MediaFile
from app.models.comment import Comment
from app.models.post_reaction import PostReaction
from app.models.saved_post import SavedPost

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
    # exists = session.exec(
    #     select(Post).where(
    #         Post.title == payload.title,
    #         Post.channel_id == payload.channel_id,
    #     )
    # ).first()
    # if exists:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Post with that title already exists in this channel",
    #     )
    post = Post(**payload.dict(), author_id=current.id)
    # Check for flagged words
    flagged_words = session.exec(select(FlaggedWord)).all()
    content = (post.content or "").lower()
    for fw in flagged_words:
        if fw.word in content:
            post.flagged = True
            post.flag_reason = fw.word
            break
    session.add(post)
    session.commit()
    session.refresh(post)
    
    # Award points for post upload (10 points)
    gamification_service = GamificationService(session)
    gamification_service.award_points(
        user_id=current.id,
        points=10,
        action_type=ActionType.POST_UPLOAD,
        description=f"Posted '{post.title}' in channel {channel.name}",
        related_entity_id=post.id,
        related_entity_type="post"
    )
    
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

@router.get("/flagged", response_model=list[Post])
async def list_flagged_posts(session: Session = Depends(get_session), current_user=Depends(require_moderator)):
    return session.exec(select(Post).where(Post.flagged == True)).all()

@router.post("/{post_id}/approve")
async def approve_post(post_id: int, session: Session = Depends(get_session), current_user=Depends(require_moderator)):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    post.flagged = False
    post.flag_reason = None
    session.add(post)
    session.commit()
    return {"ok": True}

@router.delete("/{post_id}")
async def delete_post(
    post_id: int, 
    session: Session = Depends(get_session), 
    current_user: User = Depends(current_user)
):
    """Delete a post. Users can delete their own posts, moderators can delete any post."""
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    
    # Check if user has permission to delete this post
    # Allow if user is the author OR if user is moderator/admin
    if (post.author_id != current_user.id and 
        current_user.role not in ("moderator", "admin")):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this post"
        )
    
    # Manually delete related records to avoid constraint violations
    # Delete comments
    comments = session.exec(select(Comment).where(Comment.post_id == post_id)).all()
    for comment in comments:
        session.delete(comment)
    
    # Delete media files
    files = session.exec(select(MediaFile).where(MediaFile.post_id == post_id)).all()
    for file in files:
        session.delete(file)
    
    # Delete reactions
    reactions = session.exec(select(PostReaction).where(PostReaction.post_id == post_id)).all()
    for reaction in reactions:
        session.delete(reaction)
    
    # Delete saved posts
    saved_posts = session.exec(select(SavedPost).where(SavedPost.post_id == post_id)).all()
    for saved_post in saved_posts:
        session.delete(saved_post)
    
    # Now delete the post itself
    session.delete(post)
    session.commit()
    
    return {"message": "Post deleted successfully"}

@router.get("/test-moderator")
async def test_moderator(current_user=Depends(require_moderator)):
    return {"ok": True, "user": getattr(current_user, 'email', None)}

@router.get(
    "/{post_id}",
    response_model=PostWithAuthor,
)
def get_post(
    post_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    """Get a specific post by ID with author information."""
    # Get post with author information using JOIN
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
            User.username.label("author_username")
        )
        .join(User, Post.author_id == User.id)
        .where(Post.id == post_id)
    )
    
    result = session.exec(stmt).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Get files for this post
    files = session.exec(
        select(MediaFile).where(MediaFile.post_id == result.id)
    ).all()
    
    # Create PostWithAuthor object
    post_with_author = PostWithAuthor(
        id=result.id,
        title=result.title,
        content=result.content,
        channel_id=result.channel_id,
        author_id=result.author_id,
        created_at=result.created_at,
        updated_at=result.updated_at,
        author_email=result.author_email,
        author_username=result.author_username,
        files=[file.dict() for file in files],
        like_count=0,  # Will be populated separately if needed
        dislike_count=0,  # Will be populated separately if needed
        is_saved=False  # Will be populated separately if needed
    )
    
    return post_with_author
