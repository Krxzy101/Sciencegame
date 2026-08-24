/* ---------------------------------------------------------
   QUIZ PLATFORMER – Phaser 3 (v3.55)
   --------------------------------------------------------- */

const CONFIG = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#111',
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },   // a little heavier for a nice “platformer” feel
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(CONFIG);

/* ---------------------------------------------------------
   1️⃣  QUESTIONS – edit/add as many as you want
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
      "Never eat or drink in the lab.",
      "You may wear loose clothing.",
      "Open flames are allowed next to flammable liquids."
    ],
    correct: 0
  },
  // … add more entries here, using the same shape.
];

/* ---------------------------------------------------------
   2️⃣  GLOBALS (filled in `create`)
   --------------------------------------------------------- */
let player, cursors, platforms, quizZones;
let canMove = true;          // disables input while a quiz is open

/* ---------------------------------------------------------
   3️⃣  PRELOAD – assets (all free / CC‑0)
   --------------------------------------------------------- */
function preload() {
  // Tileset (ground + platforms) – OpenGameArt: https://opengameart.org/content/platformer-tileset
  this.load.image('tiles', 'assets/tiles.png');

  // Player sprite – Phaser Labs (public domain)
  this.load.spritesheet('player', 'assets/player.png', {
    frameWidth: 32,
    frameHeight: 48
  });

  // Small “?” icon that marks a quiz zone
  this.load.image('question', 'assets/question.png');
}

/* ---------------------------------------------------------
   4️⃣  CREATE – build world, player, UI
   --------------------------------------------------------- */
function create() {
  /* ---------- 4.1  TILEMAP (simple, static) ---------- */
  const map = this.make.tilemap({ width: 25, height: 19, tileWidth: 32, tileHeight: 32 });
  const tileset = map.addTilesetImage('tiles');
  const layer = map.createBlankLayer('ground', tileset);

  // Fill whole layer with “ground” tile (index 1 of the tileset)
  layer.fill(1);

  // Carve out empty space for the player to walk on
  const empty = [
    // x, y, width, height (in tiles)
    [0, 0, 25, 12],           // big sky area
    [5, 12, 5, 1], [15, 12, 5, 1],   // two floating platforms
    [10, 15, 5, 1]                      // a middle platform
  ];
  empty.forEach(r => layer.removeTileAt(r[