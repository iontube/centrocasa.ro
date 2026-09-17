import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const acc=[
  {img:P+'statie-de-calcat-tefal-express-essential-sv6115e0-2200w-5-2-bar-jet-de-d3fy22mbm.webp',label:'Tefal Essential',sub:'317 pareri'},
  {img:P+'statie-de-calcat-cu-boiler-heinner-his-d3007ix-3000-w-1600w-boiler-140-dp8pmlbbm.webp',label:'Heinner boiler',sub:'7 bar, 3000 W'},
  {img:P+'statie-de-calcat-cu-abur-philips-perfectcare-compact-gc7842-40-2400w-6-djk18dmbm.webp',label:'Philips Compact',sub:'153 pareri'},
  {img:P+'statie-de-calcat-tefal-express-vision-sv8152e0-2800w-presiune-6-9-bari-dqm4v6mbm.webp',label:'Tefal Vision',sub:'2800 W'},
];
const ech=[
  {img:P+'statie-de-calcat-tefal-express-anti-calc-sv8054e0-2800w-6-5-bari-jet-d-ddxmvvmbm.webp',label:'Tefal Anti-Calc',sub:'326 pareri'},
  {img:P+'statie-de-calcat-cu-boiler-tefal-proexpress-protect-gv9221e0-2600w-7-6-dv9y22mbm.webp',label:'Tefal ProExpress',sub:'7.6 bar, nota 4.6'},
  {img:P+'statie-de-calcat-philips-hi5919-30-2400w-talpa-ceramica-debit-abur-100-d7bfc2mbm.webp',label:'Philips HI5919',sub:'talpa ceramica'},
  {img:P+'statie-de-calcat-braun-carestyle-7-is7266vi-2700w-7-5-bari-abur-variab-dqmp7mybm.webp',label:'Braun CareStyle 7',sub:'7.5 bar'},
];
const prem=[
  {img:P+'statie-de-calcat-cu-abur-philips-perfectcare-elite-advanced-gc9682-80-dsl830bbm.webp',label:'Philips Elite',sub:'312 pareri, 8 bar'},
  {img:P+'statie-de-calcat-braun-carestyle-7-pro-is7282bl-2700w-8-bari-abur-vari-d5mp7mybm.webp',label:'Braun CS7 PRO',sub:'8 bar'},
  {img:P+'statie-de-calcat-tefal-pro-express-vision-gv9822e1-3000w-9-bari-jet-de-dn0wbfybm.webp',label:'Tefal Pro Vision',sub:'9 bar, nota 4.9'},
  {img:P+'statie-de-calcat-cu-boiler-de-inalta-presiune-tefal-pro-express-vision-d0b4lxmbm.webp',label:'Tefal boiler HP',sub:'750 g/min jet'},
];
await buildFigure({items:acc,caption:'Statii de calcat accesibile',out:'public/imagini/articole/statie-accesibile.webp',theme:'stone',template:'cards',captionPos:'bottom'});
await buildFigure({items:ech,caption:'Statii de calcat echilibrate',out:'public/imagini/articole/statie-echilibrate.webp',theme:'rust',template:'numbered',captionPos:'top'});
await buildFigure({items:prem,caption:'Statii de calcat premium',out:'public/imagini/articole/statie-premium.webp',theme:'pine',template:'spotlight',captionPos:'bottom'});
console.log('3 figuri statie generate');
