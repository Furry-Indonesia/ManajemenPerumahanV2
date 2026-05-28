// ── Particles ────────────────────────────────────────────────
  (function() {
    const c = document.getElementById('particles');
    const colors = ['rgba(139,92,246,0.7)','rgba(167,139,250,0.5)','rgba(212,168,83,0.45)','rgba(168,85,247,0.6)'];
    for (let i = 0; i < 32; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = [1.5,2,2.5,3][Math.floor(Math.random()*4)];
      const drift = (Math.random()-0.5)*180;
      p.style.cssText = `
        width:${size}px;height:${size}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        left:${Math.random()*100}%;
        --drift:${drift}px;
        animation-duration:${9+Math.random()*16}s;
        animation-delay:${Math.random()*14}s;
        box-shadow:0 0 ${size*3}px currentColor;
      `;
      c.appendChild(p);
    }
  })();

  // ── Nav scroll spy ───────────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#'+current) l.classList.add('active');
    });
  }, { passive: true });

  // ── Scroll Reveal ────────────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

  // ── FAQ Accordion ────────────────────────────────────────────
  document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ── Hamburger (mobile) ───────────────────────────────────────
  const ham = document.getElementById('hamburger');
  const navLinkList = document.querySelector('.nav-links');
  ham.addEventListener('click', () => {
    const open = navLinkList.style.display === 'flex';
    navLinkList.style.display = open ? 'none' : 'flex';
    navLinkList.style.flexDirection = 'column';
    navLinkList.style.position = 'absolute';
    navLinkList.style.top = '72px';
    navLinkList.style.left = '0'; navLinkList.style.right = '0';
    navLinkList.style.background = 'rgba(10,10,18,0.98)';
    navLinkList.style.backdropFilter = 'blur(20px)';
    navLinkList.style.padding = '1rem 2rem 1.5rem';
    navLinkList.style.borderBottom = '1px solid rgba(139,92,246,0.2)';
    navLinkList.style.gap = '0.75rem';
  });