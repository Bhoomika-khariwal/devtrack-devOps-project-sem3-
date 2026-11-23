"""Isolated demo account registration/login for DevTrack.

Uses its own users table and a namespaced Flask session key. It does not replace
or automatically integrate an existing Flask-Login setup.
"""
from pathlib import Path
import re
import sqlite3

from flask import (
    Blueprint, abort, current_app, flash, redirect, render_template,
    request, session, url_for,
)
from flask_wtf.csrf import generate_csrf, validate_csrf
from werkzeug.security import check_password_hash, generate_password_hash
from wtforms.validators import ValidationError

account_bp = Blueprint('account', __name__, url_prefix='/account')


def db_connection():
    directory = Path(current_app.instance_path)
    directory.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(str(directory / 'devtrack_accounts.sqlite3'))
    connection.row_factory = sqlite3.Row
    connection.execute('''
        CREATE TABLE IF NOT EXISTS account_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE COLLATE NOCASE,
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    connection.commit()
    return connection


def check_csrf():
    try:
        validate_csrf(request.form.get('csrf_token', ''))
    except ValidationError:
        abort(400, description='Form expired or invalid. Refresh and retry.')


def page(mode, **kwargs):
    return render_template(
        'account_auth.html', mode=mode, csrf_value=generate_csrf(), **kwargs
    )


@account_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        check_csrf()
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm = request.form.get('confirm', '')

        if not re.fullmatch(r'[A-Za-z0-9_]{3,30}', username):
            flash('Username needs 3–30 letters, numbers, or underscores.', 'error')
        elif not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email):
            flash('Enter a valid email address.', 'error')
        elif len(password) < 8:
            flash('Password must contain at least 8 characters.', 'error')
        elif password != confirm:
            flash('Passwords do not match.', 'error')
        else:
            connection = db_connection()
            try:
                connection.execute(
                    'INSERT INTO account_users(username, email, password_hash) '
                    'VALUES (?, ?, ?)',
                    (username, email, generate_password_hash(password)),
                )
                connection.commit()
            except sqlite3.IntegrityError:
                flash('Username or email is already registered.', 'error')
            else:
                flash('Account created. Please log in.', 'success')
                return redirect(url_for('account.login'))
            finally:
                connection.close()

    return page('register')


@account_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        check_csrf()
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        connection = db_connection()
        try:
            user = connection.execute(
                'SELECT id, username, password_hash FROM account_users '
                'WHERE username = ? COLLATE NOCASE', (username,)
            ).fetchone()
        finally:
            connection.close()
        if user and check_password_hash(user['password_hash'], password):
            session['devtrack_account_user_id'] = user['id']
            return redirect(url_for('account.dashboard'))
        flash('Incorrect username or password.', 'error')

    return page('login')


@account_bp.route('/dashboard')
def dashboard():
    user_id = session.get('devtrack_account_user_id')
    if not user_id:
        return redirect(url_for('account.login'))

    connection = db_connection()
    try:
        user = connection.execute(
            'SELECT username FROM account_users WHERE id = ?', (user_id,)
        ).fetchone()
    finally:
        connection.close()
    if not user:
        session.pop('devtrack_account_user_id', None)
        return redirect(url_for('account.login'))
    return page('dashboard', username=user['username'])


@account_bp.route('/logout', methods=['POST'])
def logout():
    check_csrf()
    session.pop('devtrack_account_user_id', None)
    flash('You have been logged out.', 'success')
    return redirect(url_for('account.login'))
