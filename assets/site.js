(function () {
  const data = Array.isArray(window.__SITE_SEARCH_DATA__) ? window.__SITE_SEARCH_DATA__ : [];

  document.querySelectorAll('[data-mobile-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const menu = document.querySelector('[data-mobile-menu]');
      if (menu) {
        menu.classList.toggle('open');
      }
    });
  });

  document.querySelectorAll('[data-site-search]').forEach((box) => {
    const input = box.querySelector('input');
    const panel = box.querySelector('[data-search-results]');
    if (!input || !panel) {
      return;
    }

    const render = () => {
      const query = input.value.trim().toLowerCase();
      panel.innerHTML = '';
      if (!query) {
        panel.classList.remove('active');
        return;
      }
      const results = data.filter((item) => item.text.includes(query)).slice(0, 10);
      results.forEach((item) => {
        const link = document.createElement('a');
        link.href = item.url;
        link.innerHTML = '<img src="' + item.cover + '" alt=""><span><strong>' + item.title + '</strong><small>' + item.meta + '</small></span>';
        panel.appendChild(link);
      });
      panel.classList.toggle('active', results.length > 0);
    };

    input.addEventListener('input', render);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const first = panel.querySelector('a');
        if (first) {
          event.preventDefault();
          window.location.href = first.href;
        }
      }
    });
    document.addEventListener('click', (event) => {
      if (!box.contains(event.target)) {
        panel.classList.remove('active');
      }
    });
  });

  document.querySelectorAll('[data-local-filter]').forEach((input) => {
    const scope = document.querySelector(input.getAttribute('data-local-filter')) || document;
    const cards = Array.from(scope.querySelectorAll('[data-card]'));
    const empty = scope.querySelector('[data-no-match]');
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      let shown = 0;
      cards.forEach((card) => {
        const text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-tags') || '') + ' ' + (card.getAttribute('data-year') || '') + ' ' + (card.getAttribute('data-region') || '')).toLowerCase();
        const visible = !query || text.includes(query);
        card.classList.toggle('hidden-card', !visible);
        if (visible) {
          shown += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('active', shown === 0);
      }
    });
  });

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let index = 0;
  const showSlide = (next) => {
    if (!slides.length) {
      return;
    }
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });
  if (slides.length > 1) {
    showSlide(0);
    setInterval(() => showSlide(index + 1), 5200);
  }
})();
