// Merge NON-DISTRUCTIV pentru grupul `multicookere`.
// Grupare pe TIP (decizia reala): cu presiune (Instant Pot-style) / slow cooker (gatire lenta) /
// fara presiune, multifunctionale si orez. ⚠️ tag KV real = `mutlicooker` (typo user la colectare).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'multicookere';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. cu presiune (Instant Pot-style)
  'DFXPDZBBM', // Tefal One Pot CY505E30 5.8L 25prog   2096r 544 lei — cel mai vandut
  'DPHDBJ3BM', // AIRNOVA GustoVita 6L 14prog          82r/4.93 280 lei — cel mai ieftin cu presiune
  'DT5L0VBBM', // Crock-Pot Express 5.6L 8prog         325r 624 lei
  'D4CYL4MBM', // Moulinex CE505A10 One Pot 6L 25prog  95r/4.85 508 lei
  'D3HP6B2BM', // Instant Pot Duo 5.7L 13prog          73r/4.95 581 lei — reperul de brand
  'DXHKTXMBM', // Tefal Turbo Cuisine 4.8L 10prog      140r 550 lei — compact
  // B. slow cooker (gatire lenta)
  'DC60RMBBM', // Crock-Pot SCCPRC507B 4.7L slow       213r 290 lei — slow cooker clasic
  'D41MRBMBM', // Crock-Pot CSC063X 7.5L digital slow  49r/4.86 438 lei — slow mare digital
  // C. fara presiune, multifunctionale si orez
  'DY76QBBBM', // Tefal Fuzzy Logic RK705138 5L 12prog 212r 405 lei — multicooker fara presiune
  'D89Y22MBM', // Tefal SpheriCook 16in1 5L            84r 530 lei — 16 functii
  'DY8RLFYBM', // Xiaomi rice cooker 1L 8prog          67r/4.87 249 lei — orez smart
  'D7HP6B2BM', // Instant Pot Pro Crisp 8L combi       84r/4.88 945 lei — presiune + air fryer
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
