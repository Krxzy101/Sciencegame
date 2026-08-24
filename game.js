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
    speed: 5,
    jumpPower: -11,
    gravity: 0.5,
    grounded: false
};

// Camera Properties
let camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

// Keyboard Controls
let keys = {};

// Game State
let currentLevel = 0;
let quizActive = false;

// QUESTION BANK SPECIFIC TO MR. BATZ'S WESTMONT CHEMISTRY SYLLABUS
const masterQuestionBank = [
    {
        question: "Who is the teacher for this Chemistry course?",
        options: ["Matthew Batz", "John Westmont", "David Miller", "Robert Smith"],
        answer: 0
    },
    {
        question: "Which classroom is this Chemistry course held in?",
        options: ["Rm. 12", "Rm. 45", "Rm. 63", "Rm. 101"],
        answer: 2
    },
    {
        question: "What website URL is listed on the course syllabus?",
        options: ["batzchemistry.com", "batzchemistry.weebly.com", "westmontchem.org", "batzscience.net"],
        answer: 1
    },
    {
        question: "According to the syllabus, what device is NOT allowed to be used as a calculator?",
        options: ["Scientific Calculator", "Phone Calculator", "CUHSD Chromebook", "Basic Calculator"],
        answer: 1
    },
    {
        question: "Which textbook is used for this Chemistry course?",
        options: ["Conceptual Chemistry", "Experience Chemistry", "Modern Chemistry", "Central Science"],
        answer: 1
    },
    {
        question: "How much weight do Tests, Quizzes, and the Final Exam account for in your overall grade?",
        options: ["30%", "40%", "50%", "60%"],
        answer: 2
    },
    {
        question: "How much weight do Laboratory investigations, projects, and reports account for in your grade?",
        options: ["25%", "35%", "45%", "55%"],
        answer: 2
    },
    {
        question: "What percentage weight is assigned to Homework and Academic Habits?",
        options: ["5%", "10%", "15%", "20%"],
        answer: 0
    },
    {
        question: "Which grade scale range defines an 'A' grade (Advanced understanding)?",
        options: ["(89-80%)", "(100-90%)", "(79-70%)", "(69-60%)"],
        answer: 1
    },
    {
        question: "Are grades in this Chemistry course curved?",
        options: ["Yes, on all tests", "Yes, at the end of the semester", "No, grades are not curved", "Only final exams are curved"],
        answer: 2
    },
    {
        question: "According to the syllabus, what is step #1 in the Chain of Communication?",
        options: ["School Counselor", "Principal", "Assistant Principal", "Teacher"],
        answer: 3
    },
    {
        question: "Which syllabus topic covers heat transfer and energy changes during chemical reactions?",
        options: ["Thermochemistry", "Stoichiometry", "Electrochemistry", "Nuclear Chemistry"],
        answer: 0
    },
    {
        question: "Which syllabus unit covers the study of carbon-containing compounds?",
        options: ["Organic Chemistry", "Nuclear Chemistry", "Electrochemistry", "Periodic Trends"],
        answer: 0
    },
    {
        question: "Which course topic focuses on quantitative relationships and calculations in chemical reactions?",
        options: ["Gases", "Solutions", "Stoichiometry", "Bonding"],
        answer: 2
    }
];

