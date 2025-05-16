from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    # your existing FastAPI-Users fields…
    id: Optional[int] = Field(default=None, primary_key=True)
    # …
    resources: List["Resource"] = Relationship(back_populates="owner")
