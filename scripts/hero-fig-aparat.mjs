import { buildHeroV2 } from './hero2.mjs';
import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const F=s=>P+s+'.webp';
await buildHeroV2({products:[
  F('aparat-de-curat-cu-abur-xvapordeluxe-4146-ariete-1500-w-1-6-l-5-bari-a-dyrzbl3bm'),
  F('aparat-de-curatat-cu-abur-multifunctional-karcher-sc-3-easyfix-1900-w-d54cntybm'),
], out:'public/images/articles/aparat-de-curatat-cu-aburi.webp', seed:'aparat-de-curatat-cu-aburi'});
const multi=[
  {img:F('aparat-curatat-aburi-seveshop-sc-06-1200w-mop-cu-aburi-portabil-7-m-ca-dps6622bm'),label:'SeveShop SC-06',sub:'191 pareri, 4.87'},
  {img:F('aparat-de-curatat-cu-abur-multifunctional-karcher-sc-3-easyfix-1900-w-d54cntybm'),label:'Karcher SC3',sub:'1900 W, 1 L'},
  {img:F('aparat-de-curat-cu-abur-xvapordeluxe-4146-ariete-1500-w-1-6-l-5-bari-a-dyrzbl3bm'),label:'Ariete XvaporDeluxe',sub:'5 bar, 1.6 L'},
  {img:F('aparat-de-curatat-cu-abur-steam-it-pro-14-1-si-abur-de-mana-potrivit-p-d2svcpybm'),label:'STEAM-IT Pro',sub:'2000 W, nota 4.6'},
];
const mop=[
  {img:F('mop-cu-abur-rowenta-steam-power-ry6555wh-1200w-0-6l-filtru-anticalcar-dnbvs9bbm'),label:'Rowenta Steam',sub:'255 pareri'},
  {img:F('mop-cu-abur-karcher-sc-3-upright-easyfix-1600-w-rezervor-0-5-l-reglare-ds4cntybm'),label:'Karcher Upright',sub:'1600 W'},
  {img:F('mop-de-curatat-cu-aburi-steam-it-1300-w-incalzire-rapida-cu-10-accesor-dhhffnybm'),label:'STEAM-IT mop',sub:'10 accesorii'},
];
const mana=[
  {img:F('aparat-de-curatat-cu-abur-folixs-2500w-3-bar-rezervor-1600-ml-afisaj-d-dn7l18ybm'),label:'Folixs 2500W',sub:'afisaj, 3 bar'},
  {img:F('aparat-de-curatat-cu-abur-excitat-multifunctional-2500w-ecran-tactil-i-dhh9rfybm'),label:'Excitat 2500W',sub:'ecran tactil'},
  {img:F('aparat-de-curatat-cu-abur-cecotec-hydrosteam-1030-active-05515-presiun-dsn602ybm'),label:'Cecotec Hydro',sub:'cel mai ieftin'},
  {img:F('aparat-de-curatat-cu-abur-deerma-zq610-clasa-a-1700-w-230-l-alb-dmn573mbm'),label:'Deerma ZQ610',sub:'105 pareri'},
];
await buildFigure({items:multi,caption:'Aparate multifunctionale cu abur',out:'public/imagini/articole/aparat-multi.webp',theme:'clay',template:'cards',captionPos:'bottom'});
await buildFigure({items:mop,caption:'Mopuri cu aburi pentru pardoseli',out:'public/imagini/articole/aparat-mop.webp',theme:'forest',template:'numbered',captionPos:'top'});
await buildFigure({items:mana,caption:'Aparate compacte, de mana',out:'public/imagini/articole/aparat-mana.webp',theme:'lavender',template:'spotlight',captionPos:'bottom'});
console.log('hero + 3 figuri aparat generate');
