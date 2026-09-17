// Ad-hoc: genereaza hero + 3 figuri pentru articolul mixere de mana (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  heinner: 'mixer-de-mana-heinner-white-orchid-hm-400whbk-400w-6-viteze-turbo-telu-dgjvlkmbm.webp',
  tefal: 'mixer-de-mana-tefal-quick-mix-ht310138-300w-5-viteze-functie-turbo-2-a-dbbf67bbm.webp',
  philips3705: 'mixer-de-mana-philips-hr3705-00-300-w-5-viteze-functie-turbo-paleta-la-dh29rsbbm.webp',
  hausberg: 'mixer-de-mana-hausberg-hb-4112rs-alb-rosu-250-w-7-viteze-d2x1bpmbm.webp',
  philipsViva: 'mixer-de-mana-philips-viva-collection-hr3740-00-450-w-5-viteze-functie-d2bkydbbm.webp',
  kdHome: 'mixer-de-mana-kd-home-powerwhisk-500-cutie-depozitare-500w-2000-rot-mi-ddz3c4ybm.webp',
  evoSmart: 'mixer-de-mana-evosmart-hm615-cutie-depozitare-600w-2400-rot-min-5-acce-dp57dg3bm.webp',
  latkon: 'mixer-de-mana-latkon-hmltk01-mixer-cu-putere-400w-6-viteze-functie-tur-dr5n6h3bm.webp',
  bosch36440: 'mixer-de-mana-bosch-mfq36440-450-w-5-viteze-turbo-pasator-vas-gradat-a-e8drkbbbm.webp',
  bosch40303: 'mixer-de-mana-bosch-mfq40303-500-w-5-viteze-turbo-rosu-ddycxmbbm.webp',
  bosch36480: 'mixer-de-mana-bosch-mfq36480-450-w-5-viteze-turbo-picior-pasator-inox-dxgfpmbbm.webp',
};

// HERO: cel mai vandut premium + cel mai vandut de brand.
const hero = A('cele-mai-bune-mixere-de-mana.webp');
await buildHero3({ products: [P(img.bosch36440), P(img.philipsViva)], out: hero, seed: 'mixere-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: accesibile
const f1 = await buildFigure3({
  out: A('mixere-accesibile.webp'), seed: 'mixere-acc', title: 'Accesibile, pentru orice bucatarie',
  items: [
    { img: P(img.heinner), label: 'Heinner White Orchid, 400 W', sub: '75 lei' },
    { img: P(img.tefal), label: 'Tefal Quick Mix', sub: '110 lei' },
    { img: P(img.philips3705), label: 'Philips HR3705', sub: '99 lei' },
  ], avoid: ['spec', 'split', 'float'],
});
console.log('fig1', f1.layout);

// FIG 2: echilibrate, bine notate
const f2 = await buildFigure3({
  out: A('mixere-echilibrate.webp'), seed: 'mixere-echil', title: 'Echilibrate, cu putere si accesorii',
  items: [
    { img: P(img.philipsViva), label: 'Philips Viva, cel mai vandut', sub: '130 lei' },
    { img: P(img.kdHome), label: 'KD Home PowerWhisk, 500 W', sub: '159 lei' },
    { img: P(img.evoSmart), label: 'EvoSmart HM615, 600 W', sub: '182 lei' },
  ], avoid: [f1.layout, 'spec', 'split', 'float'],
});
console.log('fig2', f2.layout);

// FIG 3: premium Bosch
const f3 = await buildFigure3({
  out: A('mixere-bosch.webp'), seed: 'mixere-bosch', title: 'Premium, de la Bosch',
  items: [
    { img: P(img.bosch36440), label: 'Bosch MFQ36440, cu pasator', sub: '280 lei' },
    { img: P(img.bosch40303), label: 'Bosch MFQ40303, 500 W', sub: '310 lei' },
    { img: P(img.bosch36480), label: 'Bosch MFQ36480, cu picior inox', sub: '371 lei' },
  ], avoid: [f1.layout, f2.layout, 'spec', 'split', 'float'],
});
console.log('fig3', f3.layout);
