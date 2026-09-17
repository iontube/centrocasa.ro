import { buildHeroV2 } from './hero2.mjs';
import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const F=s=>P+s+'.webp';
await buildHeroV2({products:[
  F('ceas-de-perete-decorat-cu-licheni-naturali-stabilizati-40cm-multicolor-d02mbzmbm'),
  F('ceas-de-perete-supradimensionat-esperanza-san-marino-dj0cf7bbm'),
], out:'public/images/articles/ceas-de-perete-decorativ-mare.webp', seed:'ceas-de-perete-decorativ-mare'});
const mari=[
  {img:F('ceas-adeziv-pentru-perete-zola-3d-aspect-elegant-si-efect-de-oglinda-d-dr1qprmbm'),label:'Zola 3D adeziv',sub:'pana la 130 cm'},
  {img:F('ceas-de-perete-supradimensionat-esperanza-san-marino-dj0cf7bbm'),label:'Esperanza XXL',sub:'supradimensionat'},
  {img:F('ceas-de-perete-decorat-cu-licheni-naturali-stabilizati-40cm-multicolor-d02mbzmbm'),label:'Cu licheni naturali',sub:'40 cm, natural'},
];
const digi=[
  {img:F('ceas-digital-de-perete-cu-led-sdlogal-ecran-mare-de-16-inchi-cu-teleco-dkwfgpybm'),label:'SDLOGAL LED',sub:'100 pareri, 4.9'},
  {img:F('ceas-digital-de-perete-36x15cm-cu-led-rosu-calendar-termometru-si-alar-dhnwczmbm'),label:'LED 36 cm',sub:'calendar, termometru'},
  {img:F('ceas-digital-de-perete-cu-led-vienod-ecran-mare-cu-lumina-de-noapte-8-dvsv5xybm'),label:'Vienod LED',sub:'lumina de noapte'},
];
const clasic=[
  {img:F('ceas-analog-silentios-de-perete-cu-termometru-si-higrometru-digital-al-dwrgg9mbm'),label:'TFA cu statie',sub:'silentios'},
  {img:F('ceas-analog-silentios-de-perete-cu-capac-din-sticla-cifre-mari-negru-t-dhrgg9mbm'),label:'TFA cifre mari',sub:'nota 4.84'},
  {img:F('ceas-de-perete-zggzerg-cu-baterie-si-carlig-miscare-ultra-usoara-quart-dbm08tybm'),label:'Zggzerg 30 cm',sub:'quartz silentios'},
  {img:F('ceas-de-perete-esperanza-plastic-termometru-higrometru-26-x-5-cm-alb-drjh64ybm'),label:'Esperanza',sub:'157 pareri'},
];
await buildFigure({items:mari,caption:'Ceasuri mari, de efect',out:'public/imagini/articole/ceas-mari.webp',theme:'lavender',template:'cards',captionPos:'bottom'});
await buildFigure({items:digi,caption:'Ceasuri digitale cu LED',out:'public/imagini/articole/ceas-digitale.webp',theme:'terracotta',template:'numbered',captionPos:'top'});
await buildFigure({items:clasic,caption:'Ceasuri clasice si silentioase',out:'public/imagini/articole/ceas-clasice.webp',theme:'sage',template:'spotlight',captionPos:'bottom'});
console.log('hero + 3 figuri ceas generate');
