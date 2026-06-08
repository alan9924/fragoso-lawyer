document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const loader = document.getElementById('intro-loader');

    /* ── Intro Loader ── */
    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
        // Animate hero elements after loader hides
        setTimeout(() => {
            document.querySelectorAll('.hero .hero-content *').forEach(el => {
                el.style.opacity = '1';
            });
        }, 300);
    }, 1600);

    /* ── Navbar Scroll ── */
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ── Scroll Reveal (Intersection Observer) ── */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    /* ── Mobile Menu ── */
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navMenu   = document.querySelector('.nav-menu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileBtn.classList.toggle('open');
            mobileBtn.setAttribute('aria-expanded', isOpen);
            // Prevent scrolling when mobile menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    /* ── Smooth Scrolling ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = navbar.offsetHeight + 16;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                mobileBtn.classList.remove('open');
                mobileBtn.setAttribute('aria-expanded', false);
                document.body.style.overflow = '';
            }
        });
    });

    /* ── Active nav link tracking ── */
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
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));
});
