// Ad-hoc: hero + 3 figuri pentru articolul cuptoare cu microunde de blat (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  samsungAlb: 'cuptor-cu-microunde-samsung-ms23k3513aw-ol-23-l-800-w-auto-cook-quick-d76c1jbbm.webp',
  samsungNegru: 'cuptor-cu-microunde-samsung-ms23k3513-23-l-digital-quick-defrost-800-w-d4z53jbbm.webp',
  daewooDig: 'cuptor-cu-microunde-daewoo-kor-6s2bw-20-litri-700-w-digital-alb-d8xs07bbm.webp',
  hansa: 'cuptor-cu-microunde-hansa-amg17m70vh-17-l-700-w-alb-e1yjkbbbm.webp',
  daewooMec: 'cuptor-cu-microunde-daewoo-kor-6s20k-1-20-l-700-w-mecanic-negru-d65yqdmbm.webp',
  toshibaMec: 'cuptor-cu-microunde-toshiba-mw-mm20pwh-20-l-800-w-timer-control-mecani-d97xp7mbm.webp',
  heinner20: 'cuptor-cu-microunde-heinner-hmw-md20msl-20-l-control-mecanic-700-w-arg-dzl0p4ybm.webp',
  samus: 'cuptor-cu-microunde-samus-smc-20mw1-20l-700w-dhy65nmbm.webp',
  samsungGrill: 'cuptor-cu-microunde-samsung-mg23k3515ak-ol-23l-800w-grill-negru-dc3qqsbbm.webp',
  toshibaGrill: 'cuptor-cu-microunde-toshiba-mw2-mg20pbk-20-l-800-w-grill-5-nivele-pute-d04sgmmbm.webp',
  heinner25: 'cuptor-cu-microunde-heinner-hmw-md25dbk-25-l-control-digital-900-w-neg-drl0p4ybm.webp',
  samsungGrillPrem: 'cuptor-cu-microunde-samsung-mg23f301tak-23-l-800-w-grill-digital-negru-ews6nbbbm.webp',
};

// HERO: doua corpuri NEGRE (cutout curat). Samsung MS23K3513 negru (576r, nota 4.81) + Samsung grill negru.
const hero = A('cele-mai-bune-cuptoare-cu-microunde.webp');
await buildHero3({ products: [P(img.samsungNegru), P(img.samsungGrill)], out: hero, seed: 'micro-liber-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: digitale (albe -> fan)
const f1 = await buildFigure3({
  out: A('micro-digitale.webp'), seed: 'micro-dig', title: 'Digitale, cel mai bun raport',
  layout: 'fan',
  items: [
    { img: P(img.samsungAlb), label: 'Samsung 23 l, cel mai vandut', sub: '480 lei' },
    { img: P(img.daewooDig), label: 'Daewoo 20 l, retro', sub: '356 lei' },
    { img: P(img.hansa), label: 'Hansa 17 l, compact', sub: '451 lei' },
  ],
});
console.log('fig1', f1.layout);

// FIG 2: mecanice (albe -> fan)
const f2 = await buildFigure3({
  out: A('micro-mecanice.webp'), seed: 'micro-mec', title: 'Mecanice, simple si ieftine',
  layout: 'fan',
  items: [
    { img: P(img.daewooMec), label: 'Daewoo 20 l, cel mai vandut mecanic', sub: '375 lei' },
    { img: P(img.toshibaMec), label: 'Toshiba 20 l, 800 W', sub: '349 lei' },
    { img: P(img.samus), label: 'Samus 20 l, cel mai ieftin', sub: '264 lei' },
  ],
});
console.log('fig2', f2.layout);

// FIG 3: cu grill sau mai mari (negre -> podium)
const f3 = await buildFigure3({
  out: A('micro-grill.webp'), seed: 'micro-grill', title: 'Cu grill sau mai mari',
  layout: 'podium',
  items: [
    { img: P(img.samsungGrill), label: 'Samsung 23 l, grill', sub: '550 lei' },
    { img: P(img.toshibaGrill), label: 'Toshiba 20 l, grill', sub: '412 lei' },
    { img: P(img.heinner25), label: 'Heinner 25 l, 900 W', sub: '388 lei' },
  ],
});
console.log('fig3', f3.layout);
