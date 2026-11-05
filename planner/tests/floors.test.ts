import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detachDocument, emptyRoom, exampleProject, newPoint, newProject, normalizeProject } from '../src/model';
import { conflictingPlacements, floorNameError, moveRoomToFloor, renameFloor, roomFloor, setFloorPlan } from '../src/floors';

test('legacy floors preserve names and placements; only unambiguous PDF pages are inferred', () => {
  const old = exampleProject();
  old.attachments = [{ id: 'pdf', name: 'Dom.pdf', mime: 'application/pdf', size: 100 }];
  old.rooms[0].planArea = { documentId: 'pdf', page: 1, x: .1, y: .2, width: .2, height: .2 };
  old.rooms[4].planArea = { documentId: 'pdf', page: 2, x: .3, y: .4, width: .2, height: .2 };
  const migrated = normalizeProject(old);
  assert.equal(migrated.floors?.length, 2);
  assert.deepEqual(migrated.floors?.map(f => f.plan?.page), [1, 2]);
  assert.deepEqual(migrated.rooms[0].planArea, old.rooms[0].planArea);
  assert.equal(old.floors, undefined);
  assert.deepEqual(normalizeProject(migrated), migrated);
  old.rooms[1].planArea = { ...old.rooms[0].planArea, page: 3 };
  assert.equal(normalizeProject(old).floors?.[0].plan, undefined);
});

test('empty floors survive normalization and independent PDFs survive a JSON round trip', () => {
  const p = normalizeProject(newProject());
  p.floors!.push({ id: crypto.randomUUID(), name: 'Piętro 1' });
  setFloorPlan(p, p.floors![0].id, { documentId: 'parter', page: 2 });
  setFloorPlan(p, p.floors![1].id, { documentId: 'pietro', page: 1 });
  assert.deepEqual(normalizeProject(JSON.parse(JSON.stringify(p))).floors, p.floors);
  assert.equal(floorNameError(p, '  PARTER  '), 'Taka kondygnacja już istnieje.');
  assert.equal(floorNameError(p, 'Parter', p.floors![0].id), '');
});

test('renaming a floor keeps stable room ownership, points and document placement', () => {
  const p = normalizeProject(exampleProject()), floor = p.floors![0];
  p.rooms[0].planArea = { documentId: 'a', page: 1, x: .1, y: .2, width: .2, height: .2 };
  const before = structuredClone(p.rooms[0].planArea), point = structuredClone(p.points[0]);
  renameFloor(p, floor.id, 'Poziom 0');
  assert.equal(p.rooms[0].floor, 'Poziom 0');
  assert.equal(roomFloor(p, p.rooms[0])?.id, floor.id);
  assert.deepEqual(p.rooms[0].planArea, before);
  assert.deepEqual(p.points[0], point);
  assert.equal(p.rooms[4].floor, 'Piętro');
});

test('changing one floor PDF clears only its conflicting geometry, retaining circuits and other floors', () => {
  const p = normalizeProject(exampleProject()), [ground, upper] = p.floors!;
  ground.plan = { documentId: 'a', page: 1 }; upper.plan = { documentId: 'a', page: 2 };
  p.rooms[0].planArea = { ...ground.plan, x: .1, y: .1, width: .2, height: .2 };
  p.rooms[4].planArea = { ...upper.plan, x: .1, y: .1, width: .2, height: .2 };
  p.points[0].placement = { ...ground.plan, x: .2, y: .2 };
  const circuits = structuredClone(p.rooms[0].circuits), untouched = structuredClone(p.rooms[4]);
  assert.equal(conflictingPlacements(p, [p.rooms[0].id], { documentId: 'b', page: 1 }), 2);
  setFloorPlan(p, ground.id, { documentId: 'b', page: 1 });
  assert.equal(p.rooms[0].planArea, undefined);
  assert.equal(p.points[0].placement, undefined);
  assert.deepEqual(p.rooms[0].circuits, circuits);
  assert.deepEqual(p.rooms[4], untouched);
  assert.deepEqual(upper.plan, { documentId: 'a', page: 2 });
});

test('moving a room preserves its functions while removing geometry from a different floor plan', () => {
  const p = normalizeProject(newProject()), ground = p.floors![0];
  const upper = { id: crypto.randomUUID(), name: 'Poddasze', plan: { documentId: 'b', page: 1 } };
  p.floors!.push(upper);
  const room = { ...emptyRoom('Gabinet', ground.name), floorId: ground.id };
  p.rooms.push(room); p.points.push(newPoint(room.id));
  p.points[0].placement = { documentId: 'a', page: 1, x: .2, y: .2 };
  const bindingIds = p.points[0].bindings.map(b => b.id);
  moveRoomToFloor(p, room.id, upper.id);
  assert.equal(room.floor, 'Poddasze'); assert.equal(room.floorId, upper.id);
  assert.equal(p.points[0].placement, undefined);
  assert.deepEqual(p.points[0].bindings.map(b => b.id), bindingIds);
});

test('detaching a shared PDF clears each floor reference without removing floors or rooms', () => {
  const p = normalizeProject(exampleProject());
  p.floors!.forEach((f, i) => { f.plan = { documentId: 'shared', page: i + 1 }; });
  detachDocument(p, 'shared');
  assert.equal(p.floors!.length, 2); assert.equal(p.rooms.length, 8);
  assert.ok(p.floors!.every(f => !f.plan));
});
