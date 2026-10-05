import {useSyncExternalStore} from 'react';
import type {Guide} from '../content/guides.ts';

export type Project = {id:string;title:string;summary:string;subtitle:string;type:'biuro'|'dom'|'apartament';image?:string;illustrative?:boolean;zones:string[];hardware:string[];protocols:string[]};
type CmsSnapshot = {loaded:boolean; texts:Record<string,string>; images:Record<string,{url:string;alt?:string}>; guides:Guide[]; projects:Project[]};
let snapshot:CmsSnapshot = {loaded:false,texts:{},images:{},guides:[],projects:[]};
const listeners = new Set<()=>void>();
let started = false;
export function cmsText(key:string,fallback:string):string { return snapshot.texts[key] ?? fallback; }
export function cmsImage(key:string,fallback:string):string { return snapshot.images[key]?.url || fallback; }
export function useCmsContent(){ return useSyncExternalStore(cb=>{listeners.add(cb);return()=>{listeners.delete(cb)}},()=>snapshot,()=>snapshot); }
const strings = (value:unknown):value is string[] => Array.isArray(value)&&value.every(x=>typeof x==='string');
export function validGuide(g:any):boolean { return g&&typeof g.id==='string'&&typeof g.title==='string'&&typeof g.summary==='string'&&['architekci','biura','inwestorzy'].includes(g.category)&&Array.isArray(g.sections)&&g.sections.every((s:any)=>s&&typeof s.title==='string'&&strings(s.paragraphs))&&strings(g.checklist)&&Array.isArray(g.sources)&&g.sources.every((s:any)=>s&&typeof s.title==='string'&&/^https:\/\//.test(s.url)); }
export function validProject(p:any):boolean { return p&&typeof p.id==='string'&&typeof p.title==='string'&&typeof p.summary==='string'&&typeof p.subtitle==='string'&&['biuro','dom','apartament'].includes(p.type)&&strings(p.zones)&&strings(p.hardware)&&strings(p.protocols); }
export function applyContent(data:any){
  if(!data||!Array.isArray(data.pages)||!Array.isArray(data.images)||!Array.isArray(data.guides)||!Array.isArray(data.projects))throw Error('Invalid CMS response');
  const texts:Record<string,string>=Object.create(null), images:CmsSnapshot['images']=Object.create(null);
  for(const page of data.pages) {
    if(!page || !Array.isArray(page.entries))throw Error('Invalid CMS page');
    for(const entry of page.entries) if(entry&&typeof entry.key==='string'&&typeof entry.value==='string')texts[entry.key]=entry.value;
  }
  for(const image of data.images) if(typeof image.key==='string'&&typeof image.url==='string'&&/^https:\/\/cdn\.sanity\.io\//.test(image.url))images[image.key]={url:image.url,alt:image.alt};
  if(!data.guides.every(validGuide)||!data.projects.every(validProject))throw Error('Incomplete published CMS content');
  snapshot={loaded:true,texts,images,guides:data.guides,projects:data.projects};
  listeners.forEach(cb=>cb());
}
export async function startCms(){
  if(started)return;started=true;
  try{
    const configResponse=await fetch('/cms-config.json',{cache:'no-store'});
    if(!configResponse.ok)return;
    const {projectId,dataset}=await configResponse.json();
    if(!/^[a-z0-9]{8}$/.test(projectId)||!/^[a-z0-9_-]+$/.test(dataset))return;
    const query=`{"pages":*[_type=="pageContent"],"images":*[_type=="siteImage"]{key,alt,"url":image.asset->url},"guides":*[_type=="guide"]|order(order asc),"projects":*[_type=="project"]|order(order asc){...,"image":image.asset->url}}`;
    const response=await fetch(`https://${projectId}.apicdn.sanity.io/v2026-10-04/data/query/${dataset}?perspective=published&query=${encodeURIComponent(query)}`,{signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw Error('CMS unavailable');
    applyContent((await response.json()).result);
  }catch{ console.warn('CMS unavailable; using the included site content.'); }
}
