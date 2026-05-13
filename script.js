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

    // Auto-scrolling Carousel with Touch Pause
    const carousel = document.querySelector('.carousel-container.swipeable');
    if (carousel) {
        let autoScrollInterval;
        const scrollAmount = 250; // Distance to trigger snap to next item

        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                const maxScroll = carousel.scrollWidth - carousel.clientWidth;
                // If reached the end, smoothly rewind to start
                if (carousel.scrollLeft >= maxScroll - 10) {
                    carousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Scroll to next item (snap handles exact positioning)
                    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }, 2500); // 2.5 seconds per slide
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Start autoplay
        startAutoScroll();

        // Pause when user is interacting with finger or mouse
        carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
        carousel.addEventListener('mouseenter', stopAutoScroll);

        // Resume autoplay after interaction ends
        carousel.addEventListener('touchend', () => {
            stopAutoScroll();
            setTimeout(startAutoScroll, 4000); // Wait 4s before resuming
        });
        carousel.addEventListener('mouseleave', startAutoScroll);
    }
});
