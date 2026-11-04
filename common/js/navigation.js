// Keep post-login redirects within this template and away from auth loops.
export function destination(next, user, root) {
  const fallback = new URL(user.role === 'admin' ? 'admin/dashboard.html' : 'client/home.html', root).href;
  if (!next) return fallback;
  try {
    const target = new URL(next, root);
    if (target.origin !== root.origin || !target.pathname.startsWith(root.pathname)) return fallback;
    const path = target.pathname.slice(root.pathname.length);
    if (!/^(index\.html|client\/[a-z-]+\.html|admin\/[a-z-]+\.html|books\/[a-z0-9-]+\.html)$/.test(path)) return fallback;
    if (user.role !== 'admin' && path.startsWith('admin/')) return fallback;
    return target.href;
  } catch { return fallback; }
}
