// Merge NON-DISTRUCTIV pentru grupul `cuptoare-microunde-inco`.
// Cuptoare cu microunde INCORPORABILE (built-in, nisa 60cm). Nisa buna (22, recenzii solide).
// 12 pe 3 grupe pe pret/dotari: accesibile <900 / echilibrate brand 900-1400 / premium 1700+.
// ANTI-CANIBALIZARE: astea-s INCORPORABILE; microundele LIBERE (de blat) au articolul lor separat (#15).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'cuptoare-microunde-inco';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. accesibile, sub 900 lei
  'DBK6LVBBM', // Heinner HMW-25BIGBK 25l 900W touch  44r 715 — cel mai vandut accesibil, 25l
  'DXLRY13BM', // Heinner HMW-MDBI20GDBK 20l 800W dig 10r 600 — cel mai bine notat ieftin (4.7)
  'DSX833BBM', // Hansa AMG20BFH 20l 700W grill       36r 795 — grill + blocare copii
  'DV4F9XYBM', // Beko BMOB20202B 20l 800W mecanic     7r 870 — singurul cu control mecanic
  // B. echilibrate, brand (900-1400 lei)
  'DX3D54MBM', // Samsung MG22M8274AT 22l 850W        83r 1000 — cel mai vandut din articol
  'D642TJMBM', // Beko BMGB25333BG 25l 900W grill     13r 1249 — cea mai mare nota la 25l (4.54)
  'DNQCL7BBM', // Heinner HMW-23BI 23l 800W digital   44r 1255 — digital, inox
  'D3BM9V3BM', // Gorenje BM235CLI 23l 800W 360Stir    4r 1413 — fara platou rotativ, stirrer
  // C. premium (1700+ lei)
  'DMNDJFBBM', // Bosch BFL554MB0 25l 900W AutoPilot7 50r 1699 — cel mai bine notat premium
  'D5H9TQBBM', // Electrolux LMS4253TMX 25l 900W grill 54r 1977 — cele mai multe pareri premium
  'D20JY6MBM', // Electrolux EMT25203OC 25l 900W       5r 2245 — grill, finisaj superior
  'DDWTP3YBM', // Bosch Seria 8 BFL7221W1 21l 900W     7r 3500 — top premium, autocuratare
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
