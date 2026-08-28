/* ============================================================
   IRONCLAD BOXING CLUB — main.js
   GSAP 3 + ScrollTrigger animations & interactivity
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---- Utility: Reduced-motion check ---- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   NAV — scroll-aware background
   ============================================================ */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');

ScrollTrigger.create({
  start: 'top -60',
  onEnter:  () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

/* Active nav link on scroll */
const sections = document.querySelectorAll('section[id]');
const observerOptions = { rootMargin: '-40% 0px -55% 0px' };
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);
sections.forEach(s => navObserver.observe(s));

/* ============================================================
   MOBILE MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   HERO ANIMATION (on load)
   ============================================================ */
if (!prefersReducedMotion) {
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .fromTo('.hero-tag',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 }, 0.3)
    .fromTo('.hero-line',
      { opacity: 0, y: 80, skewY: 4 },
      { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.12 }, 0.5)
    .fromTo('.hero-sub',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7 }, 1.1)
    .fromTo('.hero-actions',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }, 1.3);
} else {
  /* Skip animations but reveal elements */
  gsap.set(['.hero-tag', '.hero-line', '.hero-sub', '.hero-actions'],
    { opacity: 1, y: 0, skewY: 0 });
}

/* ============================================================
   PARALLAX — Hero & Video backgrounds
   ============================================================ */
if (!prefersReducedMotion) {
  gsap.to('.hero-bg', {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  gsap.to('.video-bg', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: { trigger: '.video-section', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

/* ============================================================
   STAT COUNTERS
   ============================================================ */
document.querySelectorAll('.stat-number').forEach(el => {
  const target = parseInt(el.dataset.target, 10);

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (prefersReducedMotion) { el.textContent = target; return; }
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: target,
        duration: 1.8,
        ease: 'power2.out',
        snap: { textContent: 1 },
        onUpdate() { el.textContent = Math.round(parseFloat(el.textContent)); },
      });
    },
  });
});

/* ============================================================
   SCROLL REVEAL — generic
   ============================================================ */
function revealUp(selector, stagger = 0) {
  gsap.utils.toArray(selector).forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        if (prefersReducedMotion) { gsap.set(el, { opacity: 1 }); return; }
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: i * stagger }
        );
      },
    });
  });
}

revealUp('.reveal-up');

/* Reveal left / right */
gsap.utils.toArray('.reveal-left').forEach(el => {
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => {
      if (prefersReducedMotion) { gsap.set(el, { opacity: 1 }); return; }
      gsap.fromTo(el, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' });
    },
  });
});

gsap.utils.toArray('.reveal-right').forEach(el => {
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => {
      if (prefersReducedMotion) { gsap.set(el, { opacity: 1 }); return; }
      gsap.fromTo(el, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' });
    },
  });
});

/* ============================================================
   PROGRAMS — FAN DECK
   ============================================================ */
const PROGRAMS = [
  {
    name: 'Juniors',
    age: 'Ages 6–10',
    img: 'images/photos/juniors.jpg',
    desc: 'Fun, structured introduction to boxing fundamentals. Kids develop coordination, confidence, and discipline in a safe, encouraging environment.',
    features: ['Basic stance & footwork', 'Coordination drills', 'Confidence building'],
    ctaText: 'Get Started →',
    ctaHref: 'signup.html',
  },
  {
    name: 'Youth',
    age: 'Ages 11–17',
    img: 'images/photos/training-general.jpg',
    desc: 'Intermediate to advanced training for teens ready to take boxing seriously. Technique, fitness, and competitive readiness.',
    features: ['Advanced technique', 'Sparring fundamentals', 'Competition prep'],
    ctaText: 'Get Started →',
    ctaHref: 'signup.html',
  },
  {
    name: 'Adults',
    age: 'Ages 18+',
    img: 'images/photos/hero-adults.jpg',
    desc: 'Full-body boxing for fitness, self-defense, or competition. All skill levels welcome — complete beginners to advanced athletes.',
    features: ['Fitness & conditioning', 'Self-defense skills', 'Competitive boxing'],
    ctaText: 'Get Started →',
    ctaHref: 'signup.html',
  },
  {
    name: 'Masters',
    age: 'Ages 35+',
    img: 'images/photos/masters.jpg',
    desc: 'Specialized boxing for adults 35+. Modified intensity with full technique — stay sharp, fit, and powerful at any age.',
    features: ['Age-appropriate intensity', 'Full technique training', 'Supportive community'],
    ctaText: 'Get Started →',
    ctaHref: 'signup.html',
  },
  {
    name: 'Personal Training',
    age: 'All Ages',
    img: 'images/photos/personal-training.jpg',
    desc: 'One-on-one sessions tailored to your goals, timeline, and skill level. The fastest path to results with dedicated coach attention.',
    features: ['1-on-1 coach attention', 'Custom training plan', 'Flexible scheduling', '$45 intro session (30 min)'],
    ctaText: 'Book a Session →',
    ctaHref: 'signup.html?plan=intro',
  },
];

