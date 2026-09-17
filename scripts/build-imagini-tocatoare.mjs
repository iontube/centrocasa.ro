// Ad-hoc: genereaza hero + 2 figuri pentru articolul tocatoare de legume (v3). 6 produse, 2 grupe.
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  bosch: 'tocator-bosch-mmr08r2-400-w-0-8-l-1-viteza-rosu-eprtnbbbm.webp',
  heinner1l: 'tocator-de-legume-heinner-hmc-k500whr-500w-1-l-2-cutite-din-inox-angre-dqsz22mbm.webp',
  latkon: 'tocator-electric-multifunctional-latkon-400w-2-viteze-2-boluri-1-2l-si-d388v4ybm.webp',
  heinner15: 'tocator-de-legume-heinner-hmc-k500bkr-bol-sticla-1-5l-3-cutite-din-ino-dzsz22mbm.webp',
  biovita: 'tocator-electric-pentru-legume-fructe-si-alimente-500w-1-5-litri-biovi-dpzkrtmbm.webp',
  sokany: 'tocator-electric-sokany-sk-7002a-700-w-4-lame-din-otel-inoxidabil-de-i-dd94tvmbm.webp',
};

// HERO: cel mai vandut (Bosch rosu) + unul cu bol de sticla mare.
const hero = A('cele-mai-bune-tocatoare-de-legume.webp');
await buildHero3({ products: [P(img.bosch), P(img.heinner15)], out: hero, seed: 'tocatoare-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: compacte (0.8-1.2 l)
const f1 = await buildFigure3({
  out: A('tocatoare-compacte.webp'), seed: 'tocatoare-compacte', title: 'Compacte, pentru cantitati mici',
  items: [
    { img: P(img.bosch), label: 'Bosch MMR08R2, 0.8 l', sub: '170 lei' },
    { img: P(img.heinner1l), label: 'Heinner, 1 l, bol sticla', sub: '110 lei' },
    { img: P(img.latkon), label: 'Latkon, cu 2 boluri', sub: '200 lei' },
  ], avoid: ['spec', 'split', 'float'],
});
console.log('fig1', f1.layout);

// FIG 2: cu bol mare (1.5-2 l)
const f2 = await buildFigure3({
  out: A('tocatoare-bol-mare.webp'), seed: 'tocatoare-mari', title: 'Cu bol mare, pentru mai mult odata',
  items: [
    { img: P(img.heinner15), label: 'Heinner, 1.5 l, 3 cutite', sub: '126 lei' },
    { img: P(img.biovita), label: 'Biovita, 1.5 l sticla', sub: '150 lei' },
    { img: P(img.sokany), label: 'Sokany, 2 l inox, 4 lame', sub: '65 lei' },
  ], avoid: [f1.layout, 'spec', 'split', 'float'],
});
console.log('fig2', f2.layout);
