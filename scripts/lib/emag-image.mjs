// Descarcare imagini produs de la eMAG, la rezolutie REALA.
//
// De ce exista: scripturile merge-*.mjs cereau `?width=600` si apoi micsorau la 500x500.
// Masurat pe URL-uri reale (2026-07-20): serviciul de resize al eMAG are nevoie de parametrul
// `hash` valid; fara query string servesc ORIGINALUL, care e intre 1000x1000 si 2000x2000.
// Deci ceream mic degeaba — aveam 2-4x mai multa rezolutie disponibila.
//
// Contau: hero-ul pune produsul intr-o cutie de ~885px inaltime. Cu sursa de 500px insemna
// upscale de 77% (moale, vizibil). Cu 1100px sursa nu mai exista upscale.
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import sharp from 'sharp';

// 1100 acopera cutia hero (885) + retina pe cardurile de produs, fara sa umflam inutil discul.
export const MASTER = 1100;

/** Scoate query string-ul -> eMAG serveste originalul in loc de varianta redimensionata. */
export function originalUrl(raw) {
  return String(raw).replace(/&amp;/g, '&').split('?')[0];
}

/**
 * Descarca la rezolutie maxima si scrie webp de cel mult MASTER px.
 * Nu face upscale: daca originalul e mai mic, il pastreaza asa cum e.
 * @returns {Promise<{ok:boolean, w?:number, h?:number, reason?:string}>}
 */
export async function downloadProductImage(rawUrl, outPath, { force = false, master = MASTER } = {}) {
  if (!force && existsSync(outPath)) return { ok: true, reason: 'exista' };
  mkdirSync(dirname(outPath), { recursive: true });

  const url = originalUrl(rawUrl);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    if (!r.ok) return { ok: false, reason: `http ${r.status}` };
    const buf = Buffer.from(await r.arrayBuffer());

    const meta = await sharp(buf).metadata();
    const target = Math.min(master, Math.max(meta.width || 0, meta.height || 0)) || master;

    await sharp(buf)
      .resize(target, target, { fit: 'inside', withoutEnlargement: true, background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .webp({ quality: 84, effort: 5 })
      .toFile(outPath);

    const out = await sharp(outPath).metadata();
    return { ok: true, w: out.width, h: out.height, src: `${meta.width}x${meta.height}` };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}
