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

// EXPANDED MASTER QUESTION BANK
const masterQuestionBank = [
    // --- COURSE MATERIALS & SYLLABUS ---
    {
        question: "Which of the following is a required material for Chemistry class?",
        options: ["CUHSD Chromebook", "Phone Calculator", "Colored Pencils", "Graphing Tablet"],
        answer: 0
    },
    {
        question: "According to syllabus rules, what device is NOT allowed to be used as a calculator?",
        options: ["Scientific Calculator", "Phone Calculator", "CUHSD Chromebook", "Basic Calculator"],
        answer: 1
    },
    {
        question: "Which textbook is used for this General Chemistry course?",
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

    // --- LAB SAFETY & NFPA 704 DIAMOND ---
    {
        question: "On the NFPA 704 hazard diamond, what does the BLUE section represent?",
        options: ["Health Hazard", "Flammability", "Instability/Reactivity", "Special Hazard"],
        answer: 0
    },
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
        question: "On the NFPA 704 diamond, what rating number indicates extreme hazard?",
        options: ["0", "1", "3", "4"],
        answer: 3
    },
    {
        question: "Where should you go immediately if chemical reagents splash on your body or clothes?",
        options: ["Eyewash Station", "Safety Shower", "Fume Hood", "Fire Blanket"],
        answer: 1
    },
    {
        question: "What safety item must always be worn during laboratory investigations involving chemicals or heat?",
        options: ["Sunglasses", "Safety Goggles", "Earplugs", "Dust Mask"],
        answer: 1
    },

    // --- LAB EQUIPMENT ---
    {
        question: "Which piece of glass equipment is used for holding and mixing liquids coarsely (not precise volume measurement)?",
        options: ["Beaker", "Graduated Cylinder", "Volumetric Pipette", "Burette"],
        answer: 0
    },
    {
        question: "Which laboratory equipment is specifically designed to measure liquid volumes with high precision?",
        options: ["Beaker", "Graduated Cylinder", "Test Tube", "Watch Glass"],
        answer: 1
    },
    {
        question: "Which flask features a flat bottom and narrow conical neck, making it ideal for swirling liquids without splashing?",
        options: ["Beaker", "Erlenmeyer Flask", "Volumetric Flask", "Florence Flask"],
        answer: 1
    },
    {
        question: "What lab equipment is used to support a crucible or dish while heating over a Bunsen burner?",
        options: ["Clay Triangle", "Watch Glass", "Mortar and Pestle", "Test Tube Holder"],
        answer: 0
    },
    {
        question: "Which tool is best suited for grinding solid chemical crystals into a fine powder?",
        options: ["Evaporating Dish", "Crucible", "Mortar and Pestle", "Watch Glass"],
        answer: 2
    },
    {
        question: "Which device is used in titrations to deliver variable, highly accurate amounts of liquid?",
        options: ["Graduated Cylinder", "Burette", "Erlenmeyer Flask", "Beaker"],
        answer: 1
    },

    // --- SYLLABUS UNITS & CONCEPTS ---
    {
        question: "Which syllabus topic focuses on calculating quantities of reactants and products in chemical reactions?",
        options: ["Thermochemistry", "Stoichiometry", "Electrochemistry", "Nuclear Chemistry"],
        answer: 1
    },
    {
        question: "Which unit covers heat transfer, enthalpy, and energy changes during chemical processes?",
        options: ["Gases", "Solutions", "Thermochemistry", "Bonding"],
        answer: 2
    },
    {
        question: "Which syllabus unit covers the study of carbon-containing compounds?",
        options: ["Organic Chemistry", "Nuclear Chemistry", "Electrochemistry", "Periodic Trends"],
        answer: 0
    },
    {
        question: "Which unit deals with radioactive decay, half-lives, fission, and fusion?",
        options: ["Atomic Structure", "Nuclear Chemistry", "Electrochemistry", "Stoichiometry"],
        answer: 1
    },
    {
        question: "What type of chemical bond forms when electrons are transferred from a metal to a nonmetal?",
        options: ["Covalent Bond", "Ionic Bond", "Metallic Bond", "Hydrogen Bond"],
        answer: 1
    },
    {
        question: "A solution with a pH value of 3 is classified as:",
        options: ["Strongly Basic", "Weakly Basic", "Neutral", "Acidic"],
        answer: 3
    },
    {
        question: "Which subatomic particle carries a negative charge and orbits the nucleus?",
        options: ["Proton", "Neutron", "Electron", "Photon"],
        answer: 2
    },
    {
        question: "As you move from left to right across a period on the Periodic Table, atomic radius generally:",
        options: ["Increases", "Decreases", "Stays the same", "Doubles"],
        answer: 1
    }
];

