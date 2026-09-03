const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
const confCanvas = document.getElementById('confetti-canvas');
const confCtx = confCanvas.getContext('2d');

let stars = [], particles = [];

// Mini Game Trivia Pool Bank
const quizData = [
  { q: "What is your teacher's primary superpower?", a: ["Infinite patience during tough doubts", "Grading papers at lightspeed", "Detecting hidden phones instantly", "All of the above! 🌟"], correct: 3 },
  { q: "What is the ultimate fuel code for an educator?", a: ["Pure textbook data", "A hot cup of strong coffee ☕", "Perfect quiet classrooms", "School bell rings"], correct: 1 }
];
let currentQuizIdx = 0;

// Fortune Wisdom Bank
const wisdomPhrases = [
  "☕ Fuel Level Checked: 99% Coffee, 1% Patience. Universal Impact: 100%!",
  "✨ Your lessons don't just stay on glass boards; they stay carved into our futures forever.",
  "🍎 Real superheroes don't wear capes, they spend long nights grading files and shaping minds.",
  "🚀 To the world you might be a teacher, but to our entire classroom, you are a rockstar!"
];

function resize() {
  bgCanvas.width = confCanvas.width = window.innerWidth;
  bgCanvas.height = confCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

/* Pop-up Modals Navigation Control */
function openModal(modalId, event) {
  event.stopPropagation(); // Stops rocket launch from clicking menu buttons
  document.getElementById(modalId).classList.add('open');
  if(modalId === 'trivia-modal') loadTriviaQuestion();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

/* Trivia Logic System */
function loadTriviaQuestion() {
  currentQuizIdx = Math.floor(Math.random() * quizData.length);
  const data = quizData[currentQuizIdx];
  document.getElementById('quiz-question').innerText = data.q;
  document.getElementById('quiz-feedback').innerText = "";
  
  const container = document.getElementById('quiz-options');
  container.innerHTML = "";
  data.a.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = "option-btn";
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(idx);
    container.appendChild(btn);
  });
}

function checkAnswer(selectedIdx) {
  const data = quizData[currentQuizIdx];
  const feedback = document.getElementById('quiz-feedback');
  if(selectedIdx === data.correct) {
    feedback.innerText = "🎉 Absolutely Correct! You know them perfectly!";
    feedback.style.color = "#4ade80";
    triggerExplosion(window.innerWidth/2, window.innerHeight/2);
  } else {
    feedback.innerText = "❌ So close! Try another option!";
    feedback.style.color = "#f87171";
  }
}

/* Wisdom Card Trigger Box */
function generateWisdomCard() {
  const phrase = wisdomPhrases[Math.floor(Math.random() * wisdomPhrases.length)];
  document.getElementById('wisdom-display').innerText = phrase;
  triggerExplosion(window.innerWidth/2, window.innerHeight/2);
}

/* Background Canvas Star Particle Classes */
class Star {
  constructor() { this.x = Math.random()*bgCanvas.width; this.y = Math.random()*bgCanvas.height; this.size = Math.random()*1.2; this.speed = Math.random()*0.05 + 0.02; }
  update() { this.y -= this.speed; if (this.y < 0) this.y = bgCanvas.height; }
  draw() { bgCtx.fillStyle = 'rgba(255, 255, 255, 0.5)'; bgCtx.fillRect(this.x, this.y, this.size, this.size); }
}
for(let i=0; i<80; i++) stars.push(new Star());

/* Rocket Sparkles Confetti Particle System */
class RocketSpark {
  constructor(x, y) {
    this.x = x; this.y = y; this.size = Math.random() * 5 + 3;
    this.color = `hsl(${Math.random() * 360}, 95%, 65%)`;
    const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 8 + 4;
    this.speedX = Math.cos(angle) * speed; this.speedY = Math.sin(angle) * speed;
    this.gravity = 0.15; this.alpha = 1;
  }
  update() { this.speedY += this.gravity; this.x += this.speedX; this.y += this.speedY; this.alpha -= 0.015; }
  draw() {
    confCtx.save(); confCtx.globalAlpha = this.alpha; confCtx.fillStyle = this.color;
    confCtx.shadowBlur = 10; confCtx.shadowColor = this.color;
    confCtx.beginPath(); confCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); confCtx.fill(); confCtx.restore();
  }
}

function handleBackgroundClick(e) {
  const x = e.clientX || (e.touches && e.touches.clientX) || window.innerWidth/2;
  const y = e.clientY || (e.touches && e.touches.clientY) || window.innerHeight/3;
  triggerExplosion(x, y);
}

function triggerExplosion(x, y) {
  for (let i = 0; i < 40; i++) { particles.push(new RocketSpark(x, y)); }
}

window.addEventListener('click', handleBackgroundClick);
window.addEventListener('touchstart', handleBackgroundClick);

function engineLoop() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  stars.forEach(s => { s.update(); s.draw(); });
  particles.forEach((p, i) => {
    p.update(); p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(engineLoop);
}
engineLoop();
