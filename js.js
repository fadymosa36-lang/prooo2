// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 2000);
});

// ── CURSOR ──
const dot = document.getElementById('dot'), ring = document.getElementById('ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
});
(function loop() {
  rx += (mx - rx) * .09; ry += (my - ry) * .09;
  ring.style.transform = `translate(${rx - 16}px,${ry - 16}px)`;
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// ── REVEAL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('in'), i * 80);
  });
}, { threshold: .06 });
document.querySelectorAll('[data-reveal],[data-reveal-left],[data-reveal-right],.reveal').forEach(el => obs.observe(el));

const skObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: .2 });
document.querySelectorAll('.sk-card').forEach(el => skObs.observe(el));

// ── NAV ACTIVE ──
const secs = document.querySelectorAll('section[id]'), nas = document.querySelectorAll('.n-links a');
window.addEventListener('scroll', () => {
  let id = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 160) id = s.id; });
  nas.forEach(a => { a.style.color = a.getAttribute('href') === '#' + id ? 'var(--gold3)' : ''; });
});

// ── EYEBROW TYPING ──
const words = ['Front-end Developer', 'Problem Solver', 'SQL Developer', 'Open Source Builder'];
let wi = 0, ci = 0, del = false;
const el = document.getElementById('eyebrow-text');
function type() {
  const w = words[wi];
  if (!del) {
    el.textContent = w.slice(0, ++ci);
    if (ci === w.length) { del = true; setTimeout(type, 2400); return; }
  } else {
    el.textContent = w.slice(0, --ci);
    if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(type, del ? 38 : 72);
}
setTimeout(type, 2200);

// ── CANVAS BG ──
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  const GOLD = 'rgba(201,168,76,';
  let W, H, particles, lines, floatingOrbs;
  let mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    mouse.x = W / 2; mouse.y = H / 2;
    init();
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(rand) {
      this.x = Math.random() * W; this.y = rand ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.1 + 0.25;
      this.vx = (Math.random() - 0.5) * 0.2; this.vy = -(Math.random() * 0.35 + 0.08);
      this.alpha = Math.random() * 0.45 + 0.08;
      this.life = Math.random() * 320 + 200; this.age = rand ? Math.random() * this.life : 0;
    }
    update() {
      const dx = mouse.x - this.x, dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 220) { this.vx += dx / dist * 0.005; this.vy += dy / dist * 0.005; }
      this.vx *= 0.99; this.vy *= 0.99;
      this.x += this.vx; this.y += this.vy; this.age++;
      if (this.age > this.life || this.y < -10) this.reset(false);
    }
    draw() {
      const fade = this.age < 60 ? this.age / 60 : this.age > this.life - 60 ? (this.life - this.age) / 60 : 1;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = GOLD + (this.alpha * fade) + ')'; ctx.fill();
    }
  }

  class FlowLine {
    constructor() { this.reset(true); }
    reset(rand) {
      this.x = rand ? Math.random() * W : (Math.random() > .5 ? -50 : W + 50);
      this.y = rand ? Math.random() * H : Math.random() * H;
      this.len = Math.random() * 120 + 50;
      this.angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(this.angle) * (Math.random() * 0.35 + 0.08);
      this.vy = Math.sin(this.angle) * (Math.random() * 0.25 + 0.04);
      this.alpha = Math.random() * 0.07 + 0.02;
      this.life = Math.random() * 380 + 260; this.age = rand ? Math.random() * this.life : 0;
      this.curve = (Math.random() - 0.5) * 0.018;
    }
    update() {
      this.angle += this.curve;
      this.vx = Math.cos(this.angle) * 0.35; this.vy = Math.sin(this.angle) * 0.22;
      this.x += this.vx; this.y += this.vy; this.age++;
      if (this.age > this.life || this.x < -200 || this.x > W + 200 || this.y < -200 || this.y > H + 200) this.reset(false);
    }
    draw() {
      const fade = this.age < 80 ? this.age / 80 : this.age > this.life - 80 ? (this.life - this.age) / 80 : 1;
      const ex = this.x + Math.cos(this.angle) * this.len, ey = this.y + Math.sin(this.angle) * this.len;
      const grad = ctx.createLinearGradient(this.x, this.y, ex, ey);
      grad.addColorStop(0, GOLD + '0)'); grad.addColorStop(0.35, GOLD + (this.alpha * fade) + ')');
      grad.addColorStop(0.65, GOLD + (this.alpha * fade * 0.5) + ')'); grad.addColorStop(1, GOLD + '0)');
      ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(ex, ey);
      ctx.strokeStyle = grad; ctx.lineWidth = Math.random() * 0.4 + 0.25; ctx.stroke();
    }
  }

  class FloatOrb {
    constructor() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = Math.random() * 160 + 70;
      this.vx = (Math.random() - .5) * 0.25; this.vy = (Math.random() - .5) * 0.18;
      this.alpha = Math.random() * 0.055 + 0.015;
      this.pulse = Math.random() * Math.PI * 2; this.pulseSpeed = Math.random() * 0.007 + 0.003;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.pulse += this.pulseSpeed;
      if (this.x < -this.r) this.x = W + this.r; if (this.x > W + this.r) this.x = -this.r;
      if (this.y < -this.r) this.y = H + this.r; if (this.y > H + this.r) this.y = -this.r;
    }
    draw() {
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grad.addColorStop(0, GOLD + a + ')'); grad.addColorStop(0.4, GOLD + (a * 0.45) + ')'); grad.addColorStop(1, GOLD + '0)');
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
    }
  }

  let gridPulses = [], pulseTimer = 0;

  class GridPulse {
    constructor() { this.reset(); }
    reset() {
      const gs = 64;
      this.gx = Math.floor(Math.random() * Math.ceil(W / gs)) * gs;
      this.gy = Math.floor(Math.random() * Math.ceil(H / gs)) * gs;
      this.r = 0; this.maxR = Math.random() * 100 + 50;
      this.speed = Math.random() * 1.2 + 0.4;
      this.alpha = Math.random() * 0.1 + 0.03; this.done = false;
    }
    update() { this.r += this.speed; if (this.r > this.maxR) this.done = true; }
    draw() {
      const fade = 1 - (this.r / this.maxR);
      ctx.beginPath(); ctx.arc(this.gx, this.gy, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = GOLD + (this.alpha * fade) + ')'; ctx.lineWidth = .8; ctx.stroke();
    }
  }

  function init() {
    particles = Array.from({ length: 110 }, () => new Particle());
    lines = Array.from({ length: 30 }, () => new FlowLine());
    floatingOrbs = Array.from({ length: 5 }, () => new FloatOrb());
    gridPulses = [];
  }

  function drawGrid() {
    const gs = 64;
    ctx.strokeStyle = GOLD + '0.028)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 85) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = GOLD + (0.055 * (1 - d / 85)) + ')'; ctx.lineWidth = 0.35; ctx.stroke();
        }
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);
    const vig = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * .7);
    vig.addColorStop(0, 'rgba(7,7,15,0)'); vig.addColorStop(1, 'rgba(7,7,15,0.5)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
    drawGrid();
    floatingOrbs.forEach(o => { o.update(); o.draw(); });
    lines.forEach(l => { l.update(); l.draw(); });
    connectParticles();
    particles.forEach(p => { p.update(); p.draw(); });
    pulseTimer++;
    if (pulseTimer % 60 === 0) gridPulses.push(new GridPulse());
    gridPulses = gridPulses.filter(gp => !gp.done);
    gridPulses.forEach(gp => { gp.update(); gp.draw(); });
  }

  window.addEventListener('resize', resize);
  resize(); animate();
})();
