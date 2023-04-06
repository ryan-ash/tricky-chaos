"""empty message

Revision ID: 32070d8aa790
Revises: 
Create Date: 2023-04-06 05:03:56.511610

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '32070d8aa790'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('category',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('project',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('image', sa.String(length=200), nullable=False),
    sa.Column('links', sa.Text(), nullable=True),
    sa.Column('released_at', sa.DateTime(), nullable=True),
    sa.Column('last_updated_at', sa.DateTime(), nullable=True),
    sa.Column('version', sa.String(length=50), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['category.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('project')
    op.drop_table('category')
    # ### end Alembic commands ###