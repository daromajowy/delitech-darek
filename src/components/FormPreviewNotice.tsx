import { cmsText } from '../cms/content.ts';
import React from 'react';
import { Info } from 'lucide-react';

export function FormPreviewNotice() {
  return <div role="note" className="flex items-start gap-2 rounded-xl border border-[#0E4637]/15 bg-[#EAF0E4] p-3 text-xs text-[#244D38]">
    <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
    <p><strong>{cmsText("FormPreviewNotice-5b6eab30ef19", "Podgląd formularza.")}</strong>{cmsText("FormPreviewNotice-dbadf872c216", " W tej wersji możesz zobaczyć układ pól. Wysyłka zapytań i rezerwacja konsultacji nie są jeszcze dostępne.")}</p>
  </div>;
}