const progCards    = document.querySelectorAll('.prog-card');
const overlay      = document.getElementById('program-overlay');
const overlayPanel = document.getElementById('overlay-panel');
const overlayClose = document.getElementById('overlay-close');

ScrollTrigger.create({
  trigger: '.prog-grid',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    if (prefersReducedMotion) return;
    gsap.fromTo(progCards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
    );
  },
});

let lastProgramTrigger = null;

progCards.forEach((card, i) => {
  card.addEventListener('click', () => openProgram(i, card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProgram(i, card);
    }
  });
});

function openProgram(index, trigger) {
  const p = PROGRAMS[index];
  document.getElementById('overlay-img').src          = p.img;
  document.getElementById('overlay-img').alt          = p.name;
  document.getElementById('overlay-age').textContent  = p.age;
  document.getElementById('overlay-name').textContent = p.name;
  document.getElementById('overlay-desc').textContent = p.desc;
  document.getElementById('overlay-features').innerHTML = p.features.map(f => `<li>${f}</li>`).join('');
  const cta = document.getElementById('overlay-cta');
  cta.textContent = p.ctaText;
  cta.href = p.ctaHref;

  lastProgramTrigger = trigger || null;
  overlay.classList.add('overlay-active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  overlayClose.focus();

  if (!prefersReducedMotion) {
    gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(overlayPanel,
      { scale: 0.9, opacity: 0, y: 24 },
      { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.05 }
    );
  } else {
    gsap.set(overlay, { opacity: 1 });
    gsap.set(overlayPanel, { scale: 1, opacity: 1 });
  }
}

function closeProgram(onComplete) {
  if (!prefersReducedMotion) {
    gsap.to(overlayPanel, { scale: 0.94, opacity: 0, y: 12, duration: 0.25, ease: 'power2.in' });
    gsap.to(overlay, {
      opacity: 0, duration: 0.3, delay: 0.1,
      onComplete: () => {
        overlay.classList.remove('overlay-active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastProgramTrigger) { lastProgramTrigger.focus(); lastProgramTrigger = null; }
        if (onComplete) onComplete();
      },
    });
  } else {
    gsap.set(overlay, { opacity: 0 });
    overlay.classList.remove('overlay-active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastProgramTrigger) { lastProgramTrigger.focus(); lastProgramTrigger = null; }
    if (onComplete) onComplete();
  }
}

overlayClose.addEventListener('click', () => closeProgram());
overlay.addEventListener('click', e => { if (e.target === overlay) closeProgram(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('overlay-active')) closeProgram(); });

document.getElementById('overlay-cta').addEventListener('click', function (e) {
  e.preventDefault();
  const href = this.getAttribute('href');
  closeProgram(() => { window.location.href = href; });
});

/* ============================================================
   COACH CARDS — stagger reveal
   ============================================================ */
ScrollTrigger.create({
  trigger: '.coaches-grid',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    if (prefersReducedMotion) { gsap.set('.coach-card', { opacity: 1 }); return; }
    gsap.fromTo('.coach-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.15, ease: 'power3.out' }
    );
  },
});

/* ============================================================
   PRICING CARDS — stagger reveal
   ============================================================ */
ScrollTrigger.create({
  trigger: '.pricing-grid',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    if (prefersReducedMotion) { gsap.set('.pricing-card', { opacity: 1 }); return; }
    gsap.fromTo('.pricing-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
    );
  },
});

/* ============================================================
   TESTIMONIAL CARDS — stagger reveal
   ============================================================ */
ScrollTrigger.create({
  trigger: '.testimonials-grid',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    if (prefersReducedMotion) { gsap.set('.testimonial-card', { opacity: 1 }); return; }
    gsap.fromTo('.testimonial-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: 'power3.out' }
    );
  },
});

