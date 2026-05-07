// PRODUCTION-READY ANIMATION CONTROLLER - BULLETPROOF VERSION

// Ensure DOM is fully ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
    initializeAnimations();
}

function initializeAnimations() {
    console.log('Initializing animations...');

    // Get loader element
    const loader = document.getElementById('loader');
    if (!loader) {
        console.error('Loader element not found - starting animations immediately');
        startMainAnimations();
        return;
    }

    // PRODUCTION-READY LOADER SEQUENCE - CUSTOMIZABLE TIMING
    const startLoadingSequence = () => {
        // Ensure loader is visible immediately
        loader.style.display = 'flex';
        loader.classList.remove('fade-out');

        // CUSTOMIZE THESE VALUES TO CHANGE TIMING:
        const animationTime = 1000;  // Time for bar to fill (in milliseconds) - 1 second
        const pauseTime = 400;       // Time to show completed bar (in milliseconds)
        const fadeTime = 600;        // Time to fade out (in milliseconds) - clear transition

        // Start the sequence
        setTimeout(() => {
            // After animation completes and pause, start fade
            console.log('Starting fade out...');
            loader.classList.add('fade-out');

            // After fade completes, hide and start main animations
            setTimeout(() => {
                console.log('Starting main animations...');
                loader.style.display = 'none';
                document.body.style.overflow = 'visible';
                startMainAnimations();
            }, fadeTime);
        }, animationTime + pauseTime);
    };

    // START MAIN ANIMATIONS - GUARANTEED TO WORK
    const startMainAnimations = () => {
        // Add animation class to body - this triggers everything
        document.body.classList.add('start-animations');
        console.log('Added start-animations class to body');

        // Verify animations are starting
        setTimeout(() => {
            const heroTitle = document.querySelector('.hero-title .letter');
            if (heroTitle) {
                const computed = window.getComputedStyle(heroTitle);
                console.log('Hero animation status:', computed.animationName);
            }
        }, 100);

        // Initialize other animation features
        initScrollAnimations();
        initScrollIndicatorHiding();
        initParallaxEffect();
        initInteractiveEffects();
    };

    // SCROLL INDICATOR HIDING - BULLETPROOF
    const initScrollIndicatorHiding = () => {
        let hasScrolled = false;

        const hideScrollIndicator = () => {
            if (!hasScrolled) {
                hasScrolled = true;
                const scrollIndicator = document.querySelector('.scroll-indicator');
                if (scrollIndicator) {
                    scrollIndicator.classList.add('hide');
                    document.body.classList.add('scrolled');
                    setTimeout(() => {
                        if (scrollIndicator) {
                            scrollIndicator.style.display = 'none';
                        }
                    }, 500);
                }
            }
        };

        // Multiple event listeners for maximum compatibility
        ['scroll', 'wheel', 'touchmove', 'touchstart'].forEach(eventType => {
            window.addEventListener(eventType, () => {
                const scrollTop = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if (scrollTop > 10) {
                    hideScrollIndicator();
                }
            }, { passive: true });
        });

        // Hide on navigation click
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', hideScrollIndicator);
        });

        // Hide after timeout
        setTimeout(() => {
            ['click', 'touchstart', 'keydown'].forEach(eventType => {
                document.addEventListener(eventType, hideScrollIndicator, { once: true });
            });
        }, 5000);
    };

    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    const initScrollAnimations = () => {
        if (!('IntersectionObserver' in window)) {
            console.log('IntersectionObserver not supported - showing all elements');
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.classList.add('in-view');
            });
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');

                    // Stagger siblings for service/testimonial items
                    if (entry.target.classList.contains('service-item') ||
                        entry.target.classList.contains('testimonial-item')) {
                        const siblings = entry.target.parentElement.children;
                        Array.from(siblings).forEach((sibling, index) => {
                            setTimeout(() => {
                                sibling.classList.add('in-view');
                            }, index * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    };

    // PARALLAX EFFECT - OPTIMIZED
    const initParallaxEffect = () => {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
            const heroContent = document.querySelector('.hero-content');
            const hero = document.getElementById('hero');

            if (hero && heroContent) {
                const heroHeight = hero.offsetHeight;
                if (scrolled < heroHeight) {
                    heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
                    heroContent.style.opacity = Math.max(0.3, 1 - (scrolled * 0.001));
                }
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    };

    // INTERACTIVE EFFECTS
    const initInteractiveEffects = () => {

        // CTA button magnetic effect
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            button.addEventListener('mouseleave', function () {
                this.style.transform = 'translate(0, 0)';
            });
        });

        // Nav items hover
        document.querySelectorAll('.navbar-nav a').forEach(item => {
            item.addEventListener('mouseenter', function () {
                this.style.transform = 'translateX(5px)';
            });

            item.addEventListener('mouseleave', function () {
                this.style.transform = 'translateX(0)';
            });
        });



    };

    // START EVERYTHING
    startLoadingSequence();

    // FALLBACK: If animations haven't started after 5 seconds, force start
    setTimeout(() => {
        if (!document.body.classList.contains('start-animations')) {
            console.warn('Animations not started - forcing start');
            document.body.classList.add('start-animations');
            initScrollAnimations();
            initScrollIndicatorHiding();
            initParallaxEffect();
            initInteractiveEffects();
        }
    }, 5000);
}