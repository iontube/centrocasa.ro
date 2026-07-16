// Trage produsele din colectorul eMAG (KV) via CF API, concurent. -> src/data/emag-raw.json
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const EMAIL='contact@centrocasa.ro', KEY=process.env.CF_KEY, ACCT='226b1a6177d6c80dee8a4d16b7615aa8', NS='1d148851aa3b4c38a8b1b7e99b8e057b';
const H={'X-Auth-Email':EMAIL,'X-Auth-Key':KEY};
if(!KEY){console.error('Ruleaza cu CF_KEY=... in env');process.exit(1);}
const base=`https://api.cloudflare.com/client/v4/accounts/${ACCT}/storage/kv/namespaces/${NS}`;
let keys=[],cursor='';
do{ const r=await fetch(`${base}/keys?prefix=p:&limit=1000${cursor?`&cursor=${encodeURIComponent(cursor)}`:''}`,{headers:H}); const j=await r.json(); keys.push(...j.result.map(k=>k.name)); cursor=j.result_info?.cursor||''; }while(cursor);
const prods=[], CONC=24;
for(let i=0;i<keys.length;i+=CONC){ const b=keys.slice(i,i+CONC); const res=await Promise.all(b.map(k=>fetch(`${base}/values/${encodeURIComponent(k)}`,{headers:H}).then(r=>r.ok?r.text():null).catch(()=>null))); for(const t of res){ if(t){ try{ prods.push(JSON.parse(t)); }catch{} } } }
const out=fileURLToPath(new URL('../src/data/emag-raw.json',import.meta.url));
writeFileSync(out,JSON.stringify({count:prods.length,products:prods}));
console.log('pull:',prods.length,'produse ->',out);
