import { cmsText } from '../cms';
import React, { useState } from 'react';
import { PageId } from '../types.ts';
import { IMAGES } from '../assets.ts';
import { CheckCircle2, ArrowRight, Layers, Sliders, Sun, Building2, Home } from 'lucide-react';

interface ProjectsPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const [filter, setFilter] = useState<'all' | 'biuro' | 'dom' | 'apartament'>('all');

  const projects = [
    {
      id: 'biuro-1',
      type: 'biuro',
      title: cmsText("projectspage.7483afa816", "Przykładowy zakres: Biuro — światło, sale spotkań i komfort stref"),
      subtitle: cmsText("projectspage.97485e81f7", "Powierzchnia biurowa fit-out · Warszawa Wola · ~850 m²"),
      image: IMAGES.officeCommSpace,
      summary:
        cmsText("projectspage.a1a321791c", "Architektura systemu obejmująca centralne zarządzanie oświetleniem DALI-2, koordynację 28 klimakonwektorów 4-rurowych, integrację sal konferencyjnych z systemem wideokonferencji oraz automatyczne procedury redukcji poboru mocy po godzinach pracy."),
      zones: [
        cmsText("projectspage.749165d349", "Open space: 4 strefy pracy ciągłej z pomiarem światła dziennego"),
        cmsText("projectspage.c62bfe9ac5", "Sale konferencyjne: 3 sale z panelami scen prezentacji i czujnikami CO2"),
        cmsText("projectspage.6ce80fbc14", "Gabinet prezesa: dyskretne sterowanie klimatem i roletami"),
        cmsText("projectspage.5dd4d13de1", "Strefa kuchenna i chillout: oświetlenie nastrojowe i nagłośnienie"),
      ],
      protocols: [cmsText("projectspage.d08e8cab3e", "KNX TP"), cmsText("projectspage.4fad900207", "DALI-2"), cmsText("projectspage.20a7241c03", "BACnet/IP do BMS obiektu"), cmsText("projectspage.883d76d9d6", "Modbus RTU dla liczników energii")],
      hardware: [cmsText("projectspage.c54d6a9569", "JUNG KNX F 40"), cmsText("projectspage.7c43efa421", "Bramki DALI-2 IP"), cmsText("projectspage.8408249613", "Sensory obecności Theben PlanoSpot")],
    },
    {
      id: 'dom-1',
      type: 'dom',
      title: cmsText("projectspage.f1dfadd305", "Przykładowy zakres: Dom — światło, rolety i temperatura"),
      subtitle: cmsText("projectspage.bc0d1e4693", "Rezydencja podmiejska · Okolice Warszawy (Konstancin) · ~420 m²"),
      image: IMAGES.residentialResidence,
      summary:
        cmsText("projectspage.3d9b1487b0", "Zintegrowana automatyka willi jednorodzinnej. Połączenie sterowania strefami podłogówki, sufitów chłodzących, stacji pogodowej ze śledzeniem pozycji słońca oraz designerskiego osprzętu JUNG w wykończeniu z ciemnego mosiądzu i aluminium."),
      zones: [
        cmsText("projectspage.516b95749a", "Strefa dzienna: salon o podwójnej wysokości z wieloobwodowym oświetleniem DALI"),
        cmsText("projectspage.bb3fc0acbc", "Sypialnie i garderoby: indywidualne harmonogramy termiczne i ciche karnisze"),
        cmsText("projectspage.ba2061d596", "Strefa SPA / basen: kontrola wilgotności, temperatury i oświetlenia relaksacyjnego"),
        cmsText("projectspage.4948318eba", "Ogród i taras: automatyka nawadniania, oświetlenie zmierzchowe i markizy"),
      ],
      protocols: [cmsText("projectspage.726f145dcc", "KNX TP"), cmsText("projectspage.fe1c81d023", "DALI-2"), cmsText("projectspage.020d3ee7a1", "Bramka KNX-Modbus do pompy ciepła"), cmsText("projectspage.111a85f1e8", "Interfejs Apple HomeKit")],
      hardware: [cmsText("projectspage.d6ef47c65b", "JUNG LS 990 Mosiądz Antyczny"), cmsText("projectspage.ca63d539a9", "Stacja pogodowa KNX GPS"), cmsText("projectspage.d83a6c8cb4", "Zawory termoelektryczne 24V")],
    },
    {
      id: 'apartament-1',
      type: 'apartament',
      title: cmsText("projectspage.31d9b87912", "Przykładowy zakres: Apartament penthouse — strefy DALI i zintegrowany HVAC"),
      subtitle: cmsText("projectspage.1682694403", "Apartament z tarasem · Warszawa Śródmieście · ~180 m²"),
      image: IMAGES.knxSwitchHardware,
      summary:
        cmsText("projectspage.42104661ba", "Kompaktowa, wyrafinowana rozdzielnica KNX ukryta w szafie gospodarczej. Pełna eliminacja termostatów ściennych i włączników wieloramkowych na rzecz pojedynczych manipulatorów JUNG LS ZERO zlicowanych ze strukturą tynku."),
      zones: [
        cmsText("projectspage.a3ec7141e2", "Salon z aneksem kuchennym: sceny świetlne do gotowania, kolacji i seansów filmowych"),
        cmsText("projectspage.ae85f23d6c", "Master bedroom: sterowanie żaluzjami zaciemniającymi blackout i klimatyzacją"),
        cmsText("projectspage.2d3151984b", "Taras widokowy: ogrzewanie promiennikowe i oświetlenie obwodowe"),
      ],
      protocols: [cmsText("projectspage.913b6f4edb", "KNX TP"), cmsText("projectspage.8fdf21912d", "DALI-2 Tunable White"), cmsText("projectspage.cb0ab9589c", "Integracja klimatyzacji kanałowej VRF")],
      hardware: [cmsText("projectspage.e6a92d5862", "JUNG LS ZERO"), cmsText("projectspage.1ebb2af540", "Bramka Intesis KNX-VRF"), cmsText("projectspage.4dd4feae57", "Aktory ściemniające LED 24V")],
    },
  ];

  const filteredProjects =
    filter === 'all' ? projects : projects.filter((p) => p.type === filter);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-[#17211C] text-white py-16 lg:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6F15A] font-semibold block">{cmsText("projectspage.3c232570dd", "Dokumentacja i Zakresy Referencyjne")}</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white">{cmsText("projectspage.9921bf8bbc", "Przykładowe zakresy realizacji")}</h1>
            <p className="text-base sm:text-lg text-[#EDE9DF]/80 leading-relaxed pt-2">{cmsText("projectspage.9096c4dbd2", "Przedstawiamy wzorcowe konfiguracje systemów KNX dla biur komercyjnych, rezydencji i apartamentów. Poznaj architekturę sprzętową, protokoły oraz sposób podziału na strefy funkcjonalne.")}</p>
          </div>
        </div>
      </section>

      {/* Filter bar & List */}
      <section className="py-16 sm:py-24 bg-[#F7F8F5] border-b border-[#17211C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Segmented Filter Bar (functional buttons) */}
          <div className="flex flex-wrap items-center gap-2 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-[#0E4637] text-white shadow-sm'
                  : 'bg-white text-[#17211C]/70 hover:text-[#17211C] border border-[#17211C]/10'
              }`}
            >{cmsText("projectspage.b59d0af47b", "Wszystkie opracowania")}</button>
            <button
              onClick={() => setFilter('biuro')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'biuro'
                  ? 'bg-[#0E4637] text-white shadow-sm'
                  : 'bg-white text-[#17211C]/70 hover:text-[#17211C] border border-[#17211C]/10'
              }`}
            >{cmsText("projectspage.60144baf62", "Biura i Fit-out")}</button>
            <button
              onClick={() => setFilter('dom')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'dom'
                  ? 'bg-[#0E4637] text-white shadow-sm'
                  : 'bg-white text-[#17211C]/70 hover:text-[#17211C] border border-[#17211C]/10'
              }`}
            >{cmsText("projectspage.e7d1496c9a", "Domy i Rezydencje")}</button>
            <button
              onClick={() => setFilter('apartament')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'apartament'
                  ? 'bg-[#0E4637] text-white shadow-sm'
                  : 'bg-white text-[#17211C]/70 hover:text-[#17211C] border border-[#17211C]/10'
              }`}
            >{cmsText("projectspage.2db29e6338", "Apartamenty")}</button>
          </div>

          {/* Cards Grid */}
          <div className="space-y-12">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#17211C]/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Visual Col (5 cols) */}
                  <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto bg-[#17211C]">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-[#17211C]/80 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-mono">
                      {p.subtitle}
                    </div>
                  </div>

                  {/* Details Col (7 cols) */}
                  <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#0E4637] font-semibold">{cmsText("projectspage.df68cc2f1a", "Koncepcja architektoniczno-inżynierska")}</span>
                      <h3 className="text-2xl font-bold font-display text-[#17211C] mt-1">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#17211C]/75 mt-3 leading-relaxed">
                        {p.summary}
                      </p>

                      <div className="mt-6 pt-4 border-t border-[#17211C]/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17211C] block mb-2">{cmsText("projectspage.5c3c12a00e", "Podział na strefy instalacyjne:")}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#17211C]/80">
                          {p.zones.map((z, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0E4637] mt-1.5 shrink-0" />
                              <span>{z}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#17211C]/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[#17211C]/60 block text-[11px] font-mono">{cmsText("projectspage.0b188cc2cf", "Protokoły:")}</span>
                          <span className="font-semibold text-[#17211C]">{p.protocols.join(' · ')}</span>
                        </div>
                        <div>
                          <span className="text-[#17211C]/60 block text-[11px] font-mono">{cmsText("projectspage.6c165c0aa6", "Osprzęt i moduły:")}</span>
                          <span className="font-semibold text-[#17211C]">{p.hardware.join(' · ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#17211C]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button
                        onClick={onOpenConsultation}
                        className="px-5 py-2.5 bg-[#0E4637] hover:bg-[#17211C] text-[#E6F15A] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <span>{cmsText("projectspage.3e81949e0b", "Skonsultuj podobny zakres")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onNavigate('contact')}
                        className="text-xs font-semibold text-[#0E4637] hover:underline text-center"
                      >{cmsText("projectspage.97d9d6e3f2", "Prześlij rzuty do wyceny")}</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
