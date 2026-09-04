/* Scripts do site:
   - Hero: parallax de mouse (parallax.js) + partículas (particles.js)
   - Cena de montanhas: parallax por variável CSS no scroll
   - Contato: formulário que compõe uma mensagem de WhatsApp
   - Contato: fundo animado em Canvas 2D (linhas + partículas verde-água) */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     HERO — parallax de mouse + partículas
     ============================================================ */
  var heroScene = document.getElementById("parallax");
  if (heroScene && window.Parallax) {
    new window.Parallax(heroScene, {
      invertX: true, invertY: true,
      scalarX: 10, scalarY: 10,
      frictionX: 0.1, frictionY: 0.1
    });
  }

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
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  /* ============================================================
     CENA DE MONTANHAS — parallax por variável CSS (--ty) no scroll
     (as camadas do fundo se deslocam mais que as da frente)
     ============================================================ */
  var pscene = document.querySelector(".pscene");
  var layers = pscene ? [].slice.call(pscene.querySelectorAll(".pscene__layer")) : [];
  if (pscene && layers.length && !reduce) {
    var pDepth = layers.map(function (el) {
      return (parseFloat(el.getAttribute("data-modifier")) || 0) / 30; // 0..1
    });
    var pLast = null;
    var pUpdate = function () {
      var r = pscene.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var prog = (vh - r.top) / (vh + r.height);
      prog = prog < 0 ? 0 : prog > 1 ? 1 : prog;
      if (prog === pLast) return;
      pLast = prog;
      var span = r.height * 0.42; // camada de fundo desloca 42% da altura
      for (var i = 0; i < layers.length; i++) {
        layers[i].style.setProperty("--ty", (prog * pDepth[i] * span).toFixed(1) + "px");
      }
    };
    window.addEventListener("scroll", pUpdate, { passive: true });
    window.addEventListener("resize", function () { pLast = null; pUpdate(); }, { passive: true });
    pUpdate();
  }

  /* ============================================================
     CONTATO — formulário compõe uma mensagem de WhatsApp
     (sem servidor, sem serviço de terceiros)
     ============================================================ */
  var form = document.getElementById("contact-form");
  if (form) {
    var PHONE = "5511986156202";
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var nome = (form.elements.nome.value || "").trim();
      var msg = (form.elements.mensagem.value || "").trim();
      var text = "Olá! Sou " + nome + ".\n\n" + msg;
      var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
    });
  }

  /* ============================================================
     FUNDO DO CONTATO — Canvas 2D: malha de linhas verde-água que
     ondula + partículas que sobem. Recriação própria, inspirada
     no CodePen "Line2NodeMaterial" de prisoner849.
     ============================================================ */
  var canvas = document.getElementById("contact-bg");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var host = canvas.closest(".contact") || canvas.parentElement;
    var AQUA = "127, 255, 212";
    var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = 1, h = 1, cx = 0;

    var CAM_H = 4.6, CAM_D = 5.5, X_MAX = 15;

    function resize() {
      var r = host.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      cx = w / 2;
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function wave(x, z, t) {
      return (
        Math.sin(x * 0.42 + t) * 0.55 +
        Math.cos(z * 0.38 - t * 0.8) * 0.42 +
        Math.sin((x + z) * 0.22 + t * 1.25) * 0.3
      );
    }

    // projeção do mundo (x, y, z) -> tela
    function proj(x, y, z, out) {
      var f = (w * 0.55) / (z + CAM_D);
      out.x = cx + x * f;
      out.y = h * 0.34 + (CAM_H - y) * f;
      out.s = f;
    }

    var pts = [];
    function initPts() {
      pts.length = 0;
      for (var i = 0; i < 80; i++) {
        pts.push({
          x: (Math.random() - 0.5) * (X_MAX * 1.8),
          z: 0.5 + Math.random() * 24,
          ph: Math.random()
        });
      }
    }

    var a = {};
    function draw(t, dt) {
      var g = ctx.createRadialGradient(cx, h * 0.4, 0, cx, h * 0.4, Math.hypot(w, h) * 0.62);
      g.addColorStop(0, "#0a241d");
      g.addColorStop(0.55, "#06140f");
      g.addColorStop(1, "#03090a");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1;

      var lines = 44, cols = 74;
      for (var li = 0; li < lines; li++) {
        var z = 0.6 * Math.pow(1.09, li);
        if (z > 30) break;
        var fade = Math.max(0, 1 - z / 27);
        ctx.strokeStyle = "rgba(" + AQUA + "," + (0.04 + fade * 0.07).toFixed(3) + ")";
        ctx.beginPath();
        for (var ci = 0; ci <= cols; ci++) {
          var x = (ci / cols - 0.5) * (X_MAX * 2);
          var y = wave(x, z, t);
          proj(x, y, z, a);
          if (ci === 0) ctx.moveTo(a.x, a.y);
          else ctx.lineTo(a.x, a.y);
        }
        ctx.stroke();
      }

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.ph += dt * 0.14;
        if (p.ph > 1) {
          p.ph -= 1;
          p.x = (Math.random() - 0.5) * (X_MAX * 1.8);
          p.z = 0.5 + Math.random() * 24;
        }
        var y2 = wave(p.x, p.z, t) + p.ph * 3.4;
        proj(p.x, y2, p.z, a);
        var fp = Math.sin(p.ph * Math.PI);
        var fd = Math.max(0, 1 - p.z / 26);
        var alpha = fp * fd * 0.55;
        if (alpha < 0.004 || a.y < -20 || a.y > h + 20) continue;
        var rad = Math.max(1.4, a.s * 0.05) * 3;
        var pg = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, rad);
        pg.addColorStop(0, "rgba(" + AQUA + "," + alpha.toFixed(3) + ")");
        pg.addColorStop(1, "rgba(" + AQUA + ",0)");
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(a.x, a.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    }

    var running = false, last = 0, tSim = 1.2;
    function frame(now) {
      if (!running) return;
      var dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      tSim += dt * 0.5;
      draw(tSim, dt);
      window.requestAnimationFrame(frame);
    }
    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      window.requestAnimationFrame(frame);
    }
    function stop() { running = false; }

    resize();
    initPts();
    draw(tSim, 0);
    window.addEventListener("resize", function () {
      resize();
      if (!running) draw(tSim, 0);
    }, { passive: true });

    if (!reduce) {
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { e.isIntersecting ? start() : stop(); });
        }, { threshold: 0.01 }).observe(host);
      } else {
        start();
      }
    }
  }

  /* ============================================================
     FUNDO DO SOBRE — Canvas 2D: disco de acreção de um buraco
     negro. Partículas em órbita kepleriana projetadas numa elipse,
     com brilho Doppler (lado que se aproxima fica mais quente) e o
     horizonte de eventos ocultando a metade de trás do disco.
     Recriação própria, inspirada no CodePen "The Life of a
     Singularity" de VoXelo (three.js).
     ============================================================ */
  var bh = document.getElementById("sobre-bg");
  if (bh && bh.getContext) {
    var bctx = bh.getContext("2d");
    var bhost = bh.closest(".sobre") || bh.parentElement;
    var BDPR = Math.min(window.devicePixelRatio || 1, 1.5);
    var bw = 1, bh_h = 1, bcx = 0, bcy = 0, bR = 1, bIn = 1, bOut = 1;
    var TILT = 0.30;
    var N = 1600;
    var disk = [];

    function bhResize() {
      var r = bhost.getBoundingClientRect();
      bw = Math.max(1, r.width);
      bh_h = Math.max(1, r.height);
      bh.width = Math.round(bw * BDPR);
      bh.height = Math.round(bh_h * BDPR);
      bctx.setTransform(BDPR, 0, 0, BDPR, 0, 0);
      bR = Math.min(bw, bh_h);
      bcx = bw * (bw > 720 ? 0.66 : 0.5);
      bcy = bh_h * 0.46;
      bIn = bR * 0.055;
      bOut = bR * 0.44;
    }

    function bhInit() {
      disk.length = 0;
      for (var i = 0; i < N; i++) {
        var u = Math.pow(Math.random(), 1.35); // 0 interno .. 1 externo
        disk.push({
          u: u,
          a: Math.random() * Math.PI * 2,
          spd: (0.55 / Math.pow(0.16 + u, 1.4)) * (0.85 + Math.random() * 0.3),
          j: (Math.random() - 0.5) * (1 - u)
        });
      }
    }

    function mix(a, b, t) { return a + (b - a) * t; }
    function sstep(e0, e1, x) {
      var t = (x - e0) / (e1 - e0);
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      return t * t * (3 - 2 * t);
    }

    function bhParticle(p, x, y) {
      var warm = sstep(1.0, 0.22, p.u);
      var hot = sstep(0.32, 0.0, p.u);
      var cr = mix(60, 255, warm), cg = mix(120, 120, warm), cb = mix(255, 30, warm);
      cr = mix(cr, 255, hot); cg = mix(cg, 240, hot); cb = mix(cb, 225, hot);
      var dop = Math.cos(p._ang - Math.PI / 2);     // +1 no lado que se aproxima
      var bright = (0.55 + (1 - p.u) * 0.6) * (0.6 + 0.55 * dop);
      var alpha = (0.05 + (1 - p.u) * 0.20) * (0.65 + 0.55 * dop);
      if (alpha < 0.004) return;
      var vx = -Math.sin(p._ang), vy = Math.cos(p._ang) * TILT;
      var vl = Math.hypot(vx, vy) || 1;
      var len = 2.5 + (1 - p.u) * 9;
      bctx.strokeStyle = "rgba(" +
        (cr * bright | 0) + "," + (cg * bright | 0) + "," + (cb * bright | 0) + "," + alpha.toFixed(3) + ")";
      bctx.lineWidth = 0.6 + (1 - p.u) * 1.1;
      bctx.beginPath();
      bctx.moveTo(x, y);
      bctx.lineTo(x - vx / vl * len, y - vy / vl * len);
      bctx.stroke();
    }

    function bhDraw(t) {
      bctx.clearRect(0, 0, bw, bh_h);
      bctx.globalCompositeOperation = "lighter";
      bctx.lineCap = "round";

      var i, p, rr, x, y, front = [];
      for (i = 0; i < disk.length; i++) {
        p = disk[i];
        p._ang = p.a + t * p.spd;
        rr = bIn + p.u * (bOut - bIn);
        x = bcx + Math.cos(p._ang) * rr;
        y = bcy + Math.sin(p._ang) * rr * TILT + p.j * 6;
        if (Math.sin(p._ang) <= 0) bhParticle(p, x, y);   // metade de trás
        else front.push([p, x, y]);
      }

      // horizonte de eventos + halo
      var halo = bctx.createRadialGradient(bcx, bcy, bIn * 0.5, bcx, bcy, bIn * 3.4);
      halo.addColorStop(0, "rgba(255,150,60,0.55)");
      halo.addColorStop(0.5, "rgba(255,90,30,0.16)");
      halo.addColorStop(1, "rgba(255,90,30,0)");
      bctx.fillStyle = halo;
      bctx.beginPath();
      bctx.arc(bcx, bcy, bIn * 3.4, 0, Math.PI * 2);
      bctx.fill();

      bctx.globalCompositeOperation = "source-over";
      bctx.fillStyle = "#000";
      bctx.beginPath();
      bctx.ellipse(bcx, bcy, bIn, bIn, 0, 0, Math.PI * 2);
      bctx.fill();

      bctx.globalCompositeOperation = "lighter";
      for (i = 0; i < front.length; i++) bhParticle(front[i][0], front[i][1], front[i][2]);

      bctx.globalCompositeOperation = "source-over";
    }

    var bhRun = false, bhLast = 0, bhT = 0;
    function bhFrame(now) {
      if (!bhRun) return;
      var dt = Math.min(0.05, (now - bhLast) / 1000 || 0);
      bhLast = now;
      bhT += dt * 0.35;
      bhDraw(bhT);
      window.requestAnimationFrame(bhFrame);
    }
    function bhStart() {
      if (bhRun) return;
      bhRun = true; bhLast = performance.now();
      window.requestAnimationFrame(bhFrame);
    }
    function bhStop() { bhRun = false; }

    bhResize();
    bhInit();
    bhDraw(bhT);
    window.addEventListener("resize", function () {
      bhResize();
      if (!bhRun) bhDraw(bhT);
    }, { passive: true });

    if (!reduce) {
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { e.isIntersecting ? bhStart() : bhStop(); });
        }, { threshold: 0.01 }).observe(bhost);
      } else {
        bhStart();
      }
    }
  }
})();
