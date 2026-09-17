// gen-hero.mjs (centrocasa) — generator imagine HERO + figuri (casa & gradina).
// Collage din 2-4 imagini de produs eMAG + bandă semi-transparentă cu titlu peste
// (banda NU acoperă integral produsele din spate — rămân vizibile).
//
// Uz: import { buildHero } from './gen-hero.mjs'
//   await buildHero({ title, tag, products:[img1,img2,img3], out:'public/assets/hero/<slug>.webp' })
// products = căi locale SAU URL-uri; imaginile eMAG sunt shot-uri pe alb -> le punem pe carduri albe rotunjite.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const W = 2400, H = 1350;                // 2× HD (16:9); downscale-uiește clar, mult peste pragul Discover
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function loadBuf(src) {
  if (/^https?:\/\//.test(src)) {
    const r = await fetch(src, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error('fetch ' + src + ' -> ' + r.status);
    return Buffer.from(await r.arrayBuffer());
  }
  return readFileSync(src);
}

// împarte titlul pe rânduri (max ~26 caractere/rând, max 3 rânduri)
function wrap(title, max = 26, maxLines = 3) {
  const words = title.split(/\s+/); const lines = []; let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; }
    else cur += ' ' + w;
    if (lines.length === maxLines - 1 && (cur + ' ').length > max) break;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines.slice(0, maxLines);
}

// teme de culoare (variază per articol ca hero-urile să nu semene)
const THEMES = {
  forest:    { d1: '#14331f', d2: '#1d4a2c', accent: '#e8913a', bg1: '#e9f4ec', bg2: '#c7e3cf' },
  olive:     { d1: '#2f3212', d2: '#464a1e', accent: '#d98324', bg1: '#f3f4e3', bg2: '#dfe2bd' },
  terracotta:{ d1: '#5a2417', d2: '#7a3320', accent: '#2f9e8f', bg1: '#fbeee7', bg2: '#f3d2c1' },
  walnut:    { d1: '#3a2416', d2: '#54351f', accent: '#4a9d5b', bg1: '#f6efe7', bg2: '#e6d3bf' },
  sage:      { d1: '#2a3a30', d2: '#3c5245', accent: '#c8863c', bg1: '#eef3ef', bg2: '#d2e0d6' },
  moss:      { d1: '#1c2e14', d2: '#2c451f', accent: '#e0a63a', bg1: '#eef4e6', bg2: '#cfe0bd' },
  clay:      { d1: '#4d1f16', d2: '#6d2e1f', accent: '#3a9fb0', bg1: '#fbeee9', bg2: '#f2cfc3' },
  sand:      { d1: '#4a3a16', d2: '#665221', accent: '#2f8f6b', bg1: '#faf3e2', bg2: '#eaddb8' },
  stone:     { d1: '#2b3230', d2: '#3f4a47', accent: '#d98b3f', bg1: '#eef1f0', bg2: '#d3dbd7' },
  teal:      { d1: '#0c3b38', d2: '#12514c', accent: '#f5a623', bg1: '#e7f5f3', bg2: '#c3e5df' },
  autumn:    { d1: '#4a2810', d2: '#6b3b16', accent: '#3a9d8f', bg1: '#fbf0e4', bg2: '#f2d6b8' },
  lavender:  { d1: '#332147', d2: '#4a3163', accent: '#e0983a', bg1: '#f2edf8', bg2: '#dccbee' },
  pine:      { d1: '#10302e', d2: '#18453f', accent: '#e88b4a', bg1: '#e8f3f1', bg2: '#c4ded9' },
  rust:      { d1: '#4e2413', d2: '#6f351b', accent: '#4a9db0', bg1: '#fbeee6', bg2: '#f1d0bd' },
  honey:     { d1: '#453213', d2: '#63481d', accent: '#3a9f7a', bg1: '#fbf4e0', bg2: '#ecdcb2' },
  slate:     { d1: '#1b2430', d2: '#2b3a4d', accent: '#e0913a', bg1: '#eef1f6', bg2: '#d3dbe6' },
  plum:      { d1: '#2e1440', d2: '#45215e', accent: '#e8a63a', bg1: '#f3ecfa', bg2: '#dcc9ee' },
  spruce:    { d1: '#132a2a', d2: '#1d403f', accent: '#e89a3a', bg1: '#e9f3f2', bg2: '#c8dedd' },
  copper:    { d1: '#43261a', d2: '#5f3624', accent: '#3a9db5', bg1: '#f9efe9', bg2: '#eed3c3' },
  fern:      { d1: '#1f3a1a', d2: '#2e5427', accent: '#d99a2e', bg1: '#edf5e8', bg2: '#cee2c0' },
};
export const THEME_NAMES = Object.keys(THEMES);
export const VARIANT_NAMES = ['band', 'topband', 'panel', 'showcase', 'diagonal', 'spotlight', 'twotone'];

