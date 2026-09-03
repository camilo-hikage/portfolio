/* Gera a arte SVG do hero "Explore the Space" e da seção de planetas.
   Saída: images/space/  ->  bg-1..3.svg, neptune.svg, jupiter.svg, saturn.svg
   Rode com:  node .claude/gen-space.js
   Conceito adaptado do gist "Space Explore" de krishnaPC. */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "images", "space");
fs.mkdirSync(OUT, { recursive: true });

let _seed = 424242;
const rnd = () => ((_seed = (_seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const rr = (a, b) => a + (b - a) * rnd();
const n1 = (n) => n.toFixed(1);
const write = (name, svg) => {
  fs.writeFileSync(path.join(OUT, name), svg.replace(/\n\s*\n/g, "\n").trim() + "\n");
  console.log("  images/space/" + name);
};

/* ---------------- fundos estrelados / nebulosa ---------------- */
function stars(count, w, h, rMax, opMin) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const x = rr(0, w), y = rr(0, h);
    const r = Math.pow(rnd(), 2.3) * rMax + 0.25;
    s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r.toFixed(2)}" fill="#fdf8ff" opacity="${rr(opMin, 0.95).toFixed(2)}"/>`;
  }
  return s;
}
function glints(count, w, h) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const x = rr(w * 0.08, w * 0.92), y = rr(h * 0.08, h * 0.92), l = rr(9, 20);
    s += `<g opacity="${rr(0.5, 0.9).toFixed(2)}" transform="translate(${n1(x)} ${n1(y)})">
      <circle r="2.2" fill="#fff"/>
      <path d="M${-l} 0H${l}M0 ${-l}V${l}" stroke="#dbe8ff" stroke-width="1.4" stroke-linecap="round"/>
      <circle r="7" fill="#9fc2ff" opacity="0.3"/></g>`;
  }
  return s;
}

function bg1() {
  const W = 1600, H = 1000;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="v" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="#0c1030"/><stop offset="60%" stop-color="#06081b"/><stop offset="100%" stop-color="#020309"/>
    </radialGradient>
    <radialGradient id="neb-a" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#5a2b9c" stop-opacity="0.5"/><stop offset="100%" stop-color="#5a2b9c" stop-opacity="0"/></radialGradient>
    <radialGradient id="neb-b" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#1f4fae" stop-opacity="0.45"/><stop offset="100%" stop-color="#1f4fae" stop-opacity="0"/></radialGradient>
    <radialGradient id="neb-c" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#14776b" stop-opacity="0.35"/><stop offset="100%" stop-color="#14776b" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#v)"/>
  <ellipse cx="430" cy="360" rx="620" ry="360" fill="url(#neb-a)" transform="rotate(-18 430 360)"/>
  <ellipse cx="1200" cy="640" rx="560" ry="380" fill="url(#neb-b)" transform="rotate(12 1200 640)"/>
  <ellipse cx="900" cy="230" rx="500" ry="260" fill="url(#neb-c)"/>
  ${stars(240, W, H, 1.5, 0.25)}
</svg>`;
}
function bg2() {
  const W = 1600, H = 1000;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="w1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#a03bce" stop-opacity="0.35"/><stop offset="100%" stop-color="#a03bce" stop-opacity="0"/></radialGradient>
    <radialGradient id="w2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#2ec8d8" stop-opacity="0.28"/><stop offset="100%" stop-color="#2ec8d8" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="300" cy="780" rx="520" ry="240" fill="url(#w1)" transform="rotate(-22 300 780)"/>
  <ellipse cx="1330" cy="250" rx="460" ry="230" fill="url(#w2)" transform="rotate(16 1330 250)"/>
  ${stars(110, W, H, 2.2, 0.4)}
</svg>`;
}
function bg3() {
  const W = 1600, H = 1000;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  ${stars(46, W, H, 2.6, 0.55)}
  ${glints(9, W, H)}
</svg>`;
}

/* ---------------- planetas ---------------- */
function sphereDefs(id, c1, c2, c3) {
  return `
  <radialGradient id="body-${id}" cx="36%" cy="32%" r="80%">
    <stop offset="0%" stop-color="${c1}"/><stop offset="52%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/>
  </radialGradient>
  <radialGradient id="term-${id}" cx="72%" cy="74%" r="72%">
    <stop offset="45%" stop-color="#000010" stop-opacity="0"/><stop offset="100%" stop-color="#01030a" stop-opacity="0.72"/>
  </radialGradient>
  <radialGradient id="atmo-${id}" cx="50%" cy="50%" r="50%">
    <stop offset="72%" stop-color="${c1}" stop-opacity="0"/><stop offset="90%" stop-color="${c1}" stop-opacity="0.22"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
  </radialGradient>`;
}

function neptune() {
  const S = 520, c = S / 2, R = 190;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
  <defs>
    ${sphereDefs("n", "#5b86f2", "#2f57c8", "#16267a")}
    <clipPath id="cn"><circle cx="${c}" cy="${c}" r="${R}"/></clipPath>
  </defs>
  <circle cx="${c}" cy="${c}" r="${R + 26}" fill="url(#atmo-n)"/>
  <g clip-path="url(#cn)">
    <circle cx="${c}" cy="${c}" r="${R}" fill="url(#body-n)"/>
    <g opacity="0.5">
      <ellipse cx="${c}" cy="${c - 78}" rx="${R}" ry="20" fill="#8fb4ff" opacity="0.25"/>
      <ellipse cx="${c}" cy="${c - 20}" rx="${R}" ry="26" fill="#20408f" opacity="0.35"/>
      <ellipse cx="${c}" cy="${c + 58}" rx="${R}" ry="22" fill="#8fb4ff" opacity="0.16"/>
    </g>
    <ellipse cx="${c - 46}" cy="${c + 40}" rx="42" ry="24" fill="#101d5c" opacity="0.8"/>
    <circle cx="${c}" cy="${c}" r="${R}" fill="url(#term-n)"/>
  </g>
  <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="#bcd2ff" stroke-opacity="0.22" stroke-width="2"/>
</svg>`;
}

