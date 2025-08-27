// Init AOS
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true });
  }
});

// Footer year
(function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Theme toggle with persistence
(function themeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
    if (btn) {
      btn.innerHTML = mode === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
      btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', mode === 'dark' ? '#0b1020' : '#4f46e5');
  }

  setTheme(stored || (prefersDark ? 'dark' : 'light'));
  btn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
})();

// Scroll progress bar
(function scrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Back-to-top
(function backToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > 400) btn.classList.add('show'); else btn.classList.remove('show');
  };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Smooth anchor scrolling + close navbar on mobile
(function smoothAnchors() {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  const navMenu = document.getElementById('navMenu');

  links.forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navMenu?.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navMenu);
          bsCollapse.hide();
        }
      }
    });
  });
})();

// Typewriter for role line
(function typewriter() {
  const el = document.querySelector('.role');
  if (!el) return;

  const phrases = [
    'Full‑Stack Developer',
    'ASP.NET Core • C# • SQL Server',
    'React • Angular • TypeScript',
    'Node.js • Express • MongoDB',
    'Accessible • Performant • Reliable'
  ];

  const speed = 28;       // ms per char
  const hold = 1200;      // ms hold at end
  const erase = 16;       // ms per char on delete
  let idx = 0, pos = 0, writing = true;

  function loop() {
    const text = phrases[idx % phrases.length];
    if (writing) {
      pos++;
      el.textContent = text.slice(0, pos);
      if (pos === text.length) {
        writing = false;
        return setTimeout(loop, hold);
      }
      return setTimeout(loop, speed);
    } else {
      pos--;
      el.textContent = text.slice(0, pos);
      if (pos === 0) {
        writing = true;
        idx++;
      }
      return setTimeout(loop, erase);
    }
  }
  loop();
})();

// Radial progress animation when visible
(function radialProgress() {
  const rings = document.querySelectorAll('.radial-progress');
  if (!rings.length) return;

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-percent') || '0');
    const valueEl = el.querySelector('.value');
    let current = 0;

    const step = () => {
      current += (target - current) * 0.1; // ease-out
      if (Math.abs(target - current) < 0.5) current = target;
      el.style.setProperty('--p', current);
      if (valueEl) valueEl.textContent = Math.round(current) + '%';
      if (current < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  rings.forEach(r => io.observe(r));
})();