// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== TABS =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');
  });
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.info-card, .social-card, .match-card, .gal-item, .stat, .contact-block, .apropos-text, .apropos-cards'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); }
    else { el.textContent = start; }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(n => animateCounter(n, parseInt(n.dataset.target)));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) counterObserver.observe(statsRow);

// ===== CONTACT FORM → WHATSAPP =====
function handleForm(e) {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input, textarea');
  const nom = inputs[0]?.value || '';
  const tel = inputs[1]?.value || '';
  const msg = inputs[2]?.value || '';
  const text = `Bonjour AWF !%0ANom: ${nom}%0ATél: ${tel}%0AMessage: ${msg}`;
  window.open(`https://wa.me/237699201466?text=${text}`, '_blank');
}

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) current = section.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.remove('active-link');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active-link');
  });
});