// card alb cu produsul (imaginile eMAG sunt pe fundal alb)
async function makeCard(src, cw, ch) {
  const buf = await loadBuf(src);
  const pad = Math.round(cw * 0.10);
  const prod = await sharp(buf).resize(cw - pad * 2, ch - pad * 2, { fit: 'contain', background: '#fff' }).png().toBuffer();
  const card = Buffer.from(
    `<svg width="${cw}" height="${ch}"><rect width="${cw}" height="${ch}" rx="${Math.round(cw * 0.085)}" fill="#fff" filter="url(#s)"/>
     <defs><filter id="s" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#1b3a6b" flood-opacity="0.22"/></filter></defs></svg>`);
  return sharp(card).png().composite([{ input: prod, top: pad, left: pad }]).toBuffer();
}

// variant: 'band' (bandă jos), 'panel' (panou colorat lateral), 'showcase' (carduri zig-zag + chip titlu)
export async function buildHero({ title, tag = 'OFERTA eMAG', products = [], out, variant = 'band', theme = 'blue' }) {
  const t = THEMES[theme] || THEMES.blue;
  const n = Math.min(4, Math.max(1, products.length));
  const picks = products.slice(0, n);
  const bg = Buffer.from(
    `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/></svg>`);
  let img = sharp(bg).png();
  const composites = [];
  const wm = (x, y, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#fff" fill-opacity="0.85">centrocasa.ro</text>`;
  const badge = (x, y, f = 44) => { const w = Math.round(tag.length * f * 0.66) + 60; return { w, svg: `<rect x="${x}" y="${y}" width="${w}" height="${Math.round(f * 1.7)}" rx="14" fill="${t.accent}"/><text x="${x + w / 2}" y="${y + f * 1.15}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${f}" font-weight="700" fill="#fff">${esc(tag)}</text>` }; };

  if (variant === 'panel') {
    const PW = 1010;
    const cardH = n >= 3 ? 820 : 920, cardW = Math.round(cardH * 0.66);
    const gap = -Math.round(cardW * 0.16);
    const totalW = n * cardW + (n - 1) * gap;
    let x = PW + Math.round(((W - PW) - totalW) / 2);
    const y = Math.round((H - cardH) / 2);
    for (const p of picks) { try { composites.push({ input: await makeCard(p, cardW, cardH), top: y, left: x }); x += cardW + gap; } catch { } }
    const lines = wrap(title, 16, 4);
    const lh = 116, startY = Math.round((H - lines.length * lh) / 2) + 80;
    const b = badge(80, 100);
    const panel = `<svg width="${W}" height="${H}"><defs><linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.d1}"/><stop offset="1" stop-color="${t.d2}"/></linearGradient></defs>
      <rect x="0" y="0" width="${PW}" height="${H}" fill="url(#p)"/><rect x="${PW}" y="0" width="16" height="${H}" fill="${t.accent}"/>
      ${b.svg}
      ${lines.map((ln, i) => `<text x="80" y="${startY + i * lh}" font-family="Arial, sans-serif" font-size="92" font-weight="800" fill="#fff">${esc(ln)}</text>`).join('')}
      ${wm(80, H - 66, 'start')}</svg>`;
    composites.push({ input: Buffer.from(panel), top: 0, left: 0 });
  } else if (variant === 'showcase') {
    const cardH = n >= 3 ? 800 : 900, cardW = Math.round(cardH * 0.66);
    const gap = -Math.round(cardW * 0.14);
    const totalW = n * cardW + (n - 1) * gap;
    let x = Math.round((W - totalW) / 2);
    const midY = Math.round((H - cardH) / 2) + 40;
    for (let i = 0; i < n; i++) { const dy = (i % 2 === 0 ? -70 : 70); try { composites.push({ input: await makeCard(picks[i], cardW, cardH), top: midY + dy, left: x }); } catch { } x += cardW + gap; }
    const lines = wrap(title, 24, 3);
    const boxW = Math.min(W - 112, 1560), boxH = 200 + lines.length * 112;
    const b = badge(112, 108, 40);
    const overlay = `<svg width="${W}" height="${H}">
      <rect x="56" y="56" width="${boxW}" height="${boxH}" rx="30" fill="${t.d1}" fill-opacity="0.74"/>
      ${b.svg}
      ${lines.map((ln, i) => `<text x="112" y="${290 + i * 112}" font-family="Arial, sans-serif" font-size="92" font-weight="800" fill="#fff">${esc(ln)}</text>`).join('')}
      ${wm(W - 80, H - 56, 'end')}</svg>`;
    composites.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  } else if (variant === 'topband') {
    // banda titlu SUS + carduri jos
    const cardH = n >= 3 ? 800 : 880, cardW = Math.round(cardH * 0.66);
    const gap = -Math.round(cardW * 0.12);
    const totalW = n * cardW + (n - 1) * gap;
    const lines = wrap(title, 30, 2);
    const bandH = 120 + lines.length * 118 + 84;
    let x = Math.round((W - totalW) / 2);
    const y = bandH + Math.round((H - bandH - cardH) / 2);
    for (const p of picks) { try { composites.push({ input: await makeCard(p, cardW, cardH), top: y, left: x }); x += cardW + gap; } catch { } }
    const b = badge(112, 58, 40);
    const overlay = `<svg width="${W}" height="${H}">
      <rect x="0" y="0" width="${W}" height="${bandH}" fill="${t.d1}"/>
      <rect x="0" y="${bandH - 12}" width="${W}" height="12" fill="${t.accent}"/>
      ${b.svg}
      ${lines.map((ln, i) => `<text x="112" y="${232 + i * 118}" font-family="Arial, sans-serif" font-size="94" font-weight="800" fill="#fff">${esc(ln)}</text>`).join('')}
      ${wm(W - 80, H - 46, 'end')}</svg>`;
    composites.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  } else if (variant === 'spotlight') {
    // un telefon MARE pe dreapta + doua mai mici in spate, titlu mare pe stanga
    const bigH = 1060, bigW = Math.round(bigH * 0.66);
    const smH = 640, smW = Math.round(smH * 0.66);
    const bigX = W - bigW - 210, bigY = Math.round((H - bigH) / 2);
    let sx = bigX - smW + 30, sy = bigY + 150;
    for (const p of picks.slice(1, 3)) { try { composites.push({ input: await makeCard(p, smW, smH), top: sy, left: sx }); sx -= smW - 40; sy += 30; } catch { } }
    try { composites.push({ input: await makeCard(picks[0], bigW, bigH), top: bigY, left: bigX }); } catch { }
    const lines = wrap(title, 14, 4);
    const lh = 108, startY = Math.round((H - lines.length * lh) / 2) + 30;
    const b = badge(100, startY - 178, 40);
    const overlay = `<svg width="${W}" height="${H}">
      ${b.svg}
      ${lines.map((ln, i) => `<text x="100" y="${startY + i * lh}" font-family="Arial, sans-serif" font-size="90" font-weight="800" fill="${t.d1}">${esc(ln)}</text>`).join('')}
      ${wm(W - 80, H - 46, 'end')}</svg>`;
    composites.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  } else if (variant === 'diagonal') {
    // carduri usor rotite (efect de evantai) + titlu jos in caseta
    const cardH = 780, cardW = Math.round(cardH * 0.66);
    const gap = -Math.round(cardW * 0.30);
    const totalW = n * cardW + (n - 1) * gap;
    let x = Math.round((W - totalW) / 2);
    const midY = Math.round((H - cardH) / 2) - 40;
    const angs = [-9, -4, 4, 9, -6, 2];
    for (let i = 0; i < n; i++) {
      try {
        const card = await makeCard(picks[i], cardW, cardH);
        const rot = await sharp(card).rotate(angs[i % angs.length], { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
        composites.push({ input: rot, top: midY - 24, left: x - 24 });
        x += cardW + gap;
      } catch { }
    }
    const lines = wrap(title, 24, 2);
    const boxH = 120 + lines.length * 116 + 84, boxY = H - boxH;
    const b = badge(112, boxY + 40, 40);
    const overlay = `<svg width="${W}" height="${H}">
      <rect x="0" y="${boxY}" width="${W}" height="${boxH}" fill="${t.d1}" fill-opacity="0.82"/>
      <rect x="0" y="${boxY}" width="${W}" height="12" fill="${t.accent}"/>
      ${b.svg}
      ${lines.map((ln, i) => `<text x="112" y="${boxY + 214 + i * 116}" font-family="Arial, sans-serif" font-size="92" font-weight="800" fill="#fff">${esc(ln)}</text>`).join('')}
      ${wm(W - 80, H - 46, 'end')}</svg>`;
    composites.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  } else if (variant === 'twotone') {
    // fundal split diagonal: stanga inchis (titlu), dreapta deschis (telefoane)
    const cardH = n >= 3 ? 720 : 820, cardW = Math.round(cardH * 0.66);
    const gap = -Math.round(cardW * 0.16);
    const totalW = n * cardW + (n - 1) * gap;
    let x = Math.round(W * 0.46) + Math.round((W * 0.54 - totalW) / 2);
    const y = Math.round((H - cardH) / 2);
    for (const p of picks) { try { composites.push({ input: await makeCard(p, cardW, cardH), top: y, left: x }); x += cardW + gap; } catch { } }
    const lines = wrap(title, 13, 4);
    const lh = 108, startY = Math.round((H - lines.length * lh) / 2) + 60;
    const b = badge(90, startY - 150, 40);
    const overlay = `<svg width="${W}" height="${H}"><defs><linearGradient id="tt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.d1}"/><stop offset="1" stop-color="${t.d2}"/></linearGradient></defs>
      <polygon points="0,0 ${Math.round(W * 0.42)},0 ${Math.round(W * 0.32)},${H} 0,${H}" fill="url(#tt)"/>
      <polygon points="${Math.round(W * 0.42)},0 ${Math.round(W * 0.45)},0 ${Math.round(W * 0.35)},${H} ${Math.round(W * 0.32)},${H}" fill="${t.accent}"/>
      ${b.svg}
      ${lines.map((ln, i) => `<text x="90" y="${startY + i * lh}" font-family="Arial, sans-serif" font-size="86" font-weight="800" fill="#fff">${esc(ln)}</text>`).join('')}
      ${wm(W - 80, H - 46, 'end')}</svg>`;
    composites.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  } else {
    // 'band' — carduri în rând + bandă semi-transparentă jos
    const cardH = n >= 3 ? 840 : 940, cardW = Math.round(cardH * 0.66);
    const gap = -Math.round(cardW * 0.12);
    const totalW = n * cardW + (n - 1) * gap;
    let x = Math.round((W - totalW) / 2);
    const y = Math.round((H - cardH) / 2) - 48;
    for (const p of picks) { try { composites.push({ input: await makeCard(p, cardW, cardH), top: y, left: x }); x += cardW + gap; } catch { } }
    const lines = wrap(title, 26, 3);
    const bandH = 80 + lines.length * 132 + 68, bandY = H - bandH;
    const b = badge(80, 52, 44);
    const overlay = `<svg width="${W}" height="${H}">
      <rect x="0" y="${bandY}" width="${W}" height="${bandH}" fill="${t.d1}" fill-opacity="0.62"/>
      <rect x="0" y="${bandY}" width="${W}" height="12" fill="${t.accent}"/>
      ${b.svg}
      ${lines.map((ln, i) => `<text x="112" y="${bandY + 156 + i * 132}" font-family="Arial, sans-serif" font-size="108" font-weight="800" fill="#fff">${esc(ln)}</text>`).join('')}
      ${wm(W - 80, H - 44, 'end')}</svg>`;
    composites.push({ input: Buffer.from(overlay), top: 0, left: 0 });
  }

  const buf = await img.composite(composites).webp({ quality: 92 }).toBuffer();
  if (out) { const { writeFileSync } = await import('node:fs'); writeFileSync(out, buf); }
  return buf;
}

// Figură inline pt corpul articolului. 16:9, 1600x900. items = [{img, label, sub?}]
// template: 'cards' | 'numbered' | 'stripe' | 'split' | 'chips' — layout-uri diferite ca sa nu semene.
// theme + captionPos + template variază per articol/figură.
export const FIGURE_TEMPLATES = ['cards', 'numbered', 'stripe', 'split', 'chips', 'gallery', 'spotlight'];
export async function buildFigure({ items = [], caption = '', out, theme = 'blue', captionPos = 'bottom', template = 'cards' }) {
  const W = 1600, H = 900;
  const t = THEMES[theme] || THEMES.blue;
  const n = Math.min(4, Math.max(1, items.length));
  const picks = items.slice(0, n);
  const composites = [];
  const fitLabel = (s, boxW, max = 34, min = 18, k = 0.6) => Math.max(min, Math.min(max, Math.floor(boxW / (((s || ' ').length) * k))));
  // taie marginile albe/transparente ale imaginii eMAG (500px cu padding intern) -> produsul umple cardul
  async function prod(src, w, h) {
    const buf = await loadBuf(src);
    let base;
    try { base = sharp(await sharp(buf).trim({ threshold: 12 }).toBuffer()); } catch { base = sharp(buf); }
    return base.resize(w, h, { fit: 'contain', background: '#fff' }).png().toBuffer();
  }
  // produsele eMAG au fundal ALB si sunt deseori albe (saltele/aer conditionat) -> mereu pe CARD ALB ca sa se vada
  async function card(src, cw, ch, rx = 28) {
    const pad = Math.round(cw * 0.05);
    const p = await prod(src, cw - pad * 2, ch - pad * 2);
    const svg = `<svg width="${cw}" height="${ch}"><rect width="${cw}" height="${ch}" rx="${rx}" fill="#fff" filter="url(#sc)"/><defs><filter id="sc" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#0f2747" flood-opacity="0.18"/></filter></defs></svg>`;
    return sharp(Buffer.from(svg)).png().composite([{ input: p, top: pad, left: pad }]).toBuffer();
  }

  // ---- fundal per template ----
  let bgSvg;
  if (template === 'stripe' || template === 'split') {
    bgSvg = `<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#ffffff"/></svg>`;
  } else {
    bgSvg = `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`;
  }
  const img = sharp(Buffer.from(bgSvg)).png();

  if (template === 'stripe') {
    // coloane de culoare pe toata inaltimea, in fiecare un card alb cu produsul + eticheta jos pe culoare
    const cw = Math.floor(W / n);
    const cardW = cw - 120, cardH = Math.round(cardW * 0.72);
    const cardY = Math.round((H - 130 - cardH) / 2) + 20;
    for (let i = 0; i < n; i++) {
      const it = picks[i], x0 = i * cw;
      const tint = i % 2 === 0 ? t.d1 : t.d2;
      const panel = `<svg width="${cw}" height="${H}"><rect width="${cw}" height="${H}" fill="${tint}"/>${i > 0 ? `<rect x="0" y="0" width="4" height="${H}" fill="${t.accent}"/>` : ''}
        <text x="${cw / 2}" y="${H - 88}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fitLabel(it.label, cw - 60, 40)}" font-weight="800" fill="#fff">${esc(it.label || '')}</text>
        ${it.sub ? `<text x="${cw / 2}" y="${H - 44}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fitLabel(it.sub, cw - 60, 30, 16, 0.55)}" font-weight="700" fill="${t.accent}">${esc(it.sub)}</text>` : ''}</svg>`;
      composites.push({ input: Buffer.from(panel), top: 0, left: x0 });
      try { composites.push({ input: await card(it.img, cardW, cardH), top: cardY, left: x0 + 60 }); } catch { }
    }
  } else if (template === 'split') {
    // stanga: panou inchis cu titlul mare; dreapta: pana la 2 produse pe carduri
    const PW = 620;
    const lines = wrap(caption || '', 13, 5);
    const lh = 74, startY = Math.round((H - lines.length * lh) / 2) + 20;
    const panel = `<svg width="${W}" height="${H}"><defs><linearGradient id="sp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.d1}"/><stop offset="1" stop-color="${t.d2}"/></linearGradient></defs>
      <rect x="0" y="0" width="${PW}" height="${H}" fill="url(#sp)"/><rect x="${PW - 10}" y="0" width="10" height="${H}" fill="${t.accent}"/>
      <rect x="72" y="${startY - 88}" width="120" height="12" rx="6" fill="${t.accent}"/>
      ${lines.map((ln, i) => `<text x="72" y="${startY + i * lh}" font-family="Arial, sans-serif" font-size="54" font-weight="800" fill="#fff">${esc(ln)}</text>`).join('')}
      <text x="72" y="${H - 56}" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#fff" fill-opacity="0.7">centrocasa.ro</text></svg>`;
    composites.push({ input: Buffer.from(panel), top: 0, left: 0 });
    const rW = W - PW, m = Math.min(n, 2), gap2 = 44;
    const cardW2 = Math.min(430, Math.floor((rW - 120 - (m - 1) * gap2) / m)), cardH2 = Math.round(cardW2 * 1.15);
    const totalW = m * cardW2 + (m - 1) * gap2;
    let x = PW + Math.round((rW - totalW) / 2), yv = Math.round((H - cardH2) / 2) - 24;
    for (let i = 0; i < m; i++) {
      const it = picks[i];
      try {
        composites.push({ input: await card(it.img, cardW2, cardH2), top: yv, left: x });
        const lab = `<svg width="${cardW2}" height="120"><text x="${cardW2 / 2}" y="46" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fitLabel(it.label, cardW2, 32)}" font-weight="800" fill="${t.d1}">${esc(it.label || '')}</text>${it.sub ? `<text x="${cardW2 / 2}" y="88" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fitLabel(it.sub, cardW2, 26, 15, 0.55)}" font-weight="600" fill="${t.d2}">${esc(it.sub)}</text>` : ''}</svg>`;
        composites.push({ input: Buffer.from(lab), top: yv + cardH2 + 16, left: x });
      } catch { }
      x += cardW2 + gap2;
    }
  } else if (template === 'chips') {
    // carduri albe pe rand (fara bara mare de titlu) + eticheta bold + "chip" rotunjit sub fiecare
    const capH = caption ? 96 : 0;
    const slotW = Math.round((W - 160) / n);
    const cardW = slotW - 30, cardH = Math.round(cardW * 0.9);
    const cardY = capH + 40;
    let x = 80;
    for (let i = 0; i < n; i++) {
      const it = picks[i];
      try { composites.push({ input: await card(it.img, cardW, cardH), top: cardY, left: x + 15 }); } catch { }
      const cy = cardY + cardH + 30, chipW = Math.min(slotW - 30, ((it.sub || '').length) * 15 + 60);
      const lab = `<svg width="${slotW}" height="170">
        <text x="${slotW / 2}" y="44" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fitLabel(it.label, slotW - 20, 34)}" font-weight="800" fill="${t.d1}">${esc(it.label || '')}</text>
        ${it.sub ? `<rect x="${(slotW - chipW) / 2}" y="70" width="${chipW}" height="54" rx="27" fill="${t.accent}"/><text x="${slotW / 2}" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fitLabel(it.sub, chipW - 28, 26, 15, 0.5)}" font-weight="700" fill="#fff">${esc(it.sub)}</text>` : ''}</svg>`;
      composites.push({ input: Buffer.from(lab), top: cy, left: x });
      x += slotW;
    }
    if (caption) composites.push({ input: Buffer.from(`<svg width="${W}" height="${capH}"><text x="80" y="62" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="${t.d1}">${esc(caption)}</text><rect x="82" y="80" width="160" height="8" rx="4" fill="${t.accent}"/></svg>`), top: 20, left: 0 });
  } else if (template === 'gallery') {
    // plci mari tip catalog: produs dominant pe alb + footer colorat cu eticheta (colturi jos rotunjite)
    const capH = caption ? 92 : 0;
    const gap = 32;
    const cardW = Math.floor((W - 120 - (n - 1) * gap) / n);
    const cardH = H - capH - 64;
    const cardY = capH + 30;
    let x = Math.round((W - (n * cardW + (n - 1) * gap)) / 2);
    const footerH = Math.min(172, Math.round(cardH * 0.27)), r = 30;
    for (let i = 0; i < n; i++) {
      const it = picks[i];
      const base = `<svg width="${cardW}" height="${cardH}"><rect width="${cardW}" height="${cardH}" rx="${r}" fill="#fff" filter="url(#gf)"/><defs><filter id="gf" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#0f2747" flood-opacity="0.18"/></filter></defs></svg>`;
      composites.push({ input: Buffer.from(base), top: cardY, left: x });
      try {
        const pw = cardW - 52, ph = (cardH - footerH) - 40, p = await prod(it.img, pw, ph);
        composites.push({ input: p, top: cardY + 24, left: x + Math.round((cardW - pw) / 2) });
      } catch { }
      const foot = `<svg width="${cardW}" height="${footerH}"><path d="M0 0 H${cardW} V${footerH - r} Q${cardW} ${footerH} ${cardW - r} ${footerH} H${r} Q0 ${footerH} 0 ${footerH - r} Z" fill="${t.d1}"/>
        <rect x="${(cardW - 74) / 2}" y="24" width="74" height="6" rx="3" fill="${t.accent}"/>
        <text x="${cardW / 2}" y="${footerH - 62}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fitLabel(it.label, cardW - 48, 32, 17, 0.62)}" font-weight="800" fill="#fff">${esc(it.label || '')}</text>
        ${it.sub ? `<text x="${cardW / 2}" y="${footerH - 24}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fitLabel(it.sub, cardW - 48, 25, 14, 0.56)}" font-weight="700" fill="${t.accent}">${esc(it.sub)}</text>` : ''}</svg>`;
      composites.push({ input: Buffer.from(foot), top: cardY + cardH - footerH, left: x });
      x += cardW + gap;
    }
    if (caption) composites.push({ input: Buffer.from(`<svg width="${W}" height="${capH}"><text x="66" y="62" font-family="Arial, sans-serif" font-size="46" font-weight="800" fill="${t.d1}">${esc(caption)}</text><rect x="68" y="80" width="170" height="8" rx="4" fill="${t.accent}"/></svg>`), top: 18, left: 0 });
  } else if (template === 'spotlight') {
    // produs(e) mari centrate, cu glow accent in spate; titlu sus, eticheta sub card
    const capH = caption ? 108 : 0;
    const glow = `<svg width="${W}" height="${H}"><defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="62"/></filter></defs><ellipse cx="${W / 2}" cy="${capH + (H - capH) / 2 - 6}" rx="540" ry="360" fill="${t.accent}" fill-opacity="0.2" filter="url(#gl)"/></svg>`;
    composites.push({ input: Buffer.from(glow), top: 0, left: 0 });
    const cardH = 560, cardW = n === 1 ? 720 : Math.round(cardH * 0.88), gap = 58;
    const totalW = n * cardW + (n - 1) * gap;
    let x = Math.round((W - totalW) / 2);
    const cy = capH + Math.round((H - capH - cardH) / 2) - 26;
    for (let i = 0; i < n; i++) {
      const it = picks[i];
      try {
        composites.push({ input: await card(it.img, cardW, cardH, 42), top: cy, left: x });
        const lab = `<svg width="${cardW}" height="122"><text x="${cardW / 2}" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fitLabel(it.label, cardW, 40)}" font-weight="800" fill="${t.d1}">${esc(it.label || '')}</text>${it.sub ? `<text x="${cardW / 2}" y="98" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fitLabel(it.sub, cardW, 30, 16, 0.55)}" font-weight="600" fill="${t.d2}">${esc(it.sub)}</text>` : ''}</svg>`;
        composites.push({ input: Buffer.from(lab), top: cy + cardH + 14, left: x });
      } catch { }
      x += cardW + gap;
    }
    if (caption) composites.push({ input: Buffer.from(`<svg width="${W}" height="${capH}"><text x="${W / 2}" y="66" text-anchor="middle" font-family="Arial, sans-serif" font-size="50" font-weight="800" fill="${t.d1}">${esc(caption)}</text><rect x="${W / 2 - 95}" y="86" width="190" height="8" rx="4" fill="${t.accent}"/></svg>`), top: 22, left: 0 });
  } else {
    // 'cards' (default) sau 'numbered' — carduri albe in rand + bara-titlu
    const numbered = template === 'numbered';
    const capH = caption ? 96 : 0;
    const top = captionPos === 'top';
    const areaTop = top ? capH : 0, areaH = H - capH;
    const cardH = 620, cardW = Math.round(cardH * 0.72), gap = 46;
    const totalW = n * cardW + (n - 1) * gap;
    let x = Math.round((W - totalW) / 2);
    const y = areaTop + Math.round((areaH - cardH) / 2) - 18;
    const prodW = cardW - 44, prodH = cardH - 118, prodLeft = Math.round((cardW - prodW) / 2);
    for (let i = 0; i < n; i++) {
      const it = picks[i];
      try {
        const p = await prod(it.img, prodW, prodH);
        const lf = fitLabel(it.label, cardW - 28, 36), sf = fitLabel(it.sub, cardW - 28, 28, 18, 0.56);
        const card = `<svg width="${cardW}" height="${cardH}"><rect width="${cardW}" height="${cardH}" rx="36" fill="#fff" filter="url(#s)"/>
          <defs><filter id="s" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#0f2747" flood-opacity="0.2"/></filter></defs>
          ${numbered ? `<circle cx="56" cy="56" r="42" fill="${t.accent}"/><text x="56" y="73" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="800" fill="#fff">${i + 1}</text>` : ''}
          <rect x="${(cardW - 90) / 2}" y="${cardH - 96}" width="90" height="7" rx="3.5" fill="${t.accent}"/>
          <text x="${cardW / 2}" y="${cardH - 54}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${lf}" font-weight="800" fill="#101828">${esc(it.label || '')}</text>
          ${it.sub ? `<text x="${cardW / 2}" y="${cardH - 20}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${sf}" font-weight="600" fill="${t.d2}">${esc(it.sub)}</text>` : ''}</svg>`;
        const ci = await sharp(Buffer.from(card)).png().composite([{ input: p, top: 30, left: prodLeft }]).toBuffer();
        composites.push({ input: ci, top: y, left: x });
      } catch { }
      x += cardW + gap;
    }
    if (caption) {
      const capY = top ? 0 : H - capH, lineY = top ? capH - 6 : H - capH;
      composites.push({ input: Buffer.from(`<svg width="${W}" height="${H}"><rect x="0" y="${capY}" width="${W}" height="${capH}" fill="${t.d1}"/><rect x="0" y="${lineY}" width="${W}" height="6" fill="${t.accent}"/><text x="${W / 2}" y="${capY + capH / 2 + 16}" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="#fff">${esc(caption)}</text></svg>`), top: 0, left: 0 });
    }
  }

  const buf = await img.composite(composites).webp({ quality: 90 }).toBuffer();
  if (out) { const { writeFileSync } = await import('node:fs'); writeFileSync(out, buf); }
  return buf;
}

// self-test: node scripts/gen-hero.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  // telefon simulat: corp rotunjit + ecran, ca să văd contrastul pe card alb
  const mk = (c, i) => Buffer.from(
    `<svg width="620" height="1000"><rect x="150" y="60" width="320" height="880" rx="70" fill="${c}"/>
     <rect x="180" y="120" width="260" height="760" rx="24" fill="#0b1220"/>
     <circle cx="310" cy="150" r="8" fill="#333"/></svg>`);
  const tmp = [];
  const cols = ['#0a0a0a', '#3a3f45', '#0055b8'];
  for (let i = 0; i < cols.length; i++) { const png = await sharp(mk(cols[i], i), { density: 288 }).png().toBuffer(); const f = `/tmp/prod_${i}.png`; (await import('node:fs')).writeFileSync(f, png); tmp.push(f); }
  await buildHero({ title: 'Cele mai bune telefoane sub 1500 lei pe eMAG', tag: 'TOP OFERTE', products: tmp, out: '/tmp/hero_test.webp' });
  const meta = await sharp('/tmp/hero_test.webp').metadata();
  console.log('hero test OK →', meta.width + 'x' + meta.height, 'webp, /tmp/hero_test.webp');
}
