// Merge NON-DISTRUCTIV pentru grupul `friteuze`.
// Grupare pe CAPACITATE/utilizare: compacte 1-2 pers (2.6-4.2L) / familie (4.5-6L) / mari si 2 cuve (6.5L+).
// Dedup variante (Cosori x3, Tefal Mega x3, ZASS x2, IMA x2, Ninja x2, Lehmann x6, AIRNOVA x3).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'friteuze';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. compacte, 1-2 persoane (2.6-4.2 l)
  'DBJ6ZPMBM', // Tefal Ultra Fry Digital 4.2L   731r 475 lei — cel mai vandut
  'D6HF3RBBM', // Star-Light 2.6L                540r 240 lei — cel mai mic/ieftin
  'DX04WPMBM', // Xiaomi Mi Smart 3.5L           479r 634 lei — smart/app
  // B. familie (4.5-6 l)
  'DJ7JRMMBM', // Cosori Air Fryer               570r 549 lei — cel mai notat brand 4.81
  'DLBY1YYBM', // Tefal Easy Fry Max 5L          261r 359 lei
  'D1LC5T2BM', // AIRNOVA NanoFritto 4.8L        204r 200 lei — cel mai ieftin familie 4.83
  'DZ9LT0YBM', // Lehmann Sante 6L               205r 260 lei — 6L accesibil
  // C. mari si cu 2 cuve (6.5 l+)
  'D6Q0RB2BM', // Tefal Easy Fry Mega 7.5L       322r 500 lei — 4.85
  'DFBQ0LMBM', // Tefal EasyFry & Grill XXL 6.5L 314r 586 lei — cu grill
  'DP600QYBM', // Lehmann Aromato 10L            205r 270 lei — cel mai mare, ieftin
  'DMNK1SMBM', // Ninja Foodi DualZone 9.5L      251r 1400 lei — 2 cuve simultan
  'DFVSTJMBM', // Philips Airfryer Essential 6.2L 274r 1623 lei — premium
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
