/**
 * FORM MANAGER
 * Валидация и отправка формы заявки.
 *
 * Возможности:
 * — Валидация в реальном времени (on blur)
 * — Валидация при отправке
 * — Состояние загрузки кнопки
 * — Сообщение об успехе
 * — Сброс формы после отправки
 */

const FormManager = (() => {
  // ===== ПРАВИЛА ВАЛИДАЦИИ =====
  const RULES = {
    name: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/,
      messages: {
        required: "Введите ваше имя",
        minLength: "Имя должно содержать минимум 2 символа",
        pattern: "Имя может содержать только буквы",
      },
    },
    phone: {
      required: true,
      pattern: /^[\+]?[\d\s\(\)\-]{10,18}$/,
      messages: {
        required: "Введите номер телефона",
        pattern: "Введите корректный номер телефона",
      },
    },
  };

  function init() {
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    if (!form) return;

    // ===== ПОЛУЧАЕМ ПОЛЯ =====
    const fields = {
      name: form.querySelector("#name"),
      phone: form.querySelector("#phone"),
    };

    const errors = {
      name: form.querySelector("#nameError"),
      phone: form.querySelector("#phoneError"),
    };

    // ===== ВАЛИДАЦИЯ ОДНОГО ПОЛЯ =====
    function validateField(name) {
      const field = fields[name];
      const error = errors[name];
      const rules = RULES[name];
      const value = field.value.trim();

      // Сбрасываем ошибку
      clearError(field, error);

      // Проверяем required
      if (rules.required && !value) {
        showError(field, error, rules.messages.required);
        return false;
      }

      // Проверяем минимальную длину
      if (rules.minLength && value.length < rules.minLength) {
        showError(field, error, rules.messages.minLength);
        return false;
      }

      // Проверяем паттерн
      if (rules.pattern && value && !rules.pattern.test(value)) {
        showError(field, error, rules.messages.pattern);
        return false;
      }

      // Поле валидно — показываем галочку
      showSuccess(field);
      return true;
    }

    // ===== ПОКАЗЫВАЕМ ОШИБКУ =====
    function showError(field, errorEl, message) {
      field.classList.add("form-input--error");
      field.classList.remove("form-input--success");
      field.setAttribute("aria-invalid", "true");

      if (errorEl) {
        errorEl.textContent = message;
        // Анимируем появление ошибки
        errorEl.style.animation = "none";
        errorEl.offsetHeight; // reflow — перезапускаем анимацию
        errorEl.style.animation = "";
      }
    }

    // ===== ПОКАЗЫВАЕМ УСПЕХ =====
    function showSuccess(field) {
      field.classList.remove("form-input--error");
      field.classList.add("form-input--success");
      field.setAttribute("aria-invalid", "false");
    }

    // ===== СБРАСЫВАЕМ ОШИБКУ =====
    function clearError(field, errorEl) {
      field.classList.remove("form-input--error");
      if (errorEl) errorEl.textContent = "";
    }

    // ===== СЛУШАЕМ ПОЛЯ — ВАЛИДАЦИЯ ON BLUR =====
    Object.keys(fields).forEach((name) => {
      const field = fields[name];

      // Валидируем при потере фокуса
      field.addEventListener("blur", () => {
        validateField(name);
      });

      // Убираем ошибку при вводе
      field.addEventListener("input", () => {
        if (field.classList.contains("form-input--error")) {
          clearError(field, errors[name]);
        }
      });
    });

    // ===== ОТПРАВКА ФОРМЫ =====
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Валидируем все обязательные поля
      const isNameValid = validateField("name");
      const isPhoneValid = validateField("phone");

      if (!isNameValid || !isPhoneValid) {
        // Фокус на первое невалидное поле
        if (!isNameValid) fields.name.focus();
        else if (!isPhoneValid) fields.phone.focus();
        return;
      }

      // ===== СОСТОЯНИЕ ЗАГРУЗКИ =====
      setLoading(true);

      try {
        // Имитируем отправку на сервер (1.5 сек)
        await fakeSubmit();

        // Успех
        showSuccessMessage();
        form.reset();
        resetFieldStyles();
      } catch (err) {
        // Ошибка сети
        showNetworkError();
      } finally {
        setLoading(false);
      }
    });

    // ===== СОСТОЯНИЕ ЗАГРУЗКИ КНОПКИ =====
    function setLoading(isLoading) {
      const span = submitBtn.querySelector("span");

      submitBtn.disabled = isLoading;

      if (isLoading) {
        submitBtn.classList.add("btn--loading");
        if (span) span.textContent = "Отправляем...";
      } else {
        submitBtn.classList.remove("btn--loading");
        if (span) {
          const lang = document.documentElement.getAttribute("lang") || "ru";
          span.textContent =
            lang === "en" ? "Send Request" : "Отправить заявку";
        }
      }
    }

    // ===== ИМИТАЦИЯ ОТПРАВКИ =====
    function fakeSubmit() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 95% успех, 5% ошибка — для демонстрации
          Math.random() > 0.05 ? resolve() : reject();
        }, 1500);
      });
    }

    // ===== СООБЩЕНИЕ ОБ УСПЕХЕ =====
    function showSuccessMessage() {
      const wrap = form.parentElement;

      const successEl = document.createElement("div");
      successEl.className = "form-success";
      successEl.innerHTML = `
        <div class="form-success__icon">✅</div>
        <h3 class="form-success__title">Заявка отправлена!</h3>
        <p class="form-success__text">
          Менеджер свяжется с вами в течение 30 минут
        </p>
        <button class="btn btn--outline form-success__back" id="backToForm">
          Отправить ещё одну
        </button>
      `;

      wrap.style.position = "relative";
      wrap.appendChild(successEl);

      // Анимируем появление
      requestAnimationFrame(() => {
        successEl.classList.add("form-success--visible");
      });

      // Кнопка "Отправить ещё одну"
      successEl.querySelector("#backToForm").addEventListener("click", () => {
        successEl.classList.remove("form-success--visible");
        setTimeout(() => successEl.remove(), 300);
      });
    }

    // ===== СООБЩЕНИЕ ОБ ОШИБКЕ СЕТИ =====
    function showNetworkError() {
      const existingError = form.querySelector(".form-network-error");
      if (existingError) existingError.remove();

      const errorEl = document.createElement("p");
      errorEl.className = "form-network-error";
      errorEl.textContent = "Произошла ошибка. Пожалуйста, попробуйте ещё раз.";

      submitBtn.insertAdjacentElement("afterend", errorEl);

      setTimeout(() => errorEl.remove(), 5000);
    }

    // ===== СБРОС СТИЛЕЙ ПОЛЕЙ =====
    function resetFieldStyles() {
      Object.values(fields).forEach((field) => {
        field.classList.remove("form-input--success", "form-input--error");
        field.removeAttribute("aria-invalid");
      });
    }
  }

  return { init };
})();
