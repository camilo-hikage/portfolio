/* Gera a arte SVG do hero "pôr do sol -> noite" em images/hills/.
   Cena autoral, no espírito de parallaxes de colinas em camadas.
   Rode com:  node .claude/gen-hills.js */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "images", "hills");
fs.mkdirSync(OUT, { recursive: true });

let _seed = 90210;
const rnd = () => ((_seed = (_seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const rr = (a, b) => a + (b - a) * rnd();
const f1 = (n) => n.toFixed(1);
const write = (name, svg) => {
  fs.writeFileSync(path.join(OUT, name), svg.replace(/\n\s*\n/g, "\n").trim() + "\n");
  console.log("  images/hills/" + name);
};

/* ---------- colina tileável ---------- */
function hill(name, { crest, amp, edge, top, bottom }) {
  const W = 1600, H = 600, n = 7;
  const ys = [];
  for (let i = 0; i <= n; i++) {
    ys.push(i === 0 || i === n
      ? edge
      : crest + Math.sin(i * 1.3 + 1.5) * amp * rr(0.5, 1) + rr(-amp * 0.22, amp * 0.22));
  }
  let curve = "";
  for (let i = 1; i <= n; i++) {
    const x0 = (W / n) * (i - 1), x1 = (W / n) * i, cx = (x0 + x1) / 2;
    curve += `Q ${f1(x0 + (x1 - x0) * 0.28)} ${f1(ys[i - 1])} ${f1(cx)} ${f1((ys[i - 1] + ys[i]) / 2)} `;
    curve += `T ${f1(x1)} ${f1(ys[i])} `;
  }
  const d = `M0 ${H} L0 ${f1(ys[0])} ${curve}L ${W} ${H} Z`;
  const id = name.replace(".svg", "");
  return write(name, `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="${crest - amp}" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
  </defs>
  <path d="${d}" fill="url(#g-${id})"/>
</svg>`);
}

/* ---------- nuvem ---------- */
function cloud(name, opacity) {
  const blob =
    "M60 150 q-42 0 -42 -36 q0 -32 36 -35 q6 -36 46 -36 q32 0 42 26 q15 -13 36 -13 q32 0 40 28 " +
    "q11 -7 26 -7 q36 0 42 32 q24 2 28 21 q4 26 -28 26 z";
  return write(name, `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 190">
  <path d="${blob}" fill="#fdf1e8" opacity="${opacity}"/>
</svg>`);
}

/* ---------- estrelas (tile) ---------- */
function stars() {
  const S = 400;
  let s = "";
  for (let i = 0; i < 34; i++) {
    const x = rr(4, S - 4), y = rr(4, S - 4);
    const r = Math.pow(rnd(), 2.4) * 1.5 + 0.3;
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r.toFixed(2)}" fill="#fff" opacity="${rr(0.35, 1).toFixed(2)}"/>`;
  }
  return write("stars.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">${s}</svg>`);
}

/* ---------- pássaro ---------- */
function bird() {
  return write("bird.svg", `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 22">
  <path d="M2 14 Q 12 2 24 12 Q 36 2 46 14" fill="none" stroke="#241a2e" stroke-width="3" stroke-linecap="round"/>
</svg>`);
}

console.log("gerando cena do pôr do sol:");
//                    crest amp  edge  top          bottom
hill("hill-1.svg", { crest: 300, amp: 20, edge: 308, top: "#7a5570", bottom: "#664a60" });
hill("hill-2.svg", { crest: 330, amp: 32, edge: 342, top: "#5f4560", bottom: "#4b374e" });
hill("hill-3.svg", { crest: 362, amp: 44, edge: 378, top: "#48324f", bottom: "#37273f" });
hill("hill-4.svg", { crest: 398, amp: 56, edge: 418, top: "#342740", bottom: "#241b30" });
hill("hill-5.svg", { crest: 434, amp: 68, edge: 456, top: "#221a2f", bottom: "#141020" });
hill("hill-6.svg", { crest: 474, amp: 78, edge: 498, top: "#120d1c", bottom: "#080611" });
cloud("cloud-a.svg", 0.92);
cloud("cloud-b.svg", 0.7);
stars();
bird();
console.log("ok");
