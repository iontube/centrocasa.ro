// Merge NON-DISTRUCTIV pentru grupul `dezumidificator`.
// Foloseste scripts/lib/emag-image.mjs (imagine originala eMAG, nu ?width=600 taiat la 500).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'dezumidificator';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

// 12 modele, grupate pe CAPACITATE (l/24h) — axa reala de alegere, mapata pe suprafata camerei.
// Excluse: dezumidificatoarele PASIVE cu granule (fara compresor, alt produs) si accesoriile.
const PICK = [
  // A. 6-12 l/24h — o singura camera
  'DBZSWLMBM', // AlecoAir D8 Junior       8l  10m² 43dB   534 lei
  'DVL8K2MBM', // Turbionaire EPI 12      12l  26m² 38dB   529 lei
  'DRSHBWBBM', // Turbionaire SENSO 12    12l  20m² 36dB   599 lei
  'DXNDN7MBM', // AlecoAir D12 Junior     12l  18m² 43dB   599 lei
  // B. 13-16 l/24h — apartament
  'D96C7LMBM', // Turbionaire SENSO 13    13l  22m² 36dB   597 lei
  'DWNC1XMBM', // Turbionaire Smart 16M   16l  25m² 40dB   630 lei
  'DWLSWLMBM', // AlecoAir D16 HOME       16l  25m² 43dB   691 lei
  'D4Y668BBM', // AlecoAir D14 PURIFY     12l  20m² 35dB   849 lei
  // C. 20-35 l/24h — casa, subsol, spatii mari
  'D7TJ7MYBM', // Freezy Air Dry 20       20l  45m² 36dB   849 lei
  'D9NDN7MBM', // AlecoAir D22 PURIFY     22l  50m² 46dB  1150 lei
  'DDF8D4BBM', // AlecoAir D23            23l  55m² 46dB  1299 lei
  'D9NQHB3BM', // AlecoAir D35 ARIO       35l 110m² 42dB  1699 lei
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

list.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${String(r.reviews).padStart(5)}r ${String(r.rating).padEnd(5)} ${String(r.price).padStart(8)} lei | ${r.name.replace(/\s+/g, ' ').slice(0, 50)}`));

if (!NO_IMG) {
  let ok = 0;
  for (const r of list) {
    if (!r.rawImg) continue;
    const res = await downloadProductImage(r.rawImg, IMG + '/' + r.slug + '.webp', { force: true });
    if (res.ok) { ok++; console.log(`   img ${r.slug.slice(0, 34)} : ${res.src || '-'} -> ${res.w}x${res.h}`); }
    else console.log('   IMG FAIL', r.slug, res.reason);
  }
  console.log('imagini:', ok + '/' + list.length);
}

const db = JSON.parse(readFileSync(OUT, 'utf8'));
const existed = !!db[GROUP];
db[GROUP] = list;
writeFileSync(OUT, JSON.stringify(db, null, 1));
console.log(`grup ${GROUP} ${existed ? 'ACTUALIZAT' : 'ADAUGAT'} | total grupuri: ${Object.keys(db).length}`);
