// MERGE NON-DISTRUCTIV: adauga grupul 'aplica-dormitor' in emag-products.json din aplicele
// colectate (tag gresit 'frigidere-sbs', separate pe nume). NU atinge celelalte grupuri.
// Rulare: node scripts/merge-aplica-dormitor.mjs [--no-img]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG_DIR = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'aplica-dormitor';
const TAKE = 9;
if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

const DEEPLINK = (url) => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(url);
const slugify = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');
const modelKey = (name) => (name || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/\b\d+([.,]\d+)?\s*(cm|mm|m|l|litri|kg|w|kw|lm|k|mah|gb|tb|inch|inci|persoane|locuri|bar|pa)\b/g, '')
  .replace(/\b(alb|negru|gri|maro|bej|crem|antracit|stejar|nuc|wenge|natur|gold|auriu|silver|argint|crom|albastru|verde|rosu|roz|bleu|grafit|sonoma)\w*\b/g, '')
  .replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 45);

// aplica de INTERIOR pentru dormitor: pastreaza, exclude exterior/fatada/baie/oglinda/plafoniera/panou/gradina
const isAplica = (n) => /aplic|lampa de perete|lampa perete/i.test(n);
const isExcluded = (n) => /exterior|de gradina|fatada|ip54|ip65|ip 6|oglind|pentru baie|de baie|plafonier|panou|senzor de lumina|impermeabil/i.test(n);

async function downloadImg(rawUrl, slug) {
  const out = IMG_DIR + '/' + slug + '.webp';
  if (existsSync(out)) return true;
  let url = String(rawUrl).replace(/&amp;/g, '&').replace(/width=\d+/, 'width=600').replace(/height=\d+/, 'height=600');
  if (!/width=/.test(url)) url += (url.includes('?') ? '&' : '?') + 'width=600';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    const sharp = (await import('sharp')).default;
    await sharp(buf).resize(500, 500, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).webp({ quality: 82 }).toFile(out);
    return true;
  } catch (e) { console.log('  IMG FAIL', slug, e.message); return false; }
}

const raw = JSON.parse(readFileSync(RAW, 'utf8')).products || [];

// Curat manual pe facete (ordine = ordinea in articol). Diversitate > pur top-recenzii.
const PICK = [
  'DBPXKJYBM', // Set4 Toolight Metal/Lemn E27 (pereche noptiere, lemn, rev29) — value/hero
  'D70P6XYBM', // Vintage Toolight Rotativa 360 (brat reglabil, lectura, rev22)
  'DT9YB3YBM', // Toolight Spirala Lumina Calda (statement modern, rev21)
  'DH08P4MBM', // ADVITI City 20W 3000K (minimalist, rating 5, rev14)
  'D2VN3R3BM', // UMMO reincarcabila fara fir, fara gaurire (wireless/chirie, rev13)
  'DKG5JT3BM', // Goeco Auriu forma neregulata 3-temp (auriu, rev13)
  'DK54YSYBM', // Goeco Lemn Masiv creativ E27 (lemn cald, rev12)
  'DTWW6KYBM', // Tuya RGB+CCT smart control aplicatie/vocal (smart, rev11)
  'DMTTQQMBM', // Aplica cristal AP701 abajur alb (clasic cu abajur, bugetar, rev10)
];
const byId = Object.fromEntries(raw.map(p => [p.id, p]));
const picked = PICK.map(id => byId[id]).filter(Boolean);
if (picked.length !== PICK.length) console.error('!! lipsesc ID-uri:', PICK.filter(id => !byId[id]));

const list = picked.map(p => ({
  id: p.id, slug: slugify(p.name) + '-' + p.id.toLowerCase(), name: p.name,
  brand: p.brand || '', price: p.price, currency: p.currency || 'RON',
  rating: p.rating || null, reviews: p.reviewCount || 0,
  image: '/imagini/produse/' + slugify(p.name) + '-' + p.id.toLowerCase() + '.webp',
  rawImg: (p.images || [])[0] || '', deeplink: DEEPLINK(p.url),
  specs: p.specs || {}, url: p.url, tag: GROUP,
}));

console.log('\n=== SELECTAT (' + list.length + ') ===');
list.forEach((r, i) => console.log((i + 1) + '. rev=' + r.reviews + ' rat=' + r.rating + ' ' + r.price + 'lei | ' + r.name.slice(0, 70)));

if (!NO_IMG) {
  let ok = 0;
  for (const r of list) if (r.rawImg && await downloadImg(r.rawImg, r.slug)) ok++;
  console.log('\nimagini:', ok + '/' + list.length);
}

// MERGE non-distructiv
const db = JSON.parse(readFileSync(OUT, 'utf8'));
const existed = !!db[GROUP];
db[GROUP] = list;
writeFileSync(OUT, JSON.stringify(db, null, 1));
console.log('\ngrup ' + GROUP + (existed ? ' ACTUALIZAT' : ' ADAUGAT') + ' | total grupuri acum: ' + Object.keys(db).length);
console.log('celelalte grupuri neatinse:', Object.keys(db).filter(k => k !== GROUP).length);
