import { cmsText } from '../cms';
import React, { useState } from 'react';
import { PageId } from '../types.ts';
import { ContactForm } from '../components/ContactForm.tsx';
import { HeroVideo } from '../components/HeroVideo.tsx';
import { IMAGES } from '../assets.ts';
import {
  ArrowRight,
  Sliders,
  SunMedium,
  Layers,
  Zap,
  Cpu,
  Shield,
  FileCheck2,
  Compass,
  Hammer,
  Sparkles,
  ChevronRight,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
  onOpenPrivacy: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenConsultation,
  onOpenPrivacy,
}) => {
  const [activeHeroNode, setActiveHeroNode] = useState<string>('light');

  // Interactive architectural nodes for the Hero visual
  const heroNodes = [
    {
      id: 'light',
      label: cmsText("homepage.2f1699dec0", "DALI Tunable White"),
      desc: cmsText("homepage.16a8ef01fd", "Adaptacja do rytmu dobowego i światła dziennego"),
      coords: 'left-[32%] top-[38%]',
    },
    {
      id: 'hvac',
      label: cmsText("homepage.a92b47d1b8", "Strefowa klimatyzacja VAV"),
      desc: cmsText("homepage.85b9908438", "Komfort temperaturowy bez przeciągów i strat energii"),
      coords: 'left-[64%] top-[24%]',
    },
    {
      id: 'presence',
      label: cmsText("homepage.2eaab4f892", "Detekcja obecności multisensor"),
      desc: cmsText("homepage.e8c4444f15", "Pomiary CO2, wilgotności, automatyczny tryb po godzinach"),
      coords: 'left-[78%] top-[62%]',
    },
    {
      id: 'jung',
      label: cmsText("homepage.939ebf6b6d", "Osprzęt JUNG LS 990"),
      desc: cmsText("homepage.51c831b625", "Dotykowa precyzja i spójny detal architektoniczny"),
      coords: 'left-[22%] top-[72%]',
    },
  ];

  return (
    <div className="space-y-0">
      <HeroVideo />

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F7F8F5] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#17211C]/10">
        {/* Subtle architectural grid pattern background */}
        <div className="absolute inset-0 bg-grid-subtle opacity-70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E4637]/10 text-[#0E4637] rounded-md text-xs font-mono tracking-tight font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E4637]" />
                <span>{cmsText("homepage.3462bedb7f", "Integrator Automatyki Budynkowej KNX")}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-[#17211C] tracking-tight leading-[1.08] text-balance">{cmsText("homepage.9b55d51504", "Przestrzenie, które myślą razem z Tobą.")}</h1>

              <p className="text-base sm:text-lg text-[#17211C]/80 leading-relaxed max-w-2xl">{cmsText("homepage.25119f04ac", "Projektujemy, wykonujemy i uruchamiamy automatykę KNX dla nowoczesnych biur, domów i apartamentów. Łączymy komfort użytkownika, energię pod kontrolą i dopracowany detal wnętrza.")}</p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                {/* Primary CTA */}
                <button
                  onClick={onOpenConsultation}
                  className="px-6 py-3.5 bg-[#0E4637] hover:bg-[#17211C] text-[#E6F15A] font-semibold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm group"
                >
                  <span>{cmsText("homepage.35a2cf2a21", "Porozmawiajmy o projekcie")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={() => onNavigate('offices')}
                  className="px-6 py-3.5 bg-white hover:bg-[#EDE9DF]/60 text-[#0E4637] font-semibold text-xs uppercase tracking-wider border border-[#0E4637]/25 rounded-lg transition-all duration-200 text-center"
                >{cmsText("homepage.a4838b1d1b", "Poznaj automatykę biura")}</button>
              </div>

              {/* Trust signals & context */}
              <div className="pt-6 border-t border-[#17211C]/10 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#17211C]/70">
                <span className="font-medium text-[#17211C]">{cmsText("homepage.1904de0616", "Warszawa & cała Polska")}</span>
                <span aria-hidden="true" className="text-[#17211C]/30">·</span>
                <span>{cmsText("homepage.dad65ef95f", "Standard KNX bez vendor-lock")}</span>
                <span aria-hidden="true" className="text-[#17211C]/30">·</span>
                <span>{cmsText("homepage.0fe33a052f", "Współpraca z pracowniami architektonicznymi i fit-out")}</span>
              </div>
            </div>

            {/* Right Visual Column (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#17211C]/15 bg-[#17211C] aspect-[16/11]">
                <img
                  src={IMAGES.heroDelitechArch}
                  alt={cmsText("homepage.0b367f55fe", "Nowoczesna przestrzeń biurowa z inteligentną automatyką KNX")}
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#17211C]/90 via-[#17211C]/30 to-transparent pointer-events-none" />

                {/* Abstract KNX network overlay nodes */}
                {heroNodes.map((node) => {
                  const isActive = activeHeroNode === node.id;
                  return (
                    <div
                      key={node.id}
                      className={`absolute ${node.coords} -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20`}
                      onClick={() => setActiveHeroNode(node.id)}
                    >
                      <span className="relative flex h-5 w-5 items-center justify-center">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isActive ? 'bg-[#E6F15A]' : 'bg-[#CFE3C4]'
                          }`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-3 w-3 ${
                            isActive ? 'bg-[#E6F15A] ring-2 ring-[#0E4637]' : 'bg-white'
                          }`}
                        />
                      </span>
                    </div>
                  );
                })}

                {/* Active node interactive card */}
                <div className="absolute bottom-3 left-3 right-3 p-3.5 bg-[#17211C]/90 backdrop-blur-md border border-white/15 rounded-xl text-white text-xs z-30 transition-all">
                  {heroNodes
                    .filter((n) => n.id === activeHeroNode)
                    .map((node) => (
                      <div key={node.id} className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#E6F15A] uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E6F15A]" />
                            <span>{cmsText("homepage.8fa135e523", "Aktywny punkt magistrali KNX")}</span>
                          </div>
                          <p className="font-bold text-sm text-white mt-0.5">{node.label}</p>
                          <p className="text-[11px] text-[#EDE9DF]/75 mt-0.5 leading-snug">
                            {node.desc}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-[#CFE3C4]/60 shrink-0">
                          0{heroNodes.findIndex((n) => n.id === activeHeroNode) + 1} / 04
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-2 text-right">
                <span className="text-[11px] text-[#17211C]/60 font-mono">{cmsText("homepage.a791f7a2b7", "Wizualizacja architektury systemu KNX w przestrzeni")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEKCJA POZYCJONUJĄCA */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#17211C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-3">{cmsText("homepage.c40d0689f1", "Filozofia integracji")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#17211C] tracking-tight text-balance">{cmsText("homepage.ae78b66d90", "Technologia, która nie dominuje wnętrza.")}</h2>
            <p className="mt-4 text-base sm:text-lg text-[#17211C]/80 leading-relaxed">{cmsText("homepage.c38a082e87", "Dobry system automatyki działa dyskretnie. Odpowiada na obecność, światło dzienne, porę dnia i sposób korzystania z przestrzeni — bez uzależnienia od jednej aplikacji lub producenta.")}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Wyróżnik 1 */}
            <div className="p-8 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 relative group hover:border-[#0E4637]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#0E4637] text-[#E6F15A] flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#17211C] mb-3">{cmsText("homepage.c139d5b709", "KNX — otwarty standard automatyki budynkowej")}</h3>
              <p className="text-sm text-[#17211C]/75 leading-relaxed">{cmsText("homepage.b48979b721", "Ponad 500 certyfikowanych producentów na świecie (m.in. JUNG, Gira, Theben, ABB, Schneider) tworzy urządzenia komunikujące się jedną magistralą przewodową. Twoja inwestycja nie jest uzależniona od chmury jednego dostawcy ani zamkniętych ekosystemów konsumenckich.")}</p>
              <div className="mt-6 pt-4 border-t border-[#17211C]/10 flex items-center gap-2 text-xs font-semibold text-[#0E4637]">
                <span>{cmsText("homepage.8432a9cf14", "Niezawodność instalacji przewodowej")}</span>
                <span aria-hidden="true">·</span>
                <span>{cmsText("homepage.55898caf1b", "30+ lat wsparcia standardu")}</span>
              </div>
            </div>

            {/* Wyróżnik 2 */}
            <div className="p-8 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 relative group hover:border-[#0E4637]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#0E4637] text-[#E6F15A] flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#17211C] mb-3">{cmsText("homepage.fd31f3421a", "Jeden zespół — od koncepcji funkcji po odbiór i szkolenie")}</h3>
              <p className="text-sm text-[#17211C]/75 leading-relaxed">{cmsText("homepage.460707a4b3", "Nie jesteśmy tylko programistami ani zwykłymi instalatorami. Doradzamy architektom na etapie rzutów, przygotowujemy wytyczne dla branży elektrycznej, kompletujemy rozdzielnice, uruchamiamy system i szkolimy użytkowników lub zarządcę budynku.")}</p>
              <div className="mt-6 pt-4 border-t border-[#17211C]/10 flex items-center gap-2 text-xs font-semibold text-[#0E4637]">
                <span>{cmsText("homepage.6fa9698a26", "Pełna koordynacja międzybranżowa")}</span>
                <span aria-hidden="true">·</span>
                <span>{cmsText("homepage.93b8dc7f32", "Jeden partner odpowiedzialny za efekt")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DWIE SPECJALIZACJE: BIURA (PIERWSZA I MOCNIEJSZA) ORAZ DOMY */}
      <section className="py-16 sm:py-24 bg-[#F7F8F5] border-b border-[#17211C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText("homepage.b8c5a3cd52", "Dwa kluczowe filary")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#17211C]">{cmsText("homepage.64b8d058a2", "Dedykowane rozwiązania dla różnych typów przestrzeni")}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Karta 1: Biura i fit-out (Pierwsza i mocniejsza - 7 cols) */}
            <div className="lg:col-span-7 bg-[#17211C] text-white rounded-2xl p-8 sm:p-10 border border-white/10 flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#0E4637]/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#0E4637] text-[#E6F15A] text-xs font-mono font-semibold uppercase tracking-wider rounded border border-[#CFE3C4]/20">{cmsText("homepage.e4cbff59a7", "Specjalizacja priorytetowa")}</span>
                  <span className="text-xs text-[#EDE9DF]/60 font-mono">{cmsText("homepage.0da4278ba4", "B2B & Fit-out")}</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">{cmsText("homepage.dabd722c6d", "Biura i fit-out")}</h3>
                  <p className="text-lg text-[#E6F15A] font-medium mt-1 font-display">{cmsText("homepage.882e99b51f", "„Biuro, które wspiera zespół — od recepcji po salę spotkań.”")}</p>
                </div>

                <p className="text-sm text-[#EDE9DF]/80 leading-relaxed">{cmsText("homepage.c07addb313", "Automatyzujemy nowoczesne środowiska pracy: open space, gabinety zarządu, sale konferencyjne i strefy relaksu. Zapewniamy precyzyjne sterowanie oświetleniem DALI z czujnikami natężenia światła dziennego, zintegrowane żaluzje fasadowe, harmonogramy HVAC, automatyczne sceny prezentacji oraz bezpieczny tryb po godzinach redukujący koszty energii.")}</p>

                {/* Sub-features list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#EDE9DF]/85">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E6F15A]" />
                    <span>{cmsText("homepage.767e5364eb", "Sceny prezentacji jednym dotknięciem")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E6F15A]" />
                    <span>{cmsText("homepage.6ea05280a2", "DALI Tunable White dla skupienia")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E6F15A]" />
                    <span>{cmsText("homepage.0257d9a789", "Automatyczny tryb uśpienia po 18:00")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E6F15A]" />
                    <span>{cmsText("homepage.7173f9ef89", "Optymalizacja parametrów ESG / LEED")}</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button
                  onClick={() => onNavigate('offices')}
                  className="px-5 py-3 bg-[#E6F15A] hover:bg-white text-[#0E4637] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>{cmsText("homepage.d4b3b6ea39", "Zobacz rozwiązania dla biur")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenConsultation}
                  className="text-xs font-semibold text-[#CFE3C4] hover:text-white underline underline-offset-4"
                >{cmsText("homepage.1afe0ca696", "Skonsultuj projekt fit-out")}</button>
              </div>
            </div>

            {/* Karta 2: Domy i apartamenty (5 cols) */}
            <div className="lg:col-span-5 bg-white text-[#17211C] rounded-2xl p-8 sm:p-10 border border-[#17211C]/10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#F7F8F5] text-[#0E4637] text-xs font-mono font-semibold uppercase tracking-wider rounded border border-[#17211C]/10">{cmsText("homepage.e3da75daec", "Smart Home Premium")}</span>
                  <span className="text-xs text-[#17211C]/50 font-mono">{cmsText("homepage.c414450e8e", "Domy & Apartamenty")}</span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-display text-[#17211C] tracking-tight">{cmsText("homepage.2916811652", "Domy i apartamenty")}</h3>
                  <p className="text-base text-[#0E4637] font-semibold mt-1 font-display">{cmsText("homepage.67f1a140de", "„Komfort od pierwszego dotknięcia.”")}</p>
                </div>

                <p className="text-sm text-[#17211C]/75 leading-relaxed">{cmsText("homepage.561841b872", "Dla rezydencji i apartamentów tworzymy systemy, które eliminują baterie przełączników ze ścian na rzecz minimalistycznych paneli dotykowych i dopracowanych scen światła, temperatury oraz prywatności.")}</p>

                <div className="space-y-2 pt-2 text-xs text-[#17211C]/85">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E4637]" />
                    <span>{cmsText("homepage.11d803a24b", "Sceny: Poranek, Kolacja, Kino, Wyjście z domu")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E4637]" />
                    <span>{cmsText("homepage.e65da4e5db", "Integracja klimatyzacji, podłogówki i rekuperacji")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E4637]" />
                    <span>{cmsText("homepage.ccfe10b380", "Sterowanie żaluzjami i zasłonami elektrycznymi")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E4637]" />
                    <span>{cmsText("homepage.51dc3c27c8", "Designerski osprzęt JUNG zlicowany ze ścianą")}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-[#17211C]/10 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('homes')}
                  className="px-5 py-3 bg-[#0E4637] hover:bg-[#17211C] text-[#E6F15A] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>{cmsText("homepage.72dc4177d6", "Poznaj smart home")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CO AUTOMATYZUJEMY (ESTETYCZNE KAFLE Z PROSTĄ IKONĄ I OPISEM) */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#17211C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText("homepage.d25f0f3b25", "Moduły funkcjonalne")}</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#17211C]">{cmsText("homepage.082fdff4b0", "Co automatyzujemy w obiekcie")}</h2>
            </div>
            <p className="text-sm text-[#17211C]/70 max-w-md">{cmsText("homepage.5a6045186c", "Każdy podsystem łączymy w spójny organizm. Wszystkie elementy komunikują się jedną magistralą KNX bez konfliktów i powielania czujników.")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Światło i DALI */}
            <div
              onClick={() => onNavigate('solutions', 'dali')}
              className="p-7 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 hover:border-[#0E4637] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0E4637]/10 group-hover:bg-[#0E4637] text-[#0E4637] group-hover:text-[#E6F15A] flex items-center justify-center mb-5 transition-colors">
                  <SunMedium className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#17211C] mb-2">{cmsText("homepage.7987e2a20a", "Światło i DALI")}</h3>
                <p className="text-xs text-[#17211C]/75 leading-relaxed">{cmsText("homepage.c6656c6fad", "Płynne ściemnianie, regulacja temperatury barwowej (Tunable White), automatyczne dopasowanie do światła dziennego i sceny oświetleniowe bez migotania.")}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#17211C]/10 flex items-center justify-between text-xs font-semibold text-[#0E4637]">
                <span>{cmsText("homepage.cd3b077df2", "DALI-2 / Bramki KNX")}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. Rolety i fasady */}
            <div
              onClick={() => onNavigate('solutions', 'fasady')}
              className="p-7 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 hover:border-[#0E4637] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0E4637]/10 group-hover:bg-[#0E4637] text-[#0E4637] group-hover:text-[#E6F15A] flex items-center justify-center mb-5 transition-colors">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#17211C] mb-2">{cmsText("homepage.f38505617b", "Rolety i fasady")}</h3>
                <p className="text-xs text-[#17211C]/75 leading-relaxed">{cmsText("homepage.97d3468f1d", "Śledzenie pozycji słońca (Sun Tracking), ochrona przed przegrzewaniem wnętrza latem, automatyczne żaluzje fasadowe, rolety zip screen oraz ciche karnisze elektryczne.")}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#17211C]/10 flex items-center justify-between text-xs font-semibold text-[#0E4637]">
                <span>{cmsText("homepage.163c4eb362", "Ochrona termiczna budynku")}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. Ogrzewanie i HVAC */}
            <div
              onClick={() => onNavigate('solutions', 'hvac')}
              className="p-7 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 hover:border-[#0E4637] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0E4637]/10 group-hover:bg-[#0E4637] text-[#0E4637] group-hover:text-[#E6F15A] flex items-center justify-center mb-5 transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#17211C] mb-2">{cmsText("homepage.b61c00e265", "Ogrzewanie i HVAC")}</h3>
                <p className="text-xs text-[#17211C]/75 leading-relaxed">{cmsText("homepage.a1d04d3deb", "Koordynacja klimatyzacji kanałowej, ogrzewania podłogowego, grzejników i wentylacji mechanicznej. Koniec z jednoczesnym grzaniem i chłodzeniem tej samej strefy.")}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#17211C]/10 flex items-center justify-between text-xs font-semibold text-[#0E4637]">
                <span>{cmsText("homepage.45259d0702", "Brak walki systemów")}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. Sceny pracy */}
            <div
              onClick={() => onNavigate('solutions', 'sceny')}
              className="p-7 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 hover:border-[#0E4637] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0E4637]/10 group-hover:bg-[#0E4637] text-[#0E4637] group-hover:text-[#E6F15A] flex items-center justify-center mb-5 transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#17211C] mb-2">{cmsText("homepage.ce97413661", "Sceny pracy i życia")}</h3>
                <p className="text-xs text-[#17211C]/75 leading-relaxed">{cmsText("homepage.9fab2ed690", "Jedno dotknięcie klawisza lub harmonogram przestawia całą przestrzeń: sala spotkań przygotowuje się do wideokonferencji, a biuro po 18:00 wygasza nieużywane sekcje.")}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#17211C]/10 flex items-center justify-between text-xs font-semibold text-[#0E4637]">
                <span>{cmsText("homepage.a7706ec8f8", "Intuicyjna zmiana nastroju")}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 5. Energia */}
            <div
              onClick={() => onNavigate('solutions', 'energia')}
              className="p-7 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 hover:border-[#0E4637] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0E4637]/10 group-hover:bg-[#0E4637] text-[#0E4637] group-hover:text-[#E6F15A] flex items-center justify-center mb-5 transition-colors">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#17211C] mb-2">{cmsText("homepage.6eda6f9fe7", "Energia i pomiary")}</h3>
                <p className="text-xs text-[#17211C]/75 leading-relaxed">{cmsText("homepage.38071d2ada", "Podlicznikowanie obwodów, raporty zużycia dla zarządcy lub najemcy, zarządzanie mocą szczytową (Peak Shaving) oraz integracja z magazynami energii i fotowoltaiką.")}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#17211C]/10 flex items-center justify-between text-xs font-semibold text-[#0E4637]">
                <span>{cmsText("homepage.971084f425", "Certyfikacja BREEAM / LEED")}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 6. Integracje */}
            <div
              onClick={() => onNavigate('solutions', 'integracje')}
              className="p-7 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 hover:border-[#0E4637] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0E4637]/10 group-hover:bg-[#0E4637] text-[#0E4637] group-hover:text-[#E6F15A] flex items-center justify-center mb-5 transition-colors">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#17211C] mb-2">{cmsText("homepage.b8bd1c3c70", "Integracje systemowe")}</h3>
                <p className="text-xs text-[#17211C]/75 leading-relaxed">{cmsText("homepage.a71daf25e8", "Połączenie z systemami rezerwacji sal, nadrzędnym BMS obiektu (BACnet/Modbus), systemami nagłośnienia multiroom, stacjami ładowania EV oraz asystentami.")}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#17211C]/10 flex items-center justify-between text-xs font-semibold text-[#0E4637]">
                <span>{cmsText("homepage.eb869f0fda", "Otwarta architektura IP")}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SEKCJA PROCESU */}
      <section className="py-16 sm:py-24 bg-[#17211C] text-white border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6F15A] font-semibold block mb-2">{cmsText("homepage.126c6d61b5", "Przewidywalność & Standard inżynierski")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">{cmsText("homepage.f22eeb99dc", "Od rzutów do przestrzeni gotowej do działania.")}</h2>
            <p className="text-sm sm:text-base text-[#EDE9DF]/75 mt-3 leading-relaxed">{cmsText("homepage.d436da5c04", "Realizujemy automatykę w transparentnym, 5-etapowym procesie. Wiemy, jak rozmawiać z architektem, generalnym wykonawcą i instalatorem elektrycznym.")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* 01. Rozmowa */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-mono font-bold text-[#E6F15A] block mb-3">01.</span>
                <h3 className="text-base font-bold font-display text-white mb-2">{cmsText("homepage.258a0fb35b", "Rozmowa — brief funkcjonalny")}</h3>
                <p className="text-xs text-[#EDE9DF]/70 leading-relaxed">{cmsText("homepage.5a3c4b6189", "Ustalamy cele inwestycji, styl pracy biura lub domowników, budżet i oczekiwany stopień automatyzacji.")}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-mono text-[#CFE3C4]">{cmsText("homepage.4ee6c94d17", "Efekt: Założenia do projektu")}</div>
            </div>

            {/* 02. Koncepcja */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-mono font-bold text-[#E6F15A] block mb-3">02.</span>
                <h3 className="text-base font-bold font-display text-white mb-2">{cmsText("homepage.f261f8bc42", "Koncepcja — scenariusze")}</h3>
                <p className="text-xs text-[#EDE9DF]/70 leading-relaxed">{cmsText("homepage.c694dda269", "Definiujemy matrycę sterowania: jak przestrzeń reaguje na czujniki, pory dnia, rano, wieczór i stany alarmowe.")}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-mono text-[#CFE3C4]">{cmsText("homepage.b4c3317a26", "Efekt: Matryca funkcji stref")}</div>
            </div>

            {/* 03. Projekt */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-mono font-bold text-[#E6F15A] block mb-3">03.</span>
                <h3 className="text-base font-bold font-display text-white mb-2">{cmsText("homepage.cf9074cbd9", "Projekt — dokumentacja i koordynacja")}</h3>
                <p className="text-xs text-[#EDE9DF]/70 leading-relaxed">{cmsText("homepage.b52c385d80", "Opracowujemy schematy rozdzielnic, tras kablowych KNX/DALI, wytyczne dla elektryków i koordynację HVAC.")}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-mono text-[#CFE3C4]">{cmsText("homepage.5e83cf94de", "Efekt: Kompletna dokumentacja")}</div>
            </div>

            {/* 04. Realizacja */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-mono font-bold text-[#E6F15A] block mb-3">04.</span>
                <h3 className="text-base font-bold font-display text-white mb-2">{cmsText("homepage.50ca5cd987", "Realizacja — instalacja i konfiguracja")}</h3>
                <p className="text-xs text-[#EDE9DF]/70 leading-relaxed">{cmsText("homepage.51013a4c16", "Prefabrykujemy i testujemy rozdzielnice w warsztacie, montujemy osprzęt JUNG i wgrywamy oprogramowanie ETS.")}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-mono text-[#CFE3C4]">{cmsText("homepage.4cd5a5d15b", "Efekt: Uruchomiona instalacja")}</div>
            </div>

            {/* 05. Odbiór */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-mono font-bold text-[#E6F15A] block mb-3">05.</span>
                <h3 className="text-base font-bold font-display text-white mb-2">{cmsText("homepage.33156db37a", "Odbiór — szkolenie i asysta")}</h3>
                <p className="text-xs text-[#EDE9DF]/70 leading-relaxed">{cmsText("homepage.eb1ceca3df", "Przekazujemy dokumentację powykonawczą, kopię bazy ETS inwestorowi, szkolimy użytkowników i prowadzimy serwis.")}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-mono text-[#CFE3C4]">{cmsText("homepage.5b272d08e2", "Efekt: Bezpieczeństwo i spokój")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SEKCJA REALIZACJI (PRZYKŁADOWE ZAKRESY BEZ WYMYŚLANIA KLIENTÓW) */}
      <section className="py-16 sm:py-24 bg-[#F7F8F5] border-b border-[#17211C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText("homepage.ee25ca1be5", "Referencyjne zakresy projektowe")}</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#17211C]">{cmsText("homepage.fc5e36d5b5", "Przykładowe architektury instalacji")}</h2>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0E4637] hover:underline"
            >
              <span>{cmsText("homepage.b941ba7f63", "Zobacz wszystkie opracowania")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Karta 1: Przykładowy zakres: Biuro — światło, sale spotkań i komfort stref */}
            <div className="bg-white rounded-2xl border border-[#17211C]/10 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[16/9] relative overflow-hidden bg-[#17211C]">
                  <img
                    src={IMAGES.officeCommSpace}
                    alt={cmsText("homepage.c6b7fcd573", "Przykładowy zakres: Biuro — światło, sale spotkań i komfort stref")}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#17211C]/80 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-mono">{cmsText("homepage.a9035013a3", "Typ: Powierzchnia biurowa fit-out · ~850 m²")}</div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#17211C]">{cmsText("homepage.7b560a2e52", "Przykładowy zakres: Biuro — światło, sale spotkań i komfort stref")}</h3>
                  <p className="text-xs sm:text-sm text-[#17211C]/75 leading-relaxed">{cmsText("homepage.f1b320c326", "Kompletny projekt i wdrożenie magistrali KNX ze zintegrowanymi bramkami DALI-2 dla 14 stref open space, 4 sal konferencyjnych oraz gabinetów dyrekcji. Integracja z klimakonwektorami 4-rurowymi i systemem BMS budynku biurowego.")}</p>

                  <div className="space-y-2 pt-2 border-t border-[#17211C]/10 text-xs">
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-[#17211C]/60">{cmsText("homepage.9378452aaa", "Oświetlenie:")}</span>
                      <span className="font-semibold text-[#17211C]">{cmsText("homepage.e320429726", "DALI Tunable White + sensory obecności")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-[#17211C]/60">{cmsText("homepage.0b93b2c6af", "HVAC:")}</span>
                      <span className="font-semibold text-[#17211C]">{cmsText("homepage.110e14c585", "KNX fancoil + automatyczne odcięcie po godzinach")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-[#17211C]/60">{cmsText("homepage.d0f6234592", "Sale konferencyjne:")}</span>
                      <span className="font-semibold text-[#17211C]">{cmsText("homepage.e93b0b1398", "Sceny „Wideorozmowa”, „Prezentacja”, „Praca”")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => onNavigate('offices')}
                  className="w-full py-2.5 bg-[#F7F8F5] hover:bg-[#CFE3C4]/30 text-[#0E4637] font-semibold text-xs uppercase tracking-wider rounded-lg border border-[#0E4637]/20 transition-colors"
                >{cmsText("homepage.e39998225b", "Szczegóły specyfikacji biurowej")}</button>
              </div>
            </div>

            {/* Karta 2: Przykładowy zakres: Dom — światło, rolety i temperatura */}
            <div className="bg-white rounded-2xl border border-[#17211C]/10 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[16/9] relative overflow-hidden bg-[#17211C]">
                  <img
                    src={IMAGES.residentialResidence}
                    alt={cmsText("homepage.93976ee68a", "Przykładowy zakres: Dom — światło, rolety i temperatura")}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#17211C]/80 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-mono">{cmsText("homepage.7e84f26e06", "Typ: Rezydencja jednorodzinna · ~420 m²")}</div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-[#17211C]">{cmsText("homepage.8451347b04", "Przykładowy zakres: Dom — światło, rolety i temperatura")}</h3>
                  <p className="text-xs sm:text-sm text-[#17211C]/75 leading-relaxed">{cmsText("homepage.4695ccab08", "Spójna automatyka rezydencji integrująca strefowe ogrzewanie podłogowe, klimatyzację sufitową, stację pogodową z automatyką żaluzji zewnętrznych oraz designerski osprzęt JUNG LS 990 w kolorach aluminium i antracytu.")}</p>

                  <div className="space-y-2 pt-2 border-t border-[#17211C]/10 text-xs">
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-[#17211C]/60">{cmsText("homepage.db094c996a", "Sterowanie światłem:")}</span>
                      <span className="font-semibold text-[#17211C]">{cmsText("homepage.1295afb8e5", "Scenariusze nastrojowe + ściemnianie fazowe & DALI")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-[#17211C]/60">{cmsText("homepage.3d5e84ecd6", "Żaluzje i karnisze:")}</span>
                      <span className="font-semibold text-[#17211C]">{cmsText("homepage.8dfb586de2", "Automatyka słoneczna + ciche napędy Somfy/KNX")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-[#17211C]/60">{cmsText("homepage.9fc5873c3d", "Interfejs:")}</span>
                      <span className="font-semibold text-[#17211C]">{cmsText("homepage.1b18246164", "Klawisze dotykowe JUNG + aplikacja na tablet")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => onNavigate('homes')}
                  className="w-full py-2.5 bg-[#F7F8F5] hover:bg-[#CFE3C4]/30 text-[#0E4637] font-semibold text-xs uppercase tracking-wider rounded-lg border border-[#0E4637]/20 transition-colors"
                >{cmsText("homepage.ff2607824c", "Szczegóły specyfikacji rezydencjalnej")}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SEKCJA KONTAKTOWA: PRZEŚLIJ RZUTY */}
      <section id="kontakt-rzuty" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Header Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block">{cmsText("homepage.8ef6d9b8db", "Pierwszy krok do realizacji")}</span>

              <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#17211C] tracking-tight">{cmsText("homepage.6fc5002f61", "Prześlij rzuty. Wrócimy z konkretnymi pytaniami.")}</h2>

              <p className="text-sm sm:text-base text-[#17211C]/80 leading-relaxed">{cmsText("homepage.4acc7843c0", "Niezależnie od tego, czy masz wstępny rzut koncepcyjny z pracowni architektonicznej, czy gotowy projekt branżowy — przeanalizujemy go pod kątem magistrali KNX, tras kablowych, oświetlenia DALI i sterowania strefowego.")}</p>

              <div className="p-5 bg-[#F7F8F5] rounded-xl border border-[#17211C]/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0E4637]">
                  <span className="w-2 h-2 rounded-full bg-[#0E4637]" />
                  <span>{cmsText("homepage.1a2496fe74", "Warszawa i okolice · realizacje w całej Polsce.")}</span>
                </div>
                <p className="text-xs text-[#17211C]/70">{cmsText("homepage.fc5e0532e0", "Spotykamy się osobiście na terenie Warszawy (Wola, Mokotów, Śródmieście, Wilanów, Konstancin) lub prowadzimy koordynację online w dowolnym miejscu kraju.")}</p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-[#17211C]/80 font-mono">
                <p>{cmsText("homepage.03c70fe97d", "Bezpośredni kontakt do inżyniera:")}</p>
                <p className="font-semibold text-sm text-[#0E4637] font-sans">{cmsText("homepage.e46178b83d", "tel. +48 505 260 715 · kontakt@delitech.pl")}</p>
                <p className="text-[11px] text-[#17211C]/60">{cmsText("homepage.39f52ff9b2", "Biuro: ul. Konwaliowa 7 lok. 103, 03-194 Warszawa")}</p>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <ContactForm onOpenPrivacy={onOpenPrivacy} defaultType="biuro" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
