// Genereaza variantele responsive (-1280, -960) pentru hero-urile care chiar sunt servite
// prin <RespImage> (srcset + preloadSrcset). Fara ele, srcset/preload din pagini pointeaza
// spre fisiere inexistente: RespImage cade defensiv pe master, dar preload-ul din <head> da
// 404 si nu exista niciun castig responsive. Vezi src/components/RespImage.astro.
//
// De ce derivam din pagini, nu din toate imaginile de 1920: doar hero-urile din RespImage au
// nevoie de variante. Figurile (1600x900) se servesc ca <img> simplu, iar hero-urile legacy nu
// folosesc RespImage si nu se retrofiteaza. Asa nu producem zeci de fisiere pe care nu le cere nimeni.
//
// Idempotent: sare peste variantele deja existente (fara re-encode). `--force` le regenereaza.
// Uz: node scripts/gen-responsive.mjs [--force]
import sharp from 'sharp';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const PAGES = join(ROOT, 'src/pages');
const PUBLIC = join(ROOT, 'public');
const VARIANT_WIDTHS = [1280, 960]; // master (1920) ramane cu numele lui
const force = process.argv.includes('--force');

// Colecteaza hero-urile: pagini care importa RespImage -> `const hero = '/imagini/...webp'`
const heroes = new Set();
for (const f of readdirSync(PAGES)) {
  if (!f.endsWith('.astro')) continue;
  const src = readFileSync(join(PAGES, f), 'utf8');
  if (!src.includes('RespImage')) continue;
  const m = src.match(/const hero = '([^']+\.webp)'/);
  if (m) heroes.add(m[1]);
}

let made = 0, skipped = 0, missing = 0;
for (const rel of [...heroes].sort()) {
  const master = join(PUBLIC, rel);
  if (!existsSync(master)) {
    console.error(`⛔ MASTER LIPSA: ${rel} (hero servit prin RespImage, dar fisierul nu exista)`);
    missing++;
    continue;
  }
  for (const w of VARIANT_WIDTHS) {
    const dest = master.replace(/\.webp$/, `-${w}.webp`);
    if (existsSync(dest) && !force) { skipped++; continue; }
    await sharp(master).resize(w).webp({ quality: 80, effort: 6 }).toFile(dest);
    console.log(`✓ ${rel.replace(/\.webp$/, `-${w}.webp`)}`);
    made++;
  }
}

console.log(`\n${heroes.size} hero-uri | generate: ${made} | existente: ${skipped}${missing ? ` | ⛔ mastere lipsa: ${missing}` : ''}`);
if (missing) process.exit(1);
