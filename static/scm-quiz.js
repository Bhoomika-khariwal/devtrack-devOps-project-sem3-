
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("scm-module-quiz");
  if (!root) return;

  const bank = [
    {
      q: "What is the main purpose of Software Configuration Management?",
      options: [
        "Tracking and controlling software changes",
        "Designing only the user interface",
        "Replacing all software testing",
        "Increasing manual deployment steps"
      ],
      answer: 0,
      explanation: "SCM identifies, tracks and controls changes to software configuration items."
    },
    {
      q: "Which item can be a Software Configuration Item?",
      options: [
        "Only executable programs",
        "Only source code",
        "Source code, documentation and configuration files",
        "Only developer usernames"
      ],
      answer: 2,
      explanation: "SCIs may include code, documents, tests and configuration files."
    },
    {
      q: "What is a configuration baseline?",
      options: [
        "A temporary unsaved edit",
        "An approved reference configuration",
        "An automatically deleted branch",
        "A failed test result"
      ],
      answer: 1,
      explanation: "A baseline is an established reference version subject to change control."
    },
    {
      q: "Which SCM activity records configuration status and change history?",
      options: [
        "Code formatting",
        "User authentication",
        "Network routing",
        "Configuration status accounting"
      ],
      answer: 3,
      explanation: "Status accounting records and reports item versions and change status."
    },
    {
      q: "What is the purpose of configuration auditing?",
      options: [
        "Verifying configuration compliance",
        "Replacing source code with documentation",
        "Creating random branch names",
        "Disabling version history"
      ],
      answer: 0,
      explanation: "Audits check that controlled items match approved requirements and records."
    },
    {
      q: "Which version control model is used by Git?",
      options: [
        "Centralized only",
        "Distributed",
        "Local file copying only",
        "Database locking only"
      ],
      answer: 1,
      explanation: "Git is a distributed version control system."
    },
    {
      q: "Which version control system is traditionally centralized?",
      options: [
        "Git",
        "Mercurial",
        "SVN",
        "GitHub Actions"
      ],
      answer: 2,
      explanation: "Subversion (SVN) is a centralized version control system."
    },
    {
      q: "What does git add do?",
      options: [
        "Deploys an application",
        "Deletes commit history",
        "Creates a remote repository",
        "Stages changes for a commit"
      ],
      answer: 3,
      explanation: "git add updates the staging area with selected file changes."
    },
    {
      q: "What does a Git commit represent?",
      options: [
        "A recorded project snapshot",
        "A production monitoring alert",
        "A new GitHub account",
        "A network connection"
      ],
      answer: 0,
      explanation: "A commit records a snapshot in Git repository history."
    },
    {
      q: "Why do developers create feature branches?",
      options: [
        "To permanently disable main",
        "To develop changes separately",
        "To erase remote history",
        "To replace all test cases"
      ],
      answer: 1,
      explanation: "Feature branches allow parallel work without immediately modifying the main line."
    },
    {
      q: "What is a merge conflict?",
      options: [
        "A successful deployment",
        "A completed code review",
        "A change Git cannot automatically combine",
        "A deleted remote repository"
      ],
      answer: 2,
      explanation: "Conflicts require developers to resolve incompatible changes."
    },
    {
      q: "Which command creates and switches to a new Git branch?",
      options: [
        "git status",
        "git log",
        "git fetch",
        "git switch -c feature-login"
      ],
      answer: 3,
      explanation: "git switch -c creates a branch and switches to it."
    },
    {
      q: "What is the main purpose of a pull request?",
      options: [
        "Propose changes for review and integration",
        "Download operating system updates",
        "Delete all previous commits",
        "Automatically replace every branch"
      ],
      answer: 0,
      explanation: "Pull requests support reviewing, discussing and integrating changes."
    },
    {
      q: "What does git clone normally do?",
      options: [
        "Uploads local commits",
        "Copies a repository locally",
        "Deletes a branch",
        "Runs automated unit tests"
      ],
      answer: 1,
      explanation: "git clone creates a local copy of a repository."
    },
    {
      q: "What does git push normally do?",
      options: [
        "Displays file differences",
        "Runs a local compiler",
        "Uploads local commits to a remote",
        "Creates a configuration audit"
      ],
      answer: 2,
      explanation: "git push sends local commits to a remote repository."
    },
    {
      q: "What does git pull normally do?",
      options: [
        "Removes all local branches",
        "Creates a new GitHub account",
        "Deletes the staging area",
        "Fetches and integrates remote changes"
      ],
      answer: 3,
      explanation: "git pull fetches changes and integrates them into the current branch."
    },
    {
      q: "What is the purpose of change control?",
      options: [
        "Evaluating and managing proposed changes",
        "Avoiding all software documentation",
        "Disabling code review",
        "Removing version identification"
      ],
      answer: 0,
      explanation: "Change control manages the evaluation, authorization and verification of changes."
    },
    {
      q: "Which statement correctly describes GitHub?",
      options: [
        "It is the Git command-line executable",
        "It hosts Git repositories and collaboration tools",
        "It is a centralized version control protocol",
        "It replaces every local Git repository"
      ],
      answer: 1,
      explanation: "GitHub is a platform for hosting Git repositories and collaborating."
    },
    {
      q: "Which approach integrates small changes frequently into a shared main line?",
      options: [
        "Manual file duplication",
        "Long-term isolated development",
        "Trunk-based development",
        "Uncontrolled release editing"
      ],
      answer: 2,
      explanation: "Trunk-based development emphasizes frequent integration into a shared main line."
    },
    {
      q: "What is a useful purpose of a Git release tag?",
      options: [
        "Encrypting all source code",
        "Replacing the staging area",
        "Preventing every future commit",
        "Identifying a specific release commit"
      ],
      answer: 3,
      explanation: "Git tags commonly identify specific release versions such as v1.0.0."
    }
  ];

  const $ = id => document.getElementById(id);

  const counter = $("scm-counter");
  const scoreLabel = $("scm-score");
  const progress = $("scm-progress");
  const question = $("scm-question");
  const options = $("scm-options");
  const feedback = $("scm-feedback");
  const submit = $("scm-submit");
  const next = $("scm-next");
  const panel = $("scm-question-panel");
  const result = $("scm-result");
  const finalScore = $("scm-final-score");
  const resultMessage = $("scm-result-message");
  const retry = $("scm-retry");

  const TOTAL = 8;
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
    questions = shuffle(bank).slice(0, TOTAL).map(item => {
      const shuffledOptions = shuffle(
        item.options.map((label, i) => ({
          label,
          correct: i === item.answer
        }))
      );

      return {
        ...item,
        shuffledOptions
      };
    });

    index = 0;
    score = 0;
    selected = null;
    checked = false;

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
    progress.style.width = `${(index / TOTAL) * 100}%`;

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
    next.textContent =
      index === TOTAL - 1 ? "View Results →" : "Next Question →";
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
      feedback.textContent =
        `Correct! ${current.explanation}`;
    } else {
      const correctOption = current.shuffledOptions.find(
        option => option.correct
      );

      feedback.textContent =
        `Not quite. Correct answer: ${correctOption.label}. ` +
        current.explanation;
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
        "Excellent! You have a strong understanding of SCM.";
    } else if (score >= 5) {
      resultMessage.textContent =
        "Good work! Review the explanations and try again.";
    } else {
      resultMessage.textContent =
        "Keep learning! Revisit the lessons and try again.";
    }
  }

  submit.addEventListener("click", checkAnswer);

  next.addEventListener("click", () => {
    if (!checked) return;

    index++;

    if (index >= TOTAL) {
      finishQuiz();
    } else {
      showQuestion();
    }
  });

  retry.addEventListener("click", startQuiz);

  startQuiz();
});
