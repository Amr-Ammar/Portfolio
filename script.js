/* ============================================================
   AMR AMMAR PORTFOLIO — SCRIPT.JS
   ============================================================ */

// ---- CUSTOM CURSOR ----
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
document.addEventListener('mouseenter', () => { dot.style.opacity = 1; ring.style.opacity = 0.6; });

// ---- PARTICLES ----
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.05;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ---- MOBILE MENU ----
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ---- TYPING ANIMATION ----
const typedEl = document.querySelector('.typed-text');
const phrases = [
  'Data Analyst',
  'Backend Developer',
  'BIS Student @ MUST',
  'Problem Solver'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  let delay = isDeleting ? 60 : 90;
  if (!isDeleting && charIdx === current.length) { delay = 1800; isDeleting = true; }
  if (isDeleting && charIdx === 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 300; }

  setTimeout(type, delay);
}
setTimeout(type, 1200);

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger within same parent
      const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
      let delay = 0;
      siblings.forEach(sib => {
        if (sib === entry.target) entry.target.style.transitionDelay = delay + 'ms';
        delay += 80;
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---- SKILL BARS ----
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.skill-bar-item');
      bars.forEach((bar, i) => {
        const level = bar.dataset.level;
        const fill = bar.querySelector('.bar-fill');
        setTimeout(() => {
          fill.style.width = level + '%';
        }, i * 80 + 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const inc = Math.ceil(target / 30);
  const interval = setInterval(() => {
    current += inc;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = current;
  }, 50);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => animateCounter(el));
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.about-stats').forEach(el => statObserver.observe(el));

// ---- PROJECT MODALS ----
const modalData = {
  weather50: {
    title: 'Weather50',
    type: 'Full-Stack Web Application',
    desc: `Weather50 is a comprehensive, full-stack weather application that provides real-time global weather conditions, air quality index data, and detailed city information. The platform features interactive maps powered by Leaflet.js, allowing users to explore weather visually across the globe. Users can save their favorite cities for quick access, view hourly and weekly forecasts, and explore air quality metrics critical for health-conscious decisions. The application integrates multiple external APIs including OpenWeatherMap and Wikipedia to deliver rich, contextual city information alongside meteorological data.`,
    tech: ['Python', 'Django', 'HTML5', 'CSS3', 'JavaScript', 'Leaflet.js', 'OpenWeatherMap API', 'Wikipedia API', 'SQLite']
  },
  sepsis: {
    title: 'Sepsis Risk Expert System',
    type: 'Expert System / Decision Support System',
    desc: `A sophisticated rule-based expert system designed to assist healthcare professionals in diagnosing and classifying sepsis risk levels in patients. Built using CLIPS (C Language Integrated Production System), the system analyzes patient data including vital signs, laboratory results, and clinical indicators to classify risk into High, Medium, or Low categories. The system uses a comprehensive knowledge base of medical rules encoded by domain experts, providing not only risk classification but also actionable recommendations and explanations for each decision — making it a true decision support tool for clinical environments. The system demonstrates the power of expert systems and AI in healthcare settings.`,
    tech: ['CLIPS Programming', 'Rule-Based Systems', 'Expert Systems', 'Decision Support Systems', 'Knowledge Engineering', 'Healthcare AI']
  }
};

function openModal(key) {
  const data = modalData[key];
  if (!data) return;
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <p class="modal-type">${data.type}</p>
    <h2 class="modal-title">${data.title}</h2>
    <p class="modal-desc">${data.desc}</p>
    <p class="modal-tech-label">Technologies Used</p>
    <div class="modal-tech">
      ${data.tech.map(t => `<span class="ptag">${t}</span>`).join('')}
    </div>
  `;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ---- CONTACT FORM ----
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    document.getElementById('form-success').classList.add('show');
    e.target.reset();
    setTimeout(() => document.getElementById('form-success').classList.remove('show'), 4000);
  }, 1500);
}

// ---- PARALLAX HERO ----
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual');
  if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
  if (heroVisual) heroVisual.style.transform = `translateY(${scrollY * 0.08}px)`;
});

// ---- SMOOTH SCROLL for nav links ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- TILT EFFECT on project cards ----
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const tiltX = ((y - cy) / cy) * 6;
    const tiltY = ((x - cx) / cx) * -6;
    card.style.transform = `translateY(-8px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

console.log('%cAmr Ammar Portfolio', 'color: #00d4ff; font-size: 24px; font-weight: bold;');
console.log('%cData Analyst & Backend Developer', 'color: #7a9abf; font-size: 14px;');
