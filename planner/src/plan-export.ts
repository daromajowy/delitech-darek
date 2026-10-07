import { PDFDocument, PDFArray, PDFDict, PDFName, StandardFonts, degrees, rgb } from "pdf-lib";
import { documentBlob } from "./documents";
import { openPdf } from "./pdf";
import type { Project } from "./model";

export async function appendPlans(brief: Blob, project: Project): Promise<Blob> {
  const documents = new Set(project.points.flatMap(p => p.placement ? [p.placement.documentId] : []));
  if (project.planView) documents.add(project.planView.documentId);
  if (!documents.size) return brief;
  const result = await PDFDocument.load(await brief.arrayBuffer());
  const font = await result.embedFont(StandardFonts.HelveticaBold);
  for (const id of documents) {
    const data = await (await documentBlob(project.id, id)).arrayBuffer();
    const loading = openPdf(data.slice(0));
    try {
      const pdf = await loading.promise;
      if (pdf.numPages > 200) throw new Error('Rzut może mieć maksymalnie 200 stron.');
      const original = await PDFDocument.load(data);
      const copies = await result.copyPages(original, original.getPageIndices());
      for (let n = 0; n < copies.length; n++) {
        const copy = copies[n];
        // Preserve the vector drawing and inert annotations, never carry PDF actions into the brief.
        copy.node.delete(PDFName.of("AA"));
        const annotations = copy.node.lookup(PDFName.of("Annots"));
        if (annotations instanceof PDFArray) {
          for (let i = annotations.size() - 1; i >= 0; i--) {
            const annotation = annotations.lookup(i);
            if (!(annotation instanceof PDFDict)) { annotations.remove(i); continue; }
            const type = annotation.get(PDFName.of("Subtype"))?.toString();
            if (["/RichMedia", "/3D", "/FileAttachment", "/Movie", "/Sound", "/Widget"].includes(type ?? "")) { annotations.remove(i); continue; }
            annotation.delete(PDFName.of("A")); annotation.delete(PDFName.of("AA"));
          }
        }
        result.addPage(copy);
        const page = await pdf.getPage(n + 1), view = page.getViewport({ scale: 1 });
        const rotation = copy.getRotation().angle;
        const angle = rotation * Math.PI / 180;
        for (const point of project.points.filter(p => p.placement?.documentId === id && p.placement.page === n + 1)) {
          const pos = point.placement!, code = point.code || "P?";
          if (![pos.x, pos.y].every(v => Number.isFinite(v) && v >= 0 && v <= 1)) throw new Error(`Nieprawidłowa pozycja ${code}.`);
          const [x, y] = view.convertToPdfPoint(pos.x * view.width, pos.y * view.height);
          const width = Math.max(29, font.widthOfTextAtSize(code, 8) + 12), height = 17;
          const bx = x - width / 2 * Math.cos(angle) + height / 2 * Math.sin(angle);
          const by = y - width / 2 * Math.sin(angle) - height / 2 * Math.cos(angle);
          copy.drawRectangle({ x: bx, y: by, width, height, rotate: degrees(rotation), color: rgb(0.03, 0.5, 0.57), borderColor: rgb(1, 1, 1), borderWidth: 1 });
          copy.drawText(code, { x: bx + 6 * Math.cos(angle) - 5 * Math.sin(angle), y: by + 6 * Math.sin(angle) + 5 * Math.cos(angle), size: 8, font, rotate: degrees(rotation), color: rgb(1, 1, 1) });
        }
      }
      for (const p of project.points.filter(p => p.placement?.documentId === id)) if (p.placement!.page > pdf.numPages) throw new Error(`${p.code}: nieistniejąca strona PDF.`);
    } finally { await loading.destroy(); }
  }
  return new Blob([new Uint8Array(await result.save())], { type: "application/pdf" });
}
