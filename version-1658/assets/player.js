(function () {
    var video = document.getElementById('moviePlayer');
    var button = document.getElementById('playButton');

    if (!video || !button) {
        return;
    }

    var streamUrl = button.getAttribute('data-stream');
    var hlsInstance = null;
    var initialized = false;

    function bindPlayer() {
        if (initialized) {
            return;
        }

        initialized = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }

    function startPlayback() {
        bindPlayer();
        button.classList.add('is-hidden');
        var playRequest = video.play();

        if (playRequest && typeof playRequest.catch === 'function') {
            playRequest.catch(function () {
                button.classList.remove('is-hidden');
            });
        }
    }

    button.addEventListener('click', startPlayback);

    video.addEventListener('click', function () {
        if (!initialized || video.paused) {
            startPlayback();
        }
    });

    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
            button.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}());
