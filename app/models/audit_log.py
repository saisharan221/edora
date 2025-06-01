import datetime as dt
from typing import Optional

from sqlmodel import Field, SQLModel


class AuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    actor_id: Optional[int] = Field(default=None, foreign_key="user.id")
    action: str
    object_type: str
    object_id: Optional[int] = None
    data: Optional[str] = None        # JSON string
    created_at: dt.datetime = Field(default_factory=dt.datetime.utcnow, nullable=False)
