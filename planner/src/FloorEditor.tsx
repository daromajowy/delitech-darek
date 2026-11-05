import { useEffect, useRef, useState } from 'react';
import { Field, Icon, Modal } from './components';
import { documentBlob } from './documents';
import { conflictingPlacements, floorNameError, MAX_FLOORS, planChangeMessage, renameFloor, roomFloor, samePlan, setFloorPlan } from './floors';
import { uid, type Attachment, type Floor, type Project } from './model';

export function FloorEditor({ project, floor, edit, upload, busy, close, saved }: {
  project: Project; floor?: Floor; edit: (fn: (p: Project) => void) => void;
  upload: (file: File) => Promise<Attachment | undefined>; busy: boolean;
  close: () => void; saved: (id: string) => void;
}) {
  const [id] = useState(() => floor?.id ?? uid());
  const [name, setName] = useState(floor?.name ?? '');
  const [documentId, setDocumentId] = useState(floor?.plan?.documentId ?? '');
  const [page, setPage] = useState(floor?.plan?.page ?? 1);
  const [pages, setPages] = useState(0);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState('');
  const [pdfError, setPdfError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const plans = project.attachments.filter(a => a.mime === 'application/pdf');
  useEffect(() => {
    let disposed = false, task: ReturnType<typeof import('./pdf').openPdf> | undefined;
    setPages(0); setPdfError(''); setReading(!!documentId);
    if (documentId) (async () => {
      const bytes = await (await documentBlob(project.id, documentId)).arrayBuffer();
      const { openPdf } = await import('./pdf');
      if (disposed) return;
      task = openPdf(bytes);
      const pdf = await task.promise;
      if (disposed) return;
      if (pdf.numPages > 200) throw new Error('PDF może mieć maksymalnie 200 stron.');
      setPages(pdf.numPages); setPage(n => Math.min(Math.max(n, 1), pdf.numPages));
    })().catch(() => { if (!disposed) setPdfError('Nie można odczytać PDF. Wybierz poprawny plik bez hasła.'); })
      .finally(() => { if (!disposed) setReading(false); });
    return () => { disposed = true; void task?.destroy(); };
  }, [project.id, documentId]);

  const save = () => {
    const problem = floorNameError(project, name, id);
    if (problem) { setError(problem); return; }
    if (!floor && (project.floors?.length ?? 0) >= MAX_FLOORS) { setError('Osiągnięto limit kondygnacji.'); return; }
    if (documentId && (!pages || pdfError || reading)) return;
    const plan = documentId ? { documentId, page } : undefined;
    const count = samePlan(floor?.plan, plan) ? 0 : conflictingPlacements(project, project.rooms.filter(r => roomFloor(project, r)?.id === id).map(r => r.id), plan);
    if (count && !confirm(planChangeMessage(count))) return;
    edit(p => {
      if (!floor) (p.floors ??= []).push({ id, name: name.trim() });
      else renameFloor(p, id, name);
      setFloorPlan(p, id, plan);
    });
    saved(id); close();
  };

  return <Modal title={floor ? 'Ustawienia kondygnacji' : 'Dodaj kondygnację'} onClose={close}>
    <form className="floor-editor" onSubmit={e => { e.preventDefault(); save(); }}>
      <Field label="Nazwa kondygnacji"><input value={name} maxLength={100} placeholder="Np. Parter, Piętro 1, Poddasze" autoFocus required onChange={e => { setName(e.target.value); setError(''); }}/></Field>
      <Field label="Rzut PDF tej kondygnacji"><select value={documentId} onChange={e => { setDocumentId(e.target.value); setPage(1); }} disabled={busy}>
        <option value="">Bez rzutu — dodam później</option>{plans.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select></Field>
      <button type="button" className="outline" disabled={busy || reading} onClick={() => input.current?.click()}><Icon name="Upload"/>Wczytaj osobny PDF</button>
      <input ref={input} type="file" accept="application/pdf" aria-label="PDF kondygnacji" hidden onChange={async e => {
        const file = e.target.files?.[0]; e.target.value = '';
        if (!file) return;
        if (file.type !== 'application/pdf') { setError('Wybierz plik PDF.'); return; }
        const attachment = await upload(file);
        if (attachment?.mime === 'application/pdf') { setDocumentId(attachment.id); setPage(1); setError(''); }
        else setError('Nie udało się dodać PDF. Spróbuj ponownie.');
      }}/>
      {documentId && <Field label="Strona z rzutem kondygnacji"><select value={page} disabled={!pages || reading} onChange={e => setPage(Number(e.target.value))}>
        {pages ? Array.from({ length: pages }, (_, i) => <option key={i + 1} value={i + 1}>Strona {i + 1} z {pages}</option>) : <option value={page}>Wczytywanie stron…</option>}
      </select></Field>}
      <p className="muted small">Możesz wczytać osobny plik dla każdego piętra lub wybrać odpowiednią stronę ze wspólnego PDF.</p>
      {(error || pdfError) && <p className="floor-error" role="alert">{error || pdfError}</p>}
      <div className="row floor-editor-actions"><button type="button" className="outline" onClick={close}>Anuluj</button><button type="submit" className="primary" disabled={busy || reading || !!pdfError}>{floor ? 'Zapisz kondygnację' : 'Dodaj kondygnację'}</button></div>
    </form>
  </Modal>;
}
