import datetime as dt
from typing import Optional, List

from sqlmodel import Field, Relationship, SQLModel


class Channel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, max_length=120)
    bio: str | None = None
    logo_filename: str | None = Field(max_length=255)

    owner_id: int = Field(foreign_key="user.id")
    owner: "User" = Relationship(back_populates="channels")

    created_at: dt.datetime = Field(default_factory=dt.datetime.utcnow, nullable=False)
    updated_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow,
        sa_column_kwargs={"onupdate": dt.datetime.utcnow},
        nullable=False,
    )

    posts: List["Post"] = Relationship(back_populates="channel")
