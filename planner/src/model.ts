export type Category = "Oświetlenie" | "Osłony" | "Klimat" | "Pozostałe";
export type Priority = "Konieczne" | "Opcjonalne";
export interface Circuit {
  id: string;
  name: string;
  kind: Category;
  control: string;
  priority: Priority;
  spec: string;
}
export interface Room {
  id: string;
  name: string;
  floor: string;
  area: number | null;
  notes: string;
  circuits: Circuit[];
}
export interface Binding {
  id: string;
  target: string;
  action: string;
  label?: string;
  notes?: string;
  hold?: { target: string; action: string };
}
export interface Placement {
  documentId: string;
  page: number;
  x: number;
  y: number;
}
export interface PlanView {
  documentId: string;
  page: number;
  zoom: number;
  centerX: number;
  centerY: number;
}
export interface Point {
  id: string;
  roomId: string;
  name: string;
  sensor: string;
  finish: string;
  height: number | null;
  status: string;
  notes: string;
  bindings: Binding[];
  code?: string;
  deviceType?: string;
  model?: string;
  photoId?: string;
  placement?: Placement;
}
export interface Scene {
  id: string;
  name: string;
  icon: string;
  area: string;
  priority: Priority;
  triggers: string[];
  exception: boolean;
  notes: string;
  actions: Binding[];
}
export interface Integration {
  id: string;
  name: string;
  enabled: boolean;
  model: string;
  notes: string;
}
export interface Attachment {
  id: string;
  name: string;
  size: number;
  mime: string;
}
export interface Project {
  id: string;
  revision: number;
  updatedAt: string;
  name: string;
  studio: string;
  contact: string;
  email: string;
  type: string;
  city: string;
  area: number | null;
  stage: string;
  date: string;
  budget: string;
  priority: string;
  scope: string[];
  notes: string;
  rooms: Room[];
  points: Point[];
  scenes: Scene[];
  integrations: Integration[];
  attachments: Attachment[];
  submissions: { id: string; revision: number; createdAt: string }[];
  nextPointNumber?: number;
  planView?: PlanView;
}
export const categories: Category[] = [
  "Oświetlenie",
  "Osłony",
  "Klimat",
  "Pozostałe",
];
export const controls: Record<Category, string[]> = {
  Oświetlenie: [
    "Włącz / wyłącz",
    "Ściemnianie",
    "DALI",
    "RGBW",
    "Do ustalenia",
  ],
  Osłony: [
    "Rolety",
    "Żaluzje z lamelami",
    "Zasłony",
    "Markiza",
    "Do ustalenia",
  ],
  Klimat: [
    "Ogrzewanie podłogowe",
    "Grzejnik",
    "Klimatyzacja",
    "Wentylacja",
    "Do ustalenia",
  ],
  Pozostałe: [
    "Gniazdo sterowane",
    "Czujnik obecności",
    "Czujnik zalania",
    "Kontaktron",
    "Inne",
    "Do ustalenia",
  ],
};
export const sensors = [
  {
    name: "JUNG F50",
    image: "jung-f50.webp",
    keys: 4,
    finishes: ["Biały", "Czarny", "Aluminium", "Stal", "Mosiądz"],
  },
  {
    name: "JUNG F40",
    image: "jung-f40.webp",
    keys: 4,
    finishes: ["Biały", "Czarny", "Aluminium", "Stal"],
  },
  {
    name: "JUNG LS TOUCH",
    image: "jung-ls-touch.png",
    keys: 6,
    finishes: ["Biały", "Czarny", "Aluminium", "Stal", "Mosiądz"],
  },
];
export const finishes: Record<string, string> = {
  Biały: "#fafafa",
  Czarny: "#25292a",
  Aluminium: "#aeb2b3",
  Stal: "#767e80",
  Mosiądz: "#bda569",
};
export const uid = () => crypto.randomUUID();
export const emptyRoom = (
  name = "Nowe pomieszczenie",
  floor = "Parter",
): Room => ({ id: uid(), name, floor, area: null, notes: "", circuits: [] });
export const newCircuit = (kind: Category): Circuit => ({
  id: uid(),
  name: "Nowy obwód",
  kind,
  control: controls[kind][0],
  priority: "Konieczne",
  spec: "",
});
export const newPoint = (roomId: string): Point => ({
  id: uid(),
  roomId,
  name: "Przy wejściu",
  sensor: "JUNG F50",
  finish: "Biały",
  height: 110,
  status: "Propozycja",
  deviceType: "Sensor KNX",
  notes: "",
  bindings: Array.from({ length: 4 }, () => ({
    id: uid(),
    target: "",
    action: "Włącz / wyłącz",
  })),
});
export const sceneTemplates = [
  ["Wyjście", "LogOut", "Dom"],
  ["Powrót", "House", "Dom"],
  ["Poranek", "Sunrise", "Dom"],
  ["Noc", "Moon", "Dom"],
  ["Kino", "Clapperboard", "Dom"],
  ["Relaks", "Armchair", "Dom"],
  ["Kolacja", "Utensils", "Dom"],
  ["Goście", "Users", "Dom"],
  ["Urlop", "Plane", "Dom"],
  ["Sprzątanie", "Sparkles", "Dom"],
  ["Ogród wieczorem", "Trees", "Na zewnątrz"],
  ["Podlewanie", "Droplets", "Na zewnątrz"],
  ["Koszenie", "Flower2", "Na zewnątrz"],
  ["Silny wiatr", "Wind", "Na zewnątrz"],
];
export const newScene = (template = sceneTemplates[0]): Scene => ({
  id: uid(),
  name: template[0],
  icon: template[1],
  area: template[2],
  priority: "Konieczne",
  triggers: [],
  exception: false,
  notes: "",
  actions: [],
});
export function newProject(): Project {
  return {
    id: uid(),
    revision: 0,
    updatedAt: "",
    name: "Nowy projekt",
    studio: "",
    contact: "",
    email: "",
    type: "Dom",
    city: "",
    area: null,
    stage: "Koncepcja",
    date: "",
    budget: "Do ustalenia",
    priority: "Komfort",
    scope: ["Oświetlenie", "Osłony", "Klimat"],
    notes: "",
    rooms: [],
    points: [],
    scenes: [],
    attachments: [],
    submissions: [],
    integrations: [
      "Google Home",
      "Amazon Alexa",
      "Apple Home",
      "Alarm",
      "Domofon",
      "Audio / multiroom",
      "Pompa ciepła",
      "Fotowoltaika",
      "Ładowarka EV",
      "Robot koszący",
      "Podlewanie ogrodu",
    ].map((name) => ({
      id: uid(),
      name,
      enabled: false,
      model: "",
      notes: "",
    })),
  };
}
export function exampleProject(): Project {
  const p = newProject();
  Object.assign(p, {
    name: "Dom w Konstancinie",
    studio: "Pracownia Forma · przykład",
    city: "Konstancin-Jeziorna",
    area: 180,
    stage: "Projekt wnętrz",
  });
  p.rooms = [
    "Salon",
    "Kuchnia",
    "Hol",
    "Gabinet",
    "Sypialnia",
    "Pokój 1",
    "Pokój 2",
    "Łazienka",
  ].map((n, i) => ({
    ...emptyRoom(n, i < 4 ? "Parter" : "Piętro"),
    area: [32, 18, 12, 14, 20, 16, 16, 10][i],
  }));
  const room = p.rooms[0];
  room.notes =
    "Wieczorem delikatne światło przy sofie. Bez automatycznego gaszenia podczas oglądania filmu.";
  room.circuits = ["Sufit", "Stół", "LED w zabudowie", "Kinkiety"].map(
    (name, i) => ({
      ...newCircuit("Oświetlenie"),
      name,
      control: i === 1 || i === 2 ? "Ściemnianie" : "Włącz / wyłącz",
      priority: i === 2 ? "Opcjonalne" : "Konieczne",
      spec: i === 2 ? "" : "Typ opraw do potwierdzenia",
    }),
  );
  room.circuits.push(
    {
      ...newCircuit("Osłony"),
      name: "Zasłony przy tarasie",
      control: "Zasłony",
    },
    {
      ...newCircuit("Osłony"),
      name: "Żaluzja południowa",
      control: "Żaluzje z lamelami",
    },
  );
  p.points = ["Przy wejściu", "Przy sofie", "Przy tarasie"].map((name) => ({
    ...newPoint(room.id),
    name,
  }));
  p.scenes = sceneTemplates.slice(0, 9).map(newScene);
  const kino = p.scenes.find((s) => s.name === "Kino")!;
  kino.triggers = ["Przycisk", "Aplikacja"];
  kino.exception = true;
  kino.actions = room.circuits.slice(0, 3).map((c, i) => ({
    id: uid(),
    target: c.id,
    action: i === 2 ? "20%" : "Wyłącz",
  }));
  kino.actions.push({
    id: uid(),
    target: room.circuits[4].id,
    action: "Zamknij",
  });
  p.points[0].bindings = p.points[0].bindings.map((b, i) => ({
    ...b,
    target: i === 3 ? kino.id : room.circuits[i].id,
    action:
      i === 3 ? "Uruchom scenę" : i === 1 ? "Ściemnianie" : "Włącz / wyłącz",
  }));
  return p;
}
export function duplicateRoom(p: Project, roomId: string): Project {
  const copy = structuredClone(p),
    old = copy.rooms.find((r) => r.id === roomId);
  if (!old) return copy;
  const ids = new Map<string, string>();
  const room = structuredClone(old);
  room.id = uid();
  room.name += " (kopia)";
  room.circuits.forEach((c) => {
    const id = uid();
    ids.set(c.id, id);
    c.id = id;
  });
  copy.rooms.push(room);
  copy.points.push(
    ...p.points
      .filter((pt) => pt.roomId === roomId)
      .map((pt) => ({
        ...structuredClone(pt),
        id: uid(),
        roomId: room.id,
        code: undefined,
        placement: undefined,
        bindings: pt.bindings.map((b) => ({
          ...b,
          id: uid(),
          target: ids.get(b.target) ?? b.target,
          hold: b.hold ? { ...b.hold, target: ids.get(b.hold.target) ?? b.hold.target } : undefined,
        })),
      })),
  );
  return normalizeProject(copy);
}
export function removeTargets(p: Project, ids: string[]): Project {
  const n = structuredClone(p),
    invalid = new Set(ids);
  n.points.forEach((pt) =>
    pt.bindings.forEach((b) => {
      if (invalid.has(b.target)) b.target = "";
      if (b.hold && invalid.has(b.hold.target)) b.hold.target = "";
    }),
  );
  n.scenes.forEach((s) =>
    s.actions.forEach((b) => {
      if (invalid.has(b.target)) b.target = "";
    }),
  );
  return n;
}
export function targets(p: Project) {
  return [
    ...p.rooms.flatMap((r) =>
      r.circuits.map((c) => ({ id: c.id, label: `${r.name} · ${c.name}` })),
    ),
    ...p.scenes.map((s) => ({ id: s.id, label: `Scena · ${s.name}` })),
  ];
}
export function summary(p: Project) {
  const circuits = p.rooms.flatMap((r) => r.circuits);
  return {
    rooms: p.rooms.length,
    circuits: circuits.length,
    lights: circuits.filter((c) => c.kind === "Oświetlenie").length,
    dim: circuits.filter((c) =>
      ["Ściemnianie", "DALI", "RGBW"].includes(c.control),
    ).length,
    shades: circuits.filter((c) => c.kind === "Osłony").length,
    points: p.points.length,
    scenes: p.scenes.length,
  };
}
export function issues(p: Project): string[] {
  const result: string[] = [];
  if (!p.date) result.push("Termin uruchomienia");
  if (p.budget === "Do ustalenia") result.push("Budżet automatyki");
  p.rooms.forEach((r) => {
    if (r.area === null) result.push(`${r.name}: powierzchnia`);
    if (!r.circuits.length) result.push(`${r.name}: zakres funkcji`);
    r.circuits
      .filter((c) => !c.spec.trim() || c.control === "Do ustalenia")
      .forEach((c) => result.push(`${r.name}: ${c.name} - parametry / model`));
  });
  p.points.forEach((pt) => {
    if (pt.height === null || pt.bindings.some((b) => !b.target || (b.hold && !b.hold.target)))
      result.push(`${pt.name}: wysokość / przypisania klawiszy`);
  });
  p.scenes.forEach((s) => {
    if (
      !s.actions.length ||
      s.actions.some((b) => !b.target) ||
      !s.triggers.length
    )
      result.push(`${s.name}: działanie / wyzwalanie`);
  });
  p.integrations
    .filter((i) => i.enabled && !i.model)
    .forEach((i) => result.push(`${i.name}: model i zakres integracji`));
  return [...new Set(result)];
}
export const attachmentUrl = (project: string, id: string) =>
  `index.php?api=file&project=${encodeURIComponent(project)}&id=${encodeURIComponent(id)}`;

