// Sursa UNICA pentru anul afisat in <title>.
//
// Regula (decizie user 2026-07-20): anul se pune DOAR in <title>, NICIODATA in <h1>.
// Motivul e operational: la trecerea in 2027 schimbam o singura linie aici si se
// propaga in toate titlurile, fara sa atingem continutul niciunui articol.
//
// Constanta e MANUALA, nu derivata din data curenta, ca sa n-o ia titlurile inaintea
// continutului: o urcam deliberat cand chiar am improspatat selectiile de produse.
export const SEO_YEAR = 2026;

// Folosire intr-un articol nou:
//   ---
//   import { SEO_YEAR } from '../lib/seo.mjs';
//   ---
//   <Layout title={`Cele mai bune espressoare manuale in ${SEO_YEAR}: presiune, portafiltru si cat conteaza rasnita`}>
//     <h1>Cele mai bune espressoare manuale pentru cafea ca la bar</h1>
//                                                   ^ fara an, niciodata
