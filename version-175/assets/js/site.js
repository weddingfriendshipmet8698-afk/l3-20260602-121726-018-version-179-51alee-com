(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  ready(function () {
    setupNavigation();
    setupHeroSlider();
    setupFilters();
    setupPlayer();
    setupBackToTop();
  });

  function setupNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-main-nav]");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHeroSlider() {
    var slider = document.querySelector("[data-hero-slider]");

    if (!slider) {
      return;
    }

    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

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
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    show(0);
    start();
  }

  function setupFilters() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));

    forms.forEach(function (form) {
      var input = form.querySelector("[data-filter-input]");
      var year = form.querySelector("[data-year-filter]");
      var type = form.querySelector("[data-type-filter]");
      var category = form.querySelector("[data-category-filter]");
      var scope = document.querySelector(form.getAttribute("data-filter-target") || "[data-filter-scope]") || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
      var count = document.querySelector("[data-result-count]");
      var empty = document.querySelector("[data-no-results]");
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q");

      if (input && initialQuery) {
        input.value = initialQuery;
      }

      function apply(event) {
        if (event) {
          event.preventDefault();
        }

        var query = normalize(input && input.value);
        var yearValue = normalize(year && year.value);
        var typeValue = normalize(type && type.value);
        var categoryValue = normalize(category && category.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute("data-search"));
          var cardYear = normalize(card.getAttribute("data-year"));
          var cardType = normalize(card.getAttribute("data-type"));
          var cardCategory = normalize(card.getAttribute("data-category"));

          var matched = true;

          if (query && haystack.indexOf(query) === -1) {
            matched = false;
          }

          if (yearValue && cardYear !== yearValue) {
            matched = false;
          }

          if (typeValue && cardType !== typeValue) {
            matched = false;
          }

          if (categoryValue && cardCategory !== categoryValue) {
            matched = false;
          }

          card.style.display = matched ? "" : "none";

          if (matched) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = "当前显示 " + visible + " 部影片";
        }

        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      form.addEventListener("submit", apply);

      [input, year, type, category].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });

      apply();
    });
  }

  function setupPlayer() {
    var video = document.querySelector("[data-hls-player]");

    if (!video) {
      return;
    }

    var source = video.getAttribute("data-src");
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-player-play]"));
    var status = document.querySelector("[data-player-status]");
    var initialized = false;
    var hlsInstance = null;

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function hideOverlay() {
      buttons.forEach(function (button) {
        button.style.display = "none";
      });
    }

    function initialize() {
      if (initialized || !source) {
        return true;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        initialized = true;
        return true;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });

        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            setStatus("网络加载中断，播放器正在尝试恢复。可稍后再次点击播放。 ");
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            setStatus("媒体解码出现波动，播放器正在恢复。 ");
            hlsInstance.recoverMediaError();
          } else {
            setStatus("当前浏览器暂时无法播放该视频源。 ");
            hlsInstance.destroy();
          }
        });

        initialized = true;
        return true;
      }

      setStatus("当前浏览器不支持 HLS 播放，请使用 Safari、Chrome、Edge 或移动端浏览器访问。 ");
      return false;
    }

    function play() {
      if (!initialize()) {
        return;
      }

      setStatus("视频源已绑定，正在加载播放。 ");
      hideOverlay();

      var promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          setStatus("浏览器需要再次点击播放按钮以开始播放。 ");
          buttons.forEach(function (button) {
            button.style.display = "inline-flex";
          });
        });
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", play);
    });

    video.addEventListener("play", function () {
      setStatus("正在播放：HLS 高清视频源。 ");
      hideOverlay();
    });

    video.addEventListener("pause", function () {
      setStatus("播放已暂停，可点击播放器继续观看。 ");
    });
  }

  function setupBackToTop() {
    var button = document.querySelector("[data-back-to-top]");

    if (!button) {
      return;
    }

    window.addEventListener("scroll", function () {
      button.classList.toggle("is-visible", window.scrollY > 600);
    });

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
})();
