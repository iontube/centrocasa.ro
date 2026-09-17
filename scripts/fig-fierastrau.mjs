import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const mini=[
  {img:P+'mini-ferastrau-cu-lant-modernizat-folixs-8-inch-motor-fara-perii-cu-si-ddrlrnybm.webp',label:'Folixs 8"',sub:'204 pareri'},
  {img:P+'mini-fierastrau-electric-cu-lant-herrgut-motor-fara-perii-12-inch-2-x-d4hnywybm.webp',label:'Herrgut 12"',sub:'nota 4.93'},
  {img:P+'mini-fierastrau-electric-cu-lant-herrgut-6-inch-2-x-baterie-2000-mah-m-dqqq4kybm.webp',label:'Herrgut 6"',sub:'cel mai ieftin util'},
  {img:P+'mini-drujba-4-cu-2-acumulatori-reincarcabili-24v-portabila-taiere-lemn-dz3mhcybm.webp',label:'Kardett 4"',sub:'cel mai mic pret'},
];
const cablu=[
  {img:P+'drujba-fierastrau-electric-einhell-gc-ec-1935-220-v-1900-w-35-cm-lungi-dvn346mbm.webp',label:'Einhell 1935',sub:'1900 W'},
  {img:P+'k1800-drujba-electrica-procraft-produsul-contine-taxa-timbru-verde-2-5-d5qlcmmbm.webp',label:'Procraft K1800',sub:'cel mai ieftin'},
  {img:P+'drujba-electrica-fierastrau-cu-lant-bosch-universalchain-35-putere-180-d7lx6jmbm.webp',label:'Bosch 35',sub:'sistem SDS'},
  {img:P+'drujba-electrica-fierastrau-cu-lant-makita-uc4041a-putere-1800-w-230-v-dcgkkmbbm.webp',label:'Makita UC4041A',sub:'lama 40 cm'},
];
const acu=[
  {img:P+'drujba-fierastrau-electric-cu-lant-pe-acumulator-einhell-pxc-ge-lc-18-db3bt5bbm.webp',label:'Einhell 18V',sub:'124 pareri'},
  {img:P+'drujba-fierastrau-electric-cu-lant-pe-acumulator-bosch-universalchain-d1tvxfbbm.webp',label:'Bosch 18V',sub:'2.7 kg, SDS'},
  {img:P+'fierastrau-electric-drujba-cu-lant-herrgut-2-x-baterie-6000-mah-16-inc-ddvwrf3bm.webp',label:'Herrgut 16"',sub:'lama 40 cm'},
  {img:P+'drujba-fierastrau-electric-cu-lant-pe-acumulator-einhell-pxc-ge-lc-36-d8hv7pmbm.webp',label:'Einhell 36V',sub:'nota 4.89'},
];
await buildFigure({items:mini,caption:'Mini fierastraie pe acumulator',out:'public/imagini/articole/fierastrau-mini.webp',theme:'terracotta',template:'gallery',captionPos:'bottom'});
await buildFigure({items:cablu,caption:'Drujbe electrice cu cablu',out:'public/imagini/articole/fierastrau-cablu.webp',theme:'sage',template:'numbered',captionPos:'top'});
await buildFigure({items:acu,caption:'Drujbe pe acumulator full-size',out:'public/imagini/articole/fierastrau-acumulator.webp',theme:'olive',template:'spotlight',captionPos:'bottom'});
console.log('3 figuri regenerate cu produse');
