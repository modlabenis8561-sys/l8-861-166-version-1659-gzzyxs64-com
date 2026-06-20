document.addEventListener('DOMContentLoaded', function() {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        var prev = document.querySelector('[data-hero-prev]');
        var next = document.querySelector('[data-hero-next]');
        var activeIndex = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === activeIndex);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === activeIndex);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function() {
                showSlide(activeIndex + 1);
            }, 5200);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener('click', function() {
                showSlide(dotIndex);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function() {
                showSlide(activeIndex - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function() {
                showSlide(activeIndex + 1);
                startTimer();
            });
        }

        slider.addEventListener('mouseenter', stopTimer);
        slider.addEventListener('mouseleave', startTimer);
        showSlide(0);
        startTimer();
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.site-search'));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));

    function applySearch() {
        var query = searchInputs.map(function(input) {
            return input.value.trim().toLowerCase();
        }).filter(Boolean).join(' ');
        var activeButton = document.querySelector('.filter-btn.active');
        var filter = activeButton ? activeButton.getAttribute('data-filter') : 'all';
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .ranking-row'));

        cards.forEach(function(card) {
            var haystack = ((card.getAttribute('data-search') || card.textContent || '') + ' ' + (card.getAttribute('data-title') || '')).toLowerCase();
            var matchesQuery = !query || haystack.indexOf(query) !== -1;
            var matchesFilter = filter === 'all' || haystack.indexOf(filter.toLowerCase()) !== -1;
            card.classList.toggle('is-hidden', !(matchesQuery && matchesFilter));
        });
    }

    searchInputs.forEach(function(input) {
        input.addEventListener('input', applySearch);
    });

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            filterButtons.forEach(function(otherButton) {
                otherButton.classList.remove('active');
            });
            button.classList.add('active');
            applySearch();
        });
    });
});
