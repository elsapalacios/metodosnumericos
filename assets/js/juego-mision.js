(function () {
  var TEMAS = [
    ["Introducción", "introduccion"], ["Representación", "representacion-numeros"],
    ["Aritmética de punto flotante", "aritmetica-punto-flotante"], ["Errores", "errores-redondeo"],
    ["Algoritmos y convergencia", "algoritmos-convergencia"], ["Python", "python-metodos-numericos"],
    ["Tasas de convergencia", "tasas-convergencia"], ["Bisección", "metodo-biseccion"],
    ["Punto fijo", "metodo-punto-fijo"], ["Newton", "metodo-newton"],
    ["Euler", "metodo-euler"], ["Taylor", "metodo-taylor"],
    ["Runge-Kutta", "metodo-runge-kutta"], ["Métodos multipaso", "metodos-multipaso"]
  ];
  var JEFE = { 5: 1, 9: 1, 13: 1 };
  var R2 = Math.SQRT2;

  /* tema, enunciado, opciones (la correcta va primero) o null, explicación, respuesta numérica */
  var Q = [
    [0, "¿Qué diferencia a un método numérico de uno analítico?", ["Busca un valor suficientemente cercano en un número finito de pasos", "Siempre entrega la expresión exacta", "Solo sirve para ecuaciones lineales", "No genera ningún error"], "Los analíticos buscan la expresión exacta. Los numéricos aproximan y controlan el error."],
    [0, "¿Cuál de estas NO es una característica de los métodos numéricos?", ["Garantizan un resultado exacto", "Requieren un criterio de convergencia", "Se implementan como algoritmos", "Generan un error que hay que estimar"], "Siempre generan error, por eso se estima y se controla."],
    [1, "¿Cuántos bits de mantisa tiene la precisión doble de IEEE 754?", ["52", "23", "11", "64"], "Doble precisión: 1 bit de signo, 11 de exponente y 52 de mantisa."],
    [1, "¿Qué limita al punto fijo frente al punto flotante?", ["Su rango dinámico es muy reducido", "Trabaja en base 10", "No puede representar enteros", "Siempre ocupa más memoria"], "Con bits fijos para la parte entera y la fraccionaria no se pueden mezclar números muy grandes y muy pequeños."],
    [2, "Restar dos números casi iguales provoca...", ["Cancelación catastrófica", "Absorción", "Desbordamiento del exponente", "Convergencia cuadrática"], "Se pierden cifras significativas y el error relativo se dispara."],
    [2, "El épsilon de la máquina es...", ["La menor cantidad positiva que sumada a 1.0 da algo distinto de 1.0", "El mayor número representable", "El error de truncamiento de una serie", "El número de bits de la mantisa"], "Mide la resolución de la aritmética de punto flotante."],
    [3, "El error de truncamiento aparece cuando...", ["Un proceso infinito se reemplaza por uno finito, como cortar una serie de Taylor", "El computador redondea un resultado intermedio", "Los datos vienen de una medición", "Se divide entre cero"], "El de redondeo viene de las cifras finitas y el inherente, de los datos de entrada."],
    [3, "Valor real 50, valor aproximado 49. ¿Cuál es el error relativo?", ["0.02", "1", "0.98", "0.2"], "Er = |50 − 49| / 50 = 0.02, es decir 2 %."],
    [4, "¿Para qué sirve fijar un número máximo de iteraciones?", ["Evitar ciclos infinitos si no hay convergencia", "Aumentar la precisión", "Elegir la aproximación inicial", "Calcular el épsilon"], "Es un criterio de parada."],
    [4, "En un algoritmo iterativo, ¿qué genera la nueva aproximación a partir de la anterior?", ["La fórmula de recurrencia", "El criterio de parada", "La aproximación inicial", "La tolerancia"], "Se parte de x₀ y se aplica la recurrencia hasta cumplir el criterio de parada."],
    [5, "En Python, 0.1 + 0.2 == 0.3 da False porque...", ["Los decimales no se representan exactamente en binario", "Python redondea mal", "Falta importar NumPy", "La suma de decimales no está definida"], "Es el mismo error de representación del tema 2."],
    [5, "¿Qué biblioteca trae implementaciones de raíces, integración y EDO?", ["SciPy", "Matplotlib", "Pandas", "Ninguna, hay que programarlo todo"], "Matplotlib grafica, Pandas organiza tablas y NumPy maneja arreglos."],
    [6, "¿Qué orden de convergencia tiene Newton cerca de una raíz simple?", ["Cuadrático", "Lineal", "Sublineal", "Constante"], "Las cifras correctas se duplican más o menos en cada paso."],
    [6, "Un método lineal con C < 1 hace que en cada iteración el error...", ["Se multiplique por una constante menor que 1", "Se eleve al cuadrado", "Se duplique", "Quede igual"], "En bisección esa constante es 1/2."],
    [7, "Para aplicar bisección en [a, b] se necesita...", ["f continua y f(a)·f(b) < 0", "f derivable y f'(x) ≠ 0", "Un punto inicial cercano a la raíz", "Reescribir f(x) = 0 como x = g(x)"], "Por el teorema del valor intermedio hay una raíz atrapada en el intervalo."],
    [7, "Con [1, 2] y tolerancia 0.001, ¿cuántas iteraciones mínimas de bisección hacen falta?", null, "(2 − 1)/2ⁿ < 0.001 pide 2ⁿ > 1000, o sea n = 10.", 10],
    [8, "Para que punto fijo converja, cerca de la raíz debe cumplirse...", ["|g'(x)| < 1", "|g'(x)| > 1", "g(x) = 0", "f'(x) = 0"], "Si |g'(x*)| > 1 la sucesión se aleja."],
    [8, "Para x² − x − 2 = 0, ¿por qué g(x) = x² − 2 diverge cerca de x = 2?", ["Porque g'(2) = 4, mayor que 1", "Porque g(2) ≠ 2", "Porque g no es continua", "Porque x₀ siempre queda lejos"], "g(2) = 2 sí es punto fijo, pero con g'(2) = 4 la iteración se aleja."],
    [9, "¿Cuál es la fórmula de Newton?", ["xₙ₊₁ = xₙ − f(xₙ) / f'(xₙ)", "xₙ₊₁ = xₙ − f'(xₙ) / f(xₙ)", "xₙ₊₁ = (a + b) / 2", "xₙ₊₁ = g(xₙ) + h"], "Sale de truncar Taylor en el término lineal e igualar a cero."],
    [9, "Si f'(xₙ) está muy cerca de 0 en Newton...", ["La tangente es casi horizontal y el siguiente punto puede salir disparado", "El método converge más rápido", "Se convierte en bisección", "El error se reduce a la mitad"], "La fórmula divide entre un número casi nulo."],
    [10, "En Euler, si reduces h a la mitad, el error global aproximadamente...", ["Se reduce a la mitad", "Se reduce a la cuarta parte", "Se duplica", "No cambia"], "El error global es O(h), pero los pasos y el costo se duplican."],
    [10, "Para y' = y, y(0) = 1 y h = 0.5, ¿cuánto vale y₂ con Euler?", null, "y₁ = 1 + 0.5·1 = 1.5 y y₂ = 1.5 + 0.5·1.5 = 2.25.", 2.25],
    [11, "¿Qué exige Taylor de orden alto en cada problema nuevo?", ["Derivar f analíticamente varias veces", "Evaluar f cuatro veces por paso", "Conocer valores de pasos anteriores", "Usar siempre h = 1"], "Esa dificultad motivó a Runge-Kutta."],
    [11, "Con Taylor de orden p, el error local es del orden...", ["O(hᵖ⁺¹)", "O(hᵖ)", "O(h)", "O(p·h)"], "Cada término adicional sube el orden en una potencia de h."],
    [12, "¿Cuántas evaluaciones de f hace RK4 por paso?", ["4", "1", "2", "6"], "k₁, k₂, k₃ y k₄, combinadas con pesos 1, 2, 2, 1 sobre 6."],
    [12, "¿Cuál es el error global de RK4?", ["O(h⁴)", "O(h)", "O(h²)", "O(h⁵)"], "El error local es O(h⁵) y el global O(h⁴)."],
    [13, "¿Por qué un método multipaso no puede arrancar solo?", ["Necesita valores previos, que se generan con un método de un paso", "Porque siempre es implícito", "Porque no usa f", "Porque exige un h variable"], "Normalmente se arranca con Runge-Kutta."],
    [13, "Adams-Moulton es implícito y usa fₙ₊₁. ¿Qué ventaja suele dar?", ["Mayor estabilidad, sobre todo en problemas rígidos", "Ninguna evaluación de f", "No necesita paso h", "Se calcula directo, sin resolver ecuaciones"], "A cambio hay que resolver una ecuación en yₙ₊₁."]
  ];

  var $ = function (id) { return document.getElementById(id); };
  var S, timer;

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function show(id) {
    ["mx-start", "mx-play", "mx-end"].forEach(function (k) { $(k).hidden = k !== id; });
  }
  function best() {
    try { return parseInt(localStorage.getItem("mx-best"), 10) || 0; } catch (e) { return 0; }
  }
  function saveBest(v) {
    try { localStorage.setItem("mx-best", String(v)); } catch (e) {}
  }

  function newGame() {
    var rondas = TEMAS.map(function (_, t) {
      var p = Q.filter(function (q) { return q[0] === t; });
      return p[Math.floor(Math.random() * p.length)];
    });
    S = { r: rondas, i: 0, pts: 0, combo: 0, lives: 3, x: 3, ok: 0, res: [], used: { half: false, plus: false }, left: 0, total: 0, done: false };
    $("mx-map").innerHTML = rondas.map(function (q) {
      return '<li class="' + (JEFE[q[0]] ? "boss" : "") + '" title="' + TEMAS[q[0]][0] + '"></li>';
    }).join("");
    show("mx-play");
    hud();
    gauge(false);
    ask();
  }

  function hud() {
    $("mx-score").textContent = S.pts;
    var m = Math.min(4, 1 + Math.floor(S.combo / 2));
    $("mx-combo").textContent = "Combo x" + m;
    $("mx-combo").className = "mx-combo" + (m > 1 ? " on" : "");
    var v = "";
    for (var k = 0; k < 3; k++) v += '<i class="' + (k < S.lives ? "" : "off") + '"></i>';
    $("mx-lives").innerHTML = v;
  }

  function gauge(anim) {
    var e = Math.abs(S.x - R2);
    var el = $("mx-x");
    el.textContent = S.x.toFixed(9);
    el.className = "mx-x" + (anim ? " " + anim : "");
    $("mx-err").textContent = "Ea = " + (e < 0.001 ? e.toExponential(2) : e.toFixed(4));
    $("mx-mark").style.left = Math.max(0, Math.min(100, (S.x - 1) / 2 * 100)) + "%";
  }

  function ask() {
    var q = S.r[S.i], num = q[2] === null;
    [].forEach.call($("mx-map").children, function (li, k) {
      li.classList.toggle("cur", k === S.i);
    });
    $("mx-topic").textContent = "Tema " + (q[0] + 1) + ": " + TEMAS[q[0]][0] + (JEFE[q[0]] ? " (vale doble)" : "");
    $("mx-q").textContent = q[1];
    $("mx-fb").hidden = true;
    $("mx-opts").hidden = num;
    $("mx-num").hidden = !num;
    $("mx-input").value = "";
    $("mx-5050").disabled = num || S.used.half;
    $("mx-plus").disabled = S.used.plus;
    if (num) {
      $("mx-input").focus();
    } else {
      var correcta = q[2][0];
      var ops = shuffle(q[2].slice());
      S.cor = ops.indexOf(correcta);
      $("mx-opts").innerHTML = ops.map(function (o, k) {
        return '<button type="button" class="mx-opt" data-k="' + k + '">' + (k + 1) + ". " + o + "</button>";
      }).join("");
    }
    S.total = S.left = num ? 40 : 25;
    S.done = false;
    clearInterval(timer);
    timer = setInterval(tick, 100);
    tick(true);
  }

  function tick(skip) {
    if (skip !== true) S.left -= 0.1;
    var t = Math.max(0, S.left);
    $("mx-time").textContent = Math.ceil(t) + " s";
    var b = $("mx-bar");
    b.style.width = (t / S.total * 100) + "%";
    b.className = t < 6 ? "low" : "";
    if (t <= 0 && !S.done) answer(null);
  }

  function answer(val) {
    if (S.done) return;
    S.done = true;
    clearInterval(timer);
    var q = S.r[S.i], num = q[2] === null, good;
    if (num) {
      good = val !== null && Math.abs(val - q[4]) < 0.005;
    } else {
      good = val === S.cor;
      [].forEach.call($("mx-opts").children, function (b, k) {
        b.disabled = true;
        if (k === S.cor) b.classList.add("ok");
        else if (k === val) b.classList.add("bad");
      });
    }
    $("mx-input").disabled = $("mx-ok").disabled = true;
    $("mx-5050").disabled = $("mx-plus").disabled = true;
    var msg;
    if (good) {
      S.combo++;
      var m = Math.min(4, 1 + Math.floor(S.combo / 2));
      var g = Math.round((100 + Math.max(0, S.left) * 4) * m * (JEFE[q[0]] ? 2 : 1));
      S.pts += g;
      S.ok++;
      S.x = (S.x + 2 / S.x) / 2;
      msg = '<span class="t-ok">Correcto, +' + g + ' puntos.</span> ';
      S.res.push(1);
    } else {
      S.combo = 0;
      S.lives--;
      S.x = Math.min(3.4, S.x + 0.6);
      msg = '<span class="t-bad">' + (val === null ? "Se acabó el tiempo." : "Incorrecto.") + "</span> " + (num ? "Era " + q[4] + ". " : "");
      S.res.push(0);
    }
    $("mx-map").children[S.i].className = (JEFE[q[0]] ? "boss " : "") + (good ? "ok" : "bad");
    $("mx-fb-t").innerHTML = msg + q[3];
    $("mx-fb").hidden = false;
    $("mx-next").textContent = (S.lives <= 0 || S.i === S.r.length - 1) ? "Ver resultado" : "Siguiente";
    $("mx-next").focus();
    hud();
    gauge(good ? "up" : "dn");
  }

  function finish() {
    clearInterval(timer);
    var ok = S.ok, top = best(), nuevo = S.pts > top;
    if (nuevo) saveBest(S.pts);
    var rango = ok >= 13 ? ["Newton", "Convergencia cuadrática: casi no dejaste error."]
      : ok >= 9 ? ["Runge-Kutta", "Preciso, aunque en algún paso se te escapó una pendiente."]
      : ok >= 5 ? ["Bisección", "Vas despacio pero seguro. Con un repaso llegas más rápido."]
      : ["Euler", "Estás en el primer paso y el error se acumuló. Repasa los temas de abajo y vuelve a intentarlo."];
    var vivo = S.lives > 0;
    $("mx-end-h").textContent = (vivo ? "Terminaste: " : "Sin vidas: ") + "nivel " + rango[0];
    $("mx-end-p").textContent = rango[1];
    $("mx-end-s").textContent = ok + " de " + S.r.length + " aciertos, " + S.pts + " puntos" + (nuevo ? ", nuevo récord" : ", récord " + top) + ". Tu aproximación quedó en " + S.x.toFixed(9) + ".";
    var fallos = S.r.filter(function (q, k) { return S.res[k] === 0; });
    var sin = S.r.length - S.res.length;
    var html = "";
    if (fallos.length) {
      html += "<p>Para repasar:</p>" + fallos.map(function (q) {
        return '<a href="../' + TEMAS[q[0]][1] + '/index.html">' + TEMAS[q[0]][0] + "</a>";
      }).join("");
    } else if (!sin) {
      html = "<p>No fallaste ninguna pregunta.</p>";
    }
    if (sin) html += "<p>Quedaron " + sin + " temas sin jugar.</p>";
    $("mx-review").innerHTML = html;
    show("mx-end");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!$("mx-go")) return;
    var b = best();
    $("mx-best").textContent = b ? "Tu récord en este navegador: " + b + " puntos." : "";
    $("mx-go").onclick = $("mx-again").onclick = function () {
      $("mx-input").disabled = $("mx-ok").disabled = false;
      newGame();
    };
    $("mx-opts").onclick = function (e) {
      var t = e.target.closest(".mx-opt");
      if (t && !t.disabled) answer(parseInt(t.dataset.k, 10));
    };
    $("mx-ok").onclick = function () {
      var v = parseFloat($("mx-input").value);
      if (!isNaN(v)) answer(v);
    };
    $("mx-input").onkeydown = function (e) { if (e.key === "Enter") $("mx-ok").click(); };
    $("mx-next").onclick = function () {
      $("mx-input").disabled = $("mx-ok").disabled = false;
      if (S.lives <= 0 || S.i === S.r.length - 1) { finish(); return; }
      S.i++;
      ask();
    };
    $("mx-5050").onclick = function () {
      S.used.half = true;
      $("mx-5050").disabled = true;
      var malas = [].filter.call($("mx-opts").children, function (_, k) { return k !== S.cor; });
      shuffle(malas).slice(0, 2).forEach(function (m) { m.disabled = true; m.classList.add("gone"); });
    };
    $("mx-plus").onclick = function () {
      S.used.plus = true;
      $("mx-plus").disabled = true;
      S.left += 10;
      S.total += 10;
      tick(true);
    };
    document.addEventListener("keydown", function (e) {
      if (!S || S.done || $("mx-play").hidden || e.target.tagName === "INPUT") return;
      var k = parseInt(e.key, 10) - 1, o = $("mx-opts").children[k];
      if (o && !o.disabled) answer(k);
    });
  });
})();
