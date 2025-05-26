# app/api/channels.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, insert
from app.api.posts import PostRead, Post  

from app.db import get_session
from app.models.channel import Channel, ChannelCreate, ChannelRead
from app.api.auth import current_user
from app.models.user import User
from app.models.association_tables import channel_user_link

router = APIRouter(prefix="/channels", tags=["channels"])


@router.post(
    "/",
    response_model=ChannelRead,
    status_code=status.HTTP_201_CREATED,
)
def create_channel(
    payload: ChannelCreate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    # ensure unique channel name
    exists = session.exec(
        select(Channel).where(Channel.name == payload.name)
    ).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Channel name already taken",
        )

    # manually construct Channel with owner_id
    chan = Channel(
        name=payload.name,
        bio=payload.bio,
        owner_id=current.id,
    )
    session.add(chan)
    session.commit()
    session.refresh(chan)
    return chan


@router.get(
    "/",
    response_model=List[dict],
)
def list_channels(
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    channels = session.exec(select(Channel)).all()
    result = []
    for ch in channels:
        result.append({
            "id": ch.id,
            "name": ch.name,
            "bio": ch.bio,
            "owner_id": ch.owner_id,
            "logo_filename": ch.logo_filename,
            "created_at": ch.created_at,
            "updated_at": ch.updated_at,
            "joined": current in ch.users
        })
    return result


@router.get(
    "/{channel_id}",
    response_model=ChannelRead,
)
def get_channel(
    channel_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    """Get a specific channel by ID."""
    channel = session.get(Channel, channel_id)
    if not channel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found"
        )
    return channel


@router.get(
    "/{channel_id}/posts",
    response_model=List[PostRead],
    status_code=status.HTTP_200_OK,
)
def list_channel_posts(
    channel_id: int,
    session: Session = Depends(get_session),
):
    # Check if channel exists
    channel = session.get(Channel, channel_id)
    if not channel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Channel not found"
        )
    
    # Get all posts in channel, ordered by creation date
    return session.exec(
        select(Post)
        .where(Post.channel_id == channel_id)
        .order_by(Post.created_at.desc())
    ).all()


@router.post("/{channel_id}/join")
def join_channel(
    channel_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user),
):
    channel = session.get(Channel, channel_id)
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    # Check if a row already exists in the association table (channel_user_link) for (channel_id, current.id)
    stmt = select(channel_user_link).where(
        channel_user_link.c.channel_id == channel_id,
        channel_user_link.c.user_id == current.id
    )
    if session.exec(stmt).first():
        raise HTTPException(status_code=400, detail="Already joined")
    # Insert a new row into channel_user_link (using insert(...).values(...))
    ins = insert(channel_user_link).values(channel_id=channel_id, user_id=current.id)
    session.exec(ins)
    session.commit()
    return {"message": "Joined channel"}
