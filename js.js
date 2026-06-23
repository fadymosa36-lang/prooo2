// ═══════════════════════════════════════════
//   FADY MOSA — PORTFOLIO JS v2
//   Premium Features · 2026
// ═══════════════════════════════════════════

// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('done');
    // Trigger hero reveal after load
    document.querySelectorAll('[data-reveal],[data-reveal-left],[data-reveal-right]').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 200 + i * 120);
    });
  }, 2000);
});

// ── THEME TOGGLE (Dark / Light) ──
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('fady-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle && themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('fady-theme', next);
});

// ── SCROLL PROGRESS BAR ──
const scrollFill = document.getElementById('scroll-fill');
function updateScrollProgress() {
  if (!scrollFill) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollFill.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ── NAV SCROLL STATE ──
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (!navEl) return;
  navEl.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── CURSOR ──
const dot = document.getElementById('dot');
const ring = document.getElementById('ring');
if (dot && ring) {
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
  document.querySelectorAll('a,button,.pj-dot,.drawer-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

// ── MOBILE HAMBURGER + DRAWER ──
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('mobile-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');

function openDrawer() {
  hamburger && hamburger.classList.add('open');
  drawer && drawer.classList.add('open');
  drawerOverlay && drawerOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  hamburger && hamburger.classList.remove('open');
  drawer && drawer.classList.remove('open');
  drawerOverlay && drawerOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
hamburger && hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeDrawer() : openDrawer();
});
drawerOverlay && drawerOverlay.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// ── REVEAL ANIMATIONS ──
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

// ── NAV ACTIVE SECTION HIGHLIGHTING ──
const secs = document.querySelectorAll('section[id]');
const nas = document.querySelectorAll('.n-links a');
window.addEventListener('scroll', () => {
  let id = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 180) id = s.id; });
  nas.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
  });
}, { passive: true });

// ── EYEBROW TYPING EFFECT ──
const words = ['Front-end Developer', 'Problem Solver', 'SQL Developer', 'Open Source Builder', 'UI/UX Enthusiast'];
let wi = 0, ci = 0, del = false;
const eyebrowEl = document.getElementById('eyebrow-text');
function type() {
  if (!eyebrowEl) return;
  const w = words[wi];
  if (!del) {
    eyebrowEl.textContent = w.slice(0, ++ci);
    if (ci === w.length) { del = true; setTimeout(type, 2400); return; }
  } else {
    eyebrowEl.textContent = w.slice(0, --ci);
    if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(type, del ? 38 : 72);
}
setTimeout(type, 2200);

// ── COUNTER ANIMATION (Hero Stats) ──
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  if (!target) return;
  let current = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 40);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: .5 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObs.observe(el));

// ── PROJECT IMAGE SLIDER (WorkerHub) ──
function initSliders() {
  document.querySelectorAll('.pj-img-slider').forEach(slider => {
    const slides = slider.querySelectorAll('.pj-slide');
    const dots = slider.querySelectorAll('.pj-dot');
    if (!slides.length) return;
    let current = 0;
    let timer;

    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
    }

    function startAuto() {
      timer = setInterval(() => goTo(current + 1), 3200);
    }
    function stopAuto() { clearInterval(timer) }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
    });

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    startAuto();
  });
}
initSliders();

// ── PROJECT FILTER ──
const filterBtns = document.querySelectorAll('.pj-filter');
const pjItems = document.querySelectorAll('.pj-item');
const pjPhPair = document.querySelector('.pj-ph-pair');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    // Placeholder pair: always visible
    if (pjPhPair) {
      pjPhPair.style.opacity = '1';
      pjPhPair.style.display = '';
    }

    pjItems.forEach((item, i) => {
      const cat = item.getAttribute('data-category') || '';
      const match = filter === 'all' || cat === filter;

      if (match) {
        item.classList.remove('filtered-out');
        item.style.opacity = '0';
        item.style.display = '';
        setTimeout(() => { item.style.opacity = '1'; }, i * 60);
      } else {
        item.style.opacity = '0';
        setTimeout(() => {
          item.classList.add('filtered-out');
        }, 300);
      }
    });
  });
});

// ── CONTACT FORM VALIDATION + SUBMISSION ──
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('formSubmitBtn');
const successMsg = document.getElementById('form-success');
const errorMsg = document.getElementById('form-error');

function validateField(input, errId, msg) {
  const errEl = document.getElementById(errId);
  if (!input.value.trim()) {
    input.classList.add('error');
    if (errEl) errEl.textContent = msg;
    return false;
  }
  if (input.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      input.classList.add('error');
      if (errEl) errEl.textContent = 'Please enter a valid email address.';
      return false;
    }
  }
  input.classList.remove('error');
  if (errEl) errEl.textContent = '';
  return true;
}

// Live validation on blur
['fname','femail','fsubject','fmessage'].forEach(id => {
  const msgs = { fname: 'Name is required.', femail: 'Email is required.', fsubject: 'Subject is required.', fmessage: 'Message is required.' };
  const errIds = { fname: 'err-name', femail: 'err-email', fsubject: 'err-subject', fmessage: 'err-message' };
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => validateField(el, errIds[id], msgs[id]));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        el.classList.remove('error');
        const errEl = document.getElementById(errIds[id]);
        if (errEl) errEl.textContent = '';
      }
    });
  }
});

if (form && submitBtn) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameOk = validateField(document.getElementById('fname'), 'err-name', 'Name is required.');
    const emailOk = validateField(document.getElementById('femail'), 'err-email', 'Email is required.');
    const subjectOk = validateField(document.getElementById('fsubject'), 'err-subject', 'Subject is required.');
    const msgOk = validateField(document.getElementById('fmessage'), 'err-message', 'Message is required.');

    if (!nameOk || !emailOk || !subjectOk || !msgOk) return;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.submit-text').style.display = 'none';
    submitBtn.querySelector('.submit-spinner').style.display = 'flex';
    submitBtn.querySelector('.submit-arrow').style.display = 'none';
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok || response.status === 200) {
        // Success
        if (successMsg) successMsg.style.display = 'flex';
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      if (errorMsg) errorMsg.style.display = 'flex';
    } finally {
      // Restore button
      submitBtn.disabled = false;
      submitBtn.querySelector('.submit-text').style.display = '';
      submitBtn.querySelector('.submit-spinner').style.display = 'none';
      submitBtn.querySelector('.submit-arrow').style.display = '';
    }
  });
}

// ── FLOATING BACK TO TOP + CIRCULAR PROGRESS ──
const fabTop = document.getElementById('fab-top');
const fabProg = fabTop && fabTop.querySelector('.fab-prog');
const CIRCUMFERENCE = 2 * Math.PI * 19; // r=19, C = 2πr ≈ 119.38

window.addEventListener('scroll', () => {
  if (!fabTop) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;

  // Show/hide FAB
  fabTop.classList.toggle('visible', scrollTop > 300);

  // Update SVG circle progress
  if (fabProg) {
    const offset = CIRCUMFERENCE * (1 - progress);
    fabProg.style.strokeDashoffset = offset;
  }
}, { passive: true });

fabTop && fabTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── CANVAS BACKGROUND ──
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
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
