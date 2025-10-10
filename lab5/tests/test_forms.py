import pytest
from app import create_app, db
from app.models import User, Role
from app.forms import LoginForm, UserForm, EditUserForm, ChangePasswordForm

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

def test_login_form_validation(app):
    """Тест валидации формы входа"""
    with app.app_context():
        form = LoginForm()
        
        # Форма должна быть невалидна без данных
        assert not form.validate()
        
        # Форма должна быть валидна с корректными данными
        form.login.data = 'testuser'
        form.password.data = 'testpass'
        assert form.validate()

def test_user_form_validation(app, admin_role):
    """Тест валидации формы создания пользователя"""
    with app.app_context():
        form = UserForm()
        
        # Форма должна быть невалидна без данных
        assert not form.validate()
        
        # Форма должна быть валидна с корректными данными
        form.login.data = 'testuser'
        form.password.data = 'TestPass123!'
        form.first_name.data = 'Test'
        form.last_name.data = 'User'
        form.role_id.data = admin_role.id
        assert form.validate()

def test_user_form_login_validation(app):
    """Тест валидации логина в форме пользователя"""
    with app.app_context():
        form = UserForm()
        
        # Логин должен содержать только латинские буквы и цифры
        form.login.data = 'test@123'  # Невалидный логин
        form.password.data = 'TestPass123!'
        form.first_name.data = 'Test'
        form.role_id.data = 1
        assert not form.validate()
        
        # Корректный логин
        form.login.data = 'testuser123'
        assert form.validate()

def test_user_form_password_validation(app):
    """Тест валидации пароля в форме пользователя"""
    with app.app_context():
        form = UserForm()
        
        # Пароль должен соответствовать требованиям
        form.login.data = 'testuser'
        form.password.data = 'weak'  # Слишком короткий
        form.first_name.data = 'Test'
        form.role_id.data = 1
        assert not form.validate()
        
        # Корректный пароль
        form.password.data = 'TestPass123!'
        assert form.validate()

def test_edit_user_form_validation(app, admin_role):
    """Тест валидации формы редактирования пользователя"""
    with app.app_context():
        form = EditUserForm()
        
        # Форма должна быть невалидна без данных
        assert not form.validate()
        
        # Форма должна быть валидна с корректными данными
        form.first_name.data = 'Updated'
        form.last_name.data = 'User'
        form.role_id.data = admin_role.id
        assert form.validate()

def test_change_password_form_validation(app):
    """Тест валидации формы смены пароля"""
    with app.app_context():
        form = ChangePasswordForm()
        
        # Форма должна быть невалидна без данных
        assert not form.validate()
        
        # Форма должна быть валидна с корректными данными
        form.old_password.data = 'OldPass123!'
        form.new_password.data = 'NewPass123!'
        form.confirm_password.data = 'NewPass123!'
        assert form.validate()

def test_change_password_form_password_mismatch(app):
    """Тест несовпадения паролей в форме смены пароля"""
    with app.app_context():
        form = ChangePasswordForm()
        
        form.old_password.data = 'OldPass123!'
        form.new_password.data = 'NewPass123!'
        form.confirm_password.data = 'DifferentPass123!'  # Несовпадающий пароль
        assert not form.validate()

def test_user_form_role_choices(app, admin_role, user_role):
    """Тест выбора ролей в форме пользователя"""
    with app.app_context():
        form = UserForm()
        form.role_id.choices = [(r.id, r.name) for r in Role.query.all()]
        
        # Должны быть доступны все роли
        assert len(form.role_id.choices) == 2
        assert (admin_role.id, 'admin') in form.role_id.choices
        assert (user_role.id, 'user') in form.role_id.choices 