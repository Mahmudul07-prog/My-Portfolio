// ==========================================================================
// MAHMUDUL HASAN — PORTFOLIO SCRIPTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Init AOS (Animate on Scroll)
  if (window.AOS) {
    AOS.init({ duration: 750, easing: 'ease-out-cubic', once: true });
  }

  // 2. Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Theme Toggle with LocalStorage & OS Preference
  (function initTheme() {
    const root = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function setTheme(mode) {
      root.setAttribute('data-theme', mode);
      localStorage.setItem('theme', mode);
      if (btn) {
        btn.innerHTML = mode === 'dark' ? '<i class="bi bi-sun-fill text-warning"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
        btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      }
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', mode === 'dark' ? '#0b1120' : '#4f46e5');
    }

    setTheme(stored || (prefersDark ? 'dark' : 'light'));
    btn?.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  })();

  // 4. Language Toggle (English / Bangla)
  (function initLanguage() {
    const btn = document.getElementById('langToggle');
    const label = document.getElementById('langToggleLabel');
    if (!btn || !label) return;

    const textEls = document.querySelectorAll('[data-bn]');
    const placeholderEls = document.querySelectorAll('[data-bn-placeholder]');

    // Cache original English values
    textEls.forEach(el => {
      if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.textContent.trim());
    });
    placeholderEls.forEach(el => {
      if (!el.hasAttribute('data-en-placeholder')) el.setAttribute('data-en-placeholder', el.getAttribute('placeholder') || '');
    });

    function setLang(lang) {
      textEls.forEach(el => {
        el.textContent = lang === 'bn' ? el.getAttribute('data-bn') : el.getAttribute('data-en');
      });
      placeholderEls.forEach(el => {
        el.setAttribute('placeholder', lang === 'bn' ? el.getAttribute('data-bn-placeholder') : el.getAttribute('data-en-placeholder'));
      });
      document.documentElement.setAttribute('lang', lang === 'bn' ? 'bn' : 'en');
      label.textContent = lang === 'bn' ? 'EN' : 'বাং';
      btn.setAttribute('aria-label', lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন');
      localStorage.setItem('lang', lang);
    }

    setLang(localStorage.getItem('lang') || 'en');
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('lang') || 'en';
      setLang(current === 'bn' ? 'en' : 'bn');
    });
  })();

  // 5. Scroll Progress Bar
  (function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement;
      const progress = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  // 6. Back-to-Top Button
  (function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 380) btn.classList.add('show');
      else btn.classList.remove('show');
    }, { passive: true });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // 7. Navbar Active Links on Scroll (Scrollspy)
  (function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-custom .nav-link');

    function updateActiveNav() {
      const scrollPos = window.scrollY + 120;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  })();

  // 8. Smooth Scrolling + Close Mobile Navbar
  (function initSmoothNav() {
    const navMenu = document.getElementById('navMenu');
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (navMenu && navMenu.classList.contains('show') && window.bootstrap) {
            const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
            if (bsCollapse) bsCollapse.hide();
          }
        }
      });
    });
  })();

  // 9. Typewriter Effect
  (function initTypewriter() {
    const el = document.querySelector('.role');
    if (!el) return;

    const phrases = [
      'Full‑Stack Software Developer',
      'ASP.NET Core 8 • C# • Clean Architecture',
      'React.js • Angular 17 • TypeScript',
      'SQL Server • PostgreSQL • EF Core',
      'Enterprise Systems & Scalable APIs'
    ];

    let idx = 0, pos = 0, writing = true;
    const speed = 32;
    const hold = 1400;
    const erase = 18;

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

  // 10. Project Filtering (All, .NET & C#, Frontend & AI, Full-Stack)
  (function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    if (!filterBtns.length || !projectItems.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        projectItems.forEach(item => {
          const category = item.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });
        if (window.AOS) AOS.refresh();
      });
    });
  })();

  // 11. Stats Counter Animation
  (function initStatsCounter() {
    const nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;

    const animate = (el) => {
      const target = parseFloat(el.getAttribute('data-count') || '0');
      let current = 0;
      const step = () => {
        current += (target - current) * 0.12;
        if (Math.abs(target - current) < 0.5) current = target;
        el.textContent = Math.round(current) + '+';
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

    nums.forEach(n => io.observe(n));
  })();

  // 12. Contact Form AJAX Submit (FormSubmit.co)
  (function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('cfStatus');
    const btn = document.getElementById('cfSubmit');
    if (!form || !status || !btn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.querySelector('[name="_honey"]')?.value) return; // honeypot caught bot

      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Sending...';
      status.className = 'form-status show';
      status.style.background = 'rgba(79, 70, 229, 0.1)';
      status.style.color = 'var(--primary)';
      status.textContent = 'Submitting message...';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('Submission failed');

        status.textContent = "Thank you! Your message has been sent successfully. I'll get back to you shortly.";
        status.style.background = 'rgba(34, 197, 94, 0.12)';
        status.style.color = '#16a34a';
        form.reset();
      } catch (err) {
        status.textContent = 'Something went wrong. Please email directly at mahmudulhasa27@gmail.com.';
        status.style.background = 'rgba(239, 68, 68, 0.12)';
        status.style.color = '#dc2626';
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
    });
  })();

  // 13. Character Parallax & Scroll-Bound Body Reveal
  (function initCharacterParallax() {
    const charWrapper = document.getElementById('characterWrapper');
    const charImg = document.getElementById('characterImg');
    if (!charWrapper || !charImg) return;

    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    // Subtle 3D mouse tracking
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetMouseX = ((e.clientX - cx) / cx) * 14; // -14px to +14px
      targetMouseY = ((e.clientY - cy) / cy) * 14;
    }, { passive: true });

    function renderParallax() {
      // Smooth interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Scroll progression (0 to 1)
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;

      // Subtle vertical gliding on scroll
      const isMobile = window.innerWidth <= 768;
      const scrollShift = progress * (isMobile ? -14 : -16);

      if (isMobile) {
        charImg.style.transform = `translate3d(0, ${scrollShift.toFixed(2)}%, 0)`;
      } else {
        charImg.style.transform = `translate3d(${mouseX.toFixed(2)}px, calc(${scrollShift.toFixed(2)}% + ${mouseY.toFixed(2)}px), 0)`;
      }

      requestAnimationFrame(renderParallax);
    }
    requestAnimationFrame(renderParallax);
  })();
});
