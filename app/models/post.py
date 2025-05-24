import datetime as dt
from typing import Optional, List

from sqlmodel import Field, Relationship, SQLModel


class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200, index=True)
    content: str

    channel_id: int = Field(foreign_key="channel.id")
    author_id: int = Field(foreign_key="user.id")

    channel: "Channel" = Relationship(back_populates="posts")
    author: "User" = Relationship(back_populates="posts")

    created_at: dt.datetime = Field(default_factory=dt.datetime.utcnow, nullable=False)
    updated_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow,
        sa_column_kwargs={"onupdate": dt.datetime.utcnow},
        nullable=False,
    )

    files: List["MediaFile"] = Relationship(back_populates="post")
    comments: List["Comment"] = Relationship(back_populates="post")
    tags: List["Tag"] = Relationship(
        back_populates="posts", link_model="PostTag"  # type: ignore
    )
