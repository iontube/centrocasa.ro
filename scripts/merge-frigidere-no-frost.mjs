// Merge NON-DISTRUCTIV pentru grupul `frigidere-no-frost`.
// Tag-ul contine 37 frigidere No Frost. EXCLUS pentru igiena cluster + anti-canibalizare:
// mini-bar (Heinner 66l -> art. minibar), incorporabil (Beko BSSA300 -> art. incorporabile),
// side-by-side 4 usi (CREATE -> frigidere-sbs). Din combine (2 usi) + cu o usa aleg 12 pe 3 grupe:
// combine familie 348-406l / combine mari 461-585l / cu o usa fara congelator 362-365l.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'frigidere-no-frost';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. combine No Frost, familie (348-406 l)
  'D2S36DMBM', // Beko RDNT401E30ZXBN 375l   29r 3570 — NeoFrost Dual, cel mai vandut din grupa
  'D2PQQ3YBM', // Samsung RT35CG5644S9EO 348l 19r 3570 — latime 60 cm, Digital Inverter
  'DK5GQ3MBM', // Beko RDNE455K30ZXBN 406l    17r 3628 — ProSmart Inverter, autonomie 15h
  'DYPQQ3YBM', // Samsung RT38CG6624S9EO 393l  9r 3300 — cel mai ieftin din grupa, WiFi
  // B. combine No Frost, mari (461-585 l)
  'DV5641MBM', // Beko B5RDNE504LXBR 477l     35r 3229 — cel mai notat 4.91 + cel mai ieftin mare
  'DQX1CVYBM', // LG GTBV44SEBKD 461l         18r 2900 — Linear Inverter, 35 dB cel mai silentios
  'DDPR4BYBM', // Samsung RT47CG6726B1EO 462l 21r 5300 — dozator de apa
  'DCS45FYBM', // LG GTF744BLPED 509l          6r 3800 — Total No Frost, dozator, DoorCooling
  'DBCZBHYBM', // Samsung RT58K710RSL 585l    19r 4500 — cel mai mare, Twin Cooling, familii mari
  // C. frigidere No Frost cu o usa, fara congelator (362-365 l)
  'D0DBCDYBM', // Beko B1RMLNE444XB 365l       9r 2800 — larder, 143 kWh, AeroFlow
  'DC70HHYBM', // Tesla RS3600FM 362l          3r 1867 — cel mai ieftin din articol, 118 kWh
  'DVGD183BM', // Heinner HF-M362NFE++ 362l    2r 2175 — accesibil, control electronic, 118 kWh
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
