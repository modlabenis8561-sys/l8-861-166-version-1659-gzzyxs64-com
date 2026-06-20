(function () {
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
      document.body.classList.toggle('is-locked', mobilePanel.classList.contains('is-open'));
    });
  }

  var searchForms = document.querySelectorAll('[data-search-form]');
  searchForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      var url = './search.html';
      if (value) {
        url += '?q=' + encodeURIComponent(value);
      }
      window.location.href = url;
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var nextIndex = Number(dot.getAttribute('data-hero-dot') || 0);
        showSlide(nextIndex);
      });
    });

    window.setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  var filterPanels = document.querySelectorAll('[data-local-filter]');
  filterPanels.forEach(function (panel) {
    var keywordInput = panel.querySelector('[data-filter-keyword]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var countLabel = panel.querySelector('[data-filter-count]');
    var params = new URLSearchParams(window.location.search);
    var initialKeyword = params.get('q') || '';
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    if (keywordInput && initialKeyword) {
      keywordInput.value = initialKeyword;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
      var keyword = normalize(keywordInput ? keywordInput.value : '');
      var type = normalize(typeSelect ? typeSelect.value : '');
      var year = normalize(yearSelect ? yearSelect.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-type'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-category')
        ].join(' ').toLowerCase();
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchType = !type || normalize(card.getAttribute('data-type')) === type;
        var matchYear = !year || normalize(card.getAttribute('data-year')) === year;
        var show = matchKeyword && matchType && matchYear;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible += 1;
        }
      });

      if (countLabel) {
        countLabel.textContent = visible ? '找到 ' + visible + ' 部影片' : '暂无匹配影片';
      }
    }

    [keywordInput, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  });
})();
