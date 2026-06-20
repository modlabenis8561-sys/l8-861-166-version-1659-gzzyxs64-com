(function () {
    "use strict";

    document.documentElement.classList.add("js-enabled");

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function buildFallbackSvg(title) {
        var safeTitle = (title || "高清影视").slice(0, 18);
        var svg = [
            '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">',
            '<defs>',
            '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
            '<stop offset="0" stop-color="#98D8C8"/>',
            '<stop offset="0.55" stop-color="#7BC8B4"/>',
            '<stop offset="1" stop-color="#F7A8B8"/>',
            '</linearGradient>',
            '</defs>',
            '<rect width="900" height="1200" rx="48" fill="url(#g)"/>',
            '<circle cx="450" cy="430" r="118" fill="rgba(255,255,255,0.24)"/>',
            '<polygon points="420,370 420,490 520,430" fill="white" opacity="0.92"/>',
            '<text x="450" y="700" text-anchor="middle" font-family="Microsoft YaHei,Arial" font-size="58" font-weight="700" fill="white">',
            safeTitle.replace(/[&<>]/g, ""),
            '</text>',
            '<text x="450" y="770" text-anchor="middle" font-family="Arial" font-size="28" fill="rgba(255,255,255,0.82)">高清剧集大全</text>',
            '</svg>'
        ].join("");
        return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    }

    function setupImageFallbacks() {
        document.querySelectorAll("img[data-fallback-title]").forEach(function (image) {
            image.addEventListener("error", function () {
                if (image.dataset.fallbackApplied === "true") {
                    return;
                }
                image.dataset.fallbackApplied = "true";
                image.src = buildFallbackSvg(image.dataset.fallbackTitle || image.alt);
            });
        });
    }

    function setupMobileNavigation() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupSearchForms() {
        document.querySelectorAll("[data-search-form]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var query = input ? input.value.trim() : "";
                var target = form.getAttribute("action") || "search.html";
                window.location.href = target + (query ? "?q=" + encodeURIComponent(query) : "");
            });
        });
    }

    function setupHeroSlider() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        if (slides.length === 0) {
            return;
        }
        var current = 0;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
            });
        });

        show(0);
        window.setInterval(function () {
            show(current + 1);
        }, 5200);
    }

    function setupSearchPage() {
        var page = document.querySelector("[data-search-page]");
        if (!page) {
            return;
        }
        var input = page.querySelector("[data-search-input]");
        var region = page.querySelector("[data-search-region]");
        var type = page.querySelector("[data-search-type]");
        var sort = page.querySelector("[data-search-sort]");
        var results = page.querySelector("[data-search-results]");
        var count = page.querySelector("[data-result-count]");
        var cards = Array.prototype.slice.call(page.querySelectorAll("[data-movie-card]"));
        var params = new URLSearchParams(window.location.search);
        var queryFromUrl = params.get("q") || "";

        if (input && queryFromUrl) {
            input.value = queryFromUrl;
        }

        function getText(card) {
            return [
                card.dataset.title,
                card.dataset.region,
                card.dataset.type,
                card.dataset.genre,
                card.textContent
            ].join(" ").toLowerCase();
        }

        function applyFilters() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var regionValue = region ? region.value : "";
            var typeValue = type ? type.value : "";
            var visibleCards = cards.filter(function (card) {
                var matchesQuery = !query || getText(card).indexOf(query) !== -1;
                var matchesRegion = !regionValue || card.dataset.region === regionValue;
                var matchesType = !typeValue || card.dataset.type === typeValue;
                return matchesQuery && matchesRegion && matchesType;
            });

            if (sort && sort.value !== "default") {
                visibleCards.sort(function (a, b) {
                    var key = sort.value;
                    return Number(b.dataset[key] || 0) - Number(a.dataset[key] || 0);
                });
            }

            cards.forEach(function (card) {
                card.hidden = true;
            });
            visibleCards.forEach(function (card) {
                card.hidden = false;
                results.appendChild(card);
            });
            if (count) {
                count.textContent = "共 " + visibleCards.length + " 部影片";
            }
        }

        [input, region, type, sort].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });

        applyFilters();
    }

    function setupActionButtons() {
        document.querySelectorAll("[data-like-button], [data-favorite-button]").forEach(function (button) {
            button.addEventListener("click", function () {
                button.classList.toggle("is-active");
                button.textContent = button.classList.contains("is-active") ? "已记录" : button.textContent.replace("已记录", "收藏");
            });
        });

        document.querySelectorAll("[data-share-button]").forEach(function (button) {
            button.addEventListener("click", function () {
                if (navigator.share) {
                    navigator.share({ title: document.title, url: window.location.href }).catch(function () {});
                } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href).then(function () {
                        button.textContent = "链接已复制";
                    });
                }
            });
        });
    }

    ready(function () {
        setupImageFallbacks();
        setupMobileNavigation();
        setupSearchForms();
        setupHeroSlider();
        setupSearchPage();
        setupActionButtons();
    });
})();
