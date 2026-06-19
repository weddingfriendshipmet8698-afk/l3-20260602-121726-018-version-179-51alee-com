(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var active = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, idx) {
      slide.classList.toggle('active', idx === active);
    });
    dots.forEach(function (dot, idx) {
      dot.classList.toggle('active', idx === active);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        showSlide(idx);
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(active - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showSlide(active + 1);
      });
    }
    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  var searchInput = document.getElementById('pageSearch');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-grid .movie-card'));
  var resultCount = document.getElementById('resultCount');
  var regionValue = '';
  var typeValue = '';

  function queryFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function refreshCards() {
    if (!cards.length) {
      return;
    }
    var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var visible = 0;
    cards.forEach(function (card) {
      var haystack = [
        card.dataset.title || '',
        card.dataset.year || '',
        card.dataset.category || '',
        card.dataset.tags || '',
        card.textContent || ''
      ].join(' ').toLowerCase();
      var matchQuery = !q || haystack.indexOf(q) !== -1;
      var matchRegion = !regionValue || haystack.indexOf(regionValue.toLowerCase()) !== -1;
      var matchType = !typeValue || haystack.indexOf(typeValue.toLowerCase()) !== -1;
      var show = matchQuery && matchRegion && matchType;
      card.style.display = show ? '' : 'none';
      if (show) {
        visible += 1;
      }
    });
    if (resultCount) {
      resultCount.textContent = '共 ' + visible + ' 部影片';
    }
  }

  if (searchInput) {
    var q = queryFromUrl();
    if (q) {
      searchInput.value = q;
    }
    searchInput.addEventListener('input', refreshCards);
    refreshCards();
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-filter-region]')).forEach(function (button) {
    button.addEventListener('click', function () {
      regionValue = button.dataset.filterRegion || '';
      Array.prototype.slice.call(document.querySelectorAll('[data-filter-region]')).forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      refreshCards();
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-filter-type]')).forEach(function (button) {
    button.addEventListener('click', function () {
      typeValue = button.dataset.filterType || '';
      Array.prototype.slice.call(document.querySelectorAll('[data-filter-type]')).forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      refreshCards();
    });
  });
})();
