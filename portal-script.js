const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
const confCanvas = document.getElementById('confetti-canvas');
const confCtx = confCanvas.getContext('2d');
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');

let stars = [], particles = [];

// Wisdom lists generator bank
const quotes = [
  "☕ Fuel Level: 99% Coffee, 1% Patience. Universal Impact Level: 100%!",
  "✨ Your lessons don't just stay on blackboards; they stay carved into our futures forever.",
  "🍎 Real superheroes don't wear capes, they spend late nights grading papers and shaping minds.",
  "🌟 Warning: The wisdom shared in your classroom is known to cause massive student success!",
  "🚀 To the world you might be a teacher, but to our entire classroom, you are a rockstar."
];

// Memory lane sample layout placeholder imagery
const images = [
  "https://unsplash.com",
  "https://unsplash.com",
  "https://unsplash.com"
];
let currentImgIndex = 0;

function resize() {
  bgCanvas.width = confCanvas.width = window.innerWidth;
  bgCanvas.height = confCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Views Router System Switcher
function switchView(viewId) {
  document.querySelectorAll('.portal-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  triggerConfetti();
}

// Wisdom Trigger Action
function generateWisdom() {
  const rand = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('wisdom-text').innerText = rand;
  triggerConfetti();
}

// Simple Sliding Carousel Controls
function nextImage() {
  currentImgIndex = (currentImgIndex + 1) % images.length;
  document.getElementById('slider-img').src = images[currentImgIndex];
}
function prevImage() {
  currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
  document.getElementById('slider-img').src = images[currentImgIndex];
}

// Background music toggles handling audio blocks safely
function toggleMusic() {
  if (music.paused) {
    music.play().then(() => {
      musicBtn.innerText = "🎵 Music: Playing";
    }).catch(err => console.log("Audio unlock interaction pending..."));
  } else {
    music.pause();
    musicBtn.innerText = "🎵 Music: Off";
  }
}
musicBtn.addEventListener('click', toggleMusic);
window.addEventListener('click', () => { if(music.paused) { /* Soft pre-load trigger optionally skipped */ } }, {once: true});

// Ambient Particles Core Systems Engine
class Star {
  constructor() { this.x = Math.random()*bgCanvas.width; this.y = Math.random()*bgCanvas.height; this.size = Math.random()*1.2; this.speed = Math.random()*0.04; }
  update() { this.y -= this.speed; if (this.y < 0) this.y = bgCanvas.height; }
  draw() { bgCtx.fillStyle = 'rgba(255,255,255,0.4)'; bgCtx.fillRect(this.x, this.y, this.size, this.size); }
}
for(let i=0; i<60; i++) stars.push(new Star());

class Confetti {
  constructor() {
    this.x = window.innerWidth / 2; this.y = window.innerHeight / 2;
    this.size = Math.random() * 6 + 4; this.color = `hsl(${Math.random()*360}, 90%, 60%)`;
    const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 7 + 3;
    this.speedX = Math.cos(angle) * speed; this.speedY = Math.sin(angle) * speed;
    this.gravity = 0.2; this.alpha = 1;
  }
  update() { this.speedY += this.gravity; this.x += this.speedX; this.y += this.speedY; this.alpha -= 0.02; }
  draw() {
    confCtx.save(); confCtx.globalAlpha = this.alpha; confCtx.fillStyle = this.color;
    confCtx.beginPath(); confCtx.arc(this.x, this.y, this.size, 0, Math.PI*2); confCtx.fill(); confCtx.restore();
  }
}

function triggerConfetti() { for(let i=0; i<25; i++) particles.push(new Confetti()); }

function loop() {
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  confCtx.clearRect(0,0,confCanvas.width,confCanvas.height);
  stars.forEach(s => { s.update(); s.draw(); });
  particles.forEach((p,i) => { p.update(); p.draw(); if(p.alpha<=0) particles.splice(i,1); });
  requestAnimationFrame(loop);
}
loop();