export const deviceTypes = ["Sensor KNX", "Przycisk", "Panel dotykowy", "Czujnik", "Inne"];
export const keyActions = ["Włącz / wyłącz", "Włącz", "Wyłącz", "Ściemnianie", "Rozjaśnij", "Przyciemnij", "Otwórz / zamknij", "Otwórz", "Zamknij", "Stop", "Temperatura", "Uruchom scenę", "Inna funkcja", "Do ustalenia"];

// Codes are persistent identities shared by the floor plan and the brief, not array indexes.
export function normalizeProject(source: Project): Project {
  const p = structuredClone(source);
  let next = Math.max(1, p.nextPointNumber ?? 1, ...p.points.map(pt => Number(pt.code?.match(/^P(\d+)$/)?.[1] ?? 0) + 1));
  const seen = new Set<string>();
  p.points.forEach(pt => {
    if (!pt.code || !/^P\d{2,}$/.test(pt.code) || seen.has(pt.code)) pt.code = `P${String(next++).padStart(2, "0")}`;
    seen.add(pt.code);
    pt.deviceType ??= pt.sensor === "JUNG LS TOUCH" ? "Panel dotykowy" : "Sensor KNX";
  });
  p.nextPointNumber = next;
  return p;
}

export function addControlPoint(p: Project, roomId: string, source?: Point): Point {
  const pt = source ? { ...structuredClone(source), id: uid(), name: `${source.name} (kopia)`, roomId,
    code: undefined, placement: undefined, bindings: source.bindings.map(b => ({ ...structuredClone(b), id: uid() })) } : newPoint(roomId);
  const numbered = normalizeProject({ ...p, points: [...p.points, pt] });
  p.points = numbered.points;
  p.nextPointNumber = numbered.nextPointNumber;
  return p.points[p.points.length - 1];
}

export function detachDocument(p: Project, id: string) {
  p.attachments = p.attachments.filter(a => a.id !== id);
  p.points.forEach(pt => {
    if (pt.placement?.documentId === id) delete pt.placement;
    if (pt.photoId === id) delete pt.photoId;
  });
  if (p.planView?.documentId === id) delete p.planView;
}

export function normalizedDrop(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }) {
  if (!rect.width || !rect.height) return null;
  const x = (clientX - rect.left) / rect.width, y = (clientY - rect.top) / rect.height;
  if (![x, y].every(Number.isFinite) || x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x, y };
}