function jupiter() {
  const S = 520, c = S / 2, R = 196;
  const band = (dy, ry, fill, op) =>
    `<ellipse cx="${c}" cy="${c + dy}" rx="${R}" ry="${ry}" fill="${fill}" opacity="${op}"/>`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
  <defs>
    ${sphereDefs("j", "#e7cfa8", "#cf9a67", "#7c4a2e")}
    <clipPath id="cj"><circle cx="${c}" cy="${c}" r="${R}"/></clipPath>
  </defs>
  <circle cx="${c}" cy="${c}" r="${R + 24}" fill="url(#atmo-j)"/>
  <g clip-path="url(#cj)">
    <circle cx="${c}" cy="${c}" r="${R}" fill="url(#body-j)"/>
    ${band(-120, 30, "#f0e0c6", 0.7)}
    ${band(-78, 20, "#b97c4f", 0.6)}
    ${band(-34, 26, "#eddabb", 0.7)}
    ${band(6, 18, "#a8683f", 0.55)}
    ${band(44, 28, "#f2e3c9", 0.6)}
    ${band(92, 22, "#b07647", 0.55)}
    ${band(132, 26, "#e9d6b6", 0.5)}
    <ellipse cx="${c - 58}" cy="${c + 40}" rx="40" ry="24" fill="#b5442e" opacity="0.9"/>
    <ellipse cx="${c - 58}" cy="${c + 40}" rx="22" ry="12" fill="#d9694a" opacity="0.8"/>
    <circle cx="${c}" cy="${c}" r="${R}" fill="url(#term-j)"/>
  </g>
  <circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="#ffe9c8" stroke-opacity="0.2" stroke-width="2"/>
</svg>`;
}

function saturn() {
  const W = 780, H = 520, c = W / 2, cy = H / 2, R = 148;
  const back = (rx, ry, w, fill, op) =>
    `<ellipse cx="${c}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${fill}" stroke-width="${w}" opacity="${op}"/>`;
  // arco da frente = metade inferior da elipse
  const front = (rx, ry, w, fill, op) =>
    `<path d="M ${c - rx} ${cy} A ${rx} ${ry} 0 0 0 ${c + rx} ${cy}" fill="none" stroke="${fill}" stroke-width="${w}" opacity="${op}"/>`;
  const R1 = [300, 82, 20, "#d8c39a", 0.9];
  const R2 = [270, 73, 9, "#8b7a58", 0.55];
  const R3 = [248, 67, 16, "#c7b487", 0.85];
  const R4 = [214, 58, 8, "#ece0be", 0.7];
  const set = (fn) => [R1, R2, R3, R4].map((r) => fn(...r)).join("");
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <defs>
    ${sphereDefs("s", "#efe0b8", "#d8bd83", "#8a6c3f")}
    <clipPath id="cs"><circle cx="${c}" cy="${cy}" r="${R}"/></clipPath>
  </defs>
  <circle cx="${c}" cy="${cy}" r="${R + 22}" fill="url(#atmo-s)"/>
  <g transform="rotate(-16 ${c} ${cy})">${set(back)}</g>
  <g clip-path="url(#cs)">
    <circle cx="${c}" cy="${cy}" r="${R}" fill="url(#body-s)"/>
    <ellipse cx="${c}" cy="${cy - 54}" rx="${R}" ry="16" fill="#f3e8c8" opacity="0.4"/>
    <ellipse cx="${c}" cy="${cy + 6}" rx="${R}" ry="20" fill="#b99a63" opacity="0.35"/>
    <ellipse cx="${c}" cy="${cy + 52}" rx="${R}" ry="14" fill="#f3e8c8" opacity="0.25"/>
    <ellipse cx="${c + 30}" cy="${cy - 26}" rx="${R}" ry="13" fill="#241d30" opacity="0.30" transform="rotate(-16 ${c} ${cy})"/>
    <circle cx="${c}" cy="${cy}" r="${R}" fill="url(#term-s)"/>
  </g>
  <g transform="rotate(-16 ${c} ${cy})">${set(front)}</g>
  <circle cx="${c}" cy="${cy}" r="${R}" fill="none" stroke="#fff2d0" stroke-opacity="0.18" stroke-width="2"/>
</svg>`;
}

console.log("gerando arte do espaço:");
write("bg-1.svg", bg1());
write("bg-2.svg", bg2());
write("bg-3.svg", bg3());
write("neptune.svg", neptune());
write("jupiter.svg", jupiter());
write("saturn.svg", saturn());
console.log("ok");
