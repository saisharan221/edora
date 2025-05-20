"""
Run with:  python -m scripts.init_db

• Creates/migrates all tables
• (Optional) inserts seed rows the first time
Works with BOTH sync-SQLite and async Postgres/SQLite.
"""
import os
import asyncio
from typing import Callable

from sqlmodel import SQLModel, Session, select
from sqlalchemy import text
from sqlalchemy.engine.url import make_url

from app.models import *  # noqa: F401  (we just need the imports to register tables)

DATABASE_URL = os.getenv("DATABASE_URL")
assert DATABASE_URL, "DATABASE_URL is not set"

url = make_url(DATABASE_URL)
ASYNC = url.drivername.startswith(("postgresql+asyncpg", "sqlite+aiosqlite"))

# -----------------------------------------------------------------------------


def _sync_init() -> None:
    """Handle sync engines (sqlite:///)."""
    from sqlmodel import create_engine

    engine = create_engine(DATABASE_URL, echo=True)

    # 1️⃣  create / migrate tables
    SQLModel.metadata.create_all(engine)

    # 2️⃣  seed
    with Session(engine) as session:
        from app.models import User  # type: ignore

        if not session.exec(select(User).limit(1)).first():
            session.add(
                User(
                    email="admin@example.com",
                    hashed_password="test",
                    is_superuser=True,
                )
            )
            session.commit()
            print("✔️  Inserted demo user")


async def _async_init() -> None:
    """Handle async engines (Postgres or sqlite+aiosqlite)."""
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
    from sqlmodel.ext.asyncio.session import AsyncSession as SQLModelAsyncSession

    engine = create_async_engine(DATABASE_URL, echo=True)

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    async with AsyncSession(engine, expire_on_commit=False) as session:  # type: ignore
        from app.models import User  # type: ignore

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
            print("  Inserted demo user")


def main() -> None:
    print(f"Connecting to {DATABASE_URL}")
    if ASYNC:
        asyncio.run(_async_init())
    else:
        _sync_init()
    print("  DB initialised")


# -----------------------------------------------------------------------------
if __name__ == "__main__":
    main()
