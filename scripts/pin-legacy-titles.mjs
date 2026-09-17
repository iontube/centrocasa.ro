#!/usr/bin/env node
// Pineaza slug-ul (=slugify titlu vechi, URL indexat) si seteaza titlul nou (din autosuggest) pt cele 37 legacy.
// NU atinge continutul .astro, NU scoate legacy:true. Doar keyword + slug in keywords.json.
import { readFileSync, writeFileSync } from 'node:fs';

const slugify = s => (s || '').toLowerCase()
  .replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i')
  .replace(/ș/g, 's').replace(/ț/g, 't')
  .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// map: titlu VECHI (keyword actual) -> titlu NOU (cerere reala autosuggest)
const MAP = {
  'aplica de perete pentru dormitor': 'Cele mai bune aplice de perete pentru dormitor',
  'cel mai bun robot de tuns iarba': 'Cel mai bun robot de tuns iarba fara fir perimetral',
  'balansoar de gradina pentru 2 persoane': 'Cele mai bune balansoare de gradina pentru 2 persoane',
  'masina de spalat rufe automata': 'Cele mai bune masini de spalat rufe automate',
  'lampadar modern pentru colt': 'Cele mai bune lampadare LED de colt',
  'aspirator cu spalare pentru covoare': 'Cele mai bune aspiratoare cu spalare pentru covoare si tapiterii',
  'sezlong pentru plaja si gradina': 'Cele mai bune sezlonguri pentru plaja si gradina',
  'masina de spalat vase incorporabila': 'Cele mai bune masini de spalat vase incorporabile',
  'veioza pentru noptiera': 'Cele mai bune veioze de noptiera',
  'mop cu aburi pentru podele': 'Cele mai bune mopuri cu aburi pentru podele',
  'robot de curatat geamuri': 'Cel mai bun robot de curatat geamuri',
  'motosapa electrica pentru gradina mica': 'Cea mai buna motosapa electrica pentru gradina mica',
  'fierastrau electric pentru lemne': 'Cel mai bun fierastrau electric pentru taiat lemne',
  'hamac cu suport pentru curte': 'Cele mai bune hamacuri cu suport pentru curte',
  'uscator de rufe cu pompa de caldura': 'Cele mai bune uscatoare de rufe cu pompa de caldura',
  'oglinda decorativa pentru hol': 'Cele mai bune oglinzi decorative pentru hol',
  'statie de calcat cu aburi': 'Cele mai bune statii de calcat cu aburi',
  'sistem de irigare automata pentru gradina': 'Cel mai bun sistem de irigare automata pentru gradina',
  'pavilion de gradina rezistent la apa': 'Cele mai bune pavilioane de gradina rezistente la vant si ploaie',
  'tocator de crengi pentru curte': 'Cel mai bun tocator de crengi pentru curte',
  'pergola din lemn pentru terasa': 'Cele mai bune pergole din lemn pentru terasa',
  'plita cu inductie pentru bucatarie': 'Cele mai bune plite cu inductie',
  'ceas de perete decorativ mare': 'Cele mai bune ceasuri de perete decorative',
  'hota pentru bucatarie puternica': 'Cele mai bune hote de bucatarie puternice',
  'scarificator pentru gazon': 'Cele mai bune scarificatoare pentru gazon',
  'copertina retractabila pentru terasa': 'Cele mai bune copertine retractabile pentru terasa',
  'covor modern pentru living': 'Cele mai bune covoare moderne pentru living',
  'aparat de curatat cu aburi': 'Cele mai bune aparate de curatat cu aburi',
  'masina de tuns gazonul electrica': 'Cele mai bune masini electrice de tuns gazonul',
  'banca de gradina din lemn masiv': 'Cele mai bune banci de gradina din lemn masiv',
  'espressor automat pentru acasa': 'Cel mai bun espressor automat pentru acasa',
  'perdele blackout pentru dormitor': 'Cele mai bune perdele blackout pentru dormitor',
  'detergent ecologic pentru casa': 'Cei mai buni detergenti ecologici pentru casa',
  'foarfeca electrica pentru gard viu': 'Cele mai bune foarfeci electrice pentru gard viu',
  'masa pliabila pentru camping': 'Cele mai bune mese pliabile pentru camping',
  'robot de bucatarie multifunctional': 'Cele mai bune robote de bucatarie multifunctionale',
  'draperii elegante pentru living': 'Cele mai bune draperii pentru living',
};

const path = new URL('../keywords.json', import.meta.url);
const k = JSON.parse(readFileSync(path));

let changed = 0;
const unmatched = [];
for (const it of k.completed) {
  if (!it.legacy) continue;
  const nou = MAP[it.keyword];
  if (!nou) { unmatched.push(it.keyword); continue; }
  const oldSlug = it.slug || slugify(it.keyword);   // slug = URL indexat existent
  // reordoneaza cheile ca sa apara slug langa keyword (cosmetic)
  it.slug = oldSlug;
  it.keyword = nou;
  changed++;
  console.log('  "' + nou + '"  <-  slug pastrat: ' + oldSlug);
}

if (unmatched.length) {
  console.error('\n!! Legacy fara mapare (NEATINSE): ' + unmatched.length);
  unmatched.forEach(x => console.error('   - ' + x));
}

// diacritice check pe titlurile noi
const diac = Object.values(MAP).filter(t => /[ăâîșțĂÂÎȘȚ]/.test(t));
if (diac.length) { console.error('!! DIACRITICE in titluri:', diac); process.exit(1); }

writeFileSync(path, JSON.stringify(k, null, 2) + '\n');
console.log('\nOK: ' + changed + ' titluri legacy actualizate, slug-uri pinuite, legacy:true pastrat.');
