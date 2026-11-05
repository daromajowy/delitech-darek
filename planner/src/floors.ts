import type { FloorPlan, Project, Room } from './model';

export const MAX_FLOORS = 100;
export const samePlan = (a?: FloorPlan, b?: FloorPlan) => a?.documentId === b?.documentId && a?.page === b?.page;
export const roomFloor = (p: Project, room?: Room) => room && p.floors?.find(f => room.floorId ? f.id === room.floorId : f.name === room.floor);

// Older projects identify floors by name. Keep those labels and every existing placement.
export function normalizeFloors(p: Project) {
  p.floors ??= [];
  for (const room of p.rooms) {
    let floor = roomFloor(p, room) ?? p.floors.find(f => f.name === (room.floor || 'Bez kondygnacji'));
    if (!floor) { floor = { id: crypto.randomUUID(), name: room.floor || 'Bez kondygnacji' }; p.floors.push(floor); }
    room.floorId = floor.id;
    room.floor = floor.name;
  }
  if (!p.floors.length) p.floors.push({ id: crypto.randomUUID(), name: 'Parter' });
  for (const floor of p.floors) {
    if (floor.plan) continue;
    const ids = new Set(p.rooms.filter(r => r.floorId === floor.id).map(r => r.id));
    const placements = [...p.rooms.filter(r => ids.has(r.id)).map(r => r.planArea), ...p.points.filter(pt => ids.has(pt.roomId)).map(pt => pt.placement)]
      .filter(pos => pos && p.attachments.some(a => a.id === pos.documentId && a.mime === 'application/pdf'));
    const first = placements[0];
    if (first && placements.every(pos => samePlan(pos, first))) floor.plan = { documentId: first.documentId, page: first.page };
  }
}

export function floorNameError(p: Project, name: string, id?: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'Podaj nazwę kondygnacji.';
  if (trimmed.length > 100) return 'Nazwa może mieć maksymalnie 100 znaków.';
  if (p.floors?.some(f => f.id !== id && f.name.trim().toLocaleLowerCase('pl') === trimmed.toLocaleLowerCase('pl'))) return 'Taka kondygnacja już istnieje.';
  return '';
}

export function conflictingPlacements(p: Project, roomIds: string[], plan?: FloorPlan) {
  const ids = new Set(roomIds);
  return p.rooms.filter(r => ids.has(r.id) && r.planArea && !samePlan(r.planArea, plan)).length
    + p.points.filter(pt => ids.has(pt.roomId) && pt.placement && !samePlan(pt.placement, plan)).length;
}

function clearOtherPlacements(p: Project, roomIds: string[], plan?: FloorPlan) {
  const ids = new Set(roomIds);
  p.rooms.forEach(r => { if (ids.has(r.id) && r.planArea && !samePlan(r.planArea, plan)) delete r.planArea; });
  p.points.forEach(pt => { if (ids.has(pt.roomId) && pt.placement && !samePlan(pt.placement, plan)) delete pt.placement; });
}

export function setFloorPlan(p: Project, floorId: string, plan?: FloorPlan) {
  const floor = p.floors?.find(f => f.id === floorId);
  if (!floor || samePlan(floor.plan, plan)) return;
  clearOtherPlacements(p, p.rooms.filter(r => roomFloor(p, r)?.id === floorId).map(r => r.id), plan);
  if (plan) floor.plan = { ...plan }; else delete floor.plan;
  delete p.planView;
}

export function renameFloor(p: Project, floorId: string, name: string) {
  const floor = p.floors?.find(f => f.id === floorId);
  if (!floor) return;
  p.rooms.forEach(r => { if (roomFloor(p, r)?.id === floorId) { r.floorId = floorId; r.floor = name.trim(); } });
  floor.name = name.trim();
}

export function moveRoomToFloor(p: Project, roomId: string, floorId: string) {
  const room = p.rooms.find(r => r.id === roomId), floor = p.floors?.find(f => f.id === floorId);
  if (!room || !floor || roomFloor(p, room)?.id === floorId) return;
  clearOtherPlacements(p, [roomId], floor.plan);
  room.floorId = floorId;
  room.floor = floor.name;
}

export function planChangeMessage(count: number) {
  return `Zmiana rzutu usunie ${count} oznaczeń pomieszczeń i punktów z poprzedniego rzutu tej kondygnacji. Pokoje, obwody i funkcje pozostaną. Kontynuować?`;
}
