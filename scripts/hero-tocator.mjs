import { buildHero } from './gen-hero.mjs';
const P='public/imagini/produse/';
const prods=[
  P+'tocator-crengi-si-resturi-vegetale-electric-makita-ud2500-2500-w-diame-d9ttjmbbm.webp',
  P+'tocator-crengi-vonroc-gs502ac-putere-2500w-2x-cutite-din-otel-dur-tura-d1h2qxmbm.webp',
  P+'tocator-crengi-si-resturi-vegetale-electric-bosch-axt-25-d-putere-2500-dzpbxgmbm.webp',
];
await buildHero({title:'Cel mai bun tocator de crengi pentru curte', tag:'TOP eMAG', products:prods, out:'public/images/articles/tocator-de-crengi-pentru-curte.webp', variant:'panel', theme:'olive'});
console.log('hero tocator regenerat (nume pastrat)');
