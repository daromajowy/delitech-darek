import type { Binding, Circuit, Project, Room, Scene } from './model';

export type Command = Pick<Binding, 'target' | 'action'>;
export const isDimmable = (c: Circuit) => c.kind === 'Oświetlenie' && ['Ściemnianie', 'DALI', 'RGBW'].includes(c.control);
export const findCircuit = (p: Project, id: string) => p.rooms.flatMap(r => r.circuits).find(c => c.id === id);
const percentage = /^(100|[1-9]?\d)%$/;
const temperature = /^(\d+(?:\.\d+)?)°C$/;

export function actionOptions(p: Project, target: string, scene = false): string[] {
  if (p.scenes.some(s => s.id === target)) return ['Uruchom scenę', 'Do ustalenia'];
  const c = findCircuit(p, target);
  if (!c || c.control === 'Do ustalenia') return ['Do ustalenia'];
  let values: string[] = [];
  if (c.kind === 'Oświetlenie' || (c.kind === 'Pozostałe' && c.control === 'Gniazdo sterowane')) {
    values = ['Włącz', 'Wyłącz'];
    if (!scene) values.unshift('Włącz / wyłącz');
    if (isDimmable(c)) values.push(...Array.from({ length: 11 }, (_, i) => `${i * 10}%`), ...(!scene ? ['Rozjaśnij', 'Przyciemnij', 'Ściemnianie'] : []));
  } else if (c.kind === 'Osłony') values = [...(!scene ? ['Otwórz / zamknij'] : []), 'Otwórz', 'Zamknij', 'Stop'];
  else if (c.kind === 'Klimat') values = ['Komfort', 'Eco', ...Array.from({ length: 21 }, (_, i) => `${i + 10}°C`)];
  return [...values, 'Do ustalenia'];
}

export function actionProblem(p: Project, command: Command): string | undefined {
  if (!command.target) return 'Wybierz obwód lub scenę';
  if (p.scenes.some(s => s.id === command.target)) return command.action === 'Uruchom scenę' ? undefined : 'Scena wymaga polecenia „Uruchom scenę”';
  const c = findCircuit(p, command.target);
  if (!c) return 'Brak wskazanego obwodu';
  if (command.action === 'Do ustalenia' || !command.action) return 'Ustal działanie';
  if (c.control === 'Do ustalenia') return 'Ustal rodzaj sterowania obwodem';
  if (isDimmable(c) && percentage.test(command.action)) return;
  const t = command.action.match(temperature);
  if (c.kind === 'Klimat' && t && Number(t[1]) >= 10 && Number(t[1]) <= 30) return;
  if (!actionOptions(p, command.target).includes(command.action)) return 'Działanie nie pasuje do rodzaju obwodu';
}

export const sceneIdeas = [
  { name: 'Kino', icon: 'Clapperboard', description: 'Przygaszone światło i zamknięte osłony.' },
  { name: 'Wieczór', icon: 'Sunrise', description: 'Nastrojowe oświetlenie i spokojny wieczór.' },
  { name: 'Noc', icon: 'Moon', description: 'Delikatne światło na drogę i cisza.' },
  { name: 'Wyjście', icon: 'LogOut', description: 'Wyłączenie wybranych świateł.' },
  { name: 'Poranek', icon: 'Sunrise', description: 'Jasne wnętrze na początek dnia.' },
  { name: 'Relaks', icon: 'Armchair', description: 'Przyjemne światło do odpoczynku.' },
];

/** Templates are explicit suggestions on existing receivers, never new hardware. */
export function suggestedScene(room: Room, name: string, icon: string): Scene {
  const actions = room.circuits.filter(c => sceneIdeas.some(idea => idea.name === name) && (c.kind === 'Oświetlenie' || (c.kind === 'Osłony' && name !== 'Wyjście'))).map(c => {
    let action = 'Do ustalenia';
    if (c.control !== 'Do ustalenia') {
      if (c.kind === 'Osłony') action = name === 'Poranek' ? 'Otwórz' : 'Zamknij';
      if (c.kind === 'Oświetlenie') action = name === 'Wyjście' ? 'Wyłącz' : name === 'Poranek' ? 'Włącz' : isDimmable(c) ? (name === 'Noc' ? '10%' : name === 'Kino' ? '20%' : '50%') : 'Wyłącz';
    }
    return { id: crypto.randomUUID(), target: c.id, action };
  });
  return { id: crypto.randomUUID(), name, icon, roomId: room.id, area: 'Dom', priority: 'Konieczne', triggers: [], exception: false, notes: '', actions };
}

