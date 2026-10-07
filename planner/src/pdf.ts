import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import worker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = worker;

export function openPdf(data: ArrayBuffer) {
  return getDocument({ data, useWasm: false, enableXfa: false,
    cMapUrl: new URL("pdf-assets/cmaps/", document.baseURI).href,
    cMapPacked: true,
    standardFontDataUrl: new URL("pdf-assets/standard_fonts/", document.baseURI).href,
  });
}
