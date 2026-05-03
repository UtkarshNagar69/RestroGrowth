/* ─────────────────────────────────────────────
   RestroGrowth – main.js  (unique edition)
   ───────────────────────────────────────────── */

// ── THEME ─────────────────────────────────────
const THEME_KEY = "rg-theme";
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  const btn = document.getElementById("themeToggle");
  if (btn) {
    const ic = btn.querySelector(".toggle-icon");
    if (ic) ic.textContent = t === "light" ? "🌙" : "☀️";
    btn.title = t === "light" ? "Dark mode" : "Light mode";
  }
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") || "dark";
  const nxt = cur === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, nxt);
  applyTheme(nxt);
}
(function () {
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
})();

// ── SCROLL PROGRESS BAR ──────────────────────
const progressBar = document.querySelector(".scroll-progress");
function updateProgress() {
  if (!progressBar) return;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = h > 0 ? (window.scrollY / h) * 100 + "%" : "0%";
}

// ── NAVBAR ────────────────────────────────────
const navbar = document.querySelector(".navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 50);
    updateProgress();
  },
  { passive: true },
);
updateProgress();

// ── HAMBURGER ─────────────────────────────────
document.querySelector(".hamburger")?.addEventListener("click", () => {
  document.querySelector(".nav-links")?.classList.toggle("open");
});

// ── CLOCK ─────────────────────────────────────
function updateClock() {
  const el = document.getElementById("nav-clock");
  if (!el) return;
  const n = new Date();
  el.innerHTML = `<strong>${n.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</strong>${n.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}`;
}
setInterval(updateClock, 1000);
updateClock();

// ── CURSOR GLOW ───────────────────────────────
const glow = document.querySelector(".cursor-glow");
if (glow) {
  document.addEventListener(
    "mousemove",
    (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    },
    { passive: true },
  );
}

// ── TYPEWRITER EFFECT ─────────────────────────
function typewriter(el, phrases, speed = 80, pause = 2200) {
  if (!el) return;
  let pi = 0,
    ci = 0,
    deleting = false;
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci >= phrase.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
      setTimeout(tick, speed);
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci <= 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, speed / 2);
    }
  }
  tick();
}
typewriter(
  document.getElementById("hero-typewriter"),
  [
    "Faster Than Ever",
    "Across All Platforms",
    "With Expert Support",
    "From Day One",
  ],
  75,
  2500,
);

// ── PARTICLES ─────────────────────────────────
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W,
    H,
    particles = [];

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.35 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark =
      document.documentElement.getAttribute("data-theme") !== "light";
    const color = isDark ? "253,186,116" : "249,115,22";
    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.o})`;
      ctx.fill();
    });
    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color},${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}
initParticles("particles-canvas");

// ── SLIDER ────────────────────────────────────
let currentSlide = 0,
  slideTimer;
const track = document.querySelector(".slider-track");
const dots = document.querySelectorAll(".dot");
const slides = document.querySelectorAll(".slide");

function goToSlide(n) {
  if (!track || !slides.length) return;
  currentSlide = (n + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
}
function resetTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
}
document.querySelector(".slider-btn.prev")?.addEventListener("click", () => {
  goToSlide(currentSlide - 1);
  resetTimer();
});
document.querySelector(".slider-btn.next")?.addEventListener("click", () => {
  goToSlide(currentSlide + 1);
  resetTimer();
});
dots.forEach((d, i) =>
  d.addEventListener("click", () => {
    goToSlide(i);
    resetTimer();
  }),
);
resetTimer();

// ── COUNTER ───────────────────────────────────
function animateCounter(el, target, suffix) {
  let v = 0;
  const steps = 70,
    inc = target / steps,
    iv = 2000 / steps;
  const t = setInterval(() => {
    v += inc;
    if (v >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(t);
    } else el.textContent = Math.floor(v).toLocaleString() + suffix;
  }, iv);
}
const cObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      animateCounter(
        e.target,
        parseInt(e.target.dataset.target),
        e.target.dataset.suffix || "",
      );
      cObs.unobserve(e.target);
    });
  },
  { threshold: 0.4 },
);
document
  .querySelectorAll(".counter[data-target]")
  .forEach((el) => cObs.observe(el));

// ── SCROLL REVEAL ─────────────────────────────
const rObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        rObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.06, rootMargin: "0px 0px -40px 0px" },
);
document
  .querySelectorAll(
    ".card,.glow-card,.service-item,.testimonial,.stat,.tl-item,.process-step,.team-card,.milestone,.addon,.why-item,.service-card,.pricing-card",
  )
  .forEach((el, i) => {
    el.classList.add("reveal-ready");
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    rObs.observe(el);
  });

// ── ACTIVE NAV ────────────────────────────────
const pg = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((a) => {
  if (a.getAttribute("href") === pg) a.classList.add("active");
});

// ── PARALLAX ORBS ─────────────────────────────
window.addEventListener(
  "mousemove",
  (e) => {
    document.querySelectorAll(".orb").forEach((o, i) => {
      const f = (i + 1) * 14;
      o.style.transform = `translate(${(e.clientX / window.innerWidth - 0.5) * f}px,${(e.clientY / window.innerHeight - 0.5) * f}px)`;
    });
  },
  { passive: true },
);
