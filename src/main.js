import './style.css';

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}

// ---------- Navbar scroll state ----------
const navbar = document.getElementById('navbar');
function updateNavbarState() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}

// ---------- Back to top button ----------
const backToTop = document.getElementById('backToTop');
function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  updateProgress();
  updateNavbarState();
  updateBackToTop();
}, { passive: true });
updateProgress();
updateNavbarState();

// ---------- Mobile hamburger menu ----------
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  navbar.classList.toggle('menu-open');
  hamburger.classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navbar.classList.remove('menu-open');
    hamburger.classList.remove('open');
  });
});

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);
sections.forEach((section) => navObserver.observe(section));

// ---------- Scroll reveal animations ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ---------- Experience accordion ----------
document.querySelectorAll('.timeline-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.timeline-item');
    const isOpen = item.classList.contains('is-open');
    item.classList.toggle('is-open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

// ---------- Profile photo with graceful fallback ----------
const avatarCircle = document.getElementById('avatarCircle');
const avatarPhoto = document.getElementById('avatarPhoto');
if (avatarPhoto) {
  avatarPhoto.addEventListener('load', () => {
    avatarCircle.classList.add('has-photo');
  });
  avatarPhoto.addEventListener('error', () => {
    avatarCircle.classList.remove('has-photo');
  });
  // Handle the case where the image is already loaded from cache before
  // this script runs, in which case the 'load' event never fires.
  if (avatarPhoto.complete && avatarPhoto.naturalWidth > 0) {
    avatarCircle.classList.add('has-photo');
  }
}

// ---------- Hero typed text effect ----------
const typedEl = document.getElementById('typedText');
const phrases = [
  'scalable Spark & Databricks pipelines.',
  'real-time streaming with Kafka.',
  'cost-efficient AWS & Azure platforms.',
  'CI/CD-driven data infrastructure.',
  'LLM-powered engineering tools.'
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 55);
}
typeLoop();

// ---------- Contact form (Web3Forms) ----------
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.contact-submit');
    const formData = new FormData(contactForm);

    formStatus.textContent = 'Sending…';
    formStatus.className = 'form-status';
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const result = await response.json();

      if (response.ok && result.success) {
        formStatus.textContent = 'Thanks! Your message has been sent — I\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
        formStatus.className = 'form-status error';
      }
    } catch (err) {
      formStatus.textContent = 'Network error. Please try again or email me directly.';
      formStatus.className = 'form-status error';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
