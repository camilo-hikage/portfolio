/* Hero "Explore the Space" + reveal da seção de planetas.
   Efeito adaptado do gist "Space Explore" de krishnaPC — sem sequestrar o
   scroll: o zoom das camadas é ligado ao progresso do scroll no hero, e os
   planetas animam via IntersectionObserver. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- zoom das camadas de fundo ---- */
  var hero = document.querySelector(".hero");
  var stage = document.querySelector(".hero__stage");

  var planets = document.querySelector(".planets");
  var revealed = false;

  function revealPlanets() {
    if (revealed || !planets) return;
    var top = planets.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.82) {
      planets.classList.add("is-in");
      revealed = true;
    }
  }

  if (reduce) {
    if (planets) planets.classList.add("is-in");
  } else {
    var last = -1;
    var update = function () {
      if (hero && stage) {
        var dist = hero.offsetHeight - window.innerHeight;
        var top = window.pageYOffset || document.documentElement.scrollTop;
        var p = dist > 0 ? top / dist : 0;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        if (p !== last) {
          last = p;
          stage.style.setProperty("--p", p.toFixed(4));
        }
      }
      revealPlanets();
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", function () { last = -1; update(); }, { passive: true });

    // IntersectionObserver dispara o reveal mesmo sem scroll (quando disponível)
    if ("IntersectionObserver" in window && planets) {
      new IntersectionObserver(function (entries, obs) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          planets.classList.add("is-in");
          revealed = true;
          obs.disconnect();
        }
      }, { threshold: 0.15 }).observe(planets);
    }

    update();
  }
})();
