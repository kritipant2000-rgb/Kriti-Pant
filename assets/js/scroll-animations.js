/**
 * scroll-animations.js
 * Place this script at the bottom of <body>, after all other scripts.
 * It works independently of AOS — no conflicts.
 */

(function () {
  'use strict';

  /* ── 1. INTERSECTION OBSERVER SETUP ── */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px', // trigger slightly before element enters viewport
    threshold: 0.12
  };

  const onIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate once only
      }
    });
  };

  const observer = new IntersectionObserver(onIntersect, observerOptions);

  /* ── 2. SECTION TITLES ── */
  document.querySelectorAll('.section-title').forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });

  /* ── 3. ABOUT SECTION ── */
  const aboutImg = document.querySelector('#about .col-lg-4 img');
  if (aboutImg) {
    aboutImg.classList.add('scroll-reveal', 'scale-up');
    observer.observe(aboutImg);
  }

  const aboutContent = document.querySelector('#about .content');
  if (aboutContent) {
    aboutContent.classList.add('scroll-reveal', 'from-right');
    observer.observe(aboutContent);
  }

  /* ── 4. RESUME ITEMS ── */
  document.querySelectorAll('.resume-item').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + 's';
    observer.observe(el);
  });

  /* ── 5. SKILL CARDS (staggered row) ── */
  document.querySelectorAll('#services .row').forEach(row => {
    row.classList.add('stagger-children');
    observer.observe(row);
  });

  /* ── 6. PORTFOLIO ITEMS ── */
  document.querySelectorAll('.portfolio-item').forEach((el, i) => {
    el.classList.add('scroll-reveal');
    el.style.transitionDelay = ((i % 3) * 0.1) + 's'; // column-based stagger
    observer.observe(el);
  });

  /* ── 7. CONTACT INFO ITEMS ── */
  document.querySelectorAll('.info-item').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
    observer.observe(el);
  });

  /* ── 8. CONTACT FORM BOX ── */
  const formBox = document.querySelector('.contact-form-box');
  if (formBox) {
    formBox.classList.add('scroll-reveal', 'from-right');
    observer.observe(formBox);
  }

  /* ── 9. FOOTER ── */
  const footer = document.querySelector('#footer');
  if (footer) {
    footer.classList.add('scroll-reveal', 'from-bottom');
    observer.observe(footer);
  }

  /* ── 10. SMOOTH SCROLL for nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 11. NAV HIGHLIGHT on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navmenu a');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

})();


/* =============================================
   CUSTOM CURSOR + TRAIL
   ============================================= */
(function initCursor() {
  // Inject cursor elements
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  document.body.appendChild(ring);
  document.body.appendChild(dot);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let trailCount = 0;
  const TRAIL_INTERVAL = 4; // every N mousemove events

  // Smooth ring follow via rAF
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';

    // Spawn trail particle every N moves
    trailCount++;
    if (trailCount % TRAIL_INTERVAL === 0) {
      const spark = document.createElement('div');
      spark.className = 'cursor-trail';
      spark.style.left = e.clientX + 'px';
      spark.style.top  = e.clientY + 'px';
      // Vary size & color slightly for sparkle feel
      const size = 3 + Math.random() * 5;
      const hue  = 210 + Math.round(Math.random() * 30 - 15);
      spark.style.width  = size + 'px';
      spark.style.height = size + 'px';
      spark.style.background = `hsla(${hue}, 85%, 55%, 0.5)`;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 560);
    }
  }, { passive: true });

  // Hover state — expand ring over interactive elements
  const hoverTargets = 'a, button, .portfolio-item, .service-item, input, textarea, .portfolio-filters li, #scroll-top, .whatsapp-float';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click ripple state
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  // Hide cursors when mouse leaves window
  document.addEventListener('mouseleave', () => {
    ring.style.opacity = '0';
    dot.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    ring.style.opacity = '1';
    dot.style.opacity  = '1';
  });
})();