
/*
 DevTrack - Lesson Completion Prototype
 Module 01: DevOps Fundamentals

 Frontend demonstration only.
 No database writes or permanent XP rewards.
*/

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const modulePage =
    document.querySelector(".learning-page");

  if (!modulePage) {
    console.warn(
      "DevTrack: learning-page container not found."
    );
    return;
  }

  const excludedTopics =
    /quiz|assessment|final test|summary|recap|conclusion|takeaway|table of contents/i;

  // Find existing lesson sections.
  // The quiz and summary are not learning sections.
  const lessons = Array.from(
    modulePage.querySelectorAll(".learning-section")
  ).filter(function (section) {
    const heading = section.querySelector("h2, h3");

    if (!heading) return false;

    const sectionName =
      heading.textContent.trim() + " " + (section.id || "");

    return !excludedTopics.test(sectionName);
  });

  if (lessons.length === 0) {
    console.warn(
      "DevTrack: no eligible learning sections found."
    );
    return;
  }

  // This Set exists in memory only.
  // It will be replaced by saved progress later.
  const completedLessons = new Set();

  // Create progress overview.
  const overview = document.createElement("div");
  overview.className = "dtc-overview";

  overview.innerHTML = `
    <div class="dtc-heading-row">
      <div>
        <h2>Lesson Completion Tracker</h2>
        <p>Mark each learning section after studying it.</p>
      </div>
      <span class="dtc-demo-tag">DEMO ONLY</span>
    </div>

    <div class="dtc-numbers">
      <strong id="dtc-count">0 lessons completed</strong>
      <strong id="dtc-percent">0% module progress</strong>
    </div>

    <div class="dtc-progress-track"
         role="progressbar"
         aria-label="Module completion progress"
         aria-valuemin="0"
         aria-valuemax="100"
         aria-valuenow="0">
      <div id="dtc-progress-fill"
           class="dtc-progress-fill"></div>
    </div>

    <p class="dtc-explanation">
      Learning sections contribute 80% of module progress.
      Passing the final quiz contributes the remaining 20%.
    </p>

    <p class="dtc-warning">
      This is a temporary demonstration.
      Progress is not saved and resets after refresh.
    </p>

    <button type="button"
            class="dtc-reset"
            id="dtc-reset">
      Reset Demo Progress
    </button>
  `;

  // Place the overview before the first lesson.
  lessons[0].insertAdjacentElement("beforebegin", overview);

  const countElement =
    overview.querySelector("#dtc-count");

  const percentElement =
    overview.querySelector("#dtc-percent");

  const progressFill =
    overview.querySelector("#dtc-progress-fill");

  const progressTrack =
    overview.querySelector(".dtc-progress-track");

  const lessonButtons = [];

  // Create a button inside every eligible section.
  lessons.forEach(function (section, index) {
    const heading = section.querySelector("h2, h3");

    const lessonId = "devops-lesson-" + (index + 1);

    const container = document.createElement("div");
    container.className = "dtc-action-container";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "dtc-complete-button";
    button.textContent = "✓ Mark as Completed";
    button.setAttribute("aria-pressed", "false");

    const status = document.createElement("span");
    status.className = "dtc-status";
    status.textContent = "Not completed";

    container.append(button, status);
    heading.insertAdjacentElement("afterend", container);

    lessonButtons.push({
      id: lessonId,
      button: button,
      status: status
    });

    button.addEventListener("click", function () {
      if (completedLessons.has(lessonId)) {
        completedLessons.delete(lessonId);
      } else {
        completedLessons.add(lessonId);
      }

      updateDisplay();
    });
  });

  // Update counts, progress and button states.
  function updateDisplay() {
    const completed = completedLessons.size;
    const total = lessons.length;

    // Lessons contribute at most 80%.
    // The 20% quiz portion is not connected yet.
    const lessonProgress = Math.round(
      (completed / total) * 80
    );

    countElement.textContent =
      completed + "/" + total + " lessons completed";

    percentElement.textContent =
      lessonProgress + "% module progress";

    progressFill.style.width =
      lessonProgress + "%";

    progressTrack.setAttribute(
      "aria-valuenow",
      String(lessonProgress)
    );

    lessonButtons.forEach(function (entry) {
      const isComplete =
        completedLessons.has(entry.id);

      entry.button.classList.toggle(
        "dtc-is-complete",
        isComplete
      );

      entry.button.textContent = isComplete
        ? "✓ Completed — Undo"
        : "✓ Mark as Completed";

      entry.button.setAttribute(
        "aria-pressed",
        String(isComplete)
      );

      entry.status.textContent = isComplete
        ? "Completed"
        : "Not completed";
    });
  }

  // Reset only temporary demonstration progress.
  overview
    .querySelector("#dtc-reset")
    .addEventListener("click", function () {
      completedLessons.clear();
      updateDisplay();
    });

  updateDisplay();

  console.log(
    "DevTrack lesson tracker ready:",
    lessons.length,
    "eligible sections"
  );
});
