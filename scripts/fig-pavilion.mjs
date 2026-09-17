import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const imperm=[
  {img:P+'cort-impermeabil-3x3-metri-cu-acoperis-4-2-kg-pavilion-impermeabil-str-d6lw5kmbm.webp',label:'Danubewd',sub:'impermeabil, 4.5'},
  {img:P+'cort-pavilion-3-x-3-m-impermiabil-pexor-forte-pliabil-cu-cadru-metalic-dddytn2bm.webp',label:'PEXOR Forte',sub:'nota 4.9'},
  {img:P+'cort-tip-pavilion-at-performance-3x3m-verde-prelata-impermeabila-pliab-dm56l8mbm.webp',label:'AT Performance',sub:'cel mai vandut'},
];
const pliabile=[
  {img:P+'cort-pavilion-3x3m-alb-pliabil-cadru-metal-pentru-curte-gradina-evenim-dn4tr6mbm.webp',label:'JRH alb 3x3',sub:'30 pareri'},
  {img:P+'pavilion-pliabil-3x3-m-pentru-exterior-cort-evenimente-cu-structura-me-d182zm2bm.webp',label:'OEM pliabil',sub:'nota 4.8'},
  {img:P+'cort-pavilion-flippy-gradina-300-x-300-cm-alb-dqp7ksbbm.webp',label:'Flippy 3x3',sub:'alb'},
];
const pereti=[
  {img:P+'cort-pavilion-gri-3x3-m-cu-pereti-laterali-si-ferestre-pentru-petrecer-d1qqn8mbm.webp',label:'Hessa cu pereti',sub:'ferestre'},
  {img:P+'cort-tip-pavilion-cu-3-pereti-laterali-structura-solida-otel-si-acoper-dy630jmbm.webp',label:'Sersimo 3 pereti',sub:'structura otel'},
  {img:P+'cort-de-gradina-quick-tent-procart-3-pereti-laterali-3x3x3-m-inaltime-dqwgrwmbm.webp',label:'PROCART quick',sub:'3 pereti'},
];
await buildFigure({items:imperm,caption:'Pavilioane impermeabile 3x3',out:'public/imagini/articole/pavilion-impermeabile.webp',theme:'forest',template:'cards',captionPos:'bottom'});
await buildFigure({items:pliabile,caption:'Pavilioane pliabile accesibile',out:'public/imagini/articole/pavilion-pliabile.webp',theme:'walnut',template:'numbered',captionPos:'top'});
await buildFigure({items:pereti,caption:'Pavilioane cu pereti laterali',out:'public/imagini/articole/pavilion-pereti.webp',theme:'autumn',template:'spotlight',captionPos:'bottom'});
console.log('3 figuri pavilion generate');
