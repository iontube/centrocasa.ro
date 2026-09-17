// Genereaza src/data/popular.json = cele mai vizitate articole, din Cloudflare Analytics.
// Query zone httpRequestsAdaptiveGroups (ultimele 24h, doar traffic eyeball) -> top path-uri
// -> potrivite cu articolele vizibile. Fallback: cele mai noi articole. NU strica build-ul daca CF pica.
// Ruleaza cu CF_KEY in env (X-Auth-Key global). Uz: node scripts/gen-popular.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { visibleArticles, slugify } from '../src/lib/articles.mjs';

const OUT = fileURLToPath(new URL('../src/data/popular.json', import.meta.url));
const kw = JSON.parse(readFileSync(fileURLToPath(new URL('../keywords.json', import.meta.url)), 'utf8'));
const ZONE = 'f7d0cadf4d15b6f5963648ef2425bcdc';
const EMAIL = 'contact@centrocasa.ro';
const N = 6;

// map slug -> articol vizibil
const arts = visibleArticles(kw.completed).map(item => ({
  slug: item.slug || slugify(item.keyword),
  title: item.keyword.charAt(0).toUpperCase() + item.keyword.slice(1),
  image: item.image || `/images/articles/${item.slug || slugify(item.keyword)}.webp`,
  category: item.category,
  categorySlug: item.categorySlug,
  date: item.date || '',
})).sort((a, b) => new Date(b.date) - new Date(a.date));
const bySlug = Object.fromEntries(arts.map(a => [a.slug, a]));

function fallback() {
  return arts.slice(0, N);
}

async function fromCF() {
  const KEY = process.env.CF_KEY;
  if (!KEY) throw new Error('no CF_KEY');
  const since = new Date(Date.now() - 23 * 3600e3).toISOString();
  const q = { query: `{ viewer { zones(filter:{zoneTag:"${ZONE}"}) {
    httpRequestsAdaptiveGroups(limit:60, filter:{datetime_geq:"${since}", requestSource:"eyeball"}, orderBy:[count_DESC]) {
      count dimensions { clientRequestPath } } } } }` };
  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST', headers: { 'X-Auth-Email': EMAIL, 'X-Auth-Key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(q),
  });
  const j = await res.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors).slice(0, 200));
  const rows = j.data.viewer.zones[0].httpRequestsAdaptiveGroups || [];
  const counts = {};
  for (const r of rows) {
    const slug = (r.dimensions.clientRequestPath || '').replace(/^\/+|\/+$/g, '');
    if (bySlug[slug]) counts[slug] = (counts[slug] || 0) + r.count;
  }
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([s]) => bySlug[s]);
  // completeaza pana la N cu cele mai noi care nu-s deja
  const have = new Set(ranked.map(a => a.slug));
  for (const a of arts) { if (ranked.length >= N) break; if (!have.has(a.slug)) { ranked.push(a); have.add(a.slug); } }
  return ranked.slice(0, N);
}

let list, src;
try { list = await fromCF(); src = 'cloudflare'; }
catch (e) {
  // CF indisponibil (ex build manual fara CF_KEY): pastreaza fisierul existent daca e valid
  if (existsSync(OUT)) {
    try { const prev = JSON.parse(readFileSync(OUT, 'utf8')); if (Array.isArray(prev) && prev.length) { console.log('popular.json: pastrat existent (' + e.message + ')'); process.exit(0); } } catch {}
  }
  list = fallback(); src = 'fallback (' + e.message + ')';
}

const out = list.map(({ slug, title, image, category, categorySlug }) => ({ slug, title, image, category, categorySlug }));
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('popular.json:', out.length, 'articole, sursa:', src);
out.forEach((a, i) => console.log(`  ${i + 1}. ${a.slug}`));
