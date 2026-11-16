
const questions = [
    {
        question: "What is the main goal of DevOps?",
        options: [
            "To eliminate all testing",
            "To improve collaboration and software delivery",
            "To replace programmers",
            "To avoid using version control"
        ],
        answer: 1,
        explanation: "DevOps improves collaboration between development and operations to deliver software reliably."
    },
    {
        question: "What is Git mainly used for?",
        options: [
            "Editing images",
            "Hosting websites only",
            "Tracking changes in source code",
            "Creating databases automatically"
        ],
        answer: 2,
        explanation: "Git is a distributed version control system that tracks changes to files."
    },
    {
        question: "What does a Git commit represent?",
        options: [
            "A saved snapshot of project changes",
            "A new computer",
            "A deleted repository",
            "A website address"
        ],
        answer: 0,
        explanation: "A commit records a snapshot of tracked project changes in the repository history."
    },
    {
        question: "What is Continuous Integration (CI)?",
        options: [
            "Manually copying files every day",
            "Combining code changes frequently and checking them automatically",
            "Avoiding code reviews",
            "Deploying without testing"
        ],
        answer: 1,
        explanation: "CI integrates code changes frequently and runs automated checks such as tests."
    },
    {
        question: "What is the purpose of a Git branch?",
        options: [
            "To permanently delete the main branch",
            "To store passwords",
            "To create a separate line of development",
            "To install Python"
        ],
        answer: 2,
        explanation: "Branches let developers work on features independently before integrating their changes."
    }
];

let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let answered = false;

const counter = document.getElementById("question-counter");
const scorePreview = document.getElementById("score-preview");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedback = document.getElementById("feedback");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const resultPanel = document.getElementById("result-panel");
const finalScore = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");
const retryBtn = document.getElementById("retry-btn");

function renderQuestion() {
    const item = questions[currentQuestion];

    selectedOption = null;
    answered = false;

    counter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    scorePreview.textContent = `Score: ${score}`;
    progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
    questionText.textContent = item.question;
    optionsContainer.replaceChildren();
    feedback.textContent = "";
    feedback.className = "feedback";

    item.options.forEach((optionText, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option";
        button.textContent = `${String.fromCharCode(65 + index)}. ${optionText}`;

        button.addEventListener("click", () => {
            if (answered) return;

            selectedOption = index;

            document.querySelectorAll(".option").forEach(option => {
                option.classList.remove("selected");
            });

            button.classList.add("selected");
            feedback.textContent = "";
            feedback.className = "feedback";
        });

        optionsContainer.appendChild(button);
    });

    submitBtn.hidden = false;
    submitBtn.disabled = false;
    nextBtn.hidden = true;
}

function checkAnswer() {
    if (selectedOption === null) {
        feedback.textContent = "Please select an option first.";
        feedback.className = "feedback error";
        return;
    }

    if (answered) return;

    answered = true;
    const item = questions[currentQuestion];
    const optionButtons = document.querySelectorAll(".option");
    const isCorrect = selectedOption === item.answer;

    if (isCorrect) {
        score++;
        feedback.textContent = `Correct! ${item.explanation}`;
        feedback.className = "feedback success";
    } else {
        feedback.textContent =
            `Incorrect. Correct answer: ${item.options[item.answer]}. ${item.explanation}`;
        feedback.className = "feedback error";
    }

    optionButtons.forEach((button, index) => {
        button.disabled = true;

        if (index === item.answer) {
            button.classList.add("correct");
        } else if (index === selectedOption) {
            button.classList.add("incorrect");
        }
    });

    scorePreview.textContent = `Score: ${score}`;
    submitBtn.hidden = true;
    nextBtn.hidden = false;

    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = "View Results →";
    } else {
        nextBtn.textContent = "Next Question →";
    }
}

function showResults() {
    questionText.hidden = true;
    optionsContainer.hidden = true;
    feedback.hidden = true;
    counter.hidden = true;
    scorePreview.hidden = true;
    progressBar.style.width = "100%";
    submitBtn.hidden = true;
    nextBtn.hidden = true;
    resultPanel.hidden = false;

    finalScore.textContent = `Your score: ${score} out of ${questions.length}`;

    if (score === questions.length) {
        resultMessage.textContent = "Excellent! You answered every question correctly.";
    } else if (score >= 3) {
        resultMessage.textContent = "Good work! Review the explanations and keep practising.";
    } else {
        resultMessage.textContent = "Keep learning! Review the lessons and try again.";
    }
}

function nextQuestion() {
    if (!answered) return;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        showResults();
    }
}

function retryQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    answered = false;

    questionText.hidden = false;
    optionsContainer.hidden = false;
    feedback.hidden = false;
    counter.hidden = false;
    scorePreview.hidden = false;
    resultPanel.hidden = true;

    renderQuestion();
}

submitBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", nextQuestion);
retryBtn.addEventListener("click", retryQuiz);

renderQuestion();
