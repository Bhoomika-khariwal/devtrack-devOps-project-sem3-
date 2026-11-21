
document.addEventListener("DOMContentLoaded", () => {
  // MODULE 03: GIT AND GITHUB QUIZ

  const bank = [
    {
      q: "What is Git?",
      options: ["A distributed version control system", "A programming language", "A web browser", "A cloud operating system"],
      answer: 0,
      explanation: "Git is a distributed version control system used to track changes."
    },
    {
      q: "What is GitHub?",
      options: ["A compiler", "A platform for hosting Git repositories", "A local staging area", "A programming framework"],
      answer: 1,
      explanation: "GitHub hosts Git repositories and provides collaboration tools."
    },
    {
      q: "Which command initializes a repository?",
      options: ["git start", "git create", "git init", "git open"],
      answer: 2,
      explanation: "git init initializes a Git repository."
    },
    {
      q: "Which command checks the working tree status?",
      options: ["git upload", "git status", "git branch -d", "git push"],
      answer: 1,
      explanation: "git status shows staged, modified and untracked files."
    },
    {
      q: "What does git add do?",
      options: ["Creates a GitHub account", "Deletes history", "Deploys a website", "Stages changes"],
      answer: 3,
      explanation: "git add places selected changes into the staging area."
    },
    {
      q: "What does git commit do?",
      options: ["Records a snapshot of staged changes", "Downloads a repository", "Creates a remote server", "Deletes all branches"],
      answer: 0,
      explanation: "A commit records a snapshot in the local repository."
    },
    {
      q: "Which command displays commit history?",
      options: ["git clone", "git log", "git init", "git config"],
      answer: 1,
      explanation: "git log displays the commit history."
    },
    {
      q: "Which command creates and switches to a new branch?",
      options: ["git switch main", "git status", "git switch -c feature-login", "git pull"],
      answer: 2,
      explanation: "git switch -c creates and switches to a branch."
    },
    {
      q: "Why are feature branches useful?",
      options: ["They automatically deploy code", "They remove all bugs", "They replace commits", "They isolate feature development"],
      answer: 3,
      explanation: "Branches allow separate lines of development."
    },
    {
      q: "What does git merge do?",
      options: ["Integrates changes from another branch", "Deletes a repository", "Creates a GitHub account", "Formats Python code"],
      answer: 0,
      explanation: "git merge integrates histories from different branches."
    },
    {
      q: "When does a merge conflict occur?",
      options: ["When Git is installed", "When Git cannot automatically combine changes", "When a file is opened", "When a branch has no changes"],
      answer: 1,
      explanation: "Conflicts arise when Git cannot automatically reconcile changes."
    },
    {
      q: "What does git clone do?",
      options: ["Removes a remote", "Changes the commit message", "Creates a local repository copy", "Runs tests"],
      answer: 2,
      explanation: "git clone copies a repository and its history locally."
    },
    {
      q: "What does git push do?",
      options: ["Displays differences", "Switches branches", "Stages a file", "Uploads local commits to a remote"],
      answer: 3,
      explanation: "git push transfers local commits to a remote repository."
    },
    {
      q: "What is the difference between fetch and pull?",
      options: ["Fetch downloads; pull downloads and integrates", "They are identical in all cases", "Fetch deletes commits", "Pull only creates branches"],
      answer: 0,
      explanation: "git fetch downloads remote data; git pull also integrates changes."
    },
    {
      q: "What is a pull request?",
      options: ["A Git command for downloading files", "A proposal to review and integrate changes", "A command to delete a branch", "A local repository folder"],
      answer: 1,
      explanation: "Pull requests support code review and integration."
    },
    {
      q: "What is a Git fork?",
      options: ["A merge conflict", "A staging command", "A separate repository copy under another account or namespace", "A Git commit"],
      answer: 2,
      explanation: "Forking creates a separate repository on a hosting platform."
    },
    {
      q: "Which command creates a new commit to reverse an earlier commit?",
      options: ["git init", "git status", "git add", "git revert"],
      answer: 3,
      explanation: "git revert records a new commit reversing an earlier change."
    },
    {
      q: "What is a common use of git stash?",
      options: ["Temporarily save uncommitted changes", "Create a GitHub organization", "Delete a remote", "Install Git"],
      answer: 0,
      explanation: "Stash can temporarily store certain uncommitted changes."
    },
    {
      q: "What does git cherry-pick do?",
      options: ["Creates a new GitHub repository", "Applies a selected commit's change to the current branch", "Automatically fixes every conflict", "Deletes tags"],
      answer: 1,
      explanation: "Cherry-pick applies the change introduced by a selected commit."
    },
    {
      q: "Which statement about GitHub and GitLab is correct?",
      options: ["They use incompatible Git commands", "GitLab cannot host Git repositories", "Both host Git repositories and support collaboration", "GitHub is a programming language"],
      answer: 2,
      explanation: "Both platforms support Git hosting and team collaboration."
    }
  ];

  function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  const byId = id => document.getElementById(id);
  const quiz = byId("git-module-quiz");

  if (quiz) {
    const TOTAL = 8;
    const counter = byId("git-counter");
    const scoreLabel = byId("git-score");
    const progress = byId("git-progress");
    const question = byId("git-question");
    const options = byId("git-options");
    const feedback = byId("git-feedback");
    const submit = byId("git-submit");
    const next = byId("git-next");
    const panel = byId("git-question-panel");
    const result = byId("git-result");
    const finalScore = byId("git-final-score");
    const resultMessage = byId("git-result-message");
    const retry = byId("git-retry");

    let questions = [];
    let index = 0;
    let score = 0;
    let selected = null;
    let checked = false;

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
        const correctOption = current.shuffledOptions.find(
          option => option.correct
        );
        feedback.textContent =
          `Not quite. Correct answer: ${correctOption.label}. ${current.explanation}`;
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
        resultMessage.textContent = "Excellent! You know your Git fundamentals.";
      } else if (score >= 5) {
        resultMessage.textContent = "Good work! Review the explanations and try again.";
      } else {
        resultMessage.textContent = "Keep practicing. Review the lesson and try again.";
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
  }

  // MODULE 03: SAFE BROWSER-ONLY GIT SIMULATOR

  const form = byId("git-sim-form");
  if (!form) return;

  const input = byId("git-sim-input");
  const output = byId("git-sim-output");
  const resetButton = byId("git-sim-reset");

  let initialized = false;
  let branch = "main";
  let branches = ["main"];
  let staged = false;
  let commits = [];

  function print(command, response) {
    output.textContent += `\n\n$ ${command}\n${response}`;
    output.scrollTop = output.scrollHeight;
  }

  function resetSimulation() {
    initialized = false;
    branch = "main";
    branches = ["main"];
    staged = false;
    commits = [];
    output.textContent =
      "DevTrack Git Simulator\n" +
      "This is a browser-only simulation. No real files are changed.\n" +
      "Type git help to see available commands.";
    input.value = "";
  }

  function execute(command) {
    const cmd = command.trim();

    if (!cmd) return;

    if (cmd === "git help") {
      return [
        "Supported commands:",
        "git init",
        "git status",
        "git add .",
        'git commit -m "message"',
        "git branch",
        "git switch -c NAME",
        "git switch NAME",
        "git log --oneline"
      ].join("\n");
    }

    if (cmd === "git init") {
      if (initialized) return "Repository already initialized in this simulation.";
      initialized = true;
      return "Initialized empty Git repository on branch main.";
    }

    if (!initialized) {
      return "Not a Git repository. Run git init first.";
    }

    if (cmd === "git status") {
      if (staged) {
        return `On branch ${branch}\nChanges to be committed:\n  modified: example.txt (simulated)`;
      }
      return `On branch ${branch}\nWorking tree clean (simulated).`;
    }

    if (cmd === "git add .") {
      staged = true;
      return "Staged example.txt (simulated change).";
    }

    const commitMatch = cmd.match(/^git commit -m (["'])(.+)\1$/);

    if (commitMatch) {
      if (!staged) return "Nothing staged. Run git add . first.";

      const message = commitMatch[2];
      const id = (commits.length + 1).toString(16).padStart(7, "0");
      commits.unshift({ id, branch, message });
      staged = false;
      return `[${branch} ${id}] ${message}\n1 file changed (simulated).`;
    }

    if (cmd === "git branch") {
      return branches.map(name => `${name === branch ? "*" : " "} ${name}`).join("\n");
    }

    const createMatch = cmd.match(/^git switch -c ([a-zA-Z0-9._/-]+)$/);

    if (createMatch) {
      const name = createMatch[1];

      if (branches.includes(name)) {
        return `Branch '${name}' already exists.`;
      }

      branches.push(name);
      branch = name;
      return `Switched to a new branch '${name}'.`;
    }

    const switchMatch = cmd.match(/^git switch ([a-zA-Z0-9._/-]+)$/);

    if (switchMatch) {
      const name = switchMatch[1];

      if (!branches.includes(name)) {
        return `Branch '${name}' does not exist in this simulation.`;
      }

      branch = name;
      return `Switched to branch '${name}'.`;
    }

    if (cmd === "git log --oneline") {
      if (!commits.length) return "No commits yet.";
      return commits.map(c => `${c.id} ${c.message} (${c.branch})`).join("\n");
    }

    return "Command not supported in this learning simulation. Type git help.";
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const command = input.value.trim();
    if (!command) return;

    print(command, execute(command));
    input.value = "";
    input.focus();
  });

  resetButton.addEventListener("click", resetSimulation);
  resetSimulation();
});
