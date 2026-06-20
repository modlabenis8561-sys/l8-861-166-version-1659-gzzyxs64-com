(function () {
    function initializePlayer(url) {
        var video = document.getElementById("movie-player");
        var cover = document.querySelector("[data-player-cover]");
        var button = document.querySelector("[data-player-button]");
        var loaded = false;
        var hls = null;

        function loadVideo() {
            if (loaded || !video || !url) {
                return;
            }

            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
        }

        function startVideo() {
            loadVideo();

            if (cover) {
                cover.classList.add("is-hidden");
            }

            if (video) {
                var promise = video.play();

                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {});
                }
            }
        }

        if (button) {
            button.addEventListener("click", startVideo);
        }

        if (cover) {
            cover.addEventListener("click", startVideo);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    startVideo();
                }
            });
        }

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.initializePlayer = initializePlayer;
})();
