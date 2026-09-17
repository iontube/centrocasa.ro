// Hero v3 — mai profesional decat v2. Ce se schimba:
//  1. PRODUSE MARI: trim() pe sursa la AMBELE variante (bug v2: buildHeroCards nu facea trim,
//     deci pastra marginea alba de la eMAG si produsul iesea mic in card). Produsul umple ~80% din inaltime.
//  2. COMPOZITIE CU ADANCIME: la 2 produse, unul principal in fata + unul secundar mai mic in spate,
//     suprapuse. Nu doua dreptunghiuri simetrice.
//  3. FUNDAL CONSTRUIT, nu clipart random: gradient + spotlight radial in spatele produsului +
//     arce mari ancorate de marginile cadrului (taiate intentionat) + granulatie fina + vigneta.
//  4. UMBRA DE CONTACT reala sub produs (elipsa dubla, blurata), ca sa nu pluteasca.
//  5. DIMENSIUNI: master 1920x1080 (16:9) — peste pragul de 1200px latime cerut de Google Discover,
//     cu marja pentru ecrane retina. Variante responsive generate separat (vezi buildResponsive).
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const W = 1920, H = 1080;

const hashStr = s => { let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return h >>> 0; };
const mulberry32 = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

// Scheme mai saturate decat v2 (v2 iesea spalacit): bg = gradient in 3 opriri, accent = forme, deep = vigneta
const SCHEMES = [
  { bg: ['#ffe8d6', '#f9c9a3', '#f0a97b'], sh: ['#e87a4d', '#d15f35', '#fbd9bd'], deep: '#7a3418' },
  { bg: ['#d9f2e6', '#a8ddc6', '#7cc7a8'], sh: ['#2f9d78', '#1a7a5c', '#c4ecd9'], deep: '#0d4a37' },
  { bg: ['#e6e3f7', '#c5c0ec', '#a49cdf'], sh: ['#7264d4', '#5343bb', '#d8d3f2'], deep: '#2f2278' },
  { bg: ['#fff0cf', '#f8dc95', '#f0c65f'], sh: ['#e0ab2e', '#c08f18', '#faeab6'], deep: '#7d5a0c' },
  { bg: ['#d7eefb', '#a6d7f0', '#7bbfe2'], sh: ['#2f8fc9', '#1a6da3', '#c3e6f6'], deep: '#0d4364' },
  { bg: ['#ffe0e9', '#f7b7c8', '#ee8da8'], sh: ['#e05f83', '#c43f66', '#f9ccd9'], deep: '#8c2444' },
  { bg: ['#e2f2d4', '#c1e2a6', '#9fcf78'], sh: ['#6fb046', '#52912c', '#d5edc2'], deep: '#2f5c14' },
  { bg: ['#ece7e0', '#d3c9bb', '#b8ab97'], sh: ['#8b7a62', '#6b5a44', '#e0d7c9'], deep: '#3f3323' },
  { bg: ['#d5f2f4', '#a2e0e4', '#75cbd1'], sh: ['#2fa3ac', '#1a7f87', '#bfebee'], deep: '#0c5359' },
  { bg: ['#fae0cd', '#efba97', '#e29a6d'], sh: ['#cf7f4d', '#b0602e', '#f5d3ba'], deep: '#733a12' },
  { bg: ['#e4eaf8', '#bcc8e9', '#94a6d8'], sh: ['#5673c4', '#3a54a5', '#d1dbf1'], deep: '#1f3272' },
  { bg: ['#f6e2f2', '#e4bcdd', '#d296c7'], sh: ['#b95ea9', '#993f88', '#efd0e8'], deep: '#661d59' },
];

