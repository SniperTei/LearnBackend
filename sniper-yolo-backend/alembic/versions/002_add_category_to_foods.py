"""Add category column to foods table

Revision ID: 002
Revises: 001
Create Date: 2026-02-25 18:10:00

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add category column to foods table
    op.add_column('foods',
        sa.Column('category', sa.String(length=50), nullable=True)
    )


def downgrade() -> None:
    # Remove category column from foods table
    op.drop_column('foods', 'category')
