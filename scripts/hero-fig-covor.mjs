import { buildHeroV2 } from './hero2.mjs';
import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const F=s=>P+s+'.webp';
await buildHeroV2({products:[
  F('covor-ayyildiz-hawaii-80x150-cm-polipropilena-patrate-modern-2800-g-m-d6tjtrbbm'),
  F('covor-shaggy-ayyildiz-gala-160x160-cm-certificat-oeko-tex-standard-100-dwr5dtybm'),
], out:'public/images/articles/covor-modern-pentru-living.webp', seed:'covor-modern-pentru-living'});
const shaggy=[
  {img:F('covor-shaggy-ayyildiz-gala-160x160-cm-certificat-oeko-tex-standard-100-dwr5dtybm'),label:'Ayyildiz Gala',sub:'66 pareri, rotund'},
  {img:F('covor-dreptunghiular-cu-fir-lung-shaggy-ayyildiz-teppiche-120-x-170-ve-d4ybn3mbm'),label:'Softshine fir lung',sub:'61 pareri'},
  {img:F('covor-shaggy-ayyildiz-life-clasic-200x200-cm-polipropilen-fir-lung-30-dqtydjbbm'),label:'Ayyildiz Life',sub:'mare, 200x200'},
  {img:F('covor-decorino-fir-lung-polipropilena-c-203501-120x170-cm-dvlmdjbbm'),label:'Decorino',sub:'fir lung 30 mm'},
];
const modern=[
  {img:F('covor-modern-ayyildiz-plus-model-dreptunghi-80x150-cm-negru-gri-polipr-dlkxv8mbm'),label:'Ayyildiz Plus',sub:'47 pareri'},
  {img:F('covor-ayyildiz-hawaii-80x150-cm-polipropilena-patrate-modern-2800-g-m-d6tjtrbbm'),label:'Ayyildiz Hawaii',sub:'nota 4.93'},
  {img:F('covor-ayyildiz-art-3d-160-x-160-cm-fir-de-8-mm-1900-g-m2-certyfikat-oe-dh4wbqybm'),label:'Art 3D',sub:'model 3D'},
  {img:F('covor-modern-daffi-13027-140-bej-maro-80x150-cm-d4rjw9bbm'),label:'Delta Daffi',sub:'nota 4.83'},
];
const pufos=[
  {img:F('covor-pufos-verde-deschis-anti-derapant-material-textil-rezistenta-la-d4w3fvybm'),label:'Pufos verde',sub:'catifea, 4.83'},
  {img:F('covor-plusat-ego-rabbit-d-grey-3-cm-grosime-spate-anti-derapant-120x17-dd6qd2mbm'),label:'EGO Rabbit',sub:'plusat 3 cm'},
  {img:F('covor-fir-scurt-puff-oyo-concept-120x180-cm-inaltime-fir-2-5-cm-1250-g-dwyt5vmbm'),label:'Oyo Puff',sub:'moale'},
  {img:F('covor-clasic-lotos-532-80x150-cm-crem-bej-dqfc6kbbm'),label:'Delta Lotos',sub:'clasic, 4.9'},
];
await buildFigure({items:shaggy,caption:'Covoare Shaggy cu fir lung',out:'public/imagini/articole/covor-shaggy.webp',theme:'terracotta',template:'cards',captionPos:'bottom'});
await buildFigure({items:modern,caption:'Covoare moderne cu model',out:'public/imagini/articole/covor-moderne.webp',theme:'sage',template:'numbered',captionPos:'top'});
await buildFigure({items:pufos,caption:'Covoare pufoase si clasice',out:'public/imagini/articole/covor-pufoase.webp',theme:'slate',template:'spotlight',captionPos:'bottom'});
console.log('hero + 3 figuri covor generate');
