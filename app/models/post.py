import datetime as dt
from datetime import datetime     # ← add this
from typing import List, Optional  # ← add List here

from sqlmodel import SQLModel, Field, Relationship
from .post_tag import PostTag


class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200, index=True)
    content: str

    channel_id: int = Field(foreign_key="channel.id")
    author_id: int = Field(foreign_key="user.id")

    channel: "Channel" = Relationship(back_populates="posts")
    author: "User" = Relationship(back_populates="posts")

    files: list["MediaFile"] = Relationship(back_populates="post")
    comments: list["Comment"] = Relationship(back_populates="post")
    tags: list["Tag"] = Relationship(back_populates="posts", link_model=PostTag)

    created_at: dt.datetime = Field(default_factory=dt.datetime.utcnow, nullable=False)
    updated_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow,
        sa_column_kwargs={"onupdate": dt.datetime.utcnow},
        nullable=False,
    )

class PostCreate(SQLModel):
    title: str
    content: str
    channel_id: int

class MediaFileRead(SQLModel):
    id: int
    filename: str

    class Config:
        from_attributes = True

class PostRead(SQLModel):
    id: int
    title: str
    content: str
    author_id: int
    created_at: datetime             # now datetime is defined
    files: List[MediaFileRead] = []  # now List is defined

    class Config:
        from_attributes = True
