import datetime as dt
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class MediaFile(SQLModel, table=True):
    """Stores only metadata; the actual bytes live on disk under ./uploads/."""

    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str = Field(max_length=255, nullable=False)  # e.g. abc123.png
    mime_type: str = Field(max_length=100)
    size: int = Field(description="bytes")

    # link to Post (nullable so you can attach later)
    post_id: Optional[int] = Field(default=None, foreign_key="post.id")
    post: Optional["Post"] = Relationship(back_populates="files")

    uploaded_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow,
        nullable=False,
    )

class MediaFileRead(SQLModel):
    id: int
    filename: str
    url: str    # <-- make sure this field exists

    class Config:
        from_attributes = True
