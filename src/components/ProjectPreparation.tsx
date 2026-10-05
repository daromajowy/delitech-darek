import { cmsText } from '../cms/content.ts';
import React from 'react';
import { ClipboardList } from 'lucide-react';

export function ProjectPreparation() {
  return <aside className="bg-[#EAF0E4] border border-[#0E4637]/15 rounded-2xl p-6 sm:p-7">
    <span className="font-mono text-xs font-semibold text-[#0E4637] uppercase tracking-wider flex items-center gap-2"><ClipboardList className="w-4 h-4" aria-hidden="true" />{cmsText("ProjectPreparation-befed8b7a4f6", "Przed pierwszą rozmową")}</span>
    <h2 className="text-xl font-bold font-display mt-3">{cmsText("ProjectPreparation-f7715470da57", "Dobry brief ułatwia dobrą wycenę.")}</h2>
    <p className="text-sm text-[#53635A] mt-2">{cmsText("ProjectPreparation-1907266f708c", "Nie musisz znać nazw urządzeń. Wystarczy opis tego, jak chcesz korzystać z przestrzeni.")}</p>
    <ol className="preparation-list space-y-4 mt-5 text-sm">
      <li><div><strong>{cmsText("ProjectPreparation-f4ec19bacd1a", "Rzut i etap inwestycji")}</strong><p className="text-[#53635A] mt-1">{cmsText("ProjectPreparation-dddb2487b7d1", "Układ pomieszczeń, lokalizacja i termin rozpoczęcia prac.")}</p></div></li>
      <li><div><strong>{cmsText("ProjectPreparation-a2159a4a55be", "Funkcje, na których Ci zależy")}</strong><p className="text-[#53635A] mt-1">{cmsText("ProjectPreparation-54a290e3a9be", "Światło, rolety, temperatura, sceny i dostęp z aplikacji.")}</p></div></li>
      <li><div><strong>{cmsText("ProjectPreparation-db2f43bbc180", "Urządzenia do połączenia")}</strong><p className="text-[#53635A] mt-1">{cmsText("ProjectPreparation-f4cbd958fc7a", "Znane modele HVAC, opraw, napędów i systemów AV.")}</p></div></li>
      <li><div><strong>{cmsText("ProjectPreparation-ba4d4950cc89", "Priorytety i budżet")}</strong><p className="text-[#53635A] mt-1">{cmsText("ProjectPreparation-39041bcb44e9", "Co jest potrzebne na start, a co można zostawić na kolejny etap.")}</p></div></li>
    </ol>
  </aside>;
}
