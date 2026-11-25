import os
import sqlite3
from urllib.parse import urlparse

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

# ---------- Security config ----------
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
if not app.config["SECRET_KEY"]:
    raise RuntimeError("Set SECRET_KEY in your .env file")

app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = (
    os.environ.get("COOKIE_SECURE", "false").lower() == "true"
)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
login_manager.login_message = "Please log in to access your lessons."

csrf = CSRFProtect(app)

# ---------- Database ----------
os.makedirs(app.instance_path, exist_ok=True)
DATABASE = os.path.join(app.instance_path, "devtrack.db")


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


with app.app_context():
    init_db()


# ---------- User model ----------
class User(UserMixin):
    def __init__(self, student):
        self.id = student["id"]
        self.username = student["username"]
        self.email = student["email"]
        self.password_hash = student["password_hash"]


@login_manager.user_loader
def load_user(user_id):
    student = get_db().execute(
        "SELECT * FROM students WHERE id = ?", (user_id,)
    ).fetchone()
    return User(student) if student else None


def is_safe_next(target):
    """Only allow redirects to paths inside this site."""
    if not target or "\\" in target:
        return False
    parsed = urlparse(target)
    return (
        target.startswith("/")
        and not target.startswith("//")
        and not parsed.netloc
        and not parsed.scheme
    )


# ---------- Public pages ----------
@app.route("/")
def intro():
    return render_template("intro.html")


@app.route("/home")
def home():
    return render_template("home.html")


# ---------- Auth ----------
@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("lessons"))

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

        db = get_db()
        try:
            db.execute(
                "INSERT INTO students (username, email, password_hash) "
                "VALUES (?, ?, ?)",
                (username, email, generate_password_hash(password)),
            )
            db.commit()
            flash("Registration successful! Please log in.")
            return redirect(url_for("login"))
        except sqlite3.IntegrityError:
            db.rollback()
            flash("Username or email is already registered.")

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("lessons"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        student = get_db().execute(
            "SELECT * FROM students WHERE email = ?", (email,)
        ).fetchone()

        if student and check_password_hash(student["password_hash"], password):
            login_user(User(student))
            next_url = request.args.get("next")
            if is_safe_next(next_url):
                return redirect(next_url)
            return redirect(url_for("lessons"))

        flash("Invalid email or password.")

    return render_template("login.html")


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    flash("You have successfully logged out.")
    return redirect(url_for("login"))


@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html", username=current_user.username)


# ---------- Protected lessons ----------
@app.get("/lessons")
@login_required
def lessons():
    return render_template("lessons.html")


@app.route("/lessons/devops-basics")
@login_required
def devops_basics():
    return render_template("devops_basics.html")


@app.route("/lessons/scm-basics")
@login_required
def scm_basics():
    return render_template("scm_basics.html")


@app.route("/lessons/devops-basics/quiz")
@login_required
def quiz():
    return render_template("quiz.html")


@app.route("/lessons/git-github")
@login_required
def git_github():
    return render_template("git_github.html")


@app.route("/lessons/cicd")
@login_required
def cicd():
    return render_template("cicd.html")


# ==============================
# STUDENT PROGRESS API
# ==============================

from progress_api import progress_bp

app.register_blueprint(progress_bp)

# ========================================
# STUDENT PROGRESS DASHBOARD PAGE
# ========================================

@app.route("/student-dashboard")
@login_required
def student_dashboard():
    return render_template("student_dashboard.html")


if __name__ == "__main__":
    app.run(debug=True) 