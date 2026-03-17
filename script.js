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

// ===== TABS (Résultats / Calendrier) =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const el = document.getElementById('tab-' + target);
    if (el) el.classList.add('active');
  });
});

// ===== COMMUNITY TABS =====
document.querySelectorAll('.comm-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.comm;
    document.querySelectorAll('.comm-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.comm-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const el = document.getElementById('comm-' + target);
    if (el) el.classList.add('active');
  });
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.info-card, .social-card, .match-card, .gal-item, .stat, .contact-block, .adhesion-card, .solidarity-item, .digital-btn'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

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
      const nums = entry.target.querySelectorAll('.stat-num[data-target]');
      nums.forEach(n => {
        const t = parseInt(n.dataset.target);
        if (!isNaN(t)) animateCounter(n, t);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) counterObserver.observe(statsRow);

// ===== CONTACT FORM → WHATSAPP =====
function handleForm(e) {
  e.preventDefault();
  const nom = document.getElementById('f-nom')?.value || '';
  const tel = document.getElementById('f-tel')?.value || '';
  const msg = document.getElementById('f-msg')?.value || '';
  const text = encodeURIComponent(`Bonjour AWF !\nNom: ${nom}\nTél: ${tel}\nMessage: ${msg}`);
  window.open(`https://wa.me/237699201466?text=${text}`, '_blank');
}

// ===== LECTURE DES DONNÉES ADMIN (localStorage) =====
function loadAdminData() {
  const saved = localStorage.getItem('awfData');
  if (!saved) return;
  try {
    const data = JSON.parse(saved);

    // Prochain match
    if (data.prochainMatch) {
      const d = document.getElementById('pm-date');
      const h = document.getElementById('pm-heure');
      const l = document.getElementById('pm-lieu');
      if (d) d.textContent = data.prochainMatch.date;
      if (h) h.textContent = data.prochainMatch.heure;
      if (l) l.textContent = data.prochainMatch.lieu;
    }

    // Résultats
    if (data.resultats && data.resultats.length) {
      const list = document.getElementById('resultatsList');
      if (list) {
        list.innerHTML = data.resultats.map(r => {
          const vWin = r.vertScore > r.rougeScore;
          const rWin = r.rougeScore > r.vertScore;
          const statusClass = r.status === 'nul' ? 'nul' : 'fini';
          const statusText = r.status === 'nul' ? '⬛ Match nul' : '✔ Terminé';

          // Buteurs & passeurs
          const bv = r.buteursVert && r.buteursVert.length ? r.buteursVert.join(', ') : null;
          const br = r.buteursRouge && r.buteursRouge.length ? r.buteursRouge.join(', ') : null;
          const pv = r.passeursVert && r.passeursVert.length ? r.passeursVert.join(', ') : null;
          const pr = r.passeursRouge && r.passeursRouge.length ? r.passeursRouge.join(', ') : null;

          const statsRow = (bv || br || pv || pr) ? `
            <div class="match-stats">
              ${bv ? `<span class="ms-item vert">⚽ ${bv}</span>` : ''}
              ${br ? `<span class="ms-item rouge">⚽ ${br}</span>` : ''}
              ${pv ? `<span class="ms-item pass">🎯 ${pv}</span>` : ''}
              ${pr ? `<span class="ms-item pass">🎯 ${pr}</span>` : ''}
            </div>` : '';

          return `
          <div class="match-card result">
            <span class="match-date">${r.date}</span>
            <div class="match-score">
              <div class="match-team">
                <span class="team-color-dot vert"></span>
                <span class="team" style="${vWin?'font-weight:800;':''}">Les Verts</span>
              </div>
              <span class="score">${r.vertScore} — ${r.rougeScore}</span>
              <div class="match-team right">
                <span class="team" style="${rWin?'font-weight:800;':''}">Les Rouges</span>
                <span class="team-color-dot rouge"></span>
              </div>
            </div>
            <span class="match-status ${statusClass}">${statusText}</span>
            ${statsRow}
          </div>`;
        }).join('');
      }
    }

    // Calendrier
    if (data.calendrier && data.calendrier.length) {
      const cal = document.getElementById('tab-prochain-liste');
      if (cal) {
        const grid = cal.querySelector('.results-grid');
        if (grid) {
          grid.innerHTML = data.calendrier.filter(c => c.date).map(c => `
          <div class="match-card upcoming">
            <span class="match-date">${c.date}</span>
            <div class="match-score">
              <div class="match-team">
                <span class="team-color-dot vert"></span>
                <span class="team">Les Verts</span>
              </div>
              <span class="score">vs</span>
              <div class="match-team right">
                <span class="team">Les Rouges</span>
                <span class="team-color-dot rouge"></span>
              </div>
            </div>
            <span class="match-status avc">⏳ À venir · ${c.heure}</span>
          </div>`).join('');
        }
      }
    }
  } catch(e) { console.warn('AWF data error:', e); }
}

// Écouter les mises à jour depuis admin.html (même onglet)
window.addEventListener('awfDataUpdated', loadAdminData);

// Charger au démarrage
loadAdminData();

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) current = section.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + current && !a.classList.contains('nav-cta')) {
      a.style.color = 'var(--orange)';
    }
  });
}, { passive: true });
