"""Safely initialize progress tables in the *existing* DevTrack login DB.

Run once (safe to rerun when the SQL uses IF NOT EXISTS):
    python database/init_progress_db.py
"""

import sqlite3
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "instance" / "devtrack.db"
SCHEMA_PATH = ROOT / "database" / "progress_schema.sql"

if not DB_PATH.is_file():
    raise SystemExit(f"STOP: Existing login DB not found: {DB_PATH}")
if not SCHEMA_PATH.is_file():
    raise SystemExit(f"STOP: Schema file not found: {SCHEMA_PATH}")

conn = sqlite3.connect(str(DB_PATH))
try:
    cols = conn.execute("PRAGMA table_info(students)").fetchall()
    if not any(row[1] == "id" and row[5] > 0 for row in cols):
        raise SystemExit("STOP: students table / primary key does not match.")

    # SQLite's online backup API safely captures an existing database.
    backup_path = DB_PATH.with_name(
        f"devtrack_backup_{datetime.now():%Y%m%d_%H%M%S_%f}.db"
    )
    backup = sqlite3.connect(str(backup_path))
    try:
        conn.backup(backup)
    finally:
        backup.close()
    print(f"Database backup created: {backup_path}")

    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    conn.commit()

    names = {
        row[0]
        for row in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"
        )
    }
    required = {
        "student_module_progress", "student_quiz_attempts",
        "student_xp_awards", "student_badges"
    }
    if not required.issubset(names):
        raise RuntimeError(f"Missing tables: {required - names}")
    print("SUCCESS: Four progress tables are available in instance/devtrack.db")
finally:
    conn.close()
