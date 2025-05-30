import datetime as dt
from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User
    from .post import Post


class CommentBase(SQLModel):
    content: str = Field(nullable=False, max_length=2000)


class Comment(CommentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field(nullable=False, max_length=2000)
    
    # Foreign keys
    post_id: int = Field(foreign_key="post.id", nullable=False)
    author_id: int = Field(foreign_key="user.id", nullable=False)
    
    # Timestamps
    created_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow, nullable=False
    )
    updated_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow,
        sa_column_kwargs={"onupdate": dt.datetime.utcnow},
        nullable=False,
    )
    
    # Relationships
    post: "Post" = Relationship(back_populates="comments")
    author: "User" = Relationship(back_populates="comments")


class CommentCreate(CommentBase):
    post_id: int


class CommentRead(CommentBase):
    id: int
    post_id: int
    author_id: int
    created_at: dt.datetime
    updated_at: dt.datetime


class CommentWithAuthor(CommentBase):
    id: int
    post_id: int
    author_id: int
    created_at: dt.datetime
    updated_at: dt.datetime
    author_email: str
    author_username: Optional[str] = None

    class Config:
        from_attributes = True
