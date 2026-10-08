import { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { Field, Icon, NumberInput, Select, Tool, Check } from './components';
import { ActionField } from './ActionField';
import { ControlWorkspace } from './ControlWorkspace';
import { PlanBoard } from './PlanBoard';
import { ProjectDetails } from './ProjectDetails';
import { RoomPoints } from './RoomPoints';
import { SensorKeys } from './SensorPreview';
import { actionProblem, reviewItems, sceneIdeas, simulate, suggestedScene, type ReviewItem, type Simulation } from './behavior';
import { categories, controls, duplicateRoom, emptyRoom, newCircuit, newScene, removeTargets, sceneTemplates, targets, uid, type Attachment, type Category, type Circuit, type Project, type Room, type Scene } from './model';

type Edit = (fn: (p: Project) => void) => void;
type FlowProps = {
  project: Project; step: number; roomId: string; setRoomId: (id: string) => void; pointId: string; setPointId: (id: string) => void;
  sceneId: string; setSceneId: (id: string) => void; edit: Edit; upload: (file: File) => Promise<Attachment | undefined>; busy: boolean;
  go: (step: number) => void; openHandoff: () => void; exportFile: (format: 'pdf' | 'xlsx') => void;
};
const roomIcon = (name: string) => /salon/i.test(name) ? 'Sofa' : /kuchni/i.test(name) ? 'CookingPot' : /łazien/i.test(name) ? 'Bath' : /sypial/i.test(name) ? 'Moon' : 'DoorOpen';
const categoryIcon: Record<Category, string> = { Oświetlenie: 'Lightbulb', Osłony: 'Blinds', Klimat: 'Thermometer', Pozostałe: 'Ellipsis' };

export function RoomSidebar({ project, room, select, edit, title = 'Pomieszczenia' }: { project: Project; room?: Room; select: (id: string) => void; edit: Edit; title?: string }) {
  const add = (name = 'Nowe pomieszczenie') => { const r = emptyRoom(name); edit(p => p.rooms.push(r)); select(r.id); };
  return <aside className="left-panel flow-rooms">
    <div className="row spread"><h3>{title}</h3><Tool icon="Plus" label="Dodaj pomieszczenie" onClick={() => add()} disabled={project.rooms.length >= 100}/></div>
    {[...new Set(project.rooms.map(r => r.floor))].map(floor => <section className="nav-group" key={floor}><h4>{floor || 'Bez kondygnacji'}</h4>{project.rooms.filter(r => r.floor === floor).map(r => <button key={r.id} className={`nav-entry ${r.id === room?.id ? 'selected' : ''}`} aria-pressed={r.id === room?.id} onClick={() => select(r.id)}><Icon name={roomIcon(r.name)}/><span>{r.name}<small>{r.area === null ? 'Powierzchnia do ustalenia' : `${r.area} m²`}</small></span><i className={r.circuits.length ? 'complete' : 'pending'}/></button>)}</section>)}
    <div className="sidebar-actions"><button className="outline" onClick={() => add()} disabled={project.rooms.length >= 100}><Icon name="Plus"/>Dodaj pomieszczenie</button><select value="" aria-label="Dodaj pomieszczenie z szablonu" disabled={project.rooms.length >= 100} onChange={e => { if (e.target.value) add(e.target.value); }}><option value="">Z szablonu…</option>{['Salon', 'Kuchnia', 'Sypialnia', 'Łazienka', 'Gabinet', 'Taras'].map(n => <option key={n}>{n}</option>)}</select></div>
    <p className="inline-info"><Icon name="FileText"/><span>Nie masz rzutu?<small>Możesz pracować bez niego i dodać PDF później.</small></span></p>
  </aside>;
}

function RoomData({ project, room, edit, select }: { project: Project; room: Room; edit: Edit; select: (id: string) => void }) {
  const update = (fn: (r: Room) => void) => edit(p => { const r = p.rooms.find(r => r.id === room.id); if (r) fn(r); });
  return <div className="room-data">
    <div className="row spread"><h2>{room.name}</h2><div className="row"><Tool icon="Copy" label="Duplikuj pomieszczenie" onClick={() => { const copy = duplicateRoom(project, room.id); edit(p => Object.assign(p, copy)); select(copy.rooms.at(-1)!.id); }}/><Tool icon="Trash2" label="Usuń pomieszczenie" onClick={() => {
      if (!confirm(`Usunąć ${room.name} wraz z obwodami i punktami? Sceny pozostaną do uzupełnienia.`)) return;
      edit(p => { const copy = removeTargets(p, room.circuits.map(c => c.id)); copy.rooms = copy.rooms.filter(r => r.id !== room.id); copy.points = copy.points.filter(pt => pt.roomId !== room.id); copy.scenes.forEach(s => { if (s.roomId === room.id) delete s.roomId; }); Object.assign(p, copy); });
    }}/></div></div>
    <Field label="Nazwa pomieszczenia"><input value={room.name} maxLength={150} onChange={e => update(r => { r.name = e.target.value; })}/></Field>
    <Field label="Kondygnacja"><Select value={room.floor} options={[...new Set([room.floor, 'Parter', 'Piętro', 'Piętro 2', 'Poddasze', 'Piwnica', 'Na zewnątrz'])]} onChange={v => update(r => { r.floor = v; })}/></Field>
    <Field label="Powierzchnia (m²)"><NumberInput value={room.area} onChange={v => update(r => { r.area = v; })}/></Field>
    <details className="flow-details"><summary>Uwagi do pomieszczenia<Icon name="ChevronDown" size={16}/></summary><Field label="Uwagi"><textarea value={room.notes} maxLength={3000} onChange={e => update(r => { r.notes = e.target.value; })}/></Field></details>
  </div>;
}

export function ProjectFlow(props: FlowProps) {
  const { project, step, edit, roomId, setRoomId, pointId, setPointId, sceneId, setSceneId, upload, busy, go } = props;
  const room = project.rooms.find(r => r.id === roomId) ?? project.rooms[0];
  const selectRoom = (id: string) => { setRoomId(id); setSceneId(''); };
  const jump = (item: ReviewItem) => { if (item.roomId) setRoomId(item.roomId); if (item.pointId) setPointId(item.pointId); setSceneId(item.sceneId ?? ''); go(item.step); };
  if (step === 2) return <ControlWorkspace project={project} pointId={pointId} select={setPointId} edit={edit} upload={upload} busy={busy} goRooms={() => go(0)}/>;
  return <DndContext><div className={`flow-layout flow-step-${step}`}>
    <RoomSidebar project={project} room={room} select={selectRoom} edit={edit} title={step === 3 ? 'Podgląd pomieszczeń' : 'Pomieszczenia'}/>
    {step === 0 && <>
      <section className="flow-main"><div className="section-heading"><h2>Twoja przestrzeń</h2><p className="muted">Dodaj pomieszczenia. Rzut możesz dołączyć teraz lub później.</p></div>
        <PlanBoard project={project} select={() => {}} edit={edit} upload={upload} busy={busy} dragging={false} roomId={room?.id} selectRoom={setRoomId} roomMode/>
        {room && <details className="flow-details"><summary>Punkty sterowania w {room.name}<Icon name="ChevronDown" size={16}/></summary><RoomPoints project={project} room={room} edit={edit} configure={id => { setPointId(id); go(2); }}/></details>}
      </section>
      <aside className="right-panel flow-context">{room ? <RoomData project={project} room={room} edit={edit} select={setRoomId}/> : <div className="empty-inline">Dodaj pierwsze pomieszczenie z listy po lewej.</div>}
        <details className="flow-details" open={!project.studio}><summary>Dane inwestycji<Icon name="ChevronDown" size={16}/></summary><ProjectDetails project={project} edit={edit}/></details>
      </aside>
    </>}
    {step === 1 && <FunctionsStep {...props} room={room}/>}
    {step === 3 && <ReviewStep {...props} room={room} jump={jump}/>}
  </div></DndContext>;
}

function CircuitEditor({ project, room, kind, edit }: { project: Project; room: Room; kind: Category; edit: Edit }) {
  const update = (id: string, fn: (c: Circuit) => void) => edit(p => { const c = p.rooms.find(r => r.id === room.id)?.circuits.find(c => c.id === id); if (c) fn(c); });
  return <div className="circuit-editor">
    {room.circuits.filter(c => c.kind === kind).map((c, i) => <div key={c.id} className="circuit-row">
      <div className="row"><b className="mono">{String(i + 1).padStart(2, '0')}</b><Field label="Nazwa obwodu"><input value={c.name} aria-label={`Nazwa obwodu ${i + 1}`} maxLength={150} onChange={e => update(c.id, x => { x.name = e.target.value; })}/></Field><Tool icon="Trash2" label={`Usuń obwód ${c.name}`} onClick={() => {
        if (confirm(`Usunąć ${c.name}? Przypisania zostaną oznaczone jako do ustalenia.`)) edit(p => { const next = removeTargets(p, [c.id]); next.rooms.find(r => r.id === room.id)!.circuits = next.rooms.find(r => r.id === room.id)!.circuits.filter(x => x.id !== c.id); Object.assign(p, next); });
      }}/></div>
      <Field label="Rodzaj sterowania"><Select value={c.control} options={[...new Set([c.control, ...controls[kind]])]} onChange={v => update(c.id, x => { x.control = v; })}/></Field>
      <details className="flow-details compact"><summary>Parametry i priorytet<Icon name="ChevronDown" size={14}/></summary><Field label="Model / parametry"><input value={c.spec} placeholder="Do ustalenia" maxLength={3000} onChange={e => update(c.id, x => { x.spec = e.target.value; })}/></Field><Field label="Priorytet"><Select value={c.priority} options={['Konieczne', 'Opcjonalne']} onChange={v => update(c.id, x => { x.priority = v as Circuit['priority']; })}/></Field></details>
    </div>)}
    {!room.circuits.some(c => c.kind === kind) && <p className="muted small">Zakres do ustalenia. Dodaj nazwane obwody, które chcesz uwzględnić.</p>}
    <button className="outline" disabled={room.circuits.length >= 200} onClick={() => edit(p => p.rooms.find(r => r.id === room.id)!.circuits.push(newCircuit(kind)))}><Icon name="Plus"/>Dodaj {kind === 'Klimat' ? 'strefę' : 'obwód'}</button>
  </div>;
}

function FunctionsStep({ project, room, edit, sceneId, setSceneId, setPointId, go, upload, busy }: FlowProps & { room?: Room }) {
  const [category, setCategory] = useState<Category | null>(null);
  const selected = project.scenes.find(s => s.id === sceneId) ?? project.scenes.find(s => s.roomId === room?.id) ?? project.scenes.find(s => s.actions.some(a => room?.circuits.some(c => c.id === a.target)));
  const addIdea = (name: string, icon: string) => {
    if (!room) return;
    const existing = project.scenes.find(s => s.name === name && (s.roomId === room.id || s.id === selected?.id));
    if (existing) { setSceneId(existing.id); return; }
    const scene = suggestedScene(room, name, icon); edit(p => p.scenes.push(scene)); setSceneId(scene.id);
  };
  return <><section className="flow-main">
    <div className="section-heading"><h2>{room ? `Co ma robić ${room.name.toLocaleLowerCase('pl')}?` : 'Funkcje i sceny'}</h2><p className="muted">Wybierz funkcje i gotowe sceny. Szczegóły dopracujesz później.</p></div>
    {room ? <>
      <div className="function-overview"><div><h3>Funkcje pomieszczenia</h3>{categories.map(k => <div key={k} className={`function-group ${category === k ? 'expanded' : ''}`}><button className="function-summary" aria-expanded={category === k} onClick={() => setCategory(category === k ? null : k)}><Icon name={categoryIcon[k]}/><span>{k === 'Oświetlenie' ? 'Światło' : k}<small>{room.circuits.filter(c => c.kind === k).length || 'Do ustalenia'}{room.circuits.some(c => c.kind === k) ? ' · obwody / strefy' : ''}</small></span><span className="accent">Edytuj</span><Icon name={category === k ? 'ChevronDown' : 'ChevronRight'} size={16}/></button>{category === k && <CircuitEditor project={project} room={room} kind={k} edit={edit}/>}</div>)}</div>
        <div className="room-plan-preview"><PlanBoard project={project} select={() => {}} edit={() => {}} upload={upload} busy={busy} dragging={false} readOnly roomId={room.id} focusRoom/><small>{room.name} · {room.area ?? '—'} m²</small></div>
      </div>
      <h3>Sceny na dobry początek</h3><div className="scene-ideas">{sceneIdeas.map(idea => {
        const existing = project.scenes.find(s => s.name === idea.name && (s.roomId === room.id || s.actions.some(a => room.circuits.some(c => c.id === a.target))));
        return <button key={idea.name} className={`scene-idea ${selected?.id === existing?.id && existing ? 'selected' : ''}`} disabled={!existing && project.scenes.length >= 100} onClick={() => existing ? setSceneId(existing.id) : addIdea(idea.name, idea.icon)}><span className="scene-symbol"><Icon name={idea.icon} size={27}/></span><span><strong>{idea.name}</strong><small>{idea.description}</small></span><Icon name={existing ? 'CircleCheck' : 'Plus'} size={17}/></button>;
      })}</div>
      <div className="row scene-add"><button className="outline" disabled={project.scenes.length >= 100} onClick={() => { const s = newScene(['Nowa scena', 'Sparkles', 'Dom']); s.roomId = room.id; edit(p => p.scenes.push(s)); setSceneId(s.id); }}><Icon name="Plus"/>Własna scena</button><select aria-label="Więcej scen" value="" disabled={project.scenes.length >= 100} onChange={e => { const t = sceneTemplates[Number(e.target.value)]; if (e.target.value && t) addIdea(t[0], t[1]); }}><option value="">Więcej scen…</option>{sceneTemplates.map((t, i) => <option key={t[0]} value={i}>{t[0]}</option>)}</select></div>
      <details className="flow-details"><summary>Punkty sterowania ({project.points.filter(pt => pt.roomId === room.id).length})<Icon name="ChevronDown" size={16}/></summary><RoomPoints project={project} room={room} edit={edit} configure={id => { setPointId(id); go(2); }}/></details>
    </> : <p className="empty-inline">Zacznij od dodania pomieszczenia po lewej.</p>}
    <details className="flow-details" open={!selected && project.scenes.length > 0}><summary>Wszystkie sceny projektu ({project.scenes.length})<Icon name="ChevronDown" size={16}/></summary><div className="scene-chips">{project.scenes.map(s => <button key={s.id} className={s.id === selected?.id ? 'selected' : ''} onClick={() => setSceneId(s.id)}><Icon name={s.icon} size={17}/>{s.name}<small>{project.rooms.find(r => r.id === s.roomId)?.name ?? s.area}</small></button>)}</div></details>
    <details className="flow-details"><summary>Integracje i urządzenia zewnętrzne<Icon name="ChevronDown" size={16}/></summary>{project.integrations.map(i => <div className="integration-config" key={i.id}><Check label={i.name} checked={i.enabled} onChange={v => edit(p => { p.integrations.find(x => x.id === i.id)!.enabled = v; })}/>{i.enabled && <div className="form-grid"><Field label="Model / system"><input value={i.model} maxLength={1000} onChange={e => edit(p => { p.integrations.find(x => x.id === i.id)!.model = e.target.value; })}/></Field><Field label="Zakres integracji"><input value={i.notes} maxLength={3000} onChange={e => edit(p => { p.integrations.find(x => x.id === i.id)!.notes = e.target.value; })}/></Field></div>}</div>)}</details>
  </section><aside className="right-panel flow-context">{selected ? <SceneEditor key={selected.id} project={project} scene={selected} edit={edit}/> : <div className="empty-inline"><Icon name="Clapperboard" size={32}/><h3>Jedna scena. Wiele działań.</h3><p>Wybierz propozycję lub utwórz własną scenę.</p></div>}</aside></>;
}

function SceneEditor({ project, scene, edit }: { project: Project; scene: Scene; edit: Edit }) {
  const update = (fn: (s: Scene) => void) => edit(p => { const s = p.scenes.find(s => s.id === scene.id); if (s) fn(s); });
  return <section className="scene-editor"><div className="row spread scene-title"><div className="row"><span className="scene-symbol"><Icon name={scene.icon} size={28}/></span><h2>{scene.name}<small>{project.rooms.find(r => r.id === scene.roomId)?.name ?? scene.area}</small></h2></div><Tool icon="Trash2" label="Usuń scenę" onClick={() => { if (confirm(`Usunąć scenę ${scene.name}? Powiązane klawisze będą wymagały uzupełnienia.`)) edit(p => { const next = removeTargets(p, [scene.id]); next.scenes = next.scenes.filter(s => s.id !== scene.id); Object.assign(p, next); }); }}/></div>
    <h3>Co ma się wydarzyć?</h3>
    {!scene.actions.length && <p className="inline-info">Dodaj pierwsze działanie. Pusta scena niczego nie uruchamia.</p>}
    <div className="scene-actions">{scene.actions.map((action, i) => <div className="scene-action" key={action.id}><div className="row spread"><strong>Działanie {i + 1}</strong><Tool icon="X" label={`Usuń działanie ${i + 1}`} onClick={() => update(s => { s.actions = s.actions.filter(a => a.id !== action.id); })}/></div><ActionField project={project} value={action} label={`Działanie ${i + 1}`} scene change={v => update(s => { Object.assign(s.actions.find(a => a.id === action.id)!, v); })}/></div>)}</div>
    <button className="outline full" disabled={scene.actions.length >= 100} onClick={() => update(s => s.actions.push({ id: uid(), target: '', action: 'Do ustalenia' }))}><Icon name="Plus"/>Dodaj działanie</button>
    <p className="small muted scene-note">Pozostałe urządzenia bez zmian. Propozycję działań możesz dowolnie poprawić.</p>
    <details className="flow-details"><summary>Nazwa i zakres sceny<Icon name="ChevronDown" size={16}/></summary><Field label="Nazwa sceny"><input value={scene.name} maxLength={150} onChange={e => update(s => { s.name = e.target.value; })}/></Field><Field label="Pomieszczenie sceny"><select value={scene.roomId ?? ''} onChange={e => update(s => { s.roomId = e.target.value || undefined; })}><option value="">Cały projekt</option>{project.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></Field><Field label="Obszar"><Select value={scene.area} options={[...new Set([scene.area, 'Dom', 'Na zewnątrz'])]} onChange={v => update(s => { s.area = v; })}/></Field><Field label="Priorytet"><Select value={scene.priority} options={['Konieczne', 'Opcjonalne']} onChange={v => update(s => { s.priority = v as Scene['priority']; })}/></Field></details>
    <details className="flow-details"><summary>Automatyka i warunki<Icon name="ChevronDown" size={16}/></summary><h3>Uruchamianie sceny</h3><div className="checks-grid">{['Przycisk', 'Aplikacja', 'Harmonogram', 'Czujnik', 'Polecenie głosowe'].map(t => <Check key={t} label={t} checked={scene.triggers.includes(t)} onChange={v => update(s => { s.triggers = v ? [...s.triggers, t] : s.triggers.filter(x => x !== t); })}/>)}</div><Check label="Ręczne sterowanie ma pierwszeństwo przed automatyką" checked={scene.exception} onChange={v => update(s => { s.exception = v; })}/><Field label="Warunki, wyjątki i uwagi"><textarea value={scene.notes} maxLength={3000} onChange={e => update(s => { s.notes = e.target.value; })}/></Field></details>
    <p className="inline-info"><Icon name="MousePointer2"/><span>Do klawisza przypiszesz ją w następnym kroku.</span></p>
  </section>;
}

function ReviewStep({ project, room, edit, pointId, setPointId, upload, busy, openHandoff, exportFile, jump }: FlowProps & { room?: Room; jump: (item: ReviewItem) => void }) {
  const [simulation, setSimulation] = useState<Simulation>({ values: {}, warnings: [], changed: [] });
  const [activeKey, setActiveKey] = useState(''), [last, setLast] = useState('');
  const point = project.points.find(p => p.id === pointId && p.roomId === room?.id) ?? project.points.find(p => p.roomId === room?.id);
  const configuration = JSON.stringify([project.rooms, project.points, project.scenes]);
  useEffect(() => { setSimulation({ values: {}, warnings: [], changed: [] }); setLast(''); setActiveKey(''); }, [configuration]);
  const run = (target: string, action: string, label: string) => { setSimulation(prev => simulate(project, { target, action }, prev.values)); setLast(label); };
  const allTargets = targets(project);
  const problems = reviewItems(project);
  return <><section className="flow-main simulation-main"><div className="section-heading"><h2>{room ? `Sprawdź, jak będzie działać ${room.name.toLocaleLowerCase('pl')}` : 'Sprawdź projekt'}</h2><p className="muted">Kliknij klawisz i zobacz efekt. Zapisany projekt pozostaje bez zmian.</p></div>
    <div className="row spread simulation-toolbar"><span className="view-label"><Icon name="Map"/>Rzut · podgląd 2D</span><button className="quiet" onClick={() => { setSimulation({ values: {}, warnings: [], changed: [] }); setLast(''); setActiveKey(''); }}><Icon name="RotateCcw"/>Resetuj podgląd</button></div>
    {project.attachments.some(a => a.mime === 'application/pdf') && <PlanBoard project={project} point={point} select={setPointId} edit={() => {}} upload={upload} busy={busy} dragging={false} readOnly roomId={room?.id}/>}
    <div className="simulation-states" aria-label="Stany urządzeń w symulacji" aria-live="polite">{(room?.circuits ?? []).map(c => <div className={`receiver-state ${simulation.changed.includes(c.id) ? 'changed' : ''}`} key={c.id}><Icon name={categoryIcon[c.kind]}/><div><strong>{c.name}</strong><small>{c.control}</small></div><output>{simulation.values[c.id] ?? 'Stan nieustalony'}</output></div>)}</div>
    {!room?.circuits.length && <p className="inline-info">Dodaj funkcje pomieszczenia w kroku 2, aby zobaczyć ich działanie.</p>}
    <p className="simulation-status" role="status"><Icon name={last ? 'CircleCheck' : 'MousePointer2'}/>{last ? `Wypróbowano: ${last}` : 'Wybierz scenę lub klawisz po prawej.'}</p>
    {simulation.changed.some(id => !room?.circuits.some(c => c.id === id)) && <div className="inline-info">Zmiany także poza tym pomieszczeniem:<ul>{simulation.changed.filter(id => !room?.circuits.some(c => c.id === id)).map(id => <li key={id}>{allTargets.find(t => t.id === id)?.label}: {simulation.values[id]}</li>)}</ul></div>}
    {simulation.warnings.length > 0 && <div className="simulation-warnings" role="status"><strong>Wymaga ustalenia</strong><ul>{simulation.warnings.map(w => <li key={w}>{w}</li>)}</ul></div>}
    <details className="flow-details"><summary>Ustal stan początkowy w podglądzie<Icon name="ChevronDown" size={16}/></summary><p className="small muted">Przełączanie wymaga znanego stanu. Te ustawienia dotyczą wyłącznie symulacji.</p>{room?.circuits.map(c => <Field label={c.name} key={c.id}><select value={simulation.values[c.id] ?? ''} onChange={e => { const value = e.target.value; setSimulation(s => { const values = { ...s.values }; if (value) values[c.id] = value; else delete values[c.id]; return { values, changed: [], warnings: [] }; }); }}><option value="">Stan nieustalony</option>{(c.kind === 'Osłony' ? ['Otwarte', 'Zamknięte'] : c.kind === 'Klimat' ? ['Komfort', 'Eco'] : ['Wyłączone', 'Włączone', ...(['Ściemnianie', 'DALI', 'RGBW'].includes(c.control) ? ['10%', '20%', '50%', '100%'] : [])]).map(v => <option key={v}>{v}</option>)}</select></Field>)}</details>
    <details className="flow-details review-issues"><summary><span>Do ustalenia ({problems.length})</span><Icon name="ChevronDown" size={16}/></summary><p className="small muted">Możesz przekazać projekt do konsultacji także z otwartymi pytaniami.</p>{problems.map((item, i) => <button key={i} onClick={() => jump(item)}><Icon name="TriangleAlert" size={16}/><span>{item.label}</span><Icon name="ArrowRight" size={16}/></button>)}{!problems.length && <p>Założenia uzupełnione.</p>}</details>
    <p className="small muted">Symulacja założeń, bez połączenia z instalacją. Nie odwzorowuje czasów napędów, logiki ETS ani blokad bezpieczeństwa.</p>
  </section><aside className="right-panel flow-context simulation-context"><h3>Wypróbuj przycisk</h3>
    <Field label="Punkt sterowania"><select value={point?.id ?? ''} onChange={e => { setPointId(e.target.value); setActiveKey(''); }}>{!point && <option value="">Brak punktu w pomieszczeniu</option>}{project.points.filter(p => p.roomId === room?.id).map(pt => <option key={pt.id} value={pt.id}>{pt.code} · {pt.name}</option>)}</select></Field>
    {point && <><SensorKeys project={project} point={point} active={activeKey} simulate choose={id => { const b = point.bindings.find(b => b.id === id)!; setActiveKey(id); run(b.target, b.action, `${point.code} · klawisz ${point.bindings.indexOf(b) + 1}`); }}/><div className="sim-key-list">{point.bindings.map((b, i) => <div key={b.id}><button className={activeKey === b.id ? 'selected' : ''} onClick={() => { setActiveKey(b.id); run(b.target, b.action, `${point.code} · klawisz ${i + 1}`); }}><b>{i + 1}</b><span>{b.label || allTargets.find(t => t.id === b.target)?.label || 'Do ustalenia'}<small>{b.action}</small></span><Icon name="ChevronRight" size={16}/></button>{b.hold && <button className="quiet" onClick={() => { setActiveKey(b.id); run(b.hold!.target, b.hold!.action, `${point.code} · przytrzymanie ${i + 1}`); }}>Przytrzymaj {i + 1}</button>}</div>)}</div></>}
    <details className="flow-details"><summary>Wypróbuj scenę<Icon name="ChevronDown" size={16}/></summary><div className="scene-chips">{project.scenes.map(s => <button key={s.id} onClick={() => { setActiveKey(''); run(s.id, 'Uruchom scenę', `scena ${s.name}`); }}><Icon name={s.icon} size={17}/>{s.name}</button>)}</div></details>
    <div className="review-export"><button className="outline full" disabled={busy} onClick={() => exportFile('pdf')}><Icon name="FileText"/>Pobierz PDF</button><small>Rzut, zdjęcia sensorów, klawisze i sceny.</small><button className="quiet" onClick={openHandoff}><Icon name="FolderOpen"/>Wszystkie eksporty i dokumenty</button></div>
  </aside></>;
}
