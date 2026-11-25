
/* ======================================
   DEVTRACK STUDENT PROGRESS DASHBOARD
   Demo data - no database required yet
   ====================================== */

// Sample student information.
// Later this will come from Flask + SQLite.

const student = {
  xp: 550,

  modules: [
    {
      id: "devops",
      name: "DevOps Fundamentals",
      icon: "🚀",
      progress: 100
    },
    {
      id: "scm",
      name: "Software Configuration Management",
      icon: "📁",
      progress: 100
    },
    {
      id: "git",
      name: "Git & GitHub",
      icon: "🌿",
      progress: 0
    },
    {
      id: "cicd",
      name: "CI/CD & Automation",
      icon: "⚙️",
      progress: 0
    }
  ]
};

// ======================================
// PROGRESS CALCULATIONS
// ======================================

function calculateCompletedModules(modules) {
  return modules.filter(
    module => module.progress === 100
  ).length;
}

function calculateOverallProgress(modules) {
  if (modules.length === 0) return 0;

  const total = modules.reduce(
    (sum, module) => sum + module.progress,
    0
  );

  return Math.round(total / modules.length);
}

// Every 100 XP = 1 level
function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

// ======================================
// ACHIEVEMENT RULES
// ======================================

function getAchievements(student, completed) {
  return [
    {
      name: "First Steps",
      icon: "🎯",
      description: "Complete your first module",
      unlocked: completed >= 1
    },
    {
      name: "Learning Explorer",
      icon: "📚",
      description: "Complete two learning modules",
      unlocked: completed >= 2
    },
    {
      name: "XP Champion",
      icon: "⚡",
      description: "Earn 500 experience points",
      unlocked: student.xp >= 500
    },
    {
      name: "DevOps Master",
      icon: "🏆",
      description: "Complete all four modules",
      unlocked: completed === 4
    }
  ];
}

// ======================================
// RENDER DASHBOARD
// ======================================

function renderDashboard() {

  const completed = calculateCompletedModules(
    student.modules
  );

  const overall = calculateOverallProgress(
    student.modules
  );

  const level = calculateLevel(student.xp);

  // Statistics

  document.getElementById("xp").textContent =
    student.xp;

  document.getElementById("level").textContent =
    level;

  document.getElementById("completed").textContent =
    `${completed}/${student.modules.length}`;

  document.getElementById("overall").textContent =
    `${overall}%`;

  // Level progress

  const xpInCurrentLevel = student.xp % 100;
  const xpRemaining = 100 - xpInCurrentLevel;

  document.getElementById("levelText").textContent =
    `Level ${level}`;

  document.getElementById("nextLevelText").textContent =
    `${xpRemaining} XP needed to reach Level ${level + 1}`;

  document.getElementById("levelProgress").style.width =
    `${xpInCurrentLevel}%`;

  // Module cards

  const moduleList =
    document.getElementById("moduleList");

  moduleList.replaceChildren();

  student.modules.forEach(module => {
    const card = document.createElement("div");
    card.className = "sd-card sd-module-card";

    const icon = document.createElement("div");
    icon.className = "sd-module-icon";
    icon.textContent = module.icon;

    const heading = document.createElement("h3");
    heading.textContent = module.name;

    const status = document.createElement("p");
    status.className = "sd-module-status";
    status.textContent =
      module.progress === 100
        ? "Completed"
        : module.progress > 0
          ? "In Progress"
          : "Not Started";

    const percent = document.createElement("div");
    percent.className = "sd-module-percent";
    percent.textContent = `${module.progress}% Completed`;

    const progress = document.createElement("div");
    progress.className = "sd-progress";

    const fill = document.createElement("div");
    fill.className = "sd-progress-fill";
    fill.style.width = `${module.progress}%`;

    progress.appendChild(fill);
    card.append(icon, heading, status, percent, progress);
    moduleList.appendChild(card);
  });

  // Achievement cards

  const achievements = getAchievements(
    student,
    completed
  );

  const badgeList =
    document.getElementById("badgeList");

  badgeList.replaceChildren();

  achievements.forEach(badge => {
    const card = document.createElement("div");

    card.className =
      "sd-card sd-badge-card " +
      (badge.unlocked ? "sd-unlocked" : "sd-locked");

    const icon = document.createElement("div");
    icon.className = "sd-badge-icon";
    icon.textContent = badge.unlocked ? badge.icon : "🔒";

    const heading = document.createElement("h3");
    heading.textContent = badge.name;

    const description = document.createElement("p");
    description.textContent = badge.description;

    const status = document.createElement("p");
    status.textContent =
      badge.unlocked ? "Unlocked ✓" : "Locked";

    card.append(icon, heading, description, status);
    badgeList.appendChild(card);
  });

  const unlockedCount = achievements.filter(
    badge => badge.unlocked
  ).length;

  document.getElementById("badgeCount").textContent =
    `${unlockedCount}/${achievements.length} Badges Unlocked`;
}

// Start rendering when the HTML is ready.

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    renderDashboard
  );
} else {
  renderDashboard();
}
