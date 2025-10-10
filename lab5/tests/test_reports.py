import pytest
from app import create_app, db
from app.models import User, Role, VisitLog
from datetime import datetime

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def admin_role(app):
    with app.app_context():
        role = Role(name='admin', description='Administrator')
        db.session.add(role)
        db.session.commit()
        return role

@pytest.fixture
def user_role(app):
    with app.app_context():
        role = Role(name='user', description='Regular user')
        db.session.add(role)
        db.session.commit()
        return role

@pytest.fixture
def admin_user(app, admin_role):
    with app.app_context():
        user = User(
            login='admin',
            first_name='Admin',
            last_name='User',
            role_id=admin_role.id
        )
        user.set_password('Admin123!')
        db.session.add(user)
        db.session.commit()
        return user

@pytest.fixture
def regular_user(app, user_role):
    with app.app_context():
        user = User(
            login='user',
            first_name='Regular',
            last_name='User',
            role_id=user_role.id
        )
        user.set_password('User123!')
        db.session.add(user)
        db.session.commit()
        return user

@pytest.fixture
def visit_logs(app, admin_user, regular_user):
    with app.app_context():
        # Создаем несколько записей посещений
        logs = [
            VisitLog(path='/', user_id=admin_user.id, created_at=datetime(2024, 1, 1, 10, 0, 0)),
            VisitLog(path='/users', user_id=admin_user.id, created_at=datetime(2024, 1, 1, 11, 0, 0)),
            VisitLog(path='/', user_id=regular_user.id, created_at=datetime(2024, 1, 1, 12, 0, 0)),
            VisitLog(path='/login', user_id=None, created_at=datetime(2024, 1, 1, 13, 0, 0)),
        ]
        
        for log in logs:
            db.session.add(log)
        db.session.commit()
        return logs

def test_visit_logs_page_requires_auth(client):
    """Тест что страница журнала посещений требует аутентификации"""
    response = client.get('/visit-logs', follow_redirects=True)
    assert response.status_code == 200
    assert b'Login' in response.data

def test_visit_logs_admin_access(client, admin_user, visit_logs):
    """Тест доступа администратора к журналу посещений"""
    # Логинимся как администратор
    client.post('/login', data={
        'login': 'admin',
        'password': 'Admin123!'
    })
    
    response = client.get('/visit-logs')
    assert response.status_code == 200
    assert b'Visit Logs' in response.data
    # Администратор должен видеть все записи
    assert b'Admin User' in response.data
    assert b'Regular User' in response.data
    assert b'Unauthenticated user' in response.data

def test_visit_logs_user_access(client, regular_user, visit_logs):
    """Тест доступа обычного пользователя к журналу посещений"""
    # Логинимся как обычный пользователь
    client.post('/login', data={
        'login': 'user',
        'password': 'User123!'
    })
    
    response = client.get('/visit-logs')
    assert response.status_code == 200
    assert b'Visit Logs' in response.data
    # Обычный пользователь должен видеть только свои записи
    assert b'Regular User' in response.data
    assert b'Admin User' not in response.data

def test_pages_report_requires_auth(client):
    """Тест что отчёт по страницам требует аутентификации"""
    response = client.get('/reports/pages', follow_redirects=True)
    assert response.status_code == 200
    assert b'Login' in response.data

def test_pages_report_admin_access(client, admin_user, visit_logs):
    """Тест доступа администратора к отчёту по страницам"""
    client.post('/login', data={
        'login': 'admin',
        'password': 'Admin123!'
    })
    
    response = client.get('/reports/pages')
    assert response.status_code == 200
    assert b'Pages Report' in response.data

def test_users_report_requires_auth(client):
    """Тест что отчёт по пользователям требует аутентификации"""
    response = client.get('/reports/users', follow_redirects=True)
    assert response.status_code == 200
    assert b'Login' in response.data

def test_users_report_admin_access(client, admin_user, visit_logs):
    """Тест доступа администратора к отчёту по пользователям"""
    client.post('/login', data={
        'login': 'admin',
        'password': 'Admin123!'
    })
    
    response = client.get('/reports/users')
    assert response.status_code == 200
    assert b'Users Report' in response.data

def test_csv_export_requires_auth(client):
    """Тест что экспорт CSV требует аутентификации"""
    response = client.get('/export/pages-csv', follow_redirects=True)
    assert response.status_code == 200
    assert b'Login' in response.data

def test_csv_export_admin_access(client, admin_user, visit_logs):
    """Тест доступа администратора к экспорту CSV"""
    client.post('/login', data={
        'login': 'admin',
        'password': 'Admin123!'
    })
    
    response = client.get('/export/pages-csv')
    assert response.status_code == 200
    assert response.mimetype == 'text/csv'
    assert 'pages_report_' in response.headers['Content-Disposition']

def test_visit_log_model(app, admin_user):
    """Тест модели VisitLog"""
    with app.app_context():
        log = VisitLog(
            path='/test',
            user_id=admin_user.id
        )
        db.session.add(log)
        db.session.commit()
        
        assert log.id is not None
        assert log.path == '/test'
        assert log.user_id == admin_user.id
        assert log.created_at is not None
        assert log.user == admin_user 