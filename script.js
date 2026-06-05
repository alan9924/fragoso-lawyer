document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Intro Loader and Hero Animation
    const loader = document.getElementById('intro-loader');
    const heroElements = document.querySelectorAll('.fade-in-up');
    
    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
        
        setTimeout(() => {
            heroElements.forEach(el => el.classList.add('visible'));
        }, 400); // Start showing hero after loader fades out
    }, 1500); // 1.5s initial loader animation

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-item');
    serviceCards.forEach(card => observer.observe(card));


    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Auto-scrolling Carousel with Center Highlight & Seamless Loop
    const carousel = document.querySelector('.carousel-container.swipeable');
    if (carousel) {
        let autoScrollInterval;
        const slides = carousel.querySelectorAll('.carousel-slide');
        
        // 1. Center Highlight Logic using IntersectionObserver
        const highlightObserverOptions = {
            root: carousel,
            rootMargin: '0px -50% 0px -50%', // Triggers exactly at the horizontal center
            threshold: 0
        };

        const highlightObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const serviceItem = entry.target.querySelector('.service-item');
                if (entry.isIntersecting) {
                    serviceItem.classList.add('active');
                } else {
                    serviceItem.classList.remove('active');
                }
            });
        }, highlightObserverOptions);

        slides.forEach(slide => highlightObserver.observe(slide));

        // 2. Seamless Infinite Loop Continuous Auto-Scroll (60fps Marquee)
        const calculateLoopDistance = () => {
            if (slides.length >= 10) {
                return slides[5].offsetLeft - slides[0].offsetLeft;
            }
            return 0;
        };

        let autoScrollReq;
        let isInteracting = false;
        let resumeTimeout;
        const scrollSpeed = 4; // Pixels per frame. Higher = much faster.

        const startAutoScroll = () => {
            if (!isInteracting) {
                const loopDistance = calculateLoopDistance();
                carousel.scrollLeft += scrollSpeed;
                
                // If we scrolled exactly past the first set, seamlessly jump back to frame 1
                if (loopDistance > 0 && carousel.scrollLeft >= loopDistance) {
                    carousel.scrollLeft = carousel.scrollLeft - loopDistance;
                }
            }
            autoScrollReq = requestAnimationFrame(startAutoScroll);
        };

        const pauseAutoScroll = () => {
            isInteracting = true;
            clearTimeout(resumeTimeout);
        };

        const resumeAutoScroll = () => {
            // Wait 1.5 seconds after interaction ends to resume scrolling
            resumeTimeout = setTimeout(() => {
                isInteracting = false;
            }, 1500); 
        };

        // Start continuous loop
        autoScrollReq = requestAnimationFrame(startAutoScroll);

        // Pause when user is interacting with touch or mouse
        carousel.addEventListener('touchstart', pauseAutoScroll, { passive: true });
        carousel.addEventListener('mouseenter', pauseAutoScroll);

        // Resume after interaction
        carousel.addEventListener('touchend', resumeAutoScroll);
        carousel.addEventListener('mouseleave', resumeAutoScroll);

        // Also pause briefly if they use momentum scrolling so we don't fight it
        carousel.addEventListener('scroll', () => {
            if (!isInteracting) {
                pauseAutoScroll();
                resumeAutoScroll();
            }
        }, { passive: true });
    }
});
