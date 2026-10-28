import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addControlPoint, duplicateRoom, exampleProject, normalizeProject, selectSensor, uid } from '../src/model';
import { addTouchFunction, addTouchPage, ensureTouchPages, removeTouchPage, resizeTouchPage, touchPages } from '../src/touch-pages';
import { buildXlsx } from '../src/exports';
import ExcelJS from 'exceljs';

test('legacy LS TOUCH retains all 24 bindings while migrating the first 20 to five pages', () => {
  const p = exampleProject(), pt = p.points[0];
  pt.sensor = 'JUNG LS TOUCH';
  pt.bindings = Array.from({ length: 24 }, (_, i) => ({ id: uid(), target: pt.bindings[0].target, action: 'Włącz', label: `Pole ${i + 1}` }));
  const restored = normalizeProject(p), saved = restored.points[0];
  assert.deepEqual(saved.bindings, pt.bindings);
  assert.equal(saved.panelPages?.length, 5);
  assert.deepEqual(saved.panelPages?.flatMap(page => page.bindingIds), saved.bindings.slice(0, 20).map(b => b.id));
  assert.equal(pt.panelPages, undefined);
  assert.deepEqual(normalizeProject(JSON.parse(JSON.stringify(restored))), restored);
});

test('resizing and deleting a page preserve assignments, long presses and remaining pages', () => {
  const p = exampleProject(), pt = p.points[0];
  selectSensor(pt, 'JUNG LS TOUCH');
  const original = structuredClone(pt.bindings);
  const second = addTouchPage(pt)!;
  second.name = 'Rolety';
  const secondIds = [...second.bindingIds];
  resizeTouchPage(pt, second.id, 1);
  resizeTouchPage(pt, second.id, 4);
  assert.deepEqual(second.bindingIds, secondIds);
  removeTouchPage(pt, second.id);
  assert.deepEqual(pt.bindings.slice(0, 4), original);
  assert.equal(pt.bindings.length, 8);
  const first = touchPages(pt)[0];
  removeTouchPage(pt, first.id);
  assert.equal(touchPages(pt).length, 1);
  assert.deepEqual(addTouchPage(pt)?.bindingIds, secondIds);
});

test('page and function limits hold, and shrinking the function list repairs page references', () => {
  const pt = exampleProject().points[0];
  selectSensor(pt, 'JUNG LS TOUCH');
  while (addTouchPage(pt)) { /* Fill the five favourite pages. */ }
  assert.equal(touchPages(pt).length, 5);
  while (addTouchFunction(pt)) { /* Fill the function menu. */ }
  assert.equal(pt.bindings.length, 32);
  assert.equal(addTouchPage(pt), undefined);
  resizeTouchPage(pt, touchPages(pt)[0].id, 5);
  assert.equal(touchPages(pt)[0].bindingIds.length, 4);
  pt.bindings = pt.bindings.slice(0, 1);
  ensureTouchPages(pt);
  assert.ok(touchPages(pt).every(page => page.bindingIds.length === 1 && page.bindingIds[0] === pt.bindings[0].id));
});

test('point and room duplication remap pages to new functions and room targets', () => {
  const p = exampleProject(), original = p.points[0];
  selectSensor(original, 'JUNG LS TOUCH');
  addTouchPage(original);
  const copy = addControlPoint(p, original.roomId, original);
  const check = (clone: typeof original) => {
    assert.ok(clone.panelPages!.every(page => !original.panelPages!.some(old => old.id === page.id)));
    assert.deepEqual(clone.panelPages!.map(page => page.bindingIds.map(id => clone.bindings.findIndex(b => b.id === id))), original.panelPages!.map(page => page.bindingIds.map(id => original.bindings.findIndex(b => b.id === id))));
    assert.ok(clone.bindings.every(b => !original.bindings.some(old => old.id === b.id)));
  };
  check(copy);
  const duplicated = duplicateRoom(p, original.roomId);
  const roomCopy = duplicated.rooms.at(-1)!;
  const pointCopy = duplicated.points.find(pt => pt.roomId === roomCopy.id)!;
  check(pointCopy);
  assert.ok(roomCopy.circuits.some(c => c.id === pointCopy.bindings[0].target));
});

test('XLSX includes page names, positions and function references without losing shared bindings', async () => {
  const p = exampleProject(), pt = p.points[0];
  selectSensor(pt, 'JUNG LS TOUCH');
  const page = addTouchPage(pt)!;
  page.name = 'Wieczór';
  page.bindingIds = [pt.bindings[0].id];
  pt.bindings[0].label = 'Lampa nad stołem';
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(await (await buildXlsx(p)).arrayBuffer());
  const sheet = book.getWorksheet('Podstrony LS TOUCH')!;
  assert.equal(sheet.rowCount, 6);
  assert.equal(sheet.getCell('B6').value, '2. Wieczór');
  assert.equal(sheet.getCell('D6').value, 1);
  assert.equal(sheet.getCell('E6').value, 'Lampa nad stołem');
  assert.ok(book.getWorksheet('Sterowanie')!.rowCount > pt.bindings.length);
});
