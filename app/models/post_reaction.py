import datetime as dt
from typing import Optional, TYPE_CHECKING
from enum import Enum

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User
    from .post import Post


class ReactionType(str, Enum):
    LIKE = "like"
    DISLIKE = "dislike"


class PostReactionBase(SQLModel):
    reaction_type: ReactionType = Field(nullable=False)


class PostReaction(PostReactionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    reaction_type: ReactionType = Field(nullable=False)
    
    # Foreign keys
    post_id: int = Field(foreign_key="post.id", nullable=False)
    user_id: int = Field(foreign_key="user.id", nullable=False)
    
    # Timestamps
    created_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow, 
        nullable=False
    )
    updated_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow,
        sa_column_kwargs={"onupdate": dt.datetime.utcnow},
        nullable=False,
    )
    
    # Relationships
    post: "Post" = Relationship(back_populates="reactions")
    user: "User" = Relationship(back_populates="post_reactions")


class PostReactionCreate(PostReactionBase):
    post_id: int


class PostReactionRead(PostReactionBase):
    id: int
    post_id: int
    user_id: int
    created_at: dt.datetime
    updated_at: dt.datetime 