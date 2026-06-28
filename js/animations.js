/**
 * Animations & UX Enhancements Controller
 * Manages intersection observer scroll reveals, cursor glows, loading screen,
 * statistics counters, custom ripple effects, and back to top triggers.
 */
export function initAnimations() {
    initLoader();
    initScrollProgress();
    initCursorGlow();
    initScrollReveals();
    initCounters();
    initRipples();
    initBackToTop();
}

// 1. Loading Screen Handler
function initLoader() {
    const loader = document.getElementById('loader-screen');
    if (!loader) return;

    window.addEventListener('load', () => {
        // Delay slightly for premium sensation
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove(); // Remove from DOM to keep it clean
            }, 800);
        }, 1200);
    });
}

// 2. Scroll Progress Bar
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        bar.style.width = scrolled + "%";
    });
}

// 3. Cursor Glow Effect (Desktop Only)
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    // Media query to check if device supports fine hover (desktop/mouse)
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    if (!isDesktop) {
        glow.remove();
        return;
    }

    glow.style.display = 'block';

    window.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    // Expand glow on interactive elements
    const hoverables = document.querySelectorAll('a, button, .why-card, .product-card, .gallery-item, select, input, textarea');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            glow.style.width = '450px';
            glow.style.height = '450px';
            glow.style.backgroundColor = 'rgba(197, 160, 89, 0.12)';
        });
        item.addEventListener('mouseleave', () => {
            glow.style.width = '300px';
            glow.style.height = '300px';
            glow.style.backgroundColor = 'rgba(197, 160, 89, 0.08)';
        });
    });
}

// 4. Scroll reveals using Intersection Observer
function initScrollReveals() {
    const sections = document.querySelectorAll('.scroll-reveal');
    const timelineItems = document.querySelectorAll('.timeline-item');

    const options = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, options);

    sections.forEach(sec => observer.observe(sec));
    timelineItems.forEach(item => observer.observe(item));
}

// 5. Animated statistics counter
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const limit = parseInt(target.getAttribute('data-target'), 10);
                animateValue(target, 0, limit, 2000);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        let value = Math.floor(progress * (end - start) + start);
        
        // Format thousands with comma
        if (value >= 1000) {
            obj.innerHTML = value.toLocaleString();
        } else {
            obj.innerHTML = value;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 6. Click Ripples for Buttons
function initRipples() {
    const rippleButtons = document.querySelectorAll('.ripple');
    
    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 7. Back-to-Top Button Scroll Handler
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
