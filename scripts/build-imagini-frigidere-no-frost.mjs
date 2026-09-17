// Ad-hoc: genereaza hero + 3 figuri pentru articolul frigidere No Frost (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  beko375: 'frigider-cu-doua-usi-beko-rdnt401e30zxbn-375-l-clasa-f-neofrost-dual-c-d2s36dmbm.webp',
  samsung348: 'frigider-cu-doua-usi-samsung-rt35cg5644s9eo-348-l-no-frost-all-around-d2pqq3ybm.webp',
  beko406: 'frigider-cu-doua-usi-beko-rdne455k30zxbn-406-l-no-frost-everfresh-clas-dk5gq3mbm.webp',
  samsung393: 'frigider-cu-doua-usi-samsung-rt38cg6624s9eo-393-l-no-frost-all-around-dypqq3ybm.webp',
  beko477: 'frigider-cu-doua-usi-beko-b5rdne504lxbr-477-l-no-frost-harvestfresh-ev-dv5641mbm.webp',
  lg461: 'frigider-cu-doua-usi-lg-gtbv44sebkd-461-l-no-frost-linear-cooling-disp-dqx1cvybm.webp',
  samsung462: 'frigider-cu-doua-usi-samsung-rt47cg6726b1eo-462-l-clasa-e-no-frost-doz-ddpr4bybm.webp',
  lg509: 'frigider-cu-doua-usi-lg-gtf744blped-509-l-total-no-frost-linearcooling-dcs45fybm.webp',
  samsung585: 'frigider-cu-doua-usi-samsung-rt58k710rsl-eo-585-l-no-frost-smart-thing-dbczbhybm.webp',
  beko365: 'frigider-cu-o-usa-beko-b1rmlne444xb-365-l-no-frost-aeroflow-iluminare-d0dbcdybm.webp',
  tesla362: 'frigider-cu-o-usa-tesla-rs3600fm-362-l-clasa-e-total-no-frost-display-dc70hhybm.webp',
  heinner362: 'frigider-cu-o-usa-heinner-hf-m362nfe-362-l-clasa-e-no-frost-display-co-dvgd183bm.webp',
};

// HERO: doua corpuri INCHISE pt cutout curat. Beko 477 l gri inchis (ancora, 35 pareri) + LG 509 l negru.
const hero = A('cele-mai-bune-frigidere-no-frost.webp');
await buildHero3({ products: [P(img.beko477), P(img.lg509)], out: hero, seed: 'frigidere-nf-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: combine familie
const f1 = await buildFigure3({
  out: A('frigidere-nf-familie.webp'), seed: 'frigidere-nf-familie', title: 'Combine No Frost, pentru familie (348-406 l)',
  items: [
    { img: P(img.beko375), label: 'Beko 375 l, NeoFrost Dual', sub: '3570 lei' },
    { img: P(img.samsung348), label: 'Samsung 348 l, latime 60 cm', sub: '3570 lei' },
    { img: P(img.beko406), label: 'Beko 406 l, ProSmart Inverter', sub: '3628 lei' },
  ], avoid: ['spec', 'split', 'float'],
});
console.log('fig1', f1.layout);

// FIG 2: combine mari
const f2 = await buildFigure3({
  out: A('frigidere-nf-mari.webp'), seed: 'frigidere-nf-mari', title: 'Combine No Frost, mari (461-585 l)',
  items: [
    { img: P(img.beko477), label: 'Beko 477 l, cel mai notat', sub: '3229 lei' },
    { img: P(img.samsung462), label: 'Samsung 462 l, dozator apa', sub: '5300 lei' },
    { img: P(img.samsung585), label: 'Samsung 585 l, Twin Cooling', sub: '4500 lei' },
  ], avoid: ['spec', 'split', 'float', f1.layout],
});
console.log('fig2', f2.layout);

// FIG 3: cu o usa, fara congelator. Tesla+Heinner sunt ALBE -> layout `fan` (carduri albe cu umbra),
// altfel se mananca pe fundal deschis (lectie hero: alb-pe-alb dispare). seed pe tema cu contrast.
const f3 = await buildFigure3({
  out: A('frigidere-nf-o-usa.webp'), seed: 'frigidere-nf-single', title: 'Cu o usa, fara congelator (362-365 l)',
  layout: 'fan',
  items: [
    { img: P(img.beko365), label: 'Beko 365 l, 143 kWh', sub: '2800 lei' },
    { img: P(img.tesla362), label: 'Tesla 362 l, cel mai ieftin', sub: '1867 lei' },
    { img: P(img.heinner362), label: 'Heinner 362 l', sub: '2175 lei' },
  ],
});
console.log('fig3', f3.layout);
