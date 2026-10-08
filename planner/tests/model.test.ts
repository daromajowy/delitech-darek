import { test } from "node:test";
import assert from "node:assert/strict";
import { businessData } from "../src/api";
import {
  duplicateRoom,
  exampleProject,
  issues,
  newProject,
  removeTargets,
  summary,
  targets,
  normalizeProject,
  addControlPoint,
  normalizedDrop,
  detachDocument,
} from "../src/model";
test("new project is empty and does not claim zero unresolved specifications", () => {
  const p = newProject();
  assert.equal(p.rooms.length, 0);
  assert.ok(issues(p).includes("Budżet automatyki"));
  assert.equal(p.area, null);
});
test("example has unique ids and all assignments resolve", () => {
  const p = exampleProject(),
    lookup = new Set(targets(p).map((t) => t.id));
  const ids = [
    p.id,
    ...p.rooms.flatMap((r) => [r.id, ...r.circuits.map((c) => c.id)]),
    ...p.points.flatMap((pt) => [pt.id, ...pt.bindings.map((b) => b.id)]),
    ...p.scenes.flatMap((s) => [s.id, ...s.actions.map((b) => b.id)]),
    ...p.integrations.map((i) => i.id),
  ];
  assert.equal(ids.length, new Set(ids).size);
  for (const b of [
    ...p.points.flatMap((pt) => pt.bindings),
    ...p.scenes.flatMap((s) => s.actions),
  ])
    assert.ok(!b.target || lookup.has(b.target));
});
test("duplicate room remaps circuits, points and bindings without mutating source", () => {
  const p = exampleProject(),
    before = JSON.stringify(p),
    copy = duplicateRoom(p, p.rooms[0].id),
    room = copy.rooms.at(-1)!;
  assert.equal(copy.rooms.length, p.rooms.length + 1);
  assert.equal(copy.points.length, p.points.length * 2);
  assert.notEqual(room.id, p.rooms[0].id);
  assert.equal(copy.points.at(-3)!.bindings[0].target, room.circuits[0].id);
  assert.equal(JSON.stringify(p), before);
});
test("deleting a circuit clears references in both points and scenes", () => {
  const p = exampleProject(),
    id = p.rooms[0].circuits[0].id,
    n = removeTargets(p, [id]);
  assert.equal(n.points[0].bindings[0].target, "");
  assert.equal(n.scenes.find((s) => s.name === "Kino")!.actions[0].target, "");
  assert.equal(p.points[0].bindings[0].target, id);
});
test("room summary counts lighting, dimming and shades separately", () => {
  assert.deepEqual(summary(exampleProject()), {
    rooms: 8,
    circuits: 6,
    lights: 4,
    dim: 2,
    shades: 2,
    points: 3,
    scenes: 9,
  });
});
test("revision updates do not hide unsaved content changes", () => {
  const p = exampleProject(),
    n = { ...p, revision: 3, updatedAt: new Date().toISOString() };
  assert.equal(businessData(p), businessData(n));
  n.name = "Zmiana";
  assert.notEqual(businessData(p), businessData(n));
});
test("unknown integration models are reported when enabled", () => {
  const p = exampleProject();
  p.integrations[0].enabled = true;
  assert.ok(issues(p).some((x) => x.startsWith("Google Home:")));
  p.integrations[0].model = "Potwierdzony interfejs";
  assert.ok(!issues(p).some((x) => x.startsWith("Google Home:")));
});
test("empty room scope is unresolved, not silently complete", () => {
  const p = exampleProject();
  assert.ok(issues(p).includes("Kuchnia: zakres funkcji"));
  assert.ok(!issues(p).includes("Salon: zakres funkcji"));
});

test('point codes survive deletes, edits and normalizing old projects', () => {
  const p = normalizeProject(exampleProject());
  assert.deepEqual(p.points.map(x => x.code), ['P01', 'P02', 'P03']);
  p.points.splice(1, 1);
  addControlPoint(p, p.rooms[0].id);
  assert.deepEqual(p.points.map(x => x.code), ['P01', 'P03', 'P04']);
  assert.deepEqual(normalizeProject(p), p);
  p.points[1].code = 'P01';
  const fixed = normalizeProject(p);
  assert.equal(new Set(fixed.points.map(x => x.code)).size, fixed.points.length);
});

test('room and point duplicates clear placement and remap long presses', () => {
  const p = normalizeProject(exampleProject()), pt = p.points[0];
  pt.bindings[0].hold = { target: p.rooms[0].circuits[1].id, action: 'Ściemnianie' };
  pt.placement = { documentId: 'floorplan', page: 1, x: 0.45, y: 0.7 };
  const copy = duplicateRoom(p, p.rooms[0].id);
  const duplicate = copy.points.find(x => x.roomId === copy.rooms.at(-1)!.id)!;
  assert.notEqual(duplicate.code, pt.code);
  assert.equal(duplicate.placement, undefined);
  assert.equal(duplicate.bindings[0].hold!.target, copy.rooms.at(-1)!.circuits[1].id);
  const pointCopy = addControlPoint(p, pt.roomId, pt);
  assert.equal(pointCopy.placement, undefined);
  assert.notEqual(pointCopy.code, pt.code);
  assert.notEqual(pointCopy.bindings[0].id, pt.bindings[0].id);
});

test('removed targets also clear and report long-press references', () => {
  const p = normalizeProject(exampleProject());
  p.points[0].bindings[0].hold = {target: p.rooms[0].circuits[4].id, action: 'Zamknij'};
  const next = removeTargets(p, [p.rooms[0].circuits[4].id]);
  assert.equal(next.points[0].bindings[0].hold!.target, '');
  assert.ok(issues(next).some(issue => issue.startsWith(`${next.points[0].code}, przytrzymanie 1:`)));
});

test('drop coordinates remain normalized at different zoom and pan levels', () => {
  assert.deepEqual(normalizedDrop(250, 200, {left:50, top:100, width:400, height:200}), {x:0.5,y:0.5});
  assert.deepEqual(normalizedDrop(250, 200, {left:-150, top:0, width:800, height:400}), {x:0.5,y:0.5});
  assert.equal(normalizedDrop(900, 200, {left:0, top:0, width:800, height:400}), null);
  assert.equal(normalizedDrop(0, 0, {left:0, top:0, width:0, height:400}), null);
});

test('document removal clears photo, position and view without deleting the sensor', () => {
  const p = normalizeProject(exampleProject());
  p.attachments = [{id:'plan', name:'plan.pdf', mime:'application/pdf',size:120}];
  p.planView = {documentId:'plan',page:1,zoom:2,centerX:0.4,centerY:0.7};
  p.points[0].placement = {documentId:'plan',page:1,x:0.4,y:0.7};
  p.points[1].photoId = 'plan';
  detachDocument(p, 'plan');
  assert.equal(p.attachments.length, 0);
  assert.equal(p.points.length, 3);
  assert.equal(p.points[0].placement, undefined);
  assert.equal(p.points[1].photoId, undefined);
  assert.equal(p.planView, undefined);
});
