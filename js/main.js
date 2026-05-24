/* ===========================
   SMANTUB Website - Main JS
=========================== */

// ===== PRELOADER =====
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    initAnimations();
  }, 1200);
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNavLink();
  toggleBackToTop();
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth < 640 ? 12 : 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 60 + 10;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 15 + 10;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${left}%;
      animation-delay:${delay}s;
      animation-duration:${duration}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const target = new Date('2026-08-31T23:59:59');
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = n => String(n).padStart(2, '0');
  document.getElementById('cd-days').textContent = pad(days);
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent = pad(mins);
  document.getElementById('cd-secs').textContent = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== AOS (Animate On Scroll) =====
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));

        if (entry.target.closest('.hero-stats')) {
          animateCounters();
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const stats = document.querySelector('.hero-stats');
  if (stats) statsObserver.observe(stats);
}

// ===== VISI MISI TABS =====
const vmTabs = document.querySelectorAll('.vm-tab');
const vmPanels = document.querySelectorAll('.vm-panel');

vmTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    vmTabs.forEach(t => t.classList.remove('active'));
    vmPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById('tab-' + tab.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// ===== ACHIEVEMENTS FILTER =====
const achTabs = document.querySelectorAll('.ach-tab');
const achCards = document.querySelectorAll('.ach-card');

achTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    achTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;

    achCards.forEach((card, i) => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      setTimeout(() => {
        card.classList.toggle('hidden', !show);
        if (show) {
          setTimeout(() => {
            card.style.opacity = '';
            card.style.transform = '';
          }, 50);
        }
      }, 150);
    });
  });
});

// ===== TESTIMONIALS SLIDER =====
const testiTrack = document.getElementById('testiTrack');
const testiDotsContainer = document.getElementById('testiDots');
const testiCards = document.querySelectorAll('.testi-card');
const testiPrev = document.getElementById('testiPrev');
const testiNext = document.getElementById('testiNext');

let currentTesti = 0;
let testiInterval;

function createDots() {
  testiCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToTesti(i));
    testiDotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = testiDotsContainer.querySelectorAll('.testi-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === currentTesti));
}

function goToTesti(index) {
  currentTesti = (index + testiCards.length) % testiCards.length;
  testiTrack.style.transform = `translateX(-${currentTesti * 100}%)`;
  updateDots();
}

function startAutoSlide() {
  testiInterval = setInterval(() => goToTesti(currentTesti + 1), 5000);
}

testiPrev.addEventListener('click', () => {
  clearInterval(testiInterval);
  goToTesti(currentTesti - 1);
  startAutoSlide();
});

testiNext.addEventListener('click', () => {
  clearInterval(testiInterval);
  goToTesti(currentTesti + 1);
  startAutoSlide();
});

createDots();
startAutoSlide();

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = original;
    btn.disabled = false;
    contactForm.reset();
    showToast('Pesan Anda berhasil terkirim! Kami akan segera menghubungi Anda.');
  }, 2000);
});

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});
