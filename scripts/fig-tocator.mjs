import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const acc=[
  {img:P+'tocator-crengi-vonroc-gs502ac-putere-2500w-2x-cutite-din-otel-dur-tura-d1h2qxmbm.webp',label:'VONROC 2500W',sub:'38 pareri, 4.8'},
  {img:P+'tocator-crengi-si-resturi-vegetale-electric-einhell-gc-ks-2540-2000-w-dd1msmmbm.webp',label:'Einhell 2000W',sub:'accesibil'},
  {img:P+'tocator-crengi-lehmann-timber-3000-w-4500-rpm-crengi-de-pana-la-45-mm-d0nwhg3bm.webp',label:'Lehmann Timber',sub:'3000W, 45 mm'},
  {img:P+'tocator-de-resturi-vegetale-raider-rd-esh01-putere-2400-w-diametru-tai-d57kn3mbm.webp',label:'Raider 2400W',sub:'nota 4.8'},
];
const ech=[
  {img:P+'tocator-crengi-si-resturi-vegetale-electric-villager-vc-2500-2500-w-co-dxlzt8bbm.webp',label:'Villager VC2500',sub:'66 pareri'},
  {img:P+'tocator-crengi-si-resturi-vegetale-electric-black-decker-begas5800-qs-dhy097mbm.webp',label:'Black & Decker',sub:'2800W, valt'},
  {img:P+'tocator-crengi-si-resturi-vegetale-electric-bosch-axt-rapid-2200-2200-d54mm7bbm.webp',label:'Bosch AXT Rapid',sub:'nota 4.9'},
  {img:P+'tocator-electric-silentios-de-crengi-pwh-2800-w-230-v-45-mm-diametru-t-dbrzrlmbm.webp',label:'ParkSide silentios',sub:'valt, 45 mm'},
];
const prem=[
  {img:P+'tocator-crengi-si-resturi-vegetale-electric-makita-ud2500-2500-w-diame-d9ttjmbbm.webp',label:'Makita UD2500',sub:'65 pareri, cos 67L'},
  {img:P+'tocator-crengi-si-resturi-vegetale-electric-ruris-st100-2500-w-230-v-d-dnykfdmbm.webp',label:'Ruris ST100',sub:'56 pareri'},
  {img:P+'tocator-crengi-si-resturi-vegetale-electric-bosch-axt-25-d-putere-2500-dzpbxgmbm.webp',label:'Bosch AXT 25 D',sub:'valt silentios'},
  {img:P+'tocator-crengi-pe-benzina-212cc-4-1kw-50mm-rd-gsh01-dynnnvybm.webp',label:'Raider benzina',sub:'50 mm, fara priza'},
];
await buildFigure({items:acc,caption:'Tocatoare accesibile cu cutite',out:'public/imagini/articole/tocator-accesibile.webp',theme:'olive',template:'cards',captionPos:'bottom'});
await buildFigure({items:ech,caption:'Tocatoare echilibrate',out:'public/imagini/articole/tocator-echilibrate.webp',theme:'spruce',template:'numbered',captionPos:'top'});
await buildFigure({items:prem,caption:'Tocatoare premium si pe benzina',out:'public/imagini/articole/tocator-premium.webp',theme:'copper',template:'spotlight',captionPos:'bottom'});
console.log('3 figuri tocator generate');
