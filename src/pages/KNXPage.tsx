import { cmsText } from '../cms';
import React from 'react';
import { PageId } from '../types.ts';
import {
  Cpu,
  Globe2,
  ShieldAlert,
  Clock,
  Layers,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface KNXPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}

export const KNXPage: React.FC<KNXPageProps> = ({ onNavigate, onOpenConsultation }) => {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-[#17211C] text-white py-16 lg:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6F15A] font-semibold block">{cmsText("knxpage.8715925982", "Międzynarodowy Standard ISO/IEC 14543")}</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white">{cmsText("knxpage.2b52234339", "Dlaczego standard KNX?")}</h1>
            <p className="text-base sm:text-lg text-[#EDE9DF]/80 leading-relaxed pt-2">{cmsText("knxpage.b51c3a7d3b", "W świecie technologii, w którym aplikacje znikają po kilku latach, a producenci zamykają swoje chmury, KNX jest jedynym otwartym standardem automatyki budynkowej z ponad 30-letnią nieprzerwaną historią i pełną kompatybilnością wsteczną.")}</p>
          </div>
        </div>
      </section>

      {/* 4 Pillars of KNX */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#17211C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl font-bold font-display text-[#17211C]">{cmsText("knxpage.fb189e8b57", "Fundamenty niezawodności")}</h2>
            <p className="text-sm text-[#17211C]/70 mt-2">{cmsText("knxpage.ac7944cf9a", "Dlaczego architekci, inwestorzy instytucjonalni i właściciele rezydencji wybierają instalację przewodową KNX zamiast gadżetów bezprzewodowych.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 space-y-3">
              <Globe2 className="w-8 h-8 text-[#0E4637]" />
              <h3 className="font-bold font-display text-base text-[#17211C]">{cmsText("knxpage.c4af71c720", "Brak uzależnienia (Zero Vendor Lock-in)")}</h3>
              <p className="text-xs text-[#17211C]/75 leading-relaxed">{cmsText("knxpage.d92a956157", "Ponad 500 certyfikowanych producentów na świecie tworzy urządzenia posługujące się tym samym językiem. Możesz łączyć włączniki JUNG, sensory Theben i bramki ABB w jednej instalacji.")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 space-y-3">
              <Clock className="w-8 h-8 text-[#0E4637]" />
              <h3 className="font-bold font-display text-base text-[#17211C]">{cmsText("knxpage.ddebe29b52", "Trwałość na dekady")}</h3>
              <p className="text-xs text-[#17211C]/75 leading-relaxed">{cmsText("knxpage.b384ae761b", "Urządzenie wyprodukowane w 1995 roku bez problemu komunikuje się z nowoczesnym serwerem KNX IoT z 2026 roku. Instalacja nie starzeje się moralnie ani technologicznie.")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 space-y-3">
              <ShieldAlert className="w-8 h-8 text-[#0E4637]" />
              <h3 className="font-bold font-display text-base text-[#17211C]">{cmsText("knxpage.9c2cf353fd", "Magistrala przewodowa (Twisted Pair)")}</h3>
              <p className="text-xs text-[#17211C]/75 leading-relaxed">{cmsText("knxpage.10961389de", "Odporna na zakłócenia radiowe, grube stropy żelbetowe i brak Internetu. Sygnały sterujące podróżują bezpiecznym, ekranowanym kablem magistralnym o napięciu bezpiecznym SELV (30V).")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 space-y-3">
              <Wrench className="w-8 h-8 text-[#0E4637]" />
              <h3 className="font-bold font-display text-base text-[#17211C]">{cmsText("knxpage.1459012e35", "Zdecentralizowana logika")}</h3>
              <p className="text-xs text-[#17211C]/75 leading-relaxed">{cmsText("knxpage.2de624843f", "W standardzie KNX nie ma pojedynczego „mózgu”, którego awaria paraliżuje cały budynek. Każdy sensor i aktor posiada własny mikroprocesor.")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Biuro vs Dom */}
      <section className="py-16 sm:py-24 bg-[#F7F8F5] border-b border-[#17211C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText("knxpage.6e48653b24", "Dwa zastosowania tego samego standardu")}</span>
            <h2 className="text-3xl font-bold font-display text-[#17211C]">{cmsText("knxpage.1358369e82", "KNX w biurze a KNX w domu")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-[#17211C]/10 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#0E4637] font-semibold">{cmsText("knxpage.c8f0159815", "Zastosowanie komercyjne")}</span>
              <h3 className="text-xl font-bold font-display text-[#17211C]">{cmsText("knxpage.876c3606d7", "KNX w Biurze")}</h3>
              <ul className="text-xs space-y-2.5 text-[#17211C]/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E4637] shrink-0 mt-0.5" />
                  <span>{cmsText("knxpage.229ae2dafc", "Obniżenie kosztów eksploatacji (OPEX) przez inteligentne sterowanie oświetleniem i HVAC")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E4637] shrink-0 mt-0.5" />
                  <span>{cmsText("knxpage.6e1774c665", "Łatwa rearanżacja przestrzeni fit-out bez prucia ścian — zmiana przypisania opraw w oprogramowaniu ETS")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E4637] shrink-0 mt-0.5" />
                  <span>{cmsText("knxpage.ae240c819a", "Integracja z nadrzędnym systemem zarządzania budynkiem BMS obiektu biurowego")}</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-[#17211C]/10 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#0E4637] font-semibold">{cmsText("knxpage.a6a3bfb777", "Zastosowanie prywatne")}</span>
              <h3 className="text-xl font-bold font-display text-[#17211C]">{cmsText("knxpage.dd89ceb153", "KNX w Domu i Rezydencji")}</h3>
              <ul className="text-xs space-y-2.5 text-[#17211C]/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E4637] shrink-0 mt-0.5" />
                  <span>{cmsText("knxpage.f78dbc6267", "Bezpieczeństwo rodziny: brak kamer i urządzeń sterujących uzależnionych od chmur obcych korporacji")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E4637] shrink-0 mt-0.5" />
                  <span>{cmsText("knxpage.518b68fa93", "Cisza i dyskrecja: ciche napędy zasłon, brak piszczących zasilaczy i niewidoczne sensory obecności")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E4637] shrink-0 mt-0.5" />
                  <span>{cmsText("knxpage.342d951d5a", "Wzrost wartości rynkowej nieruchomości przy ewentualnej odsprzedaży")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Serwis i rozbudowa */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-2xl bg-[#17211C] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <h3 className="text-2xl font-bold font-display text-white">{cmsText("knxpage.778e18e6a9", "Masz już instalację KNX wymagającą serwisu lub rozbudowy?")}</h3>
              <p className="text-xs sm:text-sm text-[#EDE9DF]/75 leading-relaxed">{cmsText("knxpage.d862e15b86", "Przejmujemy opiekę nad istniejącymi instalacjami w Warszawie i Polsce. Odtwarzamy projekty ETS, wymieniamy uszkodzone komponenty i dopasowujemy sceny do nowych potrzeb użytkowników.")}</p>
            </div>
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3 bg-[#E6F15A] hover:bg-white text-[#0E4637] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap"
            >{cmsText("knxpage.5f4fca5234", "Zleć audyt lub serwis KNX")}</button>
          </div>
        </div>
      </section>
    </div>
  );
};
