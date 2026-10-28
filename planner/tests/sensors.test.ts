import { test } from "node:test";
import assert from "node:assert/strict";
import { exampleProject, normalizeProject, selectSensor } from "../src/model";
import { pointPhoto } from "../src/documents";

test("selecting a catalogue panel replaces custom identity but preserves project assignments", async () => {
  const project = exampleProject();
  const point = project.points[0];
  point.sensor = "Inny sensor / panel";
  point.model = "Poprzedni panel";
  point.photoId = "previous-photo";
  point.finish = "Mosiądz";
  const before = structuredClone(point);

  selectSensor(point, "JUNG Smart Control 5″");

  assert.equal(point.deviceType, "Panel dotykowy");
  assert.equal(point.finish, "Czarny");
  assert.equal(point.model || point.sensor, "JUNG Smart Control 5″");
  assert.equal(point.photoId, undefined);
  assert.deepEqual(point.bindings, before.bindings);
  assert.equal(point.code, before.code);
  assert.equal(point.height, before.height);
  assert.deepEqual(point.placement, before.placement);
  assert.equal((await pointPhoto(project, point))?.url, "media/jung-smart-control-5.webp");
});

test("switching a panel to frameless FF keeps assignments and a compatible finish", async () => {
  const project = exampleProject();
  const point = project.points[0];
  selectSensor(point, "JUNG Smart Control 5″");
  const bindings = structuredClone(point.bindings);
  selectSensor(point, "Ekinex FF · bez ramki (NF)");
  assert.equal(point.deviceType, "Sensor KNX");
  assert.equal(point.finish, "Czarny");
  assert.deepEqual(point.bindings, bindings);
  assert.equal((await pointPhoto(project, point))?.url, "media/ekinex-ff-nf.png");
});

test("saved panels without a device type are restored as touch panels without changing old identities", () => {
  const project = exampleProject();
  project.points[0].sensor = "JUNG Smart Control 5″";
  project.points[1].sensor = "JUNG LS TOUCH";
  project.points.forEach(point => delete point.deviceType);
  const restored = normalizeProject(JSON.parse(JSON.stringify(project)));
  assert.equal(restored.points[0].deviceType, "Panel dotykowy");
  assert.equal(restored.points[1].deviceType, "Panel dotykowy");
  assert.equal(restored.points[1].sensor, "JUNG LS TOUCH");
  assert.deepEqual(restored.points[0].bindings, project.points[0].bindings);
  assert.equal(project.points[0].deviceType, undefined);
});
