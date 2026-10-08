import React, { useEffect, useRef, useState } from "react";
import {
  ApiError,
  businessData,
  loadProject,
  request,
  saveProject,
  session,
  panelUrl,
} from "./api";
import { Brand, Icon, Modal, Tool } from './components';
import { normalizeProject, detachDocument, exampleProject, newProject, issues, uid, type Project } from './model';
import { ProjectFlow } from './ProjectFlow';
import { Handoff } from './Handoff';

const steps = ["Przestrzeń", "Funkcje i sceny", "Sterowanie", "Sprawdź i przekaż"];
type ProjectRow = Pick<
  Project,
  "id" | "name" | "studio" | "revision" | "updatedAt" | "submissions"
>;
const downloadJson = (p: Project) =>
  download(
    new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }),
    `${p.name.replace(/[^\p{L}\d_-]/gu, "_")}.json`,
  );
export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export function App() {
  const [project, setProject] = useState<Project | null>(null),
    [ready, setReady] = useState(false),
    [step, setStep] = useState(0);
  const [projects, setProjects] = useState<ProjectRow[]>([]),
    [showProjects, setShowProjects] = useState(false),
    [busy, setBusy] = useState(false);
  const [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [authExpired, setAuthExpired] = useState(false),
    [paused, setPaused] = useState(false);
  const [roomId, setRoomId] = useState(""),
    [pointId, setPointId] = useState(""),
    [sceneId, setSceneId] = useState("");
  const [showHandoff, setShowHandoff] = useState(false);
  const [consent, setConsent] = useState(false),
    [pendingSubmit, setPendingSubmit] = useState(false);
  const [saved, setSaved] = useState("");
  const current = useRef<Project | null>(null),
    saving = useRef<Promise<Project> | null>(null),
    lastSaved = useRef("");
  current.current = project;
  const report = (e: unknown) => {
    setError(
      e instanceof Error ? e.message : "Nie udało się wykonać operacji.",
    );
    setPaused(true);
    if (e instanceof ApiError && [401, 419].includes(e.status)) setAuthExpired(true);
  };
  const adopt = (p: Project) => {
    p = normalizeProject(p);
    current.current = p;
    setProject(p);
    lastSaved.current = businessData(p);
    setSaved(lastSaved.current);
    setRoomId(p.rooms[0]?.id ?? "");
    setPointId(p.points[0]?.id ?? "");
    setSceneId("");
    setError("");
    setPaused(false);
    setConsent(false);
    setPendingSubmit(false);
    setShowHandoff(false);
  };
  const refreshProjects = async () => {
    const r = await request<{ projects: ProjectRow[] }>("projects");
    setProjects(r.projects);
    return r.projects;
  };
  useEffect(() => {
    let mounted = true;
    session()
      .then(() => refreshProjects())
      .then(async (rows) => {
        if (!mounted) return;
        setReady(true);
        const params = new URLSearchParams(location.search);
        const last = params.has('new') ? null : params.get('project') || sessionStorage.getItem("knx-last-project");
        if (last && rows.some((r) => r.id === last)) {
          const r = await loadProject(last);
          if (mounted) adopt(r.project);
        } else setShowProjects(true);
      })
      .catch((e) => {
        if (mounted) report(e);
      });
    return () => {
      mounted = false;
    };
  }, []);
  const dirty = !!project && businessData(project) !== saved;
  useEffect(() => {
    const prevent = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  async function persist(): Promise<Project> {
    if (saving.current) await saving.current;
    const snapshot = current.current!;
    if (lastSaved.current === businessData(snapshot) && snapshot.revision > 0)
      return snapshot;
    setBusy(true);
    const task = (async () => {
      const r = await saveProject(snapshot);
      lastSaved.current = businessData(snapshot);
      setSaved(lastSaved.current);
      const latest = current.current!;
      const merged =
        latest.id === snapshot.id
          ? {
              ...latest,
              revision: r.project.revision,
              updatedAt: r.project.updatedAt,
              attachments: r.project.attachments,
              submissions: r.project.submissions,
            }
          : latest;
      current.current = merged;
      setProject(merged);
      sessionStorage.setItem("knx-last-project", merged.id);
      setError("");
      setPaused(false);
      return r.project;
    })();
    saving.current = task;
    try {
      return await task;
    } finally {
      saving.current = null;
      setBusy(false);
    }
  }
  useEffect(() => {
    if (!dirty || !ready || busy || paused) return;
    const timer = setTimeout(() => {
      persist().catch(report);
    }, 1800);
    return () => clearTimeout(timer);
  }, [project, ready, busy, paused, dirty]);
  const edit = (fn: (p: Project) => void) =>
    setProject((p) => {
      if (!p) return p;
      const copy = structuredClone(p);
      fn(copy);
      current.current = copy;
      return copy;
    });
  async function choose(id: string) {
    if (dirty && !window.confirm("Pozostawić niezapisane zmiany?")) return;
    try {
      if (saving.current) await saving.current;
      const r = await loadProject(id);
      adopt(r.project);
      sessionStorage.setItem("knx-last-project", id);
      setShowProjects(false);
      setStep(0);
    } catch (e) {
      report(e);
    }
  }
  async function create(example = false) {
    if (dirty && !window.confirm("Pozostawić niezapisane zmiany?")) return;
    try {
      if (saving.current) await saving.current;
      const r = await saveProject(example ? exampleProject() : newProject());
      adopt(r.project);
      setShowProjects(false);
      setStep(0);
      sessionStorage.setItem("knx-last-project", r.project.id);
    } catch (e) {
      report(e);
    }
  }
  async function upload(file: File) {
    if (file.size > 12 * 1024 * 1024) {
      setError("Plik musi mieć mniej niż 12 MB.");
      return;
    }
    try {
      await persist();
      setBusy(true);
      const form = new FormData();
      form.append("file", file);
      form.append("revision", String(current.current!.revision));
      const attachmentId = uid();
      const result = await request<{ project: Project }>(
        `upload&project=${current.current!.id}&id=${attachmentId}`,
        "POST",
        form,
      );
      const merged = {
        ...current.current!,
        attachments: result.project.attachments,
        revision: result.project.revision,
        updatedAt: result.project.updatedAt,
      };
      current.current = merged;
      setProject(merged);
      setNotice("Dodano dokument.");
      return result.project.attachments.find(a => a.id === attachmentId);
    } catch (e) {
      report(e);
    } finally {
      setBusy(false);
    }
  }
  async function exportFile(format: "pdf" | "xlsx") {
    try {
      const p = await persist();
      setBusy(true);
      const exports = await import("./exports");
      const blob =
        format === "pdf"
          ? await exports.buildPdf(p)
          : await exports.buildXlsx(p);
      download(blob, `${p.name.replace(/[^\p{L}\d_-]/gu, "_")}-KNX.${format}`);
      setNotice(`Przygotowano plik ${format.toUpperCase()}.`);
    } catch (e) {
      report(e);
    } finally {
      setBusy(false);
    }
  }
  async function removeFile(id: string) {
    if (
      !window.confirm(
        "Odpiąć dokument od projektu? Kopie w przekazanych briefach pozostaną dostępne.",
      )
    )
      return;
    try {
      const snapshot = await persist();
      setBusy(true);
      const result = await request<{ project: Project }>(
        "remove-file",
        "POST",
        {
          project: snapshot.id,
          id,
          revision: snapshot.revision,
        },
      );
      if (current.current?.id === result.project.id) {
        const merged = {
          ...current.current,
          attachments: result.project.attachments,
          revision: result.project.revision,
          updatedAt: result.project.updatedAt,
        };
        detachDocument(merged, id);
        current.current = merged;
        setProject(merged);
      }
      setNotice(
        "Dokument odpięty. Wcześniejsze briefy zachowują swoją dokumentację.",
      );
    } catch (e) {
      report(e);
    } finally {
      setBusy(false);
    }
  }
  async function submit() {
    if (!consent) {
      setError("Potwierdź przekazanie briefu.");
      return;
    }
    try {
      const snapshot = await persist();
      if (businessData(current.current!) !== businessData(snapshot)) {
        setError("Zapisz najnowsze zmiany przed przekazaniem.");
        return;
      }
      setBusy(true);
      const result = await request<{ project: Project }>("submit", "POST", {
        id: snapshot.id,
        revision: snapshot.revision,
        submissionId: uid(),
        consent: true,
      });
      const merged = {
        ...current.current!,
        revision: result.project.revision,
        updatedAt: result.project.updatedAt,
        submissions: result.project.submissions,
      };
      current.current = merged;
      setProject(merged);
      setConsent(false);
      setNotice(
        "Brief przekazany do obszaru zespołu InteliSpaces. Kopia tej wersji została zachowana.",
      );
      setPendingSubmit(false);
    } catch (e) {
      report(e);
    } finally {
      setBusy(false);
    }
  }
  const go = (n: number) => {
    setStep(n);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="app">
      <header className={`topbar${project ? " has-project" : ""}`}>
        <Brand />
        <div className="app-name">
          <strong>Projektant KNX</strong>
          <span>PRZESTRZEŃ DLA ARCHITEKTÓW</span>
        </div>
        {project && (
          <>
            <div className="project-identity">
              <h1 title={project.name}>{project.name}</h1>
              <span title={project.studio || "Pracownia do uzupełnienia"}>
                {project.studio || "Pracownia do uzupełnienia"}
              </span>
            </div>
            <div className="save-area">
              <button
                className={`save-state ${dirty ? "unsaved" : ""}`}
                onClick={() => persist().catch(report)}
                disabled={busy}
                aria-label={busy ? "Zapisywanie…" : dirty ? "Zapisz zmiany" : "Zapisano"}
              >
                <Icon
                  name={busy ? "LoaderCircle" : dirty ? "Save" : "CircleCheck"}
                  size={18}
                />
                <span>{busy ? "Zapisywanie…" : dirty ? "Zapisz zmiany" : "Zapisano"}</span>
              </button>
              <div className="version">
                <strong>Wersja {String(project.revision).padStart(2, "0")}</strong>
                <span>
                  {project.updatedAt
                    ? new Date(project.updatedAt).toLocaleDateString("pl-PL")
                    : ""}
                </span>
              </div>
            </div>
          </>
        )}
        <div className="top-actions">
          <button
            className="quiet"
            aria-label="Projekty zespołu"
            title="Projekty zespołu"
            onClick={() => {
              refreshProjects()
                .then(() => setShowProjects(true))
                .catch(report);
            }}
            disabled={!ready || busy}
          >
            <Icon name="FolderOpen" />
            <span>Projekty zespołu</span>
          </button>
          <a href={panelUrl} className="quiet panel-link" aria-label="Panel i konto" title="Panel i konto" onClick={e => { if (dirty && !confirm('Masz niezapisane zmiany. Przejść do panelu?')) e.preventDefault(); }}><Icon name="Settings2" /><span>Panel i konto</span></a>
          <Tool
            icon="LogOut"
            label="Wyloguj"
            onClick={() => {
              if (
                dirty &&
                !window.confirm("Masz niezapisane zmiany. Wylogować?")
              )
                return;
              request("logout", "POST")
                .then(() => location.reload())
                .catch(report);
            }}
          />
        </div>
      </header>
      {error && (
        <div className="alert" role="alert">
          <Icon name="TriangleAlert" />
          <span>{error}</span>
          {project && (
            <button onClick={() => downloadJson(project)}>
              Pobierz kopię JSON
            </button>
          )}
          {authExpired && (
            <a href={panelUrl} target="_blank" rel="noreferrer">
              Zaloguj w nowej karcie
            </a>
          )}
          {authExpired && (
            <button
              onClick={() =>
                session()
                  .then(() => {
                    setAuthExpired(false);
                    setPaused(false);
                    setError("");
                  })
                  .catch(report)
              }
            >
              Odśwież sesję
            </button>
          )}
          <Tool
            icon="X"
            label="Zamknij komunikat"
            onClick={() => setError("")}
          />
        </div>
      )}
      {notice && (
        <div className="notice" role="status">
          <Icon name="CircleCheck" />
          {notice}
          <Tool
            icon="X"
            label="Zamknij powiadomienie"
            onClick={() => setNotice("")}
          />
        </div>
      )}
      {!project ? (
        <main className="empty-start">
          <Icon name="PanelsTopLeft" size={42} />
          <h1>
            {ready ? "Twoja przestrzeń projektowa" : "Otwieranie projektanta…"}
          </h1>
          {ready && (
            <button className="primary" onClick={() => create()}>
              <Icon name="Plus" />
              Nowy projekt
            </button>
          )}
        </main>
      ) : (
        <>
          <nav className="steps" aria-label="Etapy projektu">
            {steps.map((s, i) => (
              <button
                key={s}
                aria-current={step === i ? "step" : undefined}
                className={`${step === i ? "active" : ""} ${step > i ? "previous" : ""}`}
                onClick={() => go(i)}
              >
                <span className="step-number">
                  {step > i ? <Icon name="Check" size={16} /> : i + 1}
                </span>
                <span>{s}</span>
              </button>
            ))}
          </nav>
          <main className={`workspace step-${step} unified-workspace`}>
            <ProjectFlow key={project.id} project={project} step={step} roomId={roomId} setRoomId={setRoomId}
              pointId={pointId} setPointId={setPointId} sceneId={sceneId} setSceneId={setSceneId}
              edit={edit} upload={upload} busy={busy} go={go} openHandoff={() => setShowHandoff(true)} exportFile={exportFile}/>
          </main>
          <footer className="workflow-footer">
            <button
              className="quiet"
              disabled={step === 0}
              onClick={() => go(step - 1)}
            >
              <Icon name="ArrowLeft" />
              Wstecz
            </button>
            <span className="footer-caption">
              InteliSpaces · {step + 1} / 4
            </span>
            {step < 3 ? (
              <button className="primary" onClick={() => go(step + 1)}>
                Dalej: {steps[step + 1].toLocaleLowerCase("pl")}
                <Icon name="ArrowRight" />
              </button>
            ) : (
              <button
                className="primary"
                onClick={() => setShowHandoff(true)}
                disabled={busy}
              >
                <Icon name="Send" />
                Przekaż do konsultacji
              </button>
            )}
          </footer>
        </>
      )}
      {showHandoff && project && <Modal title="Dokumentacja i przekazanie" onClose={() => setShowHandoff(false)}>
        <Handoff project={project} exportFile={exportFile} downloadJson={downloadJson} upload={upload} removeFile={removeFile}
          busy={busy} consent={consent} setConsent={setConsent} setPendingSubmit={setPendingSubmit}/>
      </Modal>}
      {showProjects && ready && (
        <Modal title="Projekty zespołu" onClose={() => setShowProjects(false)}>
          <div className="row project-actions">
            <button
              className="primary"
              onClick={() => create()}
              disabled={busy}
            >
              <Icon name="Plus" />
              Nowy projekt
            </button>
            <button
              className="outline"
              onClick={() => create(true)}
              disabled={busy}
            >
              <Icon name="House" />
              Projekt przykładowy
            </button>
          </div>
          <div className="project-list">
            {projects.map((p) => (
              <button key={p.id} onClick={() => choose(p.id)}>
                <Icon name="Folder" />
                <span>
                  <strong>{p.name}</strong>
                  <small>
                    {p.studio || "Bez nazwy pracowni"} ·{" "}
                    {new Date(p.updatedAt).toLocaleDateString("pl-PL")}
                  </small>
                </span>
                {p.submissions.length > 0 && (
                  <span className="badge">Brief przekazany</span>
                )}
                <Icon name="ArrowRight" />
              </button>
            ))}
            {!projects.length && (
              <p className="empty-inline">Nie ma jeszcze projektów.</p>
            )}
          </div>
          <p className="small muted">
            Widzisz swoje projekty oraz projekty udostępnione Twojemu kontu.
            Współpracowników dodasz w panelu. Administrator InteliSpaces ma dostęp do briefów i projektów.
          </p>
        </Modal>
      )}
      {pendingSubmit && project && (
        <Modal
          title="Przekazać tę wersję briefu?"
          onClose={() => setPendingSubmit(false)}
        >
          <p>
            Zachowamy kopię projektu <strong>{project.name}</strong> wraz z
            listą {issues(project).length} otwartych ustaleń. Późniejsze zmiany
            nie zmienią przekazanej wersji.
          </p>
          <div className="row end">
            <button className="outline" onClick={() => setPendingSubmit(false)}>
              Wróć do edycji
            </button>
            <button className="primary" onClick={submit} disabled={busy}>
              Potwierdź przekazanie
              <Icon name="Send" />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
