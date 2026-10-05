import {test} from 'node:test';
import assert from 'node:assert/strict';
import {applyContent,cmsText,cmsImage,validGuide,validProject} from '../src/cms/content.ts';
import {guides} from '../src/content/guides.ts';
import fs from 'node:fs';
const projects=JSON.parse(fs.readFileSync(new URL('../cms-data/projects.json',import.meta.url),'utf8'));
const data={pages:[{entries:[{key:'test-heading',value:'Zmieniony nagłówek'}]}],images:[{key:'hero',url:'https://cdn.sanity.io/images/test/production/photo.jpg'}],guides,projects};
test('existing guides and projects satisfy the publishing contract',()=>{
 assert.ok(guides.every(validGuide));assert.ok(projects.every(validProject));
});
test('published copy and image replace fallbacks, missing fields retain original copy',()=>{
 applyContent(data);assert.equal(cmsText('test-heading','fallback'),'Zmieniony nagłówek');assert.equal(cmsText('unknown','original'),'original');assert.equal(cmsImage('hero','fallback'),data.images[0].url);
});
test('malformed publication cannot replace the last usable snapshot',()=>{
 assert.throws(()=>applyContent({...data,guides:[{title:'Incomplete'}]}));
 assert.equal(cmsText('test-heading','fallback'),'Zmieniony nagłówek');
 assert.throws(()=>applyContent({...data,pages:[null]}));
});
test('unsafe article links and third-party image overrides are rejected',()=>{
 assert.equal(validGuide({...guides[0],sources:[{title:'Bad',url:'javascript:alert(1)'}]}),false);
 applyContent({...data,images:[{key:'hero',url:'https://untrusted.example/image.jpg'}]});
 assert.equal(cmsImage('hero','original'),'original');
});
