import { buildHeroV2 } from './hero2.mjs';
import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const F=s=>P+s+'.webp';
await buildHeroV2({products:[
  F('banca-de-gradina-emy-transilvan-pentru-2-persoane-lemn-masiv-125x81x45-d4mkj4ybm'),
  F('banca-de-gradina-kadax-cu-spatiu-de-depozitare-lemn-de-pin-120x47x81-5-dl7pckybm'),
], out:'public/images/articles/banca-de-gradina-din-lemn-masiv.webp', seed:'banca-de-gradina-din-lemn-masiv'});
const clasic=[
  {img:F('banca-de-gradina-emy-transilvan-pentru-2-persoane-lemn-masiv-125x81x45-d4mkj4ybm'),label:'Transilvan Emy',sub:'30 pareri, romanesc'},
  {img:F('banca-de-gradina-idealstore-garden-collections-spatar-cu-model-cadru-d-d5ktlwmbm'),label:'Ideal Store',sub:'cadru fier, 4.71'},
  {img:F('banca-de-gradina-lemn-structura-metal-123x54x77-cm-everild-d7bp8nmbm'),label:'Everild 3 locuri',sub:'lemn + metal'},
  {img:F('banca-gradina-heinner-dimensini-125x51x76-cm-metal-lemn-d5my5t3bm'),label:'Heinner 125cm',sub:'3 locuri'},
];
const depoz=[
  {img:F('banca-de-gradina-kadax-cu-spatiu-de-depozitare-lemn-de-pin-120x47x81-5-dl7pckybm'),label:'KADAX cu ladita',sub:'nota 4.89'},
  {img:F('banca-de-gradina-kadax-lemn-de-pin-albastru-d8m59vybm'),label:'KADAX pin',sub:'nota 4.89'},
  {img:F('banca-de-depozitare-lunga-vidaxl-maro-lemn-9-77-kg-241064-dhsy7gbbm'),label:'vidaXL depozitare',sub:'116 cm'},
];
const spec=[
  {img:F('banca-de-gradina-cu-perne-2-in-1-vidaxl-190-cm-lemn-masiv-de-acacia-17-dg2v0lbbm'),label:'vidaXL cu perne',sub:'acacia, 2in1'},
  {img:F('banca-de-gradina-pentru-copii-lemn-structura-metal-82x39x50-cm-jumanji-d6wbvbmbm'),label:'Pentru copii',sub:'82 cm'},
];
await buildFigure({items:clasic,caption:'Banci clasice din lemn',out:'public/imagini/articole/banca-clasice.webp',theme:'walnut',template:'cards',captionPos:'bottom'});
await buildFigure({items:depoz,caption:'Banci cu spatiu de depozitare',out:'public/imagini/articole/banca-depozitare.webp',theme:'sage',template:'numbered',captionPos:'top'});
await buildFigure({items:spec,caption:'Speciale: cu perne si pentru copii',out:'public/imagini/articole/banca-speciale.webp',theme:'copper',template:'spotlight',captionPos:'bottom'});
console.log('hero + 3 figuri banca generate');
