from fastapi import HTTPException, status
from app.models.user import User
from app.models.channel import Channel
from app.models.post import Post


def can_edit_channel(user: User, channel: Channel) -> bool:
    """Check if user can edit a channel (owner or admin)."""
    return user.role == "admin" or channel.owner_id == user.id


def can_delete_channel(user: User, channel: Channel) -> bool:
    """Check if user can delete a channel (owner or admin)."""
    return user.role == "admin" or channel.owner_id == user.id


def can_edit_post(user: User, post: Post) -> bool:
    """Check if user can edit a post (author or admin)."""
    return user.role == "admin" or post.author_id == user.id


def can_delete_post(user: User, post: Post) -> bool:
    """Check if user can delete a post (author or admin)."""
    return user.role == "admin" or post.author_id == user.id


def require_channel_edit_permission(user: User, channel: Channel):
    """Raise HTTPException if user cannot edit channel."""
    if not can_edit_channel(user, channel):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to edit this channel"
        )


def require_channel_delete_permission(user: User, channel: Channel):
    """Raise HTTPException if user cannot delete channel."""
    if not can_delete_channel(user, channel):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this channel"
        )


def require_post_edit_permission(user: User, post: Post):
    """Raise HTTPException if user cannot edit post."""
    if not can_edit_post(user, post):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to edit this post"
        )


def require_post_delete_permission(user: User, post: Post):
    """Raise HTTPException if user cannot delete post."""
    if not can_delete_post(user, post):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this post"
        ) 