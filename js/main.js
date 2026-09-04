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
     FUNDO DO SOBRE — malha de gradientes com background-blend-mode
     que reage ao ponteiro. As variáveis CSS --posX/--posY deslocam
     os focos dos radial-gradients. Adaptado do CodePen de MarkBoots.
     ============================================================ */
  var sbg = document.getElementById("sobre-bg");
  var sbgHost = sbg && sbg.closest(".sobre");
  if (sbg && sbgHost && !reduce) {
    sbgHost.addEventListener("pointermove", function (e) {
      var r = sbgHost.getBoundingClientRect();
      sbg.style.setProperty("--posX", (e.clientX - r.left - r.width / 2).toFixed(1));
      sbg.style.setProperty("--posY", (e.clientY - r.top - r.height / 2).toFixed(1));
    }, { passive: true });
  }

  /* ============================================================
     FUNDO DE PROJETOS — oceano até o horizonte (WebGL).
     Raymarch de uma malha de ondas (soma de senos + ruído) sob um
     céu de fim de tarde, com reflexo, brilho do sol e espuma nas
     cristas. Implementação própria, inspirada no CodePen "The
     Endless Horizon" de Less Rain.
     ============================================================ */
  (function () {
    var cv = document.getElementById("projetos-sea");
    if (!cv) return;
    var host = cv.closest(".projetos") || cv.parentElement;
    var gl = cv.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" });
    if (!gl) { cv.style.display = "none"; return; }

    var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

    var FS = [
      "precision highp float;",
      "uniform vec2 uRes;uniform float uTime;uniform float uProg;",
      "#define STEPS 22",
      "#define REFINE 5",
      "float hash(vec2 p){return fract(sin(dot(p,vec2(23.17,71.93)))*3571.19);}",
      "float vnoise(vec2 p){",
      "  vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
      "  float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));",
      "  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);",
      "}",
      "float wh(vec2 q,float t){",
      "  float h=0.;",
      "  h+=sin(q.x*0.85+t*0.75)*0.34;",
      "  h+=sin(q.y*0.62-t*0.52+q.x*0.20)*0.24;",
      "  h+=sin((q.x+q.y*0.7)*1.55+t*1.05)*0.13;",
      "  h+=sin(q.x*3.30-t*1.55+q.y*0.55)*0.06;",
      "  h+=(vnoise(q*4.2+vec2(t*0.25,-t*0.1))-0.5)*0.14;",
      "  return h*0.11;",
      "}",
      "vec3 wn(vec2 q,float t){",
      "  float e=0.02;",
      "  float l=wh(q-vec2(e,0.),t),r=wh(q+vec2(e,0.),t);",
      "  float d=wh(q-vec2(0.,e),t),u=wh(q+vec2(0.,e),t);",
      "  return normalize(vec3(l-r,2.*e,d-u));",
      "}",
      "void main(){",
      "  vec2 uv=(gl_FragCoord.xy-0.5*uRes)/uRes.y;",
      "  float t=uTime;",
      "  float pr=clamp(uProg,0.,1.);",
      "  float night=smoothstep(0.40,0.92,pr);",
      "  vec3 ro=vec3(0.,1.25+sin(t*0.25)*0.02,0.);",
      "  vec3 rd=normalize(vec3(uv.x,uv.y-0.045,-1.25));",
      // sol à direita, descendo até sumir sob o horizonte conforme o scroll
      "  float sunY=mix(0.16,-0.10,pr);",
      "  vec3 sunDir=normalize(vec3(0.44,sunY,-1.0));",
      "  vec3 moonDir=normalize(vec3(-0.32,0.40,-1.0));",
      "  float glow=smoothstep(-0.12,0.05,sunDir.y);",
      "  float above=smoothstep(-0.03,0.03,sunDir.y);",
      // paletas dia -> noite
      "  vec3 skyTop=mix(vec3(0.09,0.12,0.26),vec3(0.010,0.015,0.05),night);",
      "  vec3 skyHor=mix(vec3(0.98,0.56,0.31),vec3(0.04,0.05,0.13),night);",
      "  vec3 sunCol=mix(vec3(1.0,0.78,0.46),vec3(1.0,0.40,0.18),smoothstep(0.15,0.6,pr));",
      "  vec3 moonCol=vec3(0.80,0.85,1.0);",
      "  vec3 seaLo=mix(vec3(0.03,0.06,0.11),vec3(0.008,0.012,0.032),night);",
      "  vec3 seaHi=mix(vec3(0.16,0.21,0.29),vec3(0.03,0.05,0.10),night);",
      "  vec3 fog=mix(vec3(0.94,0.60,0.40),vec3(0.05,0.06,0.14),night);",
      "  vec3 col;",
      "  if(rd.y<0.0){",
      "    float tp=ro.y/(-rd.y);",
      "    float st=tp/float(STEPS);float m=st;",
      "    for(int i=0;i<STEPS;i++){",
      "      vec2 wp=ro.xz+rd.xz*m;",
      "      if(ro.y+rd.y*m < wh(wp,t)) break;",
      "      m+=st;",
      "    }",
      "    float a=m-st,b=m;",
      "    for(int i=0;i<REFINE;i++){",
      "      float mm=(a+b)*0.5;",
      "      if(ro.y+rd.y*mm < wh(ro.xz+rd.xz*mm,t)) b=mm; else a=mm;",
      "    }",
      "    m=(a+b)*0.5;",
      "    vec2 wp=ro.xz+rd.xz*m;",
      "    vec3 n=wn(wp,t);",
      "    float fres=pow(1.0-clamp(dot(n,-rd),0.,1.),5.0);",
      "    vec3 rfl=reflect(rd,n);",
      "    vec3 sky=mix(skyHor,skyTop,clamp(rfl.y,0.,1.));",
      "    float rs=max(dot(rfl,sunDir),0.);",
      "    sky+=sunCol*pow(rs,180.0)*2.6*glow;",
      "    sky+=sunCol*pow(rs,16.0)*0.12*glow;",
      "    float rm=max(dot(rfl,moonDir),0.);",
      "    sky+=moonCol*pow(rm,200.0)*1.4*night;",
      "    float depth=exp(-m*0.55);",
      "    vec3 water=mix(seaLo,seaHi,depth);",
      "    col=mix(water,sky,clamp(0.12+fres*0.82,0.,1.));",
      "    float glint=pow(max(dot(reflect(-sunDir,n),-rd),0.),140.0);",
      "    col+=sunCol*glint*1.6*glow;",
      "    float mglint=pow(max(dot(reflect(-moonDir,n),-rd),0.),260.0);",
      "    col+=moonCol*mglint*0.5*night;",
      "    float hc=wh(wp,t);",
      "    float cur=wh(wp+vec2(0.03,0.),t)+wh(wp-vec2(0.03,0.),t)+wh(wp+vec2(0.,0.03),t)+wh(wp-vec2(0.,0.03),t)-4.0*hc;",
      "    col+=vec3(1.0)*clamp(cur*22.0,0.,1.)*0.10*(1.0-0.6*night);",
      "    float f=1.0-exp(-m*0.028);",
      "    col=mix(col,fog,f*0.62);",
      "  }else{",
      "    float h=clamp(rd.y,0.,1.);",
      "    col=mix(skyHor,skyTop,pow(h,0.42));",
      "    float sd=max(dot(rd,sunDir),0.);",
      "    col+=sunCol*pow(sd,380.0)*6.0*above;",
      "    col+=sunCol*pow(sd,10.0)*0.28*glow;",
      "    col+=sunCol*pow(sd,3.0)*0.06*glow;",
      "    float md=max(dot(rd,moonDir),0.);",
      "    col+=moonCol*smoothstep(0.9975,0.9995,md)*2.4*night;",
      "    col+=moonCol*pow(md,8.0)*0.05*night;",
      "    float sf=hash(floor(rd.xy*vec2(240.0,240.0)));",
      "    col+=vec3(0.9,0.92,1.0)*smoothstep(0.987,1.0,sf)*night*smoothstep(0.03,0.28,rd.y);",
      "    col+=fog*exp(-abs(rd.y)*26.0)*0.10;",
      "  }",
      "  float hb=smoothstep(-0.012,0.012,rd.y);",
      "  col=mix(mix(col,fog,0.35),col,hb);",
      "  float vig=smoothstep(1.25,0.35,length(uv));",
      "  col*=0.55+0.45*vig;",
      "  col+=(hash(gl_FragCoord.xy+t*47.0)-0.5)*0.02;",
      "  gl_FragColor=vec4(clamp(col,0.,1.),1.0);",
      "}"
    ].join("\n");

    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s)); return null;
      }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { cv.style.display = "none"; return; }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog)); cv.style.display = "none"; return;
    }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, "uRes");
    var uTime = gl.getUniformLocation(prog, "uTime");
    var uProg = gl.getUniformLocation(prog, "uProg");
    var DPR = Math.min(window.devicePixelRatio || 1, 1.25);

    // progresso 0..1: 0 quando a seção entra por baixo, 1 quando sai por cima
    var sceneProg = 0;
    function targetProg() {
      var r = host.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var p = (vh - r.top) / (vh + r.height);
      return p < 0 ? 0 : p > 1 ? 1 : p;
    }

    function resize() {
      var r = host.getBoundingClientRect();
      var w = Math.max(1, Math.round(r.width * DPR));
      var h = Math.max(1, Math.round(r.height * DPR));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w; cv.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    }

    var t0 = performance.now();
    function render(now) {
      var tp = targetProg();
      sceneProg += reduce ? (tp - sceneProg) : (tp - sceneProg) * 0.12;
      if (Math.abs(tp - sceneProg) < 0.001) sceneProg = tp;
      gl.uniform1f(uProg, sceneProg);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    var raf = 0, running = false;
    function loop(now) {
      if (!running) return;
      render(now);
      raf = window.requestAnimationFrame(loop);
    }
    function start() { if (!running) { running = true; raf = window.requestAnimationFrame(loop); } }
    function stop() { running = false; if (raf) window.cancelAnimationFrame(raf); }

    resize();
    render(performance.now());
    window.addEventListener("resize", function () { resize(); if (!running) render(performance.now()); }, { passive: true });
    // acompanha o scroll mesmo quando o rAF está lento ou pausado
    window.addEventListener("scroll", function () { render(performance.now()); }, { passive: true });

    if (reduce) return;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? start() : stop(); });
      }, { threshold: 0.01 }).observe(host);
    } else {
      start();
    }
  })();
})();
