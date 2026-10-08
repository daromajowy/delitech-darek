import {exampleProject, normalizeProject, type Project} from './model';

const first = exampleProject();
first.name = 'Dom pokazowy · podgląd';
first.studio = 'Przykładowa pracownia';
first.updatedAt = new Date().toISOString();
first.revision = 1;
const projects = new Map<string, Project>([[first.id, first]]);
const files = new Map<string, File>();
const clone = <T>(value:T):T => structuredClone(value);
const json = (value:unknown,status=200) => new Response(JSON.stringify(value), {status,headers:{'Content-Type':'application/json'}});

/** Preview data lives only in this tab. This adapter never contacts the production API. */
export async function demoFetch(endpoint:string, init:RequestInit = {}):Promise<Response> {
  const params = new URLSearchParams('api='+endpoint);
  const action = params.get('api');
  if(action==='session') return json({csrf:'demo',workspace:'Podgląd lokalny'});
  if(action==='projects') return json({projects:[...projects.values()].map(clone)});
  if(action==='project') return projects.has(params.get('id')||'')?json({project:clone(projects.get(params.get('id')!)!)}):json({error:'Nie znaleziono projektu.'},404);
  if(action==='file') return files.has(params.get('id')||'')?new Response(files.get(params.get('id')!)!):json({error:'Plik nie jest już dostępny w tej karcie.'},404);
  const data = typeof init.body === 'string'?JSON.parse(init.body):{};
  if(action==='save') {
    const existing = projects.get(data.id);
    if(existing && existing.revision!==data.revision) return json({error:'Projekt ma nowszą wersję.'},409);
    const project = normalizeProject({...clone(data),revision:(existing?.revision||0)+1,updatedAt:new Date().toISOString()});
    projects.set(project.id,project); return json({project:clone(project)});
  }
  if(action==='upload' && init.body instanceof FormData) {
    const project = projects.get(params.get('project')||'');
    const file = init.body.get('file'); const id = params.get('id');
    if(!project || !(file instanceof File) || !id) return json({error:'Nieprawidłowy plik.'},422);
    if(file.size>12*1024*1024 || !['application/pdf','image/png','image/jpeg'].includes(file.type)) return json({error:'Dozwolone są PDF, PNG i JPG do 12 MB.'},422);
    files.set(id,file); project.attachments.push({id,name:file.name,mime:file.type,size:file.size}); project.revision++; project.updatedAt=new Date().toISOString();
    return json({project:clone(project)});
  }
  if(action==='remove-file') {
    const project=projects.get(data.project); if(!project) return json({error:'Brak projektu.'},404);
    project.attachments=project.attachments.filter(file=>file.id!==data.id); files.delete(data.id); project.revision++;
    return json({project:clone(project)});
  }
  if(action==='submit') return json({error:'To podgląd. Przekazanie briefu wymaga zalogowania na knx.intelispaces.pl.'},422);
  if(action==='logout') return json({ok:true});
  return json({error:'Ta operacja jest dostępna po zalogowaniu do konfiguratora.'},422);
}
