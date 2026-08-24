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

// Game State
let currentLevel = 0;
let quizActive = false;

// LEVEL DATA: Platforms, Paper Items, and Level-specific Questions
const levels = [
    {
        // Level 1: Lab Safety & Equipment
        platforms: [
            { x: 0, y: 370, width: 800, height: 30, type: "ground" },
            { x: 120, y: 290, width: 100, height: 18, type: "platform" },
            { x: 300, y: 220, width: 100, height: 18, type: "platform" },
            { x: 500, y: 160, width: 100, height: 18, type: "platform" },
            { x: 720, y: 300, width: 60, height: 70, type: "exit" } // Exit Portal
        ],
        papers: [
            { x: 150, y: 260, width: 24, height: 24, asked: false, qIndex: 0 },
            { x: 330, y: 190, width: 24, height: 24, asked: false, qIndex: 1 },
            { x: 530, y: 130, width: 24, height: 24, asked: false, qIndex: 2 }
        ],
        questions: [
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
                question: "Which piece of lab glassware is designed for highly precise liquid measurements?",
                options: ["Beaker", "Graduated Cylinder", "Test Tube", "Watch Glass"],
                answer: 1
            }
        ]
    },
    {
        // Level 2: Atomic Structure & Bonding
        platforms: [
            { x: 0, y: 370, width: 800, height: 30, type: "ground" },
            { x: 100, y: 280, width: 90, height: 18, type: "platform" },
            { x: 250, y: 210, width: 90, height: 18, type: "platform" },
            { x: 420, y: 160, width: 90, height: 18, type: "platform" },
            { x: 580, y: 220, width: 90, height: 18, type: "platform" },
            { x: 720, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 280, y: 180, width: 24, height: 24, asked: false, qIndex: 0 },
            { x: 450, y: 130, width: 24, height: 24, asked: false, qIndex: 1 },
            { x: 610, y: 190, width: 24, height: 24, asked: false, qIndex: 2 }
        ],
        questions: [
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
            }
        ]
    }
];

let activePaperIndex = null;

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

function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        alert("Congratulations! You completed all chemistry levels!");
        currentLevel = 0;
    } else {
        currentLevel = levelIndex;
    }

    // Reset player position
    player.x = 50;
    player.y = 300;
    player.dx = 0;
    player.dy = 0;

    // Reset paper items for loaded level
    levels[currentLevel].papers.forEach(paper => {
        paper.asked = false;
    });
}

function update() {
    if (quizActive) return;

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

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    player.grounded = false;
    let currentPlatforms = levels[currentLevel].platforms;

    // Platform Collisions
    currentPlatforms.forEach(p => {
        if (
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height <= p.y + player.dy + 5 &&
            player.y + player.height + player.dy >= p.y
        ) {
            if (p.type === "exit") {
                loadLevel(currentLevel + 1);
                return;
            }

            player.grounded = true;
            player.dy = 0;
            player.y = p.y - player.height;
        }
    });

    // Check collision with Paper Icons
    let currentPapers = levels[currentLevel].papers;
    currentPapers.forEach((paper) => {
        if (!paper.asked &&
            player.x < paper.x + paper.width &&
            player.x + player.width > paper.x &&
            player.y < paper.y + paper.height &&
            player.y + player.height > paper.y
        ) {
            paper.asked = true;
            triggerQuiz(paper.qIndex);
        }
    });
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Level indicator
    ctx.fillStyle = "#fff";
    ctx.font = "16px monospace";
    ctx.fillText(`Level ${currentLevel + 1}`, 15, 25);

    // Draw Platforms
    levels[currentLevel].platforms.forEach(p => {
        if (p.type === "ground") {
            ctx.fillStyle = "#27ae60";
        } else if (p.type === "exit") {
            ctx.fillStyle = "#9b59b6"; // Exit portal color
        } else {
            ctx.fillStyle = "#2ecc71";
        }
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Draw Paper Icons (📄)
    levels[currentLevel].papers.forEach(paper => {
        if (!paper.asked) {
            ctx.font = "22px sans-serif";
            ctx.fillText("📄", paper.x, paper.y + 20);
        }
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

function triggerQuiz(qIndex) {
    quizActive = true;
    activePaperIndex = qIndex;
    let q = levels[currentLevel].questions[qIndex];
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
    let q = levels[currentLevel].questions[activePaperIndex];
    if (selectedIndex === q.answer) {
        alert("Correct!");
    } else {
        alert("Incorrect!");
    }
    closeQuiz();
}

function closeQuiz() {
    quizModal.style.display = "none";
    quizActive = false;
}

window.onload = init;
