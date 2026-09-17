import { buildHero, buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const F=s=>P+s+'.webp';
await buildHero({title:'Cele mai bune plite cu inductie', tag:'TOP eMAG', products:[
  F('plita-incorporabila-samsung-bespoke-nz64b5067yy-u2-inductie-4-zone-de-d71gwgmbm'),
  F('plita-incorporabila-beko-hii64401smtx-inductie-4-zone-de-gatit-booster-dzx713ybm'),
  F('plita-incorporabila-electrolux-liv63431bk-inductie-4-zone-de-gatit-tou-dn8vsrbbm'),
], out:'public/images/articles/plita-cu-inductie-pentru-bucatarie.webp', variant:'panel', theme:'slate'});
const acc=[
  {img:F('plita-incorporabila-heinner-hbhi-m2zbstc-inductie-2-zone-de-gatit-boos-dt80n8ybm'),label:'Heinner 2 zone',sub:'cea mai ieftina'},
  {img:F('plita-incorporabila-starcrest-sih-3030-inductie-3300-w-2-zone-de-gatit-dkvcp8mbm'),label:'Starcrest domino',sub:'2 zone, 30 cm'},
  {img:F('plita-incorporabila-heinner-hbhi-m4zbstc-inductie-4-zone-de-gatit-boos-d080n8ybm'),label:'Heinner 4 zone',sub:'4 zone sub 800'},
  {img:F('plita-incorporabila-starcrest-sih-6060-inductie-4-zone-de-gatit-touch-d2kc2yybm'),label:'Starcrest 4 zone',sub:'36 pareri'},
];
const ech=[
  {img:F('plita-incorporabila-arctic-arsi6440mtb-inductie-4-zone-de-gatit-touch-dd2f2ymbm'),label:'Arctic 4 zone',sub:'28 pareri'},
  {img:F('plita-incorporabila-beko-hii64401smtx-inductie-4-zone-de-gatit-booster-dzx713ybm'),label:'Beko SMTX',sub:'nota 4.76'},
  {img:F('plita-incorporabila-beko-hii64200mt-inductie-4-zone-de-gatit-booster-d-dlxhjwbbm'),label:'Beko HII64200',sub:'46 pareri'},
  {img:F('plita-incorporabila-electrolux-eit61443b-inductie-4-zone-de-gatit-touc-d8x36jbbm'),label:'Electrolux EIT',sub:'4 zone, Electrolux'},
];
const prem=[
  {img:F('plita-incorporabila-electrolux-liv63431bk-inductie-4-zone-de-gatit-tou-dn8vsrbbm'),label:'Electrolux LIV',sub:'46 pareri'},
  {img:F('plita-incorporabila-samsung-bespoke-nz64b5067yy-u2-inductie-4-zone-de-d71gwgmbm'),label:'Samsung Bespoke',sub:'15 trepte'},
  {img:F('plita-incorporabila-aeg-ikb64413fb-inductie-4-zone-de-gatit-touch-cont-dr936jbbm'),label:'AEG',sub:'14 trepte'},
  {img:F('plita-incorporabila-whirlpool-smp-658c-bt-ixl-hob-wp-inductie-8-zone-d-d7y54jbbm'),label:'Whirlpool 8 zone',sub:'zona flexibila 65 cm'},
];
await buildFigure({items:acc,caption:'Plite accesibile cu inductie',out:'public/imagini/articole/plita-accesibile.webp',theme:'stone',template:'cards',captionPos:'bottom'});
await buildFigure({items:ech,caption:'Plite echilibrate cu inductie',out:'public/imagini/articole/plita-echilibrate.webp',theme:'plum',template:'numbered',captionPos:'top'});
await buildFigure({items:prem,caption:'Plite premium cu inductie',out:'public/imagini/articole/plita-premium.webp',theme:'rust',template:'spotlight',captionPos:'bottom'});
console.log('hero + 3 figuri plita generate');
