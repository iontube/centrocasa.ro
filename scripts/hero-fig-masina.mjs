import { buildHeroV2 } from './hero2.mjs';
import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const F=s=>P+s+'.webp';
await buildHeroV2({products:[
  F('masina-de-tuns-gazon-iarba-electrica-bosch-universalrotak-34-405-latim-d74rvgybm'),
  F('masina-de-tuns-gazon-iarba-electrica-makita-elm4121-putere-1600-w-41-c-dz10dzbbm'),
], out:'public/images/articles/masina-de-tuns-gazonul-electrica.webp', seed:'masina-de-tuns-gazonul-electrica'});
const acc=[
  {img:F('masina-de-tuns-gazon-iarba-electrica-steinhaus-pro-elm12n-1200w-latime-d4cg9jybm'),label:'Steinhaus 1200W',sub:'nota 4.75'},
  {img:F('masina-de-tuns-iarba-electrica-kanwod-kgalm-1232-1200w-3400rpm-32cm-co-db6w5hybm'),label:'Kanwod 32cm',sub:'71 pareri'},
  {img:F('masina-de-tuns-gazon-iarba-electrica-einhell-gc-em-1032-putere-1000-w-db873kmbm'),label:'Einhell 1000W',sub:'32 cm'},
  {img:F('masina-de-tuns-gazon-iarba-electrica-bosch-easyrotak-32-235-32-cm-lati-d34rvgybm'),label:'Bosch EasyRotak',sub:'128 pareri'},
];
const put=[
  {img:F('masina-de-tuns-gazon-iarba-electrica-bosch-universalrotak-34-405-latim-d74rvgybm'),label:'Bosch 34cm',sub:'945 pareri!'},
  {img:F('masina-de-tuns-iarba-electrica-kanwod-kgalm-1638-1600w-3400rpm-38cm-co-dtnqbpybm'),label:'Kanwod 38cm',sub:'1600 W'},
  {img:F('masina-de-tuns-gazon-iarba-electrica-makita-elm3320-putere-1200-w-33-c-dc10dzbbm'),label:'Makita 33cm',sub:'101 pareri'},
  {img:F('masina-de-tuns-gazon-iarba-electrica-makita-elm4121-putere-1600-w-41-c-dz10dzbbm'),label:'Makita 41cm',sub:'lat, cos 50L'},
];
const acu=[
  {img:F('masina-de-tuns-iarba-pe-acumulator-lehmann-lgalm-4032-latime-taiere-32-djxdvgybm'),label:'Lehmann 4.0Ah',sub:'kit complet'},
  {img:F('masina-de-tuns-gazon-iarba-pe-acumulator-einhell-ge-cm-36-37-li-solo-3-ds1msmmbm'),label:'Einhell 36V',sub:'37 cm, Solo'},
  {img:F('masina-de-tuns-gazon-iarba-pe-acumulator-bosch-citymower-18v-32-300-18-dtlx6jmbm'),label:'Bosch CityMower',sub:'18V, kit'},
  {img:F('masina-de-tuns-gazon-iarba-pe-acumulator-einhell-professional-pxc-rasa-d1wkwdmbm'),label:'Einhell Pro 42cm',sub:'brushless, 2x4Ah'},
];
await buildFigure({items:acc,caption:'Cu cablu, accesibile',out:'public/imagini/articole/masina-accesibile.webp',theme:'moss',template:'cards',captionPos:'bottom'});
await buildFigure({items:put,caption:'Cu cablu, mai puternice',out:'public/imagini/articole/masina-puternice.webp',theme:'rust',template:'numbered',captionPos:'top'});
await buildFigure({items:acu,caption:'Pe acumulator, fara cablu',out:'public/imagini/articole/masina-acumulator.webp',theme:'teal',template:'spotlight',captionPos:'bottom'});
console.log('hero + 3 figuri masina generate');
