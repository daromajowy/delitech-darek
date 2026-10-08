import { Brand, Check, Files, Icon } from './components';
import { issues, sensors, summary, type Project } from './model';
import { isDemo } from './api';
export function Handoff({project,exportFile,downloadJson,upload,removeFile,busy,consent,setConsent,setPendingSubmit}: {
 project:Project; exportFile:(format:'pdf'|'xlsx')=>void; downloadJson:(p:Project)=>void; upload:(f:File)=>void; removeFile:(id:string)=>void; busy:boolean; consent:boolean; setConsent:(v:boolean)=>void; setPendingSubmit:(v:boolean)=>void;
}) { return (<div className="brief-layout">
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
                      projektu wykonawczego ani doboru zabezpieczeń. Wykończenia i zgodność urządzeń wymagają
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
                  <h3>Przekazanie do zespołu</h3>{isDemo && <p className="inline-info">Podgląd GitHub: eksport działa, przekazanie wymaga konta w aplikacji produkcyjnej.</p>}
                  <p className="small muted">
                    Przekaż aktualną wersję do konsultacji, także z otwartymi ustaleniami. To nie
                    jest zamówienie ani wysyłka e-mail.
                  </p>
                  <Check
                    label="Potwierdzam przekazanie danych projektu do przygotowania konsultacji i wyceny."
                    checked={consent}
                    onChange={setConsent}
                  />
                  <button
                    className="primary full"
                    disabled={busy || !consent || isDemo}
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
              </div>); }
