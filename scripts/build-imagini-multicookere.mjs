// Ad-hoc: genereaza hero + 3 figuri pentru articolul multicookere (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  tefalOnePot: 'oala-sub-presiune-electrica-tefal-one-pot-cy505e30-1200w-capacitate-va-dfxpdzbbm.webp',
  airnova: 'multicooker-electric-airnova-gustovita-6l-1000w-oala-sub-presiune-60kp-dphdbj3bm.webp',
  crockExpress: 'multicooker-cu-gatire-sub-presiune-crock-pot-express-csc051x-1000-w-5-dt5l0vbbm.webp',
  moulinex: 'oala-sub-presiune-electrica-moulinex-ce505a10-one-pot-1200-w-6-l-25-de-d4cyl4mbm.webp',
  instantDuo: 'multicooker-instant-pot-duo-6qt-112-0182-01-eu-1000w-5-7l-13-programe-d3hp6b2bm.webp',
  tefalTurbo: 'oala-sub-presiune-electrica-tefal-turbo-cuisine-cy754130-1090w-4-8l-10-dxhktxmbm.webp',
  crockSlow: 'slow-cooker-crock-pot-sccprc507b-050-4-7-l-2-setari-gatit-vas-de-ceram-dc60rmbbm.webp',
  crockSlowBig: 'slow-cooker-crock-pot-csc063x-01-7-5-l-digital-vas-ceramica-capac-de-s-d41mrbmbm.webp',
  tefalFuzzy: 'multicooker-tefal-fuzzy-logic-rk705138-750w-5-l-12-programe-timer-alb-dy76qbbbm.webp',
  sphericook: 'multicooker-16in1-tefal-sphericook-rk745800-820w-capacitate-5l-panou-d-d89y22mbm.webp',
  xiaomiRice: 'aparat-multifunctional-de-gatit-orez-xiaomi-bhr7919eu-710w-capacitate-dy8rlfybm.webp',
  instantCrisp: 'combi-instant-pot-pro-crisp-8qt-140-0027-01-eu-multicooker-friteuza-8l-d7hp6b2bm.webp',
};

// HERO: cel mai vandut in fata + Instant Pot iconic in spate. Corp solid inox pt cutout.
const hero = A('cele-mai-bune-multicookere.webp');
await buildHero3({ products: [P(img.tefalOnePot), P(img.instantDuo)], out: hero, seed: 'multicookere-hero', mode: 'card' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: cu presiune
const f1 = await buildFigure3({
  out: A('multicookere-presiune.webp'), seed: 'multicookere-presiune', title: 'Cu presiune, gatesc rapid',
  items: [
    { img: P(img.tefalOnePot), label: 'Tefal One Pot, 5.8 l', sub: '544 lei' },
    { img: P(img.crockExpress), label: 'Crock-Pot Express', sub: '624 lei' },
    { img: P(img.instantDuo), label: 'Instant Pot Duo', sub: '581 lei' },
  ], avoid: [],
});
console.log('fig1', f1.layout);

// FIG 2: slow cooker
const f2 = await buildFigure3({
  out: A('multicookere-slow.webp'), seed: 'multicookere-slow', title: 'Slow cooker, gatire lenta la foc mic',
  items: [
    { img: P(img.crockSlow), label: 'Crock-Pot 4.7 l', sub: '290 lei' },
    { img: P(img.crockSlowBig), label: 'Crock-Pot 7.5 l, digital', sub: '438 lei' },
  ], avoid: [f1.layout],
});
console.log('fig2', f2.layout);

// FIG 3: fara presiune, multifunctionale si orez
const f3 = await buildFigure3({
  out: A('multicookere-multifunctionale.webp'), seed: 'multicookere-multi', title: 'Fara presiune, multifunctionale si orez',
  items: [
    { img: P(img.tefalFuzzy), label: 'Tefal Fuzzy Logic, 5 l', sub: '405 lei' },
    { img: P(img.xiaomiRice), label: 'Xiaomi, gatit orez', sub: '249 lei' },
    { img: P(img.instantCrisp), label: 'Instant Pot Pro Crisp, combi', sub: '945 lei' },
  ], avoid: [f1.layout, f2.layout],
});
console.log('fig3', f3.layout);
