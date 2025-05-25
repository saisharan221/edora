"""add points column to user

Revision ID: fe5e35bd2dbb
Revises: 83c8e87c697b
Create Date: 2025-05-25 02:04:27.830244

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fe5e35bd2dbb'
down_revision: Union[str, None] = '83c8e87c697b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Only add the points column to user
    op.add_column('user', sa.Column('points', sa.Integer(), nullable=False, server_default='0'))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # Only drop the points column from user
    op.drop_column('user', 'points')
    # ### end Alembic commands ###
