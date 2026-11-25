DevTrack Windows start + isolated demo authentication

1. Back up app.py, inspect git status and work on an auth feature branch.
2. In your activated venv install:
   python -m pip install Flask Flask-Login Flask-WTF python-dotenv waitress
3. Add SECRET_KEY to the local .env file; NEVER commit the .env file.
4. Copy run_devtrack.py, devtrack_auth.py into the root of the DevTrack project.
5. Copy templates/account_auth.html to the project's templates folder.
6. Copy static/account-auth.css to the project's static folder.
7. In app.py AFTER `app = Flask(...)` and BEFORE `if __name__ == '__main__':` add:

   from devtrack_auth import account_bp
   app.register_blueprint(account_bp)

   Add these lines only once. Your app.py must guard app.run:

   if __name__ == '__main__':
       app.run(host='127.0.0.1', port=5000, debug=False, use_reloader=False)

8. In an activated venv run:
   python -m py_compile app.py run_devtrack.py devtrack_auth.py
   python run_devtrack.py
9. Open http://127.0.0.1:5001/account/register
   Then test login, dashboard, logout, protected dashboard after logout.
10. The new account routes use /account/* and a SEPARATE SQLite file at
    instance/devtrack_accounts.sqlite3, and DO NOT integrate with an existing
    Flask-Login user model or the student progress dashboard automatically.
    Review integration with your existing authentication BEFORE merging to main.
11. Do NOT commit .env, venv/, instance/, or *.sqlite3 files.
