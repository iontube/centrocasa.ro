import { buildHeroV2 } from './hero2.mjs';
import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const F=s=>P+s+'.webp';
await buildHeroV2({products:[
  F('copertina-retractabila-automat-vidaxl-crem-450x300-cm-31-06-kg-d2kc6hmbm'),
  F('copertina-retractabila-automat-vidaxl-antracit-300x250-cm-19-78-kg-dv596xmbm'),
], out:'public/images/articles/copertina-retractabila-pentru-terasa.webp', seed:'copertina-retractabila-pentru-terasa'});
const mici=[
  {img:F('copertina-retractabila-de-terasa-vidaxl-poliester-otel-100-x-300-cm-al-dglyn2mbm'),label:'100 cm albastru',sub:'cea mai mica'},
  {img:F('copertina-retractabila-de-terasa-vidaxl-poliester-otel-100-x-300-cm-ma-ds1yn2mbm'),label:'100 cm maro',sub:'fereastra/balcon'},
  {img:F('copertina-retractabila-de-terasa-vidaxl-poliester-otel-100-x-300-cm-ro-dv1yn2mbm'),label:'100 cm rosu',sub:'compacta'},
];
const terasa=[
  {img:F('copertina-retractabila-automat-vidaxl-antracit-300x250-cm-19-78-kg-dv596xmbm'),label:'Antracit 250 cm',sub:'poliester'},
  {img:F('copertina-retractabila-automat-vidaxl-visiniu-300x-250-cm-36-98-kg-d2j6wb3bm'),label:'Visiniu 250 cm',sub:'cadru aluminiu'},
  {img:F('copertina-retractabila-automat-vidaxl-crem-450x300-cm-31-06-kg-d2kc6hmbm'),label:'Crem 300 cm',sub:'450 cm latime'},
  {img:F('copertina-retractabila-automat-vidaxl-antracit-450x350-cm-33-88-kg-d9r96xmbm'),label:'Antracit 350 cm',sub:'cea mai mare'},
];
const dotari=[
  {img:F('copertina-retractabila-automat-cu-stor-vidaxl-galben-alb-3x2-5-m-20-88-dpc90jmbm'),label:'Cu stor frontal',sub:'protectie in plus'},
  {img:F('copertina-automata-cu-led-senzor-vant-vidaxl-antracit-450x350-cm-35-98-dbcv6xmbm'),label:'Cu LED + senzor',sub:'senzor de vant'},
  {img:F('copertina-automata-vidaxl-cu-stor-led-senzor-de-vant-antracit-5x3-m-36-d9t90jmbm'),label:'Completa 5 m',sub:'stor+LED+senzor'},
];
await buildFigure({items:mici,caption:'Copertine mici, de fereastra si balcon',out:'public/imagini/articole/copertina-mici.webp',theme:'teal',template:'cards',captionPos:'bottom'});
await buildFigure({items:terasa,caption:'Copertine de terasa automate',out:'public/imagini/articole/copertina-terasa.webp',theme:'honey',template:'numbered',captionPos:'top'});
await buildFigure({items:dotari,caption:'Cu stor, LED si senzor de vant',out:'public/imagini/articole/copertina-dotari.webp',theme:'plum',template:'spotlight',captionPos:'bottom'});
console.log('hero + 3 figuri copertina generate');
