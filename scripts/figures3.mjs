// Figuri inline v3 — layout-uri diferite STRUCTURAL, nu doar alta culoare.
//
// Ce era prost la v2 (gen-hero.mjs): practic un singur layout — rand de carduri albe egale,
// cu primul si ultimul TAIATE de marginea cadrului (parea accident, nu design) si o bara
// grea cu titlu lipita jos. Toate figurile ieseau la fel.
//
// v3: 8 layout-uri cu geometrie diferita, ierarhie de marimi in interiorul figurii,
// titlu asezat diferit de la un layout la altul (sau deloc), si zero taieri accidentale.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { haloScore } from './hero3.mjs';

const W = 1600, H = 900;
const FONT = 'DejaVu Sans, Arial, sans-serif';

const hashStr = s => { let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return h >>> 0; };
const mulberry32 = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// paleta: fundal deschis + accent puternic + text inchis (contrast bun pt lizibilitate)
const THEMES = [
  { bg: ['#f3f6f4', '#e2ebe6'], accent: '#1f6f52', ink: '#12281f', soft: '#cfe0d6' },
  { bg: ['#f7f3ee', '#ece0d2'], accent: '#a4632a', ink: '#33220f', soft: '#e6d3bd' },
  { bg: ['#f1f4f9', '#dde5f1'], accent: '#2b5aa8', ink: '#13233d', soft: '#cdd9ec' },
  { bg: ['#f7f2f6', '#ebdcea'], accent: '#8c3d78', ink: '#301127', soft: '#e2cbdd' },
  { bg: ['#f5f5f1', '#e6e6dc'], accent: '#5c6b2f', ink: '#232712', soft: '#d8dcc6' },
  { bg: ['#fdf3f1', '#f6ddd7'], accent: '#b04434', ink: '#3a1611', soft: '#f0cdc4' },
  { bg: ['#f0f6f7', '#daeaed', ], accent: '#1c7481', ink: '#0f2b30', soft: '#c6e1e5' },
  { bg: ['#f6f4fa', '#e5dff2'], accent: '#5b45a8', ink: '#211741', soft: '#d7cdee' },
];

// ---------- produse ----------
async function trimmed(src) {
  let s = sharp(readFileSync(src));
  try { s = sharp(await s.trim({ threshold: 12 }).toBuffer()); } catch { }
  return s;
}

/** produs pe card alb care il strange (pad mic) — pentru produse albe/textile */
async function asCard(src, boxW, boxH, r = 22) {
  const pad = Math.round(Math.min(boxW, boxH) * 0.07);
  const inner = await (await trimmed(src)).resize(boxW - pad * 2, boxH - pad * 2, { fit: 'inside', background: '#fff' }).png().toBuffer();
  const m = await sharp(inner).metadata();
  const cw = m.width + pad * 2, ch = m.height + pad * 2;
  const svg = `<svg width="${cw}" height="${ch}" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#101820" flood-opacity="0.20"/></filter></defs>
    <rect width="${cw}" height="${ch}" rx="${r}" fill="#fff" filter="url(#s)"/></svg>`;
  const buf = await sharp(Buffer.from(svg)).png().composite([{ input: inner, top: pad, left: pad }]).toBuffer();
  return { buf, w: cw, h: ch };
}

/** produs decupat, fara card — pentru produse inchise/saturate */
async function asCutout(src, boxW, boxH) {
  const { cutout } = await import('./hero3.mjs');
  const c = await cutout(src, boxW, boxH);
  return { buf: c.buf, w: c.w, h: c.h };
}

/** alege singur card vs cutout, pe acelasi scor calibrat ca la hero */
async function prep(src, boxW, boxH, forced) {
  const mode = forced || ((await haloScore(src).catch(() => 9)) > 3.0 ? 'card' : 'cutout');
  return mode === 'card' ? asCard(src, boxW, boxH) : asCutout(src, boxW, boxH);
}

