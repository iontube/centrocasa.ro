// Ad-hoc: genereaza hero + 3 figuri pentru articolul blendere (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  heinnerMaster: 'blender-heinner-master-collection-hbl-1000xmc-1000-w-1-5-l-6-programe-dttp6mbbm.webp',
  heinner550: 'blender-heinner-hbl-550s-550-w-2-viteze-functie-pulse-bol-1-5-l-negru-dhpzvmbbm.webp',
  tefalBlendforce: 'blender-tefal-blendforce-2-bl420838-600-w-2-viteze-cutit-cu-4-lame-fun-d02vs9bbm.webp',
  biovitaForte: 'blender-biovita-forte-1200-cu-rasnita-1-5l-vas-din-sticla-3-programe-c-d91cjyybm.webp',
  nutribullet: 'blender-nutribullet-pro-nb907mab-900-w-1-viteza-5-accesorii-negru-dkw9zjybm.webp',
  biovitaLegend: 'blender-personal-biovita-legend-800-2-vase-x-0-6-l-putere-800w-inox-dnqj68bbm.webp',
  luxena: 'blender-portabil-fara-fir-luxena-6-lame-3d-inox-autocuratare-20-utiliz-d7bbd3ybm.webp',
  mixup: 'mini-blender-electric-mixup-pro-smartvibe-capacitate-500ml-6-lame-3d-r-d1qz3bybm.webp',
  tefalPerfect: 'blender-de-mare-viteza-tefal-perfectmix-bl811d38-1200w-1-75-l-buton-va-dt49snbbm.webp',
  seveshop: 'blender-profesional-2-in-1-seveshop-teendow-motor-puternic-1800w-blend-dp8xl83bm.webp',
};

// HERO: un blender de masa in fata + unul personal (adancime). Corp solid/inchis pt cutout curat.
const hero = A('cele-mai-bune-blendere.webp');
await buildHero3({ products: [P(img.heinnerMaster), P(img.nutribullet)], out: hero, seed: 'blendere-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: de masa cu bol
const f1 = await buildFigure3({
  out: A('blendere-de-masa.webp'), seed: 'blendere-masa', title: 'De masa, cu bol de 1.5 l',
  items: [
    { img: P(img.heinnerMaster), label: 'Heinner Master, 1000 W', sub: '288 lei' },
    { img: P(img.tefalBlendforce), label: 'Tefal BlendForce 2', sub: '230 lei' },
    { img: P(img.biovitaForte), label: 'Biovita FORTE, vas sticla', sub: '370 lei' },
  ], avoid: [],
});
console.log('fig1', f1.layout);

// FIG 2: personale to-go + portabile fara fir
const f2 = await buildFigure3({
  out: A('blendere-personale-portabile.webp'), seed: 'blendere-personale', title: 'Personale si portabile fara fir',
  items: [
    { img: P(img.nutribullet), label: 'Nutribullet Pro, cupa to-go', sub: '297 lei' },
    { img: P(img.biovitaLegend), label: 'Biovita Legend, 2 vase', sub: '195 lei' },
    { img: P(img.luxena), label: 'Luxena, reincarcabil', sub: '160 lei' },
  ], avoid: [f1.layout],
});
console.log('fig2', f2.layout);

// FIG 3: de mare viteza
const f3 = await buildFigure3({
  out: A('blendere-mare-viteza.webp'), seed: 'blendere-viteza', title: 'De mare viteza, peste 1200 W',
  items: [
    { img: P(img.tefalPerfect), label: 'Tefal PerfectMix+, 1200 W', sub: '481 lei' },
    { img: P(img.seveshop), label: 'SeveShop Teendow, 1800 W', sub: '430 lei' },
  ], avoid: [f1.layout, f2.layout],
});
console.log('fig3', f3.layout);
