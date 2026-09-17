// Merge NON-DISTRUCTIV pentru grupul `aspirator-fara-sac`.
// Grupare: cele mai vandute / cu dotari / sub 300 lei / umed-uscat pentru atelier.
// ⚠️ Karcher WD sunt aspiratoare umed-uscat de atelier, nu casnice: 1000 W pentru ca sunt
// EXCEPTATE de la plafonul UE de 900 W aplicat aspiratoarelor casnice din 2017.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'aspirator-fara-sac';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. cele mai vandute
  'D0LF2CYBM', // Rowenta Compact Power Cyclonic 2953r  390 lei  750W 1.5l 79dB
  'D9MXFDBBM', // Samsung VCC43Q0V3B             1100r  357 lei  850W 1.3l 80dB
  'D55QXHBBM', // Heinner HVC-V750OR              777r  345 lei  750W 2.2l 75dB
  'D7MB02MBM', // Rowenta Swift Power Cyclonic    762r  400 lei  750W 1.2l 77dB
  // B. cu dotari si capacitate mare
  'D73KYDBBM', // Philips PowerPro Compact        494r  619 lei  900W 1.5l 79dB
  'DHL830BBM', // Philips PowerPro Expert         364r  750 lei  900W 2.0l 76dB
  'D3V6R6MBM', // Rowenta Compact Power XXL       320r  639 lei  550W 2.5l
  'DB419FBBM', // Bosch BGS05A220                 261r  460 lei  700W 1.5l 78dB
  'DK96ZJBBM', // Bosch BGS05A222 (filtru EPA 12) 261r  581 lei  700W 1.5l 78dB
  // C. sub 300 de lei
  'DRCVJDBBM', // Heinner HVC-MC700RD             247r  235 lei  700W 2.0l 76dB
  'D5D1VXMBM', // Daewoo RCC-120B-1               228r  259 lei  800W 1.5l 79dB
  // D. umed-uscat, pentru atelier
  'DKC5CBBBM', // Karcher WD 3                    772r  411 lei 1000W 17l
  'D3NN0LMBM', // Karcher WD 3 V-17               590r  405 lei 1000W 17l
  'D4MJNJMBM', // Karcher WD 2 Plus V-12          361r  387 lei 1000W 12l
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
    if (res.ok) { ok++; } else console.log('   IMG FAIL', r.slug, res.reason);
  }
  console.log('imagini:', ok + '/' + list.length);
}

const db = JSON.parse(readFileSync(OUT, 'utf8'));
const existed = !!db[GROUP];
db[GROUP] = list;
writeFileSync(OUT, JSON.stringify(db, null, 1));
console.log(`grup ${GROUP} ${existed ? 'ACTUALIZAT' : 'ADAUGAT'} | total grupuri: ${Object.keys(db).length}`);
