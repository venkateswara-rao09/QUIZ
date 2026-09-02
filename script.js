const questions = [

    // SINGLE CHOICE
    {
        type: "single",
        question: "Which language is primarily used to structure web pages?",
        options: [
            "Python",
            "HTML",
            "Java",
            "C++"
        ],
        answer: "HTML"
    },

    {
        type: "single",
        question: "Which planet is known as the Red Planet?",
        options: [
            "Earth",
            "Venus",
            "Mars",
            "Jupiter"
        ],
        answer: "Mars"
    },

    // MULTIPLE CHOICE
    {
        type: "multiple",
        question: "Which of the following are programming languages?",
        options: [
            "JavaScript",
            "Python",
            "HTML",
            "Java"
        ],
        answer: [
            "JavaScript",
            "Python",
            "Java"
        ]
    },

    {
        type: "multiple",
        question: "Which technologies are commonly used for frontend development?",
        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "MongoDB"
        ],
        answer: [
            "HTML",
            "CSS",
            "JavaScript"
        ]
    },

    // FILL IN THE BLANK
    {
        type: "fill",
        question: "The brain of a computer is called the ______.",
        answer: "CPU"
    },

    {
        type: "fill",
        question: "CSS stands for Cascading Style ______.",
        answer: "Sheets"
    },

    // SINGLE CHOICE
    {
        type: "single",
        question: "Which data structure follows the FIFO principle?",
        options: [
            "Stack",
            "Queue",
            "Tree",
            "Graph"
        ],
        answer: "Queue"
    },

    {
        type: "single",
        question: "Which company developed the Android operating system?",
        options: [
            "Microsoft",
            "Apple",
            "Google",
            "IBM"
        ],
        answer: "Google"
    }

];


let currentIndex = 0;
let score = 0;

let selectedAnswers = [];

let answered = false;


/* DOM ELEMENTS */

const questionElement =
    document.getElementById("question");

const answersElement =
    document.getElementById("answers");

const questionTypeElement =
    document.getElementById("questionType");

const instructionElement =
    document.getElementById("instruction");

const currentQuestionElement =
    document.getElementById("currentQuestion");

const totalQuestionsElement =
    document.getElementById("totalQuestions");

const progressElement =
    document.getElementById("progress");

const nextButton =
    document.getElementById("nextBtn");

const feedbackElement =
    document.getElementById("feedback");

const quizScreen =
    document.getElementById("quizScreen");

const resultScreen =
    document.getElementById("resultScreen");

const finalScore =
    document.getElementById("finalScore");

const scoreMessage =
    document.getElementById("scoreMessage");

const restartButton =
    document.getElementById("restartBtn");


/* INITIAL SETUP */

totalQuestionsElement.textContent =
    questions.length;


/* LOAD QUESTION */

function loadQuestion() {

    const question = questions[currentIndex];

    answered = false;

    selectedAnswers = [];

    questionElement.textContent =
        question.question;

    currentQuestionElement.textContent =
        currentIndex + 1;

    progressElement.style.width =
        `${((currentIndex + 1) / questions.length) * 100}%`;

    feedbackElement.textContent = "";

    feedbackElement.className =
        "feedback";

    answersElement.innerHTML = "";


    /* QUESTION TYPE */

    if (question.type === "single") {

        questionTypeElement.textContent =
            "SINGLE CHOICE";

        instructionElement.textContent =
            "Choose one answer.";

        createSingleChoice(question);

    }


    else if (question.type === "multiple") {

        questionTypeElement.textContent =
            "MULTIPLE CHOICE";

        instructionElement.textContent =
            "Select all correct answers.";

        createMultipleChoice(question);

    }


    else if (question.type === "fill") {

        questionTypeElement.textContent =
            "FILL IN THE BLANK";

        instructionElement.textContent =
            "Type your answer below.";

        createFillQuestion(question);

    }


    if (currentIndex === questions.length - 1) {

        nextButton.textContent =
            "Finish Quiz ✓";

    } else {

        nextButton.textContent =
            "Next Question →";

    }

}


/* SINGLE CHOICE */

function createSingleChoice(question) {

    question.options.forEach(option => {

        const button =
            document.createElement("button");

        button.className = "answer";

        button.textContent = option;


        button.addEventListener("click", () => {

            if (answered) return;

            document
                .querySelectorAll(".answer")
                .forEach(btn =>
                    btn.classList.remove("selected")
                );

            button.classList.add("selected");

            selectedAnswers = [option];

        });


        answersElement.appendChild(button);

    });

}


/* MULTIPLE CHOICE */

