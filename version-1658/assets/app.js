(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var menu = document.querySelector('[data-nav-menu]');

    if (menuButton && menu) {
        menuButton.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    var searchInput = document.querySelector('[data-search]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    if (searchInput && cards.length) {
        searchInput.addEventListener('input', function () {
            var keyword = searchInput.value.trim().toLowerCase();
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search-text') || card.textContent || '').toLowerCase();
                var matched = !keyword || text.indexOf(keyword) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var prevButton = document.querySelector('[data-hero-prev]');
    var nextButton = document.querySelector('[data-hero-next]');
    var dotsWrap = document.querySelector('[data-hero-dots]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === current);
        });

        if (dotsWrap) {
            Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }
    }

    function startTimer() {
        if (timer || slides.length < 2) {
            return;
        }

        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    function resetTimer() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
        startTimer();
    }

    if (slides.length) {
        if (dotsWrap) {
            slides.forEach(function (_, index) {
                var dot = document.createElement('button');
                dot.className = 'hero-dot';
                dot.type = 'button';
                dot.setAttribute('aria-label', '切换焦点内容');
                dot.addEventListener('click', function () {
                    showSlide(index);
                    resetTimer();
                });
                dotsWrap.appendChild(dot);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', function () {
                showSlide(current - 1);
                resetTimer();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', function () {
                showSlide(current + 1);
                resetTimer();
            });
        }

        showSlide(0);
        startTimer();
    }
}());