/* ============================================================
   VIDEO SECTION — title reveal
   ============================================================ */
ScrollTrigger.create({
  trigger: '.video-content',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    if (prefersReducedMotion) { gsap.set('.video-content > *', { opacity: 1 }); return; }
    gsap.fromTo('.video-content > *',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
    );
  },
});

/* ============================================================
   SCHEDULE DAY TABS
   ============================================================ */
const scheduleTabs = document.querySelectorAll('.schedule-tab');
const scheduleDays = document.querySelectorAll('.schedule-day');

scheduleTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const day = tab.dataset.day;

    scheduleTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    scheduleDays.forEach(d => {
      const isTarget = d.id === `sched-${day}`;
      d.classList.toggle('active', isTarget);
      if (isTarget && !prefersReducedMotion) {
        gsap.fromTo(d.querySelectorAll('.class-slot'),
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
        );
      }
    });
  });
});

/* Animate initial schedule slots on page load */
window.addEventListener('load', () => {
  if (!prefersReducedMotion) {
    ScrollTrigger.create({
      trigger: '.schedule-content',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo('#sched-mon .class-slot',
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' }
        );
      },
    });
  }
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Basic validation */
    const name  = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    document.getElementById('name-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('name').removeAttribute('aria-invalid');
    document.getElementById('email').removeAttribute('aria-invalid');
    if (!name || !email) {
      const badId = !name ? 'name' : 'email';
      document.getElementById(badId).setAttribute('aria-invalid', 'true');
      document.getElementById(`${badId}-error`).textContent = 'This field is required.';
      shakeField(badId);
      return;
    }

    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('.btn-text');
    btnText.textContent = 'Sending…';

    try {
      await emailjs.send('YOUR_EMAILJS_SERVICE_ID', 'YOUR_EMAILJS_TEMPLATE_ID', {
        from_name:    name,
        from_email:   email,
        phone:        document.getElementById('phone').value.trim() || 'Not provided',
        program:      document.getElementById('program').value || 'Not specified',
        message:      document.getElementById('message').value.trim() || 'No message provided',
        to_email:     'info@ironcladboxing.com',
      });
    } catch (err) {
      btnText.textContent = 'Send Message';
      submitBtn.disabled = false;
      alert('Failed to send message. Please call us at (407) 555-0142.');
      return;
    }

    contactForm.style.display = 'none';
    formSuccess.classList.remove('hidden');

    if (!prefersReducedMotion) {
      gsap.fromTo(formSuccess,
        { opacity: 0, y: 10, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  });
}

function shakeField(id) {
  const el = document.getElementById(id);
  if (!el || prefersReducedMotion) { el?.focus(); return; }
  gsap.fromTo(el,
    { x: 0 },
    { x: 10, duration: 0.08, repeat: 5, yoyo: true, ease: 'power2.inOut',
      onComplete: () => { gsap.set(el, { x: 0 }); el.focus(); } }
  );
  el.style.borderColor = '#f0b429';
  el.addEventListener('input', () => {
    el.style.borderColor = '';
    el.removeAttribute('aria-invalid');
    const errEl = document.getElementById(`${id}-error`);
    if (errEl) errEl.textContent = '';
  }, { once: true });
}

/* ============================================================
   MAGNETIC BUTTON EFFECT (CTAs)
   ============================================================ */
if (!prefersReducedMotion) {
  document.querySelectorAll('.btn-primary.btn-lg').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
      gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ============================================================
   ABOUT IMAGE — subtle float animation
   ============================================================ */
if (!prefersReducedMotion) {
  gsap.to('.about-badge', {
    y: -8,
    duration: 2.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

/* ============================================================
   SCROLL PROGRESS LINE (top of page)
   ============================================================ */
const progressLine = document.createElement('div');
progressLine.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px; z-index: 200;
  background: #f0b429; width: 0%; pointer-events: none;
  box-shadow: 0 0 8px rgba(240,180,41,0.6);
`;
document.body.prepend(progressLine);

gsap.to(progressLine, {
  width: '100%',
  ease: 'none',
  scrollTrigger: { start: 'top top', end: 'bottom bottom', scrub: 0.3 },
});
