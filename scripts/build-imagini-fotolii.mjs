// Ad-hoc: genereaza hero + 3 figuri pentru articolul fotolii de masaj (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  relax1: 'fotoliu-masaj-topscaune-fotoliu-relaxare-cu-incalzire-masaj-8-puncte-s-d0j6fy2bm.webp',
  relax2: 'fotoliu-masaj-topscaune-fotoliu-relaxare-cu-functie-de-incalzire-spata-d0vb8w3bm.webp',
  lift: 'fotoliu-masaj-topscaune-fotoliu-electric-cu-ridicare-si-rabatare-autom-d9v6fy2bm.webp',
  quitus: 'fotoliu-masaj-top-scaune-quitus-scaun-masaj-functie-incalzire-bluetoot-ds3tj53bm.webp',
  gaius: 'fotoliu-masaj-topscaune-gaius-ultra-pro-comanda-vocala-ai-zero-gravity-dg68tj2bm.webp',
  mecha: 'fotoliu-masaj-topscaune-mecha-confort-airbag-complet-360-grade-zero-gr-dc68tj2bm.webp',
  ignius: 'fotoliu-masaj-topscaune-ignius-ai-voice-zero-gravity-sl-track-airbag-f-dwgsxk2bm.webp',
  severnius: 'fotoliu-masaj-topscaune-severnius-scaun-masaj-3d-scanare-corporala-aut-dhn3fw3bm.webp',
  maximus: 'fotoliu-masaj-topscaune-maximus-masaj-4d-cu-airbag-full-body-zero-grav-dfn3fw3bm.webp',
  vigos: 'fotoliu-masaj-topscaune-vigos-masaj-4d-cu-scanare-corporala-automata-z-dgydnk2bm.webp',
};

// HERO: un fotoliu premium in fata + unul in spate (adancime). Auto card/cutout.
const hero = A('cele-mai-bune-fotolii-de-masaj.webp');
await buildHero3({ products: [P(img.vigos), P(img.quitus)], out: hero, seed: 'fotolii-masaj-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: grupa buget (relaxare + lift)
const f1 = await buildFigure3({
  out: A('fotolii-masaj-relaxare.webp'), seed: 'fotolii-relaxare', title: 'Relaxare cu vibratii, sub 2300 lei',
  items: [
    { img: P(img.relax1), label: 'Relaxare cu incalzire', sub: '1849 lei' },
    { img: P(img.relax2), label: 'Spatar rabatabil', sub: '2039 lei' },
    { img: P(img.lift), label: 'Cu ridicare (lift)', sub: '2299 lei' },
  ], avoid: [],
});
console.log('fig1', f1.layout);

// FIG 2: grupa full-body intrare
const f2 = await buildFigure3({
  out: A('fotolii-masaj-fullbody.webp'), seed: 'fotolii-fullbody', title: 'Masaj cu role, de la 5400 lei',
  items: [
    { img: P(img.quitus), label: 'QUITUS, intrare', sub: '5399 lei' },
    { img: P(img.mecha), label: 'MECHA, 4D si SL-track', sub: '6599 lei' },
    { img: P(img.ignius), label: 'IGNIUS, AI Voice', sub: '7199 lei' },
  ], avoid: [f1.layout],
});
console.log('fig2', f2.layout);

// FIG 3: grupa premium 3D/4D
const f3 = await buildFigure3({
  out: A('fotolii-masaj-premium.webp'), seed: 'fotolii-premium', title: 'Premium 3D si 4D, cu scanare corporala',
  layout: 'heroList', // spec arata un singur produs; heroList le arata pe toate 3 cu etichete
  items: [
    { img: P(img.vigos), label: 'VIGOS, varf de gama', sub: '14279 lei' },
    { img: P(img.maximus), label: 'MAXIMUS, 4D', sub: '10789 lei' },
    { img: P(img.severnius), label: 'SEVERNIUS, 3D', sub: '8279 lei' },
  ], avoid: [f1.layout, f2.layout],
});
console.log('fig3', f3.layout);
console.log('gata');
