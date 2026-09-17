// Ad-hoc: hero + 3 figuri pentru articolul cuptoare cu microunde incorporabile (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  heinner25: 'cuptor-cu-microunde-incorporabil-heinner-hmw-25bigbk-25-l-900-w-grill-dbk6lvbbm.webp',
  heinner20: 'cuptor-cu-microunde-incorporabil-heinner-hmw-mdbi20gdbk-20l-control-di-dxlry13bm.webp',
  hansa: 'cuptor-cu-microunde-incorporabil-hansa-amg20bfh-20-l-700-w-grill-timer-dsx833bbm.webp',
  beko20: 'cuptor-cu-microunde-incorporabil-beko-bmob20202b-20-l-800-w-timer-meca-dv4f9xybm.webp',
  samsung22: 'cuptor-cu-microunde-incorporabil-samsung-mg22m8274at-e2-22-l-850-w-dez-dx3d54mbm.webp',
  beko25: 'cuptor-cu-microunde-incorporabil-beko-bmgb25333bg-25-l-900w-grill-negr-d642tjmbm.webp',
  heinner23: 'cuptor-cu-microunde-incorporabil-heinner-hmw-23bi-23-l-800-w-digital-g-dnqcl7bbm.webp',
  gorenje: 'cuptor-cu-microunde-gorenje-bm235cli-800w-23l-tehnologie-360stirtechno-d3bm9v3bm.webp',
  bosch554: 'cuptor-cu-microunde-incorporabil-bosch-bfl554mb0-25-l-900-w-autopilot-dmndjfbbm.webp',
  electrolux: 'cuptor-cu-microunde-incorporabil-electrolux-lms4253tmx-25-l-900-w-gril-d5h9tqbbm.webp',
  electrolux2: 'cuptor-cu-microunde-incorporabil-electrolux-emt25203oc-25-l-putere-900-d20jy6mbm.webp',
  boschS8: 'cuptor-cu-microunde-incorporabil-bosch-seria-8-bfl7221w1-21-l-900-w-au-ddwtp3ybm.webp',
};

// HERO: corpuri inchise (cutout curat). Samsung 22l (ancora, 83r) + Bosch BFL554 (premium, 50r).
const hero = A('cele-mai-bune-cuptoare-cu-microunde-incorporabile.webp');
await buildHero3({ products: [P(img.samsung22), P(img.bosch554)], out: hero, seed: 'micro-inco-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: accesibile (negre -> cutout ok, numbered)
const f1 = await buildFigure3({
  out: A('micro-inco-accesibile.webp'), seed: 'micro-inco-acc', title: 'Accesibile, sub 900 lei',
  layout: 'numbered',
  items: [
    { img: P(img.heinner25), label: 'Heinner 25 l, 900 W', sub: '715 lei' },
    { img: P(img.hansa), label: 'Hansa 20 l, grill', sub: '795 lei' },
    { img: P(img.heinner20), label: 'Heinner 20 l, digital', sub: '600 lei' },
  ],
});
console.log('fig1', f1.layout);

// FIG 2: echilibrate (negre -> podium)
const f2 = await buildFigure3({
  out: A('micro-inco-echilibrate.webp'), seed: 'micro-inco-ech', title: 'Echilibrate, de brand (900-1400 lei)',
  layout: 'podium',
  items: [
    { img: P(img.samsung22), label: 'Samsung 22 l, cel mai vandut', sub: '1000 lei' },
    { img: P(img.beko25), label: 'Beko 25 l, grill', sub: '1249 lei' },
    { img: P(img.gorenje), label: 'Gorenje 23 l, fara platou', sub: '1413 lei' },
  ],
});
console.log('fig2', f2.layout);

// FIG 3: premium (Bosch Seria 8 e ALB -> fan cu carduri)
const f3 = await buildFigure3({
  out: A('micro-inco-premium.webp'), seed: 'micro-inco-prem', title: 'Premium (1700+ lei)',
  layout: 'fan',
  items: [
    { img: P(img.bosch554), label: 'Bosch AutoPilot 7', sub: '1699 lei' },
    { img: P(img.electrolux), label: 'Electrolux 25 l', sub: '1977 lei' },
    { img: P(img.boschS8), label: 'Bosch Seria 8, autocuratare', sub: '3500 lei' },
  ],
});
console.log('fig3', f3.layout);
