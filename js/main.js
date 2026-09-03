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
