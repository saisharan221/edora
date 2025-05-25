# app/db.py
import os
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.orm import sessionmaker

# Use the synchronous SQLite driver for our API
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./data/app.db") \
    .replace("sqlite+aiosqlite", "sqlite")

# Create the engine
engine = create_engine(DATABASE_URL, echo=True)

# sessionmaker that yields SQLModel Session objects
SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    expire_on_commit=False,
)

def get_session():
    """
    Dependency for FastAPI to get a DB session.
    Usage: session: Session = Depends(get_session)
    """
    with SessionLocal() as session:
        yield session

def init_db():
    """
    Call this on app startup if you want to auto-create tables.
    """
    SQLModel.metadata.create_all(engine)
