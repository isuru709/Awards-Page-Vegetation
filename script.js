/*
    ═══════════════════════════════════════════════════════════════════════════════
    VERDANT - Interactive Logic
    Awwwards-Level Landing Page - Complete Rewrite
    ═══════════════════════════════════════════════════════════════════════════════
*/

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════════════════════════════════
    // PRELOADER
    // ═══════════════════════════════════════════════════════════════════════════════
    const preloader = document.getElementById('preloader');
    const body = document.body;

    // Hide preloader after animation completes
    function hidePreloader() {
        preloader.classList.add('hidden');
        body.classList.remove('loading');

        // Trigger scroll animations immediately after preloader
        setTimeout(() => {
            triggerInitialAnimations();
        }, 100);
    }

    // Wait for page load, minimum 2s for branding effect
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 2000);
    });

    // Fallback - hide preloader after 3s regardless
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            hidePreloader();
        }
    }, 3500);

    // ═══════════════════════════════════════════════════════════════════════════════
    // CUSTOM CURSOR
    // ═══════════════════════════════════════════════════════════════════════════════
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    // Only activate on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        // Update cursor position on mouse move
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Immediate update for dot cursor
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Animate follower with smooth lerp
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .magnetic, .product-card');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('active');
                if (el.classList.contains('product-card')) {
                    cursorFollower.classList.add('view-mode');
                }
            });

            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('active', 'view-mode');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // MAGNETIC BUTTON EFFECT
    // ═══════════════════════════════════════════════════════════════════════════════
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(el => {
        const strength = parseInt(el.getAttribute('data-strength')) || 25;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            const moveX = deltaX * (strength / 100);
            const moveY = deltaY * (strength / 100);

            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.transform = 'translate(0, 0)';
            setTimeout(() => { el.style.transition = ''; }, 400);
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // 3D TILT EFFECT FOR PRODUCT CARDS
    // ═══════════════════════════════════════════════════════════════════════════════
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        const imageWrapper = card.querySelector('.product-image-wrapper');
        if (!imageWrapper) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateX = (0.5 - y) * 15;
            const rotateY = (x - 0.5) * 15;

            imageWrapper.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                scale3d(1.02, 1.02, 1.02)
            `;
        });

        card.addEventListener('mouseleave', () => {
            imageWrapper.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            imageWrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            setTimeout(() => { imageWrapper.style.transition = ''; }, 500);
        });

        card.addEventListener('mouseenter', () => {
            imageWrapper.style.transition = 'transform 0.2s ease-out';
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // SCROLL PROGRESS INDICATOR
    // ═══════════════════════════════════════════════════════════════════════════════
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        if (!scrollProgress) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollPercent = (window.scrollY / documentHeight) * 100;

        scrollProgress.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ═══════════════════════════════════════════════════════════════════════════════
    // SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
    // ═══════════════════════════════════════════════════════════════════════════════

    // All elements that should animate on scroll
    const animatedElements = document.querySelectorAll(
        '.reveal-element, .product-card, .feature-card, .testimonial-card, .stat'
    );

    // Create observer with generous thresholds
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
    });

    // Observe all animated elements
    animatedElements.forEach(el => observer.observe(el));

    // Trigger animations for elements already in view
    function triggerInitialAnimations() {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PARALLAX EFFECT (Simple, performant)
    // ═══════════════════════════════════════════════════════════════════════════════
    const parallaxElements = document.querySelectorAll('.parallax');

    function updateParallax() {
        const scrollY = window.scrollY;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.3;
            const yPos = scrollY * speed;
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ═══════════════════════════════════════════════════════════════════════════════
    // COUNTER ANIMATION FOR STATS
    // ═══════════════════════════════════════════════════════════════════════════════
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * easeProgress);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // NAVIGATION BEHAVIOR
    // ═══════════════════════════════════════════════════════════════════════════════
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // ═══════════════════════════════════════════════════════════════════════════════
    // MOBILE MENU
    // ═══════════════════════════════════════════════════════════════════════════════
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SMOOTH ANCHOR SCROLL
    // ═══════════════════════════════════════════════════════════════════════════════
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const targetPosition = target.getBoundingClientRect().top + window.scrollY - 100;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // NEWSLETTER FORM
    // ═══════════════════════════════════════════════════════════════════════════════
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const input = newsletterForm.querySelector('.form-input');
            const button = newsletterForm.querySelector('.form-submit');

            if (input.value && input.validity.valid) {
                button.innerHTML = '<span>Subscribed! ✓</span>';
                button.style.background = 'var(--color-gold)';
                input.value = '';

                setTimeout(() => {
                    button.innerHTML = '<span>Subscribe</span><span class="submit-arrow">→</span>';
                    button.style.background = '';
                }, 3000);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // ADD TO CART ANIMATION
    // ═══════════════════════════════════════════════════════════════════════════════
    const addButtons = document.querySelectorAll('.product-add');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;

    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Button animation
            button.style.transform = 'scale(0.9)';
            setTimeout(() => { button.style.transform = ''; }, 150);

            // Update cart
            cartItems++;
            if (cartCount) {
                cartCount.textContent = cartItems;
                cartCount.style.transform = 'scale(1.3)';
                setTimeout(() => { cartCount.style.transform = ''; }, 200);
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // FLOATING ORBS MOUSE INTERACTION
    // ═══════════════════════════════════════════════════════════════════════════════
    const orbs = document.querySelectorAll('.orb');

    if (!isTouchDevice && orbs.length > 0) {
        let orbMouseX = 0, orbMouseY = 0;

        document.addEventListener('mousemove', (e) => {
            orbMouseX = (e.clientX / window.innerWidth - 0.5) * 30;
            orbMouseY = (e.clientY / window.innerHeight - 0.5) * 30;
        });

        function animateOrbs() {
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.3;
                const currentTransform = orb.style.transform || '';
                // Only apply mouse movement, preserve existing animations
                orb.style.marginLeft = `${orbMouseX * speed}px`;
                orb.style.marginTop = `${orbMouseY * speed}px`;
            });
            requestAnimationFrame(animateOrbs);
        }
        animateOrbs();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // KEYBOARD ACCESSIBILITY
    // ═══════════════════════════════════════════════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        body.classList.remove('keyboard-nav');
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // TEXT SCRAMBLE EFFECT ON HOVER
    // ═══════════════════════════════════════════════════════════════════════════════
    const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    function scrambleText(element) {
        const originalText = element.getAttribute('data-text') || element.textContent;
        element.setAttribute('data-text', originalText);

        let iteration = 0;
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) return originalText[index];
                    if (char === ' ') return ' ';
                    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                })
                .join('');

            if (iteration >= originalText.length) {
                clearInterval(interval);
                element.textContent = originalText;
            }
            iteration += 1 / 2;
        }, 30);
    }

    // Apply to nav links
    document.querySelectorAll('.nav-link span').forEach(el => {
        el.addEventListener('mouseenter', () => scrambleText(el));
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // RIPPLE EFFECT ON BUTTON CLICK
    // ═══════════════════════════════════════════════════════════════════════════════
    document.querySelectorAll('.btn-primary, .btn-outline, .nav-cart').forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                animation: rippleAnim 0.6s ease-out forwards;
            `;

            // Add keyframes if not exists
            if (!document.querySelector('#ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
                    @keyframes rippleAnim {
                        to {
                            width: 300px;
                            height: 300px;
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // SMOOTH SCROLL LENIS-STYLE (Optional enhancement)
    // ═══════════════════════════════════════════════════════════════════════════════
    let scrollY = 0;
    let currentScroll = 0;

    function smoothScrollUpdate() {
        scrollY = window.scrollY;
        currentScroll += (scrollY - currentScroll) * 0.1;

        // Update any scroll-based animations here
        const scrollPercent = currentScroll / (document.body.scrollHeight - window.innerHeight);

        requestAnimationFrame(smoothScrollUpdate);
    }
    smoothScrollUpdate();

    // ═══════════════════════════════════════════════════════════════════════════════
    // INITIALIZATION COMPLETE
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log('%c✨ Verdant initialized', 'color: #5ba85d; font-size: 14px; font-weight: bold;');
    console.log('%cAwwwards-level experience loaded', 'color: #888; font-size: 11px;');

});
