import { test } from "node:test";
import assert from "node:assert/strict";
import { exampleProject, normalizeProject, selectSensor } from "../src/model";
import { pointPhoto } from "../src/documents";
import { panelArtwork } from '../src/panel-artwork';
import { finishInk, leCorbusierFinishes, panelFinish, panelFinishes } from '../src/panel-finishes';
import { buildXlsx } from '../src/exports';
import ExcelJS from 'exceljs';

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
  assert.equal((await pointPhoto(project, point))?.url, panelArtwork(point));
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

test('finish changes survive saving and exports while keeping key and touch-page assignments', async () => {
  const project = normalizeProject(exampleProject()), point = project.points[0];
  selectSensor(point, 'JUNG LS TOUCH');
  point.placement = { documentId: 'plan', page: 2, x: .2, y: .8 };
  const before = structuredClone(point);
  point.finish = 'LC 4320K';
  const saved = normalizeProject(JSON.parse(JSON.stringify(project)));
  assert.deepEqual(saved.points[0], { ...before, finish: 'LC 4320K' });
  const photo = await pointPhoto(saved, saved.points[0]);
  assert.equal(photo?.url, panelArtwork(point));
  assert.ok(decodeURIComponent(photo!.url).includes(panelFinish(point.sensor, point.finish).color));
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(await (await buildXlsx(saved)).arrayBuffer());
  let exported = false;
  book.eachSheet(sheet => sheet.eachRow(row => { if (JSON.stringify(row.values).includes('LC 4320K')) exported = true; }));
  assert.ok(exported);
});

test('every available finish produces a distinct preview and readable primary screen text', () => {
  const p = exampleProject().points[0];
  assert.equal(leCorbusierFinishes.length, 63);
  assert.equal(new Set(leCorbusierFinishes.map(f => f.code)).size, 63);
  const luminance = (hex: string) => {
    const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  };
  for (const sensor of ['JUNG F40', 'JUNG F50', 'JUNG LS TOUCH', 'Ekinex FF · bez ramki (NF)']) {
    const previews = new Set();
    for (const f of panelFinishes(sensor)) {
      const url = panelArtwork({ ...p, sensor, finish: f.id });
      assert.ok(url?.startsWith('data:image/svg+xml'));
      assert.ok(decodeURIComponent(url!).includes(f.color));
      previews.add(url);
      const [low, high] = [luminance(f.color), luminance(finishInk(f.color))].sort((a, b) => a - b);
      assert.ok((high + .05) / (low + .05) >= 4.5, `${sensor}: ${f.id}`);
    }
    assert.equal(previews.size, panelFinishes(sensor).length);
  }
  assert.deepEqual(panelFinishes('JUNG Smart Control 5″').map(f => f.id), ['Czarny']);
  assert.equal(panelArtwork({ ...p, sensor: 'JUNG Smart Control 5″' }), null);
});

test('legacy and custom finishes remain untouched on load and cannot inject SVG markup', () => {
  const project = normalizeProject(exampleProject());
  project.points[0].finish = 'Mosiądz';
  project.points[1].finish = '<script>unknown finish</script>';
  const saved = normalizeProject(JSON.parse(JSON.stringify(project)));
  assert.deepEqual(saved, project);
  const artwork = decodeURIComponent(panelArtwork({ ...saved.points[1], sensor: 'JUNG F40' })!);
  assert.ok(!artwork.includes('<script>'));
  assert.equal(panelFinish('JUNG F40', 'Mosiądz').label, 'Mosiądz klasyczny');
});
