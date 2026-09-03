/* Hero: parallax de mouse (parallax.js) + malha de partículas (particles.js).
   Config adaptada do CodePen "mouse parallax demo" de dominickolbe. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scene = document.getElementById("parallax");

  /* ---- parallax de mouse / giroscópio ---- */
  if (scene && window.Parallax) {
    new window.Parallax(scene, {
      invertX: true,
      invertY: true,
      scalarX: 10,
      scalarY: 10,
      frictionX: 0.1,
      frictionY: 0.1
    });
  }

  /* ---- cena de montanhas: parallax por variável CSS (--ty) controlada no
     scroll — mesma técnica do CodePen de electerious. As camadas do fundo
     translam mais que as da frente. ---- */
  var pscene = document.querySelector(".pscene");
  var imgs = pscene ? [].slice.call(pscene.querySelectorAll(".pscene__img")) : [];

  if (pscene && imgs.length && !reduce) {
    var range = imgs.map(function (img) {
      return 2.2 * (parseFloat(img.getAttribute("data-modifier")) || 0);
    });
    var pLast = null;
    var pUpdate = function () {
      var r = pscene.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var prog = (vh - r.top) / (vh + r.height);
      prog = prog < 0 ? 0 : prog > 1 ? 1 : prog;
      if (prog === pLast) return;
      pLast = prog;
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].style.setProperty("--ty", (prog * range[i]).toFixed(1) + "px");
      }
    };
    window.addEventListener("scroll", pUpdate, { passive: true });
    window.addEventListener("resize", function () { pLast = null; pUpdate(); }, { passive: true });
    pUpdate();
  }

  /* ---- partículas ---- */
  if (window.particlesJS && !reduce) {
    window.particlesJS("particles-js", {
      particles: {
        number: { value: 120, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }
})();
