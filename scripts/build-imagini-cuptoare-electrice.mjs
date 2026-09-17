// Ad-hoc: hero + 3 figuri pentru articolul cuptoare electrice de blat (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  esperanza18: 'cuptor-convectie-esperanza-1400-w-18-l-alb-transparent-dq110nbbm.webp',
  albatros23: 'cuptor-electric-albatros-a23b2-23-litri-negru-drqpc3bbm.webp',
  floria30: 'cuptor-electric-rotund-floria-zln-9553-1300w-30l-dw2992mbm.webp',
  albatros35: 'cuptor-electric-albatros-a35w2-1500-w-35-l-alb-d539sybbm.webp',
  samus45brc: 'cuptor-electric-samus-csd-45brc2-45-l-2000-w-negru-dxsv27bbm.webp',
  zilan38: 'cuptor-electric-zilan-gusto-38-l-1500-w-temperatura-ajustabila-reglaj-dqp1b8bbm.webp',
  samus45: 'cuptor-electric-samus-cs-45b2-45l-d7vqg3bbm.webp',
  albatros50: 'cuptor-electric-albatros-a50brcl2-50l-2000w-negru-d6rpkvbbm.webp',
  samus60: 'cuptor-electric-samus-cs-60brc2-2200w-60l-termostat-reglabil-negru-d34zb7bbm.webp',
  albatros63: 'a63brc2-63-litri-2200-w-timer-functie-stay-on-6-functii-de-gatire-roti-dkg1r3bbm.webp',
  albatros63p: 'cuptor-electric-cu-plite-albatros-a63bprc2-63-litri-rotisor-convectie-d8qpc3bbm.webp',
  kumtel70: 'cuptor-electric-kumtel-lx-9645fa-pizza-rotisor-xxl-70-litri-2500-w-rot-dkqbyyybm.webp',
};

// HERO: corpuri inchise (cutout curat). Samus 45l (ancora, 128r) + Kumtel 70l (cel mai mare).
const hero = A('cele-mai-bune-cuptoare-electrice-de-blat.webp');
await buildHero3({ products: [P(img.samus45brc), P(img.kumtel70)], out: hero, seed: 'cuptor-elec-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: compacte (are produse albe -> fan cu carduri)
const f1 = await buildFigure3({
  out: A('cuptor-elec-compacte.webp'), seed: 'cuptor-elec-comp', title: 'Compacte (18-35 l)',
  layout: 'fan',
  items: [
    { img: P(img.esperanza18), label: 'Esperanza 18 l, convectie', sub: '293 lei' },
    { img: P(img.albatros23), label: 'Albatros 23 l', sub: '244 lei' },
    { img: P(img.albatros35), label: 'Albatros 35 l', sub: '262 lei' },
  ],
});
console.log('fig1', f1.layout);

// FIG 2: medii (negre -> podium)
const f2 = await buildFigure3({
  out: A('cuptor-elec-medii.webp'), seed: 'cuptor-elec-med', title: 'Medii (38-50 l)',
  layout: 'podium',
  items: [
    { img: P(img.samus45brc), label: 'Samus 45 l, cel mai vandut', sub: '484 lei' },
    { img: P(img.zilan38), label: 'Zilan 38 l, 320 grade', sub: '322 lei' },
    { img: P(img.albatros50), label: 'Albatros 50 l', sub: '388 lei' },
  ],
});
console.log('fig2', f2.layout);

// FIG 3: mari (negre -> numbered)
const f3 = await buildFigure3({
  out: A('cuptor-elec-mari.webp'), seed: 'cuptor-elec-mari', title: 'Mari (60-70 l)',
  layout: 'numbered',
  items: [
    { img: P(img.samus60), label: 'Samus 60 l', sub: '496 lei' },
    { img: P(img.albatros63p), label: 'Albatros 63 l, cu plite', sub: '514 lei' },
    { img: P(img.kumtel70), label: 'Kumtel 70 l, pizza+rotisor', sub: '800 lei' },
  ],
});
console.log('fig3', f3.layout);
