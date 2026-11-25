
import sqlite3
from pathlib import Path

import pytest


SCHEMA_PATH = (
    Path(__file__).resolve().parents[1]
    / "database"
    / "progress_schema.sql"
)


@pytest.fixture
def db():
    connection = sqlite3.connect(":memory:")

    connection.executescript(
        SCHEMA_PATH.read_text(encoding="utf-8")
    )

    yield connection

    connection.close()


def test_progress_tables_exist(db):
    rows = db.execute(
        "SELECT name FROM sqlite_master "
        "WHERE type='table'"
    ).fetchall()

    names = {row[0] for row in rows}

    assert "student_module_progress" in names
    assert "student_quiz_attempts" in names
    assert "student_xp_awards" in names
    assert "student_badges" in names


def test_duplicate_xp_prevention(db):
    db.execute(
        "INSERT INTO student_xp_awards "
        "(user_id, award_key, points) "
        "VALUES (?, ?, ?)",
        (1, "module:devops", 50)
    )

    db.execute(
        "INSERT OR IGNORE INTO student_xp_awards "
        "(user_id, award_key, points) "
        "VALUES (?, ?, ?)",
        (1, "module:devops", 50)
    )

    result = db.execute(
        "SELECT COUNT(*), SUM(points) "
        "FROM student_xp_awards WHERE user_id = ?",
        (1,)
    ).fetchone()

    assert result == (1, 50)


def test_invalid_quiz_score_rejected(db):
    with pytest.raises(sqlite3.IntegrityError):
        db.execute(
            "INSERT INTO student_quiz_attempts "
            "(user_id, module_key, score, total_questions) "
            "VALUES (?, ?, ?, ?)",
            (1, "devops", 16, 15)
        )
