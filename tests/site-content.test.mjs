import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {runInNewContext} from 'node:vm';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import {createServer} from 'vite';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {pages, retiredPages} from '../src/page-config.ts';
import {createSiteConfig, pageFromPath, submitInquiry} from '../src/site.ts';

const root = path.resolve(import.meta.dirname, '..');

test('a shared team profile edit reaches both pages, Vite and published HTML without a content override', {timeout:120000}, async () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'intelispaces-content-'));
  const originalConfig = globalThis.__INTELISPACES__;
  let server;
  try {
    for (const file of ['src','scripts/build-site.mjs','scripts/site.htaccess','index.html','vite.config.ts','package.json']) {
      fs.mkdirSync(path.dirname(path.join(fixture,file)), {recursive:true});
      fs.cpSync(path.join(root,file), path.join(fixture,file), {recursive:true});
    }
    fs.symlinkSync(fs.realpathSync(path.join(root,'node_modules')), path.join(fixture,'node_modules'), process.platform==='win32'?'junction':'dir');
    const component = path.join(fixture,'src/components/TeamProfiles.tsx');
    const before = fs.readFileSync(component,'utf8');
    const marker = 'Opis zmieniony bezpośrednio w komponencie: <test> & KNX';
    const edited = before.replace(/role: '[^']+'/, `role: ${JSON.stringify(marker)}`);
    assert.notEqual(edited,before,'The test must edit a real visible field');
    fs.writeFileSync(component,edited);
    fs.mkdirSync(path.join(fixture,'content'));
    fs.writeFileSync(path.join(fixture,'content/site.json'),JSON.stringify({obsolete:'STARY TEKST Z EKSPORTU'}));

    server = await createServer({root:fixture, logLevel:'error', server:{host:'127.0.0.1',port:0}});
    await server.listen();
    const {default:App} = await server.ssrLoadModule('/src/App.tsx');
    const escaped = 'Opis zmieniony bezpośrednio w komponencie: &lt;test&gt; &amp; KNX';
    for (const page of ['about', 'team']) {
      globalThis.__INTELISPACES__ = {...createSiteConfig(page,'/',true),values:{'teampage.1923d56770':'STARY TEKST Z EKSPORTU'}};
      const devHtml = renderToString(React.createElement(App));
      assert.ok(devHtml.includes(escaped), page + ' must show the edited profile');
      assert.ok(!devHtml.includes('STARY TEKST Z EKSPORTU'));
    }
    await server.close(); server = undefined;

    for (const preview of [false,true]) {
      const base = preview?'/delitech-darek/Darka/':'/';
      execFileSync(process.execPath,['scripts/build-site.mjs',...(preview?['--preview']:[])],{
        cwd:fixture,env:{...process.env,SITE_BASE:base},stdio:'pipe',timeout:45000,
      });
      const sitemap = fs.readFileSync(path.join(fixture,'dist/sitemap.xml'),'utf8');
      for (const [id,page] of Object.entries(pages)) {
        const html = fs.readFileSync(path.join(fixture,'dist',page.path,'index.html'),'utf8');
        if (retiredPages[id]) {
          assert.ok(!sitemap.includes(`<loc>https://intelispaces.pl${page.path}</loc>`));
          assert.match(html, /name="robots" content="noindex"/);
          assert.ok(!html.includes('id="root"'), 'A retired category must not publish its content');
          continue;
        }
        for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
          if (href.startsWith(base)) assert.doesNotMatch(href.slice(base.length), /^(?:homes|offices)(?:\/|#|$)/);
        }
        assert.ok(html.includes(`<title>${page.title}</title>`));
        assert.ok(!html.includes('/wp-content/') && !html.includes('STARY TEKST Z EKSPORTU'));
        const config = JSON.parse(html.match(/globalThis\.__INTELISPACES__=(.*?);<\/script>/)[1]);
        assert.equal(config.preview,preview);
        assert.equal(config.endpoint,preview?undefined:'https://knx.intelispaces.pl/api/inquiries');
        assert.ok(!Object.hasOwn(config,'values'));
        assert.equal(config.urls.team,base+'team/');
        assert.equal(config.plannerUrl,preview?base+'projektant-knx/':'https://knx.intelispaces.pl/');
      }
      for (const [route, hash, target] of [
        ['homes','','solutions/#sceny'], ['homes','#rytm-dnia','solutions/#sceny'],
        ['homes','#etapy','solutions/#etapy'], ['homes','#koszt','knowledge/#koszt'],
        ['offices','#smart-workspace','contact/'], ['offices/proav','','contact/'],
      ]) {
        const html = fs.readFileSync(path.join(fixture,'dist',route,'index.html'),'utf8');
        const script = html.match(/<script>(.*?)<\/script>/s)[1];
        let destination;
        runInNewContext(script, {location:{hash, replace(url) { destination = url; }}});
        assert.equal(destination, base + target);
        const [nextPage, anchor] = target.split('#');
        const next = fs.readFileSync(path.join(fixture,'dist',nextPage,'index.html'),'utf8');
        if (anchor) assert.ok(next.includes(`id="${anchor}"`), 'Missing destination: '+target);
      }
      for (const page of ['about', 'team']) {
        assert.ok(fs.readFileSync(path.join(fixture,'dist',page,'index.html'),'utf8').includes(escaped));
      }
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
