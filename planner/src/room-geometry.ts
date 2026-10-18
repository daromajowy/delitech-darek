import type { PlanVertex, RoomPlanArea } from './model';

export const MAX_ROOM_VERTICES = 100;
const EPSILON = 1e-10;
const cross = (a: PlanVertex, b: PlanVertex, c: PlanVertex) =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

function onSegment(p: PlanVertex, a: PlanVertex, b: PlanVertex) {
  return Math.abs(cross(a, b, p)) <= EPSILON
    && p.x >= Math.min(a.x, b.x) - EPSILON && p.x <= Math.max(a.x, b.x) + EPSILON
    && p.y >= Math.min(a.y, b.y) - EPSILON && p.y <= Math.max(a.y, b.y) + EPSILON;
}

function intersects(a: PlanVertex, b: PlanVertex, c: PlanVertex, d: PlanVertex) {
  const abC = cross(a, b, c), abD = cross(a, b, d), cdA = cross(c, d, a), cdB = cross(c, d, b);
  return (((abC > EPSILON && abD < -EPSILON) || (abC < -EPSILON && abD > EPSILON))
    && ((cdA > EPSILON && cdB < -EPSILON) || (cdA < -EPSILON && cdB > EPSILON)))
    || onSegment(c, a, b) || onSegment(d, a, b) || onSegment(a, c, d) || onSegment(b, c, d);
}

export function polygonBounds(vertices: PlanVertex[]) {
  const x = Math.min(...vertices.map(p => p.x)), y = Math.min(...vertices.map(p => p.y));
  return { x, y, width: Math.max(...vertices.map(p => p.x)) - x, height: Math.max(...vertices.map(p => p.y)) - y };
}

export function roomPolygonError(vertices: PlanVertex[]): string | null {
  if (vertices.length < 3) return 'Zaznacz co najmniej 3 narożniki.';
  if (vertices.length > MAX_ROOM_VERTICES) return `Obrys może mieć maksymalnie ${MAX_ROOM_VERTICES} narożników.`;
  if (vertices.some(p => ![p.x, p.y].every(n => Number.isFinite(n) && n >= 0 && n <= 1))) return 'Narożniki muszą znajdować się na rzucie.';
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i], b = vertices[(i + 1) % vertices.length], c = vertices[(i + 2) % vertices.length];
    for (let j = i + 1; j < vertices.length; j++) {
      if (Math.hypot(a.x - vertices[j].x, a.y - vertices[j].y) <= EPSILON) return 'Narożniki nie mogą się powtarzać.';
    }
    if (Math.abs(cross(a, b, c)) <= EPSILON && (b.x - a.x) * (c.x - b.x) + (b.y - a.y) * (c.y - b.y) < 0) {
      return 'Boki obrysu nie mogą się nakładać.';
    }
    for (let j = i + 1; j < vertices.length; j++) {
      if (j === i + 1 || (i === 0 && j === vertices.length - 1)) continue;
      if (intersects(a, b, vertices[j], vertices[(j + 1) % vertices.length])) return 'Boki obrysu nie mogą się przecinać. Cofnij ostatni punkt i popraw obrys.';
    }
  }
  const bounds = polygonBounds(vertices);
  const doubleArea = vertices.reduce((sum, a, i) => {
    const b = vertices[(i + 1) % vertices.length];
    return sum + a.x * b.y - b.x * a.y;
  }, 0);
  if (bounds.width < 0.01 || bounds.height < 0.01 || Math.abs(doubleArea) < 0.000002) return 'Obrys jest zbyt mały lub nie obejmuje powierzchni.';
  return null;
}

export function polygonRoomArea(documentId: string, page: number, vertices: PlanVertex[]): RoomPlanArea {
  const error = roomPolygonError(vertices);
  if (error) throw new Error(error);
  return { documentId, page, ...polygonBounds(vertices), vertices: vertices.map(p => ({ ...p })) };
}

export function roomVertices(area: RoomPlanArea): PlanVertex[] {
  return area.vertices ?? [
    { x: area.x, y: area.y }, { x: area.x + area.width, y: area.y },
    { x: area.x + area.width, y: area.y + area.height }, { x: area.x, y: area.y + area.height },
  ];
}

export function pointInPolygon(point: PlanVertex, vertices: PlanVertex[]): boolean {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const a = vertices[j], b = vertices[i];
    if (onSegment(point, a, b)) return true;
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/** A bounding-box centre can lie outside an L-shaped room; keep its label inside. */
export function roomLabelPosition(area: RoomPlanArea): PlanVertex {
  const vertices = roomVertices(area), center = { x: area.x + area.width / 2, y: area.y + area.height / 2 };
  if (pointInPolygon(center, vertices)) return center;
  const rows = [...new Set(vertices.map(p => p.y))].sort((a, b) => a - b);
  let widest = 0, label = vertices[0];
  for (let row = 1; row < rows.length; row++) {
    const y = (rows[row - 1] + rows[row]) / 2, xs: number[] = [];
    vertices.forEach((a, i) => {
      const b = vertices[(i + 1) % vertices.length];
      if ((a.y > y) !== (b.y > y)) xs.push(a.x + (y - a.y) * (b.x - a.x) / (b.y - a.y));
    });
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      if (xs[i + 1] - xs[i] > widest) { widest = xs[i + 1] - xs[i]; label = { x: (xs[i] + xs[i + 1]) / 2, y }; }
    }
  }
  return label;
}
