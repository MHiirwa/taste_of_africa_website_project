/* ==========================================================================
   Tastes of Africa - script.js
   Features:
     1. Dark / light mode toggle (saved in localStorage)
     2. Favorites (saved in localStorage, restored on page load)
     3. Recipe filter by region (data attributes + loop + .hidden class)
     4. Ingredient scaler (recipe pages)
     5. Contact form validation with dynamic confirmation message
     6. Newsletter signup, mobile menu and scroll-reveal animation
   ========================================================================== */
(function () {
  "use strict";

  var FAV_KEY = "toa_favorites";
  var THEME_KEY = "toa_theme";

  document.documentElement.classList.add("js");

  /* ---------- localStorage helpers (safe if storage is blocked) ---------- */
  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (err) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (err) { /* ignore */ }
  }

  /* ======================================================================
     1. Dark / light mode
     ====================================================================== */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      var dark = theme === "dark";
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  function initTheme() {
    var saved = storageGet(THEME_KEY);
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));

    var btn = document.getElementById("theme-toggle");
    if (!btn) { return; }
    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      storageSet(THEME_KEY, next);
    });
  }

  /* ======================================================================
     2. Favorites
     ====================================================================== */
  function getFavorites() {
    try {
      var list = JSON.parse(storageGet(FAV_KEY) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return [];
    }
  }

  function saveFavorites(list) {
    storageSet(FAV_KEY, JSON.stringify(list));
  }

  function renderFavorites() {
    var favorites = getFavorites();
    var buttons = document.querySelectorAll(".fav-btn");

    buttons.forEach(function (btn) {
      var isFav = favorites.indexOf(btn.dataset.id) !== -1;
      btn.classList.toggle("active", isFav);
      btn.setAttribute("aria-pressed", String(isFav));
      btn.querySelector(".fav-icon").textContent = isFav ? "❤️" : "🤍";
      btn.querySelector(".fav-label").textContent = isFav ? "Saved" : "Favorite";
    });

    var count = document.getElementById("fav-count");
    if (count) { count.textContent = favorites.length; }
  }

  function toggleFavorite(id) {
    var favorites = getFavorites();
    var index = favorites.indexOf(id);
    if (index === -1) { favorites.push(id); } else { favorites.splice(index, 1); }
    saveFavorites(favorites);
    renderFavorites();
  }

  function initFavorites() {
    var buttons = document.querySelectorAll(".fav-btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        toggleFavorite(btn.dataset.id);
        // If "My favorites" filter is active, refresh the visible cards
        var active = document.querySelector(".filter-btn.active");
        if (active && active.dataset.region === "favorites") { applyFilter("favorites"); }
      });
    });
    renderFavorites(); // restore saved favorites on page load
  }

  /* ======================================================================
     3. Recipe filter
     ====================================================================== */
  function applyFilter(region) {
    var cards = document.querySelectorAll("#recipe-grid .recipe-card");
    var favorites = getFavorites();
    var visible = 0;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var show;
      if (region === "all") {
        show = true;
      } else if (region === "favorites") {
        show = favorites.indexOf(card.dataset.id) !== -1;
      } else {
        show = card.dataset.region === region;
      }
      card.classList.toggle("hidden", !show);
      if (show) { visible++; }
    }

    var empty = document.getElementById("no-results");
    if (empty) { empty.hidden = visible !== 0; }

    var status = document.getElementById("filter-status");
    if (status) { status.textContent = visible + (visible === 1 ? " recipe shown" : " recipes shown"); }
  }

  function initFilter() {
    var buttons = document.querySelectorAll(".filter-btn");
    if (!buttons.length) { return; }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          var isActive = b === btn;
          b.classList.toggle("active", isActive);
          b.setAttribute("aria-pressed", String(isActive));
        });
        applyFilter(btn.dataset.region);
      });
    });
  }

  /* ======================================================================
     4. Ingredient scaler
     ====================================================================== */
  var FRACTIONS = { 0.25: "¼", 0.5: "½", 0.75: "¾" };

  function formatAmount(value, unit) {
    if (unit === "g" || unit === "ml") { return String(Math.max(1, Math.round(value))); }
    var rounded = Math.max(0.25, Math.round(value * 4) / 4);
    var whole = Math.floor(rounded);
    var fraction = Math.round((rounded - whole) * 100) / 100;
    var text = fraction ? FRACTIONS[fraction] : "";
    return whole ? whole + text : text;
  }

  function initScaler() {
    var panel = document.getElementById("scaler-panel");
    if (!panel) { return; }

    var base = parseInt(panel.dataset.baseServings, 10);
    var servings = base;
    var output = document.getElementById("servings-value");
    var items = panel.querySelectorAll("#ingredient-list li[data-qty]");

    function update() {
      var factor = servings / base;
      items.forEach(function (li) {
        var amount = formatAmount(parseFloat(li.dataset.qty) * factor, li.dataset.unit);
        var parts = [amount, li.dataset.unit, li.dataset.name].filter(Boolean);
        li.textContent = parts.join(" ");
      });
      output.textContent = servings;
    }

    panel.querySelectorAll(".scale-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        servings = Math.min(24, Math.max(1, servings + parseInt(btn.dataset.delta, 10)));
        update();
      });
    });

    var reset = document.getElementById("scale-reset");
    if (reset) {
      reset.addEventListener("click", function () { servings = base; update(); });
    }
  }

  /* ======================================================================
     5. Contact form validation
     ====================================================================== */
  function setError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var error = document.getElementById(fieldId + "-error");
    if (error) { error.textContent = message; }
    if (input) {
      input.setAttribute("aria-invalid", message ? "true" : "false");
      input.closest(".field").classList.toggle("invalid", Boolean(message));
    }
    return !message;
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) { return; }

    var message = document.getElementById("message");
    var counter = document.getElementById("message-count");

    message.addEventListener("input", function () {
      var length = message.value.trim().length;
      counter.textContent = length + " characters" + (length > 20 ? "" : " (more than 20 needed)");
      counter.classList.toggle("ok", length > 20);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault(); // stop the browser from submitting automatically

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var country = form.elements.country.value;
      var text = message.value.trim();

      var validName = setError("name", name ? "" : "Please enter your name.");
      var validEmail = setError("email",
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Please enter a valid email address.");
      var validCountry = setError("country", country ? "" : "Please choose your country.");
      var validMessage = setError("message",
        text.length > 20 ? "" : "Your message must be more than 20 characters (currently " + text.length + ").");

      if (!(validName && validEmail && validCountry && validMessage)) {
        var firstInvalid = form.querySelector(".invalid input, .invalid select, .invalid textarea");
        if (firstInvalid) { firstInvalid.focus(); }
        return;
      }

      var confirmation = document.getElementById("confirmation");
      confirmation.textContent = "Thank you, " + name + "! We've received your message.";
      form.hidden = true;
      form.style.display = "none";
      confirmation.hidden = false;
      confirmation.focus();
    });
  }

  /* ======================================================================
     6. Newsletter, mobile menu, reveal animation, footer year
     ====================================================================== */
  function initNewsletter() {
    var form = document.getElementById("newsletter-form");
    if (!form) { return; }
    var msg = document.getElementById("newsletter-msg");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = document.getElementById("newsletter-email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = "Please enter a valid email address.";
        return;
      }
      msg.textContent = "Thanks for subscribing!";
      form.reset();
    });
  }

  function initMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) { return; }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (typeof window.IntersectionObserver !== "function") {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  }

  function initYear() {
    var year = document.getElementById("year");
    if (year) { year.textContent = new Date().getFullYear(); }
  }

  /* ---------- Start ---------- */
  function init() {
    initTheme();
    initFavorites();
    initFilter();
    initScaler();
    initContactForm();
    initNewsletter();
    initMenu();
    initReveal();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
