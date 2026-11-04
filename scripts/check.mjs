import { readdir, readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');let errors=[];let pages=0;
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){if(entry.name.startsWith('.')||['node_modules','release'].includes(entry.name))continue;const path=resolve(dir,entry.name);if(entry.isDirectory()){await walk(path);continue;}if(/\.(js|mjs)$/.test(path))execFileSync(process.execPath,['--check',path]);if(!path.endsWith('.html'))continue;pages++;const html=await readFile(path,'utf8');for(const feature of ['<title>','name="description"','rel="canonical"','name="robots"','<main','Skip to content','aria-live="polite"'])if(!html.includes(feature))errors.push(`${path}: missing ${feature}`);if((html.match(/<h1[\s>]/g)||[]).length!==1)errors.push(`${path}: expected one initial H1`);for(const match of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)){const ref=match[1];if(/^(https?:|mailto:|data:)/.test(ref))continue;try{await access(resolve(dirname(path),ref));}catch{errors.push(`${path}: broken reference ${ref}`);}}}}
await walk(root);
const books=JSON.parse(await readFile(resolve(root,'data/books.json'),'utf8'));
for(const b of books){const html=await readFile(resolve(root,`books/${b.id}.html`),'utf8');if(!html.includes('application/ld+json')||!html.includes(b.title.replace(/&/g,'&amp;')))errors.push(`Book ${b.id}: missing prerendered data`);const raw=html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];try{const schema=JSON.parse(raw);if(schema.name!==b.title||schema['@type']!=='Book')errors.push(`Book ${b.id}: incorrect structured data`);}catch{errors.push(`Book ${b.id}: invalid structured data`);}}
const social=await readFile(resolve(root,'common/assets/social-card.png'));
if(social.readUInt32BE(16)!==1200||social.readUInt32BE(20)!==630)errors.push('Social image must be 1200 x 630.');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Checked ${pages} HTML pages, local asset links, metadata, prerendered book content, and JavaScript syntax.`);
