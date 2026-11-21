
document.addEventListener("DOMContentLoaded", function () {

    console.log("DevTrack learning module JS loaded");

    const page = document.querySelector(".learning-page");

    if (!page) {
        console.log("Learning page not found");
        return;
    }

    // ---------------------------------
    // 1. PROGRESS BAR
    // ---------------------------------

    const sections = document.querySelectorAll(
        ".learning-section[id]"
    );

    const progressBar = document.getElementById(
        "learning-progress-fill"
    );

    const progressText = document.getElementById(
        "learning-progress-text"
    );

    const visitedSections = new Set();

    function updateProgress(sectionId) {

        if (!sectionId) return;

        visitedSections.add(sectionId);

        const percentage = Math.round(
            (visitedSections.size / sections.length) * 100
        );

        if (progressBar) {
            progressBar.style.width = percentage + "%";
        }

        if (progressText) {
            progressText.textContent =
                percentage + "% topics visited";
        }
    }

    // Mark first topic as visited
    if (sections.length > 0) {
        updateProgress(sections[0].id);
    }

    // Track visited sections while scrolling
    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        updateProgress(entry.target.id);
                    }

                });

            },
            {
                threshold: 0.15
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    // ---------------------------------
    // 2. SIDEBAR NAVIGATION
    // ---------------------------------

    const sidebarLinks = document.querySelectorAll(
        ".learning-sidebar a"
    );

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            const targetId = link.getAttribute("href").slice(1);

            updateProgress(targetId);

            sidebarLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });

    // ---------------------------------
    // 3. INTERACTIVE KNOWLEDGE CHECK
    // ---------------------------------

    const knowledgeChecks = document.querySelectorAll(
        ".learning-check"
    );

    knowledgeChecks.forEach(function (check) {

        const button = check.querySelector(
            ".learning-check-button"
        );

        const result = check.querySelector(
            ".learning-check-result"
        );

        if (!button || !result) return;

        button.addEventListener("click", function () {

            const selected = check.querySelector(
                "input[type='radio']:checked"
            );

            if (!selected) {
                result.textContent =
                    "Please select an answer first.";

                result.style.color = "#ffad45";
                return;
            }

            const correctAnswer = check.dataset.answer;

            const explanation =
                check.dataset.explanation || "";

            if (selected.value === correctAnswer) {

                result.textContent =
                    "✓ Correct! " + explanation;

                result.style.color = "#4ade80";

            } else {

                result.textContent =
                    "✗ Incorrect. " + explanation;

                result.style.color = "#fb7185";

            }

        });

    });

});
