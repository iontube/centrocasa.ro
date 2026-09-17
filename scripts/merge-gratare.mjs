// Merge NON-DISTRUCTIV pentru grupul `gratare-electrice`.
// Grupare pe TIP: contact cu senzor automat (OptiGrill-style) / contact clasic cu termostat /
// plancha, de masa si multifunctionale. tag KV = `gratar-electric`.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'gratare-electrice';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. contact cu senzor automat (OptiGrill-style)
  'D0TB0XYBM', // Tefal OptiGrill+ GC717810 6 prog     329r 680 lei — cel mai vandut
  'DPTB0XYBM', // Tefal OptiGrill+ XL GC727810 9 prog  281r 820 lei — XL familie
  'DGD456BBM', // Tefal OptiGrill Elite GC750D30       197r 612 lei — Elite, mai multe programe
  'DJPLCGYBM', // Braun MultiGrill CG7044 3 moduri     67r/4.82 650 lei — alternativa Braun
  // B. contact clasice, cu termostat
  'DTDV12BBM', // Tefal Super Grill GC451B12 timer     256r 631 lei — deschidere plana, timer
  'D823V6BBM', // Daewoo DG2500B 2400W                 89r 279 lei — accesibil
  'D7V84VMBM', // Heinner SunsetGrill 2000W            71r 202 lei — cel mai ieftin util
  'DBH91LBBM', // George Foreman cu picioare 2400W     36r 620 lei — clasic cu scurgere grasime
  // C. plancha, de masa si multifunctionale
  'DZW967BBM', // Tefal Malaga plancha 2000W           103r/4.76 370 lei — plancha suprafata mare
  'DPXPDZBBM', // Tefal Plancha CB6A0830 2 zone        120r 350 lei — plancha 2 zone
  'D2DQBWMBM', // Tefal OptiGrill 4in1 GC774D30        48r/4.85 900 lei — 4in1 placi interschimbabile
  'DT1BB7YBM', // Ninja Woodfire OG701EU afumator      51r/4.86 2100 lei — cu afumator, premium
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