// 5 BALANCED LEVELS - Bridges wide gaps with reachable stepping platforms
const levels = [
    // --- LEVEL 1 ---
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 350, height: 30, type: "ground" },
            { x: 750, y: 370, width: 400, height: 30, type: "ground" },
            { x: 1550, y: 370, width: 850, height: 30, type: "ground" },

            // Bridge Gap 1 (350 to 750)
            { x: 420, y: 300, width: 90, height: 18, type: "platform" },
            { x: 580, y: 230, width: 90, height: 18, type: "platform" },

            // Bridge Gap 2 (1150 to 1550)
            { x: 1220, y: 290, width: 90, height: 18, type: "platform" },
            { x: 1390, y: 220, width: 90, height: 18, type: "platform" },

            { x: 2300, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 580, y: 190, width: 24, height: 24, asked: false, question: null },
            { x: 1390, y: 180, width: 24, height: 24, asked: false, question: null }
        ]
    },

    // --- LEVEL 2 ---
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 300, height: 30, type: "ground" },
            { x: 800, y: 370, width: 350, height: 30, type: "ground" },
            { x: 1650, y: 370, width: 750, height: 30, type: "ground" },

            // Bridge Gap 1 (300 to 800)
            { x: 380, y: 310, width: 90, height: 18, type: "platform" },
            { x: 520, y: 240, width: 90, height: 18, type: "platform" },
            { x: 660, y: 300, width: 90, height: 18, type: "platform" },

            // Bridge Gap 2 (1150 to 1650)
            { x: 1250, y: 300, width: 90, height: 18, type: "platform" },
            { x: 1390, y: 230, width: 90, height: 18, type: "platform" },
            { x: 1520, y: 300, width: 90, height: 18, type: "platform" },

            { x: 2300, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 520, y: 200, width: 24, height: 24, asked: false, question: null },
            { x: 1390, y: 190, width: 24, height: 24, asked: false, question: null }
        ]
    },

    // --- LEVEL 3 ---
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 250, height: 30, type: "ground" },
            { x: 900, y: 370, width: 300, height: 30, type: "ground" },
            { x: 1750, y: 370, width: 650, height: 30, type: "ground" },

            // Bridge Gap 1 (250 to 900)
            { x: 320, y: 310, width: 85, height: 18, type: "platform" },
            { x: 450, y: 240, width: 85, height: 18, type: "platform" },
            { x: 600, y: 240, width: 85, height: 18, type: "platform" },
            { x: 750, y: 310, width: 85, height: 18, type: "platform" },

            // Bridge Gap 2 (1200 to 1750)
            { x: 1300, y: 310, width: 85, height: 18, type: "platform" },
            { x: 1440, y: 230, width: 85, height: 18, type: "platform" },
            { x: 1600, y: 300, width: 85, height: 18, type: "platform" },

            { x: 2300, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 600, y: 200, width: 24, height: 24, asked: false, question: null },
            { x: 1440, y: 190, width: 24, height: 24, asked: false, question: null }
        ]
    },

    // --- LEVEL 4 ---
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 200, height: 30, type: "ground" },
            { x: 1000, y: 370, width: 250, height: 30, type: "ground" },
            { x: 1850, y: 370, width: 550, height: 30, type: "ground" },

            // Bridge Gap 1 (200 to 1000)
            { x: 280, y: 310, width: 80, height: 18, type: "platform" },
            { x: 420, y: 240, width: 80, height: 18, type: "platform" },
            { x: 570, y: 190, width: 80, height: 18, type: "platform" },
            { x: 720, y: 240, width: 80, height: 18, type: "platform" },
            { x: 860, y: 310, width: 80, height: 18, type: "platform" },

            // Bridge Gap 2 (1250 to 1850)
            { x: 1350, y: 310, width: 80, height: 18, type: "platform" },
            { x: 1490, y: 230, width: 80, height: 18, type: "platform" },
            { x: 1640, y: 230, width: 80, height: 18, type: "platform" },
            { x: 1760, y: 310, width: 80, height: 18, type: "platform" },

            { x: 2300, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 570, y: 150, width: 24, height: 24, asked: false, question: null },
            { x: 1640, y: 190, width: 24, height: 24, asked: false, question: null }
        ]
    },

    // --- LEVEL 5 ---
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 180, height: 30, type: "ground" },
            { x: 1100, y: 370, width: 200, height: 30, type: "ground" },
            { x: 2100, y: 370, width: 300, height: 30, type: "ground" },

            // Bridge Gap 1 (180 to 1100)
            { x: 250, y: 310, width: 75, height: 18, type: "platform" },
            { x: 380, y: 240, width: 75, height: 18, type: "platform" },
            { x: 520, y: 180, width: 75, height: 18, type: "platform" },
            { x: 670, y: 180, width: 75, height: 18, type: "platform" },
            { x: 810, y: 240, width: 75, height: 18, type: "platform" },
            { x: 950, y: 310, width: 75, height: 18, type: "platform" },

            // Bridge Gap 2 (1300 to 2100)
            { x: 1390, y: 310, width: 75, height: 18, type: "platform" },
            { x: 1520, y: 240, width: 75, height: 18, type: "platform" },
            { x: 1660, y: 180, width: 75, height: 18, type: "platform" },
            { x: 1810, y: 240, width: 75, height: 18, type: "platform" },
            { x: 1950, y: 310, width: 75, height: 18, type: "platform" },

            { x: 2300, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 670, y: 140, width: 24, height: 24, asked: false, question: null },
            { x: 1660, y: 140, width: 24, height: 24, asked: false, question: null }
        ]
    }
];

