/* Gera a arte SVG da cena de parallax (montanhas + floresta na neblina) em
   images/scene/. Cena autoral; técnica de parallax por variável CSS + basicScroll
   inspirada no pen "Parallax scene with CSS variables" de electerious.
   Rode com:  node .claude/gen-scene.js */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "images", "scene");
fs.mkdirSync(OUT, { recursive: true });

const W = 1750, H = 520;
let _seed = 13317;
const rnd = () => ((_seed = (_seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const rr = (a, b) => a + (b - a) * rnd();
const f = (n) => n.toFixed(1);
const write = (name, body) => {
  fs.writeFileSync(
    path.join(OUT, name),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">\n${body}\n</svg>\n`
  );
  console.log("  images/scene/" + name);
};

/* ---------- céu ---------- */
function sky() {
  write("scene-0.svg", `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#c9d4dc"/>
      <stop offset="0.55" stop-color="#dcdcd2"/>
      <stop offset="1" stop-color="#e9dcc2"/>
    </linearGradient>
    <radialGradient id="sun" cx="50%" cy="52%" r="50%">
      <stop offset="0" stop-color="#fbf3df" stop-opacity="0.95"/>
      <stop offset="0.7" stop-color="#f6ead0" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#f6ead0" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <circle cx="${W * 0.5}" cy="${H * 0.42}" r="150" fill="url(#sun)"/>
  <g fill="#b9c4cc" opacity="0.35">
    <ellipse cx="380" cy="120" rx="420" ry="26"/>
    <ellipse cx="1300" cy="90" rx="500" ry="22"/>
    <ellipse cx="900" cy="180" rx="600" ry="18"/>
  </g>`);
}

/* ---------- cordilheira recortada (tileável) ---------- */
function mountain(name, { base, top, crest, jag, fill, haze }) {
  const n = 26;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = (W / n) * i;
    let y;
    if (i === 0 || i === n) y = base;
    else {
      const peak = rnd() < 0.32;
      y = base - (peak ? rr(jag * 0.6, jag) : rr(0, jag * 0.4));
      y = Math.min(y, base);
    }
    pts.push([x, Math.max(crest, y)]);
  }
  let d = `M0 ${H} L0 ${f(pts[0][1])} `;
  for (let i = 1; i <= n; i++) d += `L ${f(pts[i][0])} ${f(pts[i][1])} `;
  d += `L ${W} ${H} Z`;
  write(name, `
  <defs>
    <linearGradient id="${name}" x1="0" y1="${top}" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${top ? top : fill}"/>
      <stop offset="1" stop-color="${fill}"/>
    </linearGradient>
  </defs>
  <path d="${d}" fill="url(#${name})"/>
  ${haze ? `<path d="${d}" fill="#e7ecef" opacity="${haze}"/>` : ""}`);
}

/* ---------- floresta de pinheiros (tileável) ---------- */
function forest(name, { ground, density, hMin, hMax, fill, haze }) {
  let trees = "";
  let x = -30;
  while (x < W + 30) {
    const h = rr(hMin, hMax);
    const w = h * rr(0.5, 0.72);
    const baseY = ground + rr(-3, 4);
    const tx = x;
    // pinheiro: 2 triângulos empilhados
    const midY = baseY - h * 0.42;
    trees +=
      `<polygon points="${f(tx - w / 2)},${f(baseY)} ${f(tx)},${f(baseY - h * 0.62)} ${f(tx + w / 2)},${f(baseY)}"/>` +
      `<polygon points="${f(tx - w * 0.34)},${f(midY)} ${f(tx)},${f(baseY - h)} ${f(tx + w * 0.34)},${f(midY)}"/>`;
    x += rr(density * 0.55, density * 1.5);
  }
  write(name, `
  <path d="M0 ${H} L0 ${f(ground)} L ${W} ${f(ground)} L ${W} ${H} Z" fill="${fill}"/>
  <g fill="${fill}">${trees}</g>
  ${haze ? `<rect y="${f(ground - hMax)}" width="${W}" height="${f(hMax + 40)}" fill="#e7ecef" opacity="${haze}"/>` : ""}`);
}

console.log("gerando a cena de parallax:");
sky();
mountain("scene-1.svg", { base: 240, top: "#b3c0c9", crest: 60,  jag: 200, fill: "#9daeba", haze: 0.4 });
mountain("scene-2.svg", { base: 320, top: "#93a5b2", crest: 140, jag: 180, fill: "#7f96a5", haze: 0.2 });
forest("scene-3.svg", { ground: 300, density: 30, hMin: 34, hMax: 96,  fill: "#647b8a", haze: 0.28 });
forest("scene-4.svg", { ground: 380, density: 24, hMin: 48, hMax: 140, fill: "#485d6e", haze: 0.12 });
forest("scene-5.svg", { ground: 470, density: 18, hMin: 70, hMax: 210, fill: "#2b3a47" });
console.log("ok");
