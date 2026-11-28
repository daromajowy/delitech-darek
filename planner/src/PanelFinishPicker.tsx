import { useState } from 'react';
import { Icon } from './components';
import { finishInk, finishSurface, panelFinish, panelFinishes, type PanelFinish } from './panel-finishes';
import type { Point } from './model';
import './panel-finishes.css';

export function PanelFinishPicker({ point, change }: { point: Point; change: (finish: string) => void }) {
  const [showColors, setShowColors] = useState(point.finish.startsWith('LC '));
  const choices = panelFinishes(point.sensor), current = panelFinish(point.sensor, point.finish);
  const groups = [...new Set(choices.map(f => f.group))];
  const swatches = (items: PanelFinish[]) => <div className="panel-finish-swatches">{items.map(f => <button type="button" key={f.id}
    aria-label={`Wykończenie ${f.label}${f.code ? ` · ${f.code}` : ''}`} aria-pressed={point.finish === f.id}
    title={`${f.label}${f.code ? ` · ${f.code}` : ''}`} style={{ background: finishSurface(f), color: finishInk(f.color) }}
    onClick={() => change(f.id)}>{point.finish === f.id && <Icon name="Check" size={16}/>}</button>)}</div>;
  return <section className="panel-finish-picker" aria-label="Wykończenie panelu">
    <div className="panel-finish-heading"><strong>Wykończenie</strong><span aria-live="polite">{current.label}{current.code && <small>{current.code}</small>}</span></div>
    {!choices.some(f => f.id === point.finish) && <p className="panel-finish-note">Zapisane wykończenie: {point.finish || 'do ustalenia'}.</p>}
    {choices.length === 1 ? <div className="panel-finish-single">{swatches(choices)}<span>Ten model występuje w kolorze czarnym.</span></div> : groups.map(group => {
      const colors = choices.filter(f => f.group === group);
      return group === 'Les Couleurs® Le Corbusier®' ? <div key={group} className="panel-finish-extra">
        <button type="button" className="panel-finish-toggle" aria-expanded={showColors} onClick={() => setShowColors(v => !v)}><span>Les Couleurs® Le Corbusier® <small>{colors.length} kolory</small></span><Icon name={showColors ? 'ChevronUp' : 'ChevronDown'} size={14}/></button>
        {showColors && swatches(colors)}
      </div> : <div className="panel-finish-group" key={group}><small>{group}</small>{swatches(colors)}</div>;
    })}
    <p className="panel-finish-note">Kolory na ekranie są poglądowe. Wykończenie potwierdzamy na próbce.</p>
  </section>;
}
