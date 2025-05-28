"""Add gamification tables manually

Revision ID: 8ff993306e02
Revises: 88627812ac1e
Create Date: 2025-05-29 00:19:48.090170

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8ff993306e02'
down_revision: Union[str, None] = '88627812ac1e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
