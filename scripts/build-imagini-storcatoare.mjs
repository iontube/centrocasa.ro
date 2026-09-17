// Ad-hoc: genereaza hero + 3 figuri pentru articolul storcatoare (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  heinnerXF: 'storcator-de-fructe-si-legume-heinner-xf-1000ss-1000-w-recipient-suc-1-d4jjw2bbm.webp',
  tefalFruteli: 'storcator-de-fructe-si-legume-tefal-ze370138-frutelia-recipient-pulpa-dwppdzbbm.webp',
  heinner600: 'storcator-de-fructe-si-legume-heinner-hsf-600bk-600-w-recipient-suc-si-dl5hlvbbm.webp',
  philipsViva: 'storcator-de-fructe-si-legume-philips-viva-collection-hr1855-70-800-w-dglrlmbbm.webp',
  bosch: 'storcator-de-fructe-si-legume-bosch-mes25-alb-negru-dycx6bbbm.webp',
  latkon: 'storcator-de-fructe-si-legume-latkon-storcator-cu-presare-la-rece-2-vi-dd06syybm.webp',
  biovitaNutri: 'storcator-cu-presare-la-rece-biovita-nutrimax-cu-melc-sita-din-inox-15-d00fsjybm.webp',
  tefalJuiceo: 'storcator-de-fructe-si-legume-tefal-zc150838-juiceo-150-w-80-rpm-presa-dgppdzbbm.webp',
  biovitaSj: 'storcator-de-fructe-si-legume-cu-melc-biovita-sj5000-240-w-retete-bonu-dcntc2bbm.webp',
  tefalVita: 'storcator-de-citrice-tefal-vitapress-zp3001-25-w-filtru-dublu-pornire-dd6lzmbbm.webp',
  heinnerC160: 'storcator-de-citrice-heinner-c160ss-160w-0-24-l-sistem-anti-alunecare-d7kk4kbbm.webp',
  heinnerLimme: 'storcator-de-citrice-heinner-limme-c300ss-30w-500ml-2-conuri-filtru-du-dfdf9ymbm.webp',
};

// HERO: cel mai vandut centrifugal in fata + cel mai notat slow in spate.
const hero = A('cele-mai-bune-storcatoare.webp');
await buildHero3({ products: [P(img.heinnerXF), P(img.latkon)], out: hero, seed: 'storcatoare-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: centrifugale
const f1 = await buildFigure3({
  out: A('storcatoare-centrifugale.webp'), seed: 'storcatoare-centrif', title: 'Centrifugale, rapide',
  items: [
    { img: P(img.heinnerXF), label: 'Heinner XF-1000, 1000 W', sub: '234 lei' },
    { img: P(img.philipsViva), label: 'Philips Viva, 800 W', sub: '499 lei' },
    { img: P(img.bosch), label: 'Bosch MES25, 700 W', sub: '500 lei' },
  ], avoid: ['spec', 'split', 'float'],
});
console.log('fig1', f1.layout);

// FIG 2: presare la rece / slow
const f2 = await buildFigure3({
  out: A('storcatoare-presare-rece.webp'), seed: 'storcatoare-slow', title: 'Cu presare la rece, mai mult suc',
  items: [
    { img: P(img.latkon), label: 'Latkon, cel mai notat', sub: '520 lei' },
    { img: P(img.biovitaNutri), label: 'Biovita Nutrimax', sub: '450 lei' },
    { img: P(img.biovitaSj), label: 'Biovita cu melc, vertical', sub: '805 lei' },
  ], avoid: [f1.layout, 'spec', 'split', 'float'],
});
console.log('fig2', f2.layout);

// FIG 3: citrice
const f3 = await buildFigure3({
  out: A('storcatoare-citrice.webp'), seed: 'storcatoare-citrice', title: 'Storcatoare de citrice',
  items: [
    { img: P(img.tefalVita), label: 'Tefal VitaPress', sub: '110 lei' },
    { img: P(img.heinnerC160), label: 'Heinner C160, 160 W', sub: '180 lei' },
    { img: P(img.heinnerLimme), label: 'Heinner Limme, cel mai ieftin', sub: '69 lei' },
  ], avoid: [f1.layout, f2.layout, 'spec', 'split', 'float'],
});
console.log('fig3', f3.layout);
