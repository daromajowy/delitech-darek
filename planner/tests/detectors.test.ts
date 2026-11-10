import { test } from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { buildXlsx } from '../src/exports';
import { addControlPoint, detachDocument, duplicateRoom, exampleProject, newCircuit, normalizeProject, removeTargets, type Point } from '../src/model';
import { actionOptions, actionProblem, reviewItems } from '../src/behavior';
import { detectorRuleLabel, lockShades, newDetectorRule, pauseClimate, restoreClimate, unlockShades } from '../src/detector-config';
import { simulateDetector, simulateManual, type DetectorContext } from '../src/detector-behavior';

const context: DetectorContext = { period: 'day', lux: 100, elapsedSeconds: 0, manual: false };
const command = (target: string, action: string) => ({ id: crypto.randomUUID(), target, action });
function fixture() {
  const project = normalizeProject(exampleProject()), room = project.rooms[0];
  const climate = { ...newCircuit('Klimat'), name: 'Ogrzewanie salonu', control: 'Ogrzewanie podłogowe' };
  room.circuits.push(climate);
  const light = room.circuits[0], shade = room.circuits[4];
  const detector = addControlPoint(project, room.id, undefined, 'presence');
  return { project, room, climate, light, shade, detector };
}
function contactRules(point: Point, target: string) {
  const open = newDetectorRule('opened'), close = newDetectorRule('closed');
  open.actions = [command(target, pauseClimate)]; close.actions = [command(target, restoreClimate)];
  point.detector!.rules = [open, close];
}

test('new detectors are separate devices, old points and codes remain stable', () => {
  const p = normalizeProject(exampleProject()), before = structuredClone(p.points);
  for (const kind of ['motion', 'presence', 'window', 'door'] as const) {
    const point = addControlPoint(p, p.rooms[0].id, undefined, kind);
    assert.equal(point.detector?.kind, kind); assert.deepEqual(point.bindings, []);
    assert.equal(point.height, null); assert.ok(point.code);
  }
  assert.deepEqual(p.points.slice(0, before.length), before);
  assert.equal(new Set(p.points.map(pt => pt.code)).size, p.points.length);
  assert.deepEqual(normalizeProject(p), p);
});

test('copying points and rooms clones reaction IDs and remaps only local outputs', () => {
  const { project: p, detector, light, room } = fixture();
  const rule = newDetectorRule('detected'); rule.actions = [command(light.id, 'Włącz'), command(p.scenes[0].id, 'Uruchom scenę')];
  detector.detector!.rules = [rule]; detector.placement = { documentId: 'plan', page: 2, x: .2, y: .8 };
  const duplicate = addControlPoint(p, room.id, detector);
  assert.notEqual(duplicate.detector!.rules[0].id, rule.id);
  assert.notEqual(duplicate.detector!.rules[0].actions[0].id, rule.actions[0].id);
  assert.equal(duplicate.detector!.rules[0].actions[0].target, light.id); assert.equal(duplicate.placement, undefined);
  const copy = duplicateRoom(p, room.id), copiedRoom = copy.rooms.at(-1)!;
  const copiedDetector = copy.points.find(pt => pt.roomId === copiedRoom.id && pt.detector)!;
  assert.equal(copiedDetector.detector!.rules[0].actions[0].target, copiedRoom.circuits[0].id);
  assert.equal(copiedDetector.detector!.rules[0].actions[1].target, p.scenes[0].id);
  const cleared = removeTargets(p, [light.id]);
  assert.equal(cleared.points.find(pt => pt.id === detector.id)!.detector!.rules[0].actions[0].target, '');
  detachDocument(p, 'plan'); assert.equal(p.points.find(pt => pt.id === detector.id)!.placement, undefined);
});

