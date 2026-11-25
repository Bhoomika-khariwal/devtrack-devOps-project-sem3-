
-- DEVTRACK STUDENT PROGRESS DATABASE
-- These tables extend the existing authentication system.
-- They do not create new login accounts.

-- 1. Module progress
CREATE TABLE IF NOT EXISTS student_module_progress (
    user_id INTEGER NOT NULL,
    module_key TEXT NOT NULL
        CHECK (module_key IN ('devops', 'scm', 'git', 'cicd')),
    progress_percent INTEGER NOT NULL DEFAULT 0
        CHECK (progress_percent BETWEEN 0 AND 100),
    completed_at TEXT,
    PRIMARY KEY (user_id, module_key)
);

-- 2. Quiz attempts
CREATE TABLE IF NOT EXISTS student_quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    module_key TEXT NOT NULL
        CHECK (module_key IN ('devops', 'scm', 'git', 'cicd')),
    score INTEGER NOT NULL CHECK (score >= 0),
    total_questions INTEGER NOT NULL
        CHECK (total_questions > 0),
    submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (score <= total_questions)
);

CREATE INDEX IF NOT EXISTS idx_student_quiz_user_module
ON student_quiz_attempts (user_id, module_key);

-- 3. XP rewards
CREATE TABLE IF NOT EXISTS student_xp_awards (
    user_id INTEGER NOT NULL,
    award_key TEXT NOT NULL,
    points INTEGER NOT NULL CHECK (points > 0),
    awarded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, award_key)
);

-- 4. Achievement badges
CREATE TABLE IF NOT EXISTS student_badges (
    user_id INTEGER NOT NULL,
    badge_key TEXT NOT NULL,
    earned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_key)
);
