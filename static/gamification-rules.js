
/*
 DEVTRACK - GAMIFICATION RULES

 Frontend calculation utilities.

 IMPORTANT:
 Permanent XP must be calculated and
 validated by the Flask backend.
*/

(function () {
  "use strict";

  // XP rewards agreed by the development team

  const XP_REWARDS = Object.freeze({
    moduleCompleted: 50,
    quizPassed: 30,
    highQuizScore: 20,
    challengeCompleted: 25,
    allModulesCompleted: 100
  });

  const XP_PER_LEVEL = 100;

  // Make sure XP is valid

  function normalizeXP(xp) {
    const value = Number(xp);

    if (!Number.isFinite(value) || value < 0) {
      return 0;
    }

    return Math.floor(value);
  }

  // Calculate current student level

  function getLevel(xp) {
    const safeXP = normalizeXP(xp);

    return Math.floor(safeXP / XP_PER_LEVEL) + 1;
  }

  // Calculate progress toward next level

  function getLevelProgress(xp) {
    const safeXP = normalizeXP(xp);

    const level = getLevel(safeXP);

    const progressXP = safeXP % XP_PER_LEVEL;

    return {
      level: level,
      progressPercent: progressXP,
      remainingXP: XP_PER_LEVEL - progressXP,
      nextLevel: level + 1
    };
  }

  // Calculate learning module progress

  function summarizeModules(modules) {
    if (!Array.isArray(modules) ||
        modules.length === 0) {
      return {
        completed: 0,
        total: 0,
        overall: 0
      };
    }

    let completed = 0;
    let totalProgress = 0;

    modules.forEach(function (module) {
      const value = Number(module.progress);

      const progress = Number.isFinite(value)
        ? Math.max(0, Math.min(100, value))
        : 0;

      totalProgress += progress;

      // Explicit completion flag takes priority.
      // Existing demo modules use 100% as completion.

      const isCompleted =
        module.completed === true ||
        (
          typeof module.completed !== "boolean" &&
          progress === 100
        );

      if (isCompleted) {
        completed++;
      }
    });

    return {
      completed: completed,
      total: modules.length,
      overall: Math.round(
        totalProgress / modules.length
      )
    };
  }

  // Calculate visual achievement status

  function getBadges(data) {
    const totalXP = normalizeXP(data.totalXP);

    const completedModules =
      Number(data.completedModules) || 0;

    const totalModules =
      Number(data.totalModules) || 4;

    const bestQuizPercent =
      Number(data.bestQuizPercent) || 0;

    return [
      {
        id: "first_steps",
        name: "First Steps",
        icon: "🎯",
        unlocked: completedModules >= 1
      },
      {
        id: "learning_explorer",
        name: "Learning Explorer",
        icon: "📚",
        unlocked: completedModules >= 2
      },
      {
        id: "quiz_champion",
        name: "Quiz Champion",
        icon: "🏅",
        unlocked: bestQuizPercent >= 80
      },
      {
        id: "xp_champion",
        name: "XP Champion",
        icon: "⚡",
        unlocked: totalXP >= 500
      },
      {
        id: "devops_master",
        name: "DevOps Master",
        icon: "🏆",
        unlocked:
          totalModules === 4 &&
          completedModules === 4
      }
    ];
  }

  // Expose reusable functions for the dashboard

  window.DevTrackGamification = Object.freeze({
    XP_REWARDS,
    getLevel,
    getLevelProgress,
    summarizeModules,
    getBadges
  });

})();
