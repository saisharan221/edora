from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from app.users.models import User  # your FastAPI-Users user model

class ResourceBase(SQLModel):
    title: str
    description: Optional[str] = None

class Resource(ResourceBase, table=True):
    __tablename__ = "resources"

    id: Optional[int] = Field(default=None, primary_key=True)
    file_path: str
    owner_id: Optional[int] = Field(
        default=None, foreign_key="user.id", index=True
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow, nullable=False
    )

    owner: Optional[User] = Relationship(back_populates="resources")
