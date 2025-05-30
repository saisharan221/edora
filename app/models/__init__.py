"""
Model export hub — **IMPORT ORDER MATTERS**

Any class that appears on the right-hand side of Relationship()
must be imported *after* the class it points to.

Order here:
  1. User      – other models point to it
  2. Channel   – needs User, and Post needs Channel
  3. Post      – needs Channel & User
  4. Tag / PostTag
  5. MediaFile – needs Post
  6. Comment   – needs Post & User
  7. PostReaction – needs Post & User
  8. SavedPost – needs Post & User
  9. RefreshToken, AuditLog – independent
"""

from .user import User                 # ← User first
from .channel import Channel           # ← Channel second (uses User)
from .post import Post                 # ← Post uses Channel & User
from .tag import Tag
from .post_tag import PostTag
from .media_file import MediaFile
from .comment import Comment
from .post_reaction import PostReaction
from .saved_post import SavedPost
from .refresh_token import RefreshToken
from .audit_log import AuditLog
from .flagged_word import FlaggedWord

__all__ = [
    "User",
    "Channel",
    "Post",
    "Tag",
    "PostTag",
    "MediaFile",
    "Comment",
    "PostReaction",
    "SavedPost",
    "RefreshToken",
    "AuditLog",
    "FlaggedWord",
]
