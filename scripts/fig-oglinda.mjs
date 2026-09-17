import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const podea=[
  {img:P+'oglinda-de-podea-neagra-elindor-decorativa-verticala-dreptunghiulara-d-d5xgq6ybm.webp',label:'Elindor arcada',sub:'59 pareri'},
  {img:P+'oglinda-de-podea-aurie-elindor-decorativa-verticala-dreptunghiulara-de-db7pk03bm.webp',label:'Elindor semicerc',sub:'auriu, 165 cm'},
  {img:P+'oglinda-cu-picior-verticala-150x40cm-de-podea-perete-rama-bronz-forma-d2cm7xybm.webp',label:'Callena cu picior',sub:'rama bronz'},
  {img:P+'oglinda-de-podea-neagra-elindor-decorativa-dreptunghiulara-verticala-d-d1sj003bm.webp',label:'Elindor dreptunghi',sub:'cea mai ieftina'},
];
const perete=[
  {img:P+'oglinda-40cm-rotunda-de-perete-decorativa-decor-pentru-hol-dormitor-al-dd68m8mbm.webp',label:'Callena rotunda',sub:'40 cm, aurie'},
  {img:P+'oglinda-ovala-cu-rama-bronz-70x50cm-oglinda-de-perete-decorativa-pentr-d17l7w3bm.webp',label:'Callena ovala',sub:'rama bronz'},
  {img:P+'oglinda-cu-rama-din-lemn-alb-cu-cleme-de-fixare-atat-pe-vertical-cat-s-dj6z26mbm.webp',label:'Rama lemn',sub:'natural, alb'},
  {img:P+'oglinda-cristal-design-serpuita-onda-150-x-29-cm-d3fkxhmbm.webp',label:'ONDA serpuita',sub:'design deosebit'},
];
const seturi=[
  {img:P+'set-18-oglinzi-acrilice-decorative-autoadezive-davidami-concept-model-d1jzd6mbm.webp',label:'DAVIDAMI 18',sub:'autoadezive'},
  {img:P+'set-24-oglinzi-acrilice-autoadezive-luxer-model-hexagon-12-5x11x6-4-cm-d6y59qmbm.webp',label:'Luxer hexagon',sub:'24 bucati'},
  {img:P+'set-12-oglinzi-acrilice-autoadezive-luxer-model-valuri-19x17-cm-silver-dhz4lqmbm.webp',label:'Luxer valuri',sub:'12 bucati'},
  {img:P+'set-6-oglinzi-acrilice-decorative-autoadezive-davidami-concept-model-v-d4m0g5mbm.webp',label:'DAVIDAMI 6',sub:'accent mic'},
];
await buildFigure({items:podea,caption:'Oglinzi de podea decorative',out:'public/imagini/articole/oglinda-podea.webp',theme:'plum',template:'cards',captionPos:'bottom'});
await buildFigure({items:perete,caption:'Oglinzi de perete decorative',out:'public/imagini/articole/oglinda-perete.webp',theme:'teal',template:'numbered',captionPos:'top'});
await buildFigure({items:seturi,caption:'Seturi oglinzi acrilice autoadezive',out:'public/imagini/articole/oglinda-seturi.webp',theme:'sand',template:'spotlight',captionPos:'bottom'});
console.log('3 figuri oglinda generate');
