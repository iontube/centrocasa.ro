// Merge NON-DISTRUCTIV pentru grupul `cuptoare-elec-inco`.
// Cuptoare ELECTRICE INCORPORABILE (built-in, incastrate in coloana/sub blat mobilier).
// ANTI-CANIBALIZARE: #14 `cuptoare-electrice-de-blat` (libere) e LIVE; astea-s incastrate in mobilier.
// 12 pe 3 grupe PRET/dotari, cu axa-cheie SISTEM DE CURATARE (catalitic/hidroliza-steam/EcoClean).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'cuptoare-elec-inco';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. accesibile <1300 (catalitic / bazice)
  'DPLMZMYBM', // Arctic ARVIE1110XD 71l    47r 949  — cel mai ieftin, inox
  'D34XC2MBM', // Heinner HBO-V656G-IX 72l  27r 961  — 6 functii, inox
  'DJ1Q67YBM', // Arctic ARVI1130BC 71l     76r 1099 — cel mai vandut Arctic, catalitic
  'D553BCMBM', // Electrolux EOF5H40BX 65l  28r 1199 — AquaClean, 9 programe, convectie
  'DXL0G7BBM', // Hansa BOES68461 62l       62r 1299 — SteamClean (hidroliza)
  // B. echilibrate 1300-2000 (brand premium accesibil, mai multe functii)
  'DY77M73BM', // Bosch HBF133BA1 66l      139r 1569 — EcoClean, grill, Bosch accesibil
  'D8P36JBBM', // Zanussi ZOB442XU 57l     132r 1682 — cel mai bine notat echilibrat 4.75
  'DPP9TQBBM', // Electrolux EOD3H50TX 72l  87r 1799 — 72l, grill, SurroundCook
  'DVZ9BMBBM', // Hansa BOES68465 8 functii 67r 1819 — hidrolitica, clasa A
  // C. premium 2000+ (autocuratare avansata / design)
  'D9FCD0MBM', // Electrolux EOD3C70TK 72l  33r 1999 — premium accesibil, catalitic
  'DKDRP6BBM', // Bosch HBF153BS0 66l      139r 3570 — top Bosch EcoClean
  'DLZS47BBM', // Electrolux EOA5220AOR 72l 43r 3630 — design rustic, multifunctional
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
