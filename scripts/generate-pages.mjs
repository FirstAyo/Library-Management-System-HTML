import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const option=name=>{const i=args.indexOf(name);if(i<0)return undefined;if(!args[i+1]||args[i+1].startsWith('--'))throw new Error(`${name} requires a value.`);return args[i+1];};
const output=resolve(root,option('--out')||'.');
if(output!==root&&output!==resolve(root,'release'))throw new Error('Output must be the project root or release/.');
const site=new URL(option('--site')||process.env.SITE_URL||'http://localhost:4173/');
if(!['http:','https:'].includes(site.protocol))throw new Error('SITE_URL must be an HTTP(S) URL.');
if(site.username||site.password||site.search||site.hash)throw new Error('The site URL must not contain credentials, a query, or a fragment.');
if(!site.pathname.endsWith('/'))site.pathname+='/';
const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const absolute=path=>new URL(path,site.href.endsWith('/')?site.href:site.href+'/').href;
const books=JSON.parse(await readFile(resolve(root,'data/books.json'),'utf8'));
if(new Set(books.map(b=>String(b.id))).size!==books.length||books.some(b=>!/^[-a-zA-Z0-9_]+$/.test(String(b.id))))throw new Error('Book IDs must be unique URL-safe identifiers.');
const pages=[
 ['index.html','index','public','A new chapter. A world of possibilities.','Discover your next great read at Folio Library. Browse our collection, explore new perspectives, and reserve books online.'],
 ['login.html','login','public','Sign in','Sign in to your Folio Library account to view loans, renew books, and manage reservations.'],
 ['register.html','register','public','Join the library','Join Folio Library and begin your next reading journey.'],
 ['logout.html','logout','public','Signed out','You have signed out of Folio Library.'],
 ...[['dashboard','Library overview'],['books','Book collection'],['add-book','Book editor'],['members','Library members'],['issue-book','Issue a book'],['return-book','Loans & returns'],['reservations','Reservations'],['reports','Reports & insights']].map(([page,title])=>[`admin/${page}.html`,page,'admin',title,`${title} in the Folio Library administration workspace.`]),
 ...[['home','Your reading space'],['my-loans','My loans'],['my-reservations','My reservations'],['my-account','My account'],['payments','Fines & payments'],['support','Help & support']].map(([page,title])=>[`client/${page}.html`,page,'member',title,`${title} in your Folio Library account.`]),
 ['client/catalog.html','catalog','public','A shelf for every curiosity','Explore the Folio Library catalog. Search books by title, author, category, or ISBN and discover your next read.'],
 ['client/book-details.html','book-details','public','Book details','Explore book details and availability at Folio Library.'],
];
const cover=(b,i)=>`<div class="book-art cover-${i%6}" aria-hidden="true"><div class="book-cover"><b>${e(b.title)}</b><span>${e(b.author)}</span></div></div>`;
const tiles=items=>`<div class="catalog-grid">${items.map((b,i)=>`<article class="card book-tile">${cover(b,i)}<div class="category">${e(b.category)}</div><h2><a href="${absolute(`books/${b.id}.html`)}">${e(b.title)}</a></h2><p>${e(b.author)}</p><p class="small">View details and sign in to reserve.</p></article>`).join('')}</div>`;
function fallback(page,book){
 if(book)return `<div class="page-label"><a href="${absolute('client/catalog.html')}">Collection</a> / ${e(book.category)}</div><article class="detail-layout">${cover(book,Number(book.id))}<div class="detail-content"><div class="eyebrow">${e(book.category)} · The Folio collection</div><h1>${e(book.title)}</h1><p>by ${e(book.author)}</p><p class="description">${e(book.description||`Discover ${book.title} by ${book.author} in the Folio collection.`)}</p><dl class="metadata"><div><dt>ISBN</dt><dd>${e(book.isbn)}</dd></div><div><dt>Publication year</dt><dd>${book.year}</dd></div></dl><p>Enable JavaScript to check current availability and reserve this book.</p><a class="btn primary" href="${absolute('login.html')}">Sign in to reserve</a></div></article>`;
 if(page==='index')return `<section class="hero"><div><div class="eyebrow">A home for curious minds</div><h1>A new chapter.<br>A world of <em>possibilities.</em></h1><p>Find the stories that stay with you. Explore our collection and discover your next great read.</p><a class="btn primary" href="${absolute('client/catalog.html')}">Explore the collection</a></div><div class="hero-visual">${cover(books[0],0)}</div></section><section id="about"><h2>Worth opening a new chapter</h2><p>Thoughtfully curated. Open to discovery.</p>${tiles(books.slice(0,4))}</section>`;
 if(page==='catalog')return `<h1>A shelf for every curiosity.</h1><p>Explore our collection. Enable JavaScript for search, filters, and current availability.</p>${tiles(books)}`;
 return `<h1>${e(pages.find(p=>p[1]===page)?.[3]||'Folio Library')}</h1><p>Enable JavaScript to use your library workspace.</p>`;
}
async function writePage(path,page,scope,title,description,book){
 const prefix='../'.repeat(path.split('/').length-1)||'./';
 const publicPage=page==='index'||page==='catalog'||Boolean(book);
 const canonical=absolute(path);const fullTitle=book?`${book.title} by ${book.author} | Folio Library`:`${title} | Folio Library`;
 const schema=book?{'@context':'https://schema.org','@type':'Book',name:book.title,author:{'@type':'Person',name:book.author},isbn:book.isbn,datePublished:String(book.year),bookFormat:'https://schema.org/Hardcover',url:canonical,description}:page==='index'?{'@context':'https://schema.org','@type':'WebSite',name:'Folio Library',url:absolute('index.html'),description}:null;
 const html=`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(fullTitle)}</title><meta name="description" content="${e(description.slice(0,160))}">
<meta name="robots" content="${publicPage?'index,follow':'noindex,follow'}"><meta name="theme-color" content="#142333">
<link rel="canonical" href="${e(canonical)}"><link rel="icon" type="image/svg+xml" href="${prefix}common/assets/favicon.svg">
<meta property="og:site_name" content="Folio Library"><meta property="og:type" content="${book?'book':'website'}"><meta property="og:title" content="${e(fullTitle)}"><meta property="og:description" content="${e(description.slice(0,160))}"><meta property="og:url" content="${e(canonical)}"><meta property="og:image" content="${e(absolute('common/assets/social-card.png'))}"><meta property="og:image:alt" content="Folio Library — A home for curious minds">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(fullTitle)}"><meta name="twitter:description" content="${e(description.slice(0,160))}"><meta name="twitter:image" content="${e(absolute('common/assets/social-card.png'))}">
<link rel="stylesheet" href="${prefix}common/css/folio.css"><script src="${prefix}common/js/theme.js"></script><script type="module" src="${prefix}common/js/app.js"></script>
${schema?`<script type="application/ld+json" ${book?'id="book-schema"':''}>${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`:''}
</head><body data-page="${page}" data-scope="${scope}" ${book?`data-book-id="${e(book.id)}"`:''}>
<a class="skip" href="#main">Skip to content</a>
<div id="app"><header class="public-header"><div class="inner"><a class="brand" href="${prefix}index.html"><span class="brand-mark" aria-hidden="true">f</span>folio</a><nav class="public-links" aria-label="Main"><a href="${prefix}client/catalog.html">Explore catalog</a><a href="${prefix}login.html">Sign in</a></nav></div></header><main class="public-main" id="main" tabindex="-1">${fallback(page,book)}</main><footer class="public-footer">Folio Library · A space for curious minds.</footer></div>
<div id="toast" class="toast" role="status" aria-live="polite" aria-atomic="true"></div><dialog id="confirm-dialog" aria-labelledby="dialog-title"></dialog>
<noscript><p class="notice">JavaScript is needed for sign-in, search, and borrowing. Public book details are available without it.</p></noscript>
</body></html>\n`;
 await mkdir(dirname(resolve(output,path)),{recursive:true});
 await writeFile(resolve(output,path),html);
}
await mkdir(resolve(output,'books'),{recursive:true});
for(const p of pages)await writePage(...p);
for(const b of books)await writePage(`books/${b.id}.html`,'book-details','public',b.title,b.description||`Discover ${b.title} by ${b.author}. Explore book details and reserve a copy at Folio Library.`,b);
const publicPaths=['index.html','client/catalog.html',...books.map(b=>`books/${b.id}.html`)];
await writeFile(resolve(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPaths.map(p=>`<url><loc>${e(absolute(p))}</loc></url>`).join('')}</urlset>\n`);
const excluded=['admin/','client/my-','client/home.html','client/payments.html','client/support.html','login.html','register.html','logout.html','data/','tests/','scripts/'];
await writeFile(resolve(output,'robots.txt'),`User-agent: *\nAllow: ${site.pathname}\n${excluded.map(p=>`Disallow: ${site.pathname}${p}`).join('\n')}\nSitemap: ${absolute('sitemap.xml')}\n`);
console.log(`Generated ${pages.length+books.length} pages and sitemap for ${site.origin}.`);
