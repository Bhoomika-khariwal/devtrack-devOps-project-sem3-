
document.addEventListener("DOMContentLoaded", () => {
  // PART 1: PIPELINE SIMULATOR
  const stages = Array.from(
    document.querySelectorAll("#pipeline-app .cicd-stage")
  );
  const log = document.getElementById("pipeline-log");
  const status = document.getElementById("pipeline-status");
  const successButton = document.getElementById("pipeline-success");
  const failureButton = document.getElementById("pipeline-failure");
  const resetButton = document.getElementById("pipeline-reset");

  let running = false;
  let runToken = 0;

  const pause = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

  function updateStage(index, state, label) {
    const stage = stages[index];
    stage.className = "cicd-stage";
    if (state) stage.classList.add(state);
    stage.querySelector("small").textContent = label;
  }

  function resetPipeline() {
    runToken++;
    running = false;

    stages.forEach((_, index) => {
      updateStage(index, "", "Waiting");
    });

    log.textContent = "Waiting for a scenario...";
    status.textContent = "Ready to start.";
    successButton.disabled = false;
    failureButton.disabled = false;
  }

  async function runPipeline(failTest) {
    if (running) return;

    running = true;
    const token = ++runToken;

    successButton.disabled = true;
    failureButton.disabled = true;

    stages.forEach((_, index) => {
      updateStage(index, "", "Waiting");
    });

    log.textContent = "Pipeline triggered by a simulated push event.";
    status.textContent = "Pipeline running...";

    const names = [
      "Checkout",
      "Build",
      "Test",
      "Deploy",
      "Monitor"
    ];

    for (let i = 0; i < names.length; i++) {
      if (token !== runToken) return;

      updateStage(i, "running", "Running");
      log.textContent += `\n[RUNNING] ${names[i]}`;
      await pause(650);

      if (token !== runToken) return;

      if (i === 2 && failTest) {
        updateStage(i, "failed", "Failed");
        log.textContent += "\n[FAILED] Automated tests failed.";
        log.textContent +=
          "\n[BLOCKED] Deployment was not executed.";

        for (let j = 3; j < names.length; j++) {
          updateStage(j, "skipped", "Skipped");
        }

        status.textContent =
          "Pipeline failed at Test. Deployment blocked.";
        running = false;
        successButton.disabled = false;
        failureButton.disabled = false;
        return;
      }

      updateStage(i, "passed", "Passed");
      log.textContent += `\n[PASSED] ${names[i]}`;
    }

    if (token !== runToken) return;

    status.textContent = "Pipeline completed successfully!";
    log.textContent +=
      "\n[SUCCESS] All simulated stages completed.";

    running = false;
    successButton.disabled = false;
    failureButton.disabled = false;
  }

  if (successButton && failureButton && resetButton) {
    successButton.addEventListener("click", () => runPipeline(false));
    failureButton.addEventListener("click", () => runPipeline(true));
    resetButton.addEventListener("click", resetPipeline);
    resetPipeline();
  }

  // PART 2: RANDOMIZED QUIZ
  // Each entry contains a question, four options,
  // the index of the correct answer, and an explanation.
  const bank = [
    {
      q: "What does CI stand for?",
      options: [
        "Continuous Integration",
        "Code Installation",
        "Central Infrastructure",
        "Continuous Inspection"
      ],
      answer: 0,
      explanation: "CI means Continuous Integration."
    },
    {
      q: "What is the main purpose of CI?",
      options: [
        "Delete old code",
        "Integrate and test changes frequently",
        "Replace developers",
        "Disable version control"
      ],
      answer: 1,
      explanation: "CI encourages frequent integration with automated checks."
    },
    {
      q: "What does Continuous Delivery mean?",
      options: [
        "Every change must go live automatically",
        "No testing is required",
        "Software remains ready for release",
        "Code is never merged"
      ],
      answer: 2,
      explanation: "Continuous Delivery keeps validated software ready to release."
    },
    {
      q: "What is Continuous Deployment?",
      options: [
        "Manual code formatting",
        "A local Git commit",
        "A type of source control",
        "Automatically releasing changes after required checks"
      ],
      answer: 3,
      explanation: "Continuous Deployment automatically releases qualifying changes."
    },
    {
      q: "What is a CI/CD pipeline?",
      options: [
        "An automated sequence of delivery tasks",
        "A database table",
        "A Git branch name",
        "A network cable"
      ],
      answer: 0,
      explanation: "A pipeline automates stages such as build, test and deploy."
    },
    {
      q: "Where are GitHub Actions workflow files stored?",
      options: [
        "templates/",
        ".github/workflows/",
        "static/",
        ".git/objects/"
      ],
      answer: 1,
      explanation: "GitHub Actions workflows live in .github/workflows/."
    },
    {
      q: "Which file format is used for GitHub Actions workflows?",
      options: ["CSV", "HTML", "YAML", "PDF"],
      answer: 2,
      explanation: "GitHub Actions workflows are written in YAML."
    },
    {
      q: "Which GitHub Actions keyword specifies the runner?",
      options: ["on", "steps", "name", "runs-on"],
      answer: 3,
      explanation: "runs-on specifies the runner environment."
    },
    {
      q: "Which event can trigger a workflow after a code push?",
      options: ["push", "compile", "install", "branch-delete-only"],
      answer: 0,
      explanation: "The push event can trigger workflows on matching pushes."
    },
    {
      q: "Which event enables manual workflow execution?",
      options: [
        "pull_request",
        "workflow_dispatch",
        "checkout",
        "runs-on"
      ],
      answer: 1,
      explanation: "workflow_dispatch enables manual execution."
    },
    {
      q: "What is a GitHub Actions job?",
      options: [
        "A GitHub password",
        "A repository license",
        "A collection of steps on a runner",
        "A Git branch"
      ],
      answer: 2,
      explanation: "A job contains steps that run on a runner."
    },
    {
      q: "What does actions/checkout do?",
      options: [
        "Deletes the repository",
        "Publishes an app automatically",
        "Creates a GitHub account",
        "Makes repository content available to the workflow"
      ],
      answer: 3,
      explanation: "The checkout action retrieves repository content."
    },
    {
      q: "What does the run keyword do in a workflow step?",
      options: [
        "Executes shell commands",
        "Creates GitHub secrets",
        "Deletes all workflow logs",
        "Changes the repository owner"
      ],
      answer: 0,
      explanation: "run executes commands in a workflow step."
    },
    {
      q: "What should happen when required tests fail?",
      options: [
        "Deploy regardless",
        "Block dependent deployment and investigate",
        "Delete the repository",
        "Ignore the logs"
      ],
      answer: 1,
      explanation: "Failed required checks should prevent dependent deployment."
    },
    {
      q: "Why are workflow logs useful?",
      options: [
        "They replace all tests",
        "They create new Git branches",
        "They help diagnose failures",
        "They hide errors"
      ],
      answer: 2,
      explanation: "Logs show what happened during workflow execution."
    },
    {
      q: "Where should sensitive workflow credentials be stored?",
      options: [
        "README.md",
        "Public HTML comments",
        "Plaintext source files",
        "Appropriately configured secrets"
      ],
      answer: 3,
      explanation: "Secrets help manage sensitive credentials without hardcoding them."
    },
    {
      q: "Which strategy deploys to a small user group first?",
      options: [
        "Canary deployment",
        "Full deletion",
        "Manual compilation",
        "Source cloning"
      ],
      answer: 0,
      explanation: "Canary deployments release to a limited group initially."
    },
    {
      q: "What is a rollback?",
      options: [
        "Adding a new GitHub secret",
        "Returning to an earlier working version",
        "Starting a workflow manually",
        "Renaming a runner"
      ],
      answer: 1,
      explanation: "Rollback restores a previous working application version."
    },
    {
      q: "What does monitoring help teams detect?",
      options: [
        "Only Git usernames",
        "Only file extensions",
        "Application errors and performance issues",
        "Only branch names"
      ],
      answer: 2,
      explanation: "Monitoring helps track reliability and performance."
    },
    {
      q: "Which statement about CI/CD is correct?",
      options: [
        "CI/CD eliminates the need for reviews",
        "Every workflow must deploy to production",
        "CI/CD is only for large companies",
        "CI/CD supports repeatable and reliable delivery"
      ],
      answer: 3,
      explanation: "CI/CD automates repeatable checks and delivery activities."
    }
  ];

  const get = id => document.getElementById(id);
  const root = get("cicd-module-quiz");
  if (!root) return;

  const TOTAL = 8;
  const counter = get("cicd-counter");
  const scoreLabel = get("cicd-score");
  const progress = get("cicd-progress");
  const question = get("cicd-question");
  const options = get("cicd-options");
  const feedback = get("cicd-feedback");
  const submit = get("cicd-submit");
  const next = get("cicd-next");
  const panel = get("cicd-question-panel");
  const result = get("cicd-result");
  const finalScore = get("cicd-final-score");
  const resultMessage = get("cicd-result-message");
  const retry = get("cicd-retry");

  let questions = [];
  let index = 0;
  let score = 0;
  let selected = null;
  let checked = false;

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function startQuiz() {
    questions = shuffle(bank).slice(0, TOTAL).map(item => ({
      ...item,
      shuffledOptions: shuffle(
        item.options.map((label, i) => ({
          label,
          correct: i === item.answer
        }))
      )
    }));

    index = 0;
    score = 0;
    panel.hidden = false;
    result.hidden = true;
    showQuestion();
  }

  function showQuestion() {
    const current = questions[index];
    selected = null;
    checked = false;

    counter.textContent = `Question ${index + 1} of ${TOTAL}`;
    scoreLabel.textContent = `Score: ${score}`;
    progress.style.width = `${index / TOTAL * 100}%`;
    question.textContent = current.q;
    feedback.textContent = "";
    options.innerHTML = "";

    current.shuffledOptions.forEach((option, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mq-option";
      button.textContent = option.label;

      button.addEventListener("click", () => {
        if (checked) return;
        selected = i;

        options.querySelectorAll(".mq-option").forEach(el => {
          el.classList.remove("selected");
        });
        button.classList.add("selected");
      });

      options.appendChild(button);
    });

    submit.hidden = false;
    next.hidden = true;
    next.textContent = index === TOTAL - 1
      ? "View Results →"
      : "Next Question →";
  }

  function checkAnswer() {
    if (checked) return;

    if (selected === null) {
      feedback.textContent = "Please select an answer first.";
      return;
    }

    checked = true;
    const current = questions[index];
    const chosen = current.shuffledOptions[selected];

    if (chosen.correct) {
      score++;
      feedback.textContent = `Correct! ${current.explanation}`;
    } else {
      const correct = current.shuffledOptions.find(
        option => option.correct
      );
      feedback.textContent =
        `Not quite. Correct answer: ${correct.label}. ${current.explanation}`;
    }

    options.querySelectorAll(".mq-option").forEach((button, i) => {
      button.disabled = true;
      if (current.shuffledOptions[i].correct) {
        button.classList.add("correct");
      } else if (i === selected) {
        button.classList.add("incorrect");
      }
    });

    scoreLabel.textContent = `Score: ${score}`;
    submit.hidden = true;
    next.hidden = false;
  }

  function finishQuiz() {
    panel.hidden = true;
    result.hidden = false;
    counter.textContent = "Challenge Completed";
    scoreLabel.textContent = `Score: ${score}`;
    progress.style.width = "100%";
    finalScore.textContent = `${score} / ${TOTAL}`;

    if (score === TOTAL) {
      resultMessage.textContent =
        "Excellent! You understand CI/CD concepts very well.";
    } else if (score >= 5) {
      resultMessage.textContent =
        "Good work! Review the explanations and try again.";
    } else {
      resultMessage.textContent =
        "Review the lessons, then try another set of questions.";
    }
  }

  submit.addEventListener("click", checkAnswer);

  next.addEventListener("click", () => {
    if (!checked) return;
    index++;
    if (index >= TOTAL) finishQuiz();
    else showQuestion();
  });

  retry.addEventListener("click", startQuiz);
  startQuiz();
});
