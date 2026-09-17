import { buildHeroV2 } from './hero2.mjs';
import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const F=s=>P+s+'.webp';
await buildHeroV2({products:[
  F('hota-decorativa-heinner-hdch-md60tix-60cm-design-t-shape-800-m-h-4-tre-dnq0pf3bm'),
  F('hota-incorporabila-decorativa-turbionaire-tev60wb-putere-de-absorbtie-d2k6lzybm'),
], out:'public/images/articles/hota-pentru-bucatarie-puternica.webp', seed:'hota-pentru-bucatarie-puternica'});
const incorp=[
  {img:F('hota-incorporabila-turbionaire-thea-th50rcb-putere-de-absorbtie-800-mc-d06c7lmbm'),label:'Turbionaire Thea',sub:'48 pareri'},
  {img:F('hota-telescopica-incorporabila-tornado-storm-1200-60-1-motor-latime-60-dth9clbbm'),label:'Tornado telescopica',sub:'1200 m³/h'},
  {img:F('hota-de-bucatarie-kb-elements-60cm-putere-1350-m-h-motor-bldc-auto-cur-dk4sln3bm'),label:'KB-Elements',sub:'1300 m³/h'},
  {img:F('hota-incorporabila-delux-900m3-h-putere-de-absorbtie-motor-dublu-turbo-d4m2shybm'),label:'DeLux 900',sub:'accesibila'},
];
const decor=[
  {img:F('hota-decorativa-heinner-hdch-md60tix-60cm-design-t-shape-800-m-h-4-tre-dnq0pf3bm'),label:'Heinner T-shape',sub:'nota 4.8'},
  {img:F('hota-tip-cupola-violla-750-60-led-1-motor-turbo-latime-60-cm-3-viteze-dprt4lbbm'),label:'Tornado cupola',sub:'accesibila'},
  {img:F('hota-incorporabila-decorativa-turbionaire-thc90wps-putere-de-absorbtie-dwt6lzybm'),label:'Turbionaire 90cm',sub:'30 pareri'},
  {img:F('hota-incorporabila-decorativa-turbionaire-tev60wb-putere-de-absorbtie-d2k6lzybm'),label:'Turbionaire TEV',sub:'nota 4.84, 43 dB'},
];
const spec=[
  {img:F('hota-insula-turbionaire-dot35ib-putere-absorbtie-800-mc-h-motor-brushl-d76c7lmbm'),label:'Turbionaire insula',sub:'pentru insula'},
  {img:F('hota-inteligenta-florida-s9005-control-vocal-control-prin-gesturi-touc-d9zpl83bm'),label:'Florida smart',sub:'control vocal'},
  {img:F('hota-incorporabila-modul-touch-free-1200-60-1-motor-latime-60-cm-4-vit-dwv138bbm'),label:'Tornado Touch Free',sub:'1200 m³/h'},
  {img:F('hota-incorporabila-falmec-gruppoinc50-capacitate-absorbtie-800-mc-h-te-dlmrr3bbm'),label:'Falmec premium',sub:'top de gama'},
];
await buildFigure({items:incorp,caption:'Hote incorporabile si telescopice',out:'public/imagini/articole/hota-incorporabile.webp',theme:'teal',template:'cards',captionPos:'bottom'});
await buildFigure({items:decor,caption:'Hote decorative de perete',out:'public/imagini/articole/hota-decorative.webp',theme:'copper',template:'numbered',captionPos:'top'});
await buildFigure({items:spec,caption:'Hote de insula, smart si premium',out:'public/imagini/articole/hota-speciale.webp',theme:'slate',template:'spotlight',captionPos:'bottom'});
console.log('hero + 3 figuri hota generate');
