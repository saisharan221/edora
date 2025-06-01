"""Add comments and post reactions

Revision ID: a22eaa5c9d5e
Revises: 83c8e87c697b
Create Date: 2025-05-25 22:34:01.234567

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a22eaa5c9d5e'
down_revision: Union[str, None] = '83c8e87c697b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create PostReaction table
    op.create_table('postreaction',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('reaction_type', sa.String(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['post_id'], ['post.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Update comment table using batch operations for SQLite
    with op.batch_alter_table('comment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=False))
        batch_op.drop_column('parent_id')
    
    # Drop the post title index
    op.drop_index('ix_post_title', table_name='post')


def downgrade() -> None:
    """Downgrade schema."""
    # Recreate post title index
    op.create_index('ix_post_title', 'post', ['title'], unique=False)
    
    # Revert comment table changes
    with op.batch_alter_table('comment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('parent_id', sa.INTEGER(), nullable=True))
        batch_op.drop_column('updated_at')
    
    # Drop PostReaction table
    op.drop_table('postreaction')
