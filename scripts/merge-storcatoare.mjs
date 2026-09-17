// Merge NON-DISTRUCTIV pentru grupul `storcatoare`.
// Grupare pe TIP (decizia reala): centrifugale rapide / presare la rece si masticare (slow) / citrice.
// Dedup variante culoare (Biovita Nutrimax x6). tag KV = `storcator`.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'storcatoare';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. centrifugale (rapide)
  'D4JJW2BBM', // Heinner XF-1000SS 1000W       737r 234 lei — cel mai vandut
  'DWPPDZBBM', // Tefal Fruteli 350W            218r 204 lei — compact/accesibil
  'DL5HLVBBM', // Heinner HSF-600BK 600W        90r 166 lei — accesibil
  'DGLRLMBBM', // Philips Viva 800W             378r 499 lei — brand, bine vandut
  'DYCX6BBBM', // Bosch MES25 700W              111r 500 lei — premium brand
  // B. presare la rece / masticare (slow)
  'DD06SYYBM', // Latkon slow 150W              419r/4.9 520 lei — cel mai notat slow
  'D00FSJYBM', // Biovita Nutrimax slow 150W    139r 450 lei
  'DGPPDZBBM', // Tefal Juiceo ZC150838 slow    81r 690 lei — brand slow
  'DCNTC2BBM', // Biovita SJ500 melc vertical   58r 805 lei — cu melc premium
  // C. citrice
  'DD6LZMBBM', // Tefal VitaPress ZP3001 25W    158r 110 lei — citrice brand
  'D7KK4KBBM', // Heinner C160 160W             162r 180 lei — citrice mai puternic
  'DFDF9YMBM', // Heinner Limme C300 30W        133r 69 lei — citrice cel mai ieftin
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
