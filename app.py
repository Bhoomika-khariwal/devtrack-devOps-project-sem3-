import os
import sqlite3
from flask import (
    Flask, render_template, request, redirect,
    url_for, flash, g
)

app = Flask(__name__)

@app.route("/")
def intro():
    return render_template("intro.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.get("/lessons")
def lessons():
    return render_template("lessons.html")

@app.route("/lessons/devops-basics")
def devops_basics():
    return render_template("devops_basics.html")

@app.route("/lessons/scm-basics")
def scm_basics():
    return render_template("scm_basics.html")

@app.route("/lessons/devops-basics/quiz")
def quiz():
    return render_template("quiz.html")

@app.route("/lessons/git-github")
def git_github():
    return render_template("git_github.html")

@app.route("/lessons/cicd")
def cicd():
    return render_template("cicd.html")


if __name__ == "__main__":
    app.run(debug=True)

import os
import sqlite3

from flask import (
    Flask, render_template, request,
    redirect, url_for, flash, g
)

from flask_login import (
    LoginManager, UserMixin,
    login_user, login_required, logout_user, current_user
)
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Security configuration
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

if not app.config["SECRET_KEY"]:
    raise RuntimeError("Set SECRET_KEY in your .env file")

app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = (
    os.environ.get("COOKIE_SECURE", "false").lower() == "true"
)

# Authentication and CSRF protection
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
login_manager.login_message = "Please log in to access this page."

csrf = CSRFProtect(app)

# SQLite database location
os.makedirs(app.instance_path, exist_ok=True)
DATABASE = os.path.join(app.instance_path, "devtrack.db")


# Database connection
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(error=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


# Create database table
def init_db():
    db = get_db()
    db.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE COLLATE NOCASE,
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    db.commit()


# Student user model
class User(UserMixin):
    def __init__(self, student):
        self.id = student["id"]
        self.username = student["username"]
        self.email = student["email"]
        self.password_hash = student["password_hash"]


@login_manager.user_loader
def load_user(user_id):
    db = get_db()
    student = db.execute(
        "SELECT * FROM students WHERE id = ?",
        (user_id,)
    ).fetchone()

    return User(student) if student else None


# Registration route
@app.route("/register", methods=["GET", "POST"])
def register():

    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))

    if request.method == "POST":

        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        if not 3 <= len(username) <= 30:
            flash("Username must be between 3 and 30 characters.")
            return render_template("register.html")

        if len(email) > 254 or "@" not in email:
            flash("Please enter a valid email address.")
            return render_template("register.html")

        if len(password) < 8:
            flash("Password must contain at least 8 characters.")
            return render_template("register.html")

        # Hash the password before storing it
        password_hash = generate_password_hash(password)

        db = get_db()

        try:
            db.execute("""
                INSERT INTO students (username, email, password_hash)
                VALUES (?, ?, ?)
            """, (username, email, password_hash))

            db.commit()

            flash("Registration successful! Please log in.")
            return redirect(url_for("login"))

        except sqlite3.IntegrityError:
            db.rollback()
            flash("Username or email is already registered.")

    return render_template("register.html")


# Login route
@app.route("/login", methods=["GET", "POST"])
def login():

    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))

    if request.method == "POST":

        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        db = get_db()

        student = db.execute(
            "SELECT * FROM students WHERE email = ?",
            (email,)
        ).fetchone()

        if student and check_password_hash(
            student["password_hash"], password
        ):
            user = User(student)
            login_user(user)

            return redirect(url_for("dashboard"))

        flash("Invalid email or password.")

    return render_template("login.html")


# Protected student dashboard
@app.route("/dashboard")
@login_required
def dashboard():
    return render_template(
        "dashboard.html",
        username=current_user.username
    )


# Logout route
@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    flash("You have successfully logged out.")
    return redirect(url_for("login"))


# Keep your existing homepage and lesson routes here.


if __name__ == "__main__":
    with app.app_context():
        init_db()

    app.run(debug=True)
