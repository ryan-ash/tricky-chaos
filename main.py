from flask import Flask, render_template
from flask_migrate import Migrate
from config import config
from database import db, Project

app = Flask(__name__)
app.config.from_mapping(config)

db.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def home():
    projects = Project.query.all()
    return render_template('index.html', projects=projects)

if __name__ == '__main__':
    app.run()
