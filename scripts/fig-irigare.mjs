import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const kituri=[
  {img:P+'sistem-de-irigare-pentru-gradina-plastic-2-x-15m-multicolor-dy2zy5mbm.webp',label:'OEM 2x15m',sub:'cel mai vandut'},
  {img:P+'sistem-de-irigare-prin-picurare-si-pulverizare-pentru-gradina-ghivece-dlfczbybm.webp',label:'4U 236 piese',sub:'picurare + pulverizare'},
  {img:P+'sistem-multifunctional-de-irigare-gradina-senmase-plastic-multicolor-dyp4rwmbm.webp',label:'Senmase',sub:'multifunctional'},
  {img:P+'kit-irigare-economic-agronomat-cu-banda-picurare-17mm-40cm-x100m-10-ro-dyp777ybm.webp',label:'Agronomat banda',sub:'100 m, straturi'},
];
const udare=[
  {img:P+'aspersor-rotativ-pentru-gradina-nextly-sistem-de-irigare-cu-3-capete-p-dhhw6x3bm.webp',label:'Nextly aspersor',sub:'rotativ, gazon'},
  {img:P+'set-2-aspersoare-pentru-irigatii-momcbebe-rotire-360-grade-etanseitate-drzrscybm.webp',label:'Momcbebe 2 buc',sub:'rotire 360'},
  {img:P+'set-3-buc-dispozitiv-de-irigare-automata-glob-de-apa-pentru-plante-de-dp3bmsybm.webp',label:'Jenuos globuri',sub:'ghivece'},
  {img:P+'set-3-buc-dispozitiv-de-irigare-automata-glob-de-apa-pentru-plante-de-d9p1kxybm.webp',label:'OEM globuri',sub:'3 buc'},
];
const acc=[
  {img:P+'distribuitor-4-cai-cellfast-ideal-compatibil-cu-robinete-de-3-4-1-d2mn6nmbm.webp',label:'Cellfast 4 cai',sub:'distribuitor'},
  {img:P+'picurator-reglabil-tub-picurare-1001-evotools-0-70-l-h-set-50-bucati-dlvqkmmbm.webp',label:'EvoTools',sub:'50 picuratoare'},
  {img:P+'set-tija-fixare-furtun-cu-picurare-d9h46ybbm.webp',label:'Plast tije',sub:'fixare furtun'},
];
await buildFigure({items:kituri,caption:'Kituri de irigare prin picurare',out:'public/imagini/articole/irigare-kituri.webp',theme:'moss',template:'cards',captionPos:'bottom'});
await buildFigure({items:udare,caption:'Aspersoare si dispozitive de udare',out:'public/imagini/articole/irigare-udare.webp',theme:'fern',template:'numbered',captionPos:'top'});
await buildFigure({items:acc,caption:'Distribuitoare si accesorii',out:'public/imagini/articole/irigare-accesorii.webp',theme:'clay',template:'spotlight',captionPos:'bottom'});
console.log('3 figuri irigare generate');