test('presence reaction observes brightness, delay, event and manual priority without mutating project', () => {
  const { project, detector, light } = fixture();
  const rule = newDetectorRule('absent'); Object.assign(rule, { condition: 'dark', luxThreshold: 200, delaySeconds: 60, actions: [command(light.id, 'Wyłącz')] });
  detector.detector!.rules = [rule];
  const before = JSON.stringify(project);
  for (const ctx of [{ ...context, elapsedSeconds: 59 }, { ...context, elapsedSeconds: 60, lux: 200 }, { ...context, elapsedSeconds: 60, manual: true }]) {
    assert.equal(simulateDetector(project, detector, 'absent', ctx).values[light.id], undefined);
  }
  assert.equal(simulateDetector(project, detector, 'absent', { ...context, elapsedSeconds: 60 }).values[light.id], 'Wyłączone');
  assert.equal(simulateDetector(project, detector, 'opened', context).changed.length, 0);
  assert.equal(simulateDetector(project, detector, 'detected', context).changed.length, 0);
  assert.equal(simulateDetector(project, detector, 'absent', { ...context, elapsedSeconds: NaN }).changed.length, 0);
  assert.equal(JSON.stringify(project), before);
  assert.match(detectorRuleLabel(rule), /200 lx/);
});

test('day and night conditions trigger only in the requested period', () => {
  const { project, detector, light } = fixture();
  const rule = newDetectorRule('detected'); rule.condition = 'night'; rule.actions = [command(light.id, 'Włącz')]; detector.detector!.rules = [rule];
  assert.equal(simulateDetector(project, detector, 'detected', context).changed.length, 0);
  assert.equal(simulateDetector(project, detector, 'detected', { ...context, period: 'night' }).values[light.id], 'Włączone');
  rule.condition = 'day'; assert.equal(simulateDetector(project, detector, 'detected', context).values[light.id], 'Włączone');
});

test('two open contacts restore the exact prior climate state only after both close', () => {
  const { project, room, climate } = fixture();
  const one = addControlPoint(project, room.id, undefined, 'window'); contactRules(one, climate.id);
  const two = addControlPoint(project, room.id, undefined, 'door'); contactRules(two, climate.id);
  const a = project.points.find(pt => pt.id === one.id)!, b = two;
  const before = { values: { [climate.id]: '23°C' }, warnings: [], changed: [] };
  const openA = simulateDetector(project, a, 'opened', context, before);
  const repeat = simulateDetector(project, a, 'opened', context, openA);
  assert.equal(repeat.automation!.paused[climate.id].owners.length, 1);
  const openBoth = simulateDetector(project, b, 'opened', context, repeat);
  const closeA = simulateDetector(project, a, 'closed', context, openBoth);
  assert.match(closeA.values[climate.id], /Wstrzymane/);
  const closeBoth = simulateDetector(project, b, 'closed', context, closeA);
  assert.equal(closeBoth.values[climate.id], '23°C'); assert.equal(closeBoth.automation!.paused[climate.id], undefined);
  assert.equal(before.values[climate.id], '23°C');
  const unknown = simulateDetector(project, a, 'opened', context);
  assert.equal(simulateDetector(project, a, 'closed', context, unknown).values[climate.id], undefined);
});

test('contact blocks automatic closing inside a scene and unlock respects other contacts', () => {
  const { project, room, detector, shade } = fixture();
  const window = addControlPoint(project, room.id, undefined, 'window');
  const opened = newDetectorRule('opened'), closed = newDetectorRule('closed');
  opened.actions = [command(shade.id, lockShades)]; closed.actions = [command(shade.id, unlockShades)]; window.detector!.rules = [opened, closed];
  const second = addControlPoint(project, room.id, window), first = project.points.find(pt => pt.id === window.id)!;
  const scene = project.scenes.find(s => s.name === 'Kino')!;
  const detected = newDetectorRule('detected'); detected.actions = [command(scene.id, 'Uruchom scenę')]; detector.detector!.rules = [detected];
  let state = simulateDetector(project, first, 'opened', context, { values: { [shade.id]: 'Otwarte' }, warnings: [], changed: [] });
  state = simulateDetector(project, second, 'opened', context, state);
  state = simulateDetector(project, first, 'closed', context, state);
  state = simulateDetector(project, detector, 'detected', context, state);
  assert.equal(state.values[shade.id], 'Otwarte'); assert.ok(state.warnings.some(w => w.includes('pominięto zamykanie')));
  state = simulateDetector(project, second, 'closed', context, state);
  assert.equal(simulateDetector(project, detector, 'detected', context, state).values[shade.id], 'Zamknięte');
});

