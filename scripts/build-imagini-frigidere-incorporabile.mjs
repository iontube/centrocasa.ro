// Ad-hoc: hero + 3 figuri pentru articolul frigidere incorporabile (v3).
// TOATE produsele sunt ALBE (built-in) -> hero mode:'card' + figuri layout `fan` (carduri cu umbra),
// altfel alb-pe-alb dispare (lectia de la frigidere No Frost cu o usa).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  adler45: 'frigider-sub-blat-adler-ad-8096-capacitate-45-litri-reglare-a-racirii-dhkkpf3bm.webp',
  electrolux110: 'frigider-incorporabil-electrolux-lfb3ae82r-110-l-control-electronic-us-dcdj6zybm.webp',
  bomann118: 'mini-frigider-incorporabil-bomann-kse7810w-h-89-cm-volum-118-litri-con-dpthx4ybm.webp',
  bosch136: 'frigider-cu-o-usa-incorporabil-bosch-kir21vfe0-136-l-ecoairflow-ilumin-d1574zmbm.webp',
  beko175: 'frigider-cu-o-usa-incorporabil-beko-bssa300m4sn-175-l-usa-reversibila-drsk5kybm.webp',
  bosch204: 'frigider-cu-o-usa-incorporabil-bosch-kir41vfe0-204-l-ecoairflow-ilumin-dr574zmbm.webp',
  beko220k3: 'frigider-cu-doua-usi-incoporabil-beko-bdsa250k3sn-220-l-termostat-regl-dm2zc3mbm.webp',
  beko220k4: 'frigider-cu-doua-usi-incoporabil-beko-bdsa250k4sn-220-l-termostat-regl-dx0h3dybm.webp',
  bosch310v: 'frigider-incorporabil-cu-o-usa-bosch-kir81vfe0-310-l-freshsense-ilumin-d2s33tybm.webp',
  bosch310a: 'frigider-incorporabil-cu-o-usa-bosch-kir81add0-310-l-freshsense-ilumin-d7s33tybm.webp',
};

// HERO: produse ALBE -> mode 'card' (card alb pe fundal colorat). Beko 175 (cele mai multe pareri) + Bosch 310.
const hero = A('cele-mai-bune-frigidere-incorporabile.webp');
await buildHero3({ products: [P(img.beko175), P(img.bosch310v)], out: hero, seed: 'frig-inc-hero', mode: 'card' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: sub blat
const f1 = await buildFigure3({
  out: A('frig-inc-sub-blat.webp'), seed: 'frig-inc-single', title: 'Sub blat, pana in 90 cm (45-136 l)',
  layout: 'fan',
  items: [
    { img: P(img.adler45), label: 'Adler 45 l, cel mai mic', sub: '750 lei' },
    { img: P(img.bomann118), label: 'Bomann 118 l', sub: '1442 lei' },
    { img: P(img.bosch136), label: 'Bosch 136 l', sub: '2800 lei' },
  ],
});
console.log('fig1', f1.layout);

// FIG 2: medii, in coloana
const f2 = await buildFigure3({
  out: A('frig-inc-coloana.webp'), seed: 'frig-inc-larder', title: 'Medii, in coloana (175-220 l)',
  layout: 'fan',
  items: [
    { img: P(img.beko175), label: 'Beko 175 l, No Frost', sub: '1500 lei' },
    { img: P(img.bosch204), label: 'Bosch 204 l', sub: '2900 lei' },
    { img: P(img.beko220k3), label: 'Beko 220 l, combina', sub: '2541 lei' },
  ],
});
console.log('fig2', f2.layout);

// FIG 3: coloana inalta
const f3 = await buildFigure3({
  out: A('frig-inc-inalta.webp'), seed: 'frig-inc-ou-b', title: 'Coloana inalta, 177 cm (310 l)',
  layout: 'fan',
  items: [
    { img: P(img.bosch310v), label: 'Bosch 310 l, FreshSense', sub: '4000 lei' },
    { img: P(img.bosch310a), label: 'Bosch 310 l, VitaFresh', sub: '4761 lei' },
  ],
});
console.log('fig3', f3.layout);
