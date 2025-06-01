import datetime as dt
from typing import List, Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User
    from .channel import Channel
    from .comment import Comment
    from .media_file import MediaFile
    from .post_reaction import PostReaction
    from .tag import Tag
    from .saved_post import SavedPost

from .post_tag import PostTag


class PostBase(SQLModel):
    title: str = Field(nullable=False, max_length=200)
    content: str = Field(nullable=False, max_length=10000)


class Post(PostBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Foreign keys
    channel_id: int = Field(foreign_key="channel.id", nullable=False)
    author_id: int = Field(foreign_key="user.id", nullable=False)
    
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
    channel: "Channel" = Relationship(back_populates="posts")
    author: "User" = Relationship(back_populates="posts")
    comments: List["Comment"] = Relationship(
        back_populates="post", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    files: List["MediaFile"] = Relationship(
        back_populates="post",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    reactions: List["PostReaction"] = Relationship(
        back_populates="post",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    tags: List["Tag"] = Relationship(
        back_populates="posts", 
        link_model=PostTag
    )
    saved_by_users: List["SavedPost"] = Relationship(
        back_populates="post",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    flagged: bool = Field(default=False, nullable=False)
    flag_reason: Optional[str] = Field(default=None, max_length=256)


class PostCreate(PostBase):
    channel_id: int


class MediaFileRead(SQLModel):
    id: int
    filename: str
    mime_type: str
    size: int

    class Config:
        from_attributes = True


class PostRead(PostBase):
    id: int
    channel_id: int
    author_id: int
    created_at: dt.datetime
    updated_at: dt.datetime
    files: List[MediaFileRead] = []
    like_count: int = 0
    dislike_count: int = 0
    is_saved: bool = False

    class Config:
        from_attributes = True


class PostWithAuthor(PostBase):
    id: int
    channel_id: int
    author_id: int
    created_at: dt.datetime
    updated_at: dt.datetime
    files: List[MediaFileRead] = []
    like_count: int = 0
    dislike_count: int = 0
    is_saved: bool = False
    author_email: str
    author_username: Optional[str] = None

    class Config:
        from_attributes = True
