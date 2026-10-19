// Juego "Cazadores de raíces" — Unidad 2, en formato de lección tipo Duolingo.
// Todo gira en torno a f(x) = x^2 - 2, raíz = sqrt(2).
// Retos: bisección, punto fijo (telaraña), Newton y carrera de convergencia.

(function () {
  "use strict";

  var ROOT = Math.sqrt(2);
  var VIDAS = 5, TOL_BIS = 0.05, XP_MAX = 160, TOTAL = 10;
  var ELOGIOS = ["¡Excelente!", "¡Muy bien!", "¡Correcto!", "¡Así se hace!", "¡Perfecto!"];
  var COLORES = ["#58CC02", "#1CB0F6", "#FFC800", "#FF9600", "#FF4B4B", "#8B5CF6"];

  function f(x) { return x * x - 2; }
  function fp(x) { return 2 * x; }
  function sign(x) { return x > 0 ? 1 : (x < 0 ? -1 : 0); }

  var gFns = {
    A: { fn: function (x) { return (x + 2 / x) / 2; }, label: "g_A(x) = (x + 2/x) / 2" },
    B: { fn: function (x) { return x - (x * x - 2) / 4; }, label: "g_B(x) = x − (x²−2)/4" },
    C: { fn: function (x) { return x - (x * x - 2); }, label: "g_C(x) = x − (x²−2)" }
  };

  function runFixedPoint(g, x0, maxIt) {
    var x = x0, hist = [x0];
    for (var i = 0; i < maxIt; i++) {
      var xn = g(x);
      hist.push(xn);
      if (!isFinite(xn) || Math.abs(xn) > 50) return { converged: false, hist: hist, diverged: true };
      if (Math.abs(xn - x) < 1e-4) return { converged: true, hist: hist, iters: i + 1 };
      x = xn;
    }
    return { converged: false, hist: hist, iters: maxIt };
  }
  function runBisectionSteps(tol) {
    var a = 1, b = 2, steps = 0;
    while ((b - a) / 2 > tol && steps < 200) {
      var m = (a + b) / 2;
      if (f(a) * f(m) < 0) b = m; else a = m;
      steps++;
    }
    return steps;
  }
  function runFixedPointSteps(g, x0, tol, maxIt) {
    var x = x0;
    for (var i = 0; i < maxIt; i++) {
      var xn = g(x);
      if (!isFinite(xn) || Math.abs(xn) > 50) return null;
      if (Math.abs(xn - ROOT) < tol) return i + 1;
      x = xn;
    }
    return null;
  }
  function runNewtonSteps(x0, tol, maxIt) {
    var x = x0;
    for (var i = 0; i < maxIt; i++) {
      var d = fp(x);
      if (Math.abs(d) < 1e-9) return null;
      var xn = x - f(x) / d;
      if (!isFinite(xn) || Math.abs(xn) > 1e6) return null;
      if (Math.abs(xn - ROOT) < tol) return i + 1;
      x = xn;
    }
    return null;
  }

  var S = {};
  var els = {};
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sonido = true;
  try { sonido = localStorage.getItem("mn-sound") !== "off"; } catch (e) {}
  var audioCtx = null;

  function $(id) { return document.getElementById(id); }
  function el(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function mezclar(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- mascota "Épsilon" ---------- */
  function mascot(mood) {
    return '<svg class="dl-mascot" data-mood="' + mood + '" viewBox="0 0 120 124" aria-hidden="true" focusable="false">' +
      '<ellipse cx="60" cy="118" rx="32" ry="5" fill="rgba(13,25,50,.14)"/>' +
      '<path d="M60 18C60 8 67 3 76 5" fill="none" stroke="#2F4BDB" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="77" cy="6" r="6" fill="#FF9600"/>' +
      '<path d="M60 16C94 16 110 42 110 70C110 100 90 114 60 114C30 114 10 100 10 70C10 42 26 16 60 16Z" fill="#4B66F0"/>' +
      '<ellipse cx="42" cy="38" rx="16" ry="9" fill="#fff" opacity=".2"/>' +
      '<circle cx="43" cy="62" r="14" fill="#fff"/><circle cx="77" cy="62" r="14" fill="#fff"/>' +
      '<circle class="pupil" cx="45" cy="64" r="6.5" fill="#0D1932"/><circle class="pupil" cx="79" cy="64" r="6.5" fill="#0D1932"/>' +
      '<circle cx="47.5" cy="61.5" r="2" fill="#fff"/><circle cx="81.5" cy="61.5" r="2" fill="#fff"/>' +
      '<circle cx="28" cy="84" r="6" fill="#FF8FA3" opacity=".55"/><circle cx="92" cy="84" r="6" fill="#FF8FA3" opacity=".55"/>' +
      '<path class="m-happy" d="M45 85Q60 106 75 85Z" fill="#0D1932"/>' +
      '<path class="m-sad" d="M47 98Q60 85 73 98" fill="none" stroke="#0D1932" stroke-width="4.5" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* ---------- sonido ---------- */
  function tono(freq, inicio, dur, tipo, vol) {
    var ctx = audioCtx, t0 = ctx.currentTime + inicio;
    var osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = tipo; osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  function sfx(kind) {
    if (!sonido) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      if (kind === "ok") { tono(659.25, 0, .16, "sine", .18); tono(880, .09, .22, "sine", .18); }
      else if (kind === "bad") { tono(246.9, 0, .18, "triangle", .2); tono(185, .12, .26, "triangle", .2); }
      else if (kind === "tick") { tono(520, 0, .06, "sine", .08); }
      else if (kind === "win") { [523.25, 659.25, 783.99, 1046.5].forEach(function (fr, i) { tono(fr, i * .11, .28, "sine", .18); }); }
      else if (kind === "lose") { [392, 330, 262].forEach(function (fr, i) { tono(fr, i * .16, .3, "triangle", .18); }); }
    } catch (e) {}
  }
  function pintarSonido() {
    els.snd.setAttribute("aria-pressed", sonido ? "true" : "false");
    els.snd.setAttribute("aria-label", sonido ? "Sonido activado" : "Sonido desactivado");
  }

  /* ---------- pantallas / HUD ---------- */
  function limpiarTimer() { if (S.timer) { clearInterval(S.timer); S.timer = null; } }

  function pantalla(nombre) {
    limpiarTimer();
    els.intro.hidden = nombre !== "intro";
    els.play.hidden = nombre !== "play";
    els.end.hidden = nombre !== "end";
    els.confetti.innerHTML = "";
  }

  function hud(golpe) {
    els.heartsN.textContent = S.vidas;
    els.hearts.classList.remove("hit");
    if (golpe) { void els.hearts.offsetWidth; els.hearts.classList.add("hit"); }
    els.streak.hidden = S.racha < 2;
    els.streakN.textContent = S.racha;
    els.bar.classList.toggle("zero", S.hechos === 0);
    els.barFill.style.width = Math.round(Math.min(S.hechos, TOTAL) / TOTAL * 100) + "%";
    els.bar.setAttribute("aria-valuenow", S.hechos);
    els.bar.setAttribute("aria-valuemax", TOTAL);
  }

  function boton(texto, modo, deshabilitado, oculto) {
    els.main.textContent = texto;
    els.main.className = "dl-btn" + (modo === "red" ? " dl-btn-red" : "");
    els.main.disabled = !!deshabilitado;
    els.main.hidden = !!oculto;
  }

  /* ---------- armado y flujo ---------- */
  function iniciar() {
    S = {
      cola: [
        { tipo: "bis" },
        { tipo: "cob" },
        { tipo: "mc" },
        { tipo: "nw" },
        { tipo: "nwx" },
        { tipo: "race" }
      ],
      hechos: 0, xp: 0, vidas: VIDAS, racha: 0, intentos: 0, aciertos: 0,
      inicio: Date.now(), sel: null, fase: "responder", q: null, timer: null,
      bis: { a: 1, b: 2 }
    };
    pantalla("play");
    els.modal.hidden = true;
    hud(false);
    siguiente();
  }

  var TEMAS = { bis: "Reto 1 — Bisección", cob: "Reto 2 — Punto fijo", mc: "Reto 2 — Punto fijo",
    nw: "Reto 3 — Newton", nwx: "Reto 3 — Newton", race: "Reto 4 — Carrera de convergencia" };
  var PREGUNTAS = {
    bis: "¿En qué mitad está la raíz de f(x) = x² − 2?",
    cob: "Prueba las tres fórmulas de iteración",
    mc: "Ya probaste las tres. ¿Cuál elegirías para aproximar la raíz de forma más eficiente?",
    nw: "Salta con la tangente hacia la raíz",
    nwx: "Reto extra: ¿qué pasa con x₀ = 0?",
    race: "¿Qué método llegará primero a 6 cifras de precisión?"
  };
  var PISTAS = {
    bis: "Observa el signo de f en cada extremo y en el punto medio: la raíz está donde ocurre el cambio de signo.",
    cob: "Todas tienen a √2 como punto fijo y empiezan en x₀ = 1. Toca cada una y mira el diagrama de telaraña.",
    mc: "",
    nw: "Elige un valor inicial x₀ (recomendado: entre 1 y 2) y observa cómo la tangente salta hacia la raíz.",
    nwx: "Con x₀ = 0 ocurre que f'(0) = 0. Este reto extra no quita corazones.",
    race: "Meta: un error menor a 0.000001. Elige antes de ver la carrera."
  };

  function siguiente() {
    limpiarTimer();
    if (!S.cola.length) { terminar(true); return; }
    var q = S.cola.shift();
    S.q = q; S.sel = null; S.fase = "responder";
    els.foot.setAttribute("data-fb", "none");
    els.fb.hidden = true; els.fb.innerHTML = "";
    els.tema.textContent = (q.repaso ? "Repaso — " : "") + TEMAS[q.tipo];
    els.tema.classList.toggle("repaso", !!q.repaso);
    els.pregunta.textContent = PREGUNTAS[q.tipo];
    els.area.innerHTML = "";
    if (PISTAS[q.tipo]) { var h = el("p", "dl-hint"); h.textContent = PISTAS[q.tipo]; els.area.appendChild(h); }

    if (q.tipo === "bis") { pintarBis(); boton("Comprobar", "green", true, false); }
    else if (q.tipo === "cob") { pintarCob(); boton("Continuar", "green", true, true); }
    else if (q.tipo === "mc") { pintarMc(); boton("Comprobar", "green", true, false); }
    else if (q.tipo === "nw") { pintarNw(); boton("Continuar", "green", true, true); }
    else if (q.tipo === "nwx") { pintarNwx(); boton("Comprobar", "green", true, false); }
    else if (q.tipo === "race") { pintarRace(); boton("Comprobar", "green", true, false); }
  }

  /* ---------- opciones reutilizables ---------- */
  function listaOpciones(textos, clase) {
    var lista = el("div", "dl-opts" + (clase ? " " + clase : ""));
    lista.setAttribute("role", "radiogroup");
    lista.setAttribute("aria-label", "Opciones de respuesta");
    textos.forEach(function (txt, i) {
      var b = el("button", "dl-opt");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", "false");
      var k = el("span", "dl-key"); k.textContent = i + 1;
      var t = el("span", "dl-opt-t"); t.textContent = txt;
      b.appendChild(k); b.appendChild(t);
      b.addEventListener("click", function () { elegir(i); });
      lista.appendChild(b);
    });
    els.area.appendChild(lista);
    return lista;
  }

  function opcionesBtn() { return els.area.querySelectorAll(".dl-opts .dl-opt"); }

  function elegir(i) {
    if (S.fase !== "responder" || !S.q) return;
    if (["bis", "mc", "nwx", "race"].indexOf(S.q.tipo) < 0) return;
    var bs = opcionesBtn();
    if (i >= bs.length) return;
    S.sel = i;
    for (var n = 0; n < bs.length; n++) bs[n].setAttribute("aria-checked", n === i ? "true" : "false");
    els.main.disabled = false;
    sfx("tick");
  }

  function marcar(okIdx, selIdx) {
    var bs = opcionesBtn();
    for (var n = 0; n < bs.length; n++) {
      bs[n].disabled = true;
      if (n === okIdx) bs[n].classList.add("is-ok");
      else if (n === selIdx) bs[n].classList.add("is-bad");
      else bs[n].classList.add("is-dim");
    }
  }

  /* ---------- Reto 1: bisección ---------- */
  function pct1(x) { return Math.max(0, Math.min(100, (x - 1) * 100)); }

  function pintarBis() {
    var a = S.bis.a, b = S.bis.b, m = (a + b) / 2;
    var fa = f(a), fm = f(m), fb = f(b);
    var wrap = el("div", "g2-numberline-wrap");
    wrap.innerHTML =
      '<div class="g2-numberline">' +
        '<div class="g2-nl-interval" style="left:' + pct1(a) + '%;width:' + (pct1(b) - pct1(a)) + '%"></div>' +
        '<div class="g2-nl-mid" style="left:' + pct1(m) + '%"></div>' +
        '<div class="g2-nl-root" style="left:41.42%"></div>' +
        '<span class="g2-nl-label" style="left:0%">1.0</span>' +
        '<span class="g2-nl-label" style="left:100%">2.0</span>' +
        '<span class="g2-nl-label g2-nl-label-root" style="left:41.42%">raíz real ≈1.4142</span>' +
      '</div>';
    els.area.appendChild(wrap);

    function span(v) { return '<span class="' + (v >= 0 ? "pos" : "neg") + '">' + v.toFixed(4) + "</span>"; }
    var vals = el("div", "g2-values");
    vals.innerHTML =
      "f(a=" + a.toFixed(4) + ") = " + span(fa) + "<br>" +
      "f(m=" + m.toFixed(4) + ") = " + span(fm) + "<br>" +
      "f(b=" + b.toFixed(4) + ") = " + span(fb);
    els.area.appendChild(vals);

    listaOpciones(["Izquierda: [a, m]", "Derecha: [m, b]"], "dl-opts-tf");

    var nota = el("p", "dl-note");
    nota.textContent = "Ancho del intervalo: " + (b - a).toFixed(4) + " (meta: menor que " + TOL_BIS + ")";
    els.area.appendChild(nota);
  }

  function comprobarBis() {
    var r = S.bis, m = (r.a + r.b) / 2;
    var izq = sign(f(r.a)) !== sign(f(m));
    var okIdx = izq ? 0 : 1;
    var ok = S.sel === okIdx;
    marcar(okIdx, S.sel);
    var rep = !!S.q.repaso;
    if (ok) {
      if (izq) r.b = m; else r.a = m;
      if ((r.b - r.a) >= TOL_BIS) S.cola.unshift({ tipo: "bis" });
      cerrar({ ok: true, xp: rep ? 5 : 10,
        lineas: [{ t: "Hay cambio de signo en esa mitad: la raíz sigue encerrada en [" + r.a.toFixed(4) + ", " + r.b.toFixed(4) + "]." }] });
    } else {
      S.cola.unshift({ tipo: "bis", repaso: true });
      cerrar({ ok: false, vida: true, titulo: "Esa mitad no tiene la raíz",
        lineas: [{ t: "Ahí no hay cambio de signo: la raíz está en la otra mitad (" + (izq ? "izquierda" : "derecha") + ")." },
                 { t: "Con una mitad equivocada el intervalo perdería la raíz. Inténtalo de nuevo." }] });
    }
  }

  /* ---------- Reto 2: punto fijo (telaraña) ---------- */
  function drawCobwebAxes(canvas, gFn) {
    var ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height, pad = 30, xmin = 0, xmax = 3;
    function px(v) { return pad + (v - xmin) / (xmax - xmin) * (W - 2 * pad); }
    function py(v) { return H - pad - (v - xmin) / (xmax - xmin) * (H - 2 * pad); }

    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#DAE2F0";
    ctx.strokeRect(pad, pad, W - 2 * pad, H - 2 * pad);
    ctx.strokeStyle = "#2F4BDB";
    ctx.beginPath(); ctx.moveTo(px(xmin), py(xmin)); ctx.lineTo(px(xmax), py(xmax)); ctx.stroke();

    if (gFn) {
      ctx.strokeStyle = "#0D1932"; ctx.lineWidth = 1.6; ctx.beginPath();
      var first = true;
      for (var xv = 0.05; xv <= xmax; xv += 0.03) {
        var yv = gFn(xv);
        if (!isFinite(yv) || yv < xmin - 1 || yv > xmax + 1) { first = true; continue; }
        var X = px(xv), Y = py(yv);
        if (first) { ctx.moveTo(X, Y); first = false; } else { ctx.lineTo(X, Y); }
      }
      ctx.stroke();
    }
    ctx.fillStyle = "#46536F";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.fillText("y = x", px(2.6) - 4, py(2.6) - 6);
    if (gFn) ctx.fillText("y = g(x)", px(2.6), py(gFn(2.6) || 0) + 12);
    return { px: px, py: py };
  }

  function pintarCob() {
    S.cob = { tried: {}, busy: false, btns: {} };
    var grupo = el("div", "dl-labopts");
    [["A", "(x + 2/x) / 2"], ["B", "x − (x²−2)/4"], ["C", "x − (x²−2)"]].forEach(function (p) {
      var b = el("button", "dl-opt");
      b.type = "button";
      b.innerHTML = '<span>Probar g<sub>' + p[0] + '</sub></span><small>g(x) = ' + p[1] + '</small>';
      b.addEventListener("click", function () { probarG(p[0], b); });
      S.cob.btns[p[0]] = b;
      grupo.appendChild(b);
    });
    els.area.appendChild(grupo);
    var canvas = el("canvas", "g2-canvas");
    canvas.width = 440; canvas.height = 380;
    els.area.appendChild(canvas);
    var nota = el("p", "dl-note");
    els.area.appendChild(nota);
    S.cob.canvas = canvas; S.cob.nota = nota;
    drawCobwebAxes(canvas);
  }

  function probarG(key, btn) {
    var C = S.cob;
    if (C.busy || C.tried[key]) return;
    C.busy = true;
    sfx("tick");
    var g = gFns[key].fn;
    var result = runFixedPoint(g, 1.0, 12);
    var coords = drawCobwebAxes(C.canvas, g);
    var ctx = C.canvas.getContext("2d");
    ctx.strokeStyle = "#E4511E"; ctx.lineWidth = 1.4;
    C.nota.className = "dl-note"; C.nota.textContent = "Iterando " + gFns[key].label + " …";
    var hist = result.hist, i = 0;
    S.timer = setInterval(function () {
      if (i >= hist.length - 1) {
        limpiarTimer();
        C.tried[key] = true; C.busy = false;
        btn.classList.add(result.converged ? "is-ok" : "is-bad");
        btn.disabled = true;
        if (result.converged) {
          C.nota.className = "dl-note ok";
          C.nota.textContent = gFns[key].label + " → converge en " + result.iters + " iteraciones a x ≈ " + hist[hist.length - 1].toFixed(4) + ".";
          sfx("ok");
        } else {
          C.nota.className = "dl-note bad";
          C.nota.textContent = gFns[key].label + " → no se estabiliza (oscila o se dispara). No converge.";
          sfx("bad");
        }
        if (Object.keys(C.tried).length === 3) {
          cerrar({ ok: true, xp: 0, titulo: "¡Exploración completa!",
            lineas: [{ t: "Ya viste cómo se comporta cada fórmula. Ahora decide cuál usarías." }] });
        }
        return;
      }
      var x0v = hist[i], x1v = hist[i + 1];
      ctx.beginPath(); ctx.moveTo(coords.px(x0v), coords.py(x0v)); ctx.lineTo(coords.px(x0v), coords.py(x1v)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(coords.px(x0v), coords.py(x1v)); ctx.lineTo(coords.px(x1v), coords.py(x1v)); ctx.stroke();
      i++;
    }, reduceMotion ? 30 : 350);
  }

  function pintarMc() {
    var ops = mezclar([
      { t: "g_A(x): converge en 5 iteraciones", k: "A" },
      { t: "g_B(x): converge en 12 iteraciones", k: "B" },
      { t: "g_C(x): nunca se estabiliza", k: "C" }
    ]);
    S.q.ops = ops;
    listaOpciones(ops.map(function (o) { return o.t; }));
  }

  function comprobarMc() {
    var ops = S.q.ops, k = ops[S.sel].k;
    var okIdx = 0;
    ops.forEach(function (o, i) { if (o.k === "A") okIdx = i; });
    marcar(okIdx, k === "A" ? -1 : S.sel);
    var rep = !!S.q.repaso;
    if (k === "A") {
      cerrar({ ok: true, xp: rep ? 10 : 30,
        lineas: [{ t: "g_A converge más rápido (5 iteraciones): es esencialmente el método de Newton disfrazado de punto fijo." }] });
    } else if (k === "B") {
      cerrar({ ok: false, parcial: true, xp: 10, titulo: "¡Casi!",
        lineas: [{ t: "g_B sí converge, pero en 12 iteraciones: mucho más lento que g_A." }] });
    } else {
      var copia = {}; for (var p in S.q) copia[p] = S.q[p];
      copia.repaso = true; copia.ops = null;
      S.cola.push(copia);
      cerrar({ ok: false, vida: true, titulo: "Esa fórmula diverge",
        lineas: [{ t: "g_A: converge en 5 iteraciones.", cls: "dl-ans" },
                 { t: "g_C oscila entre 0 y 2 sin estabilizarse: nunca la usarías para aproximar la raíz." }] });
    }
  }

  /* ---------- Reto 3: Newton ---------- */
  function newtonCoords(canvas) {
    var W = canvas.width, H = canvas.height, pad = 30, xmin = -0.6, xmax = 3, ymin = -3, ymax = 7.5;
    return {
      px: function (v) { return pad + (v - xmin) / (xmax - xmin) * (W - 2 * pad); },
      py: function (v) { return H - pad - (v - ymin) / (ymax - ymin) * (H - 2 * pad); }
    };
  }

  function drawNewtonBase(canvas) {
    var ctx = canvas.getContext("2d"), W = canvas.width, H = canvas.height, c = newtonCoords(canvas);
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#DAE2F0"; ctx.strokeRect(30, 30, W - 60, H - 60);
    ctx.strokeStyle = "#8E9BB8";
    ctx.beginPath(); ctx.moveTo(c.px(-0.6), c.py(0)); ctx.lineTo(c.px(3), c.py(0)); ctx.stroke();
    ctx.strokeStyle = "#0D1932"; ctx.lineWidth = 1.6; ctx.beginPath();
    var first = true;
    for (var x = -0.6; x <= 3; x += 0.02) {
      var X = c.px(x), Y = c.py(f(x));
      if (first) { ctx.moveTo(X, Y); first = false; } else { ctx.lineTo(X, Y); }
    }
    ctx.stroke();
    ctx.fillStyle = "#46536F"; ctx.font = "11px JetBrains Mono, monospace";
    ctx.fillText("f(x) = x² − 2", c.px(2.0), c.py(f(2.0)) - 10);
    ctx.strokeStyle = "#E4511E"; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(c.px(ROOT), c.py(-3)); ctx.lineTo(c.px(ROOT), c.py(7.5)); ctx.stroke();
    ctx.setLineDash([]);
    return c;
  }

  function plotPoint(canvas, c, x, y, color) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(c.px(x), c.py(y), 4, 0, Math.PI * 2); ctx.fill();
  }

  function pintarNw() {
    var fila = el("div", "g2-x0-row");
    fila.innerHTML = '<label for="g2-x0-input">x₀ =</label>' +
      '<input id="g2-x0-input" type="number" step="0.1" value="1.8">';
    var trazar = el("button", "dl-btn dl-btn-blue dl-btn-sm"); trazar.type = "button"; trazar.textContent = "Trazar tangente";
    var saltar = el("button", "dl-btn dl-btn-sm"); saltar.type = "button"; saltar.textContent = "Saltar con la tangente"; saltar.hidden = true;
    fila.appendChild(trazar); fila.appendChild(saltar);
    els.area.appendChild(fila);
    var canvas = el("canvas", "g2-canvas"); canvas.width = 440; canvas.height = 360;
    els.area.appendChild(canvas);
    var nota = el("p", "dl-note"); els.area.appendChild(nota);
    var input = fila.querySelector("input");
    S.nw = { input: input, trazar: trazar, saltar: saltar, canvas: canvas, nota: nota, x: null, iter: 0, done: true };
    drawNewtonBase(canvas);

    trazar.addEventListener("click", comenzarNewton);
    saltar.addEventListener("click", saltoNewton);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); comenzarNewton(); } });
  }

  function comenzarNewton() {
    var N = S.nw;
    var x0 = parseFloat(N.input.value);
    if (isNaN(x0)) { N.nota.className = "dl-note bad"; N.nota.textContent = "Escribe un número para x₀."; return; }
    N.x = x0; N.iter = 0; N.done = false;
    var c = drawNewtonBase(N.canvas);
    plotPoint(N.canvas, c, x0, f(x0), "#2F4BDB");
    N.nota.className = "dl-note";
    N.nota.textContent = "x₀ = " + x0.toFixed(4) + "  →  f(x₀) = " + f(x0).toFixed(4);
    N.saltar.hidden = false; N.saltar.textContent = "Saltar con la tangente";
    N.trazar.disabled = true; N.input.disabled = true;
    sfx("tick");
  }

  function terminarIntentoNewton(convergio) {
    var N = S.nw;
    N.done = true; N.saltar.hidden = true;
    if (convergio) {
      var pts = Math.max(10, Math.min(50, 50 - 8 * (N.iter - 1)));
      cerrar({ ok: true, xp: pts, titulo: "¡Convergió!",
        lineas: [{ t: "En " + N.iter + " salto(s) llegaste a x ≈ " + N.x.toFixed(6) + ". Menos saltos, más XP." }] });
    } else {
      sfx("bad");
      N.input.disabled = false; N.trazar.disabled = false;
      N.trazar.textContent = "Reintentar con otro x₀";
    }
  }

  function saltoNewton() {
    var N = S.nw;
    if (!N || N.done) return;
    var canvas = N.canvas, ctx = canvas.getContext("2d"), c = newtonCoords(canvas);
    var x = N.x, fx = f(x), d = fp(x);

    if (Math.abs(d) < 1e-9) {
      ctx.strokeStyle = "#E4511E"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(c.px(-0.6), c.py(fx)); ctx.lineTo(c.px(3), c.py(fx)); ctx.stroke();
      N.nota.className = "dl-note bad";
      N.nota.textContent = "f'(x) = 0 → la tangente queda horizontal y nunca cruza el eje x. Newton se atasca aquí. Prueba con otro x₀.";
      terminarIntentoNewton(false);
      return;
    }

    var x1 = x - fx / d;
    ctx.strokeStyle = "#2F4BDB"; ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(c.px(x - 0.4), c.py(fx + d * (-0.4)));
    ctx.lineTo(c.px(x1 + 0.4), c.py(fx + d * (x1 + 0.4 - x)));
    ctx.stroke();
    plotPoint(canvas, c, x1, 0, "#E4511E");
    ctx.strokeStyle = "#46536F"; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(c.px(x1), c.py(0)); ctx.lineTo(c.px(x1), c.py(f(x1))); ctx.stroke();
    ctx.setLineDash([]);
    plotPoint(canvas, c, x1, f(x1), "#0D1932");

    N.iter++; N.x = x1; sfx("tick");

    if (!isFinite(x1) || Math.abs(x1) > 1e5) {
      N.nota.className = "dl-note bad";
      N.nota.textContent = "El salto se disparó a un valor enorme: diverge. Prueba con otro x₀.";
      terminarIntentoNewton(false); return;
    }
    if (Math.abs(f(x1)) < 1e-6) {
      N.nota.className = "dl-note ok";
      N.nota.textContent = "✓ Convergió en " + N.iter + " salto(s) a x ≈ " + x1.toFixed(6) + " (f(x) ≈ 0).";
      terminarIntentoNewton(true); return;
    }
    if (N.iter >= 8) {
      N.nota.className = "dl-note bad";
      N.nota.textContent = "No convergió en 8 saltos con ese x₀. Prueba con otro valor.";
      terminarIntentoNewton(false); return;
    }
    N.nota.className = "dl-note";
    N.nota.textContent = "Salto " + N.iter + ": x = " + x1.toFixed(6) + "  →  f(x) = " + f(x1).toFixed(6);
  }

  function pintarNwx() {
    listaOpciones([
      "Converge rápido a √2",
      "La tangente es horizontal y Newton se atasca",
      "Converge a −√2"
    ]);
    var canvas = el("canvas", "g2-canvas"); canvas.width = 440; canvas.height = 360;
    canvas.hidden = true;
    els.area.appendChild(canvas);
    S.nwxCanvas = canvas;
  }

  function comprobarNwx() {
    var okIdx = 1, ok = S.sel === okIdx;
    marcar(okIdx, S.sel);
    var canvas = S.nwxCanvas;
    canvas.hidden = false;
    var c = drawNewtonBase(canvas), ctx = canvas.getContext("2d");
    plotPoint(canvas, c, 0, f(0), "#2F4BDB");
    ctx.strokeStyle = "#E4511E"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(c.px(-0.6), c.py(f(0))); ctx.lineTo(c.px(3), c.py(f(0))); ctx.stroke();
    var txt = "Con x₀ = 0, f'(0) = 0: la tangente es horizontal y nunca corta el eje x. Un buen valor inicial importa tanto como el método.";
    if (ok) cerrar({ ok: true, xp: 10, lineas: [{ t: txt }] });
    else cerrar({ ok: false, titulo: "Respuesta correcta:", lineas: [{ t: "La tangente es horizontal y Newton se atasca", cls: "dl-ans" }, { t: txt }] });
  }

  /* ---------- Reto 4: carrera de convergencia ---------- */
  var NOMBRES = { bis: "Bisección", pf: "Punto fijo (g_A)", nw: "Newton" };
  var CLAVES = ["bis", "pf", "nw"];

  function pintarRace() {
    listaOpciones(["Bisección", "Punto fijo (g_A)", "Newton"]);
  }

  function comprobarRace() {
    var pred = CLAVES[S.sel];
    marcar(-1, -1);
    var bs = opcionesBtn();
    for (var n = 0; n < bs.length; n++) { bs[n].classList.remove("is-dim", "is-bad"); if (n === S.sel) bs[n].setAttribute("aria-checked", "true"); }
    S.fase = "corriendo";
    boton("Comprobar", "green", true, true);

    var race = el("div", "g2-race");
    var bars = {}, stepsEl = {};
    CLAVES.forEach(function (k) {
      var tr = el("div", "g2-track");
      var lab = el("span", "g2-track-label"); lab.textContent = NOMBRES[k];
      var bar = el("div", "g2-track-bar"); var fill = el("div", "g2-track-fill"); bar.appendChild(fill);
      var st = el("span", "g2-track-steps");
      tr.appendChild(lab); tr.appendChild(bar); tr.appendChild(st);
      race.appendChild(tr);
      bars[k] = fill; stepsEl[k] = st;
    });
    els.area.appendChild(race);

    var steps = {
      bis: runBisectionSteps(1e-6),
      pf: runFixedPointSteps(gFns.A.fn, 1.0, 1e-6, 40),
      nw: runNewtonSteps(1.5, 1e-6, 20)
    };
    steps.pf = steps.pf || steps.bis;
    steps.nw = steps.nw || steps.bis;
    var maxTick = steps.bis, winner = null, tick = 0;

    S.timer = setInterval(function () {
      tick++;
      CLAVES.forEach(function (k) {
        bars[k].style.width = Math.min(100, tick / steps[k] * 100) + "%";
        if (tick >= steps[k] && !stepsEl[k].textContent) stepsEl[k].textContent = steps[k] + " it.";
      });
      if (!winner) {
        if (tick >= steps.nw) winner = "nw";
        else if (tick >= steps.pf) winner = "pf";
        else if (tick >= steps.bis) winner = "bis";
        if (winner) bars[winner].classList.add("winner");
      }
      if (tick >= maxTick) {
        limpiarTimer();
        var ok = pred === winner;
        var resumen = NOMBRES[winner] + " ganó con " + steps[winner] + " iteraciones (Bisección: " + steps.bis +
          ", Punto fijo: " + steps.pf + ", Newton: " + steps.nw + ").";
        var orden = "Refleja su orden de convergencia: lineal, lineal más rápido y cuadrático.";
        cerrar({ ok: ok, xp: ok ? 20 : 0, titulo: ok ? "¡Adivinaste!" : "No era esa",
          lineas: [{ t: resumen }, { t: orden }] });
      }
    }, reduceMotion ? 40 : 260);
  }

  /* ---------- cierre de un ejercicio ---------- */
  function comprobar() {
    if (S.fase !== "responder" || S.sel === null) return;
    var t = S.q.tipo;
    if (t === "bis") comprobarBis();
    else if (t === "mc") comprobarMc();
    else if (t === "nwx") comprobarNwx();
    else if (t === "race") comprobarRace();
  }

  function cerrar(o) {
    S.fase = "feedback";
    S.intentos += 1;
    var kind;
    if (o.ok) {
      S.aciertos += 1; S.racha += 1; S.hechos += 1; kind = "ok";
    } else if (o.parcial) {
      S.racha = 0; S.hechos += 1; kind = "warn";
    } else {
      S.racha = 0; kind = "bad";
      if (!o.vida) S.hechos += 1; // sin corazón de por medio: cuenta como visto
    }
    S.xp += o.xp || 0;
    if (o.vida) S.vidas -= 1;

    var titulo = o.titulo || (kind === "ok" ? (S.racha >= 3 ? "¡Racha de " + S.racha + "!" : ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)]) : "Respuesta correcta:");
    mostrarFeedback(kind, titulo, o.lineas || []);
    if (kind === "bad") boton(S.vidas <= 0 ? "Ver resultado" : "Entendido", "red", false, false);
    else boton("Continuar", "green", false, false);
    sfx(kind === "bad" ? "bad" : "ok");
    hud(!!o.vida);
    els.main.focus();
  }

  function mostrarFeedback(tipo, titulo, lineas) {
    els.foot.setAttribute("data-fb", tipo);
    els.fb.innerHTML = '<span class="dl-fb-m">' + mascot(tipo === "bad" ? "sad" : "happy") + '</span><div class="dl-fb-t"></div>';
    var cont = els.fb.querySelector(".dl-fb-t");
    var h = el("h3"); h.textContent = titulo; cont.appendChild(h);
    lineas.forEach(function (l) { var p = el("p", l.cls); p.textContent = l.t; cont.appendChild(p); });
    els.fb.hidden = false;
  }

  function principal() {
    if (S.fase === "responder") { comprobar(); return; }
    if (S.fase === "corriendo") return;
    if (S.vidas <= 0) { terminar(false); return; }
    siguiente();
  }

  /* ---------- fin ---------- */
  function terminar(completa) {
    S.fin = Date.now();
    pantalla("end");
    var prec = S.intentos ? Math.round(S.aciertos / S.intentos * 100) : 0;
    var seg = Math.max(1, Math.round((S.fin - S.inicio) / 1000));
    var tiempo = Math.floor(seg / 60) + ":" + ("0" + (seg % 60)).slice(-2);

    els.endMascot.innerHTML = mascot(completa ? "happy" : "sad");
    els.endTitle.textContent = completa ? "¡Recorrido completado!" : "Te quedaste sin corazones";
    els.xp.textContent = S.xp;
    els.prec.textContent = prec + "%";
    els.time.textContent = tiempo;
    els.endScore.textContent = "Puntaje: " + S.xp + " / ~" + XP_MAX;

    var msg;
    if (!completa) {
      msg = "Perder corazones suele significar confundir el criterio de bisección o elegir una fórmula de punto fijo que diverge. Repasa esos dos temas y vuelve a intentarlo.";
    } else if (S.xp >= 130) {
      msg = "Excelente: entiendes cómo se acota una raíz, qué hace que una iteración de punto fijo converja, y por qué Newton es tan rápido cuando el punto de partida es razonable.";
    } else if (S.xp >= 80) {
      msg = "Buen resultado. Repasa el tema donde perdiste más puntos y vuelve a jugar para afinar la intuición.";
    } else {
      msg = "Vale la pena repasar bisección, punto fijo y Newton en el menú \"Temas\" antes de volver a intentarlo.";
    }
    els.endMsg.textContent = msg;

    if (completa) { sfx("win"); confeti(); } else { sfx("lose"); }
    els.replay.focus();
  }

  function confeti() {
    if (reduceMotion) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 70; i++) {
      var p = document.createElement("i");
      p.style.left = (Math.random() * 100) + "%";
      p.style.background = COLORES[i % COLORES.length];
      p.style.animationDelay = (Math.random() * 0.7) + "s";
      p.style.animationDuration = (2.2 + Math.random() * 1.4) + "s";
      p.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
      p.style.setProperty("--rot", (Math.random() * 900 - 450) + "deg");
      frag.appendChild(p);
    }
    els.confetti.appendChild(frag);
    setTimeout(function () { els.confetti.innerHTML = ""; }, 4800);
  }

  /* ---------- teclado ---------- */
  function teclado(e) {
    if (els.play.hidden || !els.modal.hidden) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && t.tagName === "INPUT") return;
    if (S.fase === "responder" && /^[1-3]$/.test(e.key) && opcionesBtn().length) {
      e.preventDefault(); elegir(parseInt(e.key, 10) - 1); return;
    }
    if (e.key === "Enter") {
      if (t && t.classList && t.classList.contains("dl-opt") && S.fase === "responder") {
        if (t.getAttribute("aria-checked") === "true" && !els.main.disabled) { e.preventDefault(); els.main.click(); }
        return;
      }
      if (t && t.tagName === "BUTTON") return;
      if (!els.main.disabled && !els.main.hidden) { e.preventDefault(); els.main.click(); }
    }
  }

  /* ---------- init ---------- */
  function init() {
    var ids = { intro: "dl-intro", play: "g2-play", end: "g2-end", startBtn: "g2-start-btn",
      bar: "dl-bar", barFill: "dl-bar-fill", hearts: "g2-lives", heartsN: "dl-hearts-n",
      streak: "dl-streak", streakN: "dl-streak-n", snd: "dl-sound", quit: "dl-quit",
      tema: "g2-round-label", pregunta: "g2-pregunta", area: "dl-area", foot: "dl-foot", fb: "g2-feedback",
      main: "g2-check-btn", endMascot: "dl-end-mascot", endTitle: "g2-end-title", xp: "dl-xp", prec: "dl-prec",
      time: "dl-time", endScore: "g2-end-score", endMsg: "g2-end-msg", replay: "g2-replay-btn",
      modal: "dl-modal", stay: "dl-stay", leave: "dl-leave", confetti: "dl-confetti", heroM: "dl-hero-m" };
    for (var k in ids) els[k] = $(ids[k]);
    if (!els.intro || !els.startBtn) return; // no estamos en esta página

    els.heroM.innerHTML = mascot("happy");
    els.modal.querySelector(".dl-mascot-s").innerHTML = mascot("sad");
    pintarSonido();

    els.startBtn.addEventListener("click", iniciar);
    els.replay.addEventListener("click", iniciar);
    els.main.addEventListener("click", principal);
    els.snd.addEventListener("click", function () {
      sonido = !sonido;
      try { localStorage.setItem("mn-sound", sonido ? "on" : "off"); } catch (e) {}
      pintarSonido(); sfx("tick");
    });
    els.quit.addEventListener("click", function () { els.modal.hidden = false; els.stay.focus(); });
    els.stay.addEventListener("click", function () { els.modal.hidden = true; });
    els.leave.addEventListener("click", function () { els.modal.hidden = true; pantalla("intro"); els.startBtn.focus(); });
    document.addEventListener("keydown", teclado);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
