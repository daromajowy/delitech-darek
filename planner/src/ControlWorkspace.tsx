import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useDraggable, useSensor, useSensors } from "@dnd-kit/core";
import { Field, Icon, NumberInput, Select, Tool } from "./components";
import { addControlPoint, deviceTypes, finishes, sensors, targets, uid, type Attachment, type Binding, type Point, type Project } from "./model";
import { SensorKeys } from "./SensorPreview";
import { ActionField } from "./ActionField";
import { actionOptions } from "./behavior";
import { PlanBoard } from "./PlanBoard";

function PointNav({ point, selected, choose }: { point: Point; selected: boolean; choose: () => void }) {
  const { setNodeRef, listeners, attributes } = useDraggable({ id: `point-${point.id}`, data: { pointId: point.id } });
  return <div className={`point-nav ${selected ? "selected" : ""}`}>
    <button ref={setNodeRef} {...listeners} {...attributes} className="point-handle" title={`Przeciągnij ${point.code} na rzut`} aria-label={`Przeciągnij ${point.code} na rzut`}><Icon name="GripVertical" size={18}/></button>
    <button onClick={choose} aria-pressed={selected}><strong>{point.code}</strong><span>{point.name}<small>{point.sensor}</small></span><Icon name={point.placement ? "MapPinCheck" : "MapPin"} size={16}/></button>
  </div>;
}

