// Menú de navegación móvil
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Desplegable "Temas"
  var navDropdown = document.querySelector(".nav-dropdown");
  var navDropdownToggle = document.querySelector(".nav-dropdown-toggle");
  if (navDropdown && navDropdownToggle) {
    navDropdownToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = navDropdown.classList.toggle("open");
      navDropdownToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove("open");
        navDropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        navDropdown.classList.remove("open");
        navDropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Formulario de contacto (página Contacto)
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var CONTACT_EMAIL = "equipo.metodosnumericos@uniclaretiana.edu.co";
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("contact-name").value.trim();
      var email = document.getElementById("contact-email").value.trim();
      var message = document.getElementById("contact-message").value.trim();
      var status = document.getElementById("contact-status");

      if (!name || !email || !message) {
        status.textContent = "Completa los tres campos antes de enviar.";
        status.className = "form-status bad";
        return;
      }

      var subject = "Contacto desde el sitio — Métodos Numéricos (" + name + ")";
      var body =
        "Nombre: " + name + "\n" +
        "Correo: " + email + "\n\n" +
        message;

      var mailtoUrl =
        "mailto:" + encodeURIComponent(CONTACT_EMAIL) +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailtoUrl;

      status.textContent =
        "Se abrió tu programa de correo con el mensaje listo para " + CONTACT_EMAIL + ". Si no se abrió nada, escribe directamente a esa dirección.";
      status.className = "form-status ok";
      contactForm.reset();
    });
  }

  // Calculadora de error absoluto y relativo (página de Python)
  var calcBtn = document.getElementById("calc-btn");
  if (calcBtn) {
    calcBtn.addEventListener("click", function () {
      var real = parseFloat(document.getElementById("calc-real").value);
      var aprox = parseFloat(document.getElementById("calc-aprox").value);
      var out = document.getElementById("calc-result");

      if (isNaN(real) || isNaN(aprox)) {
        out.innerHTML = "Ingresa dos valores numéricos válidos.";
        return;
      }
      var ea = Math.abs(real - aprox);
      var er = real !== 0 ? ea / Math.abs(real) : NaN;

      var erText = isNaN(er)
        ? "no definido (el valor real es 0)"
        : (er * 100).toFixed(6) + " %";

      out.innerHTML =
        "Error absoluto (Ea) = <span class='v'>" + ea.toPrecision(8) + "</span><br>" +
        "Error relativo (Er) = <span class='v'>" + (isNaN(er) ? "—" : er.toPrecision(8)) + "</span>" +
        " &nbsp;(" + erText + ")";
    });
  }
});

// ---------------------------------------------------------
// Mejoras de interfaz: tema claro/oscuro, progreso de lectura,
// índice lateral activo y gráfica animada de Newton (Inicio)
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tema claro / oscuro
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("mn-theme", next); } catch (e) {}
    });
  }

  // Cerrar el menú móvil al elegir un enlace
  var navEl = document.querySelector(".main-nav");
  var navToggleEl = document.querySelector(".nav-toggle");
  if (navEl && navToggleEl) {
    navEl.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navEl.classList.remove("open");
        navToggleEl.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Barra de progreso de lectura + índice lateral activo
  var doc = document.querySelector(".doc-layout");
  if (doc) {
    var bar = document.createElement("div");
    bar.className = "progress";
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = "<i></i>";
    document.body.insertBefore(bar, document.body.firstChild);
    var fill = bar.firstChild;

    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });

    var ticking = false;
    function onScroll() {
      ticking = false;
      var max = root.scrollHeight - window.innerHeight;
      fill.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
      var current = -1;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i] && targets[i].getBoundingClientRect().top < 140) current = i;
      }
      links.forEach(function (a, i) { a.classList.toggle("active", i === current); });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  // Gráfica de Newton en el hero: f(x) = x² − 2, x₀ = 3
  var iter = document.getElementById("plot-iter");
  if (iter) {
    var NS = "http://www.w3.org/2000/svg";
    var PX0 = 44, PW = 420, PY0 = 16, PH = 290, XMAX = 3.2, YMIN = -2.6, YMAX = 8.4;
    var px = function (x) { return PX0 + x / XMAX * PW; };
    var py = function (y) { return PY0 + (YMAX - y) / (YMAX - YMIN) * PH; };
    var f = function (x) { return x * x - 2; };
    var xs = [3];
    for (var i = 0; i < 5; i++) xs.push(xs[i] - f(xs[i]) / (2 * xs[i]));

    var rn = document.getElementById("pr-n");
    var rx = document.getElementById("pr-x");
    var re = document.getElementById("pr-e");

    var mk = function (tag, attrs) {
      var n = document.createElementNS(NS, tag);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      iter.appendChild(n);
      return n;
    };
    var readout = function (n) {
      rn.textContent = n;
      rx.textContent = xs[n].toFixed(9);
      re.textContent = Math.abs(xs[n] - Math.SQRT2).toExponential(1);
    };
    var drawStep = function (k, animate) {
      var x0 = xs[k], x1 = xs[k + 1];
      mk("line", { "class": "plot-drop", x1: px(x0), y1: py(0), x2: px(x0), y2: py(f(x0)) });
      var tan = mk("path", {
        "class": "plot-tan", pathLength: 1,
        d: "M" + px(x0) + " " + py(f(x0)) + " L" + px(x1) + " " + py(0)
      });
      mk("circle", { "class": "plot-pt", cx: px(x1), cy: py(0), r: 4.5 });
      if (animate) {
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () { tan.style.strokeDashoffset = 0; });
        });
      } else {
        tan.style.transition = "none";
        tan.style.strokeDashoffset = 0;
      }
    };
    var reset = function () {
      iter.innerHTML = "";
      mk("circle", { "class": "plot-pt", cx: px(xs[0]), cy: py(0), r: 4.5 });
      readout(0);
    };

    if (reduceMotion) {
      reset();
      for (var s = 0; s < 5; s++) drawStep(s, false);
      readout(5);
    } else {
      var run = function () {
        iter.style.opacity = 1;
        reset();
        var k = 0;
        (function next() {
          if (k < 5) {
            drawStep(k, true);
            readout(k + 1);
            k++;
            setTimeout(next, 1000);
          } else {
            setTimeout(function () {
              iter.style.transition = "opacity .5s";
              iter.style.opacity = 0;
              setTimeout(function () { iter.style.transition = ""; run(); }, 600);
            }, 3200);
          }
        })();
      };
      setTimeout(run, 500);
    }
  }
});
