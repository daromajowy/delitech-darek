import fs from 'node:fs';
import path from 'node:path';
import {build as viteBuild} from 'vite';
import {build as esbuild} from 'esbuild';
import {renderToString} from 'react-dom/server';
import React from 'react';

const target='wordpress/intelispaces';
await viteBuild({build:{outDir:target+'/dist',emptyOutDir:true,manifest:true,rollupOptions:{input:'src/main.tsx'}}});
fs.mkdirSync(target+'/media',{recursive:true});
for(const file of fs.readdirSync('src/assets/images')) fs.copyFileSync('src/assets/images/'+file,target+'/media/'+file);
fs.copyFileSync('src/assets/jung-ls-touch-3-23.mp4',target+'/media/jung-ls-touch-3-23.mp4');
await esbuild({entryPoints:['src/App.tsx'],bundle:true,platform:'node',format:'esm',outfile:'.ssr-app.mjs',packages:'external',plugins:[{name:'theme-media',setup(build){build.onLoad({filter:/\.(jpg|png|mp4)$/},args=>({contents:`export default ${JSON.stringify('__IS_THEME__/media/'+path.basename(args.path))}`,loader:'js'}));}}]});
const App=(await import('../.ssr-app.mjs?'+Date.now())).default;
const seed=JSON.parse(fs.readFileSync(target+'/content-seed.json','utf8'));
const values=Object.fromEntries(Object.values(seed).flat().map(field=>[field.key,'__IS_'+field.key+'__']));
fs.mkdirSync(target+'/templates',{recursive:true});
for(const page of ['home','architects','homes','offices','about','team','projects','solutions','knowledge','knx','contact','custom']){
  globalThis.__INTELISPACES__={page,values,urls:{},additional:'__IS_ADDITIONAL__'};
  fs.writeFileSync(target+'/templates/'+page+'.html',renderToString(React.createElement(App)));
}
delete globalThis.__INTELISPACES__;
console.log('WordPress theme + 12 server-rendered templates ready.');
