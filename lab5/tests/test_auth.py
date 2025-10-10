import pytest
from app import create_app, db
from app.models import User, Role
from app.decorators import check_rights, require_admin, require_user_or_admin

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

def test_login_success(client, admin_user):
    response = client.post('/login', data={
        'login': 'admin',
        'password': 'Admin123!'
    }, follow_redirects=True)
    assert response.status_code == 200

def test_login_failure(client):
    response = client.post('/login', data={
        'login': 'wrong',
        'password': 'wrong'
    }, follow_redirects=True)
    assert b'Invalid login or password' in response.data

def test_logout(client, admin_user):
    # Сначала логинимся
    client.post('/login', data={
        'login': 'admin',
        'password': 'Admin123!'
    })
    
    # Затем выходим
    response = client.get('/logout', follow_redirects=True)
    assert response.status_code == 200

def test_change_password(client, admin_user):
    # Сначала логинимся
    client.post('/login', data={
        'login': 'admin',
        'password': 'Admin123!'
    })
    
    # Меняем пароль
    response = client.post('/change-password', data={
        'old_password': 'Admin123!',
        'new_password': 'NewPass123!',
        'confirm_password': 'NewPass123!'
    }, follow_redirects=True)
    assert response.status_code == 200

def test_user_permissions(admin_user, regular_user):
    """Тест проверки прав пользователей"""
    # Администратор должен иметь все права
    assert admin_user.can_create_users() == True
    assert admin_user.can_edit_users() == True
    assert admin_user.can_view_users() == True
    assert admin_user.can_delete_users() == True
    assert admin_user.can_view_visit_logs() == True
    
    # Обычный пользователь не должен иметь права администратора
    assert regular_user.can_create_users() == False
    assert regular_user.can_edit_users() == False
    assert regular_user.can_view_users() == False
    assert regular_user.can_delete_users() == False
    assert regular_user.can_view_visit_logs() == True

def test_role_checking(admin_user, regular_user):
    """Тест проверки ролей"""
    assert admin_user.has_role('admin') == True
    assert admin_user.has_role('user') == False
    assert regular_user.has_role('user') == True
    assert regular_user.has_role('admin') == False 