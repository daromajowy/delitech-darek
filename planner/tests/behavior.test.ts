import { test } from 'node:test';
import assert from 'node:assert/strict';
import { actionOptions, actionProblem, reviewItems, sceneIdeaName, simulate, suggestedScene } from '../src/behavior';
import { addControlPoint, detachDocument, duplicateRoom, exampleProject, newCircuit, newScene, normalizeProject, removeTargets } from '../src/model';

test('one scene drives a key, preview and exports without altering project data', () => {
  const p = normalizeProject(exampleProject());
  const scene = p.scenes.find(s => s.name === 'Kino')!;
  const key = p.points[0].bindings[3];
  const before = JSON.stringify(p), previous = { existing: 'unchanged' };
  const result = simulate(p, key, previous);
  assert.equal(result.values[scene.actions[0].target], 'Wyłączone');
  assert.equal(result.values[scene.actions[2].target], '20%');
  assert.equal(result.values[scene.actions[3].target], 'Zamknięte');
  assert.equal(result.warnings.length, 0);
  assert.equal(JSON.stringify(p), before);
  assert.deepEqual(previous, { existing: 'unchanged' });
  scene.actions[2].action = '37%';
  assert.equal(simulate(p, key).values[scene.actions[2].target], '37%');
});

test('actions follow receiver capability and preserve unknown as distinct from off', () => {
  const p = exampleProject(), light = p.rooms[0].circuits[0], dimmer = p.rooms[0].circuits[2];
  assert.ok(!actionOptions(p, light.id).includes('20%'));
  assert.ok(actionOptions(p, dimmer.id).includes('20%'));
  assert.ok(actionProblem(p, { target: light.id, action: '20%' }));
  assert.equal(actionProblem(p, { target: dimmer.id, action: '37%' }), undefined);
  const unknown = simulate(p, { target: light.id, action: 'Włącz / wyłącz' });
  assert.equal(unknown.values[light.id], undefined);
  assert.ok(unknown.warnings.length);
  assert.equal(simulate(p, { target: light.id, action: 'Włącz / wyłącz' }, { [light.id]: 'Wyłączone' }).values[light.id], 'Włączone');
});

test('invalid actions cannot change simulated device state', () => {
  const p = exampleProject(), c = p.rooms[0].circuits[0];
  for (const action of ['Otwórz', 'Uruchom scenę', 'Do ustalenia', '999%', '22°C']) {
    const result = simulate(p, { target: c.id, action }, { [c.id]: 'Wyłączone' });
    assert.equal(result.values[c.id], 'Wyłączone');
    assert.equal(result.changed.length, 0);
    assert.ok(result.warnings.length);
  }
  c.control = 'Do ustalenia';
  assert.ok(simulate(p, { target: c.id, action: 'Włącz' }).warnings.length);
});

test('scene recursion is bounded and warned, including indirect legacy cycles', () => {
  const p = exampleProject(), a = newScene(), b = newScene();
  a.actions = [{ id: crypto.randomUUID(), target: b.id, action: 'Uruchom scenę' }];
  b.actions = [{ id: crypto.randomUUID(), target: a.id, action: 'Uruchom scenę' }];
  p.scenes.push(a, b);
  assert.ok(simulate(p, { target: a.id, action: 'Uruchom scenę' }).warnings.some(w => w.startsWith('Zapętlenie')));
  assert.ok(reviewItems(p).some(i => i.sceneId === a.id && i.label.includes('zapętlenie')));
});

test('templates use existing IDs and unknown controls never become guessed settings', () => {
  const p = exampleProject(), r = p.rooms[0], before = JSON.stringify(r);
  const a = suggestedScene(r, 'Kino', 'Clapperboard');
  assert.equal(a.roomId, r.id);
  assert.ok(a.actions.every(x => r.circuits.some(c => c.id === x.target)));
  assert.equal(JSON.stringify(r), before);
  r.circuits[0].control = 'Do ustalenia';
  assert.equal(suggestedScene(r, 'Kino', 'Clapperboard').actions[0].action, 'Do ustalenia');
  assert.equal(suggestedScene(r, 'Koszenie', 'Flower2').actions.length, 0);
  assert.ok(!suggestedScene(r, 'Wyjście', 'LogOut').actions.some(a => r.circuits.find(c => c.id === a.target)?.kind === 'Osłony'));
});

test('guest and dinner suggestions suit switches and dimmers while keeping other devices unchanged', () => {
  const p = exampleProject(), room = p.rooms[0];
  room.circuits.push({ ...newCircuit('Muzyka i kino'), control: 'Telewizor' });
  room.circuits[3].control = 'Do ustalenia';
  const before = JSON.stringify(room);
  for (const [name, icon, level] of [['Goście', 'Users', '80%'], ['Kolacja', 'Utensils', '50%']]) {
    const scene = suggestedScene(room, name, icon);
    assert.equal(scene.roomId, room.id);
    assert.equal(scene.actions.find(a => a.target === room.circuits[0].id)?.action, 'Włącz');
    assert.equal(scene.actions.find(a => a.target === room.circuits[1].id)?.action, level);
    assert.equal(scene.actions.find(a => a.target === room.circuits[3].id)?.action, 'Do ustalenia');
    assert.ok(scene.actions.every(a => room.circuits.some(c => c.id === a.target && c.kind === 'Oświetlenie')));
    assert.ok(scene.actions.filter(a => a.action !== 'Do ustalenia').every(a => !actionProblem(p, a)));
    assert.equal(JSON.stringify(room), before);
  }
});

test('holiday suggestion switches off room lights without assuming alarm, water or heating actions', () => {
  const p = exampleProject(), room = p.rooms[0];
  room.circuits.push({ ...newCircuit('Ochrona i dostęp'), control: 'Alarm' }, { ...newCircuit('Ogród i woda'), control: 'Zawór wody' }, newCircuit('Klimat'));
  const scene = suggestedScene(room, 'Wakacje', 'Plane');
  p.scenes.push(scene);
  const unchanged = Object.fromEntries(room.circuits.filter(c => c.kind !== 'Oświetlenie').map(c => [c.id, 'Dotychczasowy stan']));
  const result = simulate(p, { target: scene.id, action: 'Uruchom scenę' }, unchanged);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.changed.length, room.circuits.filter(c => c.kind === 'Oświetlenie').length);
  assert.ok(result.changed.every(id => result.values[id] === 'Wyłączone'));
  Object.entries(unchanged).forEach(([id, state]) => assert.equal(result.values[id], state));
});

test('Relax and Wakacje recognise legacy names without changing saved scenes or key assignments', () => {
  const p = normalizeProject(exampleProject());
  for (const [oldName, label, icon] of [['Relaks', 'Relax', 'Armchair'], ['Urlop', 'Wakacje', 'Plane']]) {
    const saved = newScene([oldName, icon, 'Dom']);
    saved.roomId = p.rooms[0].id;
    p.scenes.push(saved);
    p.points[0].bindings[0].target = saved.id;
    p.points[0].bindings[0].action = 'Uruchom scenę';
    const restored = normalizeProject(JSON.parse(JSON.stringify(p)));
    const matched = restored.scenes.find(s => sceneIdeaName(s.name) === label && s.roomId === saved.roomId)!;
    assert.deepEqual(matched, saved);
    assert.equal(restored.points[0].bindings[0].target, matched.id);
    const legacySuggestion = suggestedScene(p.rooms[0], oldName, icon), current = suggestedScene(p.rooms[0], label, icon);
    assert.equal(legacySuggestion.name, label);
    assert.deepEqual(legacySuggestion.actions.map(({ target, action }) => ({ target, action })), current.actions.map(({ target, action }) => ({ target, action })));
  }
});

test('review links lead back to the affected room, point or scene', () => {
  const p = normalizeProject(exampleProject()), pt = p.points[0];
  pt.bindings[0].action = 'Zamknij';
  const row = reviewItems(p).find(i => i.pointId === pt.id && i.label.includes('klawisz 1'))!;
  assert.equal(row.step, 2);
  const roomRow = reviewItems(p).find(i => i.roomId === p.rooms[1].id)!;
  assert.equal(roomRow.step, 1);
  const scene = p.scenes.find(s => s.name === 'Kino')!;
  scene.triggers = [];
  assert.ok(!reviewItems(p).some(i => i.sceneId === scene.id && i.label.includes('wyzwalanie')));
});

test('deleting or copying rooms and documents never retains stale plan areas', () => {
  const p = normalizeProject(exampleProject());
  p.rooms[0].planArea = { documentId: 'plan', page: 1, x: 0.1, y: 0.2, width: 0.3, height: 0.4 };
  assert.equal(duplicateRoom(p, p.rooms[0].id).rooms.at(-1)!.planArea, undefined);
  detachDocument(p, 'plan');
  assert.equal(p.rooms[0].planArea, undefined);
  const q = removeTargets(p, [p.rooms[0].circuits[0].id]);
  assert.ok(simulate(q, q.points[0].bindings[0]).warnings.length);
});

test('copying a point retains a live reference to the same reusable scene', () => {
  const p = normalizeProject(exampleProject());
  const pt = addControlPoint(p, p.rooms[0].id, p.points[0]);
  assert.equal(pt.bindings[3].target, p.points[0].bindings[3].target);
  assert.notEqual(pt.bindings[3].id, p.points[0].bindings[3].id);
});
