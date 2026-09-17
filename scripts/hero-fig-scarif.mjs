import { buildHeroV2 } from './hero2.mjs';
import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const F=s=>P+s+'.webp';
await buildHeroV2({products:[
  F('scarificator-aerator-electric-steinhaus-pro-sca1800-putere-1800-w-37-c-d2bm8xybm'),
  F('scarificator-aerator-electric-einhell-gc-sa-1231-1-putere-1200-w-31-cm-dlg86rbbm'),
], out:'public/images/articles/scarificator-pentru-gazon.webp', seed:'scarificator-pentru-gazon'});
const acc=[
  {img:F('aerator-si-scarificator-electric-lehmann-teasel-2in1-maner-pliabil-180-dcz0z5mbm'),label:'Lehmann 380mm',sub:'31 pareri'},
  {img:F('scarificator-aerator-electric-steinhaus-pro-sca1800-putere-1800-w-37-c-d2bm8xybm'),label:'Steinhaus 1800W',sub:'nota 4.9'},
  {img:F('aerator-si-scarificator-electric-lehmann-alyssum-2in1-maner-pliabil-15-dczll5mbm'),label:'Lehmann 320mm',sub:'cel mai ieftin'},
  {img:F('scarificator-electric-einhell-gc-es-1231-1-putere-1200-w-3-trepte-de-l-d2tp0ymbm'),label:'Einhell GC-ES',sub:'nota 5.0'},
];
const ech=[
  {img:F('scarificator-aerator-electric-texas-mpc-1400-putere-1400-w-32-cm-latim-d826mtmbm'),label:'Texas 1400W',sub:'27 pareri'},
  {img:F('scarificator-si-aerator-electric-hecht-1683-2-in-1-1600-w-latime-lucru-dptxf5bbm'),label:'Hecht 1683',sub:'2in1, nota 4.8'},
  {img:F('scarificator-aerator-electric-einhell-gc-sa-1231-1-putere-1200-w-31-cm-dlg86rbbm'),label:'Einhell GC-SA',sub:'30 pareri'},
  {img:F('aerator-de-gazon-hecht-1848-2in1-2in1-1800-w-20-lame-de-otel-latime-de-dr29s4mbm'),label:'Hecht 1848',sub:'20 lame otel'},
];
const put=[
  {img:F('scarificator-electric-makita-uv3200-putere-1300w-latime-de-lucru-32-cm-d7v6pmbbm'),label:'Makita UV3200',sub:'24 pareri'},
  {img:F('scarificator-aerator-pe-benzina-ruris-rxh999-212-cc-putere-5-3-cp-40-c-dbykfdmbm'),label:'Ruris benzina',sub:'5.3 CP, teren mare'},
  {img:F('scarificator-electric-husqvarna-s-138-c-putere-1600-w-latime-lucru-37-dpz0gjmbm'),label:'Husqvarna S138',sub:'premium, nota 5.0'},
  {img:F('scarificator-gazon-manual-cu-roti-wolf-garten-ur-m3-latime-lucru-30-cm-dv8cwvmbm'),label:'Wolf-Garten manual',sub:'fara motor'},
];
await buildFigure({items:acc,caption:'Scarificatoare electrice accesibile',out:'public/imagini/articole/scarif-accesibile.webp',theme:'pine',template:'cards',captionPos:'bottom'});
await buildFigure({items:ech,caption:'Scarificatoare echilibrate',out:'public/imagini/articole/scarif-echilibrate.webp',theme:'rust',template:'numbered',captionPos:'top'});
await buildFigure({items:put,caption:'Puternice, pe benzina si manuale',out:'public/imagini/articole/scarif-puternice.webp',theme:'walnut',template:'spotlight',captionPos:'bottom'});
console.log('hero + 3 figuri scarificator generate');
