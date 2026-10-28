import type { Binding, Point, Project, TouchPage } from './model';

export const isLsTouch = (point: Point) => point.sensor === 'JUNG LS TOUCH';
export const MAX_TOUCH_PAGES = 5;
export const MAX_TOUCH_FUNCTIONS = 32;

/** Legacy projects keep every binding; only the first 20 appear on favourite pages. */
export function touchPages(point: Point): TouchPage[] {
  return point.panelPages ?? Array.from({ length: Math.max(1, Math.min(5, Math.ceil(point.bindings.length / 4))) }, (_, i) => ({
    id: `legacy-${i}`, name: i ? `Strona ${i + 1}` : 'Ulubione',
    bindingIds: point.bindings.slice(i * 4, i * 4 + 4).map(b => b.id),
  }));
}

export function ensureTouchPages(point: Point) {
  if (!point.bindings.length) point.bindings.push({ id: crypto.randomUUID(), target: '', action: 'Włącz / wyłącz' });
  point.panelPages ??= touchPages(point).map(page => ({ ...page, id: crypto.randomUUID() }));
  // Removing functions must not leave dangling page references.
  point.panelPages.forEach(page => {
    page.bindingIds = page.bindingIds.filter(id => point.bindings.some(b => b.id === id));
    if (!page.bindingIds.length) page.bindingIds.push(point.bindings[0].id);
  });
  return point.panelPages;
}

export function addTouchFunction(point: Point): Binding | undefined {
  if (point.bindings.length >= MAX_TOUCH_FUNCTIONS) return;
  const binding = { id: crypto.randomUUID(), target: '', action: 'Włącz / wyłącz' };
  point.bindings.push(binding);
  return binding;
}

export function resizeTouchPage(point: Point, pageId: string, count: number) {
  const pages = point.panelPages ?? ensureTouchPages(point), page = pages.find(p => p.id === pageId);
  if (!page || !Number.isInteger(count) || count < 1 || count > 4) return;
  page.bindingIds = page.bindingIds.slice(0, count);
  while (page.bindingIds.length < count) {
    const used = new Set(pages.flatMap(p => p.bindingIds));
    const binding = point.bindings.find(b => !used.has(b.id)) ?? addTouchFunction(point)
      ?? point.bindings.find(b => !page.bindingIds.includes(b.id));
    if (!binding) break;
    page.bindingIds.push(binding.id);
  }
}

export function addTouchPage(point: Point): TouchPage | undefined {
  const pages = ensureTouchPages(point);
  if (pages.length >= MAX_TOUCH_PAGES) return;
  let number = 1;
  while (pages.some(p => p.name === `Strona ${number}`)) number++;
  const page = { id: crypto.randomUUID(), name: `Strona ${number}`, bindingIds: [] as string[] };
  pages.push(page);
  resizeTouchPage(point, page.id, 4);
  return page;
}

export function removeTouchPage(point: Point, pageId: string) {
  const pages = ensureTouchPages(point);
  if (pages.length > 1) point.panelPages = pages.filter(p => p.id !== pageId);
}

export function clonePointControls(point: Point, targetIds = new Map<string, string>()) {
  const ids = new Map(point.bindings.map(b => [b.id, crypto.randomUUID()]));
  const bindings = point.bindings.map(b => ({ ...structuredClone(b), id: ids.get(b.id)!,
    target: targetIds.get(b.target) ?? b.target,
    hold: b.hold ? { ...b.hold, target: targetIds.get(b.hold.target) ?? b.hold.target } : undefined,
  }));
  const panelPages = point.panelPages?.map(page => ({ ...page, id: crypto.randomUUID(), bindingIds: page.bindingIds.map(id => ids.get(id)!).filter(Boolean) }));
  return { bindings, ...(panelPages ? { panelPages } : {}) };
}

export function touchBindingLabel(project: Project, binding: Binding) {
  return binding.label || project.rooms.flatMap(r => r.circuits).find(c => c.id === binding.target)?.name
    || project.scenes.find(s => s.id === binding.target)?.name || 'Do ustalenia';
}

export function touchBindingIcon(project: Project, binding: Binding) {
  const scene = project.scenes.find(s => s.id === binding.target);
  if (scene) return scene.icon;
  const circuit = project.rooms.flatMap(r => r.circuits).find(c => c.id === binding.target);
  return ({ Oświetlenie: 'Lightbulb', Osłony: 'Blinds', Klimat: 'Thermometer', Pozostałe: 'PanelTop' } as const)[circuit?.kind ?? 'Pozostałe'];
}
