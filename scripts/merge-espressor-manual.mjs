// Merge NON-DISTRUCTIV pentru grupul `espressor-manual`.
// Fata de scripturile vechi: foloseste scripts/lib/emag-image.mjs, care descarca
// imaginea ORIGINALA de la eMAG (1000-2000px) in loc sa ceara ?width=600 si sa taie la 500.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { downloadProductImage } from './lib/emag-image.mjs';

const RAW = fileURLToPath(new URL('../src/data/emag-raw.json', import.meta.url));
const OUT = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const IMG = fileURLToPath(new URL('../public/imagini/produse', import.meta.url));
const NO_IMG = process.argv.includes('--no-img');
const GROUP = 'espressor-manual';
if (!existsSync(IMG)) mkdirSync(IMG, { recursive: true });

const DL = u => 'https://l.profitshare.ro/lps/9/ZmA/?redirect=' + encodeURIComponent(u);
const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

// 12 modele distincte. Scoase: aparatele cu CAPSULE (Nespresso/Dolce Gusto — raman in KV pentru
// articolul "espressoare cu capsule", pozitia 10 in coada) si variantele de culoare ale aceluiasi model.
// Gruparea urmeaza campul REAL din specs eMAG `Sistem spumare lapte` (Manual / Automat),
// nu o scara de pret inventata de mine.
const PICK = [
  // A. spumare MANUALA, de intrare (sub 300 lei)
  'DJX6QSBBM', // Heinner HEM-200RD 800W 3.5 bar        152 lei  278r
  'D3Q1S7MBM', // Heinner Boquette HEM-1100 850W 15 bar 253 lei  198r
  'DH9XV6BBM', // Heinner HEM-850BKSL filtru dublu      280 lei  150r
  // B. spumare AUTOMATA / carafa de lapte
  'DYW0RMBBM', // Breville Prima Latte VCF045X          550 lei 1539r
  'D3KBYDBBM', // De'Longhi ECP 31.21                   540 lei  337r
  'DXH40NBBM', // Studio Casa Barista latte             549 lei  146r
  'DLHCB4BBM', // Breville VCF108X Prima Latte II       630 lei  178r
  'DCHCB4BBM', // Breville VCF109X Prima Latte II 19bar 830 lei  178r
  'DC8WKCYBM', // Latkon 20 bar                         850 lei  167r
  // C. spumare MANUALA, constructie mai serioasa
  'DHGQ27BBM', // De'Longhi EC221.W 15 bari             852 lei 2158r
  'DYXF7VBBM', // Krups XP320830 1050W 15 bar           852 lei  218r
  'D93NZ2YBM', // De'Longhi Dedica Style EC685 metal    921 lei  472r
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

list.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${String(r.reviews).padStart(5)}r ${String(r.rating).padEnd(5)} ${String(r.price).padStart(8)} lei | ${r.name.replace(/\s+/g, ' ').slice(0, 52)}`));

if (!NO_IMG) {
  let ok = 0;
  for (const r of list) {
    if (!r.rawImg) continue;
    const res = await downloadProductImage(r.rawImg, IMG + '/' + r.slug + '.webp', { force: true });
    if (res.ok) { ok++; console.log(`   img ${r.slug.slice(0, 40)} : ${res.src || '-'} -> ${res.w}x${res.h}`); }
    else console.log('   IMG FAIL', r.slug, res.reason);
  }
  console.log('imagini:', ok + '/' + list.length);
}

// NON-DISTRUCTIV: atingem doar cheia noastra, restul grupurilor raman neatinse
const db = JSON.parse(readFileSync(OUT, 'utf8'));
const existed = !!db[GROUP];
db[GROUP] = list;
writeFileSync(OUT, JSON.stringify(db, null, 1));
console.log(`grup ${GROUP} ${existed ? 'ACTUALIZAT' : 'ADAUGAT'} | total grupuri: ${Object.keys(db).length}`);
