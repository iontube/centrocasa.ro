// Merge NON-DISTRUCTIV pentru grupul `blendere`.
// Grupare pe TIP (nu pe pret): de masa cu bol / personale to-go / portabile fara fir / mare viteza.
// Dedup pe culoare-varianta (Nutribullet Pro x9, Luxena x7). Exclus Zenkabeat B23 (mixer vertical,
// merge la articolul "mixere de mana", anti-canibalizare).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'blendere';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. de masa cu bol (1.5-2L)
  'DTTP6MBBM', // Heinner Master HBL-1000XMC 1000W 1.5L   807r 288 lei — cel mai vandut
  'DHPZVMBBM', // Heinner HBL-550S 550W 1.5L              477r 136 lei — cel mai ieftin de masa
  'D02VS9BBM', // Tefal BlendForce 2 BL420838 600W        220r 230 lei
  'D91CJYYBM', // Biovita FORTE-1200 cu Rasnita 1.5L stic 170r 370 lei — vas sticla + rasnita
  // B. personale / to-go
  'DKW9ZJYBM', // Nutribullet Pro NB907MAB 900W           414r 297 lei — cel mai notat, cupa to-go
  'DNQJ68BBM', // Biovita Legend-800 2x0.6L 800W          279r 195 lei
  // C. portabile fara fir (reincarcabile)
  'D7BBD3YBM', // Luxena portabil fara fir 6 lame 3D      375r 160 lei
  'D1QZ3BYBM', // MixUP PRO SmartVIBE mini 500ml          176r 100 lei
  // D. de mare viteza (1200-1800W)
  'DT49SNBBM', // Tefal PerfectMix+ BL811D38 1200W 1.75L  358r 481 lei
  'DP8XL83BM', // SeveShop Teendow 2in1 1800W             178r 430 lei
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
