// Game canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player properties
let player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    dx: 0,
    dy: 0,
    speed: 4,
    jumpPower: -10,
    gravity: 0.5,
    grounded: false
};

// Controls
let keys = {};

// Platforms & Question Blocks
let platforms = [
    { x: 0, y: 370, width: 800, height: 30, type: "ground" },
    { x: 150, y: 280, width: 100, height: 20, type: "platform" },
    { x: 320, y: 220, width: 100, height: 20, type: "quiz", asked: false },
    { x: 500, y: 160, width: 100, height: 20, type: "platform" }
];

// Quiz state
let currentQuestionIndex = 0;
let quizActive = false;

const questions = [
    {
        question: "What is the atomic symbol for Gold?",
        options: ["Au", "Ag", "Fe", "Hg"],
        answer: 0
    },
    {
        question: "What is the pH of pure water?",
        options: ["5", "7", "9", "12"],
        answer: 1
    }
];

// Event Listeners for Controls
window.addEventListener("keydown", (e) => keys[e.code] = true);
window.addEventListener("keyup", (e) => keys[e.code] = false);

// Modal UI Elements
const quizModal = document.getElementById("quiz-modal");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const cancelBtn = document.getElementById("cancel-btn");

// Handle Cancel Button Click
if (cancelBtn) {
    cancelBtn.addEventListener("click", closeQuiz);
}

function init() {
    // Game setup without triggering modals on load
    requestAnimationFrame(gameLoop);
}

function update() {
    if (quizActive) return; // Pause movement during quiz

    // Left / Right movement
    if (keys["ArrowRight"] || keys["KeyD"]) player.dx = player.speed;
    else if (keys["ArrowLeft"] || keys["KeyA"]) player.dx = -player.speed;
    else player.dx = 0;

    // Jump
    if ((keys["ArrowUp"] || keys["KeyW"] || keys["Space"]) && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }

    // Apply gravity
    player.dy += player.gravity;

    player.x += player.dx;
    player.y += player.dy;

    // Keep inside canvas bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Platform Collisions
    player.grounded = false;
    platforms.forEach(p => {
        if (
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height <= p.y + player.dy + 5 &&
            player.y + player.height + player.dy >= p.y
        ) {
            player.grounded = true;
            player.dy = 0;
            player.y = p.y - player.height;

            // Trigger quiz if stepping on an unasked quiz block
            if (p.type === "quiz" && !p.asked) {
                p.asked = true;
                triggerQuiz();
            }
        }
    });
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Platforms
    platforms.forEach(p => {
        if (p.type === "quiz") {
            ctx.fillStyle = p.asked ? "#555" : "#f1c40f";
        } else {
            ctx.fillStyle = "#2ecc71";
        }
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Draw Player
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function triggerQuiz() {
    quizActive = true;
    let q = questions[currentQuestionIndex];
    questionText.textContent = q.question;
    optionsContainer.innerHTML = "";

    q.options.forEach((opt, idx) => {
        let btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "quiz-opt-btn";
        btn.onclick = () => checkAnswer(idx);
        optionsContainer.appendChild(btn);
    });

    quizModal.style.display = "flex";
}

function checkAnswer(selectedIndex) {
    let q = questions[currentQuestionIndex];
    if (selectedIndex === q.answer) {
        alert("Correct!");
    } else {
        alert("Incorrect!");
    }
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    closeQuiz();
}

function closeQuiz() {
    quizModal.style.display = "none";
    quizActive = false;
}

// Start game when page loads
window.onload = init;