function createMultipleChoice(question) {

    question.options.forEach(option => {

        const button =
            document.createElement("button");

        button.className = "answer";

        button.textContent = option;


        button.addEventListener("click", () => {

            if (answered) return;

            button.classList.toggle("selected");


            if (
                selectedAnswers.includes(option)
            ) {

                selectedAnswers =
                    selectedAnswers.filter(
                        answer => answer !== option
                    );

            } else {

                selectedAnswers.push(option);

            }

        });


        answersElement.appendChild(button);

    });

}


/* FILL IN THE BLANK */

function createFillQuestion(question) {

    const input =
        document.createElement("input");

    input.type = "text";

    input.placeholder =
        "Type your answer here...";

    input.className = "text-answer";

    input.id = "textAnswer";


    answersElement.appendChild(input);

}


/* CHECK ANSWER */

function checkAnswer() {

    const question =
        questions[currentIndex];

    let isCorrect = false;


    /* SINGLE */

    if (question.type === "single") {

        if (selectedAnswers.length === 0) {

            showFeedback(
                "Please select an answer first.",
                false
            );

            return;

        }

        isCorrect =
            selectedAnswers[0] === question.answer;

    }


    /* MULTIPLE */

    else if (question.type === "multiple") {

        if (selectedAnswers.length === 0) {

            showFeedback(
                "Please select at least one answer.",
                false
            );

            return;

        }


        const correct =
            [...question.answer].sort();

        const selected =
            [...selectedAnswers].sort();


        isCorrect =
            JSON.stringify(correct) ===
            JSON.stringify(selected);

    }


    /* FILL */

    else if (question.type === "fill") {

        const input =
            document.getElementById("textAnswer");

        const userAnswer =
            input.value.trim().toLowerCase();

        if (!userAnswer) {

            showFeedback(
                "Please enter your answer.",
                false
            );

            return;

        }

        isCorrect =
            userAnswer ===
            question.answer.toLowerCase();

    }


    answered = true;


    if (isCorrect) {

        score++;

        showFeedback(
            "✓ Correct! Great job!",
            true
        );

    } else {

        showFeedback(
            `✕ Incorrect. Correct answer: ${formatAnswer(question.answer)}`,
            false
        );

    }


    highlightAnswers(question);

}


/* SHOW FEEDBACK */

function showFeedback(message, correct) {

    feedbackElement.textContent =
        message;

    feedbackElement.className =
        correct
            ? "feedback correct-text"
            : "feedback wrong-text";

}


/* HIGHLIGHT ANSWERS */

function highlightAnswers(question) {

    if (
        question.type === "single" ||
        question.type === "multiple"
    ) {

        const buttons =
            document.querySelectorAll(".answer");


        buttons.forEach(button => {

            const value =
                button.textContent;


            if (
                Array.isArray(question.answer)
                    ? question.answer.includes(value)
                    : value === question.answer
            ) {

                button.classList.add("correct");

            }


            if (
                selectedAnswers.includes(value) &&
                !(
                    Array.isArray(question.answer)
                        ? question.answer.includes(value)
                        : value === question.answer
                )
            ) {

                button.classList.add("wrong");

            }

        });

    }

}


/* FORMAT ANSWER */

function formatAnswer(answer) {

    if (Array.isArray(answer)) {

        return answer.join(", ");

    }

    return answer;

}


/* NEXT BUTTON */

nextButton.addEventListener("click", () => {

    if (!answered) {

        checkAnswer();

        return;

    }


    currentIndex++;


    if (currentIndex < questions.length) {

        loadQuestion();

    } else {

        showResults();

    }

});


/* RESULTS */

function showResults() {

    quizScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

    finalScore.textContent = score;


    const percentage =
        (score / questions.length) * 100;


    if (percentage === 100) {

        scoreMessage.textContent =
            "Perfect score! You're absolutely amazing! 🔥";

    }

    else if (percentage >= 70) {

        scoreMessage.textContent =
            "Excellent work! You really know your stuff! 🎉";

    }

    else if (percentage >= 50) {

        scoreMessage.textContent =
            "Good attempt! Keep learning and try again! 💪";

    }

    else {

        scoreMessage.textContent =
            "Don't give up! Practice makes perfect! 🚀";

    }

}


/* RESTART */

restartButton.addEventListener("click", () => {

    currentIndex = 0;

    score = 0;

    selectedAnswers = [];

    answered = false;

    resultScreen.classList.add("hidden");

    quizScreen.classList.remove("hidden");

    loadQuestion();

});


/* START */

loadQuestion();