# scripts/seed.py
import os
import asyncio
from sqlmodel import SQLModel, select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine

from app.models import User  # ensure __init__.py exports User

DB_URL = os.getenv("DATABASE_URL")

async def main() -> None:
    engine = create_async_engine(DB_URL, echo=True)

    # 1️⃣  Create tables
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    # 2️⃣  Insert demo row if none exist
    async with AsyncSession(engine) as session:
        result = await session.exec(select(User).limit(1))
        if not result.first():
            demo = User(email="admin@example.com", hashed_password="test")
            session.add(demo)
            await session.commit()
            print("Inserted demo user")

if __name__ == "__main__":
    asyncio.run(main())
