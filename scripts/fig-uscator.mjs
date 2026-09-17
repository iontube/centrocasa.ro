import { buildFigure } from './gen-hero.mjs';
const P='public/imagini/produse/';
const acc=[
  {img:P+'uscator-de-rufe-heinner-hhpd-m8g3a-pompa-de-caldura-8-kg-14-programe-c-djvlm4ybm.webp',label:'Heinner 8 kg',sub:'111 pareri'},
  {img:P+'uscator-de-rufe-candy-smart-pro-csoe-h8a2de-s-pompa-de-caldura-8-kg-cl-d6mfd0mbm.webp',label:'Candy Smart Pro',sub:'cel mai ieftin'},
  {img:P+'uscator-de-rufe-arctic-a2t18239w-pompa-de-caldura-8-kg-15-programe-cla-ds1qm5ybm.webp',label:'Arctic 8 kg',sub:'slim, 54 cm'},
  {img:P+'uscator-de-rufe-heinner-hhpd-h90fra-pompa-de-caldura-9-kg-15-programe-dg80n8ybm.webp',label:'Heinner 9 kg',sub:'9 kg sub 2000'},
];
const ech=[
  {img:P+'uscator-de-rufe-cu-pompa-de-caldura-heinner-hhpd-v8t1cha-8-kg-15-progr-d4rpvqmbm.webp',label:'Heinner V8',sub:'106 pareri'},
  {img:P+'uscator-de-rufe-whirlpool-fftm1182bee-pompa-de-caldura-8-kg-clasa-e-fr-d96990mbm.webp',label:'Whirlpool',sub:'1.78 kWh'},
  {img:P+'uscator-de-rufe-samsung-dv90dg52a0able-pompa-de-caldura-9-kg-clasa-c-s-dgg35m3bm.webp',label:'Samsung 9 kg',sub:'144 pareri'},
  {img:P+'uscator-de-rufe-beko-b3t68230-pompa-de-caldura-8-kg-15-programe-clasa-dw2rsfmbm.webp',label:'Beko 8 kg',sub:'nota 4.78'},
];
const prem=[
  {img:P+'uscator-de-rufe-bosch-wth8520bby-pompa-de-caldura-8-kg-15-programe-aut-dk77m73bm.webp',label:'Bosch 8 kg',sub:'179 pareri'},
  {img:P+'uscator-de-rufe-hotpoint-natis-reload-ntm1182skeu-pompa-de-caldura-8-k-dkptn6bbm.webp',label:'Hotpoint Natis',sub:'reincarcare usa'},
  {img:P+'uscator-de-rufe-samsung-dv90t7240bh-s7-pompa-de-caldura-9-kg-clasa-c-a-d75ck2mbm.webp',label:'Samsung 9 kg',sub:'16 programe'},
  {img:P+'uscator-de-rufe-aeg-tr818a4e-pompa-de-caldura-8-kg-clasa-a-absolutecar-d7l3t1mbm.webp',label:'AEG A+++',sub:'1.49 kWh'},
];
await buildFigure({items:acc,caption:'Uscatoare accesibile cu pompa de caldura',out:'public/imagini/articole/uscator-accesibile.webp',theme:'slate',template:'cards',captionPos:'bottom'});
await buildFigure({items:ech,caption:'Uscatoare echilibrate, 2000-2700 lei',out:'public/imagini/articole/uscator-echilibrate.webp',theme:'copper',template:'numbered',captionPos:'top'});
await buildFigure({items:prem,caption:'Uscatoare premium cu pompa de caldura',out:'public/imagini/articole/uscator-premium.webp',theme:'forest',template:'spotlight',captionPos:'bottom'});
console.log('3 figuri uscator generate');