// ---------- fundal ----------
function backgroundSvg(scheme, rng, focus) {
  const [c0, c1, c2] = scheme.bg;
  const parts = [];
  // arce mari ancorate de margini — compozitie, nu clipart plutitor
  const anchors = [
    { cx: -0.05, cy: 0.12 }, { cx: 1.04, cy: 0.18 },
    { cx: 0.92, cy: 0.95 }, { cx: 0.06, cy: 0.92 },
  ];
  const picks = anchors.sort(() => rng() - 0.5).slice(0, 2 + Math.floor(rng() * 2));
  for (const a of picks) {
    const r = Math.round((0.30 + rng() * 0.26) * W);
    const col = scheme.sh[Math.floor(rng() * scheme.sh.length)];
    const op = (0.16 + rng() * 0.16).toFixed(2);
    if (rng() > 0.45) {
      parts.push(`<circle cx="${Math.round(a.cx * W)}" cy="${Math.round(a.cy * H)}" r="${r}" fill="${col}" opacity="${op}"/>`);
    } else {
      const sw = Math.round(28 + rng() * 46);
      parts.push(`<circle cx="${Math.round(a.cx * W)}" cy="${Math.round(a.cy * H)}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" opacity="${op}"/>`);
    }
  }
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c0}"/><stop offset="0.55" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient>
      <radialGradient id="spot" cx="${focus.x}" cy="${focus.y}" r="0.62">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/>
        <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.16"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.55" stop-color="${scheme.deep}" stop-opacity="0"/>
        <stop offset="1" stop-color="${scheme.deep}" stop-opacity="0.30"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    ${parts.join('')}
    <rect width="${W}" height="${H}" fill="url(#spot)"/>
    <rect width="${W}" height="${H}" fill="url(#vig)"/>
  </svg>`;
}

// granulatie fina: rupe planeitatea gradientului (banding) fara sa se vada ca zgomot
async function grain(opacity = 0.030) {
  const w = 320, h = 180, px = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const v = 120 + Math.floor(Math.random() * 96);
    px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v;
    px[i * 4 + 3] = Math.floor(255 * opacity);
  }
  return sharp(px, { raw: { width: w, height: h, channels: 4 } }).resize(W, H, { kernel: 'nearest' }).png().toBuffer();
}

// ---------- produs ----------
// cutout: scoate fundalul alb prin flood-fill de la margini, pastreaza albul interior al produsului
export async function cutout(src, boxW, boxH) {
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
  // gauri inchise mici (ex bucla manerului) -> transparente; suprafete albe mari (plita) -> pastrate
  const done = new Uint8Array(w * h);
  for (let p0 = 0; p0 < w * h; p0++) {
    if (done[p0] || data[p0 * 4 + 3] === 0 || !isWhite(p0 * 4)) continue;
    const comp = [], st = [p0]; done[p0] = 1; let touches = false;
    while (st.length) {
      const p = st.pop(); comp.push(p); const x = p % w, y = (p / w) | 0;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) { touches = true; continue; }
        const q = ny * w + nx;
        if (data[q * 4 + 3] === 0) { touches = true; continue; }
        if (done[q]) continue; if (isWhite(q * 4)) { done[q] = 1; st.push(q); }
      }
    }
    if (!touches && comp.length < w * h * 0.30) for (const p of comp) data[p * 4 + 3] = 0;
  }

  // HALOU: pozele eMAG au margini anti-aliasate (gri deschis 215-235) pe care flood-fill-ul
  // strict nu le prinde, asa ca ramane un inel alb lipit de produs. Il cojim morfologic:
  // orice pixel aproape-alb care atinge transparentul devine transparent, repetat de cateva ori.
  const nearWhite = i => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    return r > 214 && g > 214 && b > 214 && (Math.max(r, g, b) - Math.min(r, g, b)) < 26;
  };
  for (let pass = 0; pass < 5; pass++) {
    const kill = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        if (data[p * 4 + 3] === 0 || !nearWhite(p * 4)) continue;
        if ((x > 0 && data[(p - 1) * 4 + 3] === 0) || (x < w - 1 && data[(p + 1) * 4 + 3] === 0) ||
            (y > 0 && data[(p - w) * 4 + 3] === 0) || (y < h - 1 && data[(p + w) * 4 + 3] === 0)) kill.push(p);
      }
    }
    if (!kill.length) break;
    for (const p of kill) data[p * 4 + 3] = 0;
  }

  return { buf: await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer(), w, h };
}

// card alb care STRANGE produsul: trim intai, apoi produsul umple cardul (pad mic).
// Asa dispare bug-ul din v2 unde produsul ramanea mic in mijlocul unui card mare.
async function cardOf(src, boxW, boxH) {
  let base = sharp(readFileSync(src));
  try { base = sharp(await base.trim({ threshold: 12 }).toBuffer()); } catch { }
  const pad = Math.round(boxW * 0.06);
  const inner = await base.resize(boxW - pad * 2, boxH - pad * 2, { fit: 'inside', background: '#fff' }).png().toBuffer();
  const m = await sharp(inner).metadata();
  const cw = m.width + pad * 2, ch = m.height + pad * 2, r = Math.round(Math.min(cw, ch) * 0.07);
  const svg = `<svg width="${cw}" height="${ch}" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="30" flood-color="#1a0f26" flood-opacity="0.26"/></filter></defs>
    <rect x="0" y="0" width="${cw}" height="${ch}" rx="${r}" fill="#fff" filter="url(#s)"/></svg>`;
  const buf = await sharp(Buffer.from(svg)).png().composite([{ input: inner, top: pad, left: pad }]).toBuffer();
  return { buf, w: cw, h: ch };
}

// umbra de contact: doua elipse suprapuse (una stransa+inchisa, una lata+difuza) = produsul sta pe ceva
function contactShadow(cx, cy, rw) {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="b1" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="12"/></filter>
      <filter id="b2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="42"/></filter>
    </defs>
    <ellipse cx="${cx}" cy="${cy}" rx="${Math.round(rw * 1.25)}" ry="${Math.round(rw * 0.22)}" fill="#1a0f26" opacity="0.16" filter="url(#b2)"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${Math.round(rw * 0.62)}" ry="${Math.round(rw * 0.10)}" fill="#1a0f26" opacity="0.30" filter="url(#b1)"/>
  </svg>`);
}