export type SimState = Record<string, string>;
export interface Simulation { values: SimState; warnings: string[]; changed: string[] }
/** Simulation is a pure interpreter: it cannot save, contact hardware or alter the project. */
export function simulate(p: Project, command: Command, previous: SimState = {}): Simulation {
  const result: Simulation = { values: { ...previous }, warnings: [], changed: [] };
  let remaining = 1000;
  const apply = (cmd: Command, path: Set<string>) => {
    if (--remaining < 0) { if (remaining === -1) result.warnings.push('Przekroczono limit złożoności sceny'); return; }
    const problem = actionProblem(p, cmd);
    if (problem) { result.warnings.push(problem); return; }
    const scene = p.scenes.find(s => s.id === cmd.target);
    if (scene) {
      if (path.has(scene.id)) { result.warnings.push(`Zapętlenie sceny: ${scene.name}`); return; }
      if (!scene.actions.length) result.warnings.push(`${scene.name}: brak działań`);
      scene.actions.forEach(a => apply(a, new Set([...path, scene.id])));
      return;
    }
    const c = findCircuit(p, cmd.target)!;
    const prev = result.values[c.id];
    let value: string | undefined;
    switch (cmd.action) {
      case 'Wyłącz': value = 'Wyłączone'; break;
      case 'Włącz': value = 'Włączone'; break;
      case 'Włącz / wyłącz':
        if (!prev) result.warnings.push(`${c.name}: stan początkowy nieznany — najpierw wybierz Włącz lub Wyłącz`);
        else value = prev === 'Wyłączone' || prev === '0%' ? 'Włączone' : 'Wyłączone';
        break;
      case 'Otwórz': value = 'Otwarte'; break;
      case 'Zamknij': value = 'Zamknięte'; break;
      case 'Otwórz / zamknij':
        if (!prev || !['Otwarte', 'Zamknięte'].includes(prev)) result.warnings.push(`${c.name}: ustal pozycję początkową`);
        else value = prev === 'Otwarte' ? 'Zamknięte' : 'Otwarte';
        break;
      case 'Stop': result.warnings.push(`${c.name}: Stop — końcowa pozycja wymaga informacji z napędu`); value = 'Zatrzymane · pozycja nieznana'; break;
      case 'Komfort': case 'Eco': value = cmd.action; break;
      case 'Rozjaśnij': case 'Przyciemnij': {
        const level = prev === 'Wyłączone' ? 0 : prev?.match(percentage) ? parseInt(prev) : undefined;
        if (level === undefined) result.warnings.push(`${c.name}: ustal początkową jasność`);
        else value = `${Math.max(0, Math.min(100, level + (cmd.action === 'Rozjaśnij' ? 10 : -10)))}%`;
        break;
      }
      case 'Ściemnianie': result.warnings.push(`${c.name}: ustal kierunek lub docelowy poziom ściemniania`); break;
      default: if (percentage.test(cmd.action) || temperature.test(cmd.action)) value = cmd.action;
    }
    if (value !== undefined) { result.values[c.id] = value; result.changed.push(c.id); }
  };
  apply(command, new Set());
  result.warnings = [...new Set(result.warnings)];
  result.changed = [...new Set(result.changed)];
  return result;
}

export interface ReviewItem { label: string; step: number; roomId?: string; pointId?: string; sceneId?: string }
export function reviewItems(p: Project): ReviewItem[] {
  const rows: ReviewItem[] = [];
  const add = (label: string, step: number, context: Partial<ReviewItem> = {}) => rows.push({ label, step, ...context });
  if (!p.rooms.length) add('Dodaj pomieszczenie', 0);
  if (!p.date) add('Termin uruchomienia', 0);
  if (p.budget === 'Do ustalenia') add('Budżet automatyki', 0);
  p.rooms.forEach(r => {
    if (r.area === null) add(`${r.name}: powierzchnia`, 0, { roomId: r.id });
    if (!r.circuits.length) add(`${r.name}: zakres funkcji`, 1, { roomId: r.id });
    r.circuits.filter(c => !c.spec.trim() || c.control === 'Do ustalenia').forEach(c => add(`${r.name}: ${c.name} — parametry / model`, 1, { roomId: r.id }));
  });
  p.points.forEach(pt => {
    if (pt.height === null) add(`${pt.code}: wysokość montażu`, 2, { pointId: pt.id });
    pt.bindings.forEach((b, i) => {
      if (actionProblem(p, b)) add(`${pt.code}, klawisz ${i + 1}: ${actionProblem(p, b)}`, 2, { pointId: pt.id });
      if (b.hold && actionProblem(p, b.hold)) add(`${pt.code}, przytrzymanie ${i + 1}: ${actionProblem(p, b.hold)}`, 2, { pointId: pt.id });
    });
  });
  p.scenes.forEach(s => {
    const context = { sceneId: s.id, roomId: s.roomId };
    if (!s.actions.length || s.actions.some(a => actionProblem(p, a))) add(`${s.name}: uzupełnij działania`, 1, context);
    const assigned = p.points.some(pt => pt.bindings.some(b => b.target === s.id || b.hold?.target === s.id));
    if (!s.triggers.length && !assigned) add(`${s.name}: wybierz wyzwalanie lub przypisz klawisz`, 1, context);
    const warnings = simulate(p, { target: s.id, action: 'Uruchom scenę' }).warnings;
    if (warnings.some(w => w.startsWith('Zapętlenie'))) add(`${s.name}: zapętlenie scen`, 1, context);
  });
  p.integrations.filter(i => i.enabled && !i.model).forEach(i => add(`${i.name}: model i zakres integracji`, 1));
  return rows;
}