test('reaction validation rejects incompatible commands and reports missing or removed targets', () => {
  const { project, detector, light, climate } = fixture();
  assert.ok(actionOptions(project, climate.id, false, true).includes(pauseClimate));
  assert.ok(!actionOptions(project, light.id, false, true).includes(pauseClimate));
  assert.ok(actionProblem(project, command(light.id, pauseClimate), true));
  assert.ok(actionProblem(project, command(light.id, 'Włącz / wyłącz'), true));
  const rule = newDetectorRule('detected'); rule.actions = [command('missing', 'Włącz')]; detector.detector!.rules = [rule];
  assert.equal(simulateDetector(project, detector, 'detected', context).changed.length, 0);
  assert.ok(reviewItems(project).some(row => row.pointId === detector.id && row.label.includes('Brak wskazanego')));
});

test('sensor-only scene assignments count as a trigger and recursive scenes are bounded', () => {
  const { project, detector } = fixture();
  const scene = project.scenes[0]; scene.triggers = [];
  project.points.forEach(pt => { pt.bindings = []; });
  const rule = newDetectorRule('detected'); rule.actions = [command(scene.id, 'Uruchom scenę')]; detector.detector!.rules = [rule];
  assert.ok(!reviewItems(project).some(row => row.sceneId === scene.id && row.label.includes('wyzwalanie')));
  scene.actions = [command(scene.id, 'Uruchom scenę')];
  assert.ok(simulateDetector(project, detector, 'detected', context).warnings.some(w => w.includes('Zapętlenie')));
});

test('manual command keeps shade locks but supersedes a remembered climate mode', () => {
  const { project, room, climate, shade } = fixture();
  const contact = addControlPoint(project, room.id, undefined, 'window'); contactRules(contact, climate.id);
  contact.detector!.rules[0].actions.push(command(shade.id, lockShades));
  const state = simulateDetector(project, contact, 'opened', context, { values: { [climate.id]: 'Eco' }, warnings: [], changed: [] });
  const manual = simulateManual(project, command(climate.id, 'Komfort'), state);
  assert.equal(manual.values[climate.id], 'Komfort'); assert.equal(manual.automation!.paused[climate.id], undefined);
  assert.ok(manual.automation!.shadeLocks[shade.id].includes(contact.id));
});

test('XLSX retains devices without reactions and complete reaction metadata with plan positions', async () => {
  const { project, detector, light, room } = fixture();
  detector.detector!.rules = [{ ...newDetectorRule('absent'), delaySeconds: 120, actions: [command(light.id, 'Wyłącz')] }];
  detector.placement = { documentId: 'plan', page: 2, x: .25, y: .8 };
  project.attachments.push({ id: 'plan', name: 'Parter.pdf', size: 100, mime: 'application/pdf' });
  const contact = addControlPoint(project, room.id, undefined, 'door');
  const book = new ExcelJS.Workbook(); await book.xlsx.load(await (await buildXlsx(project)).arrayBuffer());
  const sheet = book.getWorksheet('Czujniki i reakcje')!;
  assert.ok(sheet);
  const rows: string[] = []; sheet.eachRow(row => rows.push(JSON.stringify(row.values)));
  assert.ok(rows.some(row => row.includes(detector.code!) && row.includes('po 120 s') && row.includes('Wyłącz') && row.includes('Parter.pdf') && row.includes('0.2500')));
  assert.ok(rows.some(row => row.includes(contact.code!) && row.includes('Kontaktron drzwi') && row.includes('Do ustalenia')));
});
