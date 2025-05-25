import datetime as dt
from typing import Optional

from sqlmodel import Field, SQLModel


class RefreshToken(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True, max_length=36)
    user_id: int = Field(foreign_key="user.id", index=True)
    expires_at: dt.datetime = Field(nullable=False)
    revoked: bool = Field(default=False, nullable=False)