// 5 EXPANDED LEVELS WITH LARGE GAPS (2400px Wide)
const levels = [
    // --- LEVEL 1 ---
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 350, height: 30, type: "ground" },
            { x: 750, y: 370, width: 400, height: 30, type: "ground" },
            { x: 1550, y: 370, width: 450, height: 30, type: "ground" },

            { x: 420, y: 300, width: 100, height: 18, type: "platform" },
            { x: 580, y: 230, width: 100, height: 18, type: "platform" },

            { x: 1220, y: 290, width: 100, height: 18, type: "platform" },
            { x: 1390, y: 220, width: 100, height: 18, type: "platform" },

            { x: 2050, y: 300, width: 110, height: 18, type: "platform" },

            { x: 2280, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 450, y: 260, width: 24, height: 24, asked: false, question: null },
            { x: 610, y: 190, width: 24, height: 24, asked: false, question: null },
            { x: 1250, y: 250, width: 24, height: 24, asked: false, question: null },
            { x: 1420, y: 180, width: 24, height: 24, asked: false, question: null }
        ]
    },

    // --- LEVEL 2 ---
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 300, height: 30, type: "ground" },
            { x: 800, y: 370, width: 350, height: 30, type: "ground" },
            { x: 1650, y: 370, width: 400, height: 30, type: "ground" },

            { x: 360, y: 310, width: 90, height: 18, type: "platform" },
            { x: 500, y: 240, width: 90, height: 18, type: "platform" },
            { x: 650, y: 180, width: 90, height: 18, type: "platform" },

            { x: 1220, y: 300, width: 90, height: 18, type: "platform" },
            { x: 1360, y: 220, width: 90, height: 18, type: "platform" },
            { x: 1500, y: 160, width: 90, height: 18, type: "platform" },

            { x: 2120, y: 290, width: 90, height: 18, type: "platform" },

            { x: 2280, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 530, y: 200, width: 24, height: 24, asked: false, question: null },
            { x: 680, y: 140, width: 24, height: 24, asked: false, question: null },
            { x: 1380, y: 180, width: 24, height: 24, asked: false, question: null },
            { x: 1530, y: 120, width: 24, height: 24, asked: false, question: null }
        ]
    },

    // --- LEVEL 3 ---
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 250, height: 30, type: "ground" },
            { x: 900, y: 370, width: 300, height: 30, type: "ground" },
            { x: 1750, y: 370, width: 350, height: 30, type: "ground" },

            { x: 310, y: 310, width: 85, height: 18, type: "platform" },
            { x: 440, y: 240, width: 85, height: 18, type: "platform" },
            { x: 580, y: 180, width: 85, height: 18, type: "platform" },
            { x: 730, y: 250, width: 85, height: 18, type: "platform" },

            { x: 1260, y: 310, width: 85, height: 18, type: "platform" },
            { x: 1390, y: 230, width: 85, height: 18, type: "platform" },
            { x: 1520, y: 170, width: 85, height: 18, type: "platform" },
            { x: 1640, y: 240, width: 85, height: 18, type: "platform" },

            { x: 2150, y: 300, width: 90, height: 18, type: "platform" },

            { x: 2280, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 460, y: 200, width: 24, height: 24, asked: false, question: null },
            { x: 600, y: 140, width: 24, height: 24, asked: false, question: null },
            { x: 1410, y: 190, width: 24, height: 24, asked: false, question: null },
            { x: 1540, y: 130, width: 24, height: 24, asked: false, question: null }
        ]
    },

    // --- LEVEL 4 ---
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 200, height: 30, type: "ground" },
            { x: 1000, y: 370, width: 250, height: 30, type: "ground" },
            { x: 1850, y: 370, width: 300, height: 30, type: "ground" },

            { x: 260, y: 300, width: 80, height: 18, type: "platform" },
            { x: 390, y: 230, width: 80, height: 18, type: "platform" },
            { x: 530, y: 170, width: 80, height: 18, type: "platform" },
            { x: 670, y: 220, width: 80, height: 18, type: "platform" },
            { x: 820, y: 280, width: 80, height: 18, type: "platform" },

            { x: 1320, y: 300, width: 80, height: 18, type: "platform" },
            { x: 1450, y: 220, width: 80, height: 18, type: "platform" },
            { x: 1590, y: 160, width: 80, height: 18, type: "platform" },
            { x: 1720, y: 240, width: 80, height: 18, type: "platform" },

            { x: 2200, y: 290, width: 80, height: 18, type: "platform" },

            { x: 2280, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 410, y: 190, width: 24, height: 24, asked: false, question: null },
            { x: 550, y: 130, width: 24, height: 24, asked: false, question: null },
            { x: 1470, y: 180, width: 24, height: 24, asked: false, question: null },
            { x: 1610, y: 120, width: 24, height: 24, asked: false, question: null }
        ]
    },

    // --- LEVEL 5 ---
    {
        width: 2400,
        platforms: [
            { x: 0, y: 370, width: 180, height: 30, type: "ground" },
            { x: 1100, y: 370, width: 200, height: 30, type: "ground" },

            { x: 230, y: 300, width: 75, height: 18, type: "platform" },
            { x: 360, y: 230, width: 75, height: 18, type: "platform" },
            { x: 500, y: 160, width: 75, height: 18, type: "platform" },
            { x: 650, y: 160, width: 75, height: 18, type: "platform" },
            { x: 800, y: 220, width: 75, height: 18, type: "platform" },
            { x: 950, y: 290, width: 75, height: 18, type: "platform" },

            { x: 1370, y: 300, width: 75, height: 18, type: "platform" },
            { x: 1500, y: 220, width: 75, height: 18, type: "platform" },
            { x: 1640, y: 160, width: 75, height: 18, type: "platform" },
            { x: 1790, y: 160, width: 75, height: 18, type: "platform" },
            { x: 1940, y: 220, width: 75, height: 18, type: "platform" },
            { x: 2100, y: 290, width: 75, height: 18, type: "platform" },

            { x: 2280, y: 300, width: 60, height: 70, type: "exit" }
        ],
        papers: [
            { x: 520, y: 120, width: 24, height: 24, asked: false, question: null },
            { x: 670, y: 120, width: 24, height: 24, asked: false, question: null },
            { x: 1660, y: 120, width: 24, height: 24, asked: false, question: null },
            { x: 1810, y: 120, width: 24, height: 24, asked: false, question: null }
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
        alert("Congratulations! You completed all 5 chemistry levels!");
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
