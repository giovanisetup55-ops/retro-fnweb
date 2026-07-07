/* =============================================
   RETRO FN — SCRIPT
   ============================================= */

/* ---------- Navbar: scroll shadow + mobile toggle ---------- */
const navbar = document.querySelector('.navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.textContent = '☰';
  });
});

/* ---------- Stars ---------- */
(function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;

  const COUNT = 180;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2.5 + 0.5; // 0.5 – 3px
    const x    = Math.random() * 100;
    const y    = Math.random() * 100;
    const dur  = Math.random() * 4 + 2;      // 2 – 6s twinkle
    const del  = Math.random() * 6;

    Object.assign(star.style, {
      position:        'absolute',
      borderRadius:    '50%',
      width:           `${size}px`,
      height:          `${size}px`,
      left:            `${x}%`,
      top:             `${y}%`,
      background:      size > 2 ? '#00c2ff' : '#ffffff',
      opacity:         Math.random() * 0.6 + 0.2,
      animation:       `twinkle ${dur}s ${del}s ease-in-out infinite`,
      pointerEvents:   'none',
    });

    fragment.appendChild(star);
  }

  container.appendChild(fragment);

  // inject the keyframe once
  if (!document.getElementById('twinkle-style')) {
    const style = document.createElement('style');
    style.id = 'twinkle-style';
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: var(--base-op, 0.4); transform: scale(1); }
        50%       { opacity: 0.05; transform: scale(0.6); }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ---------- Animated stat counters ---------- */
function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const duration = 1800; // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out quad
    const eased    = 1 - (1 - progress) * (1 - progress);
    el.textContent = Math.floor(eased * target).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(step);
}

/* ---------- Intersection Observer: counters + scroll reveal ---------- */
const countersObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      countersObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  countersObserver.observe(el);
});

// Add reveal classes to elements — skip anything inside .hero-content
const revealSelectors = [
  '.feature-card',
  '.season-card',
  '.step',
  '.step-connector',
  '.section-header',
  '.download-cta',
  '.discord-content',
];

revealSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    // Don't apply reveal to elements inside the hero (parallax handles those)
    if (el.closest('.hero')) return;
    el.classList.add('reveal');
    const delay = Math.min(i, 4) + 1;
    el.classList.add(`reveal-delay-${delay}`);
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- Smooth active nav highlighting ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkItems.forEach(link => {
        link.classList.toggle(
          'nav-active',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// Inject nav-active style
(function injectNavActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `.nav-links a.nav-active { color: #ffffff !important; }`;
  document.head.appendChild(style);
})();

/* ---------- Parallax subtle hero ---------- */
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.18}px)`;
    heroContent.style.opacity   = `${1 - scrolled / (window.innerHeight * 0.85)}`;
  }
}, { passive: true });