// ---------- text ----------
function label(text, sub, x, y, t, size = 34, anchor = 'middle') {
  const parts = [`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-weight="700" fill="${t.ink}">${esc(text)}</text>`];
  if (sub) parts.push(`<text x="${x}" y="${y + size * 1.05}" text-anchor="${anchor}" font-family="${FONT}" font-size="${Math.round(size * 0.78)}" font-weight="600" fill="${t.accent}">${esc(sub)}</text>`);
  return parts.join('');
}

function bgSvg(t, rng, variant) {
  const parts = [];
  // forme mari ancorate de margini, taiate INTENTIONAT de cadru (nu carduri taiate din greseala)
  const n = 2 + Math.floor(rng() * 2);
  for (let i = 0; i < n; i++) {
    const cx = rng() > 0.5 ? -0.08 : 1.08, cy = 0.1 + rng() * 0.8;
    const r = Math.round((0.22 + rng() * 0.24) * W);
    parts.push(rng() > 0.5
      ? `<circle cx="${cx * W}" cy="${cy * H}" r="${r}" fill="${t.soft}" opacity="0.75"/>`
      : `<circle cx="${cx * W}" cy="${cy * H}" r="${r}" fill="none" stroke="${t.soft}" stroke-width="${Math.round(24 + rng() * 34)}" opacity="0.8"/>`);
  }
  if (variant === 'diagonal') {
    parts.push(`<polygon points="0,${H} ${W * 0.62},0 ${W},0 ${W},${H}" fill="${t.soft}" opacity="0.55"/>`);
  }
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>${parts.join('')}</svg>`;
}

// titlu: pozitie/forma diferita per layout (nu mereu bara grea jos)
function titleSvg(title, t, style) {
  if (!title) return '';
  const s = esc(title);
  if (style === 'corner') return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <text x="64" y="92" font-family="${FONT}" font-size="46" font-weight="800" fill="${t.ink}">${s}</text>
    <rect x="64" y="112" width="150" height="7" rx="3.5" fill="${t.accent}"/></svg>`;
  if (style === 'pill') { const w = Math.round(s.length * 21) + 76; return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${Math.round((W - w) / 2)}" y="46" width="${w}" height="72" rx="36" fill="${t.accent}"/>
    <text x="${W / 2}" y="95" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="700" fill="#fff">${s}</text></svg>`; }
  if (style === 'side') return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="${H / 2 - 120}" width="10" height="240" fill="${t.accent}"/>
    <text x="44" y="${H / 2 - 60}" font-family="${FONT}" font-size="44" font-weight="800" fill="${t.ink}">${s}</text></svg>`;
  return ''; // 'none'
}

// ---------- LAYOUT-URI ----------
// fiecare primeste (items pregatite, tema, rng) si intoarce compozitele
const LAYOUTS = {
  // 1 mare stanga + lista mica dreapta
  async heroList(items, t, rng) {
    const c = [], txt = [];
    const main = await prep(items[0].img, 720, 620);
    c.push({ input: main.buf, top: Math.round(H * 0.50 - main.h / 2), left: Math.round(W * 0.28 - main.w / 2) });
    txt.push(label(items[0].label, items[0].sub, Math.round(W * 0.28), Math.round(H * 0.50 + main.h / 2 + 52), t, 36));
    const rest = items.slice(1, 4);
    for (let i = 0; i < rest.length; i++) {
      const p = await prep(rest[i].img, 250, 250);
      const cy = Math.round(H * (0.24 + i * 0.26));
      c.push({ input: p.buf, top: Math.round(cy - p.h / 2), left: Math.round(W * 0.62 - p.w / 2) });
      txt.push(label(rest[i].label, rest[i].sub, Math.round(W * 0.72), cy - 4, t, 30, 'start'));
    }
    return { c, txt, title: 'corner' };
  },

  // podium: centrul mai mare si mai sus
  async podium(items, t, rng) {
    const c = [], txt = [];
    const order = [1, 0, 2];
    const boxes = [340, 470, 340], ys = [0.56, 0.46, 0.56];
    for (let slot = 0; slot < 3 && slot < items.length; slot++) {
      const it = items[order[slot]] || items[slot];
      if (!it) continue;
      const p = await prep(it.img, boxes[slot], boxes[slot]);
      const cx = Math.round(W * (0.20 + slot * 0.30)), cy = Math.round(H * ys[slot]);
      c.push({ input: p.buf, top: Math.round(cy - p.h / 2), left: Math.round(cx - p.w / 2) });
      txt.push(label(it.label, it.sub, cx, Math.round(cy + p.h / 2 + 46), t, slot === 1 ? 34 : 29));
    }
    return { c, txt, title: 'pill' };
  },

  // mozaic asimetric: 1 mare stanga, 2 stivuite dreapta
  async mosaic(items, t, rng) {
    const c = [], txt = [];
    const big = await prep(items[0].img, 620, 560);
    c.push({ input: big.buf, top: Math.round(H * 0.52 - big.h / 2), left: Math.round(W * 0.26 - big.w / 2) });
    txt.push(label(items[0].label, items[0].sub, Math.round(W * 0.26), Math.round(H * 0.52 + big.h / 2 + 48), t, 34));
    for (let i = 0; i < 2 && items[i + 1]; i++) {
      const p = await prep(items[i + 1].img, 300, 260);
      const cx = Math.round(W * 0.71), cy = Math.round(H * (0.26 + i * 0.44));
      c.push({ input: p.buf, top: Math.round(cy - p.h / 2), left: Math.round(cx - p.w / 2) });
      txt.push(label(items[i + 1].label, items[i + 1].sub, cx, Math.round(cy + p.h / 2 + 42), t, 28));
    }
    return { c, txt, title: 'corner' };
  },

  // produs stanga + blocuri tipografice de spec dreapta
  async spec(items, t, rng) {
    const c = [], txt = [];
    const p = await prep(items[0].img, 620, 620);
    c.push({ input: p.buf, top: Math.round(H * 0.52 - p.h / 2), left: Math.round(W * 0.27 - p.w / 2) });
    txt.push(label(items[0].label, null, Math.round(W * 0.27), Math.round(H * 0.52 + p.h / 2 + 50), t, 34));
    const specs = items.slice(0, 3).map(x => x.sub).filter(Boolean);
    specs.forEach((s, i) => {
      const y = Math.round(H * (0.30 + i * 0.20));
      txt.push(`<rect x="${Math.round(W * 0.56)}" y="${y - 38}" width="8" height="56" rx="4" fill="${t.accent}"/>`);
      txt.push(`<text x="${Math.round(W * 0.60)}" y="${y + 8}" font-family="${FONT}" font-size="42" font-weight="800" fill="${t.ink}">${esc(s)}</text>`);
    });
    return { c, txt, title: 'corner' };
  },

  // doua produse, fundal taiat diagonal
  async split(items, t, rng) {
    const c = [], txt = [];
    for (let i = 0; i < 2 && items[i]; i++) {
      const p = await prep(items[i].img, 520, 520);
      const cx = Math.round(W * (i ? 0.72 : 0.28)), cy = Math.round(H * (i ? 0.46 : 0.52));
      c.push({ input: p.buf, top: Math.round(cy - p.h / 2), left: Math.round(cx - p.w / 2) });
      txt.push(label(items[i].label, items[i].sub, cx, Math.round(cy + p.h / 2 + 52), t, 34));
    }
    return { c, txt, title: 'pill', variant: 'diagonal' };
  },

  // carduri suprapuse, usor rotite, ca un pachet rasfirat
  async fan(items, t, rng) {
    const c = [], txt = [];
    const n = Math.min(4, items.length);
    for (let i = 0; i < n; i++) {
      const p = await asCard(items[i].img, 470, 540);
      const rot = -8 + i * (16 / Math.max(1, n - 1));
      const rotated = await sharp(p.buf).rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
      const m = await sharp(rotated).metadata();
      const cx = Math.round(W * (0.20 + i * (0.60 / Math.max(1, n - 1))));
      const cy = Math.round(H * (0.46 + (i % 2 ? 0.04 : 0)));
      c.push({ input: rotated, top: Math.round(cy - m.height / 2), left: Math.round(cx - m.width / 2) });
    }
    txt.push(`<text x="${W / 2}" y="${H - 62}" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="${t.ink}">${esc(items.map(x => x.label).slice(0, n).join('  ·  '))}</text>`);
    return { c, txt, title: 'corner' };
  },

  // decupaje care plutesc, marimi variate, fara carduri
  async float(items, t, rng) {
    const c = [], txt = [];
    const spots = [{ x: 0.26, y: 0.50, s: 470 }, { x: 0.57, y: 0.60, s: 380 }, { x: 0.81, y: 0.44, s: 320 }];
    for (let i = 0; i < 3 && items[i]; i++) {
      const sp = spots[i];
      const p = await prep(items[i].img, sp.s, sp.s);
      const cx = Math.round(W * sp.x), cy = Math.round(H * sp.y);
      c.push({ input: Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="b${i}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="26"/></filter></defs><ellipse cx="${cx}" cy="${cy + p.h * 0.5}" rx="${Math.round(p.w * 0.42)}" ry="${Math.round(p.w * 0.09)}" fill="#101820" opacity="0.20" filter="url(#b${i})"/></svg>`), top: 0, left: 0 });
      c.push({ input: p.buf, top: Math.round(cy - p.h / 2), left: Math.round(cx - p.w / 2) });
      txt.push(label(items[i].label, items[i].sub, cx, Math.round(cy + p.h / 2 + 44), t, 28));
    }
    return { c, txt, title: 'corner' };
  },

  // banda cu numere mari in spate
  async numbered(items, t, rng) {
    const c = [], txt = [];
    const n = Math.min(3, items.length);
    for (let i = 0; i < n; i++) {
      const cx = Math.round(W * (0.20 + i * 0.30));
      txt.push(`<text x="${cx}" y="${Math.round(H * 0.34)}" text-anchor="middle" font-family="${FONT}" font-size="260" font-weight="800" fill="${t.accent}" opacity="0.22">${i + 1}</text>`);
      const p = await prep(items[i].img, 360, 380);
      c.push({ input: p.buf, top: Math.round(H * 0.52 - p.h / 2), left: Math.round(cx - p.w / 2) });
      txt.push(label(items[i].label, items[i].sub, cx, Math.round(H * 0.52 + p.h / 2 + 44), t, 30));
    }
    return { c, txt, title: 'corner' };
  },
};

const NAMES = Object.keys(LAYOUTS);

/**
 * @param items [{img, label, sub}]  — OBIECTE, nu string-uri (bug clasic v2)
 * @param layout numele unui layout, sau omis = ales determinist din seed
 * @param avoid  layout-uri de evitat (ca doua figuri din acelasi articol sa nu iasa la fel)
 */
export async function buildFigure3({ items = [], out, seed = 'x', title = '', layout, avoid = [] }) {
  if (!items.length) throw new Error('buildFigure3: fara items');
  if (typeof items[0] === 'string') throw new Error('buildFigure3: items trebuie sa fie OBIECTE {img,label,sub}');

  const rng = mulberry32(hashStr(seed));
  const t = THEMES[hashStr(seed + '::t') % THEMES.length];
  const pool = NAMES.filter(n => !avoid.includes(n));
  const name = layout && LAYOUTS[layout] ? layout : pool[hashStr(seed + '::l') % pool.length];

  const { c, txt, title: titleStyle, variant } = await LAYOUTS[name](items, t, rng);

  const bg = Buffer.from(bgSvg(t, rng, variant));
  const overlay = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${txt.join('')}</svg>`);
  const ts = titleSvg(title, t, titleStyle);

  await sharp(bg)
    .composite([...c, { input: overlay, top: 0, left: 0 }, ...(ts ? [{ input: Buffer.from(ts), top: 0, left: 0 }] : [])])
    .webp({ quality: 84, effort: 5 })
    .toFile(out);

  return { out, layout: name };
}

export const FIGURE_LAYOUTS = NAMES;
