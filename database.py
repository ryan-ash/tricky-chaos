from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from datetime import datetime

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(200), nullable=False)
    links = db.Column(db.Text, nullable=True)
    released_at = db.Column(db.DateTime, nullable=True)
    last_updated_at = db.Column(db.DateTime, nullable=True)
    version = db.Column(db.String(50), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id', name='fk_project_category_id'), nullable=True)  # Update this line

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
