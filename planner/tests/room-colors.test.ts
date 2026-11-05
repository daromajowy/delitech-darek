import { test } from 'node:test';
import assert from 'node:assert/strict';
import { duplicateRoom, emptyRoom, exampleProject, normalizeProject } from '../src/model';
import { assignRoomColors, roomColor, roomColorStyle, roomPalette } from '../src/room-colors';

test('legacy rooms receive different pastels without changing the source or plan geometry', () => {
  const source = exampleProject();
  source.rooms[0].planArea = { documentId: 'plan', page: 1, x: .1, y: .2, width: .3, height: .4 };
  const before = structuredClone(source);
  const project = normalizeProject(source);
  assert.equal(new Set(project.rooms.map(room => room.color)).size, project.rooms.length);
  assert.deepEqual(project.rooms[0].planArea, source.rooms[0].planArea);
  assert.deepEqual(source, before);
  assert.deepEqual(normalizeProject(project), project);
});

test('saved choices survive serialization, room reordering, removal and adding another room', () => {
  const project = normalizeProject(exampleProject());
  project.rooms[0].color = roomPalette[10].fill;
  const chosen = new Map(project.rooms.map(room => [room.id, room.color]));
  project.rooms.reverse();
  project.rooms.splice(1, 1);
  const saved = normalizeProject(JSON.parse(JSON.stringify(project)));
  const added = emptyRoom('Nowy pokój');
  saved.rooms.push(added);
  assignRoomColors(saved.rooms);
  for (const room of saved.rooms.slice(0, -1)) assert.equal(room.color, chosen.get(room.id));
  assert.ok(added.color);
  assert.ok(!saved.rooms.slice(0, -1).some(room => room.color === added.color));
});

test('duplicating a room gives its copy a new available colour and leaves the original unchanged', () => {
  const project = normalizeProject(exampleProject());
  const before = structuredClone(project);
  const copy = duplicateRoom(project, project.rooms[0].id);
  assert.notEqual(copy.rooms.at(-1)!.color, project.rooms[0].color);
  assert.deepEqual(project, before);
});

test('invalid imported colours are replaced and a full palette is reused evenly', () => {
  const rooms = Array.from({ length: 100 }, (_, i) => emptyRoom(`Pokój ${i + 1}`));
  rooms[0].color = 'url(https://example.invalid/image.svg)';
  assert.deepEqual(roomColorStyle(rooms[0]), { '--room-fill': roomPalette[0].fill, '--room-stroke': roomPalette[0].stroke });
  assignRoomColors(rooms);
  const counts = roomPalette.map(color => rooms.filter(room => room.color === color.fill).length);
  assert.equal(Math.max(...counts) - Math.min(...counts), 1);
  assert.ok(rooms.every(room => room.color === roomColor(room).fill));
});
