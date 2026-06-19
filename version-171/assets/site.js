(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(parseInt(dot.getAttribute('data-hero-dot'), 10));
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  function setupFilters(scope) {
    var textInput = scope.querySelector('[data-filter-text]');
    var yearSelect = scope.querySelector('[data-filter-year]');
    var groupSelect = scope.querySelector('[data-filter-group]');
    var categorySelect = scope.querySelector('[data-filter-category]');
    var list = document.querySelector('[data-filter-list]');

    if (!list) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

    function applyFilter() {
      var text = textInput ? textInput.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var group = groupSelect ? groupSelect.value : '';
      var category = categorySelect ? categorySelect.value : '';

      cards.forEach(function (card) {
        var haystack = card.textContent.toLowerCase();
        var matchedText = !text || haystack.indexOf(text) !== -1;
        var matchedYear = !year || card.getAttribute('data-year') === year;
        var matchedGroup = !group || card.getAttribute('data-group') === group;
        var matchedCategory = !category || card.getAttribute('data-category') === category;
        card.classList.toggle('is-hidden', !(matchedText && matchedYear && matchedGroup && matchedCategory));
      });
    }

    [textInput, yearSelect, groupSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  }

  var filterScope = document.querySelector('[data-filter-scope]');

  if (filterScope) {
    setupFilters(filterScope);
  }

  var globalSearch = document.querySelector('[data-global-search]');
  var searchResults = document.querySelector('[data-search-results]');
  var resultTitle = document.querySelector('[data-result-title]');

  function movieCard(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="details/movie-' + movie.id + '.html">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="score-badge">' + movie.score + '</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="movie-meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.categoryName) + '</span></div>',
      '    <h3><a href="details/movie-' + movie.id + '.html">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="card-tags"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.group) + '</span></div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function runSearch(query) {
    if (!searchResults || !window.MOVIE_SEARCH_DATA) {
      return;
    }

    var q = String(query || '').trim().toLowerCase();
    var data = window.MOVIE_SEARCH_DATA;
    var results = q
      ? data.filter(function (movie) {
          return movie.searchText.indexOf(q) !== -1;
        }).slice(0, 120)
      : data.slice(0, 60);

    searchResults.innerHTML = results.map(movieCard).join('');

    if (resultTitle) {
      resultTitle.textContent = q ? '搜索结果：' + results.length + ' 部' : '热门推荐';
    }
  }

  if (globalSearch) {
    var input = globalSearch.querySelector('input[name="q"]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    if (input) {
      input.value = initial;
      input.addEventListener('input', function () {
        runSearch(input.value);
      });
    }

    globalSearch.addEventListener('submit', function (event) {
      event.preventDefault();
      runSearch(input ? input.value : '');
    });

    if (initial) {
      runSearch(initial);
    }
  }
})();
