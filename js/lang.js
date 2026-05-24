/**
 * LANG MANAGER
 * Управляет переключением языка RU / EN.
 *
 * Принцип работы:
 * 1. В HTML каждый текстовый элемент имеет data-i18n="ключ"
 * 2. Словарь TRANSLATIONS содержит переводы для каждого ключа
 * 3. При переключении — находим все элементы и меняем textContent
 */

const LangManager = (() => {
  const STORAGE_KEY = "globetour-lang";
  const DEFAULT = "ru";

  // ===== СЛОВАРЬ ПЕРЕВОДОВ =====
  const TRANSLATIONS = {
    ru: {
      // Навигация
      "nav.about": "О нас",
      "nav.services": "Услуги",
      "nav.tours": "Туры",
      "nav.contact": "Контакты",

      // Hero
      "hero.tagline": "Международное турагентство",
      "hero.title": "Открой мир вместе с",
      "hero.description":
        "Организуем путешествия в 80+ стран мира. Индивидуальный подход, лучшие цены и незабываемые впечатления.",
      "hero.stat1": "лет опыта",
      "hero.stat2": "стран",
      "hero.stat3": "клиентов",
      "hero.cta1": "Подобрать тур",
      "hero.cta2": "Смотреть туры",
      "hero.badge": "рейтинг клиентов",

      // About
      "about.title": "О компании",
      "about.subtitle": "Мы помогаем людям открывать мир с 2012 года",
      "about.text1":
        "GlobeTour — международное турагентство с офисами в Москве, Варшаве и Дубае. Мы специализируемся на индивидуальных турах, групповых путешествиях и корпоративных поездках.",
      "about.text2":
        "Наша команда из 50+ экспертов знает направления изнутри — многие из них объездили страны, которые предлагают клиентам.",
      "about.stat1": "лет на рынке",
      "about.stat2": "стран",
      "about.stat3": "клиентов",
      "about.stat4": "довольных клиентов",

      // Services
      "services.title": "Наши услуги",
      "services.subtitle": "Всё для вашего идеального путешествия",
      "services.item1.title": "Индивидуальные туры",
      "services.item1.text":
        "Маршрут, отель и программа — всё под ваши желания и бюджет",
      "services.item2.title": "Групповые туры",
      "services.item2.text":
        "Готовые маршруты с гидом и единомышленниками по всему миру",
      "services.item3.title": "Авиабилеты",
      "services.item3.text":
        "Лучшие цены на перелёты по любым направлениям мира",
      "services.item4.title": "Отели",
      "services.item4.text":
        "Подбор отелей любой категории — от бюджетных до люкс",
      "services.item5.title": "Страхование",
      "services.item5.text":
        "Туристические страховки для безопасного путешествия",
      "services.item6.title": "Корпоративные туры",
      "services.item6.text":
        "Организация деловых поездок и корпоративного отдыха",

      // Tours
      "tours.title": "Популярные туры",
      "tours.subtitle": "Направления, которые выбирают чаще всего",
      "tours.badge.hot": "Горящий",
      "tours.badge.new": "Новинка",
      "tours.from": "от",
      "tours.book": "Забронировать",
      "tours.bali.title": "Бали, Индонезия",
      "tours.maldives.title": "Мальдивы",
      "tours.japan.title": "Япония, Токио",
      "tours.italy.title": "Италия, Рим",
      "tours.dubai.title": "Дубай, ОАЭ",
      "tours.duration": "14 ночей",
      "tours.duration2": "10 ночей",
      "tours.duration3": "12 ночей",
      "tours.duration4": "7 ночей",
      "tours.duration5": "8 ночей",
      "tours.type.beach": "Пляжный",
      "tours.type.luxury": "Люкс",
      "tours.type.culture": "Культурный",
      "tours.type.excursion": "Экскурсионный",

      // Contact
      "contact.title": "Оставить заявку",
      "contact.subtitle": "Менеджер свяжется с вами в течение 30 минут",
      "contact.address.label": "Адрес",
      "contact.address.value": "Варшава, ул. Маршалковская, 12",
      "contact.phone.label": "Телефон",
      "contact.email.label": "Email",
      "contact.hours.label": "Режим работы",
      "contact.hours.value": "Пн–Пт: 9:00–20:00, Сб: 10:00–18:00",

      // Form
      "form.name": "Ваше имя",
      "form.phone": "Телефон",
      "form.destination": "Направление",
      "form.message": "Комментарий",
      "form.submit": "Отправить заявку",
      "form.privacy":
        "Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности",

      // Footer
      "footer.tagline": "Открываем мир для вас с 2012 года",
      "footer.copy": "© 2024 GlobeTour. Все права защищены.",
    },

    en: {
      // Navigation
      "nav.about": "About",
      "nav.services": "Services",
      "nav.tours": "Tours",
      "nav.contact": "Contact",

      // Hero
      "hero.tagline": "International Travel Agency",
      "hero.title": "Explore the World with",
      "hero.description":
        "We organize travel to 80+ countries worldwide. Personal approach, best prices and unforgettable experiences.",
      "hero.stat1": "years of experience",
      "hero.stat2": "countries",
      "hero.stat3": "clients",
      "hero.cta1": "Find a Tour",
      "hero.cta2": "Browse Tours",
      "hero.badge": "client rating",

      // About
      "about.title": "About",
      "about.subtitle": "Helping people discover the world since 2012",
      "about.text1":
        "GlobeTour is an international travel agency with offices in Moscow, Warsaw and Dubai. We specialize in individual tours, group travel and corporate trips.",
      "about.text2":
        "Our team of 50+ experts knows each destination firsthand — many of them have personally visited the countries they recommend.",
      "about.stat1": "years on market",
      "about.stat2": "countries",
      "about.stat3": "clients",
      "about.stat4": "satisfied clients",

      // Services
      "services.title": "Our Services",
      "services.subtitle": "Everything for your perfect journey",
      "services.item1.title": "Individual Tours",
      "services.item1.text":
        "Route, hotel and itinerary — tailored to your wishes and budget",
      "services.item2.title": "Group Tours",
      "services.item2.text":
        "Ready-made routes with a guide and like-minded travelers worldwide",
      "services.item3.title": "Flights",
      "services.item3.text":
        "Best prices on flights to any destination in the world",
      "services.item4.title": "Hotels",
      "services.item4.text":
        "Hotel selection for any category — from budget to luxury",
      "services.item5.title": "Insurance",
      "services.item5.text":
        "Travel insurance for a safe and worry-free journey",
      "services.item6.title": "Corporate Travel",
      "services.item6.text":
        "Business trips and corporate retreat organization",

      // Tours
      "tours.title": "Popular Tours",
      "tours.subtitle": "The most chosen destinations",
      "tours.badge.hot": "Hot Deal",
      "tours.badge.new": "New",
      "tours.from": "from",
      "tours.book": "Book Now",
      "tours.bali.title": "Bali, Indonesia",
      "tours.maldives.title": "Maldives",
      "tours.japan.title": "Japan, Tokyo",
      "tours.italy.title": "Italy, Rome",
      "tours.dubai.title": "Dubai, UAE",
      "tours.duration": "14 nights",
      "tours.duration2": "10 nights",
      "tours.duration3": "12 nights",
      "tours.duration4": "7 nights",
      "tours.duration5": "8 nights",
      "tours.type.beach": "Beach",
      "tours.type.luxury": "Luxury",
      "tours.type.culture": "Cultural",
      "tours.type.excursion": "Sightseeing",

      // Contact
      "contact.title": "Get in Touch",
      "contact.subtitle": "Our manager will contact you within 30 minutes",
      "contact.address.label": "Address",
      "contact.address.value": "Warsaw, Marszałkowska St., 12",
      "contact.phone.label": "Phone",
      "contact.email.label": "Email",
      "contact.hours.label": "Working Hours",
      "contact.hours.value": "Mon–Fri: 9:00–20:00, Sat: 10:00–18:00",

      // Form
      "form.name": "Your Name",
      "form.phone": "Phone",
      "form.destination": "Destination",
      "form.message": "Comment",
      "form.submit": "Send Request",
      "form.privacy": "By clicking the button, you agree to our privacy policy",

      // Footer
      "footer.tagline": "Discovering the world for you since 2012",
      "footer.copy": "© 2024 GlobeTour. All rights reserved.",
    },
  };

  // ===== ПРИВАТНЫЕ ФУНКЦИИ =====

  /**
   * Получаем начальный язык:
   * сохранённый или дефолтный
   */
  function getInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ru" || saved === "en") return saved;

    // Определяем язык браузера
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    return browserLang === "en" ? "en" : DEFAULT;
  }

  /**
   * Применяем переводы ко всем элементам с data-i18n
   */
  function applyTranslations(lang) {
    const dict = TRANSLATIONS[lang];
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = dict[key];

      if (!value) {
        // Если перевод не найден — предупреждаем в консоли
        console.warn(
          `[LangManager] Missing translation: "${key}" for lang "${lang}"`,
        );
        return;
      }

      el.textContent = value;
    });
  }

  /**
   * Обновляем кнопку переключателя языка
   */
  function updateToggleBtn(lang) {
    const current = document.querySelector(".lang-toggle__current");
    const other = document.querySelector(".lang-toggle__other");
    if (!current || !other) return;

    current.textContent = lang.toUpperCase();
    other.textContent = lang === "ru" ? "EN" : "RU";
  }

  /**
   * Применяем язык полностью
   */
  function applyLang(lang) {
    // Обновляем атрибут на <html> — важно для SEO и скринридеров
    document.documentElement.setAttribute("lang", lang);
    // Сохраняем в localStorage
    localStorage.setItem(STORAGE_KEY, lang);
    // Переводим все тексты
    applyTranslations(lang);
    // Обновляем кнопку
    updateToggleBtn(lang);
    // Обновляем title страницы
    updatePageTitle(lang);
  }

  /**
   * Обновляем title страницы
   */
  function updatePageTitle(lang) {
    document.title =
      lang === "ru"
        ? "GlobeTour — Международное турагентство"
        : "GlobeTour — International Travel Agency";
  }

  /**
   * Переключаем язык
   */
  function toggle() {
    const current = localStorage.getItem(STORAGE_KEY) || DEFAULT;
    const next = current === "ru" ? "en" : "ru";

    // Запускаем анимацию на всей странице
    document.body.classList.add("lang-switching");

    setTimeout(() => {
      applyLang(next);
      document.body.classList.remove("lang-switching");
    }, 175); // Применяем тексты в середине анимации
  }

  /**
   * Инициализация
   */
  function init() {
    const toggleBtn = document.getElementById("langToggle");

    // Применяем начальный язык
    applyLang(getInitialLang());

    // Слушаем клик по кнопке
    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggle);
    }
  }

  // Публичный API
  return { init };
})();
