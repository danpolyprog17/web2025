from flask import Blueprint, render_template, request, send_file, jsonify
from flask_login import login_required, current_user
from app.models import VisitLog, User
from app.decorators import require_user_or_admin
from app import db
from sqlalchemy import func, desc
import csv
import io
from datetime import datetime

bp = Blueprint('reports', __name__)

@bp.route('/visit-logs')
@require_user_or_admin
def visit_logs():
    """Главная страница журнала посещений"""
    page = request.args.get('page', 1, type=int)
    per_page = 20
    
    # Администраторы видят все записи, пользователи - только свои
    if current_user.has_role('admin'):
        query = VisitLog.query
    else:
        query = VisitLog.query.filter_by(user_id=current_user.id)
    
    # Сортировка по убыванию даты
    logs = query.order_by(desc(VisitLog.created_at)).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return render_template('reports/visit_logs.html', logs=logs)

@bp.route('/reports/pages')
@require_user_or_admin
def pages_report():
    """Отчёт по посещениям страниц"""
    # Получаем статистику по страницам
    stats = db.session.query(
        VisitLog.path,
        func.count(VisitLog.id).label('count')
    ).group_by(VisitLog.path).order_by(desc('count')).all()
    
    return render_template('reports/pages_report.html', stats=stats)

@bp.route('/reports/users')
@require_user_or_admin
def users_report():
    """Отчёт по посещениям пользователей"""
    # Получаем статистику по пользователям
    stats = db.session.query(
        User.id,
        User.first_name,
        User.last_name,
        User.middle_name,
        func.count(VisitLog.id).label('count')
    ).outerjoin(VisitLog, User.id == VisitLog.user_id).group_by(
        User.id, User.first_name, User.last_name, User.middle_name
    ).order_by(desc('count')).all()
    
    # Добавляем статистику для неаутентифицированных пользователей
    anonymous_count = db.session.query(func.count(VisitLog.id)).filter(
        VisitLog.user_id.is_(None)
    ).scalar()
    
    return render_template('reports/users_report.html', stats=stats, anonymous_count=anonymous_count)

@bp.route('/export/pages-csv')
@require_user_or_admin
def export_pages_csv():
    """Экспорт отчёта по страницам в CSV"""
    # Получаем статистику по страницам
    stats = db.session.query(
        VisitLog.path,
        func.count(VisitLog.id).label('count')
    ).group_by(VisitLog.path).order_by(desc('count')).all()
    
    # Создаем CSV в памяти
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['№', 'Страница', 'Количество посещений'])
    
    for i, (path, count) in enumerate(stats, 1):
        writer.writerow([i, path, count])
    
    output.seek(0)
    
    return send_file(
        io.BytesIO(output.getvalue().encode('utf-8')),
        mimetype='text/csv',
        as_attachment=True,
        download_name=f'pages_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    )

@bp.route('/export/users-csv')
@require_user_or_admin
def export_users_csv():
    """Экспорт отчёта по пользователям в CSV"""
    # Получаем статистику по пользователям
    stats = db.session.query(
        User.id,
        User.first_name,
        User.last_name,
        User.middle_name,
        func.count(VisitLog.id).label('count')
    ).outerjoin(VisitLog, User.id == VisitLog.user_id).group_by(
        User.id, User.first_name, User.last_name, User.middle_name
    ).order_by(desc('count')).all()
    
    # Добавляем статистику для неаутентифицированных пользователей
    anonymous_count = db.session.query(func.count(VisitLog.id)).filter(
        VisitLog.user_id.is_(None)
    ).scalar()
    
    # Создаем CSV в памяти
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['№', 'Пользователь', 'Количество посещений'])
    
    # Записываем пользователей
    for i, (user_id, first_name, last_name, middle_name, count) in enumerate(stats, 1):
        if count > 0:  # Только пользователи с посещениями
            full_name = ' '.join(filter(None, [last_name, first_name, middle_name]))
            writer.writerow([i, full_name, count])
    
    # Записываем неаутентифицированных пользователей
    if anonymous_count > 0:
        writer.writerow([len(stats) + 1, 'Unauthenticated user', anonymous_count])
    
    output.seek(0)
    
    return send_file(
        io.BytesIO(output.getvalue().encode('utf-8')),
        mimetype='text/csv',
        as_attachment=True,
        download_name=f'users_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    ) 