document.addEventListener('DOMContentLoaded', () => {

    /* ── Always start at top (Hero) ── */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const navbar = document.getElementById('navbar');
    const loader = document.getElementById('intro-loader');

    /* ════════════════════════════════════
       INTRO LOADER + HERO CASCADE
    ════════════════════════════════════ */
    const heroItems = [
        document.querySelector('.hero-eyebrow'),
        document.querySelector('.hero-title'),
        document.querySelector('.hero-rule'),
        document.querySelector('.hero-tagline'),
        document.querySelector('.hero-cta-oval'),
    ].filter(Boolean);

    // Start hero items fully hidden
    heroItems.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(22px)'; el.style.transition = 'none'; });

    setTimeout(() => {
        if (loader) loader.classList.add('hidden');

        setTimeout(() => {
            heroItems.forEach((el, i) => {
                setTimeout(() => {
                    el.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 140);
            });
            // Social + fragment fade in
            document.querySelectorAll('.hero-social-left, .hero-fragment-wrap, .hero-scroll-hint').forEach((el, i) => {
                setTimeout(() => {
                    el.style.transition = 'opacity 1s cubic-bezier(0.22,1,0.36,1)';
                    el.style.opacity = '1';
                }, 700 + i * 100);
            });
        }, 350);
    }, 1500);

    // Hide extra hero elements initially
    document.querySelectorAll('.hero-social-left, .hero-fragment-wrap, .hero-scroll-hint').forEach(el => {
        el.style.opacity = '0';
    });

    /* ════════════════════════════════════
       NAVBAR SCROLL BEHAVIOR
    ════════════════════════════════════ */
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ════════════════════════════════════
       SCROLL REVEAL ENGINE
    ════════════════════════════════════ */

    // 1. Standard fade-in-up / fade-in-left / fade-in-right / fade-in
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in, .valor-reveal-1, .valor-reveal-2, .valor-reveal-3, .valor-reveal-4, .valor-reveal-5, .valor-reveal-6').forEach(el => {
        revealObserver.observe(el);
    });

    // Premium Text Masking
    document.querySelectorAll('.reveal-mask').forEach(el => {
        const content = el.innerHTML;
        el.innerHTML = `<span class="reveal-mask-line"><span class="reveal-mask-inner">${content}</span></span>`;
        revealObserver.observe(el);
    });

    /* ════════════════════════════════════
       MAGNETIC HOVER EFFECT & PARALLAX
    ════════════════════════════════════ */
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            btn.style.transition = 'transform 0.7s var(--ease-premium)';
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });

    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            parallaxBg.style.transform = `translateY(${scrolled * 0.15}px)`;
        }, { passive: true });
    }

    // 2. Animated rules (lines that draw themselves)
    document.querySelectorAll('.reveal-line, .reveal-line-v, .line-wrap').forEach(el => revealObserver.observe(el));

    // 3. Stagger grids — assign --stagger-i to each child automatically
    document.querySelectorAll('.stagger-grid').forEach(grid => {
        const items = grid.querySelectorAll('.stagger-item');
        items.forEach((item, i) => {
            item.style.setProperty('--stagger-i', i);
        });

        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stagger-item').forEach(item => {
                        item.classList.add('visible');
                    });
                    gridObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        gridObserver.observe(grid);
    });

    // 4. Section heading split reveal (eyebrow text slides left-to-right with clip)
    document.querySelectorAll('.reveal-heading').forEach(el => {
        el.style.clipPath = 'inset(0 100% 0 0)';
        el.style.transition = 'clip-path 0.9s cubic-bezier(0.22,1,0.36,1)';

        const headingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.clipPath = 'inset(0 0% 0 0)';
                    headingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        headingObserver.observe(el);
    });

    /* ════════════════════════════════════
       MOBILE MENU
    ════════════════════════════════════ */
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navMenu   = document.querySelector('.nav-menu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileBtn.classList.toggle('open');
            mobileBtn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    /* ════════════════════════════════════
       SMOOTH SCROLLING
    ════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = navbar.offsetHeight + 16;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });

            if (navMenu && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                mobileBtn.classList.remove('open');
                mobileBtn.setAttribute('aria-expanded', false);
                document.body.style.overflow = '';
            }
        });
    });

    /* ════════════════════════════════════
       ACTIVE NAV LINK TRACKING
    ════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active-link', link.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(s => sectionObserver.observe(s));

    /* ════════════════════════════════════
       VALOR CARD — subtle scale on hover via JS (touch fallback)
    ════════════════════════════════════ */
    document.querySelectorAll('.valor-card, .area-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'background 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)';
        });
    });

});
