// Juego "Cazador de errores" — lección de repaso de la Unidad 1 con dinámica tipo Duolingo
// (Introducción, Representación de números, Aritmética de punto flotante,
// Errores de redondeo, Algoritmos y convergencia, Python)

(function () {
  "use strict";

  var BANCO = [
    {
      tema: "Introducción",
      pregunta: "¿Por qué se usan métodos numéricos en ingeniería?",
      opciones: [
        "Porque siempre dan el valor exacto, sin ningún error",
        "Porque permiten aproximar soluciones cuando no hay una fórmula cerrada o esta es impráctica de calcular",
        "Porque reemplazan por completo la necesidad de entender el modelo matemático",
        "Porque solo sirven para graficar funciones"
      ],
      correcta: 1,
      feedback: "Los métodos numéricos aproximan soluciones —con un error controlado— cuando la vía analítica no existe o no es viable."
    },
    {
      tema: "Introducción",
      pregunta: "Un método numérico típicamente convierte un problema matemático en:",
      opciones: [
        "Una demostración formal",
        "Una secuencia finita de operaciones aritméticas repetibles (un algoritmo)",
        "Una tabla de valores medidos en laboratorio",
        "Un diagrama de flujo sin cálculos"
      ],
      correcta: 1,
      feedback: "La idea central es un algoritmo: pasos aritméticos repetibles que un computador puede ejecutar."
    },
    {
      tema: "Introducción",
      pregunta: "¿Cuál de estas NO es una razón para usar un método numérico?",
      opciones: [
        "El problema no tiene solución analítica conocida",
        "La solución analítica existe pero es demasiado costosa de evaluar",
        "Se necesita una aproximación rápida con una tolerancia aceptable",
        "El resultado debe ser matemáticamente perfecto, sin ningún margen de error"
      ],
      correcta: 3,
      feedback: "Todo método numérico trabaja con una aproximación: siempre existe algún margen de error, por pequeño que sea."
    },

    {
      tema: "Representación de números",
      pregunta: "¿Por qué un computador no puede representar todos los números reales de forma exacta?",
      opciones: [
        "Porque usa una cantidad finita de bits para representar cada número",
        "Porque los reales no existen matemáticamente",
        "Porque solo puede almacenar números enteros",
        "Porque los procesadores modernos ya no usan números binarios"
      ],
      correcta: 0,
      feedback: "Con un número finito de bits solo se puede representar un subconjunto finito de los infinitos números reales."
    },
    {
      tema: "Representación de números",
      pregunta: "El estándar más usado para representar números en punto flotante en los computadores es:",
      opciones: [
        "ASCII",
        "IEEE 754",
        "Unicode UTF-8",
        "RGB de 24 bits"
      ],
      correcta: 1,
      feedback: "IEEE 754 define cómo se representan signo, exponente y mantisa en precisión simple y doble."
    },
    {
      tema: "Representación de números",
      pregunta: "En la representación en punto flotante, la 'mantisa' (o significando) determina principalmente:",
      opciones: [
        "El rango de exponentes disponible",
        "El signo del número",
        "La precisión (cifras significativas) del número",
        "El tipo de dato del lenguaje de programación"
      ],
      correcta: 2,
      feedback: "La mantisa guarda las cifras significativas: a más bits de mantisa, mayor precisión."
    },

    {
      tema: "Aritmética de punto flotante",
      pregunta: "¿Qué puede ocurrir al sumar un número muy pequeño con uno muy grande en aritmética de punto flotante?",
      opciones: [
        "El resultado siempre es exacto, sin importar la magnitud",
        "El número pequeño puede perderse por completo (no afecta el resultado)",
        "El computador siempre lanza un error de compilación",
        "Se convierte automáticamente en un número entero"
      ],
      correcta: 1,
      feedback: "Si la diferencia de magnitud supera la precisión disponible, el valor pequeño puede quedar absorbido y perderse."
    },
    {
      tema: "Aritmética de punto flotante",
      pregunta: "La 'cancelación catastrófica' ocurre cuando:",
      opciones: [
        "Se multiplican dos números negativos",
        "Se restan dos números casi iguales, amplificando el error relativo del resultado",
        "Se divide un número por 1",
        "Un programa se cierra sin guardar los datos"
      ],
      correcta: 1,
      feedback: "Al restar cantidades casi iguales, las cifras significativas coincidentes se cancelan y el error relativo del resultado crece mucho."
    },

    {
      tema: "Errores de redondeo",
      pregunta: "El error absoluto se define como:",
      opciones: [
        "|valor real − valor aproximado|",
        "valor real ÷ valor aproximado",
        "valor aproximado − 1",
        "|valor real| + |valor aproximado|"
      ],
      correcta: 0,
      feedback: "Ea = |x_real − x_aprox|: la diferencia, en valor absoluto, entre el valor real y el aproximado."
    },
    {
      tema: "Errores de redondeo",
      pregunta: "El error relativo suele preferirse sobre el absoluto porque:",
      opciones: [
        "Es más fácil de calcular con una calculadora",
        "Expresa el error en proporción a la magnitud del valor real, permitiendo comparar errores entre cantidades muy distintas",
        "Siempre da un valor menor que el error absoluto",
        "No depende del valor real, solo del aproximado"
      ],
      correcta: 1,
      feedback: "Er = Ea / |x_real| pone el error en contexto: un mismo error absoluto puede ser insignificante o enorme según la magnitud del valor real."
    },
    {
      tema: "Errores de redondeo",
      pregunta: "El error de truncamiento se origina principalmente por:",
      opciones: [
        "La limitación de bits del hardware",
        "Simplificar un proceso infinito (por ejemplo, una serie) a un número finito de términos",
        "Errores humanos al digitar datos",
        "Fallas eléctricas en el computador"
      ],
      correcta: 1,
      feedback: "El truncamiento aparece al cortar un proceso matemáticamente infinito (una serie, un límite) en un número finito de pasos."
    },

    {
      tema: "Algoritmos y convergencia",
      pregunta: "Se dice que un algoritmo numérico 'converge' cuando:",
      opciones: [
        "Deja de ejecutarse por un error",
        "Sus resultados se acercan cada vez más a la solución real a medida que aumentan las iteraciones",
        "Utiliza menos memoria que otros algoritmos",
        "Se ejecuta en un solo paso"
      ],
      correcta: 1,
      feedback: "La convergencia describe que, iteración tras iteración, la aproximación se acerca a la solución verdadera."
    },
    {
      tema: "Algoritmos y convergencia",
      pregunta: "Un 'criterio de parada' en un algoritmo iterativo sirve para:",
      opciones: [
        "Decidir cuándo detener las iteraciones, típicamente cuando el error estimado es menor que una tolerancia",
        "Elegir el lenguaje de programación a usar",
        "Aumentar la precisión del hardware",
        "Cambiar el signo del resultado final"
      ],
      correcta: 0,
      feedback: "Sin un criterio de parada (tolerancia, número máximo de iteraciones), un algoritmo iterativo podría no terminar nunca."
    },

    {
      tema: "Python",
      pregunta: "En Python, ¿qué tipo de dato se usa por defecto para representar números decimales en punto flotante?",
      opciones: [
        "int",
        "float",
        "str",
        "bool"
      ],
      correcta: 1,
      feedback: "El tipo float de Python implementa números en punto flotante de doble precisión (IEEE 754)."
    },
    {
      tema: "Python",
      pregunta: "¿Por qué en Python la expresión 0.1 + 0.2 no da exactamente 0.3?",
      opciones: [
        "Porque Python tiene un error de programación",
        "Porque 0.1 y 0.2 no tienen representación binaria finita exacta en punto flotante",
        "Porque Python trunca automáticamente todos los decimales",
        "Porque la suma de floats no está permitida en Python"
      ],
      correcta: 1,
      feedback: "0.1 y 0.2 son fracciones periódicas en binario; su representación finita introduce un pequeño error de redondeo, visible en el resultado."
    }
  ];

  var VF = [
    { tema: "Representación de números", texto: "Un computador puede representar exactamente todos los números reales.", v: false,
      feedback: "Con una cantidad finita de bits solo se representa un subconjunto de los reales." },
    { tema: "Representación de números", texto: "IEEE 754 es el estándar de punto flotante más usado en los computadores.", v: true,
      feedback: "IEEE 754 define signo, exponente y mantisa en precisión simple y doble." },
    { tema: "Aritmética de punto flotante", texto: "Restar dos números casi iguales puede amplificar el error relativo del resultado.", v: true,
      feedback: "Es la cancelación catastrófica: se pierden las cifras significativas que coinciden." },
    { tema: "Errores de redondeo", texto: "El error absoluto se calcula como |x_real − x_aprox|.", v: true,
      feedback: "Ea es la diferencia, en valor absoluto, entre el valor real y el aproximado." },
    { tema: "Errores de redondeo", texto: "El error de truncamiento se debe a la cantidad de bits que tiene el hardware.", v: false,
      feedback: "Eso es el error de redondeo. El truncamiento aparece al cortar un proceso infinito en pasos finitos." },
    { tema: "Algoritmos y convergencia", texto: "Un criterio de parada decide cuándo detener las iteraciones de un algoritmo.", v: true,
      feedback: "Sin tolerancia o número máximo de iteraciones, un método iterativo podría no terminar nunca." },
    { tema: "Python", texto: "En Python, la expresión 0.1 + 0.2 es exactamente igual a 0.3.", v: false,
      feedback: "0.1 y 0.2 no tienen representación binaria finita exacta, así que aparece un pequeño error de redondeo." }
  ];

  var PARES = [
    { tema: "Errores", pares: [
      ["Error absoluto", "|x_real − x_aprox|"],
      ["Error relativo", "Ea ÷ |x_real|"],
      ["Truncamiento", "Cortar una serie infinita"],
      ["Redondeo", "Límite de bits del hardware"] ] },
    { tema: "Representación y aritmética", pares: [
      ["IEEE 754", "Estándar de punto flotante"],
      ["Mantisa", "Cifras significativas"],
      ["float", "Decimal en Python"],
      ["Cancelación", "Restar números casi iguales"] ] },
    { tema: "Algoritmos", pares: [
      ["Converge", "Se acerca a la solución"],
      ["Criterio de parada", "Detiene las iteraciones"],
      ["Tolerancia", "Error máximo aceptado"],
      ["Iteración", "Repetir un paso de cálculo"] ] }
  ];

  var VIDAS = 5, XP_ACIERTO = 10, XP_REPASO = 5, N_MC = 6, N_VF = 2, N_PAR = 2;
  var ELOGIOS = ["¡Excelente!", "¡Muy bien!", "¡Correcto!", "¡Así se hace!", "¡Perfecto!"];
  var COLORES = ["#58CC02", "#1CB0F6", "#FFC800", "#FF9600", "#FF4B4B", "#8B5CF6"];

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

  /* ---------- sonido (WebAudio, opcional) ---------- */
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
      else if (kind === "win") { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tono(f, i * .11, .28, "sine", .18); }); }
      else if (kind === "lose") { [392, 330, 262].forEach(function (f, i) { tono(f, i * .16, .3, "triangle", .18); }); }
    } catch (e) {}
  }
  function pintarSonido() {
    els.snd.setAttribute("aria-pressed", sonido ? "true" : "false");
    els.snd.setAttribute("aria-label", sonido ? "Sonido activado" : "Sonido desactivado");
  }

  /* ---------- armado de la lección ---------- */
  function armarLeccion() {
    var mc = mezclar(BANCO).slice(0, N_MC).map(function (q) {
      var ops = q.opciones.map(function (t, i) { return { t: t, ok: i === q.correcta }; });
      return { tipo: "mc", tema: q.tema, pregunta: q.pregunta, opciones: mezclar(ops), feedback: q.feedback };
    });
    var vf = mezclar(VF).slice(0, N_VF).map(function (q) {
      return { tipo: "mc", tf: true, tema: "Verdadero o falso", pregunta: q.texto,
        opciones: [{ t: "Verdadero", ok: q.v }, { t: "Falso", ok: !q.v }], feedback: q.feedback };
    });
    var par = mezclar(PARES).slice(0, N_PAR).map(function (p) {
      return { tipo: "par", tema: p.tema, pregunta: "Toca los pares que se corresponden", pares: p.pares };
    });
    var todo = mezclar(mc.concat(vf, par));
    if (todo[0].tipo === "par") {
      for (var i = 1; i < todo.length; i++) {
        if (todo[i].tipo !== "par") { var t = todo[0]; todo[0] = todo[i]; todo[i] = t; break; }
      }
    }
    return todo;
  }

  /* ---------- pantallas ---------- */
  function pantalla(nombre) {
    els.intro.hidden = nombre !== "intro";
    els.play.hidden = nombre !== "play";
    els.end.hidden = nombre !== "end";
    els.confetti.innerHTML = "";
  }

  function iniciar() {
    var leccion = armarLeccion();
    S = { cola: leccion.slice(), total: leccion.length, hechos: 0, xp: 0, vidas: VIDAS, racha: 0,
      intentos: 0, aciertos: 0, inicio: Date.now(), sel: null, fase: "responder", q: null, par: null };
    pantalla("play");
    els.modal.hidden = true;
    hud(false);
    siguiente();
  }

  function hud(golpe) {
    els.heartsN.textContent = S.vidas;
    els.hearts.classList.remove("hit");
    if (golpe) { void els.hearts.offsetWidth; els.hearts.classList.add("hit"); }
    els.streak.hidden = S.racha < 2;
    els.streakN.textContent = S.racha;
    var pct = Math.round(S.hechos / S.total * 100);
    els.bar.classList.toggle("zero", S.hechos === 0);
    els.barFill.style.width = pct + "%";
    els.bar.setAttribute("aria-valuenow", S.hechos);
    els.bar.setAttribute("aria-valuemax", S.total);
  }

  function boton(texto, modo, deshabilitado, oculto) {
    els.main.textContent = texto;
    els.main.className = "dl-btn" + (modo === "red" ? " dl-btn-red" : "");
    els.main.disabled = !!deshabilitado;
    els.main.hidden = !!oculto;
  }

  function siguiente() {
    if (!S.cola.length) { terminar(true); return; }
    var q = S.cola.shift();
    S.q = q; S.sel = null; S.fase = "responder"; S.par = null;
    els.foot.setAttribute("data-fb", "none");
    els.fb.hidden = true; els.fb.innerHTML = "";
    els.tema.textContent = (q.repaso ? "Repaso — " : "") + q.tema;
    els.tema.classList.toggle("repaso", !!q.repaso);
    els.pregunta.textContent = q.pregunta;
    els.pregunta.classList.toggle("match", q.tipo === "par");
    els.area.innerHTML = "";
    if (q.tipo === "par") { pintarPares(q); boton("Continuar", "green", true, true); }
    else { pintarOpciones(q); boton("Comprobar", "green", true, false); }
  }

  /* ---------- opción múltiple / verdadero-falso ---------- */
  function pintarOpciones(q) {
    var lista = el("div", "dl-opts" + (q.tf ? " dl-opts-tf" : ""));
    lista.setAttribute("role", "radiogroup");
    lista.setAttribute("aria-label", "Opciones de respuesta");
    q.opciones.forEach(function (o, i) {
      var b = el("button", "dl-opt");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", "false");
      var k = el("span", "dl-key"); k.textContent = i + 1;
      var t = el("span", "dl-opt-t"); t.textContent = o.t;
      b.appendChild(k); b.appendChild(t);
      b.addEventListener("click", function () { elegir(i); });
      lista.appendChild(b);
    });
    els.area.appendChild(lista);
  }

  function elegir(i) {
    if (S.fase !== "responder" || !S.q || S.q.tipo !== "mc") return;
    S.sel = i;
    var bs = els.area.querySelectorAll(".dl-opt");
    for (var n = 0; n < bs.length; n++) bs[n].setAttribute("aria-checked", n === i ? "true" : "false");
    els.main.disabled = false;
    sfx("tick");
  }

  function comprobar() {
    var q = S.q;
    if (S.fase !== "responder" || S.sel === null) return;
    var ok = q.opciones[S.sel].ok;
    var bs = els.area.querySelectorAll(".dl-opt");
    for (var n = 0; n < bs.length; n++) {
      bs[n].disabled = true;
      if (q.opciones[n].ok) bs[n].classList.add("is-ok");
      else if (n === S.sel) bs[n].classList.add("is-bad");
      else bs[n].classList.add("is-dim");
    }
    var correcta = q.opciones.filter(function (o) { return o.ok; })[0].t;
    resultado(ok, ok ? [{ t: q.feedback }] : [{ t: correcta, cls: "dl-ans" }, { t: q.feedback }]);
  }

  /* ---------- relacionar pares ---------- */
  function pintarPares(q) {
    var izq = mezclar(q.pares.map(function (p, i) { return { id: i, t: p[0] }; }));
    var der = mezclar(q.pares.map(function (p, i) { return { id: i, t: p[1] }; }));
    S.par = { sel: null, faltan: q.pares.length, fallos: 0, bloqueo: false };
    var cont = el("div", "dl-match");
    [izq, der].forEach(function (col, lado) {
      var c = el("div", "dl-col");
      col.forEach(function (it) {
        var b = el("button", "dl-tile");
        b.type = "button"; b.textContent = it.t;
        b.dataset.id = it.id; b.dataset.lado = lado;
        b.addEventListener("click", function () { tocarPar(b); });
        c.appendChild(b);
      });
      cont.appendChild(c);
    });
    els.area.appendChild(cont);
  }

  function tocarPar(b) {
    var P = S.par;
    if (!P || P.bloqueo || b.classList.contains("done")) return;
    if (!P.sel) { P.sel = b; b.classList.add("sel"); sfx("tick"); return; }
    if (P.sel === b) { b.classList.remove("sel"); P.sel = null; return; }
    if (P.sel.dataset.lado === b.dataset.lado) {
      P.sel.classList.remove("sel"); P.sel = b; b.classList.add("sel"); sfx("tick"); return;
    }
    var a = P.sel;
    if (a.dataset.id === b.dataset.id) {
      [a, b].forEach(function (x) { x.classList.remove("sel"); x.classList.add("done"); x.disabled = true; });
      P.sel = null; P.faltan -= 1; sfx("ok");
      if (P.faltan === 0) {
        var xp = P.fallos === 0 ? XP_ACIERTO : XP_REPASO;
        resultado(true, [{ t: P.fallos === 0 ? "Sin errores en esta tanda." : "Completaste todos los pares." }], "¡Todos los pares!", xp);
      }
    } else {
      P.fallos += 1; P.bloqueo = true; sfx("bad");
      a.classList.remove("sel"); a.classList.add("bad"); b.classList.add("bad");
      setTimeout(function () {
        a.classList.remove("bad"); b.classList.remove("bad");
        P.sel = null; P.bloqueo = false;
      }, 550);
    }
  }

  /* ---------- resultado de un ejercicio ---------- */
  function resultado(ok, lineas, titulo, xpPar) {
    S.fase = "feedback";
    S.intentos += 1;
    var q = S.q;
    if (ok) {
      S.aciertos += 1; S.racha += 1; S.hechos += 1;
      S.xp += (typeof xpPar === "number") ? xpPar : (q.repaso ? XP_REPASO : XP_ACIERTO);
      var t = titulo || (S.racha >= 3 ? "¡Racha de " + S.racha + "!" : ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)]);
      mostrarFeedback("ok", t, lineas);
      boton("Continuar", "green", false, false);
      sfx("ok");
      hud(false);
    } else {
      S.vidas -= 1; S.racha = 0;
      var copia = {}; for (var k in q) copia[k] = q[k];
      copia.repaso = true;
      S.cola.push(copia);
      mostrarFeedback("bad", "Respuesta correcta:", lineas);
      boton(S.vidas <= 0 ? "Ver resultado" : "Entendido", "red", false, false);
      sfx("bad");
      hud(true);
    }
    els.main.focus();
  }

  function mostrarFeedback(tipo, titulo, lineas) {
    els.foot.setAttribute("data-fb", tipo);
    els.fb.innerHTML = '<span class="dl-fb-m">' + mascot(tipo === "ok" ? "happy" : "sad") + '</span><div class="dl-fb-t"></div>';
    var cont = els.fb.querySelector(".dl-fb-t");
    var h = el("h3"); h.textContent = titulo; cont.appendChild(h);
    lineas.forEach(function (l) { var p = el("p", l.cls); p.textContent = l.t; cont.appendChild(p); });
    els.fb.hidden = false;
  }

  function principal() {
    if (S.fase === "responder") { comprobar(); return; }
    if (S.vidas <= 0) { terminar(false); return; }
    siguiente();
  }

  /* ---------- fin ---------- */
  function terminar(completa) {
    S.fin = Date.now();
    pantalla("end");
    var max = S.total * XP_ACIERTO;
    var er = max > 0 ? Math.max(0, (max - S.xp) / max) : 0;
    var prec = S.intentos ? Math.round(S.aciertos / S.intentos * 100) : 0;
    var seg = Math.max(1, Math.round((S.fin - S.inicio) / 1000));
    var tiempo = Math.floor(seg / 60) + ":" + ("0" + (seg % 60)).slice(-2);

    els.endMascot.innerHTML = mascot(completa ? "happy" : "sad");
    els.endTitle.textContent = completa ? "¡Lección completada!" : "Te quedaste sin corazones";
    els.xp.textContent = S.xp;
    els.prec.textContent = prec + "%";
    els.time.textContent = tiempo;
    els.endScore.textContent = "Puntaje: " + S.xp + " / " + max + "  ·  Error relativo: " + (er * 100).toFixed(1) + " %";

    var msg;
    if (er <= 0.15) {
      msg = "Excelente dominio de la Unidad 1: tu error relativo es muy bajo. Los conceptos de representación, error y convergencia están claros.";
    } else if (er <= 0.4) {
      msg = "Buen resultado. Repasa los temas donde fallaste (revisa el menú \"Temas\") para bajar aún más tu error relativo.";
    } else {
      msg = "Todavía hay margen de mejora. Vuelve a repasar los seis temas de la Unidad 1 y vuelve a intentarlo: la práctica reduce el error.";
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
    if (S.fase === "responder" && S.q && S.q.tipo === "mc" && /^[1-4]$/.test(e.key)) {
      var i = parseInt(e.key, 10) - 1;
      if (i < S.q.opciones.length) { e.preventDefault(); elegir(i); }
      return;
    }
    if (e.key === "Enter") {
      var t = e.target;
      if (t && t.classList && t.classList.contains("dl-opt")) {
        if (t.getAttribute("aria-checked") === "true" && !els.main.disabled) { e.preventDefault(); els.main.click(); }
        return;
      }
      if (t && t.tagName === "BUTTON") return;
      if (!els.main.disabled && !els.main.hidden) { e.preventDefault(); els.main.click(); }
    }
  }

  /* ---------- init ---------- */
  function init() {
    var ids = { intro: "dl-intro", play: "game-play", end: "game-end", startBtn: "game-start-btn",
      bar: "dl-bar", barFill: "dl-bar-fill", hearts: "game-lives", heartsN: "dl-hearts-n",
      streak: "dl-streak", streakN: "dl-streak-n", snd: "dl-sound", quit: "dl-quit",
      tema: "game-tema", pregunta: "game-pregunta", area: "dl-area", foot: "dl-foot", fb: "game-feedback",
      main: "game-check-btn", endMascot: "dl-end-mascot", endTitle: "game-end-title", xp: "dl-xp", prec: "dl-prec",
      time: "dl-time", endScore: "game-end-score", endMsg: "game-end-msg", replay: "game-replay-btn",
      modal: "dl-modal", stay: "dl-stay", leave: "dl-leave", confetti: "dl-confetti", heroM: "dl-hero-m" };
    for (var k in ids) els[k] = $(ids[k]);
    if (!els.intro || !els.startBtn) return; // no estamos en la página del juego

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
