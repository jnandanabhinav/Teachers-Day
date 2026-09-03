const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
const confCanvas = document.getElementById('confetti-canvas');
const confCtx = confCanvas.getContext('2d');

let stars = [];
let particles = [];
const quoteText = "To the world you may be just a teacher, but to your students you are a hero. Thank you for guiding us! ✨";
let quoteIndex = 0;

function resize() {
  bgCanvas.width = confCanvas.width = window.innerWidth;
  bgCanvas.height = confCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Ambient Space Stars Generator
class Star {
  constructor() {
    this.x = Math.random() * bgCanvas.width;
    this.y = Math.random() * bgCanvas.height;
    this.size = Math.random() * 1.5;
    this.speed = Math.random() * 0.05 + 0.02;
  }
  update() {
    this.y -= this.speed;
    if (this.y < 0) this.y = bgCanvas.height;
  }
  draw() {
    bgCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    bgCtx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// Sparkle Explosion Particles
class RocketParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 3;
    this.color = `hsl(${Math.random() * 360}, 95%, 65%)`;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4;
    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed;
    this.gravity = 0.15;
    this.alpha = 1;
  }
  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.015;
  }
  draw() {
    confCtx.save();
    confCtx.globalAlpha = this.alpha;
    confCtx.fillStyle = this.color;
    confCtx.shadowBlur = 10;
    confCtx.shadowColor = this.color;
    confCtx.beginPath();
    confCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    confCtx.fill();
    confCtx.restore();
  }
}

// Initialize Background Stars
for(let i=0; i<80; i++) stars.push(new Star());

// Automatic Typing effect
function typeWriter() {
  if (quoteIndex < quoteText.length) {
    document.getElementById("typing-quote").innerHTML += quoteText.charAt(quoteIndex);
    quoteIndex++;
    setTimeout(typeWriter, 55);
  }
}

function launchFireworks(e) {
  const x = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth/2;
  const y = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight/3;
  for (let i = 0; i < 45; i++) {
    particles.push(new RocketParticle(x, y));
  }
}

// Unified Canvas Loop
function engine() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);

  stars.forEach(s => { s.update(); s.draw(); });
  particles.forEach((p, i) => {
    p.update(); p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(engine);
}

// Event Triggers
window.addEventListener('click', launchFireworks);
window.addEventListener('touchstart', launchFireworks);

// Start
engine();
setTimeout(typeWriter, 1200); // Wait for card transition to finish before typing
