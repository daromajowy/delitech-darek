import { test } from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { actionOptions, actionProblem, initialStateOptions, simulate, suggestedScene } from '../src/behavior';
import { buildXlsx } from '../src/exports';
import { addControlPoint, exampleProject, newCircuit, newScene, normalizeProject, targets, uid, type Category } from '../src/model';
import { newDetectorRule } from '../src/detector-config';
import { touchBindingIcon } from '../src/touch-pages';

const additions: [Category, string, string][] = [
  ['Muzyka i kino', 'Audio / multiroom', 'Odtwórz'],
  ['Ochrona i dostęp', 'Brama garażowa', 'Zamknij'],
  ['Energia i ładowanie', 'Ładowarka samochodu', 'Rozpocznij ładowanie'],
  ['Ogród i woda', 'Zawór wody', 'Zamknij'],
];

function projectWithIntegrations() {
  const p = normalizeProject(exampleProject());
  const originalCircuits = structuredClone(p.rooms[0].circuits);
  const circuits = additions.map(([kind, control]) => ({ ...newCircuit(kind), name: control, control, spec: 'Model do uzgodnienia' }));
  p.rooms[0].circuits.push(...circuits);
  const scene = newScene();
  scene.name = 'Własna scena';
  scene.actions = circuits.map((c, i) => ({ id: uid(), target: c.id, action: additions[i][2] }));
  p.scenes.push(scene);
  p.points[0].bindings = structuredClone(scene.actions);
  return { p, circuits, scene, originalCircuits };
}

test('new room functions retain IDs, assignments and categories through save/load and XLSX', async () => {
  const { p, circuits, originalCircuits } = projectWithIntegrations();
  const saved = normalizeProject(JSON.parse(JSON.stringify(p)));
  assert.deepEqual(saved, p);
  assert.ok(circuits.every(c => targets(saved).some(t => t.id === c.id)));
  assert.deepEqual(saved.points[0].bindings.map(b => touchBindingIcon(saved, b)), ['Clapperboard', 'LockKeyhole', 'Zap', 'Trees']);
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(await (await buildXlsx(saved)).arrayBuffer());
  const rows: unknown[][] = [];
  book.getWorksheet('Obwody')!.eachRow(row => rows.push([row.getCell(2).value, row.getCell(3).value, row.getCell(4).value]));
  circuits.forEach(c => assert.ok(rows.some(row => row[0] === c.name && row[1] === c.kind && row[2] === c.control)));
  assert.deepEqual(saved.rooms[0].circuits.slice(0, -4), originalCircuits);
});

test('legacy detector circuits keep their data and references alongside control devices after save/load and XLSX', async () => {
  const p = normalizeProject(exampleProject()), room = p.rooms[0];
  const legacy: [Category, string][] = [
    ['Ochrona i dostęp', 'Kontaktron'], ['Ochrona i dostęp', 'Czujnik ruchu'],
    ['Pozostałe', 'Czujnik obecności'], ['Pozostałe', 'Kontaktron'],
  ];
  const circuits = legacy.map(([kind, control], i) => ({
    ...newCircuit(kind), control, name: `Zapisany czujnik ${i + 1}`, spec: 'Istniejące ustalenia projektowe',
  }));
  room.circuits.push(...circuits);
  const scene = newScene();
  scene.actions = circuits.map(c => ({ id: uid(), target: c.id, action: 'Do ustalenia' }));
  p.scenes.push(scene);
  p.points[0].bindings = structuredClone(scene.actions);
  for (const kind of ['motion', 'presence', 'window', 'door'] as const) {
    const point = addControlPoint(p, room.id, undefined, kind);
    const rule = newDetectorRule(kind === 'motion' || kind === 'presence' ? 'detected' : 'opened');
    rule.actions = [{ id: uid(), target: room.circuits[0].id, action: 'Włącz' }];
    point.detector!.rules = [rule];
    point.placement = { documentId: 'existing-plan', page: 2, x: .25, y: .75 };
  }
  const saved = normalizeProject(JSON.parse(JSON.stringify(p)));
  assert.deepEqual(saved, p);
  assert.ok(circuits.every(c => targets(saved).some(t => t.id === c.id)));
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(await (await buildXlsx(saved)).arrayBuffer());
  const rows: unknown[][] = [];
  book.getWorksheet('Obwody')!.eachRow(row => rows.push([row.getCell(2).value, row.getCell(3).value, row.getCell(4).value]));
  circuits.forEach(c => assert.ok(rows.some(row => row[0] === c.name && row[1] === c.kind && row[2] === c.control)));
});

