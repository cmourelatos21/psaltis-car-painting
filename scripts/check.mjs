import assert from 'node:assert/strict';
import { readFile, access, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const html = await readFile(path.join(dist,'index.html'),'utf8');
const css = await readFile(path.join(dist,'styles.css'),'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'IDs must be unique');
assert.equal((html.match(/<h1\b/g)||[]).length,1,'Exactly one h1');
for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const ref=match[1];
 if(ref.startsWith('#')) assert(ids.includes(ref.slice(1)),'Missing anchor '+ref);
 else if(ref.startsWith('./')) await access(path.join(dist,ref.slice(2)));
}
for(const file of ['app.js','config.js']){
 const result=spawnSync(process.execPath,['--check',path.join(dist,file)],{encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
}
assert(css.includes('prefers-reduced-motion'),'Reduced motion support required');
assert(css.includes(':focus-visible'),'Keyboard focus styles required');
assert(!css.includes('@import'),'No external stylesheet dependencies');
for(const field of ['name','phone','vehicle','service','message']) assert(html.includes('for="'+field+'"'),'Missing field label: '+field);
assert(html.includes('[Shop address]')&&html.includes('[Phone number]'),'Business placeholders must be explicit');
assert.equal((html.match(/class=\"service-card reveal\"/g)||[]).length,6,'Six paint and bodywork services required');
assert(html.includes('bmw-paintshop-prep-hero.png')&&html.includes('Illustrative workshop image')&&html.includes('ACTUAL WORKSHOP PHOTO')&&html.includes('COMPLETED PAINTWORK PHOTO'),'Paint-preparation BMW hero and clearly labeled real-photo placeholders required');
assert(!/diagnostics|brake repairs|engine repairs|oil changes|routine maintenance/i.test(html),'Mechanical service claims must not appear in the site HTML');
const assets=await Promise.all(['bmw-paintshop-prep-hero.png','craftsmanship.webp'].map(async file=>({file,bytes:(await stat(path.join(dist,'assets',file))).size})));
console.log(JSON.stringify({status:'passed',checks:['Unique IDs','Single main heading','Resolved local assets and anchors','JavaScript syntax','Motion and focus accessibility','No external stylesheet dependencies','Six paint and bodywork service cards','Paint-preparation BMW hero and labeled real-photo placeholders','No mechanical service claims','Form labels','Explicit business placeholders'],assets},null,2));
