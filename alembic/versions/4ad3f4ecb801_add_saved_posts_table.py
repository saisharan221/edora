"""add_saved_posts_table

Revision ID: 4ad3f4ecb801
Revises: a22eaa5c9d5e
Create Date: 2025-05-25 22:47:22.732397

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4ad3f4ecb801'
down_revision: Union[str, None] = 'a22eaa5c9d5e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create savedpost table
    op.create_table('savedpost',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('saved_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['post_id'], ['post.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'post_id', name='unique_user_post_save')
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Drop savedpost table
    op.drop_table('savedpost')
