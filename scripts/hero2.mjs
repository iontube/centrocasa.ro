// Hero v2: fundal colorat cu forme abstracte + 1-2 produse MARI, FARA text.
// Fiecare articol = fundal UNIC (culoare + forme), derivat din seed (slug).
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const W = 1600, H = 900;

// ---- seed / PRNG determinist per slug ----
function hashStr(s) { let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return h >>> 0; }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---- 24 scheme de culoare vii (bg gradient soft + forme accent) ----
const SCHEMES = [
  { bg: ['#fde4d0', '#f7c9a6'], sh: ['#f4926b', '#e56b4e', '#fbd7b0', '#c94f37'] },
  { bg: ['#d6efe6', '#a9dcc8'], sh: ['#38a382', '#1f7a63', '#c6ead9', '#0f5c48'] },
  { bg: ['#e2e0f5', '#c3bfe9'], sh: ['#7c6fd6', '#5a4bbf', '#d6d1f0', '#3f2fa0'] },
  { bg: ['#fdeecb', '#f7d98f'], sh: ['#e8b73f', '#cf9a24', '#f7e6b0', '#a87b14'] },
  { bg: ['#d3ecf7', '#a7d6ef'], sh: ['#3a97cc', '#2073ab', '#c2e4f4', '#0f5680'] },
  { bg: ['#fbdce4', '#f4b6c6'], sh: ['#e8698a', '#cf4a6e', '#f7cdd8', '#a82f52'] },
  { bg: ['#dcefd0', '#bfe0a6'], sh: ['#79b84e', '#5c9a33', '#d2ecc0', '#3f7519'] },
  { bg: ['#e8e4de', '#cfc7bb'], sh: ['#8a7c68', '#6b5d49', '#ddd5c8', '#4d4030'] },
  { bg: ['#d1f0f2', '#a3dee2'], sh: ['#37a7b0', '#1f8188', '#bfe9ec', '#0f6067'] },
  { bg: ['#f7dccb', '#eeb99a'], sh: ['#d98a5e', '#bd6c3e', '#f2d0ba', '#94501f'] },
  { bg: ['#e0e6f2', '#b8c4e5'], sh: ['#5e7ac9', '#3f5aae', '#cdd6ee', '#273f88'] },
  { bg: ['#f2e0ef', '#e0bcdb'], sh: ['#c065b0', '#a2438f', '#eccce6', '#79256a'] },
  { bg: ['#fce9d4', '#f6cf9f'], sh: ['#ef9d3d', '#d47e1f', '#f9dfb8', '#a85e10'] },
  { bg: ['#d9ede0', '#b3d9c1'], sh: ['#4fa679', '#2f8058', '#cbe8d6', '#175c3c'] },
  { bg: ['#efe3d0', '#dcc7a4'], sh: ['#c69a5c', '#a87c3e', '#ecdcc0', '#7a561f'] },
  { bg: ['#f5d9d5', '#eab0a8'], sh: ['#dc7466', '#c15446', '#f4cabf', '#95352a'] },
  { bg: ['#d5e3f0', '#adc6e4'], sh: ['#5081bf', '#3462a0', '#c6d9ef', '#1f477a'] },
  { bg: ['#e6eccb', '#cfdd9c'], sh: ['#a2b845', '#84992a', '#dde8b8', '#5f7215'] },
  { bg: ['#f0dfe8', '#dcb8cf'], sh: ['#c56a99', '#a5497a', '#eccbe0', '#7c2b57'] },
  { bg: ['#d0eef0', '#a1dde0'], sh: ['#33a3a8', '#1c7d82', '#bde8ea', '#0e5c60'] },
  { bg: ['#fbe3c8', '#f4c690'], sh: ['#e79a45', '#c97a24', '#f8ddb4', '#9c5a12'] },
  { bg: ['#dde0ee', '#bcc2e0'], sh: ['#6b74c2', '#4b55a4', '#d0d4ec', '#2d3680'] },
  { bg: ['#f6dbe0', '#ecb4bf'], sh: ['#dd6f83', '#c14f64', '#f5c9d1', '#94324a'] },
  { bg: ['#dcedd7', '#b9dcaf'], sh: ['#5fa956', '#40833a', '#d0e9c9', '#255f20'] },
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function loadBuf(src) { return readFileSync(src); }

// CUTOUT: scoate fundalul alb prin flood-fill de la margini (pastreaza albul din interiorul produsului)
async function cutout(src, boxW, boxH) {
  let img = sharp(readFileSync(src));
  try { img = sharp(await img.trim({ threshold: 12 }).toBuffer()); } catch { }
  const { data, info } = await img.resize(boxW, boxH, { fit: 'inside', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const isWhite = i => { const a = data[i + 3]; if (a < 12) return true; const r = data[i], g = data[i + 1], b = data[i + 2]; return r > 236 && g > 236 && b > 236 && (Math.max(r, g, b) - Math.min(r, g, b)) < 14; };
  const seen = new Uint8Array(w * h), stack = [];
  const push = (x, y) => { if (x < 0 || y < 0 || x >= w || y >= h) return; const p = y * w + x; if (seen[p]) return; seen[p] = 1; if (isWhite(p * 4)) stack.push(p); };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) { const p = stack.pop(); data[p * 4 + 3] = 0; const x = p % w, y = (p / w) | 0; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); }
  // GAURI INCHISE (ex spatiul dintre manere): componenta alba ramasa care NU atinge transparentul exterior
  // (e inconjurata DOAR de produs opac) -> e gaura de fundal -> transparenta. Corpurile albe (plite/ceasuri)
  // ating conturul transparent al siluetei, deci se pastreaza.
  const done = new Uint8Array(w * h);
  for (let p0 = 0; p0 < w * h; p0++) {
    if (done[p0] || data[p0 * 4 + 3] === 0 || !isWhite(p0 * 4)) continue;
    const comp = [], st = [p0]; done[p0] = 1; let touchesTransparent = false;
    while (st.length) { const p = st.pop(); comp.push(p); const x = p % w, y = (p / w) | 0;
      const nb = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
      for (const [nx, ny] of nb) { if (nx<0||ny<0||nx>=w||ny>=h) { touchesTransparent = true; continue; } const q = ny*w+nx;
        if (data[q*4+3] === 0) { touchesTransparent = true; continue; }
        if (done[q]) continue; if (isWhite(q*4)) { done[q]=1; st.push(q); } }
    }
    // gaura = INCHISA (nu atinge transparentul) SI MICA (<30% din suprafata). Asa scoatem bucla manerului
    // (~10%) dar pastram suprafata alba mare a unei plite/ceas cu rama (~60%).
    if (!touchesTransparent && comp.length < w * h * 0.30) for (const p of comp) data[p * 4 + 3] = 0;
  }
  return { buf: await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer(), w, h };
}

// umbra moale (elipsa blurata) sub produs, pentru efect de plutire
function shadowSvg(cx, cy, rw) {
  return `<svg width="${W}" height="${H}"><defs><filter id="sb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="26"/></filter></defs>
    <ellipse cx="${cx}" cy="${cy}" rx="${rw}" ry="${Math.round(rw * 0.16)}" fill="#20142e" opacity="0.22" filter="url(#sb)"/></svg>`;
}

// produs pe card alb rotunjit cu umbra (pozele eMAG au fundal alb -> se topeste in card)
async function card(src, cw, ch, rx) {
  const pad = Math.round(cw * 0.08);
  const p = await prod(src, cw - pad * 2, ch - pad * 2);
  const svg = `<svg width="${cw}" height="${ch}"><rect width="${cw}" height="${ch}" rx="${rx}" fill="#fff" filter="url(#sc)"/>
    <defs><filter id="sc" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="26" flood-color="#2a1a3a" flood-opacity="0.20"/></filter></defs></svg>`;
  return sharp(Buffer.from(svg)).png().composite([{ input: p, top: pad, left: pad }]).toBuffer();
}

function shapesSvg(scheme, rng) {
  const parts = [];
  const types = ['circle', 'ring', 'roundrect', 'triangle', 'circle', 'blob'];
  const nShapes = 5 + Math.floor(rng() * 3);
  for (let i = 0; i < nShapes; i++) {
    const t = types[Math.floor(rng() * types.length)];
    const col = scheme.sh[Math.floor(rng() * scheme.sh.length)];
    const op = (0.14 + rng() * 0.32).toFixed(2);
    const x = Math.round(rng() * W), y = Math.round(rng() * H);
    const s = Math.round(120 + rng() * 460);
    const rot = Math.round(rng() * 360);
    if (t === 'circle') parts.push(`<circle cx="${x}" cy="${y}" r="${Math.round(s / 2)}" fill="${col}" opacity="${op}"/>`);
    else if (t === 'blob') parts.push(`<ellipse cx="${x}" cy="${y}" rx="${Math.round(s / 2)}" ry="${Math.round(s / 3)}" transform="rotate(${rot} ${x} ${y})" fill="${col}" opacity="${op}"/>`);
    else if (t === 'ring') parts.push(`<circle cx="${x}" cy="${y}" r="${Math.round(s / 2)}" fill="none" stroke="${col}" stroke-width="${Math.round(14 + rng() * 26)}" opacity="${op}"/>`);
    else if (t === 'roundrect') parts.push(`<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="${Math.round(s * 0.28)}" transform="rotate(${rot} ${x} ${y})" fill="${col}" opacity="${op}"/>`);
    else if (t === 'triangle') { const h = s * 0.87; parts.push(`<polygon points="${x},${y - h / 2} ${x - s / 2},${y + h / 2} ${x + s / 2},${y + h / 2}" transform="rotate(${rot} ${x} ${y})" fill="${col}" opacity="${op}"/>`); }
  }
  return `<svg width="${W}" height="${H}">${parts.join('')}</svg>`;
}

// atribuire SECVENTIALA a schemei de culoare per slug (fiecare articol = culoare distincta),
// persistata in src/data/hero-schemes.json. Peste 24 articole, culorile se reiau dar formele difera.
const MAPF = fileURLToPath(new URL('../src/data/hero-schemes.json', import.meta.url));
function schemeFor(seed) {
  let map = {};
  try { if (existsSync(MAPF)) map = JSON.parse(readFileSync(MAPF, 'utf8')); } catch { }
  if (map[seed] != null) return map[seed];
  // alege indexul cel mai putin folosit (spread maxim de culoare)
  const counts = new Array(SCHEMES.length).fill(0);
  for (const k of Object.keys(map)) counts[map[k]]++;
  let best = 0, min = Infinity;
  for (let i = 0; i < SCHEMES.length; i++) { if (counts[i] < min) { min = counts[i]; best = i; } }
  map[seed] = best;
  try { writeFileSync(MAPF, JSON.stringify(map, null, 1)); } catch { }
  return best;
}

// products = 1 sau 2 cai de imagine; seed = slug (string) -> fundal unic
export async function buildHeroV2({ products = [], out, seed = 'x' }) {
  const rng = mulberry32(hashStr(seed));
  const scheme = SCHEMES[schemeFor(seed)];
  const bg = Buffer.from(`<svg width="${W}" height="${H}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${scheme.bg[0]}"/><stop offset="1" stop-color="${scheme.bg[1]}"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/></svg>`);
  const composites = [];
  composites.push({ input: Buffer.from(shapesSvg(scheme, rng)), top: 0, left: 0 });

  // OSCILEAZA numarul de produse (1 sau 2) per articol, determinist din slug
  const want = (hashStr(seed + '::count') % 2) + 1;
  const n = Math.min(want, products.length) || 1;
  const shadows = [], prods = [];
  if (n === 1) {
    const box = 720, cx = Math.round(W * 0.5), cy = Math.round(H * 0.5);
    const c = await cutout(products[0], box, box);
    shadows.push({ input: Buffer.from(shadowSvg(cx, cy + Math.round(c.h * 0.42), Math.round(c.w * 0.42))), top: 0, left: 0 });
    prods.push({ input: c.buf, top: Math.round(cy - c.h / 2), left: Math.round(cx - c.w / 2) });
  } else {
    const box = 600;
    const slots = [{ x: 0.35, y: 0.48 }, { x: 0.65, y: 0.52 }];
    for (let i = 0; i < 2; i++) {
      const cx = Math.round(W * slots[i].x), cy = Math.round(H * slots[i].y);
      const c = await cutout(products[i], box, box);
      shadows.push({ input: Buffer.from(shadowSvg(cx, cy + Math.round(c.h * 0.42), Math.round(c.w * 0.4))), top: 0, left: 0 });
      prods.push({ input: c.buf, top: Math.round(cy - c.h / 2), left: Math.round(cx - c.w / 2) });
    }
  }
  composites.push(...shadows, ...prods);
  await sharp(bg).composite(composites).webp({ quality: 86 }).toFile(out);
  return out;
}

// Varianta cu produse pe CARD ALB (fara cutout) — pentru produse albe/crem
// pe care flood-fill-ul le erodeaza. Fundal colorat cu forme, la fel, dar
// fiecare produs sta intr-un card alb rotunjit cu umbra, care il incadreaza.
export async function buildHeroCards({ products = [], out, seed = 'x' }) {
  const rng = mulberry32(hashStr(seed));
  const scheme = SCHEMES[schemeFor(seed)];
  const bg = Buffer.from(`<svg width="${W}" height="${H}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${scheme.bg[0]}"/><stop offset="1" stop-color="${scheme.bg[1]}"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/></svg>`);
  const composites = [];
  composites.push({ input: Buffer.from(shapesSvg(scheme, rng)), top: 0, left: 0 });

  const want = (hashStr(seed + '::count') % 2) + 1;
  const n = Math.min(want, products.length) || 1;
  const layouts = n === 1
    ? [{ cx: 0.5, cy: 0.5, cw: 560, ch: 620 }]
    : [{ cx: 0.31, cy: 0.5, cw: 470, ch: 600 }, { cx: 0.69, cy: 0.5, cw: 470, ch: 600 }];

  for (let i = 0; i < n; i++) {
    const L = layouts[i];
    const cx = Math.round(W * L.cx), cy = Math.round(H * L.cy);
    const x = Math.round(cx - L.cw / 2), y = Math.round(cy - L.ch / 2);
    const pad = 46, r = 34;
    // umbra + card alb rotunjit
    const card = Buffer.from(`<svg width="${W}" height="${H}">
      <defs><filter id="s${i}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="26" flood-color="#000" flood-opacity="0.20"/></filter></defs>
      <rect x="${x}" y="${y}" width="${L.cw}" height="${L.ch}" rx="${r}" ry="${r}" fill="#ffffff" filter="url(#s${i})"/></svg>`);
    composites.push({ input: card, top: 0, left: 0 });
    // produs redimensionat sa incapa in card, pe fundal alb (contain)
    const innerW = L.cw - pad * 2, innerH = L.ch - pad * 2;
    const pbuf = await sharp(products[i])
      .resize(innerW, innerH, { fit: 'inside', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .toBuffer();
    const meta = await sharp(pbuf).metadata();
    const px = Math.round(cx - meta.width / 2), py = Math.round(cy - meta.height / 2);
    composites.push({ input: pbuf, top: py, left: px });
  }

  await sharp(bg).composite(composites).webp({ quality: 86 }).toFile(out);
  return out;
}
