
document.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("module-quiz");
  if (!root) return;

  const questionBank = [
    {
      question: "A team commits code frequently but runs automated tests only once a month. What is the main weakness?",
      options: [
        "Too many commits",
        "Integration issues may go undetected",
        "Too many branches",
        "The repository is distributed"
      ],
      correct: 1,
      explanation: "Continuous Integration needs frequent automated checks to detect integration problems early."
    },
    {
      question: "A pipeline builds and tests code automatically but requires approval before production deployment. Which practice is this?",
      options: [
        "Continuous Deployment",
        "Continuous Delivery",
        "Manual Integration",
        "Infrastructure Monitoring"
      ],
      correct: 1,
      explanation: "Continuous Delivery prepares software for release, while deployment may require manual approval."
    },
    {
      question: "Which statement best describes DevOps?",
      options: [
        "A replacement for software testing",
        "Only a collection of tools",
        "A combination of culture, practices and automation",
        "A method that removes operations teams"
      ],
      correct: 2,
      explanation: "DevOps combines collaboration, processes, culture and automation."
    },
    {
      question: "A deployment succeeds but users experience slow responses. Which activity is most useful?",
      options: [
        "Formatting code",
        "Monitoring logs and performance metrics",
        "Deleting commits",
        "Creating branches"
      ],
      correct: 1,
      explanation: "Monitoring helps identify performance issues and application errors."
    },
    {
      question: "Which practice shifts testing earlier in the development process?",
      options: [
        "Testing after deployment",
        "Running unit tests during development",
        "Skipping reviews",
        "Testing only before release"
      ],
      correct: 1,
      explanation: "Running tests early helps developers detect problems sooner."
    },
    {
      question: "What is the main purpose of rollback?",
      options: [
        "Create a branch",
        "Restore a previous working release",
        "Delete the repository",
        "Replace automated testing"
      ],
      correct: 1,
      explanation: "Rollback returns an application to a previous working version after a problematic release."
    },
    {
      question: "A new release is initially delivered to only 5% of users. Which strategy is this?",
      options: [
        "Blue-Green",
        "Canary",
        "Full Replacement",
        "Rolling Back"
      ],
      correct: 1,
      explanation: "Canary deployment releases software to a small group before wider rollout."
    },
    {
      question: "Which activity best represents Measurement in CALMS?",
      options: [
        "Tracking deployment failures and recovery time",
        "Avoiding feedback",
        "Separating teams",
        "Removing metrics"
      ],
      correct: 0,
      explanation: "Measurement uses metrics to evaluate reliability and improvement."
    },
    {
      question: "Which example represents integration testing?",
      options: [
        "Testing one function alone",
        "Testing communication between login service and database",
        "Checking variable names",
        "Checking comments"
      ],
      correct: 1,
      explanation: "Integration testing checks interactions between multiple components."
    },
    {
      question: "Every passing change is automatically deployed to production without manual approval. What is this?",
      options: [
        "Continuous Deployment",
        "Continuous Delivery with manual approval",
        "Manual Testing",
        "SCM"
      ],
      correct: 0,
      explanation: "Continuous Deployment automatically releases changes after required checks pass."
    },
    {
      question: "Which statement about Agile and DevOps is correct?",
      options: [
        "They cannot work together",
        "DevOps focuses only on planning",
        "They can complement each other",
        "Agile eliminates operations"
      ],
      correct: 2,
      explanation: "Agile supports iterative development and DevOps extends collaboration into delivery and operations."
    },
    {
      question: "Why are regression tests useful?",
      options: [
        "They guarantee zero defects",
        "They detect whether new changes break existing functionality",
        "They replace monitoring",
        "They write requirements"
      ],
      correct: 1,
      explanation: "Regression tests help ensure existing features continue working after changes."
    },
    {
      question: "Which activity primarily belongs to the Build stage?",
      options: [
        "Collecting feedback",
        "Packaging application code and dependencies",
        "Responding to production alerts",
        "Planning a sprint"
      ],
      correct: 1,
      explanation: "Build processes prepare application artifacts for testing and delivery."
    },
    {
      question: "Which statement about automation is most accurate?",
      options: [
        "Every decision must be automated",
        "Automation replaces collaboration",
        "Automation reduces repetitive manual work",
        "Automation makes testing unnecessary"
      ],
      correct: 2,
      explanation: "Automation improves consistency and efficiency but does not replace teamwork."
    },
    {
      question: "Traffic switches between two production environments after validating a new version. Which strategy is this?",
      options: [
        "Canary",
        "Blue-Green",
        "Branching",
        "Unit Testing"
      ],
      correct: 1,
      explanation: "Blue-Green deployment switches traffic between existing and new environments."
    },
    {
      question: "What should a team do when automated tests fail in a CI pipeline?",
      options: [
        "Ignore the failure",
        "Investigate before proceeding",
        "Delete the tests",
        "Deploy immediately"
      ],
      correct: 1,
      explanation: "Test failures should be investigated before the affected change is promoted."
    },
    {
      question: "What is the purpose of continuous feedback?",
      options: [
        "Avoid planning",
        "Improve software and processes using observations",
        "Eliminate teamwork",
        "Prevent code reviews"
      ],
      correct: 1,
      explanation: "Feedback helps teams improve quality, reliability and delivery practices."
    },
    {
      question: "Which tool is primarily used for infrastructure provisioning through code?",
      options: [
        "Pytest",
        "Terraform",
        "Git",
        "Prometheus"
      ],
      correct: 1,
      explanation: "Terraform is an Infrastructure as Code tool used to define and provision infrastructure."
    },
    {
      question: "How can a company reduce differences between development and production environments?",
      options: [
        "Configure servers differently",
        "Use repeatable infrastructure and configuration definitions",
        "Remove version control",
        "Disable testing"
      ],
      correct: 1,
      explanation: "Repeatable configurations help maintain consistency between environments."
    },
    {
      question: "Which sequence best represents a typical delivery pipeline?",
      options: [
        "Deploy → Test → Build → Commit",
        "Commit → Build → Test → Deploy",
        "Monitor → Delete → Deploy → Build",
        "Release → Plan → Delete → Test"
      ],
      correct: 1,
      explanation: "A typical delivery pipeline starts with a code change, followed by build and test checks before deployment."
    }
  ];

  const TOTAL = 8;

  const counter = document.getElementById("mq-counter");
  const scoreLabel = document.getElementById("mq-score");
  const progressBar = document.getElementById("mq-progress");
  const questionText = document.getElementById("mq-question");
  const optionsBox = document.getElementById("mq-options");
  const feedback = document.getElementById("mq-feedback");
  const submitBtn = document.getElementById("mq-submit");
  const nextBtn = document.getElementById("mq-next");
  const retryBtn = document.getElementById("mq-retry");
  const questionPanel = document.getElementById("mq-question-panel");
  const resultPanel = document.getElementById("mq-result");
  const finalScore = document.getElementById("mq-final-score");
  const resultMessage = document.getElementById("mq-result-message");

  let questions = [];
  let current = 0;
  let score = 0;
  let selected = null;
  let answered = false;

  function shuffle(items) {
    const array = [...items];

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  function startQuiz() {
    questions = shuffle(questionBank).slice(0, TOTAL);
    current = 0;
    score = 0;

    questionPanel.hidden = false;
    resultPanel.hidden = true;

    showQuestion();
  }

  function showQuestion() {
    selected = null;
    answered = false;

    const question = questions[current];

    counter.textContent = `Question ${current + 1} of ${TOTAL}`;
    scoreLabel.textContent = `Score: ${score}`;
    progressBar.style.width = `${current / TOTAL * 100}%`;

    questionText.textContent = question.question;
    optionsBox.innerHTML = "";
    feedback.textContent = "";

    shuffle([0, 1, 2, 3]).forEach(index => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "mq-option";
      button.textContent = question.options[index];
      button.dataset.index = index;

      button.addEventListener("click", function () {
        if (answered) return;

        selected = index;

        optionsBox.querySelectorAll(".mq-option").forEach(option => {
          option.classList.remove("selected");
        });

        button.classList.add("selected");
      });

      optionsBox.appendChild(button);
    });

    submitBtn.hidden = false;
    nextBtn.hidden = true;
  }

  function checkAnswer() {
    if (answered) return;

    if (selected === null) {
      feedback.textContent = "Please select an answer first.";
      feedback.style.color = "#ffad45";
      return;
    }

    answered = true;

    const question = questions[current];
    const correct = selected === question.correct;

    if (correct) {
      score++;
      feedback.textContent = "✓ Correct! " + question.explanation;
      feedback.style.color = "#4ade80";
    } else {
      feedback.textContent = "✗ Incorrect. " + question.explanation;
      feedback.style.color = "#fb7185";
    }

    optionsBox.querySelectorAll(".mq-option").forEach(button => {
      const index = Number(button.dataset.index);

      button.disabled = true;

      if (index === question.correct) {
        button.classList.add("correct");
      } else if (index === selected) {
        button.classList.add("incorrect");
      }
    });

    scoreLabel.textContent = `Score: ${score}`;
    progressBar.style.width = `${(current + 1) / TOTAL * 100}%`;

    submitBtn.hidden = true;
    nextBtn.hidden = false;

    nextBtn.textContent =
      current === TOTAL - 1
        ? "View Results →"
        : "Next Question →";
  }

  function nextQuestion() {
    if (!answered) return;

    current++;

    if (current < TOTAL) {
      showQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    questionPanel.hidden = true;
    resultPanel.hidden = false;

    counter.textContent = "Challenge Completed";
    progressBar.style.width = "100%";

    const percentage = Math.round(score / TOTAL * 100);

    finalScore.textContent = `${score} / ${TOTAL} (${percentage}%)`;

    if (percentage >= 75) {
      resultMessage.textContent =
        "Excellent! You understand the major DevOps concepts.";
    } else if (percentage >= 50) {
      resultMessage.textContent =
        "Good effort! Review the concepts you missed and try again.";
    } else {
      resultMessage.textContent =
        "Keep learning! Review the module and attempt another challenge.";
    }
  }

  submitBtn.addEventListener("click", checkAnswer);
  nextBtn.addEventListener("click", nextQuestion);
  retryBtn.addEventListener("click", startQuiz);

  startQuiz();
});
