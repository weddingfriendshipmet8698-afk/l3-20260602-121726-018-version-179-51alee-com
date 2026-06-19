const menuButton = document.querySelector(".menu-toggle");
const mobilePanel = document.querySelector(".mobile-panel");

if (menuButton && mobilePanel) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    mobilePanel.hidden = expanded;
  });
}

const hero = document.querySelector("[data-hero]");

if (hero) {
  const slides = Array.from(hero.querySelectorAll(".hero-slide"));
  const dots = Array.from(hero.querySelectorAll(".hero-dot"));
  let current = 0;
  let timer = null;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  };

  const start = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(current + 1), 5200);
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.go || 0));
      start();
    });
  });

  showSlide(0);
  start();
}

const searchRoot = document.querySelector("[data-search-root]");

if (searchRoot) {
  const input = searchRoot.querySelector("[data-search-input]");
  const select = searchRoot.querySelector("[data-search-select]");
  const cards = Array.from(searchRoot.querySelectorAll(".movie-card"));
  const noResults = searchRoot.querySelector(".no-results");

  const normalize = (value) => String(value || "").trim().toLowerCase();

  const filterCards = () => {
    const query = normalize(input ? input.value : "");
    const year = select ? select.value : "";
    let shown = 0;

    cards.forEach((card) => {
      const haystack = normalize(`${card.dataset.title || ""} ${card.dataset.tags || ""}`);
      const matchQuery = !query || haystack.includes(query);
      const matchYear = !year || card.dataset.year === year;
      const visible = matchQuery && matchYear;
      card.hidden = !visible;
      if (visible) shown += 1;
    });

    if (noResults) {
      noResults.classList.toggle("show", shown === 0);
    }
  };

  if (input) input.addEventListener("input", filterCards);
  if (select) select.addEventListener("change", filterCards);
  filterCards();
}
