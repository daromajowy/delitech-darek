import type { Binding, Project, Scene } from './model';

export const actionRoomId = (project: Project, action: Pick<Binding, 'target'>) =>
  project.rooms.find(room => room.circuits.some(circuit => circuit.id === action.target))?.id;

// Older scenes may name one room but already contain actions from several rooms.
// Derive their visible scope without rewriting the saved scene or its actions.
export function sceneRoomIds(project: Project, scene: Scene): string[] {
  const ids = new Set([
    ...(scene.roomIds ?? (scene.roomId ? [scene.roomId] : [])),
  ]);
  const targets = new Set(scene.actions.map(action => action.target));
  return project.rooms.filter(room => ids.has(room.id) || room.circuits.some(c => targets.has(c.id))).map(room => room.id);
}

export function sceneRoomsLabel(project: Project, scene: Scene): string {
  return sceneRoomIds(project, scene).map(id => {
    const room = project.rooms.find(r => r.id === id)!;
    return project.rooms.filter(r => r.name === room.name).length > 1 ? `${room.name} (${room.floor})` : room.name;
  }).join(', ') || 'Pomieszczenia do wyboru';
}

function setRooms(scene: Scene, ids: string[]) {
  scene.roomIds = ids;
  // Keep the old field compatible with existing integrations and older clients.
  if (ids.length) scene.roomId = ids[0]; else delete scene.roomId;
}

export function addSceneRoom(project: Project, scene: Scene, roomId: string): void {
  if (!project.rooms.some(room => room.id === roomId)) return;
  setRooms(scene, [...new Set([...sceneRoomIds(project, scene), roomId])]);
}

// The editor requests confirmation before removing a room with actions.
export function removeSceneRoom(project: Project, scene: Scene, roomId: string): void {
  const remaining = sceneRoomIds(project, scene).filter(id => id !== roomId);
  scene.actions = scene.actions.filter(action => actionRoomId(project, action) !== roomId);
  setRooms(scene, remaining);
}

export function forgetSceneRoom(scene: Scene, roomId: string): void {
  if (scene.roomIds) scene.roomIds = scene.roomIds.filter(id => id !== roomId);
  if (scene.roomId === roomId) {
    if (scene.roomIds?.length) scene.roomId = scene.roomIds[0]; else delete scene.roomId;
  }
}
