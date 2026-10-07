import { addControlPoint, deviceTypes, type Project, type Room } from "./model";
import { Icon, NumberInput, Select, Tool } from "./components";

export function RoomPoints({ project, room, edit, configure }: {
  project: Project; room: Room; edit: (fn: (p: Project) => void) => void; configure: (id: string) => void;
}) {
  const points = project.points.filter(p => p.roomId === room.id);
  return <section className="room-points">
    <div className="row spread"><h3>Punkty sterowania <span className="muted">{points.length}</span></h3>
      <button className="quiet" onClick={() => edit(p => { addControlPoint(p, room.id); })}><Icon name="Plus" />Dodaj punkt</button></div>
    {points.map(pt => <div className="room-point" key={pt.id}>
      <strong className="point-code">{pt.code}</strong>
      <label><span className="sr-only">Nazwa punktu {pt.code}</span><input value={pt.name} maxLength={150} onChange={e => edit(p => { p.points.find(x => x.id === pt.id)!.name = e.target.value; })} /></label>
      <Select label={`Rodzaj ${pt.code}`} value={pt.deviceType ?? "Sensor KNX"} options={deviceTypes} onChange={v => edit(p => { p.points.find(x => x.id === pt.id)!.deviceType = v; })} />
      <div className="height-input"><NumberInput label={`Wysokość ${pt.code}`} max={500} value={pt.height} onChange={v => edit(p => { p.points.find(x => x.id === pt.id)!.height = v; })}/><small>cm</small></div>
      <div className="row"><Tool icon="Settings2" label={`Ustaw funkcje ${pt.code}`} onClick={() => configure(pt.id)} />
        <Tool icon="Copy" label={`Powiel ${pt.code}`} onClick={() => edit(p => { addControlPoint(p, room.id, pt); })} />
        <Tool icon="Trash2" label={`Usuń ${pt.code}`} onClick={() => { if (confirm(`Usunąć punkt ${pt.code} wraz z funkcjami i pozycją na rzucie?`)) edit(p => { p.points = p.points.filter(x => x.id !== pt.id); }); }} /></div>
    </div>)}
    {!points.length && <div className="empty-inline">Brak punktów sterowania w tym pomieszczeniu.</div>}
  </section>;
}
