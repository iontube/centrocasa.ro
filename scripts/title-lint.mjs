#!/usr/bin/env node
// Detecteaza derapajul spre SABLON in titluri si H1-uri.
// Titlurile lungi sunt bune pentru Google — dar doar daca extensia poarta informatie
// si difera de la articol la articol. Cand extensia se repeta (ca la topcumparator:
// ": pareri, recenzii, recomandari 2026" pe tot site-ul), devine template si isi pierde valoarea.
//
// Usage: node scripts/title-lint.mjs [--fix-list]

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/pages';
const SKIP = /^(index|contact|despre|cookies|privacy-policy|terms|sitemap|cum-testam)\.astro$/;

const CLISEE = [
  'care merita banii', 'de care ai nevoie', 'ghid complet', 'tot ce trebuie sa stii',
  'nu vei crede', 'secretul', 'revolutionar', 'face diferenta', 'game changer',
  'alegerea perfecta', 'solutia ideala', 'must have',
];

const files = readdirSync(DIR).filter(f => f.endsWith('.astro') && !SKIP.test(f));
const items = [];
for (const f of files) {
  const src = readFileSync(join(DIR, f), 'utf8');
  const title = (src.match(/title=["']([^"']+)["']/) || [])[1] || '';
  const h1 = ((src.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '').trim();
  if (title || h1) items.push({ file: f, title, h1 });
}

const norm = s => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

// --- n-grame repetate: semnalul principal de sablon -----------------------
function ngrams(list, n) {
  const m = new Map();
  for (const { file, s } of list) {
    const w = norm(s).split(' ');
    for (let i = 0; i + n <= w.length; i++) {
      const g = w.slice(i, i + n).join(' ');
      if (!m.has(g)) m.set(g, new Set());
      m.get(g).add(file);
    }
  }
  return [...m.entries()]
    .map(([g, f]) => ({ g, n: f.size }))
    .filter(x => x.n > 1)
    .sort((a, b) => b.n - a.n);
}

// extensia = ce urmeaza dupa ":" sau dupa termenul-cheie
const ext = s => {
  const i = s.indexOf(':');
  return i > -1 ? s.slice(i + 1).trim() : '';
};

const report = (label, list) => {
  console.log(`\n\x1b[1m=== ${label} (${list.length}) ===\x1b[0m`);

  // 1. n-grame repetate (ignoram capul "cele mai bune" care e intentionat)
  for (const n of [4, 3]) {
    const rep = ngrams(list, n)
      .filter(x => !/^(cele|cel|cea|cei) mai (bune|bun|buna|buni)/.test(x.g))
      .slice(0, 8);
    if (rep.length) {
      console.log(`  n-grame de ${n} cuvinte repetate:`);
      for (const r of rep) {
        const pct = ((r.n / list.length) * 100).toFixed(0);
        const flag = r.n >= list.length * 0.25 ? ' \x1b[31m<-- SABLON\x1b[0m' : '';
        console.log(`     ${String(r.n).padStart(3)}x (${pct}%)  "${r.g}"${flag}`);
      }
    }
  }

  // 2. cate au extensie deloc
  const fara = list.filter(x => !ext(x.s) && norm(x.s).split(' ').length <= 7);
  console.log(`  fara extensie / prea scurte: ${fara.length} (${((fara.length / list.length) * 100).toFixed(0)}%)`);

  // 3. primul cuvant din extensie — daca unul domina, e sablon structural
  const firsts = {};
  for (const x of list) {
    const e = norm(ext(x.s)).split(' ')[0];
    if (e) firsts[e] = (firsts[e] || 0) + 1;
  }
  const top = Object.entries(firsts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (top.length) console.log('  extensia incepe cu: ' + top.map(([w, n]) => `${w}(${n})`).join(', '));

  // 4. lungime
  const lens = list.map(x => x.s.length);
  const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
  console.log(`  lungime: medie ${avg.toFixed(0)} car, min ${Math.min(...lens)}, max ${Math.max(...lens)}`);

  // 5. clisee
  const cl = list.filter(x => CLISEE.some(c => norm(x.s).includes(c)));
  if (cl.length) console.log(`  \x1b[31mCLISEE: ${cl.length}\x1b[0m  ` + cl.slice(0, 4).map(x => x.file).join(', '));

  return { fara };
};

const T = items.filter(x => x.title).map(x => ({ file: x.file, s: x.title }));
const H = items.filter(x => x.h1).map(x => ({ file: x.file, s: x.h1 }));

report('TITLE', T);
const { fara } = report('H1', H);

// --- reguli pe an ---------------------------------------------------------
// Anul se pune DOAR in <title>, si DOAR prin SEO_YEAR (o schimbam intr-un
// singur loc la trecerea in 2027). In <h1> nu are ce cauta.
const YEAR = /\b20\d{2}\b/;
const anInH1 = H.filter(x => YEAR.test(x.s));
const anHardcodat = files.filter(f => {
  const src = readFileSync(join(DIR, f), 'utf8');
  const t = (src.match(/title=["']([^"']+)["']/) || [])[1] || '';
  return YEAR.test(t) && !/SEO_YEAR/.test(src);
});

console.log('\n\x1b[1m=== AN ===\x1b[0m');
console.log(`  an in <h1>: ${anInH1.length}  (tinta: 0 la articolele noi)`);
if (anInH1.length) console.log('     ' + anInH1.slice(0, 6).map(x => x.file.replace('.astro', '')).join(', ') + (anInH1.length > 6 ? ', ...' : ''));
console.log(`  an hardcodat in <title> (fara SEO_YEAR): ${anHardcodat.length}`);
if (anHardcodat.length) console.log('     ' + anHardcodat.slice(0, 6).map(f => f.replace('.astro', '')).join(', ') + (anHardcodat.length > 6 ? ', ...' : ''));
console.log('  \x1b[2m(cele 65 vechi raman asa — conteaza doar sa nu ADAUGI tipare noi)\x1b[0m');

if (process.argv.includes('--fix-list')) {
  console.log('\n\x1b[1m=== H1-uri de rescris (fara extensie) ===\x1b[0m');
  fara.forEach(x => console.log('  ' + x.file.replace('.astro', '') + '  ::  ' + x.s));
}
