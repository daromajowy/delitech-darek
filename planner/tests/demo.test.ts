import {test} from 'node:test';
import assert from 'node:assert/strict';
import {demoFetch} from '../src/demo';

test('preview saves in memory, detects conflicts and never calls an external API', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {throw new Error('Demo contacted the network');};
  try {
    const list = await (await demoFetch('projects')).json();
    const project = list.projects[0];
    assert.equal(project.name, 'Dom pokazowy · podgląd');
    const response = await demoFetch('save', {method:'POST',body:JSON.stringify({...project,name:'Test podglądu'})});
    assert.equal(response.status,200);
    const saved = (await response.json()).project;
    assert.equal(saved.revision,project.revision+1);
    assert.equal((await demoFetch('save',{method:'POST',body:JSON.stringify(project)})).status,409);
    const form = new FormData();
    form.append('file',new File(['%PDF-test'],'plan.pdf',{type:'application/pdf'}));
    const upload = await demoFetch(`upload&project=${project.id}&id=demo-file`, {method:'POST',body:form});
    assert.equal(upload.status,200);
    assert.equal(await (await demoFetch('file&id=demo-file')).text(),'%PDF-test');
    assert.equal((await demoFetch('submit',{method:'POST',body:JSON.stringify({id:project.id})})).status,422);
    assert.equal((await demoFetch('remove-file',{method:'POST',body:JSON.stringify({project:project.id,id:'demo-file'})})).status,200);
    assert.equal((await demoFetch('file&id=demo-file')).status,404);
  } finally {
    globalThis.fetch=originalFetch;
  }
});
