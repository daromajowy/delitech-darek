import { useEffect, useState } from 'react';
import { Icon } from './components';
import { pointPhoto } from './documents';
import type { Point, Project } from './model';

export function SensorPhoto({ project, point }: { project: Project; point: Point }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let disposed = false, release = () => {};
    setSrc('');
    pointPhoto(project, point).then(photo => {
      if (disposed) photo?.release(); else { release = photo?.release ?? release; setSrc(photo?.url ?? ''); }
    }).catch(() => { if (!disposed) setSrc(''); });
    return () => { disposed = true; release(); };
  }, [project.id, point.photoId, point.sensor]);
  return src ? <img src={src} alt={`${point.sensor} · zdjęcie ${point.photoId ? 'wybrane' : 'referencyjne'}`}/> : <div className="sensor-placeholder"><Icon name="PanelTop" size={48}/></div>;
}

export function SensorKeys({ project, point, active, choose, simulate = false }: {
  project: Project; point: Point; active?: string; choose: (id: string) => void; simulate?: boolean;
}) {
  // Only the known four-key F40 has a matching spatial map. Other variants use numbered controls.
  const spatial = point.sensor === 'JUNG F40' && point.bindings.length === 4 && !point.photoId;
  return <div className={`sensor-key-preview ${spatial ? 'spatial' : ''}`}>
    <SensorPhoto project={project} point={point}/>
    <div className="sensor-key-map" aria-label={simulate ? 'Przetestuj klawisze' : 'Wybierz klawisz'}>{point.bindings.map((b, i) => <button key={b.id} aria-label={`${simulate ? 'Naciśnij' : 'Edytuj'} klawisz ${i + 1}`} aria-pressed={active === b.id} className={active === b.id ? 'active' : ''} onClick={() => choose(b.id)} title={b.label || `Klawisz ${i + 1}`}>{i + 1}</button>)}</div>
    <small>{spatial ? 'Poglądowy układ 4 klawiszy · zdjęcie referencyjne' : 'Pola funkcjonalne · układ zależy od wariantu urządzenia'}</small>
  </div>;
}
