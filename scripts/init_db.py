"""
Run:

    python -m scripts.init_db

• Reads DATABASE_URL from .env (or env var)
• Creates every SQLModel table
• Inserts one demo super-user
Works on **Python 3.8 → 3.12** with either sync-SQLite or async drivers.
"""

import os
import sys
import asyncio
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from sqlmodel import SQLModel, Session, select
from sqlalchemy.engine.url import make_url

# --------------------------------------------------------------------------- env
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")         # ignore if file is missing

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    sys.exit("❌  DATABASE_URL is not set in .env or the shell")

url = make_url(DATABASE_URL)
ASYNC = url.drivername.startswith(("postgresql+asyncpg", "sqlite+aiosqlite"))

# --------------------------------------------------------------------------- sync
def _sync_init() -> None:
    from sqlmodel import create_engine

    engine = create_engine(DATABASE_URL, echo=True)

    # import AFTER engine so models don’t fail on import cycles
    from app.models import User  # noqa: WPS433

    SQLModel.metadata.create_all(engine)

    # seed one user
    with Session(engine) as session:
        exists = session.exec(select(User).limit(1)).first()
        if not exists:
            session.add(
                User(
                    email="admin@example.com",
                    hashed_password="test",   # hash later; demo only
                    is_superuser=True,
                )
            )
            session.commit()
            print("✔️ Inserted demo user")

# --------------------------------------------------------------------------- async
async def _async_init() -> None:
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

    engine = create_async_engine(DATABASE_URL, echo=True)
    from app.models import User  # noqa: WPS433

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    async with AsyncSession(engine, expire_on_commit=False) as session:  # type: ignore[arg-type]  # noqa: E501
        result = await session.execute(select(User).limit(1))
        if not result.scalar_one_or_none():
            session.add(
                User(email="admin@example.com", hashed_password="test", is_superuser=True)
            )
            await session.commit()
            print("✔️ Inserted demo user")

# --------------------------------------------------------------------------- entry
def main() -> None:
    print(f"Connecting → {DATABASE_URL}")
    if ASYNC:
        asyncio.run(_async_init())
    else:
        _sync_init()
    print("✅ Database initialised")


if __name__ == "__main__":
    main()
