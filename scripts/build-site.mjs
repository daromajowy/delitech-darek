import fs from 'node:fs';
import path from 'node:path';
import {build as viteBuild} from 'vite';
import {build as esbuild} from 'esbuild';
import {renderToString} from 'react-dom/server';
import React from 'react';
import {pages, retiredPages} from '../src/page-config.ts';
import {createSiteConfig} from '../src/site.ts';

const preview = process.argv.includes('--preview');
const base = process.env.SITE_BASE || '/';
if (!/^\/(?:[\w-]+\/)*$/.test(base)) throw new Error('Invalid SITE_BASE');
const out = 'dist';
await viteBuild({base, build:{outDir:out, emptyOutDir:true, manifest:true, rollupOptions:{input:'src/main.tsx'}}});
fs.mkdirSync(`${out}/media`, {recursive:true});
for (const name of fs.readdirSync('src/assets/images')) fs.copyFileSync(`src/assets/images/${name}`, `${out}/media/${name}`);
for (const name of fs.readdirSync('src/assets')) if (name.endsWith('.mp4')) fs.copyFileSync(`src/assets/${name}`, `${out}/media/${name}`);
await esbuild({entryPoints:['src/App.tsx'], bundle:true, platform:'node', format:'esm', outfile:'.ssr-app.mjs', loader:{'.css':'empty'}, packages:'external', plugins:[{name:'static-media',setup(build){build.onLoad({filter:/\.(jpg|jpeg|png|webp|mp4)$/}, args=>({contents:`export default ${JSON.stringify(base+'media/'+path.basename(args.path))}`,loader:'js'}));}}]});
const App = (await import('../.ssr-app.mjs?'+Date.now())).default;
const entry = JSON.parse(fs.readFileSync(`${out}/.vite/manifest.json`, 'utf8'))['src/main.tsx'];
const htmlEscape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for (const [key,page] of Object.entries(pages)) {
  const folder = path.join(out,page.path);
  fs.mkdirSync(folder,{recursive:true});
  if (retiredPages[key]) {
    const targets = Object.fromEntries(Object.entries(retiredPages[key]).map(([hash, target]) => [hash, base + target]));
    const fallback = htmlEscape(targets['']);
    const redirects = JSON.stringify(targets).replace(/</g,'\\u003c');
    fs.writeFileSync(path.join(folder,'index.html'), `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Strona przeniesiona | InteliSpaces</title><script>const urls=${redirects}, hash=location.hash.slice(1);location.replace(Object.hasOwn(urls,hash)?urls[hash]:urls['']);</script><noscript><meta http-equiv="refresh" content="0;url=${fallback}"></noscript></head><body><a href="${fallback}">Przejdź do aktualnej strony InteliSpaces</a></body></html>`);
    continue;
  }
  const config = createSiteConfig(key, base, preview);
  globalThis.__INTELISPACES__ = config;
  let html = fs.readFileSync('index.html','utf8');
  html = html.replace(/<title>.*?<\/title>/s, `<title>${htmlEscape(page.title)}</title>`)
    .replace(/(<meta (?:name="(?:description|twitter:description)"|property="og:description") content=")[^"]*"/g, `$1${htmlEscape(page.description)}"`)
    .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*"/g, `$1${htmlEscape(page.title)}"`)
    .replace('</head>', `<link rel="canonical" href="https://intelispaces.pl${page.path}">${preview?'<meta name="robots" content="noindex,nofollow,noarchive">':''}${(entry.css||[]).map(file=>`<link rel="stylesheet" href="${base+file}">`).join('')}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderToString(React.createElement(App))}</div>`)
    .replace('<script type="module" src="/src/main.tsx"></script>', `<script>globalThis.__INTELISPACES__=${JSON.stringify(config).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')};</script><script type="module" src="${base+entry.file}"></script>`);
  fs.writeFileSync(path.join(folder,'index.html'),html);
}
delete globalThis.__INTELISPACES__;
fs.writeFileSync(`${out}/robots.txt`, preview?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nSitemap: https://intelispaces.pl/sitemap.xml\n');
const published = Object.entries(pages).filter(([key]) => !retiredPages[key]);
fs.writeFileSync(`${out}/sitemap.xml`, '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+published.map(([,page])=>`<url><loc>https://intelispaces.pl${page.path}</loc></url>`).join('')+'</urlset>');
fs.writeFileSync(`${out}/404.html`, '<!doctype html><html lang="pl"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Nie znaleziono strony</title><h1>Nie znaleziono strony</h1><p><a href="'+base+'">Wróć do InteliSpaces</a></p></html>');
if (!preview) fs.copyFileSync('scripts/site.htaccess', `${out}/.htaccess`);
console.log(`Built ${published.length} static pages and ${Object.keys(retiredPages).length} redirects; ${preview?'preview':'production'} ${base}`);
