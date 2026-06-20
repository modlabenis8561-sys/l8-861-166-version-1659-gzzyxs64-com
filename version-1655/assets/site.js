(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("is-open");
            });
        }

        var carousel = document.querySelector("[data-carousel]");
        if (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
            var prev = carousel.querySelector(".hero-prev");
            var next = carousel.querySelector(".hero-next");
            var index = 0;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === index);
                });
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(index - 1);
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(index + 1);
                });
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                });
            });

            window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        var filterForm = document.querySelector("[data-page-filter]");
        if (filterForm) {
            var input = filterForm.querySelector("input");
            var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-grid .movie-card"));
            var params = new URLSearchParams(window.location.search);
            var initial = params.get("q") || "";

            function applyFilter() {
                var keyword = (input.value || "").trim().toLowerCase();
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags"),
                        card.textContent
                    ].join(" ").toLowerCase();
                    card.classList.toggle("is-hidden", keyword && haystack.indexOf(keyword) === -1);
                });
            }

            if (input) {
                input.value = initial;
                input.addEventListener("input", applyFilter);
                filterForm.addEventListener("submit", function (event) {
                    event.preventDefault();
                    applyFilter();
                });
                applyFilter();
            }
        }
    });
})();
