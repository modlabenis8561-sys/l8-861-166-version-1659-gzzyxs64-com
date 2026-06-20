(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-button]");
        var mobileMenu = document.querySelector("[data-mobile-menu]");

        if (menuButton && mobileMenu) {
            menuButton.addEventListener("click", function () {
                mobileMenu.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var activeIndex = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === activeIndex);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        }

        var filterInput = document.querySelector("[data-movie-filter]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
        var emptyState = document.querySelector("[data-empty-state]");

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilter() {
            if (!filterInput || !cards.length) {
                return;
            }

            var query = normalize(filterInput.value);
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.textContent);
                var matched = !query || text.indexOf(query) !== -1;
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visible === 0);
            }
        }

        if (filterInput) {
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q");

            if (initialQuery) {
                filterInput.value = initialQuery;
            }

            filterInput.addEventListener("input", applyFilter);
            applyFilter();
        }
    });
})();
