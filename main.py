from flask import Flask, render_template, Response, make_response
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_httpauth import HTTPBasicAuth
from flask_migrate import Migrate
from config import config
from database import db, Project
from wtforms import TextAreaField

app = Flask(__name__)
app.config.from_mapping(config)

db.init_app(app)
migrate = Migrate(app, db)

auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(username, password):
    if username == app.config['ADMIN_USERNAME'] and password == app.config['ADMIN_PASSWORD']:
        return True
    return False

class AuthenticatedModelView(ModelView):
    def is_accessible(self):
        if not auth.current_user():
            return False
        auth_result = auth.login_required(lambda: True)()
        if isinstance(auth_result, Response):
            return False
        return True

    def inaccessible_callback(self, name, **kwargs):
        return auth.login_required(lambda: None)()
    
    form_overrides = {
        'links': TextAreaField
    }

class AuthenticatedAdminIndexView(AdminIndexView):
    def is_accessible(self):
        if not auth.current_user():
            return False
        auth_result = auth.login_required(lambda: True)()
        if isinstance(auth_result, Response):
            return False
        return True

    def inaccessible_callback(self, name, **kwargs):
        return auth.login_required(lambda: None)()

admin = Admin(app, name='Chaotic Sandbox', template_mode='bootstrap3', index_view=AuthenticatedAdminIndexView())
admin.add_view(AuthenticatedModelView(Project, db.session))

@app.route('/')
def home():
    projects = Project.query.all()
    return render_template('index.html', projects=projects)

if __name__ == '__main__':
    app.run()
