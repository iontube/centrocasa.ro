import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const RAW=fileURLToPath(new URL('../src/data/emag-raw.json',import.meta.url));
const OUT=fileURLToPath(new URL('../src/data/emag-products.json',import.meta.url));
const IMG=fileURLToPath(new URL('../public/imagini/produse',import.meta.url));
const NO_IMG=process.argv.includes('--no-img'); const GROUP='scarificator';
if(!existsSync(IMG))mkdirSync(IMG,{recursive:true});
const DL=u=>'https://l.profitshare.ro/lps/9/ZmA/?redirect='+encodeURIComponent(u);
const slug=s=>(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70).replace(/-+$/,'');
const PICK=['DCZ0Z5MBM','D2BM8XYBM','DCZLL5MBM','D2TP0YMBM','D826MTMBM','DPTXF5BBM','DLG86RBBM','DR29S4MBM','D7V6PMBBM','DBYKFDMBM','DPZ0GJMBM','DV8CWVMBM'];
async function dl(raw,s){const o=IMG+'/'+s+'.webp';if(existsSync(o))return true;let u=String(raw).replace(/&amp;/g,'&').replace(/width=\d+/,'width=600').replace(/height=\d+/,'height=600');if(!/width=/.test(u))u+=(u.includes('?')?'&':'?')+'width=600';try{const r=await fetch(u,{headers:{'User-Agent':'Mozilla/5.0'}});if(!r.ok)throw 0;const b=Buffer.from(await r.arrayBuffer());const sh=(await import('sharp')).default;await sh(b).resize(500,500,{fit:'contain',background:{r:255,g:255,b:255,alpha:0}}).webp({quality:82}).toFile(o);return true;}catch(e){console.log('IMG FAIL',s);return false;}}
const raw=JSON.parse(readFileSync(RAW,'utf8')).products||[]; const byId=Object.fromEntries(raw.map(p=>[p.id,p]));
const picked=PICK.map(id=>byId[id]).filter(Boolean);
if(picked.length!==PICK.length)console.error('!! lipsesc:',PICK.filter(id=>!byId[id]));
const list=picked.map(p=>({id:p.id,slug:slug(p.name)+'-'+p.id.toLowerCase(),name:p.name,brand:p.brand||'',price:p.price,currency:p.currency||'RON',rating:p.rating||null,reviews:p.reviewCount||0,image:'/imagini/produse/'+slug(p.name)+'-'+p.id.toLowerCase()+'.webp',rawImg:(p.images||[])[0]||'',deeplink:DL(p.url),specs:p.specs||{},url:p.url,tag:GROUP}));
list.forEach((r,i)=>console.log((i+1)+'. rev='+r.reviews+' rat='+r.rating+' '+r.price+'lei | '+r.name.replace(/\s+/g,' ').slice(0,44)));
if(!NO_IMG){let ok=0;for(const r of list)if(r.rawImg&&await dl(r.rawImg,r.slug))ok++;console.log('imagini:',ok+'/'+list.length);}
const db=JSON.parse(readFileSync(OUT,'utf8'));const ex=!!db[GROUP];db[GROUP]=list;writeFileSync(OUT,JSON.stringify(db,null,1));
console.log('grup '+GROUP+(ex?' ACTUALIZAT':' ADAUGAT')+' | grupuri:',Object.keys(db).length);
