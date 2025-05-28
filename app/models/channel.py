import datetime as dt
from typing import List, Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel
from .association_tables import channel_user_link

if TYPE_CHECKING:
    from .user import User
    from .post import Post


class ChannelBase(SQLModel):
    name: str = Field(index=True, max_length=120)
    bio: Optional[str] = None


class ChannelCreate(ChannelBase):
    pass


class ChannelUpdate(SQLModel):
    name: Optional[str] = Field(default=None, max_length=120)
    bio: Optional[str] = None


class ChannelRead(ChannelBase):
    id: int
    owner_id: int
    logo_filename: Optional[str] = None
    created_at: dt.datetime
    updated_at: dt.datetime

    class Config:
        orm_mode = True


class Channel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=120)
    bio: Optional[str] = None
    logo_filename: Optional[str] = Field(default=None, max_length=255)

    owner_id: int = Field(foreign_key="user.id")
    owner: "User" = Relationship(back_populates="channels")

    created_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow, nullable=False
    )
    updated_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow,
        sa_column_kwargs={"onupdate": dt.datetime.utcnow},
        nullable=False,
    )

    posts: List["Post"] = Relationship(back_populates="channel")
    users: List["User"] = Relationship(
        back_populates="joined_channels",
        sa_relationship_kwargs={"secondary": "channel_user_link"}
    )
