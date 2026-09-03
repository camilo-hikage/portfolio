/* Parallax do hero.
   Adaptado de https://codepen.io/empatheticpolyglot/pen/LWBLNW
   Mudanças: respeita prefers-reduced-motion, para de atualizar quando o hero
   sai da tela e evita trabalho redundante entre eventos de scroll. */
(function () {
  "use strict";

  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");

  var hero = document.querySelector(".hero");
  var layers = Array.prototype.slice.call(document.querySelectorAll(".parallax"));
  if (!hero || !layers.length) return;

  var speeds = layers.map(function (el) {
    return parseFloat(el.getAttribute("data-speed")) || 0;
  });

  var lastTop = -1;
  var enabled = !mq.matches;

  function clear() {
    for (var i = 0; i < layers.length; i++) layers[i].style.transform = "";
  }

  function update() {
    if (!enabled) return;
    var top = window.pageYOffset || document.documentElement.scrollTop;
    if (top === lastTop) return;
    lastTop = top;

    // fora da região do hero: fixa a última posição e sai
    if (top > hero.offsetHeight) return;

    for (var i = 0; i < layers.length; i++) {
      var y = -(top * speeds[i] / 100);
      layers[i].style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", function () { lastTop = -1; update(); }, { passive: true });

  (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function () {
    enabled = !mq.matches;
    if (!enabled) clear();
    else { lastTop = -1; update(); }
  });

  update();
})();
