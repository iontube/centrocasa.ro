// Ad-hoc: genereaza hero + 3 figuri pentru articolul congelatoare (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  starcrest63: 'congelator-starcrest-suf-63wh-clasa-e-capacitate-63-l-3-sertare-h-82-5-dc92j4ybm.webp',
  candy64: 'congelator-candy-cctus-482whn-64-l-3-sertare-clasa-f-h-85-cm-alb-d03bxkmbm.webp',
  heinner91: 'congelator-heinner-hff-hm91e-91-l-4-sertare-clasa-e-control-mecanic-h-dcd18sybm.webp',
  heinner103: 'congelator-heinner-hff-v102e-103-l-3-sertare-clasa-e-control-mecanic-h-ddpb7fybm.webp',
  starcrest160: 'congelator-starcrest-suf-160si-160-l-clasa-e-5-sertare-termostat-ajust-dksffyybm.webp',
  arctic168: 'congelator-arctic-ac54210m40w-6-sertare-168-l-clasa-e-h-135-7-cm-alb-ddl81nybm.webp',
  heinner188: 'congelator-heinner-hff-v188e-188-l-6-sertare-clasa-e-control-mecanic-h-dnpb7fybm.webp',
  heinner194: 'congelator-heinner-hff-n194nff-194-l-clasa-f-full-no-frost-display-con-drcq17mbm.webp',
  ldk238: 'congelator-ldk-2617d-nf-ix-238-l-clasa-f-no-frost-7-sertare-control-to-dm2vy9bbm.webp',
  tesla273: 'congelator-tesla-ru2700fm-273-l-total-no-frost-clasa-e-functie-frigide-d070hhybm.webp',
  beko286: 'congelator-beko-b3rfne314w-286-l-no-frost-5-sertare-3-compartimente-co-d3hgh1mbm.webp',
  beko404: 'congelator-beko-rfne448e41xb-404-l-clasa-e-no-frost-display-led-h-191-db4wz7mbm.webp',
};

// HERO: doua congelatoare ARGINTII (corp solid, cutout curat - fara alb-pe-alb).
// Beko 404 l (ancora, 97 pareri) mare + STARCREST 160 l mediu.
const hero = A('cele-mai-bune-congelatoare.webp');
await buildHero3({ products: [P(img.beko404), P(img.starcrest160)], out: hero, seed: 'congelatoare-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: compacte, sub blat
const f1 = await buildFigure3({
  out: A('congelatoare-compacte.webp'), seed: 'congelatoare-compacte', title: 'Compacte, sub blat (60-103 l)',
  items: [
    { img: P(img.starcrest63), label: 'STARCREST 63 l', sub: '770 lei' },
    { img: P(img.candy64), label: 'Candy 64 l, latime 48 cm', sub: '792 lei' },
    { img: P(img.heinner103), label: 'Heinner 103 l', sub: '918 lei' },
  ], avoid: ['spec', 'split', 'float'],
});
console.log('fig1', f1.layout);

// FIG 2: medii, statice, pentru familie
const f2 = await buildFigure3({
  out: A('congelatoare-medii.webp'), seed: 'congelatoare-medii', title: 'Medii, statice, pentru familie (160-188 l)',
  items: [
    { img: P(img.starcrest160), label: 'STARCREST 160 l', sub: '1350 lei' },
    { img: P(img.arctic168), label: 'Arctic 168 l, Fast Freeze', sub: '1349 lei' },
    { img: P(img.heinner188), label: 'Heinner 188 l, 6 sertare', sub: '1398 lei' },
  ], avoid: ['spec', 'split', 'float', f1.layout],
});
console.log('fig2', f2.layout);

// FIG 3: mari & No Frost
const f3 = await buildFigure3({
  out: A('congelatoare-no-frost.webp'), seed: 'congelatoare-no-frost', title: 'Mari si No Frost (238-404 l)',
  items: [
    { img: P(img.ldk238), label: 'LDK 238 l, convertibil', sub: '2000 lei' },
    { img: P(img.beko286), label: 'Beko 286 l, Inverter', sub: '2677 lei' },
    { img: P(img.beko404), label: 'Beko 404 l, cel mai vandut', sub: '3175 lei' },
  ], avoid: ['spec', 'split', 'float', f1.layout, f2.layout],
});
console.log('fig3', f3.layout);
