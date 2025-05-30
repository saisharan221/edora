import datetime as dt
from typing import Optional
from sqlmodel import SQLModel, Field

class FlaggedWord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    word: str = Field(index=True, unique=True, nullable=False, max_length=128)
    created_at: dt.datetime = Field(default_factory=dt.datetime.utcnow, nullable=False) 