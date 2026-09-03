const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
const card = document.getElementById('main-card');

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 4;
    this.color = `hsl(${Math.random() * 360}, 90%, 65%)`;
    this.speedX = (Math.random() - 0.5) * 12;
    this.speedY = (Math.random() - 0.7) * 12;
    this.gravity = 0.25;
    this.alpha = 1;
  }
  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.015;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function spawnBurst(e) {
  const x = e.clientX || e.touches.clientX;
  const y = e.clientY || e.touches.clientY;
  for (let i = 0; i < 40; i++) {
    particles.push(new Particle(x, y));
  }
}

window.addEventListener('click', spawnBurst);
window.addEventListener('touchstart', spawnBurst);

setTimeout(() => {
  for(let i=0; i<30; i++) particles.push(new Particle(canvas.width/2, canvas.height/3));
}, 500);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) {
      particles.splice(index, 1);
    }
  });
  requestAnimationFrame(animate);
}

animate();
