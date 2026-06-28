/**
 * Hero Section Carousel Controller
 * Manages background image slideshow with smooth fade transitions.
 */
export function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides || slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds per slide
    let intervalId = null;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function startSlideshow() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextSlide, slideInterval);
    }

    function stopSlideshow() {
        if (intervalId) clearInterval(intervalId);
    }

    // Initialize first slide state
    slides[0].classList.add('active');
    startSlideshow();

    // Pause slideshow on page visibility change to conserve performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });

    // Return controls in case manual override is needed
    return {
        next: nextSlide,
        start: startSlideshow,
        stop: stopSlideshow
    };
}
