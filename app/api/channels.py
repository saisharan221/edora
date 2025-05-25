# app/api/channels.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.api.posts import PostRead, Post  

from app.db import get_session
from app.models.channel import Channel, ChannelCreate, ChannelRead
from app.api.auth import current_user
from app.models.user import User

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
    response_model=List[ChannelRead],
)
def list_channels(
    session: Session = Depends(get_session),
):
    return session.exec(select(Channel)).all()

@router.get(
    "/{channel_id}/posts",
    response_model=List[PostRead],
    status_code=status.HTTP_200_OK,
)
def list_channel_posts(
    channel_id: int,
    session: Session = Depends(get_session),
):
    return session.exec(
        select(Post).where(Post.channel_id == channel_id)
    ).all()
