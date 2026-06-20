
(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img[data-soft-image]').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('is-missing');
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-site-search]');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-key]'));

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applySearch() {
    var query = normalize(searchInput ? searchInput.value : '');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-item'));

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.textContent
      ].join(' '));
      var match = !query || haystack.indexOf(query) !== -1;
      card.classList.toggle('is-hidden', !match);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applySearch);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (item) {
        item.classList.remove('is-active');
      });
      button.classList.add('is-active');
      if (searchInput && button.getAttribute('data-filter-key') !== 'all') {
        searchInput.value = button.textContent.trim();
      }
      if (searchInput && button.getAttribute('data-filter-key') === 'all') {
        searchInput.value = '';
      }
      applySearch();
    });
  });

  function mountVideo(video, source, playButton) {
    if (!video || !source) {
      return;
    }

    if (playButton) {
      playButton.classList.add('is-hidden');
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (video._hlsPlayer) {
        video._hlsPlayer.destroy();
      }
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      video._hlsPlayer = hls;
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        video.play().catch(function () {});
      }, { once: true });
      return;
    }

    video.src = source;
    video.play().catch(function () {});
  }

  document.querySelectorAll('[data-player-shell]').forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var source = (button && button.getAttribute('data-video-src')) || (video && video.getAttribute('data-video-src'));

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        mountVideo(video, source, button);
      });
    }

    shell.addEventListener('click', function (event) {
      if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'video') {
        return;
      }
      if (button && !button.classList.contains('is-hidden')) {
        mountVideo(video, source, button);
      }
    });
  });
})();
