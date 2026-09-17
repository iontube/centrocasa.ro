import { buildHero, buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const F=(s)=>P+s+'.webp';
// HERO din produse reale (lemn in fata)
await buildHero({title:'Cele mai bune pergole din lemn pentru terasa', tag:'TOP eMAG', products:[
  F('foisor-pergola-de-gradina-kit-metalic-inclus-3x4-m-din-lemn-rindeluit-dhdl2m3bm'),
  F('structura-garaj-pergola-din-lemn-rindeluit-imbinari-de-fier-3x4-m-pent-dz2l2m3bm'),
  F('pergola-maro-cu-lumini-led-310-x-310-cm-parga-d6dwz73bm'),
], out:'public/images/articles/pergola-din-lemn-pentru-terasa.webp', variant:'panel', theme:'sage'});
// FIGURI
const lemn=[
  {img:F('foisor-pergola-de-gradina-kit-metalic-inclus-3x4-m-din-lemn-rindeluit-dhdl2m3bm'),label:'Foisor lemn 3x4',sub:'lemn rindeluit'},
  {img:F('structura-garaj-pergola-din-lemn-rindeluit-imbinari-de-fier-3x4-m-pent-dz2l2m3bm'),label:'Pergola lemn 3x4',sub:'imbinari de fier'},
  {img:F('pergola-pliabila-din-lemn-cu-frunze-flori-1x2m-dvtrqn3bm'),label:'Pergola pliabila',sub:'decorativa, 1x2m'},
];
const metal=[
  {img:F('pergola-3x3m-metalica-galvanizata-acoperis-inclinat-poliester-upf30-an-dh6ypn2bm'),label:'Metalica 3x3',sub:'cea mai ieftina'},
  {img:F('pergola-maro-cu-lumini-led-310-x-310-cm-parga-d6dwz73bm'),label:'Beliani cu LED',sub:'otel, lumini'},
  {img:F('pergola-retractabila-3x3m-aluminiu-protectie-uv-gri-inchis-dffypn2bm'),label:'Aluminiu retractabila',sub:'protectie UV'},
  {img:F('pergola-gradina-3x3m-acoperis-retractabil-4-perdele-bej-d3h3pn2bm'),label:'Cu 4 perdele',sub:'acoperis retractabil'},
];
await buildFigure({items:lemn,caption:'Pergole din lemn',out:'public/imagini/articole/pergola-lemn.webp',theme:'honey',template:'cards',captionPos:'bottom'});
await buildFigure({items:metal,caption:'Alternative metalice si din aluminiu',out:'public/imagini/articole/pergola-metal.webp',theme:'teal',template:'numbered',captionPos:'top'});
console.log('hero + 2 figuri pergola generate');
