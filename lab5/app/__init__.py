from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from datetime import datetime
import os

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production
    
    # Временно используем in-memory базу данных для демонстрации
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    from app.models import User, Role, VisitLog
    from app.routes import main, auth, users
    from app.reports import bp as reports_bp

    app.register_blueprint(main.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(users.bp)
    app.register_blueprint(reports_bp)

    # Middleware для логирования посещений
    @app.before_request
    def log_visit():
        # Исключаем статические файлы и некоторые маршруты
        if not request.path.startswith('/static') and request.path != '/favicon.ico':
            from flask_login import current_user
            
            visit_log = VisitLog(
                path=request.path,
                user_id=current_user.id if current_user.is_authenticated else None
            )
            
            try:
                db.session.add(visit_log)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(f"Error logging visit: {e}")

    with app.app_context():
        print("Creating database tables...")  # Debug print
        db.create_all()
        
        # Check if we have any roles
        roles = Role.query.all()
        print(f"Found {len(roles)} roles")  # Debug print
        
        if not roles:
            print("Creating default roles...")  # Debug print
            admin_role = Role(name='admin', description='Administrator')
            user_role = Role(name='user', description='Regular user')
            db.session.add(admin_role)
            db.session.add(user_role)
            db.session.commit()
            print("Default roles created")  # Debug print

            # Create test user
            print("Creating test user...")  # Debug print
            test_user = User(
                login='admin',
                first_name='Admin',
                last_name='User',
                role_id=admin_role.id
            )
            test_user.set_password('Admin123!')
            db.session.add(test_user)
            print("Test user created")  # Debug print
            
            # Create regular user
            regular_user = User(
                login='user',
                first_name='Regular',
                last_name='User',
                role_id=user_role.id
            )
            regular_user.set_password('User123!')
            db.session.add(regular_user)
            db.session.commit()
            print("Regular user created")  # Debug print
        else:
            # Check if we have any users
            users = User.query.all()
            print(f"Found {len(users)} users")  # Debug print
            if not users:
                print("Creating test users...")  # Debug print
                admin_role = Role.query.filter_by(name='admin').first()
                user_role = Role.query.filter_by(name='user').first()
                
                test_user = User(
                    login='admin',
                    first_name='Admin',
                    last_name='User',
                    role_id=admin_role.id
                )
                test_user.set_password('Admin123!')
                db.session.add(test_user)
                
                regular_user = User(
                    login='user',
                    first_name='Regular',
                    last_name='User',
                    role_id=user_role.id
                )
                regular_user.set_password('User123!')
                db.session.add(regular_user)
                db.session.commit()
                print("Test users created")  # Debug print

    return app 