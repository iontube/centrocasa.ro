// Doua grafice statice pentru articolul de dezumidificatoare.
// Paleta validata cu validate_palette.js (dataviz): #2a78d6/#008300/#e87ba4 — toate PASS.
// Dimensionare mobil-first: vezi scripts/lib/chart-base.mjs.
import sharp from 'sharp';
import { W, FONT, SURFACE, INK, INK2, GRID, T, esc, checkLizibilitate } from './lib/chart-base.mjs';

const CAT = { mic: '#2a78d6', mediu: '#008300', mare: '#e87ba4' };

export async function chartValoare(items, out) {
  checkLizibilitate();
  const rows = [...items].sort((a, b) => a.lei / a.litri - b.lei / b.litri);
  // Numele produsului sta DEASUPRA barei, nu la stanga: pe mobil, o coloana de etichete
  // laterale mananca jumatate din latime si forteaza font mic. Asa bara are toata latimea
  // si numele poate fi scris mare.
  const padL = 40, padR = 150, padT = 210, padB = 130;
  const rowH = 108;
  const H = padT + rows.length * rowH + padB + 46;
  const plotW = W - padL - padR, plotH = rows.length * rowH;
  const barH = 40;
  const max = Math.max(...rows.map(r => r.lei / r.litri));
  const x = v => (v / (max * 1.14)) * plotW;

  const p = [];
  for (let v = 0; v <= max * 1.14; v += 20) {
    const gx = padL + x(v);
    p.push(`<line x1="${gx}" y1="${padT}" x2="${gx}" y2="${padT + plotH}" stroke="${GRID}" stroke-width="1.5" opacity="0.7"/>`);
    p.push(`<text x="${gx}" y="${padT + plotH + 44}" text-anchor="middle" font-family="${FONT}" font-size="${T.axa}" fill="${INK2}">${v}</text>`);
  }
  rows.forEach((r, i) => {
    const v = r.lei / r.litri;
    const top = padT + i * rowH;
    const cy = top + rowH - 34;
    const bw = Math.max(6, x(v));
    p.push(`<text x="${padL}" y="${top + 40}" font-family="${FONT}" font-size="${T.eticheta}" font-weight="700" fill="${INK}">${esc(r.nume)}</text>`);
    p.push(`<rect x="${padL}" y="${cy - barH / 2}" width="${bw}" height="${barH}" rx="5" fill="${CAT[r.grup]}"/>`);
    p.push(`<text x="${padL + bw + 20}" y="${cy + 15}" font-family="${FONT}" font-size="${T.valoare}" font-weight="800" fill="${INK}">${v.toFixed(0)}</text>`);
  });

  // legenda pe doua randuri daca nu incape: la font mare, trei etichete nu intra pe o linie
  const leg = [['mic', 'o camera'], ['mediu', 'apartament'], ['mare', 'casa sau beci']];
  const latEticheta = lab => 44 + lab.length * (T.legenda * 0.56);
  let lx = 40, ly = H - 58;
  const legend = leg.map(([k, lab]) => {
    if (lx + latEticheta(lab) > W - 40) { lx = 40; ly += 46; }
    const s = `<rect x="${lx}" y="${ly}" width="26" height="26" rx="6" fill="${CAT[k]}"/>` +
      `<text x="${lx + 38}" y="${ly + 22}" font-family="${FONT}" font-size="${T.legenda}" fill="${INK2}">${lab}</text>`;
    lx += latEticheta(lab) + 26;
    return s;
  }).join('');

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${SURFACE}"/>
    <text x="40" y="72" font-family="${FONT}" font-size="${T.titlu}" font-weight="800" fill="${INK}">Cat platesti pentru un litru</text>
    <text x="40" y="118" font-family="${FONT}" font-size="${T.subtitlu}" fill="${INK2}">pretul impartit la capacitatea zilnica</text>
    <text x="${W - 40}" y="${padT - 30}" text-anchor="end" font-family="${FONT}" font-size="${T.subtitlu}" font-weight="700" fill="${INK2}">lei / litru</text>
    ${p.join('')}${legend}
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 90, effort: 6 }).toFile(out);
  return out;
}

export async function chartTemperatura(out) {
  checkLizibilitate();
  const H = 860;
  const padL = 130, padR = 60, padT = 210, padB = 130;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const x = t => padL + (t / 30) * plotW;
  const y = e => padT + plotH - (e / 100) * plotH;

  const pts = [[0, 8], [5, 22], [8, 38], [10, 52], [12, 68], [15, 85], [18, 94], [22, 99], [26, 100], [30, 100]];
  const line = pts.map(([t, e], i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)},${y(e).toFixed(1)}`).join(' ');
  const zones = [
    { a: 0, b: 10, c: '#d03b3b', lab: 'sub 10°C', sub: 'dezgheata' },
    { a: 10, b: 15, c: '#fab219', lab: '10-15°C', sub: 'doar mari' },
    { a: 15, b: 30, c: '#0ca30c', lab: 'peste 15°C', sub: 'normal' },
  ];

  const p = [];
  zones.forEach(z => {
    p.push(`<rect x="${x(z.a)}" y="${padT}" width="${x(z.b) - x(z.a)}" height="${plotH}" fill="${z.c}" opacity="0.11"/>`);
    p.push(`<line x1="${x(z.b)}" y1="${padT}" x2="${x(z.b)}" y2="${padT + plotH}" stroke="${z.c}" stroke-width="3" opacity="0.55" stroke-dasharray="9 7"/>`);
    const cx = (x(z.a) + x(z.b)) / 2;
    p.push(`<text x="${cx}" y="${padT - 52}" text-anchor="middle" font-family="${FONT}" font-size="${T.eticheta}" font-weight="800" fill="${INK}">${z.lab}</text>`);
    p.push(`<text x="${cx}" y="${padT - 18}" text-anchor="middle" font-family="${FONT}" font-size="${T.axa}" fill="${INK2}">${esc(z.sub)}</text>`);
  });
  for (let e = 0; e <= 100; e += 50) {
    p.push(`<line x1="${padL}" y1="${y(e)}" x2="${padL + plotW}" y2="${y(e)}" stroke="${GRID}" stroke-width="1.5"/>`);
    p.push(`<text x="${padL - 18}" y="${y(e) + 11}" text-anchor="end" font-family="${FONT}" font-size="${T.axa}" fill="${INK2}">${e}%</text>`);
  }
  for (let t = 0; t <= 30; t += 10) {
    p.push(`<text x="${x(t)}" y="${padT + plotH + 48}" text-anchor="middle" font-family="${FONT}" font-size="${T.axa}" fill="${INK2}">${t}°C</text>`);
  }
  p.push(`<path d="${line}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`);
  p.push(`<circle cx="${x(10)}" cy="${y(52)}" r="13" fill="${INK}" stroke="${SURFACE}" stroke-width="4"/>`);

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${SURFACE}"/>
    <text x="40" y="70" font-family="${FONT}" font-size="${T.titlu}" font-weight="800" fill="${INK}">De ce nu merge in beci iarna</text>
    <text x="40" y="116" font-family="${FONT}" font-size="${T.subtitlu}" fill="${INK2}">eficienta unui aparat cu compresor, dupa temperatura</text>
    ${p.join('')}
    <text x="40" y="${H - 36}" font-family="${FONT}" font-size="${T.nota}" fill="${INK2}">Sub 10°C serpentina ingheata si aparatul intra in dezghetare.</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 90, effort: 6 }).toFile(out);
  return out;
}
