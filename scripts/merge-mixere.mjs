// Merge NON-DISTRUCTIV pentru grupul `mixere`.
// Mixer de mana CLASIC (cu teluri + carlige aluat), NU blender de imersie.
// Grupare pe TIER/putere: accesibile / echilibrate bine notate / premium Bosch cu turbo.
// EXCLUS Adler 3in1 (e blender de imersie, intrat gresit in tag). tag KV = `mixer-de-mana`.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'mixere';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. accesibile (sub 130 lei)
  'DGJVLKMBM', // Heinner White Orchid 400W       147r 75 lei — cel mai bun raport ieftin
  'DBBF67BBM', // Tefal Quick Mix 300W            160r 110 lei — brand accesibil
  'DH29RSBBM', // Philips HR3705 300W             95r 99 lei — Philips ieftin
  'D2X1BPMBM', // Hausberg HB-4112 250W 7 viteze  82r 49 lei — cel mai ieftin util
  // B. echilibrate, bine notate (130-190 lei)
  'D2BKYDBBM', // Philips Viva HR3740 450W        287r 130 lei — cel mai vandut de brand
  'DDZ3C4YBM', // KD Home PowerWhisk 500W + cutie 217r 159 lei — bine notat, cutie depozitare
  'DP57DG3BM', // EvoSmart HM615 600W + cutie     102r/4.95 182 lei — cea mai mare putere accesibila
  'DR5N6H3BM', // Latkon HMLTK01 400W             74r/4.97 130 lei — nota cea mai mare
  // C. premium Bosch, cu turbo si accesorii
  'E8DRKBBBM', // Bosch MFQ36440 450W 5v+Turbo    303r 280 lei — cel mai vandut premium
  'DDYCXMBBM', // Bosch MFQ40303 500W 5v+turbo    211r 310 lei — mai puternic
  'DXGFPMBBM', // Bosch MFQ36480 450W accesorii   70r 371 lei — cu accesorii premium
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
