import datetime as dt
from typing import Optional, TYPE_CHECKING
from enum import Enum

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from ..models.user import User


class ActionType(str, Enum):
    POST_UPLOAD = "post_upload"
    COMMENT = "comment"
    LIKE_RECEIVED = "like_received"
    LIKE_REMOVED = "like_removed"


class PointTransaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", nullable=False)
    points: int = Field(nullable=False)  # Can be positive or negative
    action_type: ActionType = Field(nullable=False)
    description: str = Field(max_length=255)
    related_entity_id: Optional[int] = Field(default=None)
    related_entity_type: Optional[str] = Field(default=None, max_length=50)
    
    created_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow, 
        nullable=False
    )
    
    # Relationships
    user: "User" = Relationship()


class PointTransactionRead(SQLModel):
    id: int
    user_id: int
    points: int
    action_type: ActionType
    description: str
    related_entity_id: Optional[int]
    related_entity_type: Optional[str]
    created_at: dt.datetime

    class Config:
        from_attributes = True


class UserPointsRead(SQLModel):
    user_id: int
    email: str
    username: Optional[str] = None
    points: int
    rank: Optional[int] = None

    class Config:
        from_attributes = True 