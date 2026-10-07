import { type Point, type Project, sensors } from "./model";
import { apiFetch } from "./api";

export async function documentBlob(project: string, id: string): Promise<Blob> {
  const response = await apiFetch(`file&project=${encodeURIComponent(project)}&id=${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error("Nie można otworzyć dokumentu. Sprawdź zapis projektu.");
  return response.blob();
}

export async function pointPhoto(p: Project, point: Point): Promise<{ url: string; release: () => void } | null> {
  if (point.photoId) {
    const url = URL.createObjectURL(await documentBlob(p.id, point.photoId));
    return { url, release: () => URL.revokeObjectURL(url) };
  }
  const sensor = sensors.find(s => s.name === point.sensor);
  return sensor ? { url: `media/${sensor.image}`, release: () => {} } : null;
}