let activePaper = null;

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
    loadLevel(0);
    requestAnimationFrame(gameLoop);
}

// Fisher-Yates shuffle algorithm for true randomness
function getRandomQuestions(count) {
    let pool = [...masterQuestionBank];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
}

function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        alert("Congratulations! You completed all 5 chemistry syllabus levels!");
        currentLevel = 0;
    } else {
        currentLevel = levelIndex;
    }

    // Reset Player position
    player.x = 50;
    player.y = 300;
    player.dx = 0;
    player.dy = 0;

    // Pull fresh random questions for papers on this level
    let levelPapers = levels[currentLevel].papers;
    let selectedQuestions = getRandomQuestions(levelPapers.length);

    levelPapers.forEach((paper, idx) => {
        paper.asked = false;
        paper.question = selectedQuestions[idx];
    });
}

function isLevelComplete() {
    return levels[currentLevel].papers.every(paper => paper.asked);
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

    // Boundary check for level width
    let currentMapWidth = levels[currentLevel].width;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > currentMapWidth) player.x = currentMapWidth - player.width;

    // Reset player if falling off screen into a gap
    if (player.y > canvas.height + 100) {
        player.x = 50;
        player.y = 300;
        player.dy = 0;
    }

    // Camera following player
    camera.x = player.x - canvas.width / 2 + player.width / 2;
    if (camera.x < 0) camera.x = 0;
    if (camera.x > currentMapWidth - canvas.width) camera.x = currentMapWidth - canvas.width;

    player.grounded = false;
    let currentPlatforms = levels[currentLevel].platforms;

    // 1. Solid Platform Collisions (Excludes Exit Door)
    currentPlatforms.forEach(p => {
        if (p.type === "exit") return;

        if (
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height <= p.y + player.dy + 5 &&
            player.y + player.height + player.dy >= p.y
        ) {
            player.grounded = true;
            player.dy = 0;
            player.y = p.y - player.height;
        }
    });

    // 2. Dedicated Exit Door Wall Collision Logic
    let exitDoor = currentPlatforms.find(p => p.type === "exit");
    if (
        exitDoor &&
        player.x < exitDoor.x + exitDoor.width &&
        player.x + player.width > exitDoor.x &&
        player.y < exitDoor.y + exitDoor.height &&
        player.y + player.height > exitDoor.y
    ) {
        if (isLevelComplete()) {
            loadLevel(currentLevel + 1);
        } else {
            // Act like a solid wall
            if (player.dx > 0) player.x = exitDoor.x - player.width;
            if (player.dx < 0) player.x = exitDoor.x + exitDoor.width;
        }
    }

    // Paper Item Collisions
    let currentPapers = levels[currentLevel].papers;
    currentPapers.forEach((paper) => {
        if (!paper.asked &&
            player.x < paper.x + paper.width &&
            player.x + player.width > paper.x &&
            player.y < paper.y + paper.height &&
            player.y + player.height > paper.y
        ) {
            triggerQuiz(paper);
        }
    });
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Camera offset
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    let complete = isLevelComplete();

    // Draw Platforms & Exit
    levels[currentLevel].platforms.forEach(p => {
        if (p.type === "ground") {
            ctx.fillStyle = "#27ae60";
        } else if (p.type === "exit") {
            ctx.fillStyle = complete ? "#2ecc71" : "#e74c3c";
        } else {
            ctx.fillStyle = "#34495e";
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
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.restore();

    // Draw HUD
    ctx.fillStyle = "#fff";
    ctx.font = "16px monospace";
    ctx.fillText(`Level ${currentLevel + 1} / 5`, 15, 25);

    ctx.fillStyle = complete ? "#2ecc71" : "#e74c3c";
    ctx.fillText(complete ? "Door Unlocked!" : "Collect all papers to unlock door", 150, 25);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function triggerQuiz(paper) {
    quizActive = true;
    activePaper = paper;
    let q = paper.question;

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
    let q = activePaper.question;
    if (selectedIndex === q.answer) {
        alert("Correct!");
        activePaper.asked = true;
    } else {
        alert("Incorrect! Try again.");
    }
    closeQuiz();
}

function closeQuiz() {
    quizModal.style.display = "none";
    quizActive = false;
}

window.onload = init;
