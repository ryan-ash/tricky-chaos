"""empty message

Revision ID: ebe256706e4f
Revises: 8c102ddd21d8
Create Date: 2023-03-31 02:30:11.536067

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ebe256706e4f'
down_revision = '8c102ddd21d8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('project', schema=None) as batch_op:
        batch_op.add_column(sa.Column('released_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('last_updated_at', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('version', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('category_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_project_category_id', 'category', ['category_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('project', schema=None) as batch_op:
        batch_op.drop_constraint('fk_project_category_id', type_='foreignkey')
        batch_op.drop_column('category_id')
        batch_op.drop_column('version')
        batch_op.drop_column('last_updated_at')
        batch_op.drop_column('released_at')

    # ### end Alembic commands ###
