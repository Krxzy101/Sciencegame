/* ---------------------------------------------------------
   QUIZ PLATFORMER – Phaser 3 (v3.55)
   --------------------------------------------------------- */

const CONFIG = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let game;
let gameStarted = false;

// Wait for Phaser to load before initializing
window.addEventListener('load', () => {
  if (typeof Phaser !== 'undefined') {
    game = new Phaser.Game(CONFIG);
  } else {
    console.error('Phaser failed to load');
  }
});

/* ---------------------------------------------------------
   1️⃣  QUESTIONS FROM CHEMISTRY COURSE
   --------------------------------------------------------- */
const QUESTIONS = [
  {
    id: 1,
    question: "What is the primary purpose of lab safety goggles?",
    answers: [
      "To look cool",
      "To protect the eyes from chemicals, heat or flying debris",
      "To keep hair in place"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Which of the following is NOT a typical laboratory material?",
    answers: ["Beaker", "Bunsen burner", "Smartphone", "Test tube"],
    correct: 2
  },
  {
    id: 3,
    question: "General Chemistry at Westmont High School lasts how many semesters?",
    answers: ["One", "Two", "Three", "Four"],
    correct: 1
  },
  {
    id: 4,
    question: "Which safety rule is correct?",
    answers: [
      "Never eat or drink in the lab",
      "You may wear loose clothing",
      "Open flames are allowed next to flammable liquids"
    ],
    correct: 0
  },
  {
    id: 5,
    question: "What does the periodic table display?",
    answers: [
      "A list of chemical reactions",
      "All known elements organized by atomic structure and properties",
      "A schedule of chemistry classes"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "What is matter?",
    answers: [
      "Energy only",
      "Anything that has mass and takes up space",
      "Something you should ignore in chemistry"
    ],
    correct: 1
  },
  {
    id: 7,
    question: "How many states of matter are there (basic)?",
    answers: [
      "One",
      "Two",
      "Three: Solid, Liquid, and Gas",
      "Five"
    ],
    correct: 2
  },
  {
    id: 8,
    question: "What is the definition of an atom?",
    answers: [
      "The largest unit of matter",
      "The smallest unit of an element that retains its properties",
      "A type of energy wave"
    ],
    correct: 1
  }
];

/* ---------------------------------------------------------
   2️⃣  GLOBALS
   --------------------------------------------------------- */
let player, cursors, platforms, quizZones;
let canMove = true;
let currentQuiz = null;
let score = 0;
let questionsAnswered = 0;
let answeredQuestions = new Set();
let scoreText;

/* ---------------------------------------------------------
   3️⃣  PRELOAD
   --------------------------------------------------------- */
function preload() {
  // No external assets needed - using graphics
}

/* ---------------------------------------------------------
   4️⃣  CREATE
   --------------------------------------------------------- */
function create() {
  // Show start screen if game hasn't started
  if (!gameStarted) {
    showStartScreen.call(this);
    return;
  }

  initializeGame.call(this);
}

/* ---------------------------------------------------------
   START SCREEN
   --------------------------------------------------------- */
function showStartScreen() {
  // Create semi-transparent overlay
  const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.95).setDepth(200);

  // Title panel background
  const panel = this.add.rectangle(400, 300, 650, 450, 0x2c3e50).setDepth(201);
  panel.setStrokeStyle(4, 0xffff00);

  // Title
  this.add.text(400, 120, 'Chemistry Quiz', {
    fontSize: '48px',
    fill: '#ffff00',
    fontStyle: 'bold',
    align: 'center'
  }).setOrigin(0.5).setDepth(202);

  this.add.text(400, 180, 'Platformer Edition', {
    fontSize: '28px',
    fill: '#aaa',
    align: 'center'
  }).setOrigin(0.5).setDepth(202);

  // Instructions
  this.add.text(400, 260, 'Jump across platforms and answer chemistry questions!', {
    fontSize: '14px',
    fill: '#fff',
    align: 'center',
    wordWrap: { width: 600 }
  }).setOrigin(0.5).setDepth(202);

  this.add.text(400, 300, '→ Arrow Keys: Move | Space: Jump | Reach ? to answer', {
    fontSize: '12px',
    fill: '#aaa',
    align: 'center',
    wordWrap: { width: 600 }
  }).setOrigin(0.5).setDepth(202);

  // Play Button
  const playButton = this.add.rectangle(400, 370, 200, 60, 0x27ae60).setDepth(202);
  playButton.setInteractive();
  playButton.setStrokeStyle(3, 0xffffff);

  this.add.text(400, 370, 'Play', {
    fontSize: '28px',
    fill: '#fff',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(203);

  playButton.on('pointerover', () => {
    playButton.setFillStyle(0x229954);
    playButton.setStrokeStyle(3, 0xffff00);
  });

  playButton.on('pointerout', () => {
    playButton.setFillStyle(0x27ae60);
    playButton.setStrokeStyle(3, 0xffffff);
  });

  playButton.on('pointerdown', () => {
    gameStarted = true;
    overlay.destroy();
    panel.destroy();
    initializeGame.call(this);
  });
}

/* ---------------------------------------------------------
   INITIALIZE GAME
   --------------------------------------------------------- */
function initializeGame() {
  // Reset game state for replays
  score = 0;
  questionsAnswered = 0;
  answeredQuestions.clear();
  currentQuiz = null;
  canMove = true;

  /* -------- Create Player (Green Square) -------- */
  player = this.add.rectangle(100, 400, 24, 32, 0x00ff00);
  this.physics.add.existing(player);
  player.body.setBounce(0.2);
  player.body.setCollideWorldBounds(true);

  /* -------- Create Platforms -------- */
  platforms = this.physics.add.staticGroup();

  // Ground (brown)
  const ground = this.add.rectangle(400, 580, 800, 40, 0x654321);
  this.physics.add.existing(ground, true);
  platforms.add(ground);

  // Platform 1 (left side, lower)
  const plat1 = this.add.rectangle(150, 480, 140, 20, 0x4a90e2);
  this.physics.add.existing(plat1, true);
  platforms.add(plat1);

  // Platform 2 (center-left, middle)
  const plat2 = this.add.rectangle(300, 380, 140, 20, 0x4a90e2);
  this.physics.add.existing(plat2, true);
  platforms.add(plat2);

  // Platform 3 (center, high)
  const plat3 = this.add.rectangle(450, 280, 140, 20, 0x4a90e2);
  this.physics.add.existing(plat3, true);
  platforms.add(plat3);

  // Platform 4 (right-center, middle)
  const plat4 = this.add.rectangle(600, 380, 140, 20, 0x4a90e2);
  this.physics.add.existing(plat4, true);
  platforms.add(plat4);

  // Platform 5 (right side, lower)
  const plat5 = this.add.rectangle(700, 480, 140, 20, 0x4a90e2);
  this.physics.add.existing(plat5, true);
  platforms.add(plat5);

  // Platform 6 (center-right, highest)
  const plat6 = this.add.rectangle(550, 150, 140, 20, 0x4a90e2);
  this.physics.add.existing(plat6, true);
  platforms.add(plat6);

  /* -------- Collision -------- */
  this.physics.add.collider(player, platforms);

  /* -------- Quiz Zones (invisible, interactive) -------- */
  quizZones = this.physics.add.group();

  const quizZoneData = [
    { x: 150, y: 460, qIndex: 0 },
    { x: 300, y: 360, qIndex: 1 },
    { x: 450, y: 260, qIndex: 2 },
    { x: 600, y: 360, qIndex: 3 },
    { x: 700, y: 460, qIndex: 4 },
    { x: 550, y: 130, qIndex: 5 }
  ];

  quizZoneData.forEach((data, idx) => {
    const zone = this.add.zone(data.x, data.y, 60, 50);
    this.physics.world.enable(zone);
    zone.body.setAllowGravity(false);
    zone.quizId = data.qIndex;
    zone.zoneIndex = idx;
    quizZones.add(zone);

    // Visual indicator - question mark circle
    const circle = this.add.circle(data.x, data.y - 25, 15, 0xffff00);
    const text = this.add.text(data.x, data.y - 25, '?', {
      fontSize: '20px',
      fill: '#000',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);
  });

  /* -------- Overlap Detection for Quiz Zones -------- */
  this.physics.add.overlap(player, quizZones, (p, zone) => {
    if (canMove && !answeredQuestions.has(zone.quizId)) {
      showQuiz.call(this, zone.quizId, zone);
    }
  });

  /* -------- Input Setup -------- */
  cursors = this.input.keyboard.createCursorKeys();

  /* -------- UI Text -------- */
  scoreText = this.add.text(10, 10, `Score: 0/${QUESTIONS.length}`, {
    fontSize: '18px',
    fill: '#fff',
    fontStyle: 'bold'
  }).setDepth(100);

  this.add.text(10, 40, 'Arrow Keys: Move | Space: Jump', {
    fontSize: '14px',
    fill: '#aaa'
  }).setDepth(100);

  this.add.text(10, 60, 'Reach the ? markers to answer questions!', {
    fontSize: '12px',
    fill: '#ffff00'
  }).setDepth(100);
}

/* ---------------------------------------------------------
   5️⃣  SHOW QUIZ MODAL (FIXED)
   --------------------------------------------------------- */
function showQuiz(questionIndex, zone) {
  console.log('showQuiz called', { questionIndex, zoneQuizId: zone ? zone.quizId : undefined });
  if (questionIndex >= QUESTIONS.length || currentQuiz !== null) return;

  const question = QUESTIONS[questionIndex];
  if (!question || !Array.isArray(question.answers)) {
    console.warn('Invalid question data for index:', questionIndex, question);
    // fallback simple modal
    canMove = false;
    currentQuiz = questionIndex;
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85).setDepth(200);
    const panel = this.add.rectangle(400, 300, 500, 160, 0x2c3e50).setDepth(201).setStrokeStyle(4, 0xffff00);
    const msg = this.add.text(400, 300, 'Question data missing', { fontSize: '18px', fill: '#fff' }).setOrigin(0.5).setDepth(202);
    const ok = this.add.rectangle(400, 360, 120, 36, 0x3498db).setDepth(203).setInteractive();
    const okText = this.add.text(400, 360, 'OK', { fontSize: '14px', fill: '#fff' }).setOrigin(0.5).setDepth(204);
    ok.on('pointerdown', () => {
      overlay.destroy(); panel.destroy(); msg.destroy(); ok.destroy(); okText.destroy();
      canMove = true; currentQuiz = null;
    });
    return;
  }

  canMove = false;
  currentQuiz = questionIndex;

  // Keep references to everything we create so we can clean up reliably
  const elements = [];
  const buttonRefs = [];

  // Overlay and panel
  const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.85).setDepth(200);
  const panel = this.add.rectangle(400, 300, 650, 400, 0x2c3e50).setDepth(201);
  panel.setStrokeStyle(4, 0xffff00);
  elements.push(overlay, panel);

  // Header
  const header = this.add.text(400, 120, 'Quiz Time!', {
    fontSize: '36px',
    fill: '#ffff00',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(202);
  elements.push(header);

  // Question number & text
  const qnum = this.add.text(400, 150, `Question ${questionIndex + 1}/${QUESTIONS.length}`, {
    fontSize: '16px',
    fill: '#ffff00',
    align: 'center'
  }).setOrigin(0.5).setDepth(202);
  const questionText = this.add.text(400, 180, question.question, {
    fontSize: '18px',
    fill: '#fff',
    align: 'center',
    wordWrap: { width: 600 }
  }).setOrigin(0.5).setDepth(202);
  elements.push(qnum, questionText);

  // Answer buttons
  const buttonWidth = 580;
  const buttonHeight = 45;
  const startY = 260;
  const buttonSpacing = 60;

  question.answers.forEach((answer, index) => {
    const buttonY = startY + index * buttonSpacing;
    const button = this.add.rectangle(400, buttonY, buttonWidth, buttonHeight, 0x3498db).setDepth(202).setInteractive();
    button.setStrokeStyle(2, 0xffffff);
    const answerText = this.add.text(400, buttonY, `${String.fromCharCode(65 + index)}) ${answer}`, {
      fontSize: '15px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: 530 }
    }).setOrigin(0.5).setDepth(203);

    button.on('pointerover', () => { button.setFillStyle(0x2980b9); button.setStrokeStyle(3, 0xffff00); });
    button.on('pointerout',  () => { button.setFillStyle(0x3498db); button.setStrokeStyle(2, 0xffffff); });

    button.on('pointerdown', () => {
      handleAnswer.call(this, index, question.correct, elements, button, buttonSpacing, startY, question.answers.length, buttonRefs);
    });

    buttonRefs.push(button, answerText);
    elements.push(button, answerText);
  });

  // Cancel button (also push to refs & elements)
  const cancelY = startY + question.answers.length * buttonSpacing + 20;
  const cancelBtn = this.add.rectangle(400, cancelY, 160, 36, 0x7f8c8d).setDepth(204).setInteractive();
  cancelBtn.setStrokeStyle(2, 0xffffff);
  const cancelText = this.add.text(400, cancelY, 'Cancel', { fontSize: '14px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(205);

  cancelBtn.on('pointerover', () => { cancelBtn.setFillStyle(0x95a5a6); cancelBtn.setStrokeStyle(2, 0xffff00); });
  cancelBtn.on('pointerout',  () => { cancelBtn.setFillStyle(0x7f8c8d); cancelBtn.setStrokeStyle(2, 0xffffff); });

  cancelBtn.on('pointerdown', () => {
    // destroy everything we created
    elements.forEach(e => { if (e && e.destroy) e.destroy(); });
    buttonRefs.forEach(b => { if (b && b.destroy) b.destroy(); });
    canMove = true;
    currentQuiz = null;
  });

  elements.push(cancelBtn, cancelText);
}

/* ---------------------------------------------------------
   6️⃣  HANDLE QUIZ ANSWER (FIXED)
   --------------------------------------------------------- */
function handleAnswer(selectedIndex, correctIndex, elements, button, buttonSpacing, startY, answerCount, buttonRefs) {
  const isCorrect = selectedIndex === correctIndex;

  if (isCorrect) {
    score++;
    scoreText.setText(`Score: ${score}/${QUESTIONS.length}`);
    button.setFillStyle(0x27ae60); // Green for correct
    const resultText = this.add.text(button.x, button.y, '✓ Correct!', {
      fontSize: '16px',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(203);
    elements.push(resultText);
  } else {
    button.setFillStyle(0xe74c3c); // Red for incorrect
    const wrongText = this.add.text(button.x, button.y, '✗ Wrong!', {
      fontSize: '16px',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(203);
    elements.push(wrongText);

    // Show correct answer
    const correctButtonY = startY + correctIndex * buttonSpacing;
    const correctButton = this.add.rectangle(400, correctButtonY, 580, 45, 0x27ae60).setDepth(202);
    correctButton.setStrokeStyle(2, 0xffffff);
    const correctText = this.add.text(400, correctButtonY, `${String.fromCharCode(65 + correctIndex)}) Correct Answer`, {
      fontSize: '15px',
      fill: '#fff',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(203);
    elements.push(correctButton, correctText);
  }

  questionsAnswered++;
  answeredQuestions.add(currentQuiz);

  // Close quiz after 2 seconds
  this.time.delayedCall(2000, () => {
    // destroy all elements created for modal
    elements.forEach(e => { if (e && e.destroy) e.destroy(); });
    // destroy button refs (answers + cancel) too
    buttonRefs.forEach(b => { if (b && b.destroy) b.destroy(); });

    canMove = true;
    currentQuiz = null;

    if (questionsAnswered >= QUESTIONS.length) {
      showGameEnd.call(this);
    }
  });
}

/* ---------------------------------------------------------
   7️⃣  GAME END SCREEN
   --------------------------------------------------------- */
function showGameEnd() {
  canMove = false;
  
  const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.95).setDepth(200);
  const endPanel = this.add.rectangle(400, 300, 600, 420, 0x2c3e50).setDepth(201);
  endPanel.setStrokeStyle(4, 0xffff00);

  this.add.text(400, 150, 'Quiz Complete!', {
    fontSize: '40px',
    fill: '#ffff00',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(202);

  this.add.text(400, 230, `Final Score: ${score}/${QUESTIONS.length}`, {
    fontSize: '32px',
    fill: '#fff',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(202);

  const percentage = Math.round((score / QUESTIONS.length) * 100);
  let gradeColor = '#27ae60';
  let gradeText = 'Excellent!';
  
  if (percentage < 70) {
    gradeColor = '#e74c3c';
    gradeText = 'Keep Practicing!';
  } else if (percentage < 85) {
    gradeColor = '#f39c12';
    gradeText = 'Good Job!';
  }

  this.add.text(400, 290, `${percentage}% - ${gradeText}`, {
    fontSize: '24px',
    fill: gradeColor,
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(202);

  const restartButton = this.add.rectangle(400, 370, 200, 50, 0x3498db).setDepth(202);
  restartButton.setInteractive();
  restartButton.setStrokeStyle(3, 0xffffff);

  this.add.text(400, 370, 'Play Again', {
    fontSize: '20px',
    fill: '#fff',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(203);

  restartButton.on('pointerover', () => {
    restartButton.setFillStyle(0x2980b9);
    restartButton.setStrokeStyle(3, 0xffff00);
  });

  restartButton.on('pointerout', () => {
    restartButton.setFillStyle(0x3498db);
    restartButton.setStrokeStyle(3, 0xffffff);
  });

  restartButton.on('pointerdown', () => {
    gameStarted = false;
    this.scene.restart();
  });
}

/* ---------------------------------------------------------
   8️⃣  UPDATE (Input Handling)
   --------------------------------------------------------- */
function update() {
  if (!canMove || !player) {
    if (player) player.setVelocityX(0);
    return;
  }

  // Horizontal movement
  if (cursors.left.isDown) {
    player.setVelocityX(-220);
  } else if (cursors.right.isDown) {
    player.setVelocityX(220);
  } else {
    player.setVelocityX(0);
  }

  // Jump (only when touching ground)
  if (cursors.space.isDown && player.body.touching.down) {
    player.setVelocityY(-350);
  }
}
