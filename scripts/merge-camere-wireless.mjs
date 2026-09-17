// Merge NON-DISTRUCTIV pentru grupul `camera-wireless`.
// Grupare pe ALIMENTARE, nu pe rezolutie: asta decide unde poti monta camera, iar
// "wireless" din denumire induce in eroare — majoritatea au nevoie de cablu de curent.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'camera-wireless';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. de interior
  'D4RHGS3BM', // TP-Link Tapo C232        4315r 231 lei 5MP
  'D8V2DYYBM', // TP-Link Tapo interior    4219r 170 lei 4MP
  'D0CD9GMBM', // BabyToy 8MP               827r 285 lei
  'DZLB90MBM', // BabyToy 5MP Full HD       611r 275 lei
  // B. de exterior, alimentate la retea
  'DKQ4NMMBM', // TP-Link exterior          4219r 115 lei 2MP — cel mai ieftin
  'D5T097YBM', // TP-Link Tapo C325 ColorPro 1890r 260 lei 4MP
  'D1B0JX2BM', // Outdoor PoE               1890r 800 lei 5MP — premium
  'DX8BBXYBM', // Sricam 9MP WIFI           1217r 230 lei 9MP
  'DGJT3TYBM', // CCTV dubla wireless        613r 289 lei 8MP
  // C. fara curent la locatie: panou solar si/sau cartela SIM
  'DGGL9QYBM', // TP-Link Tapo C501GW 4G LTE 1890r 280 lei — cartela SIM
  'DCKKVMYBM', // CLAUSTEEL solar + SIM       211r 478 lei
  'D40DSHYBM', // Xenomo X-SAFE panou solar   285r 529 lei nota 4.89
  // D. versatile, interior si exterior
  'D774BQYBM', // Sricam Full HD             1217r 130 lei — cel mai ieftin din articol
  'DS8DGTYBM', // BabyToy 12MP                346r 397 lei
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

list.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${String(r.reviews).padStart(5)}r ${String(r.rating).padEnd(5)} ${String(r.price).padStart(8)} lei | ${r.name.replace(/\s+/g, ' ').slice(0, 44)}`));

if (!NO_IMG) {
  let ok = 0;
  for (const r of list) {
    if (!r.rawImg) continue;
    const res = await downloadProductImage(r.rawImg, IMG + '/' + r.slug + '.webp', { force: true });
    if (res.ok) ok++; else console.log('   IMG FAIL', r.slug, res.reason);
  }
  console.log('imagini:', ok + '/' + list.length);
}

const db = JSON.parse(readFileSync(OUT, 'utf8'));
const existed = !!db[GROUP];
db[GROUP] = list;
writeFileSync(OUT, JSON.stringify(db, null, 1));
console.log(`grup ${GROUP} ${existed ? 'ACTUALIZAT' : 'ADAUGAT'} | total grupuri: ${Object.keys(db).length}`);
