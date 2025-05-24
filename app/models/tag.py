# tag.py
from typing import Optional, List
from sqlmodel import Field, Relationship, SQLModel


class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True, max_length=50)

    posts: List["Post"] = Relationship(
        back_populates="tags", link_model="PostTag"  # type: ignore
    )
