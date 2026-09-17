// Merge NON-DISTRUCTIV pentru grupul `cuptoare-micro`.
// Cuptoare cu microunde DE BLAT (libere / de sine statatoare). Nisa FOARTE puternica (24, pana la 586r).
// 12 pe 3 grupe: digitale cel mai bun raport / mecanice simple / cu grill sau mai mari.
// ANTI-CANIBALIZARE: astea-s LIBERE (head-term "cuptor cu microunde"); INCORPORABILE au art. lor (#13, LIVE).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'cuptoare-micro';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

const PICK = [
  // A. digitale, cel mai bun raport
  'D76C1JBBM', // Samsung MS23K3513AW 23l 800W  586r 480 — cel mai vandut, alb
  'D4Z53JBBM', // Samsung MS23K3513 negru 23l   576r 433 — nota 4.81 cea mai mare, mai ieftin
  'D8XS07BBM', // Daewoo KOR-6S2BW 20l 700W dig 581r 356 — design retro, cel mai vandut Daewoo
  'E1YJKBBBM', // Hansa AMG17M70VH 17l 700W     292r 451 — cel mai compact
  // B. mecanice, simple si ieftine
  'D65YQDMBM', // Daewoo KOR-6S20K 20l 700W mec 493r 375 — cel mai vandut mecanic
  'D97XP7MBM', // Toshiba MW-MM20P 20l 800W mec 201r 349 — 800W, iluminare
  'DZL0P4YBM', // Heinner HMW-MD20M 20l 700W    153r 286 — accesibil, argintiu
  'DHY65NMBM', // Samus SMC-20M 20l 700W         94r 264 — cel mai ieftin din articol, nota 4.79
  // C. cu grill sau mai mari
  'DC3QQSBBM', // Samsung MG23K3515 23l 800W grill 161r 550 — cel mai bine notat cu grill 4.77
  'D04SGMMBM', // Toshiba MW2-MG20 20l 800W+grill1000W 114r 412 — grill accesibil
  'DRL0P4YBM', // Heinner HMW-MD25D 25l 900W dig  91r 388 — cel mai mare si mai puternic
  'EWS6NBBBM', // Samsung MG23F301 23l 800W+grill1100W 141r 1400 — premium grill (dar scump vs MG23K3515)
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
