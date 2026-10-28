import { useState, type CSSProperties } from 'react';
import { Field, Icon, Tool } from './components';
import { finishes, type Point, type Project } from './model';
import { addTouchFunction, addTouchPage, MAX_TOUCH_FUNCTIONS, MAX_TOUCH_PAGES, removeTouchPage, resizeTouchPage, touchBindingIcon, touchBindingLabel, touchPages } from './touch-pages';
import './touch-panel.css';

export function TouchPanel({ project, point, active, choose, pageId, changePage, simulate = false }: {
  project: Project; point: Point; active?: string; choose: (id: string) => void;
  pageId?: string; changePage?: (id: string) => void; simulate?: boolean;
}) {
  const [localPageId, setLocalPageId] = useState('');
  const pages = touchPages(point), page = pages.find(p => p.id === (pageId ?? localPageId)) ?? pages[0];
  const pageIndex = pages.indexOf(page);
  const go = (id: string) => { setLocalPageId(id); changePage?.(id); };
  return <div className="touch-preview">
    <div className="touch-frame" style={{ '--touch-frame': finishes[point.finish] ?? '#eee' } as CSSProperties}>
      <div className="touch-bezel"><div className="touch-screen" aria-label={`LS TOUCH · ${page.name || 'Podstrona'}`}>
        <header><span>{page.name || 'Podstrona'}</span><small>{pageIndex + 1}/{pages.length}</small></header>
        <div className={`touch-tiles tiles-${page.bindingIds.length}`}>
          {page.bindingIds.map((id, slot) => {
            const binding = point.bindings.find(b => b.id === id);
            if (!binding) return null;
            return <button key={id} className={active === id ? 'active' : ''} aria-pressed={active === id}
              aria-label={`${simulate ? 'Naciśnij' : 'Edytuj'} pole ${slot + 1}: ${touchBindingLabel(project, binding)}`}
              title={`${touchBindingLabel(project, binding)} · ${binding.action}`} onClick={() => choose(id)}>
              <span className="touch-tile-number">{slot + 1}</span><Icon name={touchBindingIcon(project, binding)} size={25}/>
              <strong>{touchBindingLabel(project, binding)}</strong><small>{binding.action}</small>
            </button>;
          })}
        </div>
        <nav aria-label="Podstrony LS TOUCH">
          <button aria-label="Poprzednia podstrona" disabled={pageIndex === 0} onClick={() => go(pages[pageIndex - 1].id)}><Icon name="ChevronLeft" size={18}/></button>
          <div>{pages.map((p, i) => <button key={p.id} aria-label={`Podstrona ${i + 1}: ${p.name || 'Bez nazwy'}`} aria-current={p.id === page.id ? 'page' : undefined} onClick={() => go(p.id)}><span/></button>)}</div>
          <button aria-label="Następna podstrona" disabled={pageIndex === pages.length - 1} onClick={() => go(pages[pageIndex + 1].id)}><Icon name="ChevronRight" size={18}/></button>
        </nav>
      </div></div>
    </div>
    <small className="touch-caption">{simulate ? 'Dotknij pola, aby sprawdzić działanie.' : 'Dotknij pola, aby edytować funkcję.'}<br/>Poglądowy układ ekranu · do uzgodnienia w ETS</small>
  </div>;
}

export function TouchPageEditor({ project, point, pageId, changePage, choose, update }: {
  project: Project; point: Point; pageId: string; changePage: (id: string) => void; choose: (id: string) => void; update: (fn: (point: Point) => void) => void;
}) {
  const pages = touchPages(point), page = pages.find(p => p.id === pageId) ?? pages[0];
  return <section className="touch-page-editor" aria-label="Ustawienia podstron LS TOUCH">
    <div className="row spread"><h4>Podstrony <small>{pages.length}/{MAX_TOUCH_PAGES}</small></h4>
      <button className="quiet" disabled={pages.length >= MAX_TOUCH_PAGES} onClick={() => { const copy = structuredClone(point); const added = addTouchPage(copy); update(p => { p.bindings = copy.bindings; p.panelPages = copy.panelPages; }); if (added) changePage(added.id); }}><Icon name="Plus" size={15}/>Dodaj podstronę</button></div>
    <div className="touch-page-tabs">{pages.map((p, i) => <button key={p.id} aria-pressed={p.id === page.id} onClick={() => changePage(p.id)}>{i + 1}. {p.name || 'Bez nazwy'}</button>)}</div>
    <div className="form-grid">
      <Field label="Nazwa podstrony" wide><input value={page.name} maxLength={80} onChange={e => update(p => { const found = p.panelPages?.find(x => x.id === page.id); if (found) found.name = e.target.value; })}/></Field>
      <Field label="Układ ekranu"><select value={page.bindingIds.length} onChange={e => { const count = Number(e.target.value); update(p => resizeTouchPage(p, page.id, count)); changePage(page.id); }}>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'pole' : 'pola'}</option>)}</select></Field>
      <div className="touch-delete"><Tool icon="Trash2" label="Usuń podstronę" disabled={pages.length === 1} onClick={() => { if (confirm('Usunąć tę podstronę? Jej funkcje pozostaną na liście wszystkich funkcji.')) { update(p => removeTouchPage(p, page.id)); changePage(pages.find(p => p.id !== page.id)!.id); } }}/></div>
    </div>
    <details className="flow-details"><summary>Funkcje na tej podstronie<Icon name="ChevronDown" size={16}/></summary>
      {page.bindingIds.map((id, slot) => <Field key={slot} label={`Pole ${slot + 1}`}><select value={id} onChange={e => {
        const copy = structuredClone(point);
        const found = copy.panelPages?.find(x => x.id === page.id);
        const id = e.target.value === 'new' ? addTouchFunction(copy)?.id : e.target.value;
        if (found && id) found.bindingIds[slot] = id;
        update(p => { p.bindings = copy.bindings; p.panelPages = copy.panelPages; });
        if (id) choose(id);
      }}>{point.bindings.map((b, i) => <option key={b.id} value={b.id} disabled={b.id !== id && page.bindingIds.includes(b.id)}>{i + 1}. {touchBindingLabel(project, b)}</option>)}
        <option value="new" disabled={point.bindings.length >= MAX_TOUCH_FUNCTIONS}>+ Nowa funkcja</option>
      </select></Field>)}
    </details>
    <p className="small muted">Do 5 stron ulubionych, po 1–4 pola. Zmiana układu zachowuje funkcje na liście poniżej.</p>
  </section>;
}