test('explicit integration actions work together in a scene without modifying the project', () => {
  const { p, circuits, scene } = projectWithIntegrations();
  const before = JSON.stringify(p);
  const result = simulate(p, { target: scene.id, action: 'Uruchom scenę' });
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(circuits.map(c => result.values[c.id]), ['Odtwarzanie', 'Zamknięte', 'Ładowanie', 'Zamknięte']);
  assert.equal(JSON.stringify(p), before);
  assert.ok(actionProblem(p, { target: circuits[2].id, action: 'Otwórz' }));
  const invalid = simulate(p, { target: circuits[2].id, action: 'Otwórz' }, result.values);
  assert.deepEqual(invalid.values, result.values);
  assert.deepEqual(invalid.changed, []);
});

test('monitoring and undecided integrations do not acquire invented on/off commands', () => {
  const p = exampleProject();
  const monitoring: [Category, string][] = [
    ['Ochrona i dostęp', 'Kamera IP'], ['Ochrona i dostęp', 'Kontaktron'],
    ['Energia i ładowanie', 'Pomiar energii'], ['Energia i ładowanie', 'Fotowoltaika'],
    ['Ogród i woda', 'Czujnik wilgotności gleby'],
    ['Muzyka i kino', 'constructor'], ['Ochrona i dostęp', '__proto__'],
    ...additions.map(([kind]): [Category, string] => [kind, 'Do ustalenia']),
  ];
  for (const [kind, control] of monitoring) {
    const c = { ...newCircuit(kind), control };
    p.rooms[0].circuits.push(c);
    assert.deepEqual(actionOptions(p, c.id), ['Do ustalenia']);
    assert.deepEqual(initialStateOptions(c), []);
    assert.deepEqual(simulate(p, { target: c.id, action: 'Włącz' }).changed, []);
  }
});

test('additional commands have meaningful preview states and templates leave integrations explicit', () => {
  const { p, circuits } = projectWithIntegrations();
  const cases: [Category, string, string, string][] = [
    ['Muzyka i kino', 'Audio / multiroom', 'Pauza', 'Wstrzymane'],
    ['Muzyka i kino', 'Telewizor', 'Włącz', 'Włączone'],
    ['Muzyka i kino', 'Ekran projekcyjny', 'Wysuń ekran', 'Ekran wysunięty'],
    ['Ochrona i dostęp', 'Alarm', 'Uzbrój', 'Uzbrojone'],
    ['Ochrona i dostęp', 'Furtka', 'Zwolnij elektrozaczep', 'Wysłano impuls otwarcia'],
    ['Energia i ładowanie', 'Ładowarka samochodu', 'Zatrzymaj ładowanie', 'Ładowanie zatrzymane'],
    ['Ogród i woda', 'Nawadnianie', 'Wyłącz', 'Wyłączone'],
    ['Ogród i woda', 'Robot koszący', 'Wróć do stacji', 'Powrót do stacji'],
  ];
  for (const [kind, control, action, expected] of cases) {
    const c = { ...newCircuit(kind), control };
    p.rooms[0].circuits.push(c);
    const result = simulate(p, { target: c.id, action });
    assert.deepEqual(result.warnings, []);
    assert.equal(result.values[c.id], expected);
    if (control !== 'Furtka') assert.ok(initialStateOptions(c).includes(expected));
  }
  for (const name of ['Kino', 'Wyjście', 'Poranek']) {
    assert.ok(suggestedScene(p.rooms[0], name, 'House').actions.every(a => !circuits.some(c => c.id === a.target)));
  }
});
