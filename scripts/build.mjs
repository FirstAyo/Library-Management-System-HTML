import { mkdir, cp, rm, readFile } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const index=process.argv.indexOf('--site');
if(index<0||!process.argv[index+1])throw new Error('Provide the public deployment URL: npm run build -- --site https://your-domain/');
const site=new URL(process.argv[index+1]);
if(!['https:','http:'].includes(site.protocol)||site.username||site.password||site.search||site.hash)throw new Error('Provide a public HTTP(S) site URL without credentials, query, or fragment.');
const release=resolve(root,'release');
// This directory contains generated output only. Verify its fixed target before replacing it.
if(release!==root+sep+'release')throw new Error('Invalid release path.');
await rm(release,{recursive:true,force:true});await mkdir(release,{recursive:true});
await mkdir(resolve(release,'common/css'),{recursive:true});
await cp(resolve(root,'common/css/folio.css'),resolve(release,'common/css/folio.css'));
for(const folder of ['common/assets','data'])await cp(resolve(root,folder),resolve(release,folder),{recursive:true});
const modules=['app.js','api.js','config.js','navigation.js','view.js','theme.js','pages-public.js','pages-admin.js','pages-member.js','services/index.js','services/demo.js'];
for(const file of modules){const dest=resolve(release,'common/js',file);await mkdir(dirname(dest),{recursive:true});await cp(resolve(root,'common/js',file),dest);}
execFileSync(process.execPath,[resolve(root,'scripts/generate-pages.mjs'),'--out','release','--site',site.href],{stdio:'inherit'});
const html=await readFile(resolve(release,'index.html'),'utf8');
if(!html.includes(site.origin)||html.includes('http://localhost:4173'))throw new Error('Production metadata generation failed.');
console.log(`Static release prepared in ${release}. No files were published.`);
