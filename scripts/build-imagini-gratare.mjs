// Ad-hoc: genereaza hero + 3 figuri pentru articolul gratare electrice (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  optiGrill: 'gratar-electric-tefal-optigrill-gc717810-2000w-6-programe-de-gatire-au-d0tb0xybm.webp',
  optiXL: 'gratar-electric-tefal-optigrill-xl-gc727810-2000w-9-programe-de-gatire-dptb0xybm.webp',
  optiElite: 'gratar-electric-tefal-optigrill-elite-gc750d30-2000-w-12-programe-auto-dgd456bbm.webp',
  braun: 'gratar-electric-braun-multigrill-cg7044-2000w-3-moduri-de-gatire-2-zon-djplcgybm.webp',
  superGrill: 'gratar-electric-cu-timer-tefal-super-grill-gc451b12-2000-w-4-nivele-in-dtdv12bbm.webp',
  daewoo: 'grill-electric-daewoo-dg2500b-2400-w-placi-antiaderente-suprafata-de-g-d823v6bbm.webp',
  heinner: 'grill-electric-heinner-sunsetgrill-heg-k2000ss-2000w-placi-fixe-cu-inv-d7v84vmbm.webp',
  foreman: 'gratar-cu-picioare-george-foreman-2400w-negru-dbh91lbbm.webp',
  malaga: 'gratar-electric-tefal-malaga-cb503813-2000w-suprafata-de-gatire-xl-6-8-dzw967bbm.webp',
  plancha: 'gratar-electric-tefal-plancha-cb6a0830-2000-w-2-zone-de-gatit-suprafat-dpxpdzbbm.webp',
  opti4in1: 'gratar-electric-tefal-optigrill-4-in-1-gc774d30-2100-w-9-programe-auto-d2dqbwmbm.webp',
  ninja: 'gratar-si-afumator-electric-ninja-woodfire-og701eu-2400w-7-functii-de-dt1bb7ybm.webp',
};

// HERO: cel mai vandut cu senzor in fata + Ninja premium in spate.
const hero = A('cele-mai-bune-gratare-electrice.webp');
await buildHero3({ products: [P(img.optiGrill), P(img.ninja)], out: hero, seed: 'gratare-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: contact cu senzor automat
const f1 = await buildFigure3({
  out: A('gratare-senzor.webp'), seed: 'gratare-senzor', title: 'Cu senzor automat de gatire',
  items: [
    { img: P(img.optiGrill), label: 'Tefal OptiGrill+', sub: '680 lei' },
    { img: P(img.optiXL), label: 'OptiGrill+ XL, familie', sub: '820 lei' },
    { img: P(img.braun), label: 'Braun MultiGrill', sub: '650 lei' },
  ], avoid: ['spec', 'split', 'float'],
});
console.log('fig1', f1.layout);

// FIG 2: contact clasice cu termostat
const f2 = await buildFigure3({
  out: A('gratare-clasice.webp'), seed: 'gratare-clasice', title: 'Contact clasice, cu termostat',
  items: [
    { img: P(img.superGrill), label: 'Tefal Super Grill', sub: '631 lei' },
    { img: P(img.daewoo), label: 'Daewoo, 2400 W', sub: '279 lei' },
    { img: P(img.heinner), label: 'Heinner, cel mai ieftin', sub: '202 lei' },
  ], avoid: [f1.layout, 'spec', 'split', 'float'],
});
console.log('fig2', f2.layout);

// FIG 3: plancha si multifunctionale
const f3 = await buildFigure3({
  out: A('gratare-plancha.webp'), seed: 'gratare-plancha', title: 'Plancha si multifunctionale',
  items: [
    { img: P(img.malaga), label: 'Tefal Malaga, plancha XL', sub: '370 lei' },
    { img: P(img.plancha), label: 'Tefal Plancha, 2 zone', sub: '350 lei' },
    { img: P(img.ninja), label: 'Ninja Woodfire, cu afumator', sub: '2100 lei' },
  ], avoid: [f1.layout, f2.layout, 'spec', 'split', 'float'],
});
console.log('fig3', f3.layout);
