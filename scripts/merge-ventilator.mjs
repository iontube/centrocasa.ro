// Merge NON-DISTRUCTIV pentru grupul `ventilator`.
// ⚠️ GRUPARE PE SPECS REALE, nu pe campul `Tip ventilator` de la eMAG: clasificatorul lor pune
// mini-ventilatoare de birou de 5 W si 10 cm in categoria "Cu picior". Am grupat dupa PUTERE si
// DIAMETRU, care sunt obiective: de podea = 15-60 W si 35-40 cm; turn = coloana verticala;
// de birou = sub 10 W si sub 15 cm.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'ventilator';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. de podea, cu picior — 15-60 W, elice 35-40 cm
  'DCFKRMBBM', // Star-Light FTBB-60W    938r  275 lei  60 W  40 cm
  'DCFRVDBBM', // Zass ZF 1605            66r  130 lei  45 W  40.6 cm
  'D9NZ43MBM', // Xiaomi Mi Smart 1C      77r  360 lei  38 W  smart
  'DWX1G0MBM', // Heinner HMSF-9BK        67r  349 lei  19 W  9 trepte
  'D0FLP0MBM', // Xiaomi BHR4828GL        59r 1210 lei  15 W  acumulator
  // B. de turn / coloana
  'D8X1G0MBM', // Heinner HMTF-D3BK       84r  300 lei  45 W
  'DZ83KWMBM', // Trisa Comfort Breeze    57r  500 lei  28 W  8 trepte
  'D52VS9BBM', // Rowenta Eole Compact    56r  529 lei  30 W
  // C. de birou si portabile — sub 10 W
  'D3JWCLYBM', // Freezy Air 15 cm       271r  200 lei   6 W
  'DDX9QWMBM', // Ideas4Comfort camera   205r  150 lei   8 W  14 cm
  'DL2W5N2BM', // Ideas4Comfort birou    205r  170 lei 5.5 W  10 cm
  'D249XJYBM', // Ventilator 4 in 1       93r   49 lei  cel mai ieftin
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

list.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${String(r.reviews).padStart(4)}r ${String(r.rating).padEnd(5)} ${String(r.price).padStart(8)} lei | ${r.name.replace(/\s+/g, ' ').slice(0, 46)}`));

if (!NO_IMG) {
  let ok = 0;
  for (const r of list) {
    if (!r.rawImg) continue;
    const res = await downloadProductImage(r.rawImg, IMG + '/' + r.slug + '.webp', { force: true });
    if (res.ok) { ok++; console.log(`   img ${r.slug.slice(0, 32)} : ${res.src || '-'} -> ${res.w}x${res.h}`); }
    else console.log('   IMG FAIL', r.slug, res.reason);
  }
  console.log('imagini:', ok + '/' + list.length);
}

const db = JSON.parse(readFileSync(OUT, 'utf8'));
const existed = !!db[GROUP];
db[GROUP] = list;
writeFileSync(OUT, JSON.stringify(db, null, 1));
console.log(`grup ${GROUP} ${existed ? 'ACTUALIZAT' : 'ADAUGAT'} | total grupuri: ${Object.keys(db).length}`);
