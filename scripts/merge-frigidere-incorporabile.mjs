// Merge NON-DISTRUCTIV pentru grupul `frigidere-incorporabile`.
// NISA SUBTIRE (15 in tag, majoritatea 1-3 pareri) -> scurt-onest, selectie pe SPECS+dimensiuni,
// marcat onest ca recenziile sunt putine (user aprobat 2026-07-22). 10 pe 3 grupe dupa INALTIMEA
// nisei (constrangerea reala la incorporabile): sub blat <90cm / coloana medie 121-145cm / coloana 177cm.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'frigidere-incorporabile';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. sub blat, pana in 90 cm (45-136 l)
  'DHKKPF3BM', // Adler AD 8096 45l         1r 750  — cel mai mic, minibar sub blat, 80 kWh
  'DCDJ6ZYBM', // Electrolux LFB3AE82R 110l 1r 3036 — control electronic, clasa climatica larga
  'DPTHX4YBM', // Bomann KSE7810W 118l      1r 1442 — mini cu congelator 14l, accesibil
  'D1574ZMBM', // Bosch KIR21VFE0 136l      1r 2800 — cel mai mult volum sub blat, 92 kWh
  // B. medii, in coloana (121-145 cm, 175-220 l)
  'DRSK5KYBM', // Beko BSSA300M4SN 175l     7r 1500 — cel mai accesibil, No Frost, cele mai multe pareri
  'DR574ZMBM', // Bosch KIR41VFE0 204l      2r 2900 — larder Bosch, doar 101 kWh
  'DM2ZC3MBM', // Beko BDSA250K3SN 220l    14r 2541 — combina cu congelator, cel mai verificat incorporabil
  'DX0H3DYBM', // Beko BDSA250K4SN 220l     5r 1299 — aceeasi combina, mai eficienta (clasa E) si mai ieftina
  // C. coloana inalta (177 cm, 310 l)
  'D2S33TYBM', // Bosch KIR81VFE0 310l      1r 4000 — cel mai mare, FreshSense, 114 kWh
  'D7S33TYBM', // Bosch KIR81ADD0 310l      2r 4761 — VitaFresh, clasa D, doar 91 kWh, cel mai econom mare
];

const raw = JSON.parse(readFileSync(RAW, 'utf8')).products || [];
const byId = Object.fromEntries(raw.map(p => [p.id, p]));
const picked = PICK.map(id => byId[id]).filter(Boolean);
if (picked.length !== PICK.length) {
  console.error('!! lipsesc din KV:', PICK.filter(id => !byId[id]));
  process.exit(1);
}

const list = picked.map(p => {
  const s = slug(p.name) + '-' + p.id.toLowerCase();
  return {
    id: p.id, slug: s, name: p.name, brand: p.brand || '',
    price: p.price, currency: p.currency || 'RON',
    rating: p.rating || null, reviews: p.reviewCount || 0,
    image: '/imagini/produse/' + s + '.webp',
    rawImg: (p.images || [])[0] || '',
    deeplink: DL(p.url), specs: p.specs || {}, url: p.url, tag: GROUP,
  };
});

list.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${String(r.reviews).padStart(4)}r ${String(r.rating).padEnd(5)} ${String(r.price).padStart(8)} lei | ${r.name.replace(/\s+/g, ' ').slice(0, 50)}`));

if (!NO_IMG) {
  let ok = 0;
  for (const r of list) {
    if (!r.rawImg) continue;
    const res = await downloadProductImage(r.rawImg, IMG + '/' + r.slug + '.webp', { force: true });
    if (res.ok) ok++; else console.log('   IMG FAIL', r.slug, res.reason);
  }
  console.log('imagini:', ok + '/' + list.length);
}

const db = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
db[GROUP] = list;
writeFileSync(OUT, JSON.stringify(db, null, 0));
console.log('scris grup', GROUP, '->', list.length, 'produse');
