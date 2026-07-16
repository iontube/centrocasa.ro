// gen-emag.mjs (centrocasa) — src/data/emag-raw.json -> src/data/emag-products.json + imagini WebP locale.
// Filtreaza junk-ul din carusele pe breadcrumb (per eticheta), dedup pe model, deeplink profitshare,
// sorteaza pe calitate (recenzii x rating), descarca imagini pt top N/eticheta.
// Rulare: node scripts/gen-emag.mjs [--no-img] [--top=30]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG_DIR = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const TOP_IMG = +(process.argv.find(a => a.startsWith('--top='))?.split('=')[1] || 30);
if (!existsSync(IMG_DIR)) mkdirSync(IMG_DIR, { recursive: true });

const DEEPLINK = (url) => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(url);
const slugify = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

// Filtru pe breadcrumb per eticheta (bcs = breadcrumb joined lowercase). Arunca produsele straine din carusele.
const FILTER = {
  'mobila':           (bcs) => /mobila (bucatarie|living|dormitor)/.test(bcs),
  'canapele':         (bcs) => /canapele/.test(bcs),
  'aer-conditionat':  (bcs) => /aer conditionat/.test(bcs),
  'saltele':          (bcs) => /saltele/.test(bcs),
  'tuns-iarba':       (bcs) => /tuns iarba/.test(bcs),
  'mobilier-gradina': (bcs) => /mobila gradina|mobila-gradina|seturi mobila gradina|mobilier gradina/.test(bcs),
  'usi-exterior':     (bcs) => /usi intrare/.test(bcs),
  'usi-interior':     (bcs) => /usi interior/.test(bcs),
  'usi-garaj':        (bcs) => /usi garaj/.test(bcs),
  'uscatoare-rufe':   (bcs) => /uscatoare/.test(bcs),
  'espressor':        (bcs) => /espressoare/.test(bcs),
  'panouri-solare':   (bcs) => /panouri solare|sisteme si panouri/.test(bcs),
  'aspiratoare-robot':(bcs, name) => /aspiratoare/.test(bcs) && /robot/.test(name),
  'saune':            (bcs) => /saune|cabine saune/.test(bcs),
  'generatoare':      (bcs) => /generatoare/.test(bcs),
  'piscine':          (bcs) => /piscine/.test(bcs),
  'cabine-dus':       (bcs) => /cabine dus/.test(bcs),
};
// sub-eticheta (pt mobila -> 3 articole)
function subTag(tag, bc) {
  if (tag !== 'mobila') return null;
  const top = (bc[0] || '').toLowerCase();
  if (top.includes('bucatarie')) return 'mobila-bucatarie';
  if (top.includes('living')) return 'mobila-living';
  if (top.includes('dormitor')) return 'mobila-dormitor';
  return null;
}
// cheie de dedup: nume fara culoare/dimensiuni -> pastram varianta cu cele mai multe recenzii
function modelKey(name) {
  return (name || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\b\d+([.,]\d+)?\s*(cm|mm|m|l|litri|kg|w|kw|mah|gb|tb|inch|inci|persoane|locuri|bar|pa)\b/g, '')
    .replace(/\b(alb|negru|gri|maro|bej|crem|antracit|stejar|nuc|wenge|natur|gold|silver|albastru|verde|rosu|roz|bleu|grafit|sonoma)\w*\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 60);
}

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
console.log('raw:', raw.length);

// grupare + filtrare + dedup
const groups = {};
const seenKey = {};
for (const p of raw) {
  const tag = p.collectTag;
  if (!tag || !FILTER[tag]) continue;
  if (!p.price || p.price < 100) continue;
  if (!p.name || !p.id) continue;
  const bc = p.breadcrumb || [];
  const bcs = bc.join(' > ').toLowerCase();
  if (!FILTER[tag](bcs, p.name.toLowerCase())) continue;
  const st = subTag(tag, bc) || tag;
  const mk = st + '::' + modelKey(p.name);
  const rec = {
    id: p.id, slug: slugify(p.name) + '-' + p.id.toLowerCase(), name: p.name,
    brand: p.brand || '', price: p.price, currency: p.currency || 'RON',
    rating: p.rating || null, reviews: p.reviewCount || 0,
    image: '/imagini/produse/' + slugify(p.name) + '-' + p.id.toLowerCase() + '.webp',
    rawImg: (p.images || [])[0] || '', deeplink: DEEPLINK(p.url),
    specs: p.specs || {}, url: p.url, tag: st,
  };
  // dedup pe model: pastreaza cel cu mai multe recenzii
  const prev = seenKey[mk];
  if (prev && (prev.reviews || 0) >= (rec.reviews || 0)) continue;
  if (prev) { const g = groups[prev.tag]; const i = g.indexOf(prev); if (i >= 0) g.splice(i, 1); }
  seenKey[mk] = rec;
  (groups[st] ||= []).push(rec);
}

// sortare pe calitate (recenzii apoi rating) + descarca imagini top N
let imgOk = 0, imgTot = 0;
for (const [tag, list] of Object.entries(groups)) {
  list.sort((a, b) => (b.reviews - a.reviews) || ((b.rating || 0) - (a.rating || 0)) || (a.price - b.price));
  if (!NO_IMG) {
    for (const r of list.slice(0, TOP_IMG)) { imgTot++; if (r.rawImg && await downloadImg(r.rawImg, r.slug.replace(/\.webp$/, ''))) imgOk++; }
  }
}

// scrie output (fara rawImg/specs mari nu — le pastram, utile la articol)
writeFileSync(OUT, JSON.stringify(groups, null, 1));
console.log('\n=== pe articol (dupa filtrare + dedup):');
for (const [tag, list] of Object.entries(groups).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${String(list.length).padStart(4)}  ${tag}`);
}
console.log(`\nTOTAL grupuri: ${Object.keys(groups).length} | produse: ${Object.values(groups).reduce((n, l) => n + l.length, 0)}`);
if (!NO_IMG) console.log(`imagini: ${imgOk}/${imgTot} descarcate (top ${TOP_IMG}/articol)`);
console.log('->', OUT);
