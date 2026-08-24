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

// MASTER QUESTION BANK - Targeted to Syllabus, Materials, Safety & Lab Equipment
const masterQuestionBank = [
    // --- COURSE MATERIALS & SYLLABUS ---
    {
        question: "Which of the following is an expected material for Chemistry class?",
        options: ["CUIBSD Chromebook", "Phone Calculator", "Colored Pencils", "Graphing Tablet"],
        answer: 0
    },
    {
        question: "According to class rules, what device is NOT permitted to be used as a calculator?",
        options: ["Scientific Calculator", "Phone Calculator", "CUIBSD Chromebook", "Basic Calculator"],
        answer: 1
    },
    {
        question: "Which textbook is used for this General Chemistry course?",
        options: ["Conceptual Chemistry", "Experience Chemistry", "Modern Chemistry", "Chemistry Central Science"],
        answer: 1
    },

    // --- LAB SAFETY & NFPA DIAMOND ---
    {
        question: "On the NFPA 704 hazard diamond, what does the RED section represent?",
        options: ["Health Hazard", "Flammability", "Instability/Reactivity", "Special Hazard"],
        answer: 1
    },
    {
        question: "On the NFPA 704 hazard diamond, what does the YELLOW section represent?",
        options: ["Health Hazard", "Flammability", "Instability/Reactivity", "Special Hazard"],
        answer: 2
    },
    {
        question: "On the NFPA 704 hazard diamond, what does a rating of 0 indicate?",
        options: ["Extreme Hazard", "Minimal Hazard", "Moderate Hazard", "High Hazard"],
        answer: 1
    },
    {
        question: "Where should you go immediately if chemical reagents spill on your clothing or body?",
        options: ["Eyewash Station", "Safety Shower", "Fume Hood", "Fire Blanket"],
        answer: 1
    },

    // --- LAB EQUIPMENT ---
    {
        question: "Which piece of glass equipment is used for holding, heating, and mixing chemicals coarsely (not precise measurement)?",
        options: ["Beaker", "Graduated Cylinder", "Volumetric Pipette", "Burette"],
        answer: 0
    },
    {
        question: "What lab apparatus is used to support a crucible or porcelain dish over a Bunsen burner?",
        options: ["Clay Triangle", "Watch Glass", "Mortar and Pestle", "Test Tube Holder"],
        answer: 0
    },
    {
        question: "Which tool is best suited for grinding solid chemical crystals into a fine powder?",
        options: ["Evaporating Dish", "Crucible", "Mortar and Pestle", "Watch Glass"],
        answer: 2
    },
    {
        question: "Which device is used to precisely measure liquid volume by delivering variable quantities during titration?",
        options: ["Graduated Cylinder", "Burette", "Erlenmeyer Flask", "Beaker"],
        answer: 1
    },

    // --- SYLLABUS UNITS & TOPICS ---
    {
        question: "Which syllabus topic focuses on the calculations of reactants and products in chemical reactions?",
        options: ["Thermochemistry", "Stoichiometry", "Electrochemistry", "Nuclear Chemistry"],
        answer: 1
    },
    {
        question: "Which topic covers heat changes and heat transfer during chemical processes?",
        options: ["Gases", "Solutions", "Thermochemistry", "Bonding"],
        answer: 2
    },
    {
        question: "Which syllabus unit covers the study of carbon-containing compounds?",
        options: ["Organic Chemistry", "Nuclear Chemistry", "Electrochemistry", "Periodic Trends"],
        answer: 0
    },
    {
        question: "Which topic deals with radioactive decay, fission, and fusion?",
        options: ["Atomic Structure", "Nuclear Chemistry", "Electrochemistry", "Stoichiometry"],
        answer: 1
    }
];

