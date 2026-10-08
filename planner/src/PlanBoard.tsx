import { useEffect, useRef, useState } from "react";
import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { Icon, Tool } from "./components";
import { documentBlob } from "./documents";
import { normalizedDrop, type Attachment, type Point, type Project } from "./model";

function Marker({ point, selected, scale, select, edit, readOnly }: { point: Point; selected: boolean; scale: number; select: () => void; edit: (fn: (p: Project) => void) => void; readOnly?: boolean }) {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({ id: `marker-${point.id}`, disabled: readOnly, data: { pointId: point.id, marker: true } });
  const pos = point.placement!;
  return <button ref={setNodeRef} {...(readOnly ? {} : listeners)} {...(readOnly ? {} : attributes)} className={`plan-marker ${selected ? "selected" : ""}`} title={`${point.code} · ${point.name}`} aria-label={`Punkt ${point.code} na rzucie`}
    style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, transform: `translate(-50%, -50%) scale(${1 / scale})`, opacity: isDragging ? 0.4 : 1 }}
    onClick={e => { e.stopPropagation(); select(); }} onKeyDown={e => {
      const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (delta && !readOnly) { e.preventDefault(); const step = e.shiftKey ? 0.01 : 0.002; edit(p => { const pt = p.points.find(x => x.id === point.id)!; pt.placement = { ...pos, x: Math.max(0, Math.min(1, pos.x + delta[0] * step)), y: Math.max(0, Math.min(1, pos.y + delta[1] * step)) }; }); }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); }
    }}><Icon name="MapPin" size={13} /><strong>{point.code}</strong></button>;
}

