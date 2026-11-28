import { useEffect, useState, type CSSProperties } from 'react';
import { Icon } from './components';
import { pointPhoto } from './documents';
import type { Point, Project } from './model';
import { isLsTouch, touchBindingIcon } from './touch-pages';
import { TouchPanel } from './TouchPanel';
import { panelArtwork, panelKeyZones } from './panel-artwork';
import { finishInk, panelFinish } from './panel-finishes';
import './panel-finishes.css';

export function SensorPhoto({ project, point }: { project: Project; point: Point }) {
  const [src, setSrc] = useState('');
  const artwork = !point.photoId ? panelArtwork(point) : null;
  useEffect(() => {
    let disposed = false, release = () => {};
    setSrc('');
    if (artwork) return;
    pointPhoto(project, point).then(photo => {
      if (disposed) photo?.release(); else { release = photo?.release ?? release; setSrc(photo?.url ?? ''); }
    }).catch(() => { if (!disposed) setSrc(''); });
    return () => { disposed = true; release(); };
  }, [project.id, point.photoId, point.sensor, artwork]);
  return artwork || src ? <img src={artwork || src} data-finish={point.finish} alt={`${point.sensor} · ${panelFinish(point.sensor, point.finish).label} · ${artwork ? 'pogląd wykończenia' : `zdjęcie ${point.photoId ? 'wybrane' : 'referencyjne'}`}`}/> : <div className="sensor-placeholder"><Icon name="PanelTop" size={48}/></div>;
}

export function SensorKeys({ project, point, active, choose, simulate = false, pageId, changePage }: {
  project: Project; point: Point; active?: string; choose: (id: string) => void; simulate?: boolean;
  pageId?: string; changePage?: (id: string) => void;
}) {
  if (isLsTouch(point)) return <TouchPanel key={point.id} {...{ project, point, active, choose, simulate, pageId, changePage }}/>;
  const zones = !point.photoId ? panelKeyZones(point) : [], spatial = zones.length > 0;
  const ink = finishInk(panelFinish(point.sensor, point.finish).color);
  const keys = <div className="sensor-key-map" aria-label={simulate ? 'Przetestuj klawisze' : 'Wybierz klawisz'}>{point.bindings.map((b, i) => <button key={b.id} aria-label={`${simulate ? 'Naciśnij' : 'Edytuj'} klawisz ${i + 1}`} aria-pressed={active === b.id} className={active === b.id ? 'active' : ''} onClick={() => choose(b.id)} title={b.label || `Klawisz ${i + 1}`}
    style={spatial ? { left: `${zones[i].x / 3.2}%`, top: `${zones[i].y / 3.2}%`, width: `${zones[i].width / 3.2}%`, height: `${zones[i].height / 3.2}%` } : undefined}>{spatial && <Icon name={touchBindingIcon(project, b)} size={18}/>}<span>{i + 1}</span></button>)}</div>;
  return <div className={`sensor-key-preview ${spatial ? 'finish-spatial' : ''}`} style={{ '--panel-ink': ink } as CSSProperties}>
    <div className="panel-key-stage">
    <SensorPhoto project={project} point={point}/>
    {spatial && keys}</div>{!spatial && keys}
    <small>{point.photoId ? 'Własne zdjęcie · wykończenie zapisane w projekcie' : spatial ? 'Pogląd wykończenia · dotknij pola funkcji' : 'Pola funkcjonalne · układ zależy od wariantu urządzenia'}</small>
  </div>;
}
