import { ProjectTemplate } from '../types/project';

export const STARTER_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'cyber-matrix',
    title: 'Cyber Matrix Rain Animation',
    description: 'Interactive HTML5 Canvas Matrix digital rain with mouse speed effect.',
    icon: 'Terminal',
    badge: 'Canvas + JS',
    files: [
      {
        id: '1',
        name: 'index.html',
        path: 'index.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Matrix Rain</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="overlay">
    <h1>SPCK MATRIX ENGINE</h1>
    <p>Tap anywhere to trigger pulse wave</p>
  </div>
  <canvas id="matrixCanvas"></canvas>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: '2',
        name: 'style.css',
        path: 'style.css',
        type: 'file',
        language: 'css',
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #000;
  overflow: hidden;
  font-family: 'Courier New', monospace;
}

canvas {
  display: block;
  width: 100vw;
  height: 100vh;
}

.overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #00FF66;
  z-index: 10;
  text-shadow: 0 0 10px #00FF66;
  pointer-events: none;
}

h1 {
  font-size: 1.4rem;
  letter-spacing: 2px;
}

p {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 4px;
}`,
      },
      {
        id: '3',
        name: 'script.js',
        path: 'script.js',
        type: 'file',
        language: 'javascript',
        content: `const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

console.log('⚡ Matrix Rain Initialized on Canvas:', canvas.width, 'x', canvas.height);

const letters = '0123456789ABCDEF@#$%&*+-/<>~SPCK_DEV';
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00FF66';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillStyle = (drops[i] % 5 === 0) ? '#FFFFFF' : '#00FF66';
    ctx.fillText(text, x, y);

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(draw, 33);

