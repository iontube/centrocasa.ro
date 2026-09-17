// Merge NON-DISTRUCTIV pentru grupul `congelatoare`.
// Tag-ul `congelatoare` amesteca 11 masini de cuburi de gheata (Lehmann Frosty, idealSTORE,
// VIVAX, H.Koenig, Caso, STARCREST SIM) - alea NU sunt congelatoare, sunt filtrate pe nume.
// Din 27 congelatoare reale (toate VERTICALE cu sertare, niciun tip lada) pastrez 12 pe 3 grupe:
// compacte sub blat 60-103l / medii statice familie 160-188l / mari & No Frost 194-404l.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'congelatoare';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. compacte, sub blat (60-103 l)
  'DC92J4YBM', // STARCREST SUF-63WH 63L    35r 770 — cel mai ieftin/mic
  'D03BXKMBM', // Candy CCTUS 482WHN 64L     17r 792 — cel mai ingust (48 cm)
  'DCD18SYBM', // Heinner HFF-HM91E++ 91L    36r 928 — Clasa E, 166 kWh (vine si negru/argintiu)
  'DDPB7FYBM', // Heinner HFF-V102E++ 103L   36r 918 — 3 sertare mari
  // B. medii, statice, familie (160-188 l)
  'DKSFFYYBM', // STARCREST SUF-160SI 160L   15r 1350 nota 5 — accesibil
  'DDL81NYBM', // Arctic AC54210M40W 168L    18r 1349 — Fast Freeze XL, 37 dB, autonomie 14h
  'DNPB7FYBM', // Heinner HFF-V188E++ 188L   15r 1398 — 6 sertare, cel mai incapator static
  // C. mari & No Frost (194-404 l)
  'DRCQ17MBM', // Heinner HFF-N194NFF+ 194L  16r 2299 — Full No Frost accesibil
  'DM2VY9BBM', // LDK 2617D NF 238L          23r 2000 — No Frost, convertibil in frigider
  'D070HHYBM', // Tesla RU2700FM 273L        11r 2306 — Total No Frost, convertibil, 8 sertare
  'D3HGH1MBM', // Beko B3RFNE314W 286L       37r 2677 nota 4.92 — ProSmart Inverter
  'DB4WZ7MBM', // Beko RFNE448E41XB 404L     97r 3175 — cel mai mare + cel mai vandut, autonomie 20h
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
