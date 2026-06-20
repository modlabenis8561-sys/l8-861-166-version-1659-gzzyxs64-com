(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-site-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle("is-active", position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle("is-active", position === index);
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
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  function setupFilters() {
    var params = new URLSearchParams(window.location.search);
    var queryFromUrl = params.get("q") || "";
    document.querySelectorAll("[data-filter-root]").forEach(function (root) {
      var search = root.querySelector("[data-filter-search]");
      var category = root.querySelector("[data-filter-category]");
      var genre = root.querySelector("[data-filter-genre]");
      var year = root.querySelector("[data-filter-year]");
      var type = root.querySelector("[data-filter-type]");
      var list = root.querySelector("[data-filter-list]");
      var empty = root.querySelector("[data-empty-state]");
      if (!list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll("[data-movie-card]"));
      if (search && queryFromUrl) {
        search.value = queryFromUrl;
      }

      function valueOf(field) {
        return field ? field.value.trim().toLowerCase() : "";
      }

      function apply() {
        var query = valueOf(search);
        var selectedCategory = valueOf(category);
        var selectedGenre = valueOf(genre);
        var selectedYear = valueOf(year);
        var selectedType = valueOf(type);
        var visible = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var ok = true;
          if (query && text.indexOf(query) === -1) {
            ok = false;
          }
          if (selectedCategory && (card.getAttribute("data-category") || "").toLowerCase() !== selectedCategory) {
            ok = false;
          }
          if (selectedGenre && (card.getAttribute("data-genre") || "").toLowerCase().indexOf(selectedGenre) === -1) {
            ok = false;
          }
          if (selectedYear && (card.getAttribute("data-year") || "").toLowerCase() !== selectedYear) {
            ok = false;
          }
          if (selectedType && (card.getAttribute("data-type") || "").toLowerCase() !== selectedType) {
            ok = false;
          }
          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [search, category, genre, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  onReady(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
