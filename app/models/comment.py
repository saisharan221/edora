import datetime as dt
from typing import Optional, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .post import Post


class CommentBase(SQLModel):
    content: str
    post_id: Optional[int] = Field(default=None, foreign_key="post.id")
    parent_id: Optional[int] = Field(default=None, foreign_key="comment.id")


class CommentCreate(CommentBase):
    pass


class CommentRead(CommentBase):
    id: int
    author_id: int
    created_at: dt.datetime


class Comment(CommentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(foreign_key="user.id")

    post: "Post" = Relationship(back_populates="comments")
    author: "User" = Relationship(back_populates="comments")
    parent: Optional["Comment"] = Relationship(
        back_populates="replies",
        sa_relationship_kwargs={"foreign_keys": "Comment.parent_id"}
    )
    replies: list["Comment"] = Relationship(
        back_populates="parent",
        sa_relationship_kwargs={"foreign_keys": "Comment.parent_id", "remote_side": "Comment.id"}
    )

    created_at: dt.datetime = Field(default_factory=dt.datetime.utcnow, nullable=False)
