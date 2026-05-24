/**
 * ANIMATION MANAGER
 * Управляет анимациями при скролле и счётчиком цифр.
 */

const AnimationManager = (() => {
  /* ================================================
     SCROLL ANIMATIONS
     Наблюдаем за элементами с классом .anim
     ================================================ */

  function initScrollAnimations() {
    const elements = document.querySelectorAll(".anim");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("anim--visible");

          // Отключаем наблюдение — анимация одноразовая
          observer.unobserve(entry.target);
        });
      },
      {
        // Элемент считается видимым когда 15% его площади в viewport
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ================================================
     СЧЁТЧИК ЦИФР
     Анимирует числа от 0 до целевого значения
     ================================================ */

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1800; // мс
    const start = performance.now();

    // Функция плавности — замедляется к концу
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(eased * target);

      // Форматируем число с разделителем тысяч
      el.textContent = current.toLocaleString("ru-RU");

      // Лёгкий скейл при каждом обновлении
      el.classList.add("about__stat-value--tick");
      setTimeout(() => el.classList.remove("about__stat-value--tick"), 80);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Финальное значение — без округления
        el.textContent = target.toLocaleString("ru-RU");
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);

          // Запускаем счётчик только один раз
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /* ================================================
     ИНИЦИАЛИЗАЦИЯ
     ================================================ */

  function init() {
    initScrollAnimations();
    initCounters();
  }

  return { init };
})();
