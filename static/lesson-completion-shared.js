
/*
 DEVTRACK - SHARED LESSON COMPLETION TRACKER

 Modules:
 SCM, Git & GitHub, CI/CD

 Frontend demo only.
 Progress resets when the page reloads.

 Permanent progress saving will be
 connected to Ayush's backend later.
*/

(function () {
  "use strict";

  // Read module ID from the script tag.
  const scriptTag = document.currentScript;

  const moduleId = scriptTag
    ? scriptTag.dataset.moduleId
    : null;

  // Explicit section IDs based on the
  // existing HTML templates.
  //
  // Summary and final quiz are excluded.
  // These IDs must remain stable for
  // future database integration.

  const REQUIRED_SECTIONS = {
    scm: [
      "introduction",
      "objectives",
      "items",
      "process",
      "baselines",
      "version-control",
      "vcs-types",
      "change-control",
      "branching",
      "comparison",
      "workflow",
      "practice"
    ],

    git: [
      "intro",
      "setup",
      "architecture",
      "repository",
      "commits",
      "branches",
      "merging",
      "remotes",
      "collaboration",
      "undo",
      "advanced",
      "platforms",
      "simulator",
      "practice"
    ],

    cicd: [
      "intro",
      "comparison",
      "pipeline",
      "actions",
      "yaml",
      "triggers",
      "secrets",
      "testing",
      "deploy",
      "monitor",
      "simulator",
      "practice"
    ]
  };

  const requiredIds = REQUIRED_SECTIONS[moduleId];

  if (!requiredIds) {
    console.error(
      "DevTrack: invalid module ID:",
      moduleId
    );
    return;
  }

  function initializeTracker() {

    const page = document.querySelector(
      ".learning-page"
    );

    if (!page) {
      console.error(
        "DevTrack: learning page not found"
      );
      return;
    }

    // Prevent duplicate trackers.
    if (page.querySelector(".dtc-overview")) {
      console.warn(
        "DevTrack: tracker already exists"
      );
      return;
    }

    // Locate every required section by
    // its stable HTML id.
    const sections = requiredIds.map(
      function (sectionId) {
        const section = document.getElementById(
          sectionId
        );

        if (
          !section ||
          !page.contains(section) ||
          !section.classList.contains("learning-section")
        ) {
          return null;
        }

        return section;
      }
    );

    if (sections.some(section => !section)) {
      console.error(
        "DevTrack: some required sections " +
        "were not found. Check section IDs."
      );
      return;
    }

    // In-memory completion tracking.
    const completedLessons = new Set();

    // Create the tracker overview.
    const overview = document.createElement("div");
    overview.className = "dtc-overview";
    overview.dataset.trackerModule = moduleId;

    overview.innerHTML = `
      <div class="dtc-heading-row">
        <div>
          <h2>Lesson Completion Tracker</h2>
          <p>
            Mark each learning section after studying it.
          </p>
        </div>
        <span class="dtc-demo-tag">
          DEMO ONLY
        </span>
      </div>

      <div class="dtc-numbers">
        <strong data-dtc-count aria-live="polite">
          0 lessons completed
        </strong>
        <strong data-dtc-percent>
          0% module progress
        </strong>
      </div>

      <div class="dtc-progress-track"
           role="progressbar"
           aria-label="Module completion progress"
           aria-valuemin="0"
           aria-valuemax="100"
           aria-valuenow="0">
        <div class="dtc-progress-fill"
             data-dtc-fill></div>
      </div>

      <p class="dtc-explanation">
        Learning sections contribute 80% of module
        progress. Passing the final quiz contributes
        the remaining 20%.
      </p>

      <p class="dtc-warning">
        Demo mode: progress is not saved and will
        reset when you refresh the page.
      </p>

      <button type="button"
              class="dtc-reset"
              data-dtc-reset>
        Reset Demo Progress
      </button>
    `;

    // Place overview before first required section.
    sections[0].insertAdjacentElement(
      "beforebegin",
      overview
    );

    const countText = overview.querySelector(
      "[data-dtc-count]"
    );

    const percentText = overview.querySelector(
      "[data-dtc-percent]"
    );

    const progressFill = overview.querySelector(
      "[data-dtc-fill]"
    );

    const progressTrack = overview.querySelector(
      ".dtc-progress-track"
    );

    const buttons = [];

    // Add a completion button to each section.
    sections.forEach(function (section) {

      const heading = section.querySelector(
        "h2, h3"
      );

      // Stable identifier for backend use.
      const sectionKey =
        moduleId + ":" + section.id;

      const container = document.createElement(
        "div"
      );

      container.className =
        "dtc-action-container";

      const button = document.createElement(
        "button"
      );

      button.type = "button";
      button.className = "dtc-complete-button";
      button.textContent = "✓ Mark as Completed";

      button.dataset.sectionKey = sectionKey;

      button.setAttribute(
        "aria-pressed",
        "false"
      );

      const status = document.createElement(
        "span"
      );

      status.className = "dtc-status";
      status.textContent = "Not completed";

      container.append(button, status);

      if (heading) {
        heading.insertAdjacentElement(
          "afterend",
          container
        );
      } else {
        section.prepend(container);
      }

      buttons.push({
        id: sectionKey,
        button: button,
        status: status
      });

      button.addEventListener(
        "click",
        function () {

          if (completedLessons.has(sectionKey)) {
            completedLessons.delete(sectionKey);
          } else {
            completedLessons.add(sectionKey);
          }

          updateTracker();
        }
      );
    });

    // Update counts and completion states.
    function updateTracker() {

      const completed = completedLessons.size;
      const total = requiredIds.length;

      // Maximum learning progress is 80%.
      const progress = Math.round(
        (completed / total) * 80
      );

      countText.textContent =
        `${completed}/${total} lessons completed`;

      percentText.textContent =
        `${progress}% module progress`;

      progressFill.style.width =
        `${progress}%`;

      progressTrack.setAttribute(
        "aria-valuenow",
        String(progress)
      );

      buttons.forEach(function (item) {

        const isComplete = completedLessons.has(
          item.id
        );

        item.button.classList.toggle(
          "dtc-is-complete",
          isComplete
        );

        item.button.setAttribute(
          "aria-pressed",
          String(isComplete)
        );

        item.button.textContent = isComplete
          ? "✓ Completed — Undo"
          : "✓ Mark as Completed";

        item.status.textContent = isComplete
          ? "Completed"
          : "Not completed";
      });
    }

    // Reset demo.
    overview.querySelector(
      "[data-dtc-reset]"
    ).addEventListener(
      "click",
      function () {
        completedLessons.clear();
        updateTracker();
      }
    );

    updateTracker();

    console.log(
      `DevTrack ${moduleId} tracker ready:`,
      requiredIds.length,
      "required sections"
    );
  }

  // Initialize after HTML loads.
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeTracker,
      { once: true }
    );
  } else {
    initializeTracker();
  }

})();
