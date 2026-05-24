/**
 * MAIN — точка входа.
 * Инициализируем все модули и
 * описываем логику header + бургер-меню.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Модули
  ThemeManager.init();
  LangManager.init();
  AnimationManager.init();
  SliderManager.init();
  FormManager.init();

  // UI
  initHeader();
  initBurger();
  initActiveNavLink();
  initLazyImages();
  initSmoothScroll();
  initBackToTop();
});

/* ================================================
   HEADER — тень и граница при скролле
   ================================================ */

function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  /**
   * IntersectionObserver — следим за верхом страницы.
   * Это эффективнее, чем слушать событие scroll.
   */
  const sentinel = document.createElement("div");
  sentinel.style.cssText =
    "position:absolute;top:0;left:0;height:1px;width:100%;pointer-events:none;";
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(
    ([entry]) => {
      // Когда sentinel уходит из поля зрения — мы проскроллили вниз
      header.classList.toggle("header--scrolled", !entry.isIntersecting);
    },
    { threshold: 0 },
  );

  observer.observe(sentinel);
}

/* ================================================
   БУРГЕР — мобильное меню
   ================================================ */

function initBurger() {
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const body = document.body;

  if (!burger || !mobileMenu) return;

  // Все ссылки в мобильном меню
  const menuLinks = mobileMenu.querySelectorAll(".mobile-menu__link");

  function openMenu() {
    burger.classList.add("burger--open");
    burger.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("mobile-menu--open");
    mobileMenu.setAttribute("aria-hidden", "false");
    // Блокируем скролл страницы под меню
    body.style.overflow = "hidden";
  }

  function closeMenu() {
    burger.classList.remove("burger--open");
    burger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("mobile-menu--open");
    mobileMenu.setAttribute("aria-hidden", "true");
    // Возвращаем скролл
    body.style.overflow = "";
  }

  function toggleMenu() {
    const isOpen = burger.classList.contains("burger--open");
    isOpen ? closeMenu() : openMenu();
  }

  // Клик по бургеру
  burger.addEventListener("click", toggleMenu);

  // Клик по ссылке — закрываем меню
  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Клик вне меню — закрываем
  document.addEventListener("click", (e) => {
    const isOpen = burger.classList.contains("burger--open");
    if (!isOpen) return;

    const clickedInsideMenu = mobileMenu.contains(e.target);
    const clickedInsideBurger = burger.contains(e.target);
    if (!clickedInsideMenu && !clickedInsideBurger) {
      closeMenu();
    }
  });

  // Escape — закрываем меню
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ================================================
   АКТИВНАЯ ССЫЛКА В НАВИГАЦИИ
   Подсвечиваем ссылку текущей секции при скролле
   ================================================ */

function initActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");

        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("nav__link--active", isActive);
        });
      });
    },
    {
      // Секция считается активной когда она занимает центр экрана
      rootMargin: "-40% 0px -55% 0px",
    },
  );

  sections.forEach((section) => observer.observe(section));
}

// Добавляем в конец файла main.js

/* ================================================
   ОПТИМИЗАЦИЯ — Lazy Load изображений
   Для браузеров без нативного lazy loading
   ================================================ */

function initLazyImages() {
  // Современные браузеры поддерживают loading="lazy" нативно.
  // Этот код — фолбэк для старых браузеров.
  if ("loading" in HTMLImageElement.prototype) return;

  const images = document.querySelectorAll('img[loading="lazy"]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      observer.unobserve(img);
    });
  });

  images.forEach((img) => observer.observe(img));
}

/* ================================================
   ОПТИМИЗАЦИЯ — Debounce для resize
   ================================================ */

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ================================================
   UX — Плавный скролл к секции с учётом header
   ================================================ */

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
        10,
      );

      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 16; // небольшой дополнительный отступ

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });
}

/* ================================================
   UX — Кнопка "Наверх"
   ================================================ */

function initBackToTop() {
  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.innerHTML = "↑";
  btn.setAttribute("aria-label", "Вернуться наверх");
  document.body.appendChild(btn);

  const observer = new IntersectionObserver(
    ([entry]) => {
      btn.classList.toggle("back-to-top--visible", !entry.isIntersecting);
    },
    { threshold: 0 },
  );

  // Показываем после первого экрана
  const hero = document.querySelector(".hero");
  if (hero) observer.observe(hero);

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Добавляем вызовы в DOMContentLoaded
// (дописываем в существующий обработчик)
// initLazyImages();
// initSmoothScroll();
// initBackToTop();
