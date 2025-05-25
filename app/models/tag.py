from typing import Optional

from sqlmodel import SQLModel, Field, Relationship
from .post_tag import PostTag


class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True, max_length=50)

    posts: list["Post"] = Relationship(back_populates="tags", link_model=PostTag)
