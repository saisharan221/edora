import datetime as dt
from typing import Optional

from sqlmodel import Field, SQLModel


class AuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    actor_id: int | None = Field(default=None, foreign_key="user.id")
    action: str
    object_type: str
    object_id: int | None = None
    data: str | None = None        # JSON string
    created_at: dt.datetime = Field(default_factory=dt.datetime.utcnow, nullable=False)
