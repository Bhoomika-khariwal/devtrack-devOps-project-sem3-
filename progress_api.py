"""Read-only progress API for the existing Flask-Login + SQLite DevTrack app.

Requires the current DevTrack schema (database/progress_schema.sql) to be
initialized into instance/devtrack.db first. This module does not grant XP.
"""

import sqlite3
from pathlib import Path

from flask import Blueprint, current_app, jsonify
from flask_login import current_user

progress_bp = Blueprint("progress_api", __name__)

MODULES = [
    ("devops", "DevOps Fundamentals"),
    ("scm", "Software Configuration Management"),
    ("git", "Git & GitHub"),
    ("cicd", "CI/CD & Automation"),
]


@progress_bp.get("/api/me/progress")
def get_my_progress():
    # JSON 401, not an HTML redirect to /login.
    if not current_user.is_authenticated:
        return jsonify({"error": "Login required"}), 401

    try:
        user_id = int(current_user.get_id())
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid login session"}), 401

    db_path = Path(current_app.instance_path) / "devtrack.db"
    if not db_path.is_file():
        return jsonify({"error": "Progress database not initialized"}), 503

    conn = None
    try:
        # Open the existing authentication database read-only.
        conn = sqlite3.connect(db_path.resolve().as_uri() + "?mode=ro", uri=True)
        conn.row_factory = sqlite3.Row

        student = conn.execute(
            "SELECT username FROM students WHERE id = ?", (user_id,)
        ).fetchone()
        if student is None:
            return jsonify({"error": "Student account not found"}), 404

        progress_rows = conn.execute(
            "SELECT module_key, progress_percent "
            "FROM student_module_progress WHERE user_id = ?", (user_id,)
        ).fetchall()
        progress_by_module = {
            row["module_key"]: int(row["progress_percent"])
            for row in progress_rows
        }

        attempt_rows = conn.execute(
            "SELECT module_key, score, total_questions "
            "FROM student_quiz_attempts WHERE user_id = ?", (user_id,)
        ).fetchall()
        best_attempts = {}
        for row in attempt_rows:
            key = row["module_key"]
            score = int(row["score"])
            total = int(row["total_questions"])
            if total <= 0:
                continue
            previous = best_attempts.get(key)
            # Compare percentages accurately, even if quiz lengths vary.
            if (previous is None
                    or score * previous[1] > previous[0] * total
                    or (score * previous[1] == previous[0] * total
                        and score > previous[0])):
                best_attempts[key] = (score, total)

        xp_row = conn.execute(
            "SELECT COALESCE(SUM(points), 0) AS total "
            "FROM student_xp_awards WHERE user_id = ?", (user_id,)
        ).fetchone()
        total_xp = int(xp_row["total"])

        badge_rows = conn.execute(
            "SELECT badge_key FROM student_badges "
            "WHERE user_id = ? ORDER BY badge_key", (user_id,)
        ).fetchall()
        badges = [row["badge_key"] for row in badge_rows]

        modules = []
        for module_id, name in MODULES:
            percent = progress_by_module.get(module_id, 0)
            best = best_attempts.get(module_id)
            modules.append({
                "module_id": module_id,
                "name": name,
                "progress": percent,
                "completed": percent == 100,
                "best_quiz_score": best[0] if best else None,
                "quiz_total": best[1] if best else None,
            })

        return jsonify({
            "username": student["username"],
            "total_xp": total_xp,
            "level": (total_xp // 100) + 1,
            "completed_modules": sum(module["completed"] for module in modules),
            "overall_progress": round(sum(module["progress"] for module in modules) / 4),
            "modules": modules,
            "badges": badges,
        })

    except sqlite3.Error:
        current_app.logger.exception("Could not load student progress")
        return jsonify({"error": "Progress data unavailable"}), 503
    finally:
        if conn is not None:
            conn.close()