window.addEventListener('pointerdown', (e) => {
  console.log('Pulse wave triggered at:', e.clientX, e.clientY);
  for (let i = 0; i < drops.length; i++) {
    drops[i] = Math.floor(Math.random() * -10);
  }
});`,
      },
    ],
  },
  {
    id: 'neon-game',
    title: 'Neon Paddle & Ball Arcade',
    description: 'Playable touch-controlled retro arcade game with sound and particle effects.',
    icon: 'Gamepad2',
    badge: 'Game Engine',
    files: [
      {
        id: '1',
        name: 'index.html',
        path: 'index.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Neon Paddle Arcade</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="gameContainer">
    <div id="scoreBoard">
      <span>SCORE: <b id="score">0</b></span>
      <span>LIVES: <b id="lives">3</b></span>
    </div>
    <canvas id="gameCanvas"></canvas>
    <div id="controlsNotice">Drag paddle or touch left/right to move</div>
  </div>
  <script src="game.js"></script>
</body>
</html>`,
      },
      {
        id: '2',
        name: 'style.css',
        path: 'style.css',
        type: 'file',
        language: 'css',
        content: `body {
  margin: 0;
  background: #080B12;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#gameContainer {
  position: relative;
  width: 100%;
  max-width: 420px;
  height: 100%;
  max-height: 700px;
  background: #04060A;
  border: 1px solid #00F0FF44;
  box-shadow: 0 0 30px #00F0FF22;
  border-radius: 16px;
  overflow: hidden;
}

#scoreBoard {
  position: absolute;
  top: 15px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  font-family: monospace;
  font-size: 14px;
  color: #00F0FF;
  z-index: 10;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}

#controlsNotice {
  position: absolute;
  bottom: 12px;
  width: 100%;
  text-align: center;
  font-size: 11px;
  color: #64748B;
  pointer-events: none;
}`,
      },
      {
        id: '3',
        name: 'game.js',
        path: 'game.js',
        type: 'file',
        language: 'javascript',
        content: `const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

canvas.width = 400;
canvas.height = 650;

let score = 0;
let lives = 3;

const paddle = {
  width: 80,
  height: 12,
  x: (canvas.width - 80) / 2,
  y: canvas.height - 45,
  speed: 8,
  color: '#00F0FF'
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  dx: 3.5,
  dy: -3.5,
  color: '#FF0055'
};

console.log('🎮 Game engine started. High performance 60FPS loop ready.');

function handleTouch(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const relativeX = (clientX - rect.left) * (canvas.width / rect.width);
  paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, relativeX - paddle.width / 2));
}

window.addEventListener('mousemove', handleTouch);
window.addEventListener('touchmove', handleTouch, { passive: true });

function update() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // Paddle Collision
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width
  ) {
    ball.dy = -Math.abs(ball.dy) * 1.03;
    score += 10;
    scoreEl.innerText = score;
    console.log('Hit! Score:', score);
  }

  // Ball fell
  if (ball.y + ball.radius > canvas.height) {
    lives--;
    livesEl.innerText = lives;
    if (lives <= 0) {
      alert('Game Over! Final Score: ' + score);
      score = 0;
      lives = 3;
      scoreEl.innerText = score;
      livesEl.innerText = lives;
    }
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dy = -3.5;
  }
}

function render() {
  ctx.fillStyle = '#04060A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Paddle
  ctx.fillStyle = paddle.color;
  ctx.shadowColor = paddle.color;
  ctx.shadowBlur = 12;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Draw Ball
  ctx.fillStyle = ball.color;
  ctx.shadowColor = ball.color;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}
gameLoop();`,
      },
    ],
  },
  {
    id: 'tailwind-app',
    title: 'Modern Glassmorphic QuickTask App',
    description: 'Clean Todo, Notes & Expense Tracker built with Tailwind CSS and LocalStorage.',
    icon: 'CheckSquare',
    badge: 'Tailwind CDN',
    files: [
      {
        id: '1',
        name: 'index.html',
        path: 'index.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuickTask Pro</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 flex justify-center">
  <div class="w-full max-w-md space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between pt-2">
      <div>
        <h1 class="text-xl font-black tracking-tight text-cyan-400">⚡ QUICKTASK PRO</h1>
        <p class="text-xs text-slate-400">Built with Tailwind & LocalStorage</p>
      </div>
      <span id="counter" class="text-xs font-mono bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/30">0 Tasks</span>
    </div>

    <!-- Input Box -->
    <div class="flex gap-2">
      <input id="taskInput" type="text" placeholder="Add a new mission..." class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium">
      <button id="addBtn" class="bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs px-4 rounded-xl transition active:scale-95">Add</button>
    </div>

    <!-- Task List -->
    <div id="taskList" class="space-y-2">
      <!-- Generated items -->
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      },
      {
        id: '2',
        name: 'style.css',
        path: 'style.css',
        type: 'file',
        language: 'css',
        content: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.task-card {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-card:hover {
  transform: translateY(-2px);
}`,
      },
      {
        id: '3',
        name: 'app.js',
        path: 'app.js',
        type: 'file',
        language: 'javascript',
        content: `const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('taskList');
const counter = document.getElementById('counter');

let tasks = [
  { id: 1, text: 'Design mobile code editor in Next.js', done: true },
  { id: 2, text: 'Test interactive DevTools console', done: false },
  { id: 3, text: 'Deploy Spck Web App to Vercel', done: false }
];

function render() {
  list.innerHTML = '';
  tasks.forEach(t => {
    const item = document.createElement('div');
    item.className = 'task-card p-3 rounded-xl bg-slate-900/80 border ' + (t.done ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-400' : 'border-slate-800 text-slate-200') + ' flex items-center justify-between cursor-pointer';
    item.innerHTML = \`
      <div class="flex items-center space-x-3">
        <input type="checkbox" \${t.done ? 'checked' : ''} class="w-4 h-4 accent-cyan-400 rounded">
        <span class="text-xs font-medium \${t.done ? 'line-through text-slate-500' : ''}">\${t.text}</span>
      </div>
      <button class="delete-btn text-xs text-rose-400 hover:text-rose-300 font-bold px-1.5 py-0.5">&times;</button>
    \`;

    item.querySelector('input').addEventListener('change', () => {
      t.done = !t.done;
      render();
    });

    item.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      tasks = tasks.filter(x => x.id !== t.id);
      render();
    });

    list.appendChild(item);
  });

  const remaining = tasks.filter(t => !t.done).length;
  counter.innerText = remaining + ' Active';
  console.log('Tasks rendered. Active count:', remaining);
}

addBtn.addEventListener('click', () => {
  if (!input.value.trim()) return;
  tasks.push({ id: Date.now(), text: input.value.trim(), done: false });
  input.value = '';
  render();
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

render();
console.log('⚡ QuickTask App Loaded Successfully!');`,
      },
    ],
  },
];
