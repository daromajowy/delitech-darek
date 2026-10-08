import { Field, NumberInput, Select, Check, Icon } from './components';
import type { Project } from './model';
export function ProjectDetails({project, edit}: {project:Project; edit:(fn:(p:Project)=>void)=>void}) {
 const set = <K extends keyof Project>(key:K,value:Project[K]) => edit(p=>{p[key]=value;});
 return (<div className="form-grid">
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
                  </div>);
}
