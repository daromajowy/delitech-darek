import React, { useEffect, useRef, useState } from "react";
import { ControlWorkspace } from "./ControlWorkspace";
import { RoomPoints } from "./RoomPoints";
import {
  ApiError,
  businessData,
  loadProject,
  request,
  saveProject,
  session,
  panelUrl,
} from "./api";
import {
  Brand,
  Check,
  Field,
  Files,
  Icon,
  Modal,
  NumberInput,
  Select,
  Stat,
  Tool,
} from "./components";
import {
  categories,
  normalizeProject,
  addControlPoint,
  detachDocument,
  controls,
  duplicateRoom,
  emptyRoom,
  exampleProject,
  finishes,
  issues,
  newCircuit,
  newPoint,
  newProject,
  newScene,
  removeTargets,
  sceneTemplates,
  sensors,
  summary,
  targets,
  uid,
  type Binding,
  type Category,
  type Point,
  type Project,
  type Room,
  type Scene,
} from "./model";

const steps = ["Inwestycja", "Pomieszczenia", "Sterowanie", "Sceny", "Brief"];
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
  const [roomSettings, setRoomSettings] = useState(false);
  const [circuitId, setCircuitId] = useState("");
  const [kind, setKind] = useState<Category>("Oświetlenie"),
    [sceneTab, setSceneTab] = useState("Sceny"),
    [consent, setConsent] = useState(false),
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
    setSceneId(p.scenes[0]?.id ?? "");
    setError("");
    setPaused(false);
    setConsent(false);
    setPendingSubmit(false);
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
  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    edit((p) => {
      p[key] = value;
    });
  const replace = (p: Project) => {
    current.current = p;
    setProject(p);
  };
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
  const room = project?.rooms.find((r) => r.id === roomId) ?? project?.rooms[0];
  const circuit =
    room?.circuits.find((c) => c.id === circuitId && c.kind === kind) ??
    room?.circuits.find((c) => c.kind === kind);
  const point =
    project?.points.find((p) => p.id === pointId) ?? project?.points[0];
  const scene =
    project?.scenes.find((s) => s.id === sceneId) ?? project?.scenes[0];
  const roomEdit = (fn: (r: Room) => void) =>
    edit((p) => {
      const r = p.rooms.find((x) => x.id === room?.id);
      if (r) fn(r);
    });
  const pointEdit = (fn: (p: Point) => void) =>
    edit((p) => {
      const pt = p.points.find((x) => x.id === point?.id);
      if (pt) fn(pt);
    });
  const sceneEdit = (fn: (s: Scene) => void) =>
    edit((p) => {
      const s = p.scenes.find((x) => x.id === scene?.id);
      if (s) fn(s);
    });
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
  const addRoom = (name = "Nowe pomieszczenie") => {
    const r = emptyRoom(name);
    edit((p) => p.rooms.push(r));
    setRoomId(r.id);
    setRoomSettings(true);
  };
  const addPoint = () => {
    if (!project?.rooms.length) {
      setError("Najpierw dodaj pomieszczenie.");
      go(1);
      return;
    }
    const copy = structuredClone(project);
    const pt = addControlPoint(copy, room?.id ?? project.rooms[0].id);
    edit((p) => { p.points = copy.points; p.nextPointNumber = copy.nextPointNumber; });
    setPointId(pt.id);
  };
  const allTargets = project ? targets(project) : [];
  function bindingEditor(
    bindings: Binding[],
    update: (rows: Binding[]) => void,
    sceneMode = false,
  ) {
    return (
      <div className="bindings">
        {bindings.map((b, i) => (
          <div className="binding" key={b.id}>
            <div className="row spread">
              <strong>
                {sceneMode ? `Działanie ${i + 1}` : `Klawisz ${i + 1}`}
              </strong>
              {sceneMode && (
                <Tool
                  icon="Trash2"
                  label={`Usuń działanie ${i + 1}`}
                  onClick={() => update(bindings.filter((x) => x.id !== b.id))}
                />
              )}
            </div>
            <select
              aria-label={`${sceneMode ? "Działanie" : "Klawisz"} ${i + 1}: obwód lub scena`}
              value={b.target}
              onChange={(e) =>
                update(
                  bindings.map((x) =>
                    x.id === b.id ? { ...x, target: e.target.value } : x,
                  ),
                )
              }
            >
              <option value="">Do ustalenia</option>
              {allTargets
                .filter(
                  (t) =>
                    !sceneMode || !project?.scenes.some((s) => s.id === t.id),
                )
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
            </select>
            <Select
              label={`${sceneMode ? "Działanie" : "Klawisz"} ${i + 1}: funkcja`}
              value={b.action}
              options={
                sceneMode
                  ? [
                      "Wyłącz",
                      "Włącz",
                      "10%",
                      "20%",
                      "50%",
                      "100%",
                      "Otwórz",
                      "Zamknij",
                      "Komfort",
                      "Eco",
                      "Do ustalenia",
                    ]
                  : [
                      "Włącz / wyłącz",
                      "Ściemnianie",
                      "Otwórz / zamknij",
                      "Temperatura",
                      "Uruchom scenę",
                      "Do ustalenia",
                    ]
              }
              onChange={(action) =>
                update(
                  bindings.map((x) => (x.id === b.id ? { ...x, action } : x)),
                )
              }
            />
          </div>
        ))}
      </div>
    );
  }
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
          <main className={`workspace step-${step}`}>
            {step === 0 && (
              <div className="investment-layout">
                <section className="main-panel">
                  <div className="section-heading">
                    <span className="eyebrow">01 / INWESTYCJA</span>
                    <h2>Zacznijmy od Twojego projektu</h2>
                  </div>
                  <div className="form-grid">
                    <Field label="Nazwa inwestycji" wide>
                      <input
                        value={project.name}
                        maxLength={180}
                        onChange={(e) => set("name", e.target.value)}
                      />
                    </Field>
                    <Field label="Pracownia">
                      <input
                        value={project.studio}
                        maxLength={180}
                        onChange={(e) => set("studio", e.target.value)}
                        placeholder="Nazwa pracowni"
                      />
                    </Field>
                    <Field label="Osoba kontaktowa">
                      <input
                        value={project.contact}
                        maxLength={180}
                        onChange={(e) => set("contact", e.target.value)}
                        placeholder="Imię i nazwisko"
                      />
                    </Field>
                    <Field label="E-mail do kontaktu" wide>
                      <input
                        type="email"
                        value={project.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="pracownia@example.pl"
                      />
                    </Field>
                    <Field label="Typ inwestycji" wide>
                      <div
                        className="segments"
                        role="group"
                        aria-label="Typ inwestycji"
                      >
                        {["Dom", "Mieszkanie", "Biuro", "Inne"].map((t, i) => (
                          <button
                            type="button"
                            key={t}
                            className={project.type === t ? "selected" : ""}
                            aria-pressed={project.type === t}
                            onClick={() => set("type", t)}
                          >
                            <Icon
                              name={
                                [
                                  "House",
                                  "Building2",
                                  "BriefcaseBusiness",
                                  "Shapes",
                                ][i]
                              }
                            />
                            {t}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Miejscowość">
                      <input
                        value={project.city}
                        onChange={(e) => set("city", e.target.value)}
                      />
                    </Field>
                    <Field label="Powierzchnia (m²)">
                      <NumberInput
                        value={project.area}
                        onChange={(n) => set("area", n)}
                      />
                    </Field>
                    <Field label="Etap projektu">
                      <Select
                        value={project.stage}
                        options={[
                          "Koncepcja",
                          "Projekt wnętrz",
                          "Projekt wykonawczy",
                          "Budowa",
                          "Modernizacja",
                        ]}
                        onChange={(v) => set("stage", v)}
                      />
                    </Field>
                    <Field label="Planowane uruchomienie">
                      <input
                        type="month"
                        value={project.date}
                        onChange={(e) => set("date", e.target.value)}
                      />
                    </Field>
                    <Field label="Budżet automatyki">
                      <Select
                        value={project.budget}
                        options={[
                          "Do ustalenia",
                          "Do 30 tys. zł",
                          "30–60 tys. zł",
                          "60–100 tys. zł",
                          "100–150 tys. zł",
                          "Powyżej 150 tys. zł",
                        ]}
                        onChange={(v) => set("budget", v)}
                      />
                    </Field>
                    <Field label="Najważniejsze dla inwestora">
                      <Select
                        value={project.priority}
                        options={[
                          "Komfort",
                          "Estetyka",
                          "Energooszczędność",
                          "Bezpieczeństwo",
                          "Elastyczność",
                          "Budżet",
                        ]}
                        onChange={(v) => set("priority", v)}
                      />
                    </Field>
                    <div className="wide">
                      <h3>Zakres automatyki</h3>
                      <div className="checks-grid">
                        {[
                          "Oświetlenie",
                          "Osłony",
                          "Klimat",
                          "Bezpieczeństwo",
                          "Audio / AV",
                          "Ogród",
                          "Energia",
                          "Zdalny dostęp",
                        ].map((v) => (
                          <Check
                            key={v}
                            label={v}
                            checked={project.scope.includes(v)}
                            onChange={(checked) =>
                              set(
                                "scope",
                                checked
                                  ? [...project.scope, v]
                                  : project.scope.filter((x) => x !== v),
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <Field label="Założenia i uwagi" wide>
                      <textarea
                        value={project.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        placeholder="Co jest szczególnie ważne w tym projekcie?"
                      />
                    </Field>
                  </div>
                </section>
                <aside className="right-panel">
                  <h3>Twój projekt w skrócie</h3>
                  <Stat
                    icon="House"
                    value={project.type}
                    label={project.city}
                  />
                  <Stat
                    icon="Ruler"
                    value={project.area ?? "—"}
                    label="m² powierzchni"
                  />
                  <Stat
                    icon="LayoutGrid"
                    value={project.rooms.length}
                    label="pomieszczeń"
                  />
                  <Stat
                    icon="MousePointer2"
                    value={project.points.length}
                    label="punktów sterowania"
                  />
                  <div className="sensor-promo">
                    <img
                      src="media/jung-ls-touch.png"
                      alt="Sensor JUNG LS TOUCH"
                    />
                    <div>
                      <span className="eyebrow">TECHNOLOGIA W TWOIM STYLU</span>
                      <h3>Detal, który pasuje do wnętrza.</h3>
                      <span className="muted">JUNG F40 · F50 · LS TOUCH</span>
                    </div>
                  </div>
                  <Files
                    project={project}
                    upload={upload}
                    remove={removeFile}
                    busy={busy}
                  />
                  <div className="pending-box">
                    <h3>Do ustalenia</h3>
                    {!project.date && (
                      <p>
                        <i />
                        Termin uruchomienia
                      </p>
                    )}
                    {project.budget === "Do ustalenia" && (
                      <p>
                        <i />
                        Budżet inwestora
                      </p>
                    )}
                  </div>
                </aside>
              </div>
            )}
            {step === 1 && (
              <div className="three-columns">
                <aside className="left-panel">
                  <div className="row spread">
                    <h3>Pomieszczenia</h3>
                    <Tool
                      icon="Plus"
                      label="Dodaj pomieszczenie"
                      onClick={() => addRoom()}
                    />
                  </div>
                  {[...new Set(project.rooms.map((r) => r.floor))].map(
                    (floor) => (
                      <section className="nav-group" key={floor}>
                        <h4>{floor || "Bez kondygnacji"}</h4>
                        {project.rooms
                          .filter((r) => r.floor === floor)
                          .map((r) => (
                            <button
                              key={r.id}
                              className={`nav-entry ${room?.id === r.id ? "selected" : ""}`}
                              onClick={() => setRoomId(r.id)}
                            >
                              <Icon
                                name={
                                  /salon/i.test(r.name)
                                    ? "Sofa"
                                    : /kuchnia/i.test(r.name)
                                      ? "CookingPot"
                                      : /łazien/i.test(r.name)
                                        ? "Bath"
                                        : "DoorOpen"
                                }
                              />
                              <span>{r.name}</span>
                              <i
                                className={
                                  r.circuits.length ? "complete" : "pending"
                                }
                              />
                            </button>
                          ))}
                      </section>
                    ),
                  )}
                  <div className="sidebar-actions">
                    <button className="outline" onClick={() => addRoom()}>
                      <Icon name="Plus" />
                      Dodaj pomieszczenie
                    </button>
                    <select
                      aria-label="Dodaj pomieszczenie z szablonu"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const r = emptyRoom(e.target.value);
                          r.circuits = [
                            {
                              ...newCircuit("Oświetlenie"),
                              name: "Oświetlenie główne",
                            },
                            { ...newCircuit("Klimat"), name: "Ogrzewanie" },
                          ];
                          edit((p) => p.rooms.push(r));
                          setRoomId(r.id);
                        }
                      }}
                    >
                      <option value="">Z szablonu…</option>
                      {[
                        "Salon",
                        "Kuchnia",
                        "Sypialnia",
                        "Łazienka",
                        "Gabinet",
                        "Taras",
                      ].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </aside>
                {room ? (
                  <>
                    <section className="main-panel">
                      <div className="row spread section-heading">
                        <div>
                          <h2>{room.name}</h2>
                          <span className="muted">
                            {room.floor} · {room.area ?? "—"} m²
                          </span>
                        </div>
                        <div className="row">
                          <Tool
                            icon="Pencil"
                            label="Dane pomieszczenia"
                            onClick={() => setRoomSettings((v) => !v)}
                          />
                          <Tool
                            icon="Copy"
                            label="Duplikuj pomieszczenie"
                            onClick={() => {
                              const copy = duplicateRoom(project, room.id);
                              replace(copy);
                              setRoomId(copy.rooms.at(-1)!.id);
                            }}
                          />
                          <Tool
                            icon="Trash2"
                            label="Usuń pomieszczenie"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Usunąć pomieszczenie ${room.name} wraz z obwodami i punktami?`,
                                )
                              ) {
                                const copy = removeTargets(
                                  project,
                                  room.circuits.map((c) => c.id),
                                );
                                copy.rooms = copy.rooms.filter(
                                  (r) => r.id !== room.id,
                                );
                                copy.points = copy.points.filter(
                                  (pt) => pt.roomId !== room.id,
                                );
                                replace(copy);
                              }
                            }}
                          />
                        </div>
                      </div>
                      {roomSettings && (
                        <div className="compact-fields">
                          <Field label="Nazwa pomieszczenia">
                            <input
                              value={room.name}
                              onChange={(e) =>
                                roomEdit((r) => (r.name = e.target.value))
                              }
                            />
                          </Field>
                          <Field label="Kondygnacja">
                            <Select
                              value={room.floor}
                              options={[
                                "Parter",
                                "Piętro",
                                "Piętro 2",
                                "Poddasze",
                                "Piwnica",
                                "Na zewnątrz",
                              ]}
                              onChange={(v) => roomEdit((r) => (r.floor = v))}
                            />
                          </Field>
                          <Field label="m²">
                            <NumberInput
                              value={room.area}
                              onChange={(v) => roomEdit((r) => (r.area = v))}
                            />
                          </Field>
                        </div>
                      )}
                      <div className="tabs" role="tablist">
                        {categories.map((k, i) => (
                          <button
                            role="tab"
                            aria-selected={kind === k}
                            key={k}
                            className={kind === k ? "active" : ""}
                            onClick={() => setKind(k)}
                          >
                            <Icon
                              name={
                                [
                                  "Lightbulb",
                                  "Blinds",
                                  "Thermometer",
                                  "Ellipsis",
                                ][i]
                              }
                            />
                            {k}
                          </button>
                        ))}
                      </div>
                      <h3>
                        {kind === "Oświetlenie"
                          ? "Obwody oświetlenia"
                          : kind === "Osłony"
                            ? "Napędy osłon"
                            : kind === "Klimat"
                              ? "Strefy klimatu"
                              : "Pozostałe funkcje"}
                      </h3>
                      <div className="table-scroll">
                        <table className="circuit-table">
                          <thead>
                            <tr>
                              <th>Nr</th>
                              <th>Nazwa</th>
                              <th>Sterowanie</th>
                              <th>Priorytet</th>
                              <th>
                                <span className="sr-only">Akcje</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {room.circuits
                              .filter((c) => c.kind === kind)
                              .map((c, i) => (
                                <React.Fragment key={c.id}>
                                  <tr
                                    className={
                                      circuit?.id === c.id ? "selected" : ""
                                    }
                                    onClick={() => setCircuitId(c.id)}
                                    onFocus={() => setCircuitId(c.id)}
                                  >
                                    <td className="mono">
                                      {String(i + 1).padStart(2, "0")}
                                    </td>
                                    <td>
                                      <input
                                        aria-label={`Nazwa obwodu ${i + 1}`}
                                        value={c.name}
                                        onChange={(e) =>
                                          roomEdit((r) => {
                                            r.circuits.find(
                                              (x) => x.id === c.id,
                                            )!.name = e.target.value;
                                          })
                                        }
                                      />
                                    </td>
                                    <td>
                                      <Select
                                        label={`Sterowanie ${c.name}`}
                                        value={c.control}
                                        options={controls[kind]}
                                        onChange={(v) =>
                                          roomEdit((r) => {
                                            r.circuits.find(
                                              (x) => x.id === c.id,
                                            )!.control = v;
                                          })
                                        }
                                      />
                                    </td>
                                    <td>
                                      <Select
                                        label={`Priorytet ${c.name}`}
                                        value={c.priority}
                                        options={["Konieczne", "Opcjonalne"]}
                                        onChange={(v) =>
                                          roomEdit((r) => {
                                            r.circuits.find(
                                              (x) => x.id === c.id,
                                            )!.priority = v as
                                              | "Konieczne"
                                              | "Opcjonalne";
                                          })
                                        }
                                      />
                                    </td>
                                    <td>
                                      <Tool
                                        icon="Trash2"
                                        label={`Usuń obwód ${c.name}`}
                                        onClick={() => {
                                          if (
                                            window.confirm(
                                              `Usunąć obwód ${c.name}? Przypisania będą oznaczone jako do ustalenia.`,
                                            )
                                          ) {
                                            const copy = removeTargets(
                                              project,
                                              [c.id],
                                            );
                                            copy.rooms.find(
                                              (r) => r.id === room.id,
                                            )!.circuits = room.circuits.filter(
                                              (x) => x.id !== c.id,
                                            );
                                            replace(copy);
                                          }
                                        }}
                                      />
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      {!room.circuits.some((c) => c.kind === kind) && (
                        <p className="empty-inline">
                          Brak obwodów w tej sekcji.
                        </p>
                      )}
                      <button
                        className="outline add-row"
                        onClick={() => {
                          const added = newCircuit(kind);
                          roomEdit((r) => r.circuits.push(added));
                          setCircuitId(added.id);
                        }}
                      >
                        <Icon name="Plus" />
                        Dodaj {kind === "Klimat" ? "strefę" : "obwód"}
                      </button>
                      {circuit && (
                        <Field label={`Parametry / model: ${circuit.name}`}>
                          <input
                            value={circuit.spec}
                            placeholder="Do ustalenia"
                            onChange={(e) =>
                              roomEdit((r) => {
                                r.circuits.find(
                                  (c) => c.id === circuit.id,
                                )!.spec = e.target.value;
                              })
                            }
                          />
                        </Field>
                      )}
                      <RoomPoints project={project} room={room} edit={edit} configure={id => { setPointId(id); go(2); }} />
                      <Field label="Uwagi do pomieszczenia">
                        <textarea
                          value={room.notes}
                          onChange={(e) =>
                            roomEdit((r) => (r.notes = e.target.value))
                          }
                        />
                      </Field>
                    </section>
                    <aside className="right-panel">
                      <h3>{room.name} w briefie</h3>
                      <Stat
                        icon="Lightbulb"
                        value={
                          room.circuits.filter((c) => c.kind === "Oświetlenie")
                            .length
                        }
                        label="obwodów światła"
                      />
                      <Stat
                        icon="CircleGauge"
                        value={
                          room.circuits.filter((c) =>
                            ["Ściemnianie", "DALI", "RGBW"].includes(c.control),
                          ).length
                        }
                        label="obwodów ściemnianych"
                      />
                      <Stat
                        icon="Blinds"
                        value={
                          room.circuits.filter((c) => c.kind === "Osłony")
                            .length
                        }
                        label="napędów osłon"
                      />
                      <Stat
                        icon="MousePointer2"
                        value={
                          project.points.filter((pt) => pt.roomId === room.id)
                            .length
                        }
                        label="punktów sterowania"
                      />
                      <Files
                        project={project}
                        upload={upload}
                        remove={removeFile}
                        busy={busy}
                      />
                      <div className="pending-box">
                        <h3>Do ustalenia</h3>
                        {room.circuits
                          .filter((c) => !c.spec)
                          .map((c) => (
                            <p key={c.id}>
                              <i />
                              {c.name}: model / parametry
                            </p>
                          ))}
                      </div>
                    </aside>
                  </>
                ) : (
                  <section className="empty-inline">
                    <Icon name="LayoutGrid" size={38} />
                    <h2>Pomieszczenia projektu</h2>
                    <button className="primary" onClick={() => addRoom()}>
                      Dodaj pierwsze pomieszczenie
                    </button>
                  </section>
                )}
              </div>
            )}
            {step === 2 && (
              <ControlWorkspace key={project.id} project={project} pointId={pointId} select={setPointId} edit={edit} upload={upload} busy={busy} goRooms={() => go(1)} />
            )}
            {step === 3 && (
              <>
                <div className="view-toggle">
                  <div className="segments">
                    <button
                      className={sceneTab === "Sceny" ? "selected" : ""}
                      onClick={() => setSceneTab("Sceny")}
                    >
                      <Icon name="Clapperboard" />
                      Sceny
                    </button>
                    <button
                      className={sceneTab === "Integracje" ? "selected" : ""}
                      onClick={() => setSceneTab("Integracje")}
                    >
                      <Icon name="Network" />
                      Integracje
                    </button>
                  </div>
                </div>
                {sceneTab === "Integracje" ? (
                  <section className="integration-list">
                    <div className="section-heading">
                      <h2>Integracje w projekcie</h2>
                      <p className="muted">
                        Wymagania do weryfikacji z integratorem. Zgodność zależy
                        od modelu i dostępnych interfejsów.
                      </p>
                    </div>
                    {project.integrations.map((i) => (
                      <div
                        className={`integration ${i.enabled ? "enabled" : ""}`}
                        key={i.id}
                      >
                        <Check
                          label={i.name}
                          checked={i.enabled}
                          onChange={(v) =>
                            edit(
                              (p) =>
                                (p.integrations.find(
                                  (x) => x.id === i.id,
                                )!.enabled = v),
                            )
                          }
                        />
                        {i.enabled ? (
                          <>
                            <Field label="Model / interfejs">
                              <input
                                value={i.model}
                                onChange={(e) =>
                                  edit(
                                    (p) =>
                                      (p.integrations.find(
                                        (x) => x.id === i.id,
                                      )!.model = e.target.value),
                                  )
                                }
                                placeholder="Do ustalenia"
                              />
                            </Field>
                            <Field label="Oczekiwane działanie">
                              <input
                                value={i.notes}
                                onChange={(e) =>
                                  edit(
                                    (p) =>
                                      (p.integrations.find(
                                        (x) => x.id === i.id,
                                      )!.notes = e.target.value),
                                  )
                                }
                                placeholder="Zakres integracji"
                              />
                            </Field>
                          </>
                        ) : (
                          <span className="muted small">Poza zakresem</span>
                        )}
                      </div>
                    ))}
                  </section>
                ) : (
                  <div className="three-columns scenes-columns">
                    <aside className="left-panel">
                      <h3>Sceny w projekcie</h3>
                      {["Dom", "Na zewnątrz"].map((area) => (
                        <section className="nav-group" key={area}>
                          <h4>{area}</h4>
                          {project.scenes
                            .filter((s) => s.area === area)
                            .map((s) => (
                              <button
                                key={s.id}
                                className={`nav-entry ${scene?.id === s.id ? "selected" : ""}`}
                                onClick={() => setSceneId(s.id)}
                              >
                                <Icon name={s.icon} />
                                <span>{s.name}</span>
                              </button>
                            ))}
                        </section>
                      ))}
                      <select
                        aria-label="Dodaj scenę z szablonu"
                        value=""
                        onChange={(e) => {
                          if (!e.target.value) return;
                          const s = newScene(
                            sceneTemplates[Number(e.target.value)],
                          );
                          edit((p) => p.scenes.push(s));
                          setSceneId(s.id);
                        }}
                      >
                        <option value="">Dodaj scenę…</option>
                        {sceneTemplates.map((t, i) => (
                          <option key={t[0]} value={i}>
                            {t[0]}
                          </option>
                        ))}
                      </select>
                      <button
                        className="outline add-row"
                        onClick={() => {
                          const s = newScene(["Nowa scena", "Sparkles", "Dom"]);
                          edit((p) => p.scenes.push(s));
                          setSceneId(s.id);
                        }}
                      >
                        <Icon name="Plus" />
                        Własna scena
                      </button>
                    </aside>
                    {scene ? (
                      <>
                        <section className="main-panel">
                          <div className="row spread section-heading">
                            <div className="row">
                              <div className="scene-symbol">
                                <Icon name={scene.icon} size={30} />
                              </div>
                              <div>
                                <h2>{scene.name}</h2>
                                <span className="muted">
                                  Jedno polecenie. Wiele działań.
                                </span>
                              </div>
                            </div>
                            <Tool
                              icon="Trash2"
                              label="Usuń scenę"
                              onClick={() => {
                                if (
                                  window.confirm(`Usunąć scenę ${scene.name}?`)
                                ) {
                                  const copy = removeTargets(project, [
                                    scene.id,
                                  ]);
                                  copy.scenes = copy.scenes.filter(
                                    (s) => s.id !== scene.id,
                                  );
                                  replace(copy);
                                }
                              }}
                            />
                          </div>
                          <div className="form-grid">
                            <Field label="Nazwa sceny">
                              <input
                                value={scene.name}
                                onChange={(e) =>
                                  sceneEdit((s) => (s.name = e.target.value))
                                }
                              />
                            </Field>
                            <Field label="Obszar">
                              <Select
                                value={scene.area}
                                options={["Dom", "Na zewnątrz"]}
                                onChange={(v) => sceneEdit((s) => (s.area = v))}
                              />
                            </Field>
                          </div>
                          <h3>Co ma się wydarzyć?</h3>
                          {bindingEditor(
                            scene.actions,
                            (b) => sceneEdit((s) => (s.actions = b)),
                            true,
                          )}
                          {scene.actions.length === 0 && (
                            <p className="empty-inline">
                              Brak zdefiniowanych działań.
                            </p>
                          )}
                          <button
                            className="outline add-row"
                            onClick={() =>
                              sceneEdit((s) =>
                                s.actions.push({
                                  id: uid(),
                                  target: "",
                                  action: "Wyłącz",
                                }),
                              )
                            }
                          >
                            <Icon name="Plus" />
                            Dodaj działanie
                          </button>
                          <div className="form-grid">
                            <Field label="Priorytet">
                              <Select
                                value={scene.priority}
                                options={["Konieczne", "Opcjonalne"]}
                                onChange={(v) =>
                                  sceneEdit(
                                    (s) =>
                                      (s.priority = v as
                                        | "Konieczne"
                                        | "Opcjonalne"),
                                  )
                                }
                              />
                            </Field>
                            <div className="wide">
                              <h3>Uruchamianie sceny</h3>
                              <div className="checks-grid">
                                {[
                                  "Przycisk",
                                  "Aplikacja",
                                  "Harmonogram",
                                  "Czujnik",
                                  "Polecenie głosowe",
                                ].map((t) => (
                                  <Check
                                    key={t}
                                    label={t}
                                    checked={scene.triggers.includes(t)}
                                    onChange={(v) =>
                                      sceneEdit(
                                        (s) =>
                                          (s.triggers = v
                                            ? [...s.triggers, t]
                                            : s.triggers.filter(
                                                (x) => x !== t,
                                              )),
                                      )
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="wide">
                              <Check
                                label="Ręczne sterowanie ma pierwszeństwo przed automatyką"
                                checked={scene.exception}
                                onChange={(v) =>
                                  sceneEdit((s) => (s.exception = v))
                                }
                              />
                            </div>
                            <Field label="Warunki, wyjątki i uwagi" wide>
                              <textarea
                                value={scene.notes}
                                onChange={(e) =>
                                  sceneEdit((s) => (s.notes = e.target.value))
                                }
                                placeholder="Np. nie podlewaj po deszczu; nie uruchamiaj kosiarki podczas pobytu w ogrodzie."
                              />
                            </Field>
                          </div>
                        </section>
                        <aside className="right-panel">
                          <img
                            className="context-image"
                            src="media/interior.jpg"
                            alt="Współczesne wnętrze domu"
                          />
                          <h3>Scena w briefie</h3>
                          <Stat
                            icon={scene.icon}
                            value={scene.actions.length}
                            label="działań"
                          />
                          <Stat
                            icon="MousePointer2"
                            value={
                              project.points.filter((pt) =>
                                pt.bindings.some((b) => b.target === scene.id),
                              ).length
                            }
                            label="przypisanych punktów"
                          />
                          <section className="pending-box">
                            <h3>Wyzwalanie</h3>
                            {scene.triggers.length ? (
                              scene.triggers.map((t) => (
                                <p key={t}>
                                  <Icon name="Check" size={16} />
                                  {t}
                                </p>
                              ))
                            ) : (
                              <p>
                                <i />
                                Do ustalenia
                              </p>
                            )}
                          </section>
                          <p className="small muted">
                            Sterowanie urządzeniami zewnętrznymi wymaga
                            sprawdzenia blokad bezpieczeństwa i możliwości
                            integracji.
                          </p>
                        </aside>
                      </>
                    ) : (
                      <section className="empty-inline">
                        <Icon name="Clapperboard" size={38} />
                        <h2>Scenariusze codzienności</h2>
                        <p>Dodaj scenę z listy po lewej.</p>
                      </section>
                    )}
                  </div>
                )}
              </>
            )}
            {step === 4 && (
              <div className="brief-layout">
                <section className="brief-preview">
                  <div className="row spread">
                    <h3>Podsumowanie projektu</h3>
                    <button
                      className="quiet"
                      onClick={() => exportFile("pdf")}
                      disabled={busy}
                    >
                      <Icon name="Download" />
                      Pobierz PDF
                    </button>
                  </div>
                  <article className="paper">
                    <div className="row spread">
                      <Brand />
                      <span className="small muted">
                        BRIEF KNX · {String(project.revision).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="paper-title">
                      <span className="eyebrow">
                        ZAŁOŻENIA AUTOMATYKI BUDYNKU
                      </span>
                      <h2>{project.name}</h2>
                      <p>
                        {project.studio} ·{" "}
                        {project.city || "Lokalizacja do ustalenia"}
                      </p>
                    </div>
                    <div className="paper-stats">
                      {Object.entries({
                        Pomieszczenia: summary(project).rooms,
                        Obwody: summary(project).circuits,
                        Sterowanie: summary(project).points,
                        Sceny: summary(project).scenes,
                      }).map(([label, n]) => (
                        <div key={label}>
                          <strong>{n}</strong>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                    <h3>Zakres pomieszczeń</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Pomieszczenie</th>
                          <th>Obwody</th>
                          <th>Punkty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.rooms.map((r) => (
                          <tr key={r.id}>
                            <td>
                              {r.name}
                              <small>
                                {r.floor} · {r.area ?? "—"} m²
                              </small>
                            </td>
                            <td>{r.circuits.length}</td>
                            <td>
                              {
                                project.points.filter(
                                  (pt) => pt.roomId === r.id,
                                ).length
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <h3>Wybrane sensory</h3>
                    <div className="paper-sensors">
                      {sensors
                        .filter((s) =>
                          project.points.some((pt) => pt.sensor === s.name),
                        )
                        .map((s) => (
                          <figure key={s.name}>
                            <img src={`media/${s.image}`} alt={s.name} />
                            <figcaption>
                              {s.name}
                              <small>
                                {
                                  project.points.filter(
                                    (pt) => pt.sensor === s.name,
                                  ).length
                                }{" "}
                                pkt
                              </small>
                            </figcaption>
                          </figure>
                        ))}
                    </div>
                    <h3>Sceny</h3>
                    <div className="scene-chips">
                      {project.scenes.map((s) => (
                        <span key={s.id}>
                          <Icon name={s.icon} size={17} />
                          {s.name}
                        </span>
                      ))}
                    </div>
                    <div className="paper-note">
                      Brief funkcjonalny do konsultacji i wyceny. Nie zastępuje
                      projektu wykonawczego ani doboru zabezpieczeń. Aktory:
                      JUNG. Wykończenia i zgodność urządzeń wymagają
                      potwierdzenia.
                    </div>
                  </article>
                </section>
                <aside className="right-panel brief-aside">
                  <h2>Gotowe do rozmowy</h2>
                  <div className="document-actions">
                    <button onClick={() => exportFile("pdf")} disabled={busy}>
                      <Icon name="FileText" />
                      <span>
                        Brief projektu
                        <small>PDF · sensory, sceny, uzgodnienia</small>
                      </span>
                      <Icon name="Download" />
                    </button>
                    <button onClick={() => exportFile("xlsx")} disabled={busy}>
                      <Icon name="Sheet" />
                      <span>
                        Zestawienie funkcji
                        <small>XLSX · pomieszczenia i obwody</small>
                      </span>
                      <Icon name="Download" />
                    </button>
                    <button onClick={() => downloadJson(project)}>
                      <Icon name="FileJson" />
                      <span>
                        Kopia danych<small>JSON · pełny zapis projektu</small>
                      </span>
                      <Icon name="Download" />
                    </button>
                  </div>
                  <Files
                    project={project}
                    upload={upload}
                    remove={removeFile}
                    busy={busy}
                  />
                  <details className="pending-box" open>
                    <summary>
                      <strong>Do ustalenia ({issues(project).length})</strong>
                      <Icon name="ChevronDown" size={16} />
                    </summary>
                    <div className="issue-list">
                      {issues(project).map((issue, i) => (
                        <p key={i}>
                          <i />
                          {issue}
                        </p>
                      ))}
                      {!issues(project).length && (
                        <p>
                          <Icon name="Check" />
                          Założenia uzupełnione.
                        </p>
                      )}
                    </div>
                  </details>
                  <h3>Przekazanie do zespołu</h3>
                  <p className="small muted">
                    Zapisz zatwierdzoną wersję w obszarze InteliSpaces. To nie
                    jest zamówienie ani wysyłka e-mail.
                  </p>
                  <Check
                    label="Potwierdzam przekazanie danych projektu do przygotowania konsultacji i wyceny."
                    checked={consent}
                    onChange={setConsent}
                  />
                  <button
                    className="primary full"
                    disabled={busy || !consent}
                    onClick={() => setPendingSubmit(true)}
                  >
                    <Icon name="Send" />
                    Przekaż brief
                  </button>
                  {project.submissions.length > 0 && (
                    <section className="receipt">
                      <Icon name="CircleCheck" />
                      <div>
                        <strong>
                          Przekazano {project.submissions.length} wersji
                        </strong>
                        <small>
                          Ostatnia:{" "}
                          {new Date(
                            project.submissions.at(-1)!.createdAt,
                          ).toLocaleString("pl-PL")}{" "}
                          · wersja {project.submissions.at(-1)!.revision}
                        </small>
                      </div>
                    </section>
                  )}
                </aside>
              </div>
            )}
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
              InteliSpaces · {step + 1} / 5
            </span>
            {step < 4 ? (
              <button className="primary" onClick={() => go(step + 1)}>
                Dalej: {steps[step + 1].toLocaleLowerCase("pl")}
                <Icon name="ArrowRight" />
              </button>
            ) : (
              <button
                className="primary"
                onClick={() => exportFile("pdf")}
                disabled={busy}
              >
                <Icon name="Download" />
                Pobierz brief PDF
              </button>
            )}
          </footer>
        </>
      )}
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
