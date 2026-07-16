// Construieste MAP-ul /out (cheie produs -> deeplink profitshare) intr-o Pages Function.
// Cheie = "p-<id>" (id-ul eMAG). Orice produs din emag-products.json e cloacat.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const IN = fileURLToPath(new URL('../src/data/emag-products.json', import.meta.url));
const OUT = fileURLToPath(new URL('../functions/out/[slug].js', import.meta.url));
let groups = {};
try { groups = JSON.parse(readFileSync(IN, 'utf8')); } catch {}
const map = {};
for (const list of Object.values(groups)) for (const p of list) { if (p.id && p.deeplink) map['p-' + p.id] = p.deeplink; }
const js = `// AUTO-GENERAT de scripts/generate-redirects.mjs — NU edita manual.
const MAP = ${JSON.stringify(map)};
export async function onRequest({ params }) {
  const url = MAP[params.slug];
  if (url) return Response.redirect(url, 302);
  return new Response('not found', { status: 404 });
}
`;
writeFileSync(OUT, js);
console.log('/out MAP:', Object.keys(map).length, 'produse ->', OUT);
