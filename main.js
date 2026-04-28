/* ── main.js — shared across all pages ── */

// ── CURSOR ──
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animRing() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();
})();

// ── SAND PARTICLES ──
(function initParticles() {
  const canvas = document.getElementById('sand-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(200,169,110,', 'rgba(226,201,138,', 'rgba(139,110,63,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -4;
      this.r  = Math.random() * 1.6 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = Math.random() * 0.4 + 0.1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.y > H + 4 || this.life > this.maxLife) this.reset(false);
    }
    draw() {
      const fade = this.life < 40 ? this.life / 40 :
                   this.life > this.maxLife - 40 ? (this.maxLife - this.life) / 40 : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + (this.alpha * fade) + ')';
      ctx.fill();
    }
  }

  const N = 220;
  for (let i = 0; i < N; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── SCROLL REVEAL ──
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();

// ── ACTIVE NAV LINK ──
(function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();
