import datetime as dt
from typing import Optional, List

from sqlmodel import Field, Relationship, SQLModel


class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str

    post_id: int = Field(foreign_key="post.id", index=True)
    author_id: int = Field(foreign_key="user.id")
    parent_id: int | None = Field(default=None, foreign_key="comment.id")

    post: "Post" = Relationship(back_populates="comments")
    author: "User" = Relationship(back_populates="comments")
    replies: List["Comment"] = Relationship(
        sa_relationship_kwargs={"remote_side": "Comment.id"}
    )

    created_at: dt.datetime = Field(default_factory=dt.datetime.utcnow, nullable=False)
