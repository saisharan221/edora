import datetime as dt
from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

if TYPE_CHECKING:
    from .user import User
    from .post import Post


class SavedPostBase(SQLModel):
    pass


class SavedPost(SavedPostBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Foreign keys
    user_id: int = Field(foreign_key="user.id", nullable=False)
    post_id: int = Field(foreign_key="post.id", nullable=False)
    
    # Timestamps
    saved_at: dt.datetime = Field(
        default_factory=dt.datetime.utcnow, 
        nullable=False
    )
    
    # Relationships
    user: "User" = Relationship(back_populates="saved_posts")
    post: "Post" = Relationship(back_populates="saved_by_users")
    
    # Ensure a user can't save the same post twice
    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="unique_user_post_save"),
    )


class SavedPostCreate(SavedPostBase):
    post_id: int


class SavedPostRead(SavedPostBase):
    id: int
    user_id: int
    post_id: int
    saved_at: dt.datetime 