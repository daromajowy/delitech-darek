import type { Project } from "./model";
const meta = (name: string) => typeof document === 'undefined' ? undefined : document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.content;
let csrf = meta('csrf-token') || '';
const base = meta('knx-api') || '/projektant-knx/api';
export const panelUrl = meta('knx-panel') || '/projektant-knx/admin';
export const websiteUrl = meta('knx-website') || '/wordpress/';
export async function apiFetch(endpoint: string, init: RequestInit = {}) {
  return fetch(`${base}?api=${endpoint}`, { ...init, credentials: 'same-origin',
    headers: { 'Accept': 'application/json', ...init.headers } });
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function request<T>(
  endpoint: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const form = body instanceof FormData;
  const response = await apiFetch(endpoint, {
    method,
    headers: {
      ...(method !== "GET" ? { "X-CSRF-Token": csrf } : {}),
      ...(!form && body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? (form ? body : JSON.stringify(body)) : undefined,
  });
  const data = await response
    .json()
    .catch(() => ({ error: "Nieprawidłowa odpowiedź serwera." }));
  if (!response.ok)
    throw new ApiError(data.error || data.message || "Błąd połączenia.", response.status);
  return data as T;
}
export async function session() {
  const result = await request<{ csrf: string; workspace: string }>("session");
  csrf = result.csrf;
  return result;
}
export const saveProject = (p: Project) =>
  request<{ project: Project }>("save", "PUT", p);
export const loadProject = (id: string) =>
  request<{ project: Project }>(`project&id=${encodeURIComponent(id)}`);
export const businessData = (p: Project) =>
  JSON.stringify({
    ...p,
    revision: 0,
    updatedAt: "",
    attachments: [],
    submissions: [],
  });
