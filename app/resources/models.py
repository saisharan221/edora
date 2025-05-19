from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from app.users.models import User


class Resource(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    owner: Optional[User] = Relationship(back_populates="resources")