export function PlanBoard({ project, point, select, edit, upload, busy, dragging, roomId, selectRoom, roomMode = false, readOnly = false, focusRoom = false }: {
  project: Project; point?: Point; select: (id: string) => void; edit: (fn: (p: Project) => void) => void;
  upload: (file: File) => Promise<Attachment | undefined>; busy: boolean; dragging: boolean;
  roomId?: string; selectRoom?: (id: string) => void; roomMode?: boolean; readOnly?: boolean; focusRoom?: boolean;
}) {
  const plans = project.attachments.filter(a => a.mime === "application/pdf");
  const [docId, setDocId] = useState(project.planView?.documentId ?? plans[0]?.id ?? "");
  const [pageNumber, setPageNumber] = useState(project.planView?.page ?? 1);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState<PDFPageProxy | null>(null);
  const [failure, setFailure] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"pan" | "place" | "room">("pan");
  const [corner, setCorner] = useState<{ x: number; y: number } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const [size, setSize] = useState({ width: 640, height: 560 });
  const container = useRef<HTMLDivElement>(null), sheet = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const transform = useRef<ReactZoomPanPinchRef>(null);
  const latest = useRef({ project, edit }); latest.current = { project, edit };
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const liveView = useRef(project.planView);
  const input = useRef<HTMLInputElement>(null);
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", close); };
  }, [expanded]);
  useEffect(() => {
    if (!plans.some(a => a.id === docId)) { setDocId(plans[0]?.id ?? ""); setPageNumber(1); }
  }, [project.attachments, docId]);
  useEffect(() => {
    const el = container.current; if (!el) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(el); return () => observer.disconnect();
  }, [expanded]);
  useEffect(() => {
    let disposed = false, task: ReturnType<typeof import("./pdf").openPdf> | undefined;
    setPdf(null); setPage(null); setFailure(""); setLoading(!!docId);
    if (docId) (async () => {
      const data = await (await documentBlob(project.id, docId)).arrayBuffer();
      if (disposed) return;
      const { openPdf } = await import("./pdf");
      if (disposed) return;
      task = openPdf(data);
      const doc = await task.promise;
      if (disposed) { await task.destroy(); return; }
      if (doc.numPages > 200) { await task.destroy(); throw new Error("Rzut może mieć maksymalnie 200 stron."); }
      setPageNumber(n => Math.max(1, Math.min(n, doc.numPages))); setPdf(doc); setLoading(false);
    })().catch(e => { if (!disposed) { setFailure(e.name === "PasswordException" ? "Ten PDF wymaga hasła. Dodaj kopię bez blokady PDF." : "Nie udało się wczytać PDF. Sprawdź plik i spróbuj ponownie."); setLoading(false); } });
    return () => { disposed = true; void task?.destroy(); };
  }, [project.id, docId]);
  useEffect(() => {
    let disposed = false; setPage(null); setRendered(false);
    if (pdf) pdf.getPage(pageNumber).then(p => { if (!disposed) setPage(p); }).catch(() => { if (!disposed) setFailure("Nie można otworzyć strony PDF."); });
    return () => { disposed = true; };
  }, [pdf, pageNumber]);
  useEffect(() => () => {
    clearTimeout(timer.current);
    const v = liveView.current;
    if (!readOnly && v && latest.current.project.attachments.some(a => a.id === v.documentId)) latest.current.edit(p => { p.planView = v; });
  }, []);

  const viewport = page?.getViewport({ scale: 1 });
  const pageWidth = viewport?.width ?? 842, pageHeight = viewport?.height ?? 595;
  const fit = Math.min((size.width - 32) / pageWidth, (size.height - 32) / pageHeight);
  useEffect(() => {
    if (!page || !canvas.current) return;
    let disposed = false, render: ReturnType<PDFPageProxy["render"]> | undefined;
    const node = canvas.current;
    const delay = setTimeout(() => {
      const resolution = Math.min(Math.max(scale, fit) * (devicePixelRatio || 1), Math.sqrt(14000000 / (pageWidth * pageHeight)), 6);
      const vp = page.getViewport({ scale: resolution });
      node.width = Math.ceil(vp.width); node.height = Math.ceil(vp.height);
      render = page.render({ canvas: node, viewport: vp });
      render.promise.then(() => { if (!disposed) setRendered(true); }).catch(e => { if (!disposed && e.name !== "RenderingCancelledException") setFailure("Błąd renderowania rzutu PDF."); });
    }, 130);
    return () => { disposed = true; clearTimeout(delay); render?.cancel(); };
  }, [page, scale, fit, pageWidth, pageHeight]);

  function persistView(ref: ReactZoomPanPinchRef) {
    const s = ref.state;
    setScale(s.scale);
    if (readOnly) return;
    liveView.current = { documentId: docId, page: pageNumber, zoom: s.scale / fit,
      centerX: (size.width / 2 - s.positionX) / (pageWidth * s.scale), centerY: (size.height / 2 - s.positionY) / (pageHeight * s.scale) };
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { const v = liveView.current; if (v) latest.current.edit(p => { p.planView = v; }); }, 700);
  }
  function fitPage() {
    void transform.current?.setTransform((size.width - pageWidth * fit) / 2, (size.height - pageHeight * fit) / 2, fit, 0);
  }
  function place(id: string, x: number, y: number) {
    if (readOnly || !page || !sheet.current || !container.current) return;
    const clip = container.current.getBoundingClientRect();
    if (x < clip.left || x > clip.right || y < clip.top || y > clip.bottom) return;
    const position = normalizedDrop(x, y, sheet.current.getBoundingClientRect());
    if (!position) return;
    edit(p => { const pt = p.points.find(v => v.id === id); if (pt) pt.placement = { documentId: docId, page: pageNumber, ...position }; });
    select(id); setMode("pan");
  }
  function markRoom(x: number, y: number) {
    if (!roomId || !sheet.current || readOnly) return;
    const pos = normalizedDrop(x, y, sheet.current.getBoundingClientRect());
    if (!pos) return;
    if (!corner) { setCorner(pos); return; }
    const width = Math.abs(corner.x - pos.x), height = Math.abs(corner.y - pos.y);
    if (width < 0.01 || height < 0.01) { setCorner(pos); return; }
    edit(p => { const r = p.rooms.find(r => r.id === roomId); if (r) r.planArea = { documentId: docId, page: pageNumber, x: Math.min(corner.x, pos.x), y: Math.min(corner.y, pos.y), width, height }; });
    setCorner(null); setMode('pan');
  }
  useEffect(() => { setCorner(null); setMode('pan'); }, [roomId, docId, pageNumber]);
  useEffect(() => {
    const position = point?.placement ?? project.rooms.find(r => r.id === roomId)?.planArea;
    if (position && project.attachments.some(a => a.id === position.documentId)) { setDocId(position.documentId); setPageNumber(position.page); }
  }, [point?.id, roomId]);
  function zoomStep(direction: number) {
    const ref = transform.current; if (!ref) return;
    const next = Math.max(fit / 2, Math.min(fit * 10, fit * (Math.round(ref.state.scale / fit * 10) + direction) / 10));
    const ratio = next / ref.state.scale;
    ref.setTransform(size.width / 2 - (size.width / 2 - ref.state.positionX) * ratio, size.height / 2 - (size.height / 2 - ref.state.positionY) * ratio, next, 0);
  }
  useDndMonitor({ onDragEnd(event) {
    const id = event.active.data.current?.pointId as string | undefined;
    if (!id || !page || readOnly || roomMode) return;
    const ev = event.activatorEvent as PointerEvent;
    const pt = project.points.find(p => p.id === id), rect = sheet.current?.getBoundingClientRect();
    if (event.active.data.current?.marker && pt?.placement && rect) {
      place(id, rect.left + pt.placement.x * rect.width + event.delta.x, rect.top + pt.placement.y * rect.height + event.delta.y);
    } else if (typeof ev.clientX === "number") place(id, ev.clientX + event.delta.x, ev.clientY + event.delta.y);
  }});
  const markers = project.points.filter(p => p.placement?.documentId === docId && p.placement.page === pageNumber);
  const roomArea = project.rooms.find(r => r.id === roomId)?.planArea;
  const areaView = focusRoom && roomArea?.documentId === docId && roomArea.page === pageNumber ? { zoom: Math.min(size.width / (roomArea.width * pageWidth + 32), size.height / (roomArea.height * pageHeight + 32)) / fit, centerX: roomArea.x + roomArea.width / 2, centerY: roomArea.y + roomArea.height / 2 } : undefined;
  const savedView = areaView ?? (project.planView?.documentId === docId && project.planView.page === pageNumber ? project.planView : undefined);
  const initialScale = Math.max(fit / 2, Math.min(fit * 10, fit * (savedView?.zoom ?? 1)));
  return <section className={`plan-board ${expanded ? "expanded" : ""}`} aria-label="Rzut architektoniczny">
    <div className="plan-heading"><h3><Icon name="Map" />{roomMode ? 'Rzut i pomieszczenia' : 'Rzut i punkty sterowania'}</h3><span>{markers.length} pkt</span>
      <Tool icon={expanded ? "Minimize2" : "Maximize2"} label={expanded ? "Zamknij duży rzut" : "Powiększ obszar rzutu"} onClick={() => setExpanded(v => !v)} /></div>
    <div className="plan-toolbar">
      <select aria-label="Rzut PDF" value={docId} onChange={e => { clearTimeout(timer.current); setDocId(e.target.value); setPageNumber(1); }}>
        {!plans.length && <option value="">Brak rzutu PDF</option>}{plans.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      {!readOnly && <Tool icon="Upload" label="Wczytaj rzut PDF" disabled={busy} onClick={() => input.current?.click()} />}
      <input ref={input} type="file" accept="application/pdf" aria-label="Plik rzutu PDF" hidden onChange={async e => {
        const file = e.target.files?.[0]; e.target.value = "";
        if (file) { const a = await upload(file); if (a?.mime === "application/pdf") { setDocId(a.id); setPageNumber(1); } }
      }}/>
      <div className="plan-pages"><Tool icon="ChevronLeft" label="Poprzednia strona rzutu" disabled={!pdf || pageNumber <= 1} onClick={() => setPageNumber(n => n - 1)} />
        <span>{pageNumber} / {pdf?.numPages ?? "—"}</span><Tool icon="ChevronRight" label="Następna strona rzutu" disabled={!pdf || pageNumber >= pdf.numPages} onClick={() => setPageNumber(n => n + 1)} /></div>
    </div>
    <div className={`plan-canvas ${mode !== "pan" ? "placing" : ""}`} ref={container}>
      {page && <TransformWrapper key={`${docId}-${pageNumber}-${size.width}-${size.height}-${focusRoom ? roomId : ''}`} ref={transform} minScale={Math.max(0.05, fit / 2)} maxScale={fit * 10} limitToBounds={false} centerOnInit={false}
        initialScale={initialScale}
        initialPositionX={size.width / 2 - pageWidth * initialScale * (savedView?.centerX ?? 0.5)}
        initialPositionY={size.height / 2 - pageHeight * initialScale * (savedView?.centerY ?? 0.5)}
        panning={{ disabled: dragging || mode !== "pan", excluded: ["plan-marker", "room-area"], velocityDisabled: true }}
        doubleClick={{ disabled: true }} smooth={false} wheel={{ step: fit * 0.1 }} onTransform={persistView}
        onInit={persistView}>
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <div ref={sheet} className="plan-sheet" style={{ width: pageWidth, height: pageHeight }} onClick={e => { if (mode === "place" && point) place(point.id, e.clientX, e.clientY); if (mode === 'room') markRoom(e.clientX, e.clientY); }}>
            <canvas ref={canvas} role="img" aria-label={`Rzut PDF, strona ${pageNumber}`} style={{ width: pageWidth, height: pageHeight }}/>
            {project.rooms.filter(r => r.planArea?.documentId === docId && r.planArea.page === pageNumber).map(r => { const a = r.planArea!; return <button key={r.id} className={`room-area ${r.id === roomId ? 'selected' : ''}`} aria-label={`Pomieszczenie ${r.name} na rzucie`} tabIndex={selectRoom && mode === 'pan' ? 0 : -1} style={{ left: `${a.x * 100}%`, top: `${a.y * 100}%`, width: `${a.width * 100}%`, height: `${a.height * 100}%`, pointerEvents: mode !== 'pan' || !selectRoom ? 'none' : undefined }} onClick={e => { e.stopPropagation(); selectRoom?.(r.id); }}><span style={{ transform: `scale(${1 / scale})` }}>{r.name}</span></button>; })}
            {corner && <span className="area-corner" style={{ left: `${corner.x * 100}%`, top: `${corner.y * 100}%`, transform: `scale(${1 / scale})` }}><Icon name="MapPin"/></span>}
            {markers.map(pt => <Marker key={pt.id} point={pt} selected={point?.id === pt.id} scale={scale} select={() => select(pt.id)} edit={edit} readOnly={readOnly || roomMode} />)}
          </div>
        </TransformComponent>
      </TransformWrapper>}
      {!docId && <div className="plan-empty"><Icon name="FileUp" size={40}/><h3>{readOnly ? 'Pracujesz bez rzutu' : 'Rzut projektu'}</h3>{readOnly ? <small>PDF możesz dołączyć w kroku 1.</small> : <><button className="outline" disabled={busy} onClick={() => input.current?.click()}><Icon name="Upload"/>Wczytaj PDF</button><small>Opcjonalnie · możesz od razu przejść dalej</small></>}</div>}
      {(loading || (page && !rendered)) && !failure && <div className="plan-message" role="status"><Icon name="LoaderCircle"/>Wczytywanie rzutu…</div>}
      {failure && <div className="plan-message error" role="alert">{failure}</div>}
      {page && <div className="plan-floating-tools">
        <button className={`tool ${mode === "pan" ? "selected" : ""}`} title="Przesuwanie rzutu" aria-label="Przesuwanie rzutu" aria-pressed={mode === "pan"} onClick={() => setMode("pan")}><Icon name="Hand"/></button>
        {!readOnly && (roomMode ? <button className={`tool ${mode === 'room' ? 'selected' : ''}`} disabled={!roomId} aria-label="Oznacz pomieszczenie na rzucie" title="Oznacz pomieszczenie na rzucie" aria-pressed={mode === 'room'} onClick={() => { setCorner(null); setMode('room'); }}><Icon name="LayoutGrid"/></button> : <button className={`tool ${mode === "place" ? "selected" : ""}`} disabled={!point} title="Wskaż pozycję wybranego punktu" aria-label="Wskaż pozycję wybranego punktu" aria-pressed={mode === "place"} onClick={() => setMode("place")}><Icon name="MapPinPlus"/></button>)}
        <Tool icon="Minus" label="Pomniejsz rzut" onClick={() => zoomStep(-1)}/><output>{Math.round(scale / fit * 100)}%</output>
        <Tool icon="Plus" label="Powiększ rzut" onClick={() => zoomStep(1)}/>
        <Tool icon="Scan" label="Dopasuj cały rzut" onClick={fitPage}/>
      </div>}
    </div>
    <div className="plan-status"><span>{roomMode ? (mode === 'room' ? corner ? 'Kliknij przeciwległy narożnik obszaru.' : 'Kliknij pierwszy narożnik pomieszczenia.' : project.rooms.find(r => r.id === roomId)?.name ?? 'Wybierz pomieszczenie') : point ? `${point.code} · ${point.name}` : "Widok rzutu"}</span>
      {roomMode && !readOnly && project.rooms.find(r => r.id === roomId)?.planArea && <button className="quiet" onClick={() => edit(p => { delete p.rooms.find(r => r.id === roomId)!.planArea; })}>Usuń oznaczenie</button>}
      {!readOnly && !roomMode && point?.placement && <button className="quiet" onClick={() => edit(p => { delete p.points.find(x => x.id === point.id)!.placement; })}><Icon name="MapPinOff" size={16}/>Usuń z rzutu</button>}
      {point && !point.placement && (!readOnly && !roomMode && page ? <button className="quiet" onClick={() => edit(p => { const pt = p.points.find(x => x.id === point.id); if (pt) pt.placement = { documentId: docId, page: pageNumber, x: 0.5, y: 0.5 }; })}>Umieść w środku · przesuń strzałkami</button> : <span className="unplaced">Bez pozycji</span>)}
    </div>
  </section>;
}
