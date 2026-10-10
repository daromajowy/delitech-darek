import fs from 'node:fs';
import path from 'node:path';
import {build as viteBuild} from 'vite';
import {build as esbuild} from 'esbuild';
import {renderToString} from 'react-dom/server';
import React from 'react';
import {pages} from '../src/page-config.ts';
import {createSiteConfig} from '../src/site.ts';

const preview = process.argv.includes('--preview');
const base = process.env.SITE_BASE || '/';
if (!/^\/(?:[\w-]+\/)*$/.test(base)) throw new Error('Invalid SITE_BASE');
const out = 'dist';
await viteBuild({base, build:{outDir:out, emptyOutDir:true, manifest:true, rollupOptions:{input:'src/main.tsx'}}});
fs.mkdirSync(`${out}/media`, {recursive:true});
for (const name of fs.readdirSync('src/assets/images')) fs.copyFileSync(`src/assets/images/${name}`, `${out}/media/${name}`);
fs.copyFileSync('src/assets/jung-ls-touch-3-23.mp4', `${out}/media/jung-ls-touch-3-23.mp4`);
await esbuild({entryPoints:['src/App.tsx'], bundle:true, platform:'node', format:'esm', outfile:'.ssr-app.mjs', loader:{'.css':'empty'}, packages:'external', plugins:[{name:'static-media',setup(build){build.onLoad({filter:/\.(jpg|jpeg|png|webp|mp4)$/}, args=>({contents:`export default ${JSON.stringify(base+'media/'+path.basename(args.path))}`,loader:'js'}));}}]});
const App = (await import('../.ssr-app.mjs?'+Date.now())).default;
const entry = JSON.parse(fs.readFileSync(`${out}/.vite/manifest.json`, 'utf8'))['src/main.tsx'];
const htmlEscape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for (const [key,page] of Object.entries(pages)) {
  const config = createSiteConfig(key, base, preview);
  globalThis.__INTELISPACES__ = config;
  let html = fs.readFileSync('index.html','utf8');
  html = html.replace(/<title>.*?<\/title>/s, `<title>${htmlEscape(page.title)}</title>`)
    .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*"/g, `$1${htmlEscape(page.description)}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${htmlEscape(page.title)}"`)
    .replace('</head>', `<link rel="canonical" href="https://intelispaces.pl${page.path}">${preview?'<meta name="robots" content="noindex,nofollow,noarchive">':''}${(entry.css||[]).map(file=>`<link rel="stylesheet" href="${base+file}">`).join('')}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderToString(React.createElement(App))}</div>`)
    .replace('<script type="module" src="/src/main.tsx"></script>', `<script>globalThis.__INTELISPACES__=${JSON.stringify(config).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')};</script><script type="module" src="${base+entry.file}"></script>`);
  const folder = path.join(out,page.path);
  fs.mkdirSync(folder,{recursive:true}); fs.writeFileSync(path.join(folder,'index.html'),html);
}
delete globalThis.__INTELISPACES__;
fs.writeFileSync(`${out}/robots.txt`, preview?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nSitemap: https://intelispaces.pl/sitemap.xml\n');
fs.writeFileSync(`${out}/sitemap.xml`, '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.values(pages).map(page=>`<url><loc>https://intelispaces.pl${page.path}</loc></url>`).join('')+'</urlset>');
fs.writeFileSync(`${out}/404.html`, '<!doctype html><html lang="pl"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Nie znaleziono strony</title><h1>Nie znaleziono strony</h1><p><a href="'+base+'">Wróć do InteliSpaces</a></p></html>');
if (!preview) fs.copyFileSync('scripts/site.htaccess', `${out}/.htaccess`);
console.log(`Built ${Object.keys(pages).length} static pages; ${preview?'preview':'production'} ${base}`);
