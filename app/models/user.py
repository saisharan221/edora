import datetime as dt
from typing import List, Optional, TYPE_CHECKING

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:  # imports needed only for type checkers
    from .channel import Channel
    from .post import Post
    from .comment import Comment
    from .post_reaction import PostReaction
    from .saved_post import SavedPost


class UserBase(SQLModel):
    email: EmailStr = Field(index=True, unique=True, nullable=False)
    username: Optional[str] = Field(default=None, max_length=50, nullable=True)
    is_active: bool = True
    is_superuser: bool = False
    # "user", "moderator", "admin"
    role: str = Field(default="user", max_length=32)


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(nullable=False, max_length=1024)
    points: int = Field(default=0, nullable=False)  # Gamification points

    created_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow, nullable=False
    )
    updated_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow,
        sa_column_kwargs={"onupdate": dt.datetime.utcnow},
        nullable=False,
    )

    # relationships ----------------------------------------------------------
    channels: List["Channel"] = Relationship(back_populates="owner")
    posts: List["Post"] = Relationship(back_populates="author")
    comments: List["Comment"] = Relationship(back_populates="author")
    post_reactions: List["PostReaction"] = Relationship(back_populates="user")
    saved_posts: List["SavedPost"] = Relationship(back_populates="user")
    joined_channels: List["Channel"] = Relationship(
        back_populates="users",
        sa_relationship_kwargs={"secondary": "channel_user_link"}
    )
