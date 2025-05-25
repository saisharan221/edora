"""
Usage
-----
> python -m scripts.init_db

• Connects using DATABASE_URL from .env or shell
• Creates every SQLModel table if it doesn't exist
• Inserts one demo super-user the first time (email: admin@example.com, pw: test)
• Works with **sync SQLite** (sqlite:///), **async SQLite** (sqlite+aiosqlite:///)
  and **async Postgres** (postgresql+asyncpg://).
"""

import os
import sys
import asyncio
from pathlib import Path
from typing import Callable, Awaitable

from dotenv import load_dotenv
from sqlalchemy.engine.url import make_url
from sqlmodel import SQLModel, Session, select

# ------------------------------------------------------------------  env
HERE = Path(__file__).resolve().parent.parent
load_dotenv(HERE / ".env")        # silently ignores if missing

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    sys.exit("❌  DATABASE_URL is not set. Add it to .env or export in the shell.")

url = make_url(DATABASE_URL)
ASYNC = url.drivername.startswith(("postgresql+asyncpg", "sqlite+aiosqlite"))

# ------------------------------------------------------------------  sync
def _sync() -> None:
    from sqlmodel import create_engine

    engine = create_engine(DATABASE_URL, echo=True)
    SQLModel.metadata.create_all(engine)

    from app.models import User  # noqa: WPS433

    with Session(engine) as session:
        if not session.exec(select(User).limit(1)).first():
            session.add(
                User(
                    email="admin@example.com",
                    hashed_password="test",   # hash later; this is only a demo row
                    is_superuser=True,
                )
            )
            session.commit()
            print("✔️  Inserted demo user")

# ------------------------------------------------------------------  async
async def _async() -> None:
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
    from sqlmodel.ext.asyncio.session import AsyncSession as SQLModelAsyncSession  # noqa: E501

    engine = create_async_engine(DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    from app.models import User  # noqa: WPS433

    async with AsyncSession(engine, expire_on_commit=False) as session:  # type: ignore[arg-type]  # noqa: E501
        result = await session.execute(select(User).limit(1))
        if not result.scalar_one_or_none():
            session.add(
                User(
                    email="admin@example.com",
                    hashed_password="test",
                    is_superuser=True,
                )
            )
            await session.commit()
            print("✔️  Inserted demo user")

# ------------------------------------------------------------------  entry-point
def main() -> None:
    print(f"Connecting → {DATABASE_URL}")
    if ASYNC:
        asyncio.run(_async())
    else:
        _sync()
    print("✅  Database initialised")

if __name__ == "__main__":
    main()
