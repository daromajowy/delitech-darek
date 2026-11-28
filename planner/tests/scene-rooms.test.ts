import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { exampleProject, newCircuit, newScene, normalizeProject, duplicateRoom, removeTargets } from '../src/model';
import { addSceneRoom, forgetSceneRoom, removeSceneRoom, sceneRoomIds, sceneRoomsLabel } from '../src/scene-rooms';
import { reviewItems, simulate, suggestedScene } from '../src/behavior';
import { buildXlsx } from '../src/exports';

test('legacy scenes reveal all directly controlled rooms without modifying saved data', () => {
  const p = normalizeProject(exampleProject()), scene = p.scenes.find(s => s.name === 'Kino')!;
  scene.roomId = p.rooms[0].id;
  p.rooms[1].circuits.push(newCircuit('Oświetlenie'));
  scene.actions.push({ id: crypto.randomUUID(), target: p.rooms[1].circuits[0].id, action: 'Wyłącz' });
  const before = structuredClone(p);
  assert.deepEqual(sceneRoomIds(p, scene), [p.rooms[0].id, p.rooms[1].id]);
  assert.deepEqual(normalizeProject(JSON.parse(JSON.stringify(p))).scenes, before.scenes);
  assert.deepEqual(p, before);
});

test('adding multiple rooms including an empty room preserves every existing action and key binding', () => {
  const p = normalizeProject(exampleProject()), scene = suggestedScene(p.rooms[0], 'Wyjście', 'LogOut');
  p.scenes.push(scene);
  const actions = structuredClone(scene.actions), points = structuredClone(p.points);
  addSceneRoom(p, scene, p.rooms[1].id);
  addSceneRoom(p, scene, p.rooms[2].id);
  addSceneRoom(p, scene, p.rooms[1].id);
  addSceneRoom(p, scene, 'missing-room');
  assert.deepEqual(sceneRoomIds(p, scene), p.rooms.slice(0, 3).map(r => r.id));
  assert.deepEqual(scene.actions, actions);
  assert.deepEqual(p.points, points);
  const saved = normalizeProject(JSON.parse(JSON.stringify(p)));
  assert.deepEqual(saved.scenes.at(-1), scene);
  assert.ok(reviewItems(saved).some(item => item.sceneId === scene.id && item.roomId === p.rooms[1].id && item.label.includes('wybierz działania')));
  const copy = duplicateRoom(p, p.rooms[1].id);
  assert.ok(!sceneRoomIds(copy, copy.scenes.at(-1)!).includes(copy.rooms.at(-1)!.id));
});

test('one scene controls circuits in several rooms through the same assigned key and preserves unrelated devices', () => {
  const p = normalizeProject(exampleProject()), scene = newScene(['Wyjście', 'LogOut', 'Dom']);
  const [salon, kitchen] = p.rooms;
  kitchen.circuits = [newCircuit('Oświetlenie')];
  kitchen.circuits[0].control = 'Włącz / wyłącz';
  scene.actions = [salon.circuits[0], kitchen.circuits[0]].map(c => ({ id: crypto.randomUUID(), target: c.id, action: 'Wyłącz' }));
  addSceneRoom(p, scene, salon.id); addSceneRoom(p, scene, kitchen.id);
  p.scenes.push(scene);
  const key = p.points[0].bindings[0]; key.target = scene.id; key.action = 'Uruchom scenę';
  const untouched = salon.circuits[1].id;
  const before = structuredClone(p), result = simulate(p, key, { [untouched]: 'Włączone' });
  assert.equal(result.values[salon.circuits[0].id], 'Wyłączone');
  assert.equal(result.values[kitchen.circuits[0].id], 'Wyłączone');
  assert.equal(result.values[untouched], 'Włączone');
  assert.deepEqual(p, before);
});

test('explicit room removal only removes that rooms actions and keeps scene identity and unresolved or nested legacy actions', () => {
  const p = normalizeProject(exampleProject()), scene = p.scenes.find(s => s.name === 'Kino')!;
  p.rooms[1].circuits.push(newCircuit('Oświetlenie'));
  addSceneRoom(p, scene, p.rooms[1].id);
  const extra = { id: crypto.randomUUID(), target: p.rooms[1].circuits[0].id, action: 'Wyłącz' };
  const unresolved = { id: crypto.randomUUID(), target: '', action: 'Do ustalenia' };
  const nested = { id: crypto.randomUUID(), target: p.scenes[0].id, action: 'Uruchom scenę' };
  scene.actions.push(extra, unresolved, nested);
  const before = structuredClone(scene), points = structuredClone(p.points);
  removeSceneRoom(p, scene, p.rooms[1].id);
  assert.deepEqual(scene.actions, before.actions.filter(a => a.id !== extra.id));
  assert.equal(scene.id, before.id);
  assert.deepEqual(p.points, points);
  assert.deepEqual(sceneRoomIds(p, scene), [p.rooms[0].id]);
  removeSceneRoom(p, scene, p.rooms[0].id);
  assert.deepEqual(scene.roomIds, []);
  assert.equal(scene.roomId, undefined);
  assert.deepEqual(scene.actions, [unresolved, nested]);
});

test('deleting a project room clears only its scene scope and leaves unresolved actions for review', () => {
  const p = normalizeProject(exampleProject()), scene = p.scenes.find(s => s.name === 'Kino')!;
  addSceneRoom(p, scene, p.rooms[0].id); addSceneRoom(p, scene, p.rooms[1].id);
  const deleted = p.rooms[0], remaining = p.rooms[1];
  const copy = removeTargets(p, deleted.circuits.map(c => c.id));
  copy.rooms = copy.rooms.filter(r => r.id !== deleted.id);
  copy.scenes.forEach(s => forgetSceneRoom(s, deleted.id));
  const saved = copy.scenes.find(s => s.id === scene.id)!;
  assert.deepEqual(saved.roomIds, [remaining.id]);
  assert.equal(saved.roomId, remaining.id);
  assert.equal(saved.actions.length, scene.actions.length);
  assert.ok(saved.actions.every(a => a.target === ''));
});

test('XLSX retains selected rooms even without actions and disambiguates identical room names by floor', async () => {
  const p = normalizeProject(exampleProject()), scene = newScene(['Własna scena', 'Sparkles', 'Dom']);
  p.rooms[0].name = 'Gabinet'; p.rooms[0].floor = 'Parter';
  p.rooms[1].name = 'Gabinet'; p.rooms[1].floor = 'Piętro';
  addSceneRoom(p, scene, p.rooms[0].id); addSceneRoom(p, scene, p.rooms[1].id);
  p.scenes = [scene];
  assert.equal(sceneRoomsLabel(p, scene), 'Gabinet (Parter), Gabinet (Piętro)');
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(await (await buildXlsx(p)).arrayBuffer());
  const sheet = book.getWorksheet('Sceny')!;
  assert.equal(sheet.getCell('I1').value, 'Pomieszczenia');
  assert.equal(sheet.getCell('I2').value, sceneRoomsLabel(p, scene));
});
