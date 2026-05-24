/**
 * SLIDER MANAGER
 * Слайдер карточек туров.
 *
 * Возможности:
 * — Кнопки prev/next
 * — Dots навигация
 * — Drag (мышь) и Swipe (тач)
 * — Автопрокрутка с паузой при hover
 * — Адаптивное количество видимых карточек
 */

const SliderManager = (() => {
  // ===== КОНФИГУРАЦИЯ =====
  const CONFIG = {
    autoplayDelay: 4000, // мс между слайдами
    dragThreshold: 50, // px — минимум для засчитывания свайпа
    transitionMs: 500, // мс — длительность анимации
  };

  function init() {
    const slider = document.getElementById("toursSlider");
    if (!slider) return;

    const track = document.getElementById("sliderTrack");
    const prevBtn = document.getElementById("sliderPrev");
    const nextBtn = document.getElementById("sliderNext");
    const dotsWrap = document.getElementById("sliderDots");
    const cards = Array.from(track.querySelectorAll(".tour-card"));

    if (!cards.length) return;

    // ===== СОСТОЯНИЕ =====
    let currentIndex = 0;
    let autoplayTimer = null;
    let isDragging = false;
    let dragStartX = 0;
    let dragCurrentX = 0;
    let isTransitioning = false;

    // ===== ВЫЧИСЛЯЕМ КОЛИЧЕСТВО ВИДИМЫХ КАРТОЧЕК =====
    function getVisibleCount() {
      const sliderWidth = slider.offsetWidth;
      if (sliderWidth >= 1024) return 3;
      if (sliderWidth >= 640) return 2;
      return 1;
    }

    // ===== МАКСИМАЛЬНЫЙ ИНДЕКС =====
    function getMaxIndex() {
      return Math.max(0, cards.length - getVisibleCount());
    }

    // ===== СОЗДАЁМ DOTS =====
    function createDots() {
      dotsWrap.innerHTML = "";
      const count = getMaxIndex() + 1;

      for (let i = 0; i < count; i++) {
        const dot = document.createElement("button");
        dot.className = "slider__dot";
        dot.setAttribute("aria-label", `Слайд ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    // ===== ОБНОВЛЯЕМ АКТИВНЫЙ DOT =====
    function updateDots() {
      const dots = dotsWrap.querySelectorAll(".slider__dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("slider__dot--active", i === currentIndex);
      });
    }

    // ===== ОБНОВЛЯЕМ КНОПКИ =====
    function updateButtons() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= getMaxIndex();

      prevBtn.style.opacity = currentIndex === 0 ? "0.4" : "1";
      nextBtn.style.opacity = currentIndex >= getMaxIndex() ? "0.4" : "1";
    }

    // ===== ВЫЧИСЛЯЕМ СМЕЩЕНИЕ =====
    function getOffset(index) {
      if (!cards.length) return 0;

      // Ширина одной карточки + gap
      const cardStyle = getComputedStyle(cards[0]);
      const cardWidth = cards[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(track).gap) || 24;

      return index * (cardWidth + gap);
    }

    // ===== ПЕРЕХОД К СЛАЙДУ =====
    function goTo(index, animate = true) {
      if (isTransitioning && animate) return;

      const maxIndex = getMaxIndex();
      currentIndex = Math.max(0, Math.min(index, maxIndex));

      const offset = getOffset(currentIndex);

      if (animate) {
        isTransitioning = true;
        track.style.transition = `transform ${CONFIG.transitionMs}ms cubic-bezier(0.4, 0, 0.2, 1)`;

        setTimeout(() => {
          isTransitioning = false;
        }, CONFIG.transitionMs);
      } else {
        track.style.transition = "none";
      }

      track.style.transform = `translateX(-${offset}px)`;

      updateDots();
      updateButtons();
    }

    // ===== СЛЕДУЮЩИЙ / ПРЕДЫДУЩИЙ =====
    function next() {
      const maxIndex = getMaxIndex();
      // Зацикливаем слайдер
      goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    }

    function prev() {
      const maxIndex = getMaxIndex();
      goTo(currentIndex <= 0 ? maxIndex : currentIndex - 1);
    }

    // ===== АВТОПРОКРУТКА =====
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(next, CONFIG.autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // ===== DRAG (мышь) =====
    function onMouseDown(e) {
      isDragging = true;
      dragStartX = e.clientX;
      dragCurrentX = e.clientX;
      track.style.transition = "none";
      track.style.cursor = "grabbing";
      stopAutoplay();
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      dragCurrentX = e.clientX;

      const diff = dragStartX - dragCurrentX;
      const offset = getOffset(currentIndex) + diff;
      track.style.transform = `translateX(-${offset}px)`;
    }

    function onMouseUp() {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = "";

      const diff = dragStartX - dragCurrentX;

      if (Math.abs(diff) > CONFIG.dragThreshold) {
        diff > 0 ? next() : prev();
      } else {
        // Возвращаем на место если свайп слабый
        goTo(currentIndex);
      }

      startAutoplay();
    }

    // ===== SWIPE (тач) =====
    function onTouchStart(e) {
      dragStartX = e.touches[0].clientX;
      dragCurrentX = e.touches[0].clientX;
      track.style.transition = "none";
      stopAutoplay();
    }

    function onTouchMove(e) {
      dragCurrentX = e.touches[0].clientX;

      const diff = dragStartX - dragCurrentX;
      const offset = getOffset(currentIndex) + diff;
      track.style.transform = `translateX(-${offset}px)`;

      // Предотвращаем вертикальный скролл при горизонтальном свайпе
      if (Math.abs(diff) > 10) {
        e.preventDefault();
      }
    }

    function onTouchEnd() {
      const diff = dragStartX - dragCurrentX;

      if (Math.abs(diff) > CONFIG.dragThreshold) {
        diff > 0 ? next() : prev();
      } else {
        goTo(currentIndex);
      }

      startAutoplay();
    }

    // ===== АДАПТИВНОСТЬ =====
    // При изменении размера окна пересчитываем слайдер
    let resizeTimer = null;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        createDots();
        goTo(0, false);
      }, 200);
    }

    // ===== НАВЕШИВАЕМ СОБЫТИЯ =====
    prevBtn.addEventListener("click", () => {
      prev();
      resetAutoplay();
    });
    nextBtn.addEventListener("click", () => {
      next();
      resetAutoplay();
    });

    // Drag события
    track.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch события
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: false });
    track.addEventListener("touchend", onTouchEnd);

    // Пауза при hover
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);

    // Адаптивность
    window.addEventListener("resize", onResize);

    // Клавиатурная навигация
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });

    // Вспомогательная функция
    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    createDots();
    goTo(0, false);
    startAutoplay();
  }

  return { init };
})();
