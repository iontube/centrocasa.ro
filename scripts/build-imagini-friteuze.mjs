// Ad-hoc: genereaza hero + 3 figuri pentru articolul friteuze cu aer cald (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  tefalUltra: 'friteuza-cu-aer-cald-tefal-ultra-fry-digital-ey111b15-1630-w-8-program-dbj6zpmbm.webp',
  starlight: 'friteuza-fara-ulei-star-light-airfryer-dafb-2613bl-1300w-2-6l-control-d6hf3rbbm.webp',
  xiaomi: 'friteuza-cu-aer-cald-xiaomi-mi-smart-air-fryer-bhr4849eu-1500w-3-5l-8-dx04wpmbm.webp',
  cosori: 'friteuza-cu-aer-cald-fara-ulei-cosori-air-fryer-ecran-digital-11-funct-dj7jrmmbm.webp',
  tefalMax: 'friteuza-cu-aer-cald-tefal-easy-fry-max-air-fryer-ey245310-1500-w-capa-dlby1yybm.webp',
  airnova: 'air-fryer-airnova-nanofritto-1450w-capacitate-4-8l-friteuza-cu-aer-cal-d1lc5t2bm.webp',
  lehmannSante: 'friteuza-cu-aer-cald-fara-ulei-lehmann-sante-6l-1500w-airfryer-digital-dz9lt0ybm.webp',
  tefalMega: 'friteuza-cu-aer-cald-tefal-easy-fry-mega-air-fryer-ey855d10-2020w-capa-d6q0rb2bm.webp',
  tefalGrill: 'friteuza-cu-aer-cald-tefal-easyfry-grill-xxl-air-fryer-ey801815-1830w-dfbq0lmbm.webp',
  lehmannAromato: 'friteuza-cu-aer-cald-fara-ulei-lehmann-aromato-airfryer-1800w-10l-wi-f-dp600qybm.webp',
  ninja: 'friteuza-cu-aer-cald-ninja-foodi-dualzone-af400-9-5l-2470w-6-functii-d-dmnk1smbm.webp',
  philips: 'friteuza-cu-aer-cald-philips-airfryer-essential-collection-hd9270-90-c-dfvstjmbm.webp',
};

// HERO: cea mai vanduta in fata + Ninja mare in spate. Corp solid inchis pt cutout.
const hero = A('cele-mai-bune-friteuze-cu-aer-cald.webp');
await buildHero3({ products: [P(img.tefalUltra), P(img.ninja)], out: hero, seed: 'friteuze-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: compacte 1-2 persoane
const f1 = await buildFigure3({
  out: A('friteuze-compacte.webp'), seed: 'friteuze-compacte', title: 'Compacte, pentru 1-2 persoane',
  items: [
    { img: P(img.tefalUltra), label: 'Tefal Ultra Fry, 4.2 l', sub: '475 lei' },
    { img: P(img.starlight), label: 'Star-Light, 2.6 l', sub: '240 lei' },
    { img: P(img.xiaomi), label: 'Xiaomi Mi Smart, 3.5 l', sub: '634 lei' },
  ], avoid: [],
});
console.log('fig1', f1.layout);

// FIG 2: familie 4.5-6 l
const f2 = await buildFigure3({
  out: A('friteuze-familie.webp'), seed: 'friteuze-familie', title: 'Familie, intre 4.5 si 6 litri',
  items: [
    { img: P(img.cosori), label: 'Cosori Air Fryer', sub: '549 lei' },
    { img: P(img.tefalMax), label: 'Tefal Easy Fry Max, 5 l', sub: '359 lei' },
    { img: P(img.lehmannSante), label: 'Lehmann Sante, 6 l', sub: '260 lei' },
  ], avoid: [f1.layout],
});
console.log('fig2', f2.layout);

// FIG 3: mari si cu 2 cuve
const f3 = await buildFigure3({
  out: A('friteuze-mari.webp'), seed: 'friteuze-mari', title: 'Mari si cu doua cuve, peste 6.5 l',
  items: [
    { img: P(img.tefalMega), label: 'Tefal Easy Fry Mega, 7.5 l', sub: '500 lei' },
    { img: P(img.ninja), label: 'Ninja DualZone, 2 cuve 9.5 l', sub: '1400 lei' },
    { img: P(img.lehmannAromato), label: 'Lehmann Aromato, 10 l', sub: '270 lei' },
  ], avoid: [f1.layout, f2.layout],
});
console.log('fig3', f3.layout);
