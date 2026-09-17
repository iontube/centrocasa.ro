// Grafic: plafonul UE de putere la aspiratoare casnice si unde se aseaza selectia.
// Dimensionare mobil-first (vezi scripts/lib/chart-base.mjs): etichetele stau DEASUPRA barelor,
// ca sa nu manance latimea si sa forteze font mic pe telefon.
import sharp from 'sharp';
import { W, FONT, SURFACE, INK, INK2, GRID, T, esc, checkLizibilitate } from './lib/chart-base.mjs';

export async function chartPutere(items, out) {
  checkLizibilitate();
  const rows = [...items].sort((a, b) => a.w - b.w);
  const padL = 40, padR = 150, padT = 290, padB = 150;
  const rowH = 104;
  const H = padT + rows.length * rowH + padB;
  const plotW = W - padL - padR, plotH = rows.length * rowH;
  const barH = 38;
  const max = 1700;
  const x = v => (v / max) * plotW;

  const p = [];
  const praguri = [
    { v: 900, c: '#0ca30c', lab: 'plafon UE 2017' },
    { v: 1600, c: '#d03b3b', lab: 'plafon 2014' },
  ];
  // etichetele pragurilor stau pe randuri diferite, sub subtitlu, ancorate ca sa nu iasa din cadru
  praguri.forEach((z, i) => {
    const gx = padL + x(z.v);
    const ly = 176 + i * 52;
    const anchor = gx > W - 200 ? 'end' : 'middle';
    const tx = anchor === 'end' ? W - 40 : gx;
    p.push(`<line x1="${gx}" y1="${ly + 12}" x2="${gx}" y2="${padT + plotH}" stroke="${z.c}" stroke-width="4" stroke-dasharray="10 8"/>`);
    p.push(`<text x="${tx}" y="${ly}" text-anchor="${anchor}" font-family="${FONT}" font-size="${T.axa}" font-weight="700" fill="${z.c}">${esc(z.lab)}: ${z.v} W</text>`);
  });
  for (let v = 0; v <= max; v += 400) {
    const gx = padL + x(v);
    p.push(`<line x1="${gx}" y1="${padT}" x2="${gx}" y2="${padT + plotH}" stroke="${GRID}" stroke-width="1.5" opacity="0.7"/>`);
    p.push(`<text x="${gx}" y="${padT + plotH + 46}" text-anchor="middle" font-family="${FONT}" font-size="${T.axa}" fill="${INK2}">${v}</text>`);
  }

  rows.forEach((r, i) => {
    const top = padT + i * rowH;
    const cy = top + rowH - 32;
    const bw = Math.max(6, x(r.w));
    const col = r.atelier ? '#eda100' : '#2a78d6';
    p.push(`<text x="${padL}" y="${top + 40}" font-family="${FONT}" font-size="${T.eticheta}" font-weight="700" fill="${INK}">${esc(r.nume)}</text>`);
    p.push(`<rect x="${padL}" y="${cy - barH / 2}" width="${bw}" height="${barH}" rx="5" fill="${col}"/>`);
    p.push(`<text x="${padL + bw + 20}" y="${cy + 15}" font-family="${FONT}" font-size="${T.valoare}" font-weight="800" fill="${INK}">${r.w}</text>`);
  });

  const leg = [['#2a78d6', 'casnice, limitate prin lege'], ['#eda100', 'de atelier, exceptate']];
  const lat = lab => 44 + lab.length * (T.legenda * 0.56);
  let lx = 40, ly = H - 96;
  const legend = leg.map(([c, lab]) => {
    if (lx + lat(lab) > W - 40) { lx = 40; ly += 48; }
    const s = `<rect x="${lx}" y="${ly}" width="26" height="26" rx="6" fill="${c}"/>` +
      `<text x="${lx + 38}" y="${ly + 22}" font-family="${FONT}" font-size="${T.legenda}" fill="${INK2}">${esc(lab)}</text>`;
    lx += lat(lab) + 26;
    return s;
  }).join('');

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${SURFACE}"/>
    <text x="40" y="72" font-family="${FONT}" font-size="${T.titlu}" font-weight="800" fill="${INK}">De ce nu conteaza watii</text>
    <text x="40" y="120" font-family="${FONT}" font-size="${T.subtitlu}" fill="${INK2}">puterea motorului, fata de plafoanele impuse de UE</text>
    <text x="${W - 40}" y="${padT - 14}" text-anchor="end" font-family="${FONT}" font-size="${T.subtitlu}" font-weight="700" fill="${INK2}">wati</text>
    ${p.join('')}${legend}
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 90, effort: 6 }).toFile(out);
  return out;
}
