(function () {
  var players = document.querySelectorAll('[data-player]');

  players.forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.player-overlay');
    var link = video ? video.getAttribute('data-video') : '';
    var loaded = false;
    var engine = null;

    function loadVideo() {
      if (!video || !link || loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = link;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        engine = new window.Hls();
        engine.loadSource(link);
        engine.attachMedia(video);
        box._videoEngine = engine;
        return;
      }

      video.src = link;
    }

    function startVideo() {
      loadVideo();

      if (button) {
        button.classList.add('is-hidden');
      }

      if (video) {
        var playTask = video.play();
        if (playTask && typeof playTask.catch === 'function') {
          playTask.catch(function () {
            if (button) {
              button.classList.remove('is-hidden');
            }
          });
        }
      }
    }

    if (button) {
      button.addEventListener('click', startVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startVideo();
        }
      });
    }
  });
})();
