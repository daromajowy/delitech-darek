import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detachDocument, duplicateRoom, exampleProject, normalizeProject, type PlanVertex } from '../src/model';
import { pointInPolygon, polygonRoomArea, roomLabelPosition, roomPolygonError, roomVertices } from '../src/room-geometry';

const lShape: PlanVertex[] = [
  { x: 0.1, y: 0.1 }, { x: 0.8, y: 0.1 }, { x: 0.8, y: 0.3 },
  { x: 0.3, y: 0.3 }, { x: 0.3, y: 0.8 }, { x: 0.1, y: 0.8 },
];

test('concave room stores page-relative vertices and correct bounds in either winding', () => {
  for (const vertices of [lShape, [...lShape].reverse()]) {
    const area = polygonRoomArea('floor-plan', 2, vertices);
    assert.equal(area.documentId, 'floor-plan');
    assert.equal(area.page, 2);
    assert.equal(area.x, 0.1);
    assert.equal(area.y, 0.1);
    assert.ok(Math.abs(area.width - 0.7) < 1e-10);
    assert.ok(Math.abs(area.height - 0.7) < 1e-10);
    assert.deepEqual(area.vertices, vertices);
    assert.notEqual(area.vertices![0], vertices[0]);
  }
});

test('triangles, diagonal walls and rounded outlines made of many corners are accepted', () => {
  assert.equal(roomPolygonError([{ x: 0.2, y: 0.1 }, { x: 0.7, y: 0.8 }, { x: 0.1, y: 0.8 }]), null);
  const rounded = Array.from({ length: 100 }, (_, i) => ({ x: 0.5 + 0.3 * Math.cos(i * Math.PI / 50), y: 0.5 + 0.2 * Math.sin(i * Math.PI / 50) }));
  assert.equal(roomPolygonError(rounded), null);
});

test('room hit testing and label position respect the empty notch in an L shape', () => {
  const area = polygonRoomArea('floor-plan', 1, lShape);
  assert.equal(pointInPolygon({ x: 0.6, y: 0.2 }, lShape), true);
  assert.equal(pointInPolygon({ x: 0.2, y: 0.6 }, lShape), true);
  assert.equal(pointInPolygon({ x: 0.6, y: 0.6 }, lShape), false);
  assert.equal(pointInPolygon(roomLabelPosition(area), lShape), true);
});

test('old rectangular room areas still render their four original corners', () => {
  const area = { documentId: 'floor-plan', page: 1, x: 0.1, y: 0.2, width: 0.3, height: 0.4 };
  const vertices = roomVertices(area);
  assert.equal(vertices.length, 4);
  assert.deepEqual(vertices[0], { x: 0.1, y: 0.2 });
  assert.deepEqual(vertices[2], { x: 0.4, y: 0.2 + 0.4 });
  assert.deepEqual(roomLabelPosition(area), { x: 0.25, y: 0.4 });
  assert.equal('vertices' in area, false);
});

const invalidShapes: Record<string, PlanVertex[]> = {
  'too few vertices': lShape.slice(0, 2),
  'too many vertices': Array.from({ length: 101 }, (_, i) => ({ x: 0.5 + 0.3 * Math.cos(i * Math.PI * 2 / 101), y: 0.5 + 0.3 * Math.sin(i * Math.PI * 2 / 101) })),
  'outside page': [{ x: -0.1, y: 0.1 }, ...lShape.slice(1)],
  'nonfinite coordinate': [{ x: NaN, y: 0.1 }, ...lShape.slice(1)],
  'duplicate vertex': [...lShape, lShape[0]],
  'self intersection': [{ x: 0.1, y: 0.1 }, { x: 0.8, y: 0.8 }, { x: 0.1, y: 0.8 }, { x: 0.8, y: 0.1 }],
  'backtracking edge': [{ x: 0.1, y: 0.1 }, { x: 0.8, y: 0.1 }, { x: 0.3, y: 0.1 }, { x: 0.3, y: 0.8 }],
  'collinear': [{ x: 0.1, y: 0.1 }, { x: 0.4, y: 0.4 }, { x: 0.8, y: 0.8 }],
  'negligible area': [{ x: 0.1, y: 0.1 }, { x: 0.8, y: 0.8 }, { x: 0.5, y: 0.50000001 }],
};
for (const [name, vertices] of Object.entries(invalidShapes)) {
  test(`invalid room outline is rejected: ${name}`, () => {
    assert.ok(roomPolygonError(vertices));
    assert.throws(() => polygonRoomArea('floor-plan', 1, vertices));
  });
}

test('polygon outline survives serialization and normalization; duplicate and delete do not retain stale outlines', () => {
  const project = exampleProject();
  project.rooms[0].planArea = polygonRoomArea('floor-plan', 1, lShape);
  const saved = normalizeProject(JSON.parse(JSON.stringify(project)));
  assert.deepEqual(saved.rooms[0].planArea, project.rooms[0].planArea);
  assert.equal(duplicateRoom(saved, saved.rooms[0].id).rooms.at(-1)!.planArea, undefined);
  detachDocument(saved, 'floor-plan');
  assert.equal(saved.rooms[0].planArea, undefined);
});
