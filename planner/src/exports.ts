import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { iconMap } from "./icons";
import { issues, sensors, summary, targets, type Project } from "./model";
import { pointPhoto } from "./documents";
import { appendPlans } from "./plan-export";

async function base64(url: string) {
  const r = await fetch(url);
  if (!r.ok)
    throw new Error("Nie można pobrać zasobów PDF. Zaloguj się ponownie.");
  const a = new Uint8Array(await r.arrayBuffer());
  let out = "";
  for (let i = 0; i < a.length; i += 8192)
    out += String.fromCharCode(...a.subarray(i, i + 8192));
  return btoa(out);
}
async function raster(url: string): Promise<string> {
  const image = new Image();
  image.src = url;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 600, 600);
  const scale = Math.min(560 / image.width, 560 / image.height);
  ctx.drawImage(
    image,
    (600 - image.width * scale) / 2,
    (600 - image.height * scale) / 2,
    image.width * scale,
    image.height * scale,
  );
  return canvas.toDataURL("image/png");
}
async function sceneIcon(name: string) {
  const icon = iconMap[name as keyof typeof iconMap] ?? iconMap.Sparkles;
  const svg = renderToStaticMarkup(
    createElement(icon, { size: 64, color: "#07869b", strokeWidth: 1.6 }),
  );
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    return await raster(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}
export async function buildPdf(p: Project): Promise<Blob> {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    compress: true,
    putOnlyUsedFonts: true,
  });
  for (const [file, style] of [
    ["NotoSans-Regular.ttf", "normal"],
    ["NotoSans-Bold.ttf", "bold"],
  ]) {
    doc.addFileToVFS(file, await base64(`media/${file}`));
    doc.addFont(file, "Noto", style);
  }
  doc.setFont("Noto");
  doc.setProperties({
    title: `Brief KNX - ${p.name}`,
    subject: "Założenia funkcjonalne automatyki",
    author: "InteliSpaces",
    creator: "Projektant KNX",
  });
  const logo = `data:image/png;base64,${await base64("brand/intelispaces-logo.png")}`;
  let y = 20;
  const header = () => {
    doc.addImage(logo, "PNG", 18, 9, 50, (50 * 365) / 2400, "intelispaces-logo", "FAST");
    doc.setFont("Noto", "normal");
    doc.setFontSize(7);
    doc.setTextColor("#71818a");
    doc.text(`PROJEKTANT KNX · WERSJA ${p.revision}`, 192, 16, {
      align: "right",
    });
    doc.setDrawColor("#dce4e9");
    doc.line(18, 21, 192, 21);
    y = 31;
  };
  const page = () => {
    doc.addPage();
    header();
  };
  const ensure = (height: number) => {
    if (y + height > 267) page();
  };
  const text = (value: string, size = 9, bold = false, color = "#344b56") => {
    doc.setFont("Noto", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(value || "—", 174) as string[];
    for (const line of lines) {
      ensure(size * 0.44 + 2);
      doc.setFont("Noto", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(color);
      doc.text(line, 18, y);
      y += size * 0.44 + 1;
    }
    y += 3;
  };
  const title = (value: string) => {
    ensure(34);
    y += 5;
    text(value, 13, true, "#20333d");
  };
  const table = (
    head: string[],
    body: (string | number)[][],
    compact = false,
  ) => {
    if (!body.length) {
      text("Nie określono.", 8);
      return;
    }
    ensure(20);
    autoTable(doc, {
      head: [head],
      body,
      startY: y,
      margin: { left: 18, right: 18, top: 30, bottom: 30 },
      styles: {
        font: "Noto",
        fontSize: 7.7,
        cellPadding: compact ? 1.25 : 2.25,
        textColor: "#344b56",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: "#eaf3f5",
        textColor: "#1d6070",
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: "#f8fafb" },
      rowPageBreak: "avoid",
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          const hold = y;
          header();
          y = hold;
        }
      },
    });
    y =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 6;
  };
  header();
  text("ZAŁOŻENIA AUTOMATYKI BUDYNKU", 8, true, "#07869b");
  y += 2;
  text(p.name, 24, true, "#20333d");
  text(
    `${p.studio || "Pracownia do uzupełnienia"} · ${p.city || "Lokalizacja do ustalenia"}`,
    10,
  );
  y += 3;
  const s = summary(p);
  table(
    ["Pomieszczenia", "Obwody", "Punkty sterowania", "Sceny"],
    [[s.rooms, s.circuits, s.points, s.scenes]],
  );
  table(
    ["Inwestycja", "Ustalenia"],
    [
      ["Typ / powierzchnia", `${p.type} · ${p.area ?? "Do ustalenia"} m²`],
      ["Etap / uruchomienie", `${p.stage} · ${p.date || "Do ustalenia"}`],
      [
        "Kontakt",
        `${p.contact || "Do uzupełnienia"} · ${p.email || "Do uzupełnienia"}`,
      ],
      ["Budżet / priorytet", `${p.budget} · ${p.priority}`],
      ["Zakres", p.scope.join(", ") || "Do ustalenia"],
      ["Aktory", "JUNG; dobór po weryfikacji obwodów"],
    ],
  );
  if (p.notes) {
    title("Założenia inwestora");
    text(p.notes);
  }
  title("Pomieszczenia");
  table(
    ["Pomieszczenie", "Kondygnacja", "m²", "Obwody", "Punkty"],
    p.rooms.map((r) => [
      r.name,
      r.floor,
      r.area ?? "—",
      r.circuits.length,
      p.points.filter((pt) => pt.roomId === r.id).length,
    ]),
  );
  page();
  title("Sensory i punkty sterowania");
  const lookup = new Map(targets(p).map((t) => [t.id, t.label]));
  for (const pt of p.points) {
    const rows = pt.bindings.reduce((n, b) => n + 1 + (b.hold ? 1 : 0) + Math.ceil((b.notes?.length ?? 0) / 95), 0);
    ensure(Math.min(230, 63 + rows * 9));
    title(`${pt.code} · ${p.rooms.find(r => r.id === pt.roomId)?.name} · ${pt.name}`);
    const top = y;
    const photo = await pointPhoto(p, pt);
    if (photo) {
      try { doc.addImage(await raster(photo.url), "PNG", 18, top, 33, 33); }
      finally { photo.release(); }
    }
    doc.setFont("Noto", "bold"); doc.setFontSize(10); doc.setTextColor("#20333d");
    const device = doc.splitTextToSize(pt.model || pt.sensor, 124);
    doc.text(device, 66, top + 6);
    doc.setFont("Noto", "normal"); doc.setFontSize(8); doc.setTextColor("#647984");
    const meta = [pt.deviceType || "Sensor KNX", `Wykończenie: ${pt.finish}`, `Montaż: ${pt.height ?? "do ustalenia"} cm · ${pt.status}`,
      pt.placement ? `Rzut: ${p.attachments.find(a => a.id === pt.placement!.documentId)?.name} · strona ${pt.placement.page}` : "Pozycja na rzucie: do ustalenia"];
    let my = top + 9 + device.length * 5;
    for (const line of meta) { const lines = doc.splitTextToSize(line, 124); doc.text(lines, 66, my); my += lines.length * 4 + 2; }
    y = Math.max(top + 37, my + 3);
    table([`${pt.code} · Klawisz / opis`, "Naciśnięcie", "Obwód / scena i działanie"], pt.bindings.flatMap((binding, index) => {
      const name = `${index + 1}${binding.label ? ` · ${binding.label}` : ""}`;
      const rows = [[name, "Krótkie", `${lookup.get(binding.target) ?? "Do ustalenia"}\n${binding.action}${binding.notes ? `\n${binding.notes}` : ""}`]];
      if (binding.hold) rows.push([name, "Długie", `${lookup.get(binding.hold.target) ?? "Do ustalenia"}\n${binding.hold.action}`]);
      return rows;
    }), true);
    if (pt.notes) text(pt.notes, 8);
  }
  if (!p.points.length) text("Punkty sterowania do ustalenia.");
  if (y > 110) page();
  title("Zestawienie funkcji pomieszczeń");
  for (const r of p.rooms.filter((r) => r.circuits.length || r.notes)) {
    title(`${r.name} · ${r.floor}`);
    table(
      ["Obwód", "Zakres / sterowanie", "Priorytet", "Parametry"],
      r.circuits.map((c) => [
        c.name,
        `${c.kind}\n${c.control}`,
        c.priority,
        c.spec || "Do ustalenia",
      ]),
    );
    if (r.notes) text(r.notes, 8);
  }
  page();
  title("Sceny i scenariusze");
  for (let row = 0; row < Math.ceil(p.scenes.length / 5); row++) {
    ensure(27);
    for (let col = 0; col < 5; col++) {
      const scene = p.scenes[row * 5 + col];
      if (!scene) break;
      const x = 18 + col * 35;
      doc.addImage(await sceneIcon(scene.icon), "PNG", x + 10, y, 10, 10);
      doc.setFont("Noto", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor("#536d78");
      doc.text(doc.splitTextToSize(scene.name, 32), x + 15, y + 15, {
        align: "center",
      });
    }
    y += 27;
  }
  table(
    ["Scena / uruchamianie", "Działania, warunki i wyjątki"],
    p.scenes.map((s) => [
      `${s.name} · ${s.area}\n${s.priority}\n${s.triggers.join(", ") || "Wyzwalanie do ustalenia"}`,
      [
        s.actions.length
          ? s.actions
              .map(
                (b) => `${lookup.get(b.target) ?? "Do ustalenia"}: ${b.action}`,
              )
              .join("\n")
          : "Działania do ustalenia",
        s.exception ? "Ręczne sterowanie ma pierwszeństwo." : "",
        s.notes,
      ]
        .filter(Boolean)
        .join("\n"),
    ]),
  );
  title("Integracje");
  table(
    ["System", "Model / interfejs", "Oczekiwane działanie"],
    p.integrations
      .filter((i) => i.enabled)
      .map((i) => [
        i.name,
        i.model || "Do ustalenia",
        i.notes || "Do ustalenia",
      ]),
  );
  title("Otwarte ustalenia");
  table(
    ["Lp.", "Do uzgodnienia"],
    issues(p).map((v, i) => [i + 1, v]),
    true,
  );
  if (p.attachments.length) {
    title("Załączniki");
    table(
      ["Dokument", "Rozmiar"],
      p.attachments.map((a) => [
        a.name,
        `${(a.size / 1024 / 1024).toFixed(1)} MB`,
      ]),
    );
  }
  for (let n = 1; n <= doc.getNumberOfPages(); n++) {
    doc.setPage(n);
    doc.setFont("Noto", "normal");
    doc.setFontSize(6.3);
    doc.setTextColor("#7a8991");
    doc.text(
      "Brief do konsultacji i wyceny. Nie zastępuje projektu wykonawczego. Dobór urządzeń wymaga potwierdzenia.",
      18,
      277,
    );
    doc.setDrawColor("#dce4e9");
    doc.line(18, 282, 192, 282);
    doc.setFontSize(7);
    doc.text(
      `InteliSpaces · ${new Date().toLocaleDateString("pl-PL")}`,
      18,
      288,
    );
    doc.text(`Brief ${n} / ${doc.getNumberOfPages()}`, 192, 288, { align: "right" });
  }
  return appendPlans(doc.output("blob"), p);
}
export async function buildXlsx(p: Project): Promise<Blob> {
  const { default: ExcelJS } = await import("exceljs");
  const book = new ExcelJS.Workbook();
  book.creator = "InteliSpaces";
  book.created = new Date();
  const lookup = new Map(targets(p).map((t) => [t.id, t.label]));
  const sheet = (
    name: string,
    head: string[],
    rows: (string | number | null)[][],
  ) => {
    const s = book.addWorksheet(name, {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    s.addRow(head);
    rows.forEach((r) => s.addRow(r));
    s.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    s.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF07869B" },
    };
    s.getRow(1).height = 25;
    s.columns.forEach((c, i) => {
      c.width = i === 0 ? 27 : 38;
      c.alignment = { vertical: "top", wrapText: true };
    });
    s.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: Math.max(1, rows.length + 1), column: head.length },
    };
  };
  sheet(
    "Inwestycja",
    ["Pole", "Wartość"],
    [
      ["Projekt", p.name],
      ["Pracownia", p.studio],
      ["Kontakt", p.contact],
      ["E-mail", p.email],
      ["Miejscowość", p.city],
      ["Typ", p.type],
      ["Powierzchnia m²", p.area],
      ["Etap", p.stage],
      ["Uruchomienie", p.date || "Do ustalenia"],
      ["Budżet", p.budget],
      ["Priorytet", p.priority],
      ["Zakres", p.scope.join(", ")],
      ["Aktory", "JUNG - dobór do potwierdzenia"],
      ["Uwagi", p.notes],
      ["Wersja", p.revision],
    ],
  );
  sheet(
    "Pomieszczenia",
    ["Pomieszczenie", "Kondygnacja", "Powierzchnia m²", "Uwagi"],
    p.rooms.map((r) => [r.name, r.floor, r.area, r.notes]),
  );
  sheet(
    "Obwody",
    [
      "Pomieszczenie",
      "Nazwa",
      "Kategoria",
      "Sterowanie",
      "Priorytet",
      "Parametry",
    ],
    p.rooms.flatMap((r) =>
      r.circuits.map((c) => [
        r.name,
        c.name,
        c.kind,
        c.control,
        c.priority,
        c.spec || "Do ustalenia",
      ]),
    ),
  );
  sheet(
    "Sterowanie",
    [
      "Pomieszczenie",
      "Punkt",
      "Sensor",
      "Wykończenie",
      "Wysokość cm",
      "Status",
      "Pole",
      "Element",
      "Funkcja",
      "Uwagi",
    ],
    p.points.flatMap((pt) =>
      pt.bindings.flatMap((b, i) => [
        [
        p.rooms.find((r) => r.id === pt.roomId)?.name ?? "",
        `${pt.code} · ${pt.name}`,
        pt.model || pt.sensor,
        pt.finish,
        pt.height,
        pt.status,
        `${i + 1} · ${b.label || "Krótkie naciśnięcie"}`,
        lookup.get(b.target) ?? "Do ustalenia",
        b.action,
        [pt.notes, b.notes || "", pt.placement ? `Rzut: ${p.attachments.find(a => a.id === pt.placement!.documentId)?.name}, str. ${pt.placement.page}, x=${pt.placement.x.toFixed(4)}, y=${pt.placement.y.toFixed(4)}` : "Bez pozycji na rzucie"].join("\n"),
        ],
        ...(b.hold ? [[p.rooms.find(r => r.id === pt.roomId)?.name ?? "", `${pt.code} · ${pt.name}`, pt.model || pt.sensor, pt.finish, pt.height, pt.status, `${i + 1} · Długie naciśnięcie`, lookup.get(b.hold.target) ?? "Do ustalenia", b.hold.action, b.notes || ""]] : []),
      ]),
    ),
  );
  sheet(
    "Sceny",
    [
      "Scena",
      "Obszar",
      "Priorytet",
      "Uruchamianie",
      "Element",
      "Działanie",
      "Ręczne pierwszeństwo",
      "Warunki / uwagi",
    ],
    p.scenes.flatMap((s) =>
      (s.actions.length
        ? s.actions
        : [{ target: "", action: "Do ustalenia" }]
      ).map((b) => [
        s.name,
        s.area,
        s.priority,
        s.triggers.join(", ") || "Do ustalenia",
        lookup.get(b.target) ?? "Do ustalenia",
        b.action,
        s.exception ? "Tak" : "Nie",
        s.notes,
      ]),
    ),
  );
  sheet(
    "Integracje",
    ["System", "Model / interfejs", "Zakres"],
    p.integrations
      .filter((i) => i.enabled)
      .map((i) => [i.name, i.model || "Do ustalenia", i.notes]),
  );
  sheet(
    "Do ustalenia",
    ["Lp.", "Kwestia"],
    issues(p).map((s, i) => [i + 1, s]),
  );
  sheet(
    "Dokumenty",
    ["Nazwa", "Typ", "Rozmiar bajty"],
    p.attachments.map((a) => [a.name, a.mime, a.size]),
  );
  return new Blob([(await book.xlsx.writeBuffer()) as ArrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
