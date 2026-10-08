import type { PageId } from './types';
import { pages } from './page-config.ts';

export interface SiteConfig {
  page: PageId;
  urls: Record<PageId, string>;
  endpoint?: string;
  plannerUrl: string;
  preview: boolean;
}

// Only deployment settings travel in HTML. Visible text comes directly from components.
export const siteConfig = (): SiteConfig | undefined => (globalThis as any).__INTELISPACES__;

export function createSiteConfig(page: PageId, base: string, preview: boolean): SiteConfig {
  return {
    page,
    urls: Object.fromEntries(Object.entries(pages).map(([key, entry]) => [key, base + entry.path.slice(1)])) as Record<PageId, string>,
    endpoint: preview ? undefined : 'https://knx.intelispaces.pl/api/inquiries',
    plannerUrl: preview ? base + 'projektant-knx/' : 'https://knx.intelispaces.pl/',
    preview,
  };
}

export function pageFromPath(pathname: string, base = '/'): PageId {
  const relative = '/' + pathname.slice(base.length).replace(/^\/+/, '');
  return (Object.entries(pages).find(([, page]) => page.path === relative.replace(/\/?$/, '/'))?.[0] as PageId) || 'home';
}

export function plannerUrl(): string {
  return siteConfig()?.plannerUrl || 'https://knx.intelispaces.pl/';
}

export async function submitInquiry(values: Record<string, unknown>, files: File[] = []): Promise<string> {
  const config = siteConfig();
  if (!config?.endpoint) throw new Error('To podgląd strony. Aby przesłać zgłoszenie, otwórz intelispaces.pl.');
  const body = new FormData();
  body.set('payload', JSON.stringify(values));
  files.forEach(file => body.append('files[]', file));
  const response = await fetch(config.endpoint, { method: 'POST', body, credentials: 'omit', headers: { Accept: 'application/json' } });
  const data = await response.json();
  if (!response.ok || !data.reference) throw new Error(data.message || 'Nie udało się zapisać zgłoszenia. Spróbuj ponownie.');
  return data.reference;
}
