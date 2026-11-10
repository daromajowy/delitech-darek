import { useState } from 'react';
import { ActionField } from './ActionField';
import { Check, Field, Icon, NumberInput, Select, Tool } from './components';
import { uid, type DetectorEvent, type DetectorRule, type Point, type Project } from './model';
import { detectorConditions, detectorConnections, detectorEvents, detectorKinds, newDetectorRule, pointIcon } from './detector-config';
import type { DetectorContext } from './detector-behavior';

export function DetectorEditor({ project, point, update }: {
  project: Project; point: Point; update: (fn: (point: Point) => void) => void;
}) {
  const detector = point.detector!;
  const kind = detectorKinds[detector.kind];
  const patchRule = (id: string, fn: (rule: DetectorRule) => void) => update(pt => {
    const rule = pt.detector?.rules.find(r => r.id === id); if (rule) fn(rule);
  });
  return <div className="detector-editor">
    <div className="detector-kind"><Icon name={kind.icon} size={28}/><div><strong>{kind.label}</strong><small>Zdarzenie → reakcja domu</small></div></div>
    <Field label="Nazwa / miejsce"><input value={point.name} maxLength={150} onChange={e => update(pt => { pt.name = e.target.value; })}/></Field>
    <Field label="Pomieszczenie"><select value={point.roomId} onChange={e => update(pt => { pt.roomId = e.target.value; })}>{project.rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}</select></Field>
    <h3>Reakcje</h3>
    {!detector.rules.length && <p className="inline-info">Wybierz zdarzenie poniżej. Potem wskaż światło, ogrzewanie, osłonę lub scenę, która ma zareagować.</p>}
    {detector.rules.map((rule, index) => <section className="detector-rule" key={rule.id} aria-label={`Reakcja ${index + 1}`}>
      <div className="row spread"><strong>Reakcja {index + 1}</strong><Tool icon="Trash2" label={`Usuń reakcję ${index + 1}`} onClick={() => update(pt => { pt.detector!.rules = pt.detector!.rules.filter(r => r.id !== rule.id); })}/></div>
      <Field label="Kiedy"><select value={rule.event} onChange={e => patchRule(rule.id, r => { r.event = e.target.value as DetectorEvent; })}>{kind.events.map(event => <option key={event} value={event}>{detectorEvents[event]}</option>)}</select></Field>
      <div className="detector-conditions">
        <Field label="Warunek"><select value={rule.condition} onChange={e => patchRule(rule.id, r => { r.condition = e.target.value as DetectorRule['condition']; })}>{Object.entries(detectorConditions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
        <Field label="Po czasie (s)"><NumberInput value={rule.delaySeconds} max={86400} onChange={v => patchRule(rule.id, r => { r.delaySeconds = Math.round(v ?? 0); })}/></Field>
      </div>
      {rule.condition === 'dark' && <Field label="Jasność poniżej (lx)"><NumberInput value={rule.luxThreshold} max={100000} onChange={v => patchRule(rule.id, r => { r.luxThreshold = Math.round(v ?? 0); })}/></Field>}
      {rule.delaySeconds > 0 && <small className="muted">Zdarzenie musi utrzymywać się przez {rule.delaySeconds} s.</small>}
      <div className="detector-actions">{rule.actions.map((action, actionIndex) => <div className="detector-action" key={action.id}>
        <div className="row spread"><small>Działanie {actionIndex + 1}</small><Tool icon="X" label={`Usuń działanie ${actionIndex + 1} z reakcji ${index + 1}`} onClick={() => patchRule(rule.id, r => { r.actions = r.actions.filter(a => a.id !== action.id); })}/></div>
        <ActionField project={project} value={action} label={`Reakcja ${index + 1}, działanie ${actionIndex + 1}`} detector change={value => patchRule(rule.id, r => { Object.assign(r.actions.find(a => a.id === action.id)!, value); })}/>
      </div>)}</div>
      <button className="quiet" disabled={rule.actions.length >= 16} onClick={() => patchRule(rule.id, r => r.actions.push({ id: uid(), target: '', action: 'Do ustalenia' }))}><Icon name="Plus" size={15}/>Dodaj działanie</button>
    </section>)}
    <div className="detector-add">{kind.events.map(event => <button key={event} className="outline" disabled={detector.rules.length >= 16} onClick={() => update(pt => { pt.detector!.rules.push(newDetectorRule(event)); })}><Icon name="Plus" size={15}/>{detectorEvents[event]}</button>)}</div>
    <Check label="Ręczne sterowanie ma pierwszeństwo" checked={detector.manualOverride} onChange={value => update(pt => { pt.detector!.manualOverride = value; })}/>
    <details className="flow-details"><summary>Podłączenie i montaż<Icon name="ChevronDown" size={16}/></summary>
      <Field label="Sposób podłączenia"><select value={detector.connection} onChange={e => update(pt => { pt.detector!.connection = e.target.value as typeof detector.connection; })}>{Object.entries(detectorConnections).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
      <Field label="Producent i model"><input value={point.model ?? ''} maxLength={250} placeholder="Do uzgodnienia" onChange={e => update(pt => { pt.model = e.target.value; })}/></Field>
      <Field label="Wysokość montażu (cm)"><NumberInput value={point.height} max={500} onChange={value => update(pt => { pt.height = value; })}/></Field>
      <Field label="Status uzgodnienia"><Select value={point.status} options={['Propozycja', 'Do uzgodnienia', 'Zatwierdzony']} onChange={value => update(pt => { pt.status = value; })}/></Field>
    </details>
    <Field label="Uwagi do czujnika"><textarea rows={2} value={point.notes} maxLength={3000} onChange={e => update(pt => { pt.notes = e.target.value; })}/></Field>
    <p className="small muted">To założenia do projektu. Zasięg czujki, pomiar jasności i sposób realizacji reakcji potwierdzamy dla wybranych urządzeń.</p>
  </div>;
}

export function DetectorTrial({ point, run }: { point: Point; run: (event: DetectorEvent, context: DetectorContext) => void }) {
  const [context, setContext] = useState<DetectorContext>({ period: 'day', lux: 100, elapsedSeconds: 0, manual: false });
  return <div className="detector-trial">
    <div className="detector-kind"><Icon name={pointIcon(point)}/><strong>{point.sensor}</strong></div>
    <p className="small muted">Ustaw warunki i wywołaj zdarzenie. Czas jest umowny — nie musisz czekać.</p>
    <div className="detector-conditions">
      <Field label="Pora"><select value={context.period} onChange={e => setContext(c => ({ ...c, period: e.target.value as 'day' | 'night' }))}><option value="day">Dzień</option><option value="night">Noc</option></select></Field>
      <Field label="Jasność (lx)"><NumberInput value={context.lux} max={100000} onChange={lux => setContext(c => ({ ...c, lux: lux ?? 0 }))}/></Field>
    </div>
    <Field label="Czas utrzymania zdarzenia (s)"><NumberInput value={context.elapsedSeconds} max={86400} onChange={elapsedSeconds => setContext(c => ({ ...c, elapsedSeconds: elapsedSeconds ?? 0 }))}/></Field>
    <Check label="Aktywne ręczne sterowanie" checked={context.manual} onChange={manual => setContext(c => ({ ...c, manual }))}/>
    <div className="detector-add">{detectorKinds[point.detector!.kind].events.map(event => <button className="outline" key={event} onClick={() => run(event, context)}><Icon name={pointIcon(point)} size={17}/>{detectorEvents[event]}</button>)}</div>
  </div>;
}