// ---------- schema per articol (persistata, spread maxim de culoare) ----------
const MAPF = fileURLToPath(new URL('../src/data/hero-schemes-v3.json', import.meta.url));
function schemeFor(seed) {
  let map = {};
  try { if (existsSync(MAPF)) map = JSON.parse(readFileSync(MAPF, 'utf8')); } catch { }
  if (map[seed] != null) return map[seed] % SCHEMES.length;
  const counts = new Array(SCHEMES.length).fill(0);
  for (const k of Object.keys(map)) counts[map[k] % SCHEMES.length]++;
  let best = 0, min = Infinity;
  for (let i = 0; i < SCHEMES.length; i++) if (counts[i] < min) { min = counts[i]; best = i; }
  map[seed] = best;
  try { writeFileSync(MAPF, JSON.stringify(map, null, 1)); } catch { }
  return best;
}

// Cat de prost iese cutout-ul pe imaginea asta: fractiunea de pixeli aproape-albi ramasi
// opaci langa conturul transparent. Mare = produs alb/crem sau cu umbre "coapte" in poza
// (accesorii pe fundal cu umbra), pe care flood-fill-ul nu le poate scoate -> mai bine card.
export async function haloScore(src) {
  const { buf, w, h } = await cutout(src, 520, 520);
  const { data } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let opaque = 0, bad = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x, i = p * 4;
      if (data[i + 3] === 0) continue;
      opaque++;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r > 206 && g > 206 && b > 206 && (Math.max(r, g, b) - Math.min(r, g, b)) < 30) {
        if (data[(p - 1) * 4 + 3] === 0 || data[(p + 1) * 4 + 3] === 0 ||
            data[(p - w) * 4 + 3] === 0 || data[(p + w) * 4 + 3] === 0) bad++;
      }
    }
  }
  return opaque ? bad / Math.sqrt(opaque) : 0;
}

/**
 * @param products cai catre 1-2 imagini de produs
 * @param mode 'auto' (recomandat) | 'cutout' (produse inchise/saturate) | 'card' (albe/crem/textile)
 *   'auto' masoara riscul de halou pe fiecare produs si cade pe card cand cutout-ul ar iesi murdar.
 *   Asa nu mai depinde de ochiul meu la alegerea produsului.
 */
