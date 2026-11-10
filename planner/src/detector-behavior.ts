import type { DetectorEvent, Point, Project } from './model';
import { actionProblem, findCircuit, simulate, type Command, type Simulation } from './behavior';
import { detectorEvents, detectorKinds, lockShades, pauseClimate, restoreClimate, unlockShades } from './detector-config';

export interface DetectorContext { period: 'day' | 'night'; lux: number; elapsedSeconds: number; manual: boolean }
export interface DetectorSimulation extends Simulation {
  automation?: {
    paused: Record<string, { owners: string[]; previous?: string }>;
    shadeLocks: Record<string, string[]>;
  };
}

/** A virtual event, never an instruction to a KNX installation. elapsedSeconds is time in this event's state. */
export function simulateDetector(project: Project, point: Point, event: DetectorEvent, context: DetectorContext,
  previous: DetectorSimulation = { values: {}, warnings: [], changed: [] }): DetectorSimulation {
  const result: DetectorSimulation = { values: { ...previous.values }, warnings: [], changed: [],
    automation: structuredClone(previous.automation ?? { paused: {}, shadeLocks: {} }) };
  const detector = point.detector;
  if (!detector || !detectorKinds[detector.kind].events.includes(event)) {
    result.warnings.push('Zdarzenie nie pasuje do tego czujnika'); return result;
  }
  if (![context.lux, context.elapsedSeconds].every(n => Number.isFinite(n) && n >= 0)) {
    result.warnings.push('Uzupełnij prawidłowe warunki symulacji'); return result;
  }
  const memory = result.automation!;
  const rules = detector.rules.filter(rule => rule.event === event);
  if (!rules.length) result.warnings.push(`${detectorEvents[event]}: brak przypisanej reakcji`);
  let remaining = 1000;
  const apply = (command: Command, path: Set<string>) => {
    if (--remaining < 0) { if (remaining === -1) result.warnings.push('Przekroczono limit złożoności sceny'); return; }
    const problem = actionProblem(project, command, true);
    if (problem) { result.warnings.push(problem); return; }
    const scene = project.scenes.find(s => s.id === command.target);
    if (scene) {
      if (path.has(scene.id)) { result.warnings.push(`Zapętlenie sceny: ${scene.name}`); return; }
      if (context.manual && scene.exception) { result.warnings.push(`${scene.name}: pierwszeństwo ręcznego sterowania`); return; }
      if (!scene.actions.length) result.warnings.push(`${scene.name}: brak działań`);
      scene.actions.forEach(action => apply(action, new Set([...path, scene.id])));
      return;
    }
    const circuit = findCircuit(project, command.target)!;
    const target = circuit.id;
    if (command.action === pauseClimate) {
      const hold = memory.paused[target] ?? { owners: [], previous: result.values[target] };
      if (!hold.owners.includes(point.id)) hold.owners.push(point.id);
      memory.paused[target] = hold;
      result.values[target] = 'Wstrzymane przez kontaktron'; result.changed.push(target); return;
    }
    if (command.action === restoreClimate) {
      const hold = memory.paused[target];
      if (!hold?.owners.includes(point.id)) { result.warnings.push(`${circuit.name}: brak zapamiętanego trybu dla tego czujnika`); return; }
      hold.owners = hold.owners.filter(id => id !== point.id);
      if (hold.owners.length) { result.warnings.push(`${circuit.name}: inne okno / drzwi nadal wstrzymują sterowanie`); return; }
      if (hold.previous === undefined) { delete result.values[target]; result.warnings.push(`${circuit.name}: poprzedni tryb nie był ustalony`); }
      else result.values[target] = hold.previous;
      delete memory.paused[target]; result.changed.push(target); return;
    }
    if (command.action === lockShades) {
      memory.shadeLocks[target] = [...new Set([...(memory.shadeLocks[target] ?? []), point.id])];
      result.warnings.push(`${circuit.name}: automatyczne zamykanie zablokowane`); return;
    }
    if (command.action === unlockShades) {
      memory.shadeLocks[target] = (memory.shadeLocks[target] ?? []).filter(id => id !== point.id);
      result.warnings.push(`${circuit.name}: ${memory.shadeLocks[target].length ? 'pozostała blokada innego czujnika' : 'automatyczne zamykanie odblokowane'}`); return;
    }
    if (command.action === 'Zamknij' && memory.shadeLocks[target]?.length) {
      result.warnings.push(`${circuit.name}: pominięto zamykanie — otwarte drzwi / okno`); return;
    }
    if (memory.paused[target]?.owners.length) { result.warnings.push(`${circuit.name}: pominięto automatykę — sterowanie wstrzymane`); return; }
    const next = simulate(project, command, result.values);
    result.values = next.values; result.changed.push(...next.changed); result.warnings.push(...next.warnings);
  };
  for (const rule of rules) {
    if (context.manual && detector.manualOverride) { result.warnings.push('Reakcja pominięta: aktywne pierwszeństwo ręcznego sterowania'); continue; }
    if ((rule.condition === 'dark' && context.lux >= rule.luxThreshold)
      || (rule.condition === 'day' && context.period !== 'day') || (rule.condition === 'night' && context.period !== 'night')) {
      result.warnings.push('Reakcja pominięta: warunek światła / pory dnia nie jest spełniony'); continue;
    }
    if (context.elapsedSeconds < rule.delaySeconds) {
      result.warnings.push(`Reakcja czeka jeszcze ${rule.delaySeconds - context.elapsedSeconds} s utrzymania tego stanu`); continue;
    }
    if (!rule.actions.length) result.warnings.push('Reakcja nie ma działań');
    rule.actions.forEach(action => apply(action, new Set()));
  }
  result.changed = [...new Set(result.changed)]; result.warnings = [...new Set(result.warnings)];
  return result;
}

export function simulateManual(project: Project, command: Command, previous: DetectorSimulation): DetectorSimulation {
  const result = { ...structuredClone(previous), ...simulate(project, command, previous.values) };
  // A deliberate manual change supersedes a remembered automatic climate mode.
  for (const target of result.changed) if (result.automation) delete result.automation.paused[target];
  return result;
}
