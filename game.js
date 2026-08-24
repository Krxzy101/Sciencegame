// Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player Properties
let player = {
    x: 50,
    y: 300,
    width: 25,
    height: 25,
    dx: 0,
    dy: 0,
    speed: 4,
    jumpPower: -10,
    gravity: 0.5,
    grounded: false
};

// Keyboard Controls
let keys = {};

// Game Platforms & Quiz Blocks
let platforms = [
    { x: 0, y: 370, width: 800, height: 30, type: "ground" },
    { x: 100, y: 290, width: 90, height: 18, type: "quiz", asked: false },
    { x: 230, y: 230, width: 90, height: 18, type: "platform" },
    { x: 350, y: 170, width: 90, height: 18, type: "quiz", asked: false },
    { x: 490, y: 220, width: 90, height: 18, type: "quiz", asked: false },
    { x: 630, y: 160, width: 90, height: 18, type: "quiz", asked: false }
];

// Quiz State & Question Pool
let currentQuestionIndex = 0;
let quizActive = false;

const questions = [
    // --- NFPA & SAFETY ---
    {
        question: "On the NFPA 704 hazard diamond, what does the BLUE section represent?",
        options: ["Health Hazard", "Flammability", "Instability/Reactivity", "Special Hazards"],
        answer: 0
    },
    {
        question: "On the NFPA 704 hazard diamond, what rating indicates extreme flammability?",
        options: ["0", "1", "3", "4"],
        answer: 3
    },
    {
        question: "What safety equipment is used when working with noxious or toxic fumes?",
        options: ["Eyewash Station", "Fume Hood", "Safety Shower", "Fire Blanket"],
        answer: 1
    },

    // --- EQUIPMENT ---
    {
        question: "Which piece of lab glassware is designed for highly precise liquid measurements?",
        options: ["Beaker", "Graduated Cylinder", "Test Tube", "Watch Glass"],
        answer: 1
    },
    {
        question: "Which glass container has a flat bottom and narrow neck, perfect for swirling liquids?",
        options: ["Beaker", "Erlenmeyer Flask", "Graduated Cylinder", "Pipette"],
        answer: 1
    },

    // --- SYLLABUS CONCEPTS ---
    {
        question: "Which subatomic particle has a negative charge and orbits the nucleus?",
        options: ["Proton", "Neutron", "Electron", "Photon"],
        answer: 2
    },
    {
        question: "As you move left to right across a period on the Periodic Table, atomic radius:",
        options: ["Increases", "Decreases", "Stays the same", "Doubles"],
        answer: 1
    },
    {
        question: "What type of bond forms when electrons are transferred from a metal to a nonmetal?",
        options: ["Covalent Bond", "Ionic Bond", "Metallic Bond", "Hydrogen Bond"],
        answer: 1
    },
    {
        question: "A solution with a pH value of 3 is considered:",
        options: ["Strongly Basic", "Weakly Basic", "Neutral", "Acidic"],
        answer: 3
    }
];

// Key Listeners
window.addEventListener("keydown", (e) => keys[e.code] = true);
window.addEventListener("keyup", (e) => keys[e.code] = false);

// Modal UI Elements
const quizModal = document.getElementById("quiz-modal");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const cancelBtn = document.getElementById("cancel-btn");

if (cancelBtn) {
    cancelBtn.addEventListener("click", closeQuiz);
}

function init() {
    requestAnimationFrame(gameLoop);
}

function update() {
    if (quizActive) return; // Pause movement during active quiz

    if (keys["ArrowRight"] || keys["KeyD"]) player.dx = player.speed;
    else if (keys["ArrowLeft"] || keys["KeyA"]) player.dx = -player.speed;
    else player.dx = 0;

    if ((keys["ArrowUp"] || keys["KeyW"] || keys["Space"]) && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }

    player.dy += player.gravity;
    player.x += player.dx;
    player.y += player.dy;

    // Keep player in bounds
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
            ctx.fillStyle = p.asked ? "#555555" : "#f1c40f";
        } else if (p.type === "ground") {
            ctx.fillStyle = "#27ae60";
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

window.onload = init;