export async function buildHero3({ products = [], out, seed = 'x', mode = 'auto' }) {
  if (mode === 'auto') {
    const scores = await Promise.all(products.slice(0, 2).map(p => haloScore(p).catch(() => 1)));
    const worst = Math.max(...scores);
    mode = worst > 3.0 ? "card" : "cutout";
    console.error(`  hero3: halo=${worst.toFixed(2)} -> mode=${mode}`);
  }
  return buildHero3Inner({ products, out, seed, mode });
}

async function buildHero3Inner({ products = [], out, seed = 'x', mode = 'cutout' }) {
  if (!products.length) throw new Error('buildHero3: fara produse');
  const rng = mulberry32(hashStr(seed));
  const scheme = SCHEMES[schemeFor(seed)];
  const n = Math.min(((hashStr(seed + '::n') % 2) + 1), products.length);

  const make = mode === 'card' ? cardOf : async (s, bw, bh) => { const c = await cutout(s, bw, bh); return { buf: c.buf, w: c.w, h: c.h }; };
  const layers = [], shadows = [];
  let focus = { x: 0.5, y: 0.48 };

  if (n === 1) {
    // un singur produs: mare, usor sub centru optic
    const box = Math.round(H * 0.82);
    const p = await make(products[0], box, box);
    const cx = Math.round(W * 0.5), cy = Math.round(H * 0.47);
    focus = { x: 0.5, y: 0.46 };
    shadows.push({ input: contactShadow(cx, cy + Math.round(p.h * 0.50), Math.round(p.w * 0.40)), top: 0, left: 0 });
    layers.push({ input: p.buf, top: Math.round(cy - p.h / 2), left: Math.round(cx - p.w / 2) });
  } else {
    // doua produse: SECUNDAR mai mic in spate-stanga, PRINCIPAL mare in fata-dreapta, suprapuse -> adancime
    const boxA = Math.round(H * 0.80), boxB = Math.round(H * 0.62);
    const main = await make(products[0], boxA, boxA);
    const sec = await make(products[1], boxB, boxB);
    const scx = Math.round(W * 0.37), scy = Math.round(H * 0.44);
    const mcx = Math.round(W * 0.62), mcy = Math.round(H * 0.52);
    focus = { x: 0.56, y: 0.48 };
    shadows.push({ input: contactShadow(scx, scy + Math.round(sec.h * 0.50), Math.round(sec.w * 0.36)), top: 0, left: 0 });
    shadows.push({ input: contactShadow(mcx, mcy + Math.round(main.h * 0.50), Math.round(main.w * 0.40)), top: 0, left: 0 });
    layers.push({ input: sec.buf, top: Math.round(scy - sec.h / 2), left: Math.round(scx - sec.w / 2) });
    layers.push({ input: main.buf, top: Math.round(mcy - main.h / 2), left: Math.round(mcx - main.w / 2) });
  }

  const bg = Buffer.from(backgroundSvg(scheme, rng, focus));
  await sharp(bg)
    .composite([{ input: await grain(), top: 0, left: 0, blend: 'overlay' }, ...shadows, ...layers])
    .webp({ quality: 82, effort: 6 })
    .toFile(out);
  return out;
}

/**
 * Variante responsive pentru srcset. Master ramane 1920 (peste pragul Discover de 1200px latime).
 * Telefoanele iau 960 in loc de 1920 -> LCP mult mai bun.
 */
export async function buildResponsive(masterPath, widths = [1920, 1280, 960]) {
  const outs = [];
  for (const w of widths) {
    const dest = masterPath.replace(/\.webp$/, `-${w}.webp`);
    if (w === 1920) { outs.push({ w, path: masterPath }); continue; }
    await sharp(masterPath).resize(w).webp({ quality: 80, effort: 6 }).toFile(dest);
    outs.push({ w, path: dest });
  }
  return outs;
}
