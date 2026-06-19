(function () {
  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var $$ = function (selector, scope) {
    return Array.prototype.slice.call(
      (scope || document).querySelectorAll(selector),
    );
  };

  function initMenu() {
    var toggle = $("[data-nav-toggle]");
    var nav = $("[data-main-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = $("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = $$("[data-hero-slide]", hero);
    var dots = $$("[data-hero-dot]", hero);
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
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

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  function initFilters() {
    var forms = $$("[data-filter-form]");
    forms.forEach(function (form) {
      var scope = form.closest("section") || document;
      var cards = $$("[data-card]", scope);
      var queryInput = $("[data-filter-query]", form);
      var yearSelect = $("[data-filter-year]", form);
      var regionSelect = $("[data-filter-region]", form);
      var typeSelect = $("[data-filter-type]", form);
      var empty = $("[data-empty-state]", scope);
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q") || "";

      if (queryInput && initialQuery) {
        queryInput.value = initialQuery;
      }

      function normalize(value) {
        return String(value || "")
          .trim()
          .toLowerCase();
      }

      function apply() {
        var q = normalize(queryInput && queryInput.value);
        var year = normalize(yearSelect && yearSelect.value);
        var region = normalize(regionSelect && regionSelect.value);
        var type = normalize(typeSelect && typeSelect.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize(
            [
              card.dataset.title,
              card.dataset.region,
              card.dataset.year,
              card.dataset.type,
              card.dataset.tags,
            ].join(" "),
          );
          var ok = true;
          if (q && haystack.indexOf(q) === -1) {
            ok = false;
          }
          if (year && normalize(card.dataset.year) !== year) {
            ok = false;
          }
          if (region && normalize(card.dataset.region) !== region) {
            ok = false;
          }
          if (type && normalize(card.dataset.type) !== type) {
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

      ["input", "change"].forEach(function (eventName) {
        form.addEventListener(eventName, apply);
      });
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        apply();
      });
      apply();
    });
  }

  function initPlayers() {
    $$("[data-player]").forEach(function (box) {
      var video = $("video", box);
      var overlay = $(".play-overlay", box);
      var mediaUrl = box.getAttribute("data-media");
      var loaded = false;
      var hlsInstance = null;

      if (!video || !overlay || !mediaUrl) {
        return;
      }

      function attach() {
        if (loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = mediaUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsInstance.loadSource(mediaUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = mediaUrl;
        }
      }

      function play() {
        attach();
        overlay.classList.add("is-hidden");
        var result = video.play();
        if (result && result.catch) {
          result.catch(function () {
            overlay.classList.remove("is-hidden");
          });
        }
      }

      overlay.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (!loaded || video.paused) {
          play();
        } else {
          video.pause();
        }
      });
      video.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
      });
      video.addEventListener("pause", function () {
        if (video.currentTime === 0 || video.ended) {
          overlay.classList.remove("is-hidden");
        }
      });
      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  initMenu();
  initHero();
  initFilters();
  initPlayers();
})();
