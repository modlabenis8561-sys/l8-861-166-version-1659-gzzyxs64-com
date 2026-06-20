(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var menuButton = qs('.menu-toggle');
    var mobilePanel = qs('.mobile-panel');
    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            var open = mobilePanel.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    qsa('[data-hero]').forEach(function (hero) {
        var slides = qsa('.hero-slide', hero);
        var dots = qsa('.hero-dot', hero);
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide') || 0));
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    });

    qsa('[data-list]').forEach(function (list) {
        var input = qs('[data-list-search]');
        var yearSelect = qs('[data-year-filter]');
        var regionSelect = qs('[data-region-filter]');
        var cards = qsa('.movie-card', list);
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';
        if (input && q) {
            input.value = q;
        }

        function applyFilter() {
            var text = input ? input.value.trim().toLowerCase() : '';
            var year = yearSelect ? yearSelect.value : '';
            var region = regionSelect ? regionSelect.value : '';
            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                var cardYear = card.getAttribute('data-year') || '';
                var cardRegion = card.getAttribute('data-region') || '';
                var matched = true;
                if (text && haystack.indexOf(text) === -1) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }
                if (region && cardRegion !== region) {
                    matched = false;
                }
                card.classList.toggle('is-hidden', !matched);
            });
        }

        [input, yearSelect, regionSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });
        applyFilter();
    });

    qsa('.player-shell').forEach(function (shell) {
        var video = qs('video', shell);
        var button = qs('.play-overlay', shell);
        if (!video) {
            return;
        }
        var source = qs('source', video);
        var url = shell.getAttribute('data-video') || (source ? source.getAttribute('src') : '');
        var ready = false;
        var hls = null;

        function attach() {
            if (ready || !url) {
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    maxBufferLength: 45,
                    enableWorker: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
        }

        function playVideo() {
            attach();
            var promise = video.play();
            shell.classList.add('is-playing');
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    shell.classList.remove('is-playing');
                });
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }
        video.addEventListener('play', function () {
            shell.classList.add('is-playing');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                shell.classList.remove('is-playing');
            }
        });
        video.addEventListener('ended', function () {
            shell.classList.remove('is-playing');
        });
        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