export function ControlWorkspace({ project, pointId, select, edit, upload, busy, goRooms }: {
  project: Project; pointId: string; select: (id: string) => void; edit: (fn: (p: Project) => void) => void;
  upload: (file: File) => Promise<Attachment | undefined>; busy: boolean; goRooms: () => void;
}) {
  const point = project.points.find(p => p.id === pointId) ?? project.points[0];
  const [keyId, setKeyId] = useState(""), [dragId, setDragId] = useState("");
  const key = point?.bindings.find(b => b.id === keyId) ?? point?.bindings[0];
  const dragPoint = project.points.find(p => p.id === dragId);
  const allTargets = targets(project);
  const dndSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const update = (fn: (p: Point) => void) => edit(p => { const pt = p.points.find(x => x.id === point?.id); if (pt) fn(pt); });
  const updateKey = (fn: (b: Binding) => void) => update(p => { const b = p.bindings.find(x => x.id === key?.id); if (b) fn(b); });
  return <DndContext sensors={dndSensors} onDragStart={e => { setDragId(e.active.data.current?.pointId ?? ""); select(e.active.data.current?.pointId ?? ""); }} onDragCancel={() => setDragId("")} onDragEnd={() => setDragId("")}>
    <div className="control-workspace">
      <aside className="control-points left-panel"><div className="row spread"><h3>Punkty sterowania</h3><Tool icon="ListTree" label="Edytuj punkty w pomieszczeniach" onClick={goRooms}/></div>
        {project.rooms.map(room => <section key={room.id} className={`control-room ${project.points.some(p => p.roomId === room.id) ? '' : 'empty'}`}><h4>{room.name}<small>{room.floor}</small></h4>
          {project.points.filter(p => p.roomId === room.id).map(pt => <PointNav key={pt.id} point={pt} selected={pt.id === point?.id} choose={() => select(pt.id)}/>)}
          <button className="quiet" onClick={() => { const copy = structuredClone(project); const added = addControlPoint(copy, room.id); edit(p => { p.points = copy.points; p.nextPointNumber = copy.nextPointNumber; }); select(added.id); }}><Icon name="Plus" size={15}/>Punkt w {room.name}</button>
        </section>)}
        {!project.rooms.length && <button className="outline" onClick={goRooms}><Icon name="Plus"/>Dodaj pomieszczenie</button>}
      </aside>
      <section className="control-plan-main"><div className="section-heading"><h2>Rzut i sterowanie</h2><p className="muted">Przeciągnij punkt na rzut lub wybierz jego pozycję kliknięciem.</p></div>
        <PlanBoard project={project} point={point} select={select} edit={edit} upload={upload} busy={busy} dragging={!!dragId} roomId={point?.roomId}/>
      </section>
      <aside className="right-panel control-editor">
        {point ? <>
          <div className="row spread"><h3>{point.code} · {point.name}</h3><div className="row"><Tool icon="Copy" label="Powiel punkt" onClick={() => { const copy = structuredClone(project); const added = addControlPoint(copy, point.roomId, point); edit(p => { p.points = copy.points; p.nextPointNumber = copy.nextPointNumber; }); select(added.id); }}/><Tool icon="Trash2" label="Usuń punkt sterowania" onClick={() => { if (confirm(`Usunąć ${point.code} wraz z funkcjami i pozycją na rzucie?`)) edit(p => { p.points = p.points.filter(x => x.id !== point.id); }); }}/></div></div>
          <small>{point.sensor} · {point.finish}</small>
          <details className="flow-details model-settings" key={point.id}><summary><span><Icon name="Pencil" size={16}/>Zmień model i dane punktu</span><Icon name="ChevronDown" size={16}/></summary><div className="form-grid">
            <Field label="Nazwa punktu"><input value={point.name} maxLength={150} onChange={e => update(p => { p.name = e.target.value; })}/></Field>
            <Field label="Pomieszczenie"><select value={point.roomId} onChange={e => update(p => { p.roomId = e.target.value; })}>{project.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></Field>
            <Field label="Rodzaj urządzenia"><Select value={point.deviceType ?? "Sensor KNX"} options={deviceTypes} onChange={v => update(p => { p.deviceType = v; })}/></Field>
            <Field label="Sensor / seria"><Select value={point.sensor} options={[...sensors.map(s => s.name), "Inny sensor / panel"]} onChange={v => update(p => { p.sensor = v; if (v === "JUNG LS TOUCH") p.deviceType = "Panel dotykowy"; else if (sensors.some(s => s.name === v)) p.deviceType = "Sensor KNX"; const s = sensors.find(x => x.name === v); if (s && !s.finishes.includes(p.finish)) p.finish = s.finishes[0]; delete p.photoId; })}/></Field>
            {point.sensor === "Inny sensor / panel" && <Field label="Producent i model" wide><input value={point.model ?? ""} maxLength={250} onChange={e => update(p => { p.model = e.target.value; })}/></Field>}
            <Field label="Liczba klawiszy / pól"><select value={point.bindings.length} onChange={e => { const n = Number(e.target.value); if (n < point.bindings.length && !confirm("Zmniejszenie liczby pól usunie przypisania ostatnich klawiszy. Kontynuować?")) return; update(p => { p.bindings = Array.from({ length: n }, (_, i) => p.bindings[i] ?? { id: uid(), target: "", action: "Włącz / wyłącz" }); }); }}>{Array.from({ length: 24 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></Field>
            <Field label="Wysokość montażu (cm)"><NumberInput value={point.height} max={500} onChange={v => update(p => { p.height = v; })}/></Field>
            <Field label={`Wykończenie · ${point.finish}`} wide><div className="swatches">{(sensors.find(s => s.name === point.sensor)?.finishes ?? Object.keys(finishes)).map(f => <button key={f} type="button" title={f} aria-label={`Wykończenie ${f}`} aria-pressed={point.finish === f} className={point.finish === f ? "selected" : ""} style={{ background: finishes[f] }} onClick={() => update(p => { p.finish = f; })}>{point.finish === f && <Icon name="Check" size={17}/>}</button>)}</div></Field>
            <Field label="Status"><Select value={point.status} options={["Propozycja", "Do uzgodnienia", "Zatwierdzony"]} onChange={v => update(p => { p.status = v; })}/></Field>
            <Field label="Zdjęcie sensora"><select value={point.photoId ?? ""} onChange={e => update(p => { p.photoId = e.target.value || undefined; })}><option value="">Referencyjne</option>{project.attachments.filter(a => a.mime.startsWith("image/")).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
          </div></details>
          <SensorKeys project={project} point={point} active={key?.id} choose={setKeyId}/>
          <div className="key-list">{point.bindings.map((b, i) => <button key={b.id} className={b.id === key?.id ? "selected" : ""} aria-label={`Funkcje klawisza ${i + 1}`} onClick={() => setKeyId(b.id)}><b>{i + 1}</b><span>{b.label || allTargets.find(t => t.id === b.target)?.label || "Do ustalenia"}</span><Icon name="ChevronRight" size={15}/></button>)}</div>
          {key && <div className="key-editor" key={`${point.id}-${key.id}`}><h3>Klawisz {point.bindings.indexOf(key) + 1}</h3>
            <ActionField project={project} value={key} label="Krótkie naciśnięcie" change={value => updateKey(b => Object.assign(b, value))}/>
            {project.scenes.some(s => s.id === key.target) && <p className="small muted">{project.scenes.find(s => s.id === key.target)!.actions.map(a => `${allTargets.find(t => t.id === a.target)?.label ?? 'Do ustalenia'}: ${a.action}`).join(' · ') || 'Scena nie ma jeszcze działań.'}</p>}
            <details className="flow-details"><summary>Przytrzymanie i opis klawisza<Icon name="ChevronDown" size={16}/></summary>
              <label className="check long-press"><input type="checkbox" checked={!!key.hold} onChange={e => updateKey(b => { if (e.target.checked) b.hold = { target: b.target, action: actionOptions(project, b.target)[0] }; else delete b.hold; })}/><span>Długie naciśnięcie</span></label>
              {key.hold && <ActionField project={project} value={key.hold} label="Długie naciśnięcie" change={value => updateKey(b => { b.hold = value; })}/>}
              <Field label="Nazwa / opis klawisza"><input value={key.label ?? ""} maxLength={150} onChange={e => updateKey(b => { b.label = e.target.value; })}/></Field>
              <Field label="Szczegóły działania"><textarea rows={3} value={key.notes ?? ""} maxLength={3000} onChange={e => updateKey(b => { b.notes = e.target.value; })}/></Field>
            </details>
          </div>}
          <details className="flow-details"><summary>Dane montażowe · {point.height ?? '—'} cm<Icon name="ChevronDown" size={16}/></summary><Field label="Wysokość montażu (cm)"><NumberInput value={point.height} max={500} onChange={v => update(p => { p.height = v; })}/></Field><Field label="Status uzgodnienia"><Select value={point.status} options={["Propozycja", "Do uzgodnienia", "Zatwierdzony"]} onChange={v => update(p => { p.status = v; })}/></Field></details>
          <Field label="Uwagi do punktu"><textarea rows={2} maxLength={3000} value={point.notes} onChange={e => update(p => { p.notes = e.target.value; })}/></Field>
        </> : <div className="empty-inline"><h3>Dodaj punkt sterowania</h3><p>Przy wybranym pomieszczeniu kliknij „Punkt w…”. Potem wybierz sensor i przypisz klawisze.</p></div>}
      </aside>

    </div>
    <DragOverlay dropAnimation={null}>{dragPoint && <div className="point-drag"><Icon name="MapPin"/><b>{dragPoint.code}</b><span>{dragPoint.name}</span></div>}</DragOverlay>
  </DndContext>;
}
