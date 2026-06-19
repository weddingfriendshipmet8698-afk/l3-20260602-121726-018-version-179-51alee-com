(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var index = 0;
        if (slides.length > 1) {
            window.setInterval(function () {
                slides[index].classList.remove('is-active');
                index = (index + 1) % slides.length;
                slides[index].classList.add('is-active');
            }, 3800);
        }
    }

    var searchInput = document.querySelector('[data-card-search]');
    var list = document.querySelector('[data-card-list]');

    function normalize(value) {
        return (value || '').toString().toLowerCase().replace(/\s+/g, '');
    }

    if (searchInput && list) {
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
        searchInput.addEventListener('input', function () {
            var keyword = normalize(searchInput.value);
            cards.forEach(function (card) {
                var text = normalize(card.innerText + ' ' + card.getAttribute('data-title') + ' ' + card.getAttribute('data-year') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-genre'));
                card.style.display = !keyword || text.indexOf(keyword) !== -1 ? '' : 'none';
            });
        });
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && searchInput) {
        searchInput.value = q;
        searchInput.dispatchEvent(new Event('input'));
    }
})();
