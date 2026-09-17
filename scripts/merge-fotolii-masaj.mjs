// Merge NON-DISTRUCTIV pentru grupul `fotolii-masaj`.
// Nisa pe eMAG RO e un singur vanzator (Topscaune) cu ~19 modele cu nume romane. Grupare pe
// TIP REAL de masaj, nu pe pret: sub ~2300 lei sunt fotolii recliner cu vibratii + incalzire
// (4 zone), iar masajul "adevarat" cu role pe senila (SL/L-track, 3D/4D) incepe la ~5400 lei.
// reviewCount e la nivel de familie (43 la toate cele scumpe) — folosit ca semnal de linie, nu de model.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'fotolii-masaj';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

// Dedup manual: pastrat un singur ID per model (variantele de culoare au ID diferit, acelasi pret).
const PICK = [
  // A. Fotolii de relaxare cu masaj prin vibratii + incalzire (nu au role pe senila)
  'D0J6FY2BM', // Relaxare cu incalzire, masaj 8 puncte     1849 lei  4 zone
  'D0VB8W3BM', // Relaxare cu incalzire, spatar rabatabil   2039 lei  4 zone
  'D9V6FY2BM', // Electric cu ridicare si rabatare (lift)   2299 lei  4 zone — pt seniori/mobilitate
  // B. Fotolii de masaj full-body, intrare (senila, zero gravity, role reale)
  'DS3TJ53BM', // QUITUS   9 zone, zero gravity, LCD          5399 lei — intrare full-body
  'DG68TJ2BM', // GAIUS ULTRA PRO  16 prog, AI voice, ZG      5999 lei
  'DC68TJ2BM', // MECHA CONFORT  SL-Track, role 4D, airbag360 6599 lei — 4D la cel mai mic pret
  'D03TJ53BM', // IULIUS   9 zone, gmax 150                    6999 lei
  'DWGSXK2BM', // IGNIUS   SL-Track, AI Voice, airbag full body 7199 lei
  // C. Fotolii de masaj 3D/4D premium (scanare corporala, L-track)
  'DHN3FW3BM', // SEVERNIUS  3D, scanare corporala, gmax 150  8279 lei
  'DFN3FW3BM', // MAXIMUS    4D, SL-Track, airbag full body   10789 lei
  'DSN3FW3BM', // LUXOR L183 PRO  L-track, pulpe, gmax 135    11519 lei
  'DGYDNK2BM', // VIGOS      4D, scanare corporala (varf)     14279 lei
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

list.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${String(r.reviews).padStart(4)}r ${String(r.rating).padEnd(5)} ${String(r.price).padStart(9)} lei | ${r.name.replace(/\s+/g, ' ').slice(0, 46)}`));

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
