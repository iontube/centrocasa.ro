// Merge NON-DISTRUCTIV pentru grupul `tocatoare`.
// Toctoare de legume DEDICATE (bol compact cu lama S), NU blendere. Tag-ul `tocator-electric` a
// colectat amestecat (blendere din filtrul "tocare") - filtrez DOAR cele 6 tocatoare reale.
// Grupare pe capacitate: compacte 0.8-1.2L / cu bol mare 1.5-2L.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'tocatoare';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. compacte (0.8-1.2 l)
  'EPRTNBBBM', // Bosch MMR08R2 400W 0.8L        690r 170 lei — cel mai vandut
  'DQSZ22MBM', // Heinner HMC-K500WHR 500W 1L    170r 110 lei — 2 viteze
  'D388V4YBM', // Latkon Multifunctional 400W 1.2L 133r 200 lei — 2 viteze, bine notat
  // B. cu bol mare (1.5-2 l)
  'DZSZ22MBM', // Heinner HMC-K500BKR 500W 1.5L sticla  325r 126 lei — bol sticla
  'DPZKRTMBM', // Tocator Electric 500W 1.5L     319r 150 lei
  'DD94TVMBM', // Sokany SK-7002A 700W 2L 4 lame 80r 65 lei — cel mai ieftin, bol mare
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
