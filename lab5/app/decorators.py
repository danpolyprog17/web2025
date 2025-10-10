from functools import wraps
from flask import redirect, url_for, flash
from flask_login import current_user, login_required

def check_rights(right_checker):
    """
    Декоратор для проверки прав пользователя.
    
    Args:
        right_checker: Функция, которая принимает current_user и возвращает True/False
    """
    def decorator(f):
        @wraps(f)
        @login_required
        def decorated_function(*args, **kwargs):
            if not right_checker(current_user):
                flash('У вас недостаточно прав для доступа к данной странице.', 'error')
                return redirect(url_for('main.index'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Предопределенные проверки прав
def require_admin(f):
    """Декоратор для проверки роли администратора"""
    return check_rights(lambda user: user.has_role('admin'))(f)

def require_user_or_admin(f):
    """Декоратор для проверки роли пользователя или администратора"""
    return check_rights(lambda user: user.has_role('user') or user.has_role('admin'))(f) 