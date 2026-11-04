import { config } from './config.js';
import { services as S } from './services/index.js';
import { esc, url, root, icon, link, head } from './view.js';
import { destination as safeDestination } from './navigation.js';
import { renderPublic } from './pages-public.js';
import { renderAdmin } from './pages-admin.js';
import { renderMember } from './pages-member.js';
const page = document.body.dataset.page;
const scope = document.body.dataset.scope;
document.documentElement.dataset.apiMode = config.mode;
const adminLinks = [['dashboard','Overview','grid'],['books','Books','book'],['members','Members','users'],['issue-book','Issue a book','issue'],['return-book','Returns','return'],['reservations','Reservations','bookmark'],['reports','Reports & insights','chart']];
const userLinks = [['home','Overview','grid'],['catalog','Discover books','book'],['my-loans','My loans','clock'],['my-reservations','Reservations','bookmark'],['my-account','My account','user'],['payments','Fines & payments','card'],['support','Help & support','help']];
const names = Object.fromEntries((scope === 'admin' ? adminLinks : userLinks).map(x => [x[0],x[1]]));
const brand = `<a class="brand" href="${url('index.html')}" aria-label="Folio library home"><span class="brand-mark" aria-hidden="true">f</span>folio<span class="sr-only"> Library</span></a>`;
let user;
function theme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach(b => { b.innerHTML = icon(dark ? 'sun' : 'moon'); b.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`); b.onclick = () => { document.documentElement.dataset.theme = dark ? 'light' : 'dark'; localStorage.setItem('lms_theme', dark ? 'light' : 'dark'); theme(); }; });
}
function shell() {
  const host = document.getElementById('app'); const initials = esc(user?.name?.split(' ').map(n => n[0]).slice(0,2).join('') || 'FL');
  if (scope === 'admin' || scope === 'member') {
    const links = scope === 'admin' ? adminLinks : userLinks; const directory = scope === 'admin' ? 'admin' : 'client';
    host.innerHTML = `<aside class="sidebar" id="sidebar" aria-label="${scope === 'admin' ? 'Administration' : 'Member'} navigation">${brand}<div class="brand-sub">${scope === 'admin' ? 'Library workspace' : 'Your reading space'}</div><nav class="side-links" aria-label="Main">${links.map(([p,label,i]) => `<a href="${url(`${directory}/${p}.html`)}" ${page === p || (page === 'add-book' && p === 'books') ? 'class="active" aria-current="page"' : ''}>${icon(i)}${label}</a>`).join('')}</nav><div class="side-bottom"><div class="side-links">${link('client/catalog.html', 'Explore the catalog', '', 'search')}<a href="${url('logout.html')}">${icon('logout')}Sign out</a></div><div class="side-note"><strong>A little more discovery.</strong>Your next great read is waiting on the shelves.</div><div class="side-profile"><span class="avatar">${initials}</span><div><strong>${esc(user.name)}</strong><small>${scope === 'admin' ? 'Library administrator' : 'Library member'}</small></div></div></div></aside><div class="main-shell"><header class="topbar"><div class="flex"><button class="icon-btn mobile-menu" aria-label="Open navigation" aria-controls="sidebar" aria-expanded="false" id="menu-toggle">${icon('menu')}</button><span class="topbar-title">${scope === 'admin' ? 'Library management' : 'My library'}</span></div><div class="flex"><a class="search-link" href="${url('client/catalog.html')}">${icon('search')}Find your next read</a>${config.mode === 'demo' ? '<span class="mode-pill">Demo workspace</span>' : ''}<button class="icon-btn" data-theme-toggle></button><span class="avatar" aria-label="${esc(user.name)}">${initials}</span></div></header><main class="workspace" id="main" tabindex="-1"><div class="page-label">${scope === 'admin' ? 'Workspace' : 'My library'}<span>/</span>${esc(names[page] || 'Book editor')}</div><div id="content"></div></main><footer class="app-footer"><span>© ${new Date().getFullYear()} Folio Library</span><span class="optional">A world of stories. One library.</span></footer></div>`;
    const toggle = document.getElementById('menu-toggle'), sidebar = document.getElementById('sidebar');
    const closeMenu = () => { sidebar.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.focus(); };
    toggle.onclick = () => { const open = sidebar.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); if (open) sidebar.querySelector('a').focus(); };
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu(); if (e.key === 'Tab' && sidebar.classList.contains('open')) { const list = [...sidebar.querySelectorAll('a,button')]; if (e.shiftKey && document.activeElement === list[0]) { e.preventDefault(); list.at(-1).focus(); } else if (!e.shiftKey && document.activeElement === list.at(-1)) { e.preventDefault(); list[0].focus(); } } });
    document.addEventListener('click', e => { if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
  } else {
    host.innerHTML = `<header class="public-header"><div class="inner">${brand}<nav class="public-links" aria-label="Main"><a href="${url('client/catalog.html')}">Explore catalog</a><a class="optional" href="${url('index.html#about')}">Our library</a><button class="icon-btn" data-theme-toggle></button>${link(user ? user.role === 'admin' ? 'admin/dashboard.html' : 'client/home.html' : 'login.html', user ? 'My workspace' : 'Sign in', 'btn primary')}</nav></div></header><main class="public-main" id="main" tabindex="-1"><div id="content"></div></main><footer class="public-footer"><span>© ${new Date().getFullYear()} Folio Library. A space for curious minds.</span><div class="flex">${link('client/catalog.html','Catalog','')}${link('client/support.html','Help & support','')}</div></footer>`;
  }
  theme();
}
function loginRedirect() { const next = location.pathname + location.search; location.replace(url(`login.html?next=${encodeURIComponent(next)}`)); }
document.addEventListener('session-expired', loginRedirect);
const destination = (next, currentUser) => safeDestination(next, currentUser, root);
document.addEventListener('profile-updated', event => {
  user.name = event.detail.name;
  const initials = user.name.split(' ').map(n => n[0]).slice(0,2).join('');
  document.querySelectorAll('.side-profile strong').forEach(el => el.textContent = user.name);
  document.querySelectorAll('.side-profile .avatar,.topbar .avatar').forEach(el => { el.textContent = initials; el.setAttribute('aria-label',user.name); });
});
async function start() {
  try {
    // theme.js applies the initial theme before first paint.
    try { user = await S.session(); } catch(e) { if (e.status !== 401) throw e; }
    if ((scope === 'admin' || scope === 'member') && !user) { loginRedirect(); return; }
    if (scope === 'admin' && user.role !== 'admin') { location.replace(url('client/home.html')); return; }
    shell();
    const content = document.getElementById('content');
    content.innerHTML = '<div aria-live="polite" aria-busy="true"><p class="sr-only">Loading library…</p><div class="loading-grid" aria-hidden="true"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div></div>';
    if (scope === 'admin') await renderAdmin(page, content, user);
    else if (scope === 'member') await renderMember(page, content, user);
    else await renderPublic(page, content, user, destination);
  } catch (error) {
    if (error.status === 401) { loginRedirect(); return; }
    const content = document.getElementById('content') || document.getElementById('app');
    content.innerHTML = `<div class="error-page card pad">${head('Let’s try that again', error.message)}<button class="btn primary" id="retry">Retry</button> ${link('index.html','Library home')}</div>`;
    document.getElementById('retry').onclick = () => location.reload();
  }
}
start();
