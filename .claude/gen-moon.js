/* Gera a arte SVG do hero "A Lua com vista para a Terra" em images/moon/.
   Rode com:  node .claude/gen-moon.js
   Ajuste as constantes abaixo para mexer no visual. */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "images", "moon");
fs.mkdirSync(OUT, { recursive: true });

let _seed = 20260903;
const rnd = () => ((_seed = (_seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const rr = (a, b) => a + (b - a) * rnd();
const f1 = (n) => n.toFixed(1);
const write = (name, svg) => {
  fs.writeFileSync(path.join(OUT, name), svg.replace(/\n\s*\n/g, "\n").trim() + "\n");
  console.log("  images/moon/" + name);
};

/* ---------- tile de estrelas (repetível) ---------- */
function starTile() {
  const S = 460;
  let s = "";
  for (let i = 0; i < 40; i++) {
    const x = rr(4, S - 4), y = rr(4, S - 4);
    const r = Math.pow(rnd(), 2.4) * 1.6 + 0.3;
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r.toFixed(2)}" fill="#fdf7ff" opacity="${rr(0.28, 0.9).toFixed(2)}"/>`;
  }
  // 2 estrelas com leve brilho
  for (let i = 0; i < 2; i++) {
    const x = rr(60, S - 60), y = rr(60, S - 60);
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.8" fill="#fff"/><circle cx="${f1(x)}" cy="${f1(y)}" r="6" fill="#bcd6ff" opacity="0.28"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">${s}</svg>`;
}

/* ---------- a Terra ---------- */
function earth() {
  const S = 640, c = S / 2, R = 210;
  const cont = (pts, fill, op = 1) =>
    `<path d="${pts}" fill="${fill}" opacity="${op}"/>`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
  <defs>
    <radialGradient id="atmo" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="#93c8ff" stop-opacity="0"/>
      <stop offset="85%" stop-color="#93c8ff" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#93c8ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ocean" cx="36%" cy="32%" r="80%">
      <stop offset="0%" stop-color="#3b7fc4"/>
      <stop offset="50%" stop-color="#1d548f"/>
      <stop offset="100%" stop-color="#0a2542"/>
    </radialGradient>
    <radialGradient id="night" cx="74%" cy="72%" r="70%">
      <stop offset="46%" stop-color="#000010" stop-opacity="0"/>
      <stop offset="100%" stop-color="#01030a" stop-opacity="0.86"/>
    </radialGradient>
    <clipPath id="g"><circle cx="${c}" cy="${c}" r="${R}"/></clipPath>
  </defs>
  <circle cx="${c}" cy="${c}" r="${R + 30}" fill="url(#atmo)"/>
  <g clip-path="url(#g)">
    <circle cx="${c}" cy="${c}" r="${R}" fill="url(#ocean)"/>
    <g>
      ${cont("M232 168 q40 -30 92 -22 q52 8 60 44 q8 40 -34 66 q-46 28 -104 12 q-52 -16 -46 -60 q4 -30 32 -46z", "#357a49")}
      ${cont("M170 300 q34 -22 74 -10 q40 12 40 46 q0 40 -44 58 q-52 20 -84 -10 q-26 -26 -12 -58 q10 -22 26 -26z", "#3f8350")}
      ${cont("M330 316 q46 -16 82 8 q30 20 20 52 q-14 40 -66 42 q-56 2 -74 -34 q-14 -30 8 -52 q14 -12 30 -16z", "#2f7043")}
      ${cont("M300 150 q30 -12 52 6 q16 16 6 36 q-16 26 -50 20 q-28 -6 -30 -32 q0 -18 22 -30z", "#caa262", 0.9)}
      ${cont("M196 258 q20 -10 36 4 q12 12 2 28 q-16 18 -38 8 q-16 -10 -8 -26 q2 -8 8 -14z", "#c39a5c", 0.85)}
    </g>
    <g fill="#eef4ff">
      <path d="M120 210 q54 -24 110 -4 q46 14 96 2 q-20 30 -84 32 q-84 4 -122 -32z" opacity="0.42"/>
      <path d="M250 372 q44 -18 92 -4 q42 12 78 0 q-16 28 -78 30 q-72 2 -92 -26z" opacity="0.38"/>
      <path d="M330 120 q34 -12 62 2 q-12 20 -46 20 q-24 0 -16 -22z" opacity="0.5"/>
      <path d="M150 150 q30 -10 54 4 q-12 18 -42 16 q-22 -2 -12 -20z" opacity="0.35"/>
    </g>
    <circle cx="${c}" cy="${c}" r="${R}" fill="url(#night)"/>
  </g>
  <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="#c3e1ff" stroke-opacity="0.22" stroke-width="2"/>
</svg>`;
}

/* ---------- cordilheiras lunares (tileáveis) ---------- */
function ridge(name, { crest, amp, edge, base, lit, craters }) {
  const W = 3200, H = 900;
  const n = 8;
  const ys = [];
  for (let i = 0; i <= n; i++) {
    if (i === 0 || i === n) ys.push(edge);
    else ys.push(crest + Math.sin(i * 1.5 + 2) * amp * rr(0.5, 1) + rr(-amp * 0.25, amp * 0.25));
  }
  // curva só da crista (para traçar apenas o topo, sem as laterais)
  let curve = "";
  for (let i = 1; i <= n; i++) {
    const x0 = (W / n) * (i - 1), x1 = (W / n) * i;
    const cx = (x0 + x1) / 2;
    curve += `Q ${f1(x0 + (x1 - x0) * 0.25)} ${f1(ys[i - 1])} ${f1(cx)} ${f1((ys[i - 1] + ys[i]) / 2)} `;
    curve += `T ${f1(x1)} ${f1(ys[i])} `;
  }
  const crestPath = `M0 ${f1(ys[0])} ${curve}`;
  const d = `M0 ${H} L0 ${f1(ys[0])} ${curve}L ${W} ${H} Z`;

  let bumps = "";
  for (let i = 0; i < craters; i++) {
    const cx = rr(W * 0.08, W * 0.92);
    const cy = crest + rr(amp * 0.6, amp * 1.6);
    const rx = rr(46, 104), ry = rx * rr(0.34, 0.46);
    // sombra interna + meia-lua iluminada na borda
    bumps += `<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="#000" opacity="0.14"/>`;
    bumps += `<path d="M${(cx - rx).toFixed(0)} ${(cy + ry * 0.15).toFixed(0)} a ${rx.toFixed(0)} ${ry.toFixed(0)} 0 0 1 ${(rx * 2).toFixed(0)} 0" fill="none" stroke="${lit}" stroke-opacity="0.28" stroke-width="2"/>`;
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">
  <path d="${d}" fill="${base}"/>
  ${bumps}
  <path d="${crestPath}" fill="none" stroke="${lit}" stroke-opacity="0.4" stroke-width="3"/>
</svg>`;
  write(name, svg);
}

/* ---------- primeiro plano ---------- */
function foreground() {
  const W = 3200, H = 900, base = "#0b0b10";
  let d = `M0 ${H} L0 812 `;
  d += `C 360 720 620 700 900 760 `;
  d += `C 1080 798 1180 812 1360 800 `;
  d += `C 1560 786 1660 690 1980 690 `;
  d += `C 2260 690 2420 770 2680 800 `;
  d += `C 2860 820 3010 800 ${W} 770 L ${W} ${H} Z`;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">
  <path d="${d}" fill="${base}"/>
  <path d="${d}" fill="none" stroke="#7f8fb4" stroke-opacity="0.22" stroke-width="3"/>
  <path d="M1360 800 q140 -150 320 -150 q200 0 300 150 q-300 26 -620 0z" fill="#070709"/>
</svg>`;
  write("foreground.svg", svg);
}

console.log("gerando arte da lua:");
write("stars.svg", starTile());
write("earth.svg", earth());
//                         crest  amp  edge   base       lit(rim)   craters
ridge("ridge-1.svg", { crest: 486, amp: 28, edge: 496, base: "#6a6d78", lit: "#c2cbdc", craters: 2 });
ridge("ridge-2.svg", { crest: 552, amp: 40, edge: 562, base: "#545764", lit: "#a4accf", craters: 2 });
ridge("ridge-3.svg", { crest: 626, amp: 52, edge: 640, base: "#40424d", lit: "#868ea6", craters: 3 });
ridge("ridge-4.svg", { crest: 706, amp: 66, edge: 724, base: "#2c2e37", lit: "#6b7391", craters: 3 });
ridge("ridge-5.svg", { crest: 792, amp: 82, edge: 812, base: "#1a1b22", lit: "#535c78", craters: 3 });
foreground();
console.log("ok");
