# app/models/user.py
from __future__ import annotations

import datetime as dt
from typing import Optional

from pydantic import EmailStr
from sqlmodel import SQLModel, Field


# ---------------------------------------------------------------------------
# Shared / base properties
# ---------------------------------------------------------------------------

class UserBase(SQLModel):
    """Fields common to all user representations."""
    email: EmailStr = Field(index=True, nullable=False, unique=True)
    is_active: bool = Field(default=True, nullable=False)
    is_superuser: bool = Field(default=False, nullable=False)


# ---------------------------------------------------------------------------
# Database table
# ---------------------------------------------------------------------------

class User(UserBase, table=True):  # ← actual DB table
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(nullable=False, max_length=1024)

    created_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow,
        nullable=False,
    )
    updated_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"onupdate": dt.datetime.utcnow},
    )


# ---------------------------------------------------------------------------
# Pydantic models for API / business logic
# ---------------------------------------------------------------------------

class UserCreate(UserBase):
    """Data required to register a new user (plain-text password allowed)."""
    password: str


class UserRead(UserBase):
    """What you return to the client."""
    id: int
    created_at: dt.datetime
    updated_at: dt.datetime


class UserUpdate(SQLModel):
    """Patch-style updates; every field optional."""
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
