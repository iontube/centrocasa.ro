// Ad-hoc: hero + 3 figuri pentru articolul cuptoare electrice incorporabile (v3).
import { buildHero3, buildResponsive } from './hero3.mjs';
import { buildFigure3 } from './figures3.mjs';
import { fileURLToPath } from 'node:url';

const P = s => fileURLToPath(new URL('../public/imagini/produse/' + s, import.meta.url));
const A = s => fileURLToPath(new URL('../public/imagini/articole/' + s, import.meta.url));

const img = {
  arctic1110: 'cuptor-incorporabil-arctic-arvie1110xd-electric-71-l-aerocooking-clasa-dplmzmybm.webp',
  heinner656: 'cuptor-incorporabil-heinner-hbo-v656g-ix-electric-72-l-6-functii-grill-d34xc2mbm.webp',
  arctic1130: 'cuptor-incorporabil-arctic-arvi1130bc-electric-71-l-autocuratare-catal-dj1q67ybm.webp',
  electroluxEOF5: 'cuptor-incorporabil-electrolux-eof5h40bx-electric-65-l-9-programe-conv-d553bcmbm.webp',
  hansa461: 'cuptor-incorporabil-hansa-boes68461-electric-62-l-steamcleaning-8-prog-dxl0g7bbm.webp',
  bosch133: 'cuptor-incorporabil-bosch-hbf133ba1-electric-66-l-grill-autocuratare-e-dy77m73bm.webp',
  zanussi: 'cuptor-incorporabil-zanussi-zob442xu-electric-57-l-clasa-a-grill-inox-d8p36jbbm.webp',
  electroluxEOD3H: 'cuptor-incorporabil-electrolux-eod3h50tx-electric-72l-grill-timer-stea-dpp9tqbbm.webp',
  hansa465: 'cuptor-incorporabil-hansa-boes68465-8-functii-grill-clasa-a-butoane-pu-dvz9bmbbm.webp',
  electroluxEOD3C: 'cuptor-incorporabil-eod3c70tk-electrolux-electric-72-l-autocuratare-ca-d9fcd0mbm.webp',
  bosch153: 'cuptor-incorporabil-bosch-hbf153bs0-electric-autocuratare-ecoclean-dir-dkdrp6bbm.webp',
  electroluxRustic: 'cuptor-incorporabil-rustic-electrolux-eoa5220aor-electric-multifunctio-dlzs47bbm.webp',
};

// HERO: doua corpuri contrastante (Bosch negru premium + Zanussi inox)
const hero = A('cele-mai-bune-cuptoare-electrice-incorporabile.webp');
await buildHero3({ products: [P(img.bosch153), P(img.zanussi)], out: hero, seed: 'cuptor-inco-hero-copper', mode: 'auto' });
await buildResponsive(hero, [1920, 1280, 960]);
console.log('hero OK');

// FIG A: accesibile
const fA = await buildFigure3({
  out: A('cuptor-inco-accesibile.webp'), seed: 'cuptor-inco-walnut', title: 'Accesibile, cu curatare catalitica',
  layout: 'fan',
  items: [
    { img: P(img.arctic1110), label: 'Arctic 71 l, cel mai ieftin', sub: '950 lei' },
    { img: P(img.arctic1130), label: 'Arctic 71 l, cel mai vandut', sub: '1099 lei' },
    { img: P(img.electroluxEOF5), label: 'Electrolux, AquaClean', sub: '1199 lei' },
  ],
});
console.log('figA', fA.layout);

// FIG B: echilibrate
const fB = await buildFigure3({
  out: A('cuptor-inco-echilibrate.webp'), seed: 'cuptor-inco-spruce', title: 'Echilibrate, brand si mai multe functii',
  layout: 'podium',
  items: [
    { img: P(img.bosch133), label: 'Bosch 66 l, EcoClean', sub: '1569 lei' },
    { img: P(img.zanussi), label: 'Zanussi 57 l, nota 4.75', sub: '1682 lei' },
    { img: P(img.electroluxEOD3H), label: 'Electrolux 72 l, grill', sub: '1799 lei' },
  ],
});
console.log('figB', fB.layout);

// FIG C: premium
const fC = await buildFigure3({
  out: A('cuptor-inco-premium.webp'), seed: 'cuptor-inco-rust', title: 'Premium, curatare avansata si design',
  layout: 'fan',
  items: [
    { img: P(img.electroluxEOD3C), label: 'Electrolux 72 l, premium', sub: '1999 lei' },
    { img: P(img.bosch153), label: 'Bosch 66 l, top', sub: '3570 lei' },
    { img: P(img.electroluxRustic), label: 'Electrolux rustic', sub: '3630 lei' },
  ],
});
console.log('figC', fC.layout);
