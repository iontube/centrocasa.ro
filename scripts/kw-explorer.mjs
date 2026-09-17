#!/usr/bin/env node
// Explorator de cerere reala: expandeaza seed-uri pe Google autosuggest RO
// (alfabet + modificatori) si scoreaza dupa semnale de cerere + intentie comerciala.
//
// Usage:
//   node scripts/kw-explorer.mjs "centrala termica" "calorifer" ...
//   node scripts/kw-explorer.mjs --file seeds.txt
//   node scripts/kw-explorer.mjs --json out.json "seed"
//
// Semnale colectate per termen:
//   depth   = de cate ori apare termenul in expansiuni diferite (cerere lata)
//   rank    = pozitia medie in listele suggest (mai mic = mai cautat)
//   roundup = "cel mai bun/cele mai bune <termen>" exista in suggest (intentie de comparatie)
//   pret    = "<termen> pret" exista (intentie comerciala)
//   facets  = sub-cererile (filtre) pe care le cere lumea -> sectiuni de articol

const SUGGEST = 'https://suggestqueries.google.com/complete/search';
const LETTERS = 'abcdefgilmnoprstuv'.split(''); // litere utile in RO
const MODS = ['cel mai bun', 'cele mai bune', 'cea mai buna', 'ce'];
const SUFFIX = ['pret', 'pentru', 'care', 'ieftin', 'cu'];

const sleep = ms => new Promise(r => setTimeout(r, ms));

// --- Clasificare fatete ---------------------------------------------------
// Retailerii detin SERP-ul pe query-urile cu numele lor; brandurile la fel pe
// paginile de model. Ce ramane (atribute, cazuri de folosire, probleme) = ce
// putem castiga cu un roundup.
const RETAILER = /\b(emag|altex|dedeman|carrefour|flanco|leroy|merlin|hornbach|lidl|kaufland|ikea|jysk|pepco|mediagalaxy|media galaxy|evomag|brico|arabesque|selgros|metro|olx|profi|auchan|penny|temu|shein|amazon)\b/i;
const BRAND = /\b(tefal|philips|bosch|samsung|lg|whirlpool|beko|arctic|heinner|electrolux|aeg|delonghi|krups|ninja|cosori|gorenje|zass|hausberg|ariston|vaillant|viessmann|immergas|buderus|baxi|motan|ferroli|protherm|imou|tapo|tp-link|xiaomi|ezviz|hikvision|dahua|reolink|genbolt|makita|bosch|einhell|stanley|dewalt|black|decker|karcher|rowenta|cecotec|tenda|sonoff|shelly|nedis|wolf|garten|husqvarna|stihl|ryobi|milwaukee|hecht|ruris|texas|kraft|dele|vonroc|lehmann|steinhaus|kanwod|procraft|raider|villager|skil|gardena|dyson|shark|deerma|dreame|ecovacs|roborock|tefal)\b/i;
const GEO = /\b(bucuresti|cluj|timisoara|iasi|constanta|brasov|craiova|sibiu|oradea|arad|galati|ploiesti|pitesti|romania|second hand|sh|rate|credit|magazin|montaj inclus|service|reparatii|piese|manual|instructiuni|schema|erori|eroare|cod)\b/i;

function classify(term, seedRe) {
  const t = term.toLowerCase();
  if (RETAILER.test(t)) return 'retailer';
  if (BRAND.test(t)) return 'brand';
  if (GEO.test(t)) return 'geo/service';
  const rest = t.replace(seedRe, '').trim();
  if (!rest) return 'head';
  return 'winnable';
}

async function suggest(q, tries = 3) {
  const url = `${SUGGEST}?client=firefox&hl=ro&gl=ro&q=${encodeURIComponent(q)}`;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      if (!r.ok) { await sleep(400 * (i + 1)); continue; }
      const arr = JSON.parse(await r.text());
      return Array.isArray(arr?.[1]) ? arr[1] : [];
    } catch { await sleep(400 * (i + 1)); }
  }
  return [];
}

// ruleaza cu concurenta limitata ca sa nu ne rate-limiteze Google
async function pool(items, fn, n = 5) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }));
  return out;
}

async function explore(seed) {
  const queries = [
    seed,
    ...LETTERS.map(l => `${seed} ${l}`),
    ...MODS.map(m => `${m} ${seed}`),
    ...SUFFIX.map(s => `${seed} ${s}`),
  ];

  const results = await pool(queries, async q => ({ q, sug: await suggest(q) }), 5);

  const terms = new Map(); // termen -> {depth, ranks[], from:Set}
  for (const { q, sug } of results) {
    sug.forEach((s, rank) => {
      const key = s.toLowerCase().trim();
      if (!terms.has(key)) terms.set(key, { term: s, depth: 0, ranks: [], from: new Set() });
      const t = terms.get(key);
      t.depth++;
      t.ranks.push(rank);
      t.from.add(q);
    });
  }

  const all = [...terms.values()].map(t => ({
    ...t,
    from: [...t.from],
    avgRank: t.ranks.reduce((a, b) => a + b, 0) / t.ranks.length,
  }));

  const has = re => all.some(t => re.test(t.term.toLowerCase()));
  const words = seed.split(/\s+/).filter(Boolean);
  const seedRe = new RegExp(words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*'), 'i');

  // termeni care contin seed-ul = varianta reala de cerere pe nisa
  const onTopic = all.filter(t => seedRe.test(t.term)).sort((a, b) => b.depth - a.depth || a.avgRank - b.avgRank);

  for (const t of onTopic) t.kind = classify(t.term, seedRe);
  const winnable = onTopic.filter(t => t.kind === 'winnable');

  return {
    seed,
    roundup: has(new RegExp(`(cel mai bun|cele mai bune|cea mai buna).*${words[0]}`, 'i')),
    pret: has(new RegExp(`${words[0]}.*pret`, 'i')),
    totalTerms: all.length,
    onTopic,
    winnable,
    // cat de "libera" e nisa: pondere fatete de atribut vs query-uri de retailer/brand
    freeShare: onTopic.length ? winnable.length / onTopic.length : 0,
    counts: ['winnable', 'retailer', 'brand', 'geo/service', 'head']
      .reduce((a, k) => (a[k] = onTopic.filter(t => t.kind === k).length, a), {}),
  };
}

const args = process.argv.slice(2);
let jsonOut = null;
const seeds = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--json') { jsonOut = args[++i]; continue; }
  if (args[i] === '--file') {
    const fs = await import('node:fs');
    seeds.push(...fs.readFileSync(args[++i], 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#')));
    continue;
  }
  seeds.push(args[i]);
}

const report = [];
for (const seed of seeds) {
  const r = await explore(seed);
  report.push(r);
  const flags = [r.roundup ? 'ROUNDUP✓' : 'roundup✗', r.pret ? 'PRET✓' : 'pret✗'].join(' ');
  const c = r.counts;
  console.log(`\n\x1b[1m### ${seed}\x1b[0m  ${flags}  liber=${(r.freeShare * 100).toFixed(0)}%  ` +
    `[winnable ${c.winnable} | retailer ${c.retailer} | brand ${c.brand} | service ${c['geo/service']}]`);
  for (const t of r.winnable.slice(0, 18)) {
    console.log(`   d=${String(t.depth).padStart(2)} r=${t.avgRank.toFixed(1).padStart(4)}  ${t.term}`);
  }
}

if (jsonOut) {
  const fs = await import('node:fs');
  fs.writeFileSync(jsonOut, JSON.stringify(report, null, 1));
  console.log(`\n-> ${jsonOut}`);
}
