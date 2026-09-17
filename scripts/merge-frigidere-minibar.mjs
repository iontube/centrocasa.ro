// Merge NON-DISTRUCTIV pentru grupul `frigidere-minibar`.
// Nisa BUNA (23, cu recenzii solide). Minibaruri = frigidere mici DE SINE STATATOARE (birou/dormitor/
// camera de zi/hotel), distinct de incorporabilele sub blat (Adler/Bomann). 12 pe 3 grupe dupa CAZ:
// clasice accesibile / cu design pentru camera de zi / mai mari sau cu note de top.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'frigidere-minibar';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. clasice, cel mai bun raport (420-590 lei)
  'DPP0MGMBM', // STARCREST SMB-46WHE 46l   58r 500 — cel mai notat clasic, 80 kWh
  'DS20FVYBM', // Heinner HMB-HM41E++ 41l    36r 548 — 79 kWh, alb
  'DM7760MBM', // VIVAX MF-45E ~43l           7r 589 — usa reversibila
  'DJF0DSYBM', // Samus SW064E 41l            4r 425 — cel mai ieftin, mic congelator 4l
  'DC1FB0BBM', // MF46W 46l                   8r 522 — racire dinamica, 35 dB cel mai silentios, congelator 5l
  // B. cu design, pentru camera de zi
  'DWNKMDYBM', // STARCREST SRMB-47BK Vintage 46l 64r 540 — design retro, CEL MAI VANDUT, negru
  'DB4T57YBM', // STARCREST SMB-47GLS-BK 46l  40r 540 — usa de sticla, design modern
  'D6P73VMBM', // VORTEX VM5SRD04M 47l         3r 500 — rosu, statement de culoare
  // C. mai mari sau cu note de top
  'D6XTJT2BM', // Heinner HMB-M66E++ 66l       5r 577 — cel mai mare accesibil, singurul No Frost
  'DVMHTFYBM', // TCL RF045DWE0 45l           12r 932 — cea mai mare nota 4.92, maner retras
  'DJZ996YBM', // Arctic AT4746M4S 46l         4r 880 — brand romanesc, usi reversibile
  'DG4HK1BBM', // Crown CM-68B 68l            12r 1225 — cel mai mare, dar clasa climatica ST-T (doar camera calda)
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
