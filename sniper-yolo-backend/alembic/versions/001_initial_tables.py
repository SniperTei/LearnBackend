"""Initial tables

Revision ID: 001
Revises: 
Create Date: 2024-02-02 15:00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('mobile', sa.String(), nullable=True),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_superuser', sa.Boolean(), nullable=True, default=False),
        sa.Column('vip_level', sa.SmallInteger(), nullable=True, default=1),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('mobile'),
        sa.UniqueConstraint('username')
    )
    
    # Create items table
    op.create_table('items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Float(), nullable=True),
        sa.Column('is_available', sa.Boolean(), nullable=True, default=True),
        sa.Column('owner_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create foods table
    op.create_table('foods',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('cover', sa.String(), nullable=True),
        sa.Column('images', ARRAY(sa.String()), nullable=True),
        sa.Column('tags', ARRAY(sa.String()), nullable=True),
        sa.Column('star', sa.Integer(), nullable=True),
        sa.Column('maker', sa.String(), nullable=False),
        sa.Column('flavor', sa.String(), nullable=True),
        sa.Column('create_time', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('update_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=True),
        sa.Column('updated_by', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create enjoys table
    op.create_table('enjoys',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('cover', sa.String(), nullable=True),
        sa.Column('images', ARRAY(sa.String()), nullable=True),
        sa.Column('tags', ARRAY(sa.String()), nullable=True),
        sa.Column('star', sa.Integer(), nullable=True),
        sa.Column('maker', sa.String(), nullable=False),
        sa.Column('flavor', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('price_per_person', sa.Float(), nullable=True),
        sa.Column('recommend_dishes', ARRAY(sa.String()), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=True),
        sa.Column('updated_by', sa.Integer(), nullable=True),
        sa.Column('create_time', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('update_time', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create funs table
    op.create_table('funs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('cover', sa.String(), nullable=True),
        sa.Column('images', ARRAY(sa.String()), nullable=True),
        sa.Column('tags', ARRAY(sa.String()), nullable=True),
        sa.Column('star', sa.Integer(), nullable=True),
        sa.Column('maker', sa.String(), nullable=False),
        sa.Column('flavor', sa.String(), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=True),
        sa.Column('updated_by', sa.Integer(), nullable=True),
        sa.Column('create_time', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('update_time', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create drinks table
    op.create_table('drinks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.String(), nullable=True),
        sa.Column('cover', sa.String(), nullable=True),
        sa.Column('images', ARRAY(sa.String()), nullable=True),
        sa.Column('tags', ARRAY(sa.String()), nullable=True),
        sa.Column('star', sa.Float(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('drink_name', sa.String(), nullable=False),
        sa.Column('drink_type', sa.String(), nullable=False),
        sa.Column('recommender', sa.String(), nullable=True),
        sa.Column('taste', sa.String(), nullable=True),
        sa.Column('min_price', sa.Float(), nullable=True),
        sa.Column('max_price', sa.Float(), nullable=True),
        sa.Column('currency', sa.String(), nullable=True, default='元'),
        sa.Column('create_time', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('update_time', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('drinks')
    op.drop_table('funs')
    op.drop_table('enjoys')
    op.drop_table('foods')
    op.drop_table('items')
    op.drop_table('users')