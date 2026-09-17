// Merge NON-DISTRUCTIV pentru grupul `cuptoare-elec`.
// Cuptoare electrice DE BLAT (neincorporabile / mini-cuptoare). Nisa bogata (24, recenzii puternice).
// 12 pe 3 grupe capacitate: compacte 18-35l / medii 38-50l / mari 60-70l.
// EXCLUS anti-canibalizare: Tefal Easy Fry (AIR FRYER -> art. friteuze cu aer cald), Biovita pizza 12l 450° (prea
// specializat). ANTI-CANIBALIZARE: astea-s LIBERE; cuptoarele electrice INCORPORABILE au articolul lor (#16).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'cuptoare-elec';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. compacte (18-35 l)
  'DQ110NBBM', // Esperanza 18l convectie 250°C  93r 293 — cel mai mic util, cel mai notat mic
  'DRQPC3BBM', // Albatros A23B2 23l             39r 244 — cel mai ieftin
  'DW2992MBM', // Floria ZLN-9553 rotund ~40l    37r 436 — forma rotunda, visiniu
  'D539SYBBM', // Albatros A35W2 35l alb         49r 262 — alb, nota 4.69
  // B. medii (38-50 l)
  'DXSV27BBM', // Samus CSD-45BRC2 45l 2000W    128r 484 — CEL MAI VANDUT, rotisor+convectie
  'DQP1B8BBM', // Zilan Gusto 38l 320°C 2 tavi  114r 322 — temp max mare, accesibil
  'D7VQG3BBM', // Samus CS-45B2 45l 2000W        98r 318 — 45l bine notat, mai ieftin
  'D6RPKVBBM', // Albatros A50BRCL2 50l 2000W    71r 388 — 50l
  // C. mari (60-70 l)
  'D34ZB7BBM', // Samus CS-60BRC2 60l 2200W      65r 496 — 60l nota 4.69
  'DKG1R3BBM', // Albatros A63BRC2 63l 2200W     72r 474 — rotisor+convectie, 6 functii
  'D8QPC3BBM', // Albatros A63BPRC2 63l cu plite 48r 514 — cuptor + 2 plite deasupra
  'DKQBYYYBM', // Kumtel LX-9645FA 70l 2500W     76r 800 — cel mai mare, pizza+rotisor XXL
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
