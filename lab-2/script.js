let slideshows = document.querySelectorAll('.slider');
slideshows.forEach(initSlideShow);

function initSlideShow(slideshow) {
    let slides = slideshow.querySelectorAll('[role="list"] .slide');
    let dotsContainer = slideshow.querySelector('.dots');
    let prevButton = slideshow.querySelector('.prev');
    let nextButton = slideshow.querySelector('.next');
    let lightbox = document.querySelector('.lightbox');
    let lightboxImg = lightbox.querySelector('.lightbox-img');
    let time = slideshow.dataset.slideTime || 3000;
    let animationDuration = time / 5 + 'ms';
    let animationType = slideshow.dataset.slideAnimation || 'slideIn';
    let index = 0
    let lastTime = 0;
    let animationFrameId;
    let isPaused = false;

    slides.forEach((slide, i) => {
        let dot = document.createElement('div');
        dot.classList.add('navigation-dot');
        if (i === index) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            console.log('clciked');
            index = i;
            updateSlides();
            resetTimer();
        });
        dotsContainer.appendChild(dot);

        slide.style.animationDuration = animationDuration;
        slide.addEventListener('click', () => {
            lightboxImg.src = slide.querySelector('img').src;
            lightbox.style.display = 'block';
            isPaused = true;
            resetTimer();
        });

    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        isPaused = false;
        resetTimer();
    });

    prevButton.addEventListener('click', () => {
        index--;
        if (index < 0) index = slides.length - 1;
        updateSlides();
        resetTimer();
    });


    nextButton.addEventListener('click', () => {
        index++;
        if (index === slides.length) index = 0;
        updateSlides();
        resetTimer();
    });

    slideshow.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    slideshow.addEventListener('mouseleave', () => {
        if (lightbox.style.display !== 'block') {
            isPaused = false;
            resetTimer();
        }
    });

    function resetTimer() {
        cancelAnimationFrame(animationFrameId);
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(step);
    }

    slides[index].classList.add('active');
    slides[index].classList.add('isAnimating');
    dotsContainer.children[index].classList.add('active');
    slides[index].style.animationName = animationType;

    function updateSlides() {
        slides[index].classList.add('active');
        slides[index].classList.add('isAnimating');
        dotsContainer.children[index].classList.add('active');
        slides[index].style.animationName = animationType;

        slides[index].addEventListener('animationend', function animationEndEvent() {
            console.log('called')
            slides[index].classList.remove('isAnimating');
            slides.forEach((slide, i) => {
                if (i !== index) {
                    slide.classList.remove('active');
                    dotsContainer.children[i].classList.remove('active');
                }
            });
            slides[index].removeEventListener('animationend', animationEndEvent);
        });
    }

    function step(timestamp) {

        if (!isPaused && timestamp - lastTime > time) {
            index++;
            if (index === slides.length) index = 0;

            updateSlides();
            lastTime = timestamp;
        }

        animationFrameId = requestAnimationFrame(step);
    }
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(step);
}