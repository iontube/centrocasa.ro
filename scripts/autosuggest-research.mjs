#!/usr/bin/env node
// Research RO Google autosuggest pentru titluri cu cerere reala.
// Usage: node scripts/autosuggest-research.mjs "seed 1" "seed 2" ...
// Sau fara argumente: ruleaza pe toate legacy-urile din keywords.json (seed = keyword + core term).

import { readFileSync } from 'node:fs';

const SUGGEST = 'https://suggestqueries.google.com/complete/search';

async function suggest(q) {
  const url = `${SUGGEST}?client=firefox&hl=ro&gl=ro&q=${encodeURIComponent(q)}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const txt = await r.text();
    const arr = JSON.parse(txt);
    return Array.isArray(arr?.[1]) ? arr[1] : [];
  } catch (e) {
    return [`<err:${e.message}>`];
  }
}

const STOP = new Set(['de','pentru','cu','si','la','din','al','ai','pe','mic','mica','modern','moderna','automat','automata']);
function core(keyword) {
  // primele 2-3 cuvinte semnificative = termenul de baza (ex "aplica de perete" -> "aplica perete")
  const w = keyword.split(/\s+/);
  const kept = [];
  for (const x of w) { if (!STOP.has(x)) kept.push(x); if (kept.length >= 3) break; }
  return kept.join(' ');
}

async function research(seed) {
  const base = await suggest(seed);
  return { seed, base };
}

const args = process.argv.slice(2);
let jobs;
if (args.length) {
  jobs = args.map(s => ({ keyword: s, seeds: [s] }));
} else {
  const k = JSON.parse(readFileSync(new URL('../keywords.json', import.meta.url)));
  const leg = k.completed.filter(x => x.legacy);
  jobs = leg.map(x => ({ keyword: x.keyword, cat: x.categorySlug, seeds: [core(x.keyword), x.keyword] }));
}

for (const job of jobs) {
  console.log('\n\x1b[1m### ' + job.keyword + (job.cat ? '  [' + job.cat + ']' : '') + '\x1b[0m');
  const uniq = new Map();
  for (const s of job.seeds) {
    const sug = await suggest(s);
    console.log('  seed "' + s + '":');
    for (const item of sug) {
      console.log('    - ' + item);
      uniq.set(item.toLowerCase(), item);
    }
  }
}
