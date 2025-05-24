import os
from sqlmodel import create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/app.db")
engine = create_engine(DATABASE_URL, echo=False)
