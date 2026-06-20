(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function attachSource(video, source, shell) {
    if (!source || shell.getAttribute("data-ready") === "1") {
      return;
    }
    var Hls = window.Hls;
    if (Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      shell.hlsInstance = hls;
    } else {
      video.src = source;
    }
    shell.setAttribute("data-ready", "1");
  }

  function setupPlayer(shell) {
    var video = shell.querySelector("video");
    var button = shell.querySelector("[data-play-button]");
    if (!video || !button) {
      return;
    }
    var source = video.getAttribute("data-src") || "";

    function play() {
      attachSource(video, source, shell);
      button.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    button.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (shell.getAttribute("data-ready") !== "1") {
        play();
      }
    });
  }

  onReady(function () {
    document.querySelectorAll("[data-player]").forEach(setupPlayer);
  });
})();
