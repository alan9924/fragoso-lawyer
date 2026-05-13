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

        // 2. Seamless Infinite Loop Auto-Scroll
        // We know we duplicated the 5 items. Distance between item 0 and item 5 is our exact loop distance.
        const calculateLoopDistance = () => {
            if (slides.length >= 10) {
                return slides[5].offsetLeft - slides[0].offsetLeft;
            }
            return 0;
        };

        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                const loopDistance = calculateLoopDistance();
                
                // If we scrolled deep into the duplicate set, jump back silently
                if (loopDistance > 0 && carousel.scrollLeft >= loopDistance) {
                    // Instantly rewind to exact equivalent position in the first set without animation
                    carousel.style.scrollBehavior = 'auto'; // Force disable CSS smooth scroll if any
                    carousel.scrollTo({ left: carousel.scrollLeft - loopDistance, behavior: 'auto' });
                    
                    // Allow browser to render the instant jump, then animate to next
                    requestAnimationFrame(() => {
                        carousel.style.scrollBehavior = 'smooth';
                        carousel.scrollBy({ left: 200, behavior: 'smooth' }); // Scroll one item roughly
                    });
                } else {
                    carousel.scrollBy({ left: 200, behavior: 'smooth' });
                }
            }, 3000); // 3 seconds per slide for a more fluid feel
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Start autoplay
        startAutoScroll();

        // Pause when user is interacting
        carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
        carousel.addEventListener('mouseenter', stopAutoScroll);

        // Resume autoplay after interaction ends
        carousel.addEventListener('touchend', () => {
            stopAutoScroll();
            setTimeout(startAutoScroll, 4000); 
        });
        carousel.addEventListener('mouseleave', startAutoScroll);
    }
});
