// Ad-hoc: hero + 3 figuri pentru articolul frigidere minibar (v3).
// Grupele A si C au produse ALBE -> layout `fan` (carduri cu umbra). Grupa B (negru/rosu) e ok la cutout.
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  starcrest46: 'frigider-minibar-starcrest-smb-46whe-46-l-clasa-e-h-49-5-cm-alb-dpp0mgmbm.webp',
  heinner41: 'frigider-mini-bar-heinner-hmb-hm41e-41-l-clasa-e-h-51-cm-alb-ds20fvybm.webp',
  vivax: 'frigider-minibar-cu-o-usa-vivax-mf-45e-capacitate-43l-clasa-e-termosta-dm7760mbm.webp',
  samus: 'frigider-minibar-samus-sw064e-41-l-clasa-energetica-e-termostat-reglab-djf0dsybm.webp',
  mf46w: 'frigider-minibar-46l-clasa-f-mf46w-dc1fb0bbm.webp',
  vintage: 'frigider-minibar-starcrest-srmb-47bk-design-vintage-46-l-clasa-e-h-52-dwnkmdybm.webp',
  glass: 'frigider-minibar-starcrest-smb-47gls-bk-design-modern-46-l-clasa-e-h-4-db4t57ybm.webp',
  vortex: 'frigider-minibar-vortex-vm5srd04m-47-l-h-48-5-cm-clasa-f-rosu-d6p73vmbm.webp',
  heinner66: 'frigider-mini-bar-heinner-hmb-m66e-66-l-clasa-e-h-63-cm-alb-d6xtjt2bm.webp',
  tcl: 'frigider-minibar-tcl-rf045dwe0-45-l-control-mecanic-maner-retras-picio-dvmhtfybm.webp',
  arctic: 'frigider-minibar-arctic-at4746m4s-46-l-clasa-e-usi-reversibile-h-49-6-djz996ybm.webp',
  crown: 'mini-bar-crown-cm-68b-68-litri-racire-statica-f-negru-dg4hk1bbm.webp',
};

// HERO: corpuri inchise/colorate (cutout curat). STARCREST vintage negru (64r, cel mai vandut) + VORTEX rosu.
const hero = A('cele-mai-bune-frigidere-minibar.webp');
await buildHero3({ products: [P(img.vintage), P(img.vortex)], out: hero, seed: 'minibar-hero', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG 1: clasice accesibile (albe -> fan)
const f1 = await buildFigure3({
  out: A('minibar-clasice.webp'), seed: 'minibar-clasice', title: 'Clasice, cel mai bun raport (420-590 lei)',
  layout: 'fan',
  items: [
    { img: P(img.starcrest46), label: 'STARCREST 46 l, 58 pareri', sub: '500 lei' },
    { img: P(img.heinner41), label: 'Heinner 41 l', sub: '548 lei' },
    { img: P(img.samus), label: 'Samus 41 l, cel mai ieftin', sub: '425 lei' },
  ],
});
console.log('fig1', f1.layout);

// FIG 2: cu design (negru/rosu -> podium, cutout ok)
const f2 = await buildFigure3({
  out: A('minibar-design.webp'), seed: 'minibar-design', title: 'Cu design, pentru camera de zi',
  layout: 'podium',
  items: [
    { img: P(img.vintage), label: 'STARCREST Vintage', sub: '540 lei' },
    { img: P(img.glass), label: 'STARCREST usa sticla', sub: '540 lei' },
    { img: P(img.vortex), label: 'VORTEX rosu', sub: '500 lei' },
  ],
});
console.log('fig2', f2.layout);

// FIG 3: mai mari / note top (albe -> fan)
const f3 = await buildFigure3({
  out: A('minibar-mari.webp'), seed: 'minibar-mari', title: 'Mai mari sau cu note de top',
  layout: 'fan',
  items: [
    { img: P(img.heinner66), label: 'Heinner 66 l, No Frost', sub: '577 lei' },
    { img: P(img.tcl), label: 'TCL 45 l, nota 4.92', sub: '932 lei' },
    { img: P(img.crown), label: 'Crown 68 l, cel mai mare', sub: '1225 lei' },
  ],
});
console.log('fig3', f3.layout);
