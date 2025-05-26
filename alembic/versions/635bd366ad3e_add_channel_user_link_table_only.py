"""add channel_user_link table only

Revision ID: 635bd366ad3e
Revises: 4ad3f4ecb801
Create Date: 2025-05-26 05:55:27.948894

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '635bd366ad3e'
down_revision: Union[str, None] = '4ad3f4ecb801'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'channel_user_link',
        sa.Column('channel_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('channel_id', 'user_id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('channel_user_link')
