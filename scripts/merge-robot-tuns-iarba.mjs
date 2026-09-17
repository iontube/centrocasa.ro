// MERGE NON-DISTRUCTIV: grup 'robot-tuns-iarba' din roboti colectati sub tag 'tuns-iarba'.
// Curat pe ID (drop cele 2-star). NU atinge grupul 'tuns-iarba'. Rulare: node scripts/merge-robot-tuns-iarba.mjs [--no-img]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG_DIR = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'robot-tuns-iarba';
if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });
const DEEPLINK = (url) => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(url);
const slugify = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

// ordine = ordinea in articol (cu fir; fara fir entry; fara fir mari)
const PICK = [
  'DY12C5MBM', // iHunt RoboMower 2500m2 (best-seller, value, cu fir)
  'DVKB8ZBBM', // Husqvarna Automower 105 (cu fir, brand)
  'D2TX8MMBM', // Husqvarna Automower (robotizata, cu fir)
  'D41M0M2BM', // Bosch Visimo (fara fir perimetral, entry cel mai ieftin)
  'DN0Q0CYBM', // Ecovacs Goat G1-800 (fara fir, LiDAR/vizual)
  'DLZJ1D2BM', // Navimow i105E 500m2 (fara fir, mic-mediu)
  'DCZJ1D2BM', // Navimow i206 AWD 600m2 (fara fir, pante/AWD)
  'DZZJ1D2BM', // Navimow i210E 1000m2 (fara fir, mare)
  'D1ZJ1D2BM', // Navimow i220E Lidar Pro 2000m2 (fara fir, cel mai mare)
];
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
console.log('SELECTAT (' + list.length + '):');
list.forEach((r, i) => console.log((i + 1) + '. rev=' + r.reviews + ' rat=' + r.rating + ' ' + r.price + 'lei | ' + r.name.replace(/\s+/g,' ').slice(0, 62)));
if (!NO_IMG) { let ok = 0; for (const r of list) if (r.rawImg && await downloadImg(r.rawImg, r.slug)) ok++; console.log('imagini:', ok + '/' + list.length); }
const db = JSON.parse(readFileSync(OUT, 'utf8'));
const existed = !!db[GROUP];
db[GROUP] = list;
writeFileSync(OUT, JSON.stringify(db, null, 1));
console.log('grup ' + GROUP + (existed ? ' ACTUALIZAT' : ' ADAUGAT') + ' | total grupuri:', Object.keys(db).length, '| tuns-iarba neatins:', db['tuns-iarba'].length);
