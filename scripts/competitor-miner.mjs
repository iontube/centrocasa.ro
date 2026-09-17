#!/usr/bin/env node
// Mineaza inventarele de articole ale competitorilor din nisa (site-uri de recenzii RO).
// Logica: ei au deja datele de volum. Un subiect acoperit de MAI MULTI competitori
// simultan = volum validat. Un subiect acoperit de unul singur = nisa.
//
// Usage: node scripts/competitor-miner.mjs [--json out.json]

const SITES = [
  'https://topbuyer.ro',
  'https://www.recenziidetop.ro',
  'https://bestbuyer.ro',
  'https://reviewbun.ro',
  'https://testamacasa.ro',
  'https://drdeco.ro',
  'https://topcumparator.ro',
  'https://electrobun.ro',
  'https://recenziibune.ro',
  'https://probado.ro',
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';

async function get(url, ms = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: ctrl.signal });
    return r.ok ? await r.text() : '';
  } catch { return ''; }
  finally { clearTimeout(t); }
}

const locs = xml => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]);

async function sitemapUrls(base) {
  // incearca robots.txt, apoi caile uzuale
  const robots = await get(`${base}/robots.txt`);
  let maps = [...robots.matchAll(/Sitemap:\s*(\S+)/gi)].map(m => m[1]);
  if (!maps.length) maps = [`${base}/sitemap_index.xml`, `${base}/sitemap.xml`];

  const out = new Set();
  for (const m of maps) {
    const xml = await get(m);
    if (!xml) continue;
    const inner = locs(xml);
    // index de sitemap-uri -> intra in fiecare (doar cele de postari/pagini)
    if (/<sitemapindex/i.test(xml)) {
      for (const sm of inner) {
        if (/(category|tag|author|attachment|image)/i.test(sm)) continue;
        locs(await get(sm)).forEach(u => out.add(u));
      }
    } else {
      inner.forEach(u => out.add(u));
    }
  }
  return [...out];
}

// scoate topicul din URL: "cel-mai-bun-aspirator-robot" -> "aspirator robot"
const STRIP = /^(cel|cea|cei|cele)-(mai)-(bun|buna|buni|bune)-/;
function topic(url) {
  let s = url.replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '').split('/').pop() || '';
  s = s.toLowerCase();
  if (!STRIP.test(s)) return null;          // pastram doar articolele de tip roundup
  s = s.replace(STRIP, '').replace(/-\d{4}$/, '').replace(/-/g, ' ').trim();
  return s.length > 2 ? s : null;
}

// nisa casa & gradina (excludem auto, telefoane, gaming, sport etc.)
const NICHE = /aspirator|masina de spalat|frigider|congelator|cuptor|plita|hota|espressor|cafea|blender|mixer|robot de bucatarie|friteuz|micround|prajitor|storcator|multicooker|fier de calcat|statie de calcat|mop|detergent|purificator|dezumidificator|umidificator|ventilator|aer conditionat|calorifer|convector|semineu|soba|centrala|boiler|pompa de caldura|termostat|panou solar|generator|saltea|pat |perna|pilota|lenjerie|canapea|canapele|fotoliu|dulap|noptier|comoda|birou|scaun|masa |masut|covor|perdea|perdele|draperi|jaluzel|rulou|oglind|ceas|tablou|lustra|lampa|lampadar|veioza|aplica|bec |banda led|ghirlanda|gradina|gazon|iarba|motocoas|motosap|drujba|fierastrau|tocator|scarificator|foarfec|gard viu|frunze|irigare|furtun|pompa|hidrofor|gratar|afumatoare|foisor|pergol|umbrela|sezlong|hamac|balansoar|pavilion|copertina|jardinier|piscina|cada|dus |chiuveta|baterie de|mobilier de baie|wc |vas de toaleta|usa|usi|fereastr|parchet|gresie|scara|bormasina|surubelnita|polizor|flex|sudura|compresor|nivela|trusa de scule|camera de supraveghere|yala|senzor|sonerie|interfon|alarma|priza|aspirator robot|mocheta|cuier|pantofar|biblioteca|raft|cutii de depozitare|organizator|cos de gunoi|scule|unelte|masina de tuns|tractoras|leagan|casuta|trambulina|cort|plasa de umbrire|dedurizator|filtru de apa/i;

const EXCLUDE = /telefon|laptop|tableta|casti|smartwatch|televizor|monitor|imprimanta|consola|masina auto|anvelop|ulei de motor|bicicleta|trotinet|parfum|creme|sampon|caine|pisic|acvariu|jucari|carucior|scutec|proteine|suplimente/i;

const run = async () => {
  const perSite = {};
  await Promise.all(SITES.map(async s => {
    const urls = await sitemapUrls(s);
    const topics = new Set();
    for (const u of urls) {
      const t = topic(u);
      if (t && NICHE.test(t) && !EXCLUDE.test(t)) topics.add(t);
    }
    perSite[s] = [...topics];
    console.error(`  ${s}: ${urls.length} url -> ${topics.size} pe nisa`);
  }));

  // agregare: topic -> ce site-uri il acopera
  const agg = new Map();
  for (const [site, topics] of Object.entries(perSite)) {
    for (const t of topics) {
      if (!agg.has(t)) agg.set(t, new Set());
      agg.get(t).add(site.replace(/^https?:\/\/(www\.)?/, ''));
    }
  }
  const rows = [...agg.entries()]
    .map(([t, sites]) => ({ topic: t, n: sites.size, sites: [...sites] }))
    .sort((a, b) => b.n - a.n || a.topic.localeCompare(b.topic));

  return { perSite, rows };
};

const { perSite, rows } = await run();
console.error(`\nTOTAL subiecte unice pe nisa: ${rows.length}`);

const jsonIdx = process.argv.indexOf('--json');
if (jsonIdx > -1) {
  const fs = await import('node:fs');
  fs.writeFileSync(process.argv[jsonIdx + 1], JSON.stringify({ perSite, rows }, null, 1));
  console.error(`-> ${process.argv[jsonIdx + 1]}`);
}
for (const r of rows) console.log(`${r.n}\t${r.topic}\t${r.sites.join(',')}`);
