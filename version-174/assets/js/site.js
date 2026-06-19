(function () {
  const navButton = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-main-nav]');

  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  const nextButton = document.querySelector('[data-hero-next]');
  const prevButton = document.querySelector('[data-hero-prev]');
  let currentSlide = 0;

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

  if (slides.length) {
    showSlide(0);

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(currentSlide + 1);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(currentSlide - 1);
      });
    }

    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5600);
  }

  const filterBox = document.querySelector('[data-filter-box]');

  if (filterBox) {
    const keywordInput = filterBox.querySelector('[data-filter-keyword]');
    const yearSelect = filterBox.querySelector('[data-filter-year]');
    const typeSelect = filterBox.querySelector('[data-filter-type]');
    const regionSelect = filterBox.querySelector('[data-filter-region]');
    const cards = Array.from(document.querySelectorAll('[data-title]'));
    const empty = document.querySelector('[data-empty-state]');

    function applyFilters() {
      const keyword = (keywordInput ? keywordInput.value : '').trim().toLowerCase();
      const year = yearSelect ? yearSelect.value : '';
      const type = typeSelect ? typeSelect.value : '';
      const region = regionSelect ? regionSelect.value : '';
      let visibleCount = 0;

      cards.forEach(function (card) {
        const text = [
          card.dataset.title,
          card.dataset.year,
          card.dataset.type,
          card.dataset.region,
          card.dataset.genre
        ].join(' ').toLowerCase();

        const matchKeyword = !keyword || text.includes(keyword);
        const matchYear = !year || card.dataset.year === year;
        const matchType = !type || (card.dataset.type || '').includes(type);
        const matchRegion = !region || (card.dataset.region || '').includes(region);
        const matched = matchKeyword && matchYear && matchType && matchRegion;

        card.classList.toggle('is-hidden', !matched);

        if (matched) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-hidden', visibleCount !== 0);
      }
    }

    [keywordInput, yearSelect, typeSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
  }
})();