// EXPANDED LEVEL DESIGNS (Width: 2400px)
const levels = [
    {
        width: 2400,
        platforms: [
            // Ground sections with gaps
            { x: 0, y: 370, width: 700, height: 30, type: "ground" },
            { x: 800, y: 370, width: 800, height: 30, type: "ground" },
            { x: 1700, y: 370, width: 700, height: 30, type: "ground" },

            // Floating Platforms spread across 2400px
            { x: 200, y: 290, width: 100, height: 18, type: "platform" },
            { x: 380, y: 220, width: 110, height: 18, type: "platform" },
            { x: 550, y: 160, width: 100, height: 18, type: "platform" },
            
            { x: 850, y: 280, width: 120, height: 18, type: "platform" },
            { x: 1050, y: 210, width: 100, height: 18, type: "platform" },
            { x: 1250, y: 150, width: 110, height: 18, type: "platform" },
            { x: 1450, y: 230, width: 100, height: 18, type: "platform" },

            { x: 1750, y: 280, width: 110, height: 18, type: "platform" },
            { x: 1950, y: 200, width: 100, height: 18, type: "platform" },

            // Exit Portal at the far end
            { x: 2280, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 420, y: 190, width: 24, height: 24, asked: false, question: null },
            { x: 1080, y: 180, width: 24, height: 24, asked: false, question: null },
            { x: 1280, y: 120, width: 24, height: 24, asked: false, question: null },
            { x: 1980, y: 170, width: 24, height: 24, asked: false, question: null }
        ]
    },
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 500, height: 30, type: "ground" },
            { x: 600, y: 370, width: 600, height: 30, type: "ground" },
            { x: 1300, y: 370, width: 1100, height: 30, type: "ground" },

            { x: 150, y: 280, width: 90, height: 18, type: "platform" },
            { x: 300, y: 210, width: 90, height: 18, type: "platform" },
            { x: 480, y: 150, width: 90, height: 18, type: "platform" },

            { x: 700, y: 250, width: 100, height: 18, type: "platform" },
            { x: 900, y: 180, width: 100, height: 18, type: "platform" },
            { x: 1100, y: 240, width: 100, height: 18, type: "platform" },

            { x: 1400, y: 290, width: 100, height: 18, type: "platform" },
            { x: 1600, y: 220, width: 100, height: 18, type: "platform" },
            { x: 1800, y: 160, width: 100, height: 18, type: "platform" },
            { x: 2000, y: 230, width: 100, height: 18, type: "platform" },

            { x: 2280, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 320, y: 180, width: 24, height: 24, asked: false, question: null },
            { x: 920, y: 150, width: 24, height: 24, asked: false, question: null },
            { x: 1620, y: 190, width: 24, height: 24, asked: false, question: null },
            { x: 2020, y: 200, width: 24, height: 24, asked: false, question: null }
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

function getRandomQuestions(count) {
    let shuffled = [...masterQuestionBank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        alert("Congratulations! You completed all chemistry levels!");
        currentLevel = 0;
    } else {
        currentLevel = levelIndex;
    }

    // Reset Player
    player.x = 50;
    player.y = 300;
    player.dx = 0;
    player.dy = 0;

    // Assign random questions
    let levelPapers = levels[currentLevel].papers;
    let randomQuestions = getRandomQuestions(levelPapers.length);

    levelPapers.forEach((paper, idx) => {
        paper.asked = false;
        paper.question = randomQuestions[idx];
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

    // Camera following player logic
    camera.x = player.x - canvas.width / 2 + player.width / 2;
    if (camera.x < 0) camera.x = 0;
    if (camera.x > currentMapWidth - canvas.width) camera.x = currentMapWidth - canvas.width;

    player.grounded = false;
    let currentPlatforms = levels[currentLevel].platforms;

    // Platform & Exit Collisions
    currentPlatforms.forEach(p => {
        if (
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height <= p.y + player.dy + 5 &&
            player.y + player.height + player.dy >= p.y
        ) {
            if (p.type === "exit") {
                if (isLevelComplete()) {
                    loadLevel(currentLevel + 1);
                } else {
                    player.x -= player.dx;
                }
                return;
            }

            player.grounded = true;
            player.dy = 0;
            player.y = p.y - player.height;
        }
    });

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

    // Save context and apply camera transform
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Draw Platforms & Exit Door
    let complete = isLevelComplete();
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

    // Draw Floating Paper Icons (📄)
    levels[currentLevel].papers.forEach(paper => {
        if (!paper.asked) {
            ctx.font = "22px sans-serif";
            ctx.fillText("📄", paper.x, paper.y + 20);
        }
    });

    // Draw Player
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Restore context for HUD (Fixed to Screen)
    ctx.restore();

    // Draw HUD Elements
    ctx.fillStyle = "#fff";
    ctx.font = "16px monospace";
    ctx.fillText(`Level ${currentLevel + 1}`, 15, 25);

    ctx.fillStyle = complete ? "#2ecc71" : "#e74c3c";
    ctx.fillText(complete ? "Door Unlocked!" : "Collect all papers to unlock door", 120, 25);
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
