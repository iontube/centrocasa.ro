import { buildFigure } from './gen-hero.mjs';
const P='public';
const seturi=[
  {img:P+'/imagini/produse/hamac-timeless-tools-pentru-doua-persoane-cadru-metalic-inaltime-regla-d4skyvbbm.webp',label:'Timeless',sub:'77 pareri'},
  {img:P+'/imagini/produse/hamac-cu-cadru-metalic-songmics-reglabil-la-5-inaltimi-maxim-240-kg-30-dxdw9xybm.webp',label:'Songmics',sub:'pana la 240 kg'},
  {img:P+'/imagini/produse/hamac-cu-suport-k-sport-ksoz017-vopsit-electrostatic-rezistent-la-inte-dftgc4mbm.webp',label:'K-SPORT',sub:'cel mai accesibil'},
  {img:P+'/imagini/produse/hamac-dublu-de-gradina-cu-suport-lewer-280-x110-cm-panza-rezistenta-bu-dwzqpd2bm.webp',label:'Lewer dublu',sub:'2 persoane'},
];
const suporturi=[
  {img:P+'/imagini/produse/suport-metalic-pentru-hamac-timeless-tools-sarcina-120-kg-cu-geanta-tr-dgpgx2mbm.webp',label:'Timeless metal',sub:'cu geanta'},
  {img:P+'/imagini/produse/suport-din-lemn-pentru-hamac-timeless-tools-capacitate-de-incarcare-12-d3p4d5bbm.webp',label:'Timeless lemn',sub:'design din lemn'},
  {img:P+'/imagini/produse/suport-pentru-hamac-vivatechnix-vmd-1013-max-120-kg-dtb8xymbm.webp',label:'Vivatechnix',sub:'accesibil'},
  {img:P+'/imagini/produse/suport-pentru-hamac-fotoliu-casa-pro-205-x-110-x-110-cm-metal-negru-dp421fbbm.webp',label:'casa.pro',sub:'pt hamac-scaun'},
];
await buildFigure({items:seturi,caption:'Seturi complete hamac cu suport',out:P+'/imagini/articole/hamac-seturi.webp',theme:'honey',template:'cards',captionPos:'bottom'});
await buildFigure({items:suporturi,caption:'Suporturi separate pentru hamac',out:P+'/imagini/articole/hamac-suporturi.webp',theme:'spruce',template:'chips',captionPos:'top'});
console.log('2 figuri hamac generate');
