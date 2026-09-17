// Ad-hoc: genereaza hero + 3 figuri pentru articolul prajitoare de paine (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  philips2581: 'prajitor-de-paine-philips-hd2581-00-750-w-2-felii-8-setari-rumenire-gr-d6wtydbbm.webp',
  heinnerTasty: 'prajitor-de-paine-heinner-tasty-700bkrd-htp-700bkrd-2-felii-7-niveluri-dzc9vvmbm.webp',
  daewoo: 'prajitor-de-paine-daewoo-putere-700-w-functie-reincalzire-functie-deco-dcx60nbbm.webp',
  tefalVita: 'prajitor-de-paine-tefal-vita-tt1a1830-800w-2-felii-7-niveluri-de-rumen-ddtsjbmbm.webp',
  tefalSmart: 'prajitor-de-paine-tefal-smart-n-light-tt640810-850w-2-felii-ecran-digi-ds7g2mmbm.webp',
  philipsViva: 'prajitor-de-paine-philips-viva-collection-hd2582-90-900w-8-setari-de-r-d5wtydbbm.webp',
  biovitaElite: 'prajitor-de-paine-biovita-elite-4d-din-inox-1500w-6-trepte-afisaj-digi-d49lhh3bm.webp',
  biovitaClassic: 'prajitor-de-paine-cu-4-felii-biovita-classic-4-din-inox-1500w-6-trepte-d92kllmbm.webp',
  fram: 'prajitor-de-paine-fram-ftp-800bk-1600w-capacitate-4-felii-6-nivele-de-d2pdxxmbm.webp',
};

// HERO: cel mai vandut in fata + unul inox de 4 felii in spate.
const hero = A('cele-mai-bune-prajitoare-de-paine.webp');
await buildHero3({ products: [P(img.philips2581), P(img.biovitaClassic)], out: hero, seed: 'prajitoare-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: 2 felii accesibile
const f1 = await buildFigure3({
  out: A('prajitoare-accesibile.webp'), seed: 'prajitoare-accesibile', title: 'Cu 2 felii, accesibile',
  items: [
    { img: P(img.philips2581), label: 'Philips HD2581, 750 W', sub: '128 lei' },
    { img: P(img.heinnerTasty), label: 'Heinner Tasty 700', sub: '70 lei' },
    { img: P(img.daewoo), label: 'Daewoo, design retro', sub: '93 lei' },
  ], avoid: [],
});
console.log('fig1', f1.layout);

// FIG 2: 2 felii cu functii si inox
const f2 = await buildFigure3({
  out: A('prajitoare-functii.webp'), seed: 'prajitoare-functii', title: 'Cu functii si carcasa de inox',
  items: [
    { img: P(img.tefalSmart), label: 'Tefal Smart\'n Light', sub: '232 lei' },
    { img: P(img.philipsViva), label: 'Philips Viva, 900 W', sub: '100 lei' },
    { img: P(img.biovitaElite), label: 'Biovita ELITE, inox', sub: '215 lei' },
  ], avoid: [f1.layout, 'spec', 'split', 'float'],
});
console.log('fig2', f2.layout);

// FIG 3: 4 felii, familie
const f3 = await buildFigure3({
  out: A('prajitoare-patru-felii.webp'), seed: 'prajitoare-patru', title: 'Cu 4 felii, pentru familie',
  items: [
    { img: P(img.biovitaClassic), label: 'Biovita CLASSIC-4, inox', sub: '210 lei' },
    { img: P(img.fram), label: 'FRAM, 1600 W', sub: '167 lei' },
  ], avoid: [f1.layout, f2.layout, 'spec'],
});
console.log('fig3', f3.layout);
