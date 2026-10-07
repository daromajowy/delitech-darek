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
