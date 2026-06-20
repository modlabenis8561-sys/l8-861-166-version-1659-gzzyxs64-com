(function () {
  var panel = document.querySelector('[data-mobile-panel]');
  var toggle = document.querySelector('[data-menu-toggle]');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);
    showSlide(0);
    startTimer();
  }

  var searchItems = Array.isArray(globalThis.BKGJ_SEARCH_DATA) ? globalThis.BKGJ_SEARCH_DATA : [];
  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function buildItem(item) {
    var link = document.createElement('a');
    link.className = 'search-item';
    link.href = './' + item.url;

    var img = document.createElement('img');
    img.src = item.cover;
    img.alt = item.title;
    img.loading = 'lazy';

    var box = document.createElement('div');
    var title = document.createElement('strong');
    title.textContent = item.title;
    var meta = document.createElement('span');
    meta.textContent = [item.year, item.region, item.genre].filter(Boolean).join(' · ');
    var summary = document.createElement('span');
    summary.textContent = item.summary || item.type || '';

    box.appendChild(title);
    box.appendChild(meta);
    box.appendChild(document.createElement('br'));
    box.appendChild(summary);
    link.appendChild(img);
    link.appendChild(box);
    return link;
  }

  function renderSearch(input, results) {
    var query = normalize(input.value);
    results.innerHTML = '';
    if (!query) {
      results.classList.remove('open');
      return;
    }

    var matched = searchItems.filter(function (item) {
      var haystack = normalize([
        item.title,
        item.year,
        item.region,
        item.type,
        item.genre,
        item.tags,
        item.summary
      ].join(' '));
      return haystack.indexOf(query) !== -1;
    }).slice(0, 12);

    if (!matched.length) {
      var empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.textContent = '没有找到匹配影片';
      results.appendChild(empty);
    } else {
      matched.forEach(function (item) {
        results.appendChild(buildItem(item));
      });
    }

    results.classList.add('open');
  }

  forms.forEach(function (form) {
    var input = form.querySelector('[data-search-input]');
    var results = form.querySelector('[data-search-results]');
    if (!input || !results) {
      return;
    }

    input.addEventListener('input', function () {
      renderSearch(input, results);
    });

    input.addEventListener('focus', function () {
      renderSearch(input, results);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      renderSearch(input, results);
      var first = results.querySelector('a');
      if (first) {
        window.location.href = first.getAttribute('href');
      }
    });
  });

  document.addEventListener('click', function (event) {
    forms.forEach(function (form) {
      if (!form.contains(event.target)) {
        var results = form.querySelector('[data-search-results]');
        if (results) {
          results.classList.remove('open');
        }
      }
    });
  });

  function bootPlayer(box) {
    var video = box.querySelector('video');
    var overlay = box.querySelector('.play-overlay');
    var streamUrl = box.getAttribute('data-stream');
    if (!video || !streamUrl) {
      return;
    }

    if (!box.getAttribute('data-ready')) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (globalThis.Hls && globalThis.Hls.isSupported()) {
        var hls = new globalThis.Hls({ enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        box.hls = hls;
      } else {
        video.src = streamUrl;
      }
      box.setAttribute('data-ready', '1');
    }

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(function (box) {
    var overlay = box.querySelector('.play-overlay');
    var video = box.querySelector('video');

    if (overlay) {
      overlay.addEventListener('click', function () {
        bootPlayer(box);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          bootPlayer(box);
        }
      });
    }
  });
})();
