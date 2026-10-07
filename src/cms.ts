import type { PageId } from './types';
export interface CmsConfig {
  page: PageId | 'custom'; values: Record<string,string>; urls: Record<string,string>;
  additional?: string; title?: string; description?: string; endpoint?: string; nonce?: string; restNonce?: string; plannerUrl?: string;
}
export const cms = (): CmsConfig | undefined => (globalThis as any).__INTELISPACES__;
export function cmsText(key:string,fallback:string):string { return cms()?.values?.[key] ?? fallback; }
export function cmsImage(key:string,fallback:string):string { return cmsText(key,fallback); }
export function plannerUrl():string { return cms()?.plannerUrl || '/projektant-knx/'; }
export async function submitInquiry(values:Record<string,unknown>,files:File[]=[]):Promise<string> {
  const config=cms();
  if(!config?.endpoint) throw new Error('Formularz jest dostępny na stronie WordPress.');
  const body=new FormData(); body.set('payload',JSON.stringify(values));
  body.set('nonce',config.nonce||''); files.forEach(file=>body.append('files[]',file));
  const response=await fetch(config.endpoint,{method:'POST',body,credentials:'same-origin',headers:{'X-WP-Nonce':config.restNonce||''}});
  const data=await response.json();
  if(!response.ok || !data.reference) throw new Error(data.message||'Nie udało się zapisać zgłoszenia. Spróbuj ponownie.');
  return data.reference;
}
