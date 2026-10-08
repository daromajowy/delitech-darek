import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import {createServer} from 'vite';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {pages} from '../src/page-config.ts';
import {createSiteConfig, pageFromPath, submitInquiry} from '../src/site.ts';

const root = path.resolve(import.meta.dirname, '..');

test('a component edit reaches Vite, production HTML and branch previews without a content override', {timeout:120000}, async () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'intelispaces-content-'));
  const originalConfig = globalThis.__INTELISPACES__;
  let server;
  try {
    for (const file of ['src','scripts/build-site.mjs','scripts/site.htaccess','index.html','vite.config.ts','package.json']) {
      fs.mkdirSync(path.dirname(path.join(fixture,file)), {recursive:true});
      fs.cpSync(path.join(root,file), path.join(fixture,file), {recursive:true});
    }
    fs.symlinkSync(fs.realpathSync(path.join(root,'node_modules')), path.join(fixture,'node_modules'), process.platform==='win32'?'junction':'dir');
    const component = path.join(fixture,'src/pages/TeamPage.tsx');
    const before = fs.readFileSync(component,'utf8');
    const marker = 'Opis zmieniony bezpośrednio w komponencie: <test> & KNX';
    const edited = before.replace(/role: "[^"]+"/, `role: ${JSON.stringify(marker)}`);
    assert.notEqual(edited,before,'The test must edit a real visible field');
    fs.writeFileSync(component,edited);
    fs.mkdirSync(path.join(fixture,'content'));
    fs.writeFileSync(path.join(fixture,'content/site.json'),JSON.stringify({obsolete:'STARY TEKST Z EKSPORTU'}));

    server = await createServer({root:fixture, logLevel:'error', server:{host:'127.0.0.1',port:0}});
    await server.listen();
    const {default:App} = await server.ssrLoadModule('/src/App.tsx');
    globalThis.__INTELISPACES__ = {...createSiteConfig('team','/',true),values:{'teampage.1923d56770':'STARY TEKST Z EKSPORTU'}};
    const devHtml = renderToString(React.createElement(App));
    const escaped = 'Opis zmieniony bezpośrednio w komponencie: &lt;test&gt; &amp; KNX';
    assert.ok(devHtml.includes(escaped));
    assert.ok(!devHtml.includes('STARY TEKST Z EKSPORTU'));
    await server.close(); server = undefined;

    for (const preview of [false,true]) {
      const base = preview?'/delitech-darek/Darka/':'/';
      execFileSync(process.execPath,['scripts/build-site.mjs',...(preview?['--preview']:[])],{
        cwd:fixture,env:{...process.env,SITE_BASE:base},stdio:'pipe',timeout:45000,
      });
      for (const page of Object.values(pages)) {
        const html = fs.readFileSync(path.join(fixture,'dist',page.path,'index.html'),'utf8');
        assert.ok(html.includes(`<title>${page.title}</title>`));
        assert.ok(!html.includes('/wp-content/') && !html.includes('STARY TEKST Z EKSPORTU'));
        const config = JSON.parse(html.match(/globalThis\.__INTELISPACES__=(.*?);<\/script>/)[1]);
        assert.equal(config.preview,preview);
        assert.equal(config.endpoint,preview?undefined:'https://knx.intelispaces.pl/api/inquiries');
        assert.ok(!Object.hasOwn(config,'values'));
        assert.equal(config.urls.team,base+'team/');
        assert.equal(config.plannerUrl,preview?base+'projektant-knx/':'https://knx.intelispaces.pl/');
      }
      assert.ok(fs.readFileSync(path.join(fixture,'dist/team/index.html'),'utf8').includes(escaped));
    }
  } finally {
    await server?.close();
    if (originalConfig===undefined) delete globalThis.__INTELISPACES__;
    else globalThis.__INTELISPACES__=originalConfig;
    assert.ok(path.resolve(fixture).startsWith(path.resolve(os.tmpdir())+path.sep+'intelispaces-content-'));
    fs.rmSync(fixture,{recursive:true,force:true});
  }
});

test('deep links select the same page locally and under a branch prefix; previews cannot send inquiries', async () => {
  for (const base of ['/','/delitech-darek/Janka/','/delitech-darek/Darka/']) {
    for (const [key,page] of Object.entries(pages)) {
      assert.equal(pageFromPath(base+page.path.slice(1),base),key);
    }
  }
  const originalConfig=globalThis.__INTELISPACES__;
  try {
    globalThis.__INTELISPACES__=createSiteConfig('contact','/',true);
    await assert.rejects(submitInquiry({}),/To podgląd strony/);
  } finally {
    if(originalConfig===undefined) delete globalThis.__INTELISPACES__;
    else globalThis.__INTELISPACES__=originalConfig;
  }
});
