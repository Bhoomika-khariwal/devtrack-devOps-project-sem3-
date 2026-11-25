"""Isolated endpoint tests. No real student DB or server needed."""
import sqlite3
from pathlib import Path

from flask import Flask
from flask_login import LoginManager, UserMixin
from progress_api import progress_bp


class TestStudent(UserMixin):
    id = "1"
    username = "demo_student"


def make_app(tmp_path):
    app = Flask(__name__, instance_path=str(tmp_path))
    app.config.update(SECRET_KEY="test-only-not-for-production", TESTING=True)
    manager = LoginManager()
    manager.init_app(app)
    student = TestStudent()

    @manager.user_loader
    def load_student(user_id):
        return student if user_id == "1" else None

    app.register_blueprint(progress_bp)

    db_path = tmp_path / "devtrack.db"
    conn = sqlite3.connect(str(db_path))
    conn.execute("CREATE TABLE students (id INTEGER PRIMARY KEY, username TEXT)")
    conn.execute("INSERT INTO students(id, username) VALUES(1, 'demo_student')")
    schema = (Path(__file__).resolve().parents[1] /
              "database" / "progress_schema.sql")
    conn.executescript(schema.read_text(encoding="utf-8"))
    conn.commit()
    conn.close()
    return app


def login_test_client(client):
    with client.session_transaction() as sess:
        sess["_user_id"] = "1"
        sess["_fresh"] = True


def test_logged_out_request_is_401(tmp_path):
    app = make_app(tmp_path)
    with app.test_client() as client:
        res = client.get("/api/me/progress")
        assert res.status_code == 401
        assert res.is_json


def test_new_student_has_zero_progress(tmp_path):
    app = make_app(tmp_path)
    with app.test_client() as client:
        login_test_client(client)
        res = client.get("/api/me/progress")
        assert res.status_code == 200
        data = res.get_json()
        assert data["username"] == "demo_student"
        assert data["total_xp"] == 0
        assert data["level"] == 1
        assert data["completed_modules"] == 0
        assert data["overall_progress"] == 0
        assert data["badges"] == []
        assert len(data["modules"]) == 4
        assert set(data["modules"][0]) == {
            "module_id", "name", "progress", "completed",
            "best_quiz_score", "quiz_total"
        }


def test_saved_records_are_returned(tmp_path):
    app = make_app(tmp_path)
    conn = sqlite3.connect(str(tmp_path / "devtrack.db"))
    conn.execute(
        "INSERT INTO student_module_progress "
        "(user_id, module_key, progress_percent) VALUES (1, 'devops', 100)"
    )
    conn.execute(
        "INSERT INTO student_quiz_attempts "
        "(user_id, module_key, score, total_questions) "
        "VALUES (1, 'devops', 12, 15)"
    )
    conn.execute(
        "INSERT INTO student_xp_awards "
        "(user_id, award_key, points) VALUES (1, 'module:devops', 50)"
    )
    conn.execute(
        "INSERT INTO student_badges (user_id, badge_key) "
        "VALUES (1, 'first_steps')"
    )
    conn.commit()
    conn.close()
    with app.test_client() as client:
        login_test_client(client)
        res = client.get("/api/me/progress")
        assert res.status_code == 200
        data = res.get_json()
        assert data["total_xp"] == 50
        assert data["completed_modules"] == 1
        assert data["overall_progress"] == 25
        assert data["modules"][0]["best_quiz_score"] == 12
        assert data["badges"] == ["first_steps"]
