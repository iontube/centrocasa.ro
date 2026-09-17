// Merge NON-DISTRUCTIV pentru grupul `prajitoare`.
// Grupare pe NR FELII + tier: 2 felii accesibile / 2 felii cu functii si inox / 4 felii familie.
// Dedup variante culoare (Biovita ELITE-4 x6, CLASSIC-4 x4). tag KV = `prajitor-paine`.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'prajitoare';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. 2 felii accesibile (sub 130 lei)
  'D6WTYDBBM', // Philips HD2581 750W 2fel        366r 128 lei — cel mai vandut
  'DZC9VVMBM', // Heinner Tasty 700 750W 2fel     330r 70 lei — cel mai ieftin
  'DCX60NBBM', // Daewoo 700W reincalzire         125r 93 lei — design retro
  // B. 2 felii cu functii si inox premium
  'DDTSJBMBM', // Tefal Vita 800W 2fel            143r 129 lei — brand, simplu
  'DS7G2MMBM', // Tefal Smart'n'Light 850W        139r 232 lei — reglare automata
  'D5WTYDBBM', // Philips Viva 900W               143r 100 lei — mai multa putere
  'D49LHH3BM', // Biovita ELITE-4D inox 1500W     141r 215 lei — premium inox, 6 nivele
  // C. 4 felii, familie
  'D92KLLMBM', // Biovita CLASSIC-4 inox 4fel     110r/4.91 210 lei — nota cea mai mare
  'D2PDXXMBM', // FRAM FTP-800 1600W 4fel         74r 167 lei — 4 felii accesibil
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
