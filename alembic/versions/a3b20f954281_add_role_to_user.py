"""add role to user

Revision ID: a3b20f954281
Revises: 635bd366ad3e
Create Date: 2025-05-27 06:15:34.098647

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3b20f954281'
down_revision: Union[str, None] = '635bd366ad3e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Only add the 'role' column to the 'user' table
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('role', sa.String(length=32), nullable=False, server_default='user'))


def downgrade() -> None:
    """Downgrade schema."""
    # Only drop the 'role' column from the 'user' table
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('role')
