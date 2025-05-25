"""
Seed some default tags – run once:
> python -m scripts.seed_tags
"""
from sqlmodel import Session
from dotenv import load_dotenv
import os, sys
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
from app.models import Tag, SQLModel, make_url, create_engine  # noqa: E402

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

with Session(engine) as s:
    for name in ("news", "tech", "gaming", "design"):
        if not s.get(Tag, {"name": name}):
            s.add(Tag(name=name))
    s.commit()
print("🏷️  Tags seeded")
