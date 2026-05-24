/**
 * THEME MANAGER
 * Управляет переключением dark/light темы.
 *
 * Логика приоритетов:
 * 1. Сохранённый выбор пользователя (localStorage)
 * 2. Системная тема (prefers-color-scheme)
 * 3. Дефолт — light
 */

const ThemeManager = (() => {
  const STORAGE_KEY = "globetour-theme";
  const DARK = "dark";
  const LIGHT = "light";

  const html = document.documentElement;
  const toggleBtn = document.getElementById("themeToggle");

  /**
   * Получаем начальную тему:
   * сохранённую или системную
   */
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === DARK || saved === LIGHT) return saved;

    // Читаем системную настройку
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? DARK : LIGHT;
  }

  /**
   * Применяем тему — меняем атрибут на <html>
   * CSS сам подхватывает через [data-theme="dark"]
   */
  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Обновляем aria-label для доступности
    if (toggleBtn) {
      toggleBtn.setAttribute(
        "aria-label",
        theme === DARK
          ? "Переключить на светлую тему"
          : "Переключить на тёмную тему",
      );
    }
  }

  /**
   * Переключаем тему
   */
  function toggle() {
    const current = html.getAttribute("data-theme");
    const next = current === DARK ? LIGHT : DARK;

    // Добавляем класс анимации на кнопку
    if (toggleBtn) {
      toggleBtn.classList.add("theme-toggle--animating");
      setTimeout(() => {
        toggleBtn.classList.remove("theme-toggle--animating");
      }, 300);
    }

    applyTheme(next);
  }

  /**
   * Инициализация
   */
  function init() {
    // Применяем тему сразу — до рендера страницы
    applyTheme(getInitialTheme());

    // Слушаем клик по кнопке
    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggle);
    }

    // Слушаем изменение системной темы
    // (пользователь переключил тему в ОС)
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        // Только если пользователь не выбирал вручную
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          applyTheme(e.matches ? DARK : LIGHT);
        }
      });
  }

  // Публичный API модуля
  return { init };
})();
