import { useCmsContent, cmsText } from '../cms/content.ts';
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

  const fallbackProjects = [
    {
      id: 'biuro-1',
      type: 'biuro',
      title: cmsText("ProjectsPage-ed7a50852608", "Przykładowy zakres: Biuro — światło, sale spotkań i komfort stref"),
      subtitle: cmsText("ProjectsPage-864448d2f5ff", "Powierzchnia biurowa fit-out · Warszawa Wola · ~850 m²"),
      image: IMAGES.officeCommSpace,
      summary:
        cmsText("ProjectsPage-177dbc017027", "Architektura systemu obejmująca centralne zarządzanie oświetleniem DALI-2, koordynację 28 klimakonwektorów 4-rurowych, integrację sal konferencyjnych z systemem wideokonferencji oraz automatyczne procedury redukcji poboru mocy po godzinach pracy."),
      zones: [
        cmsText("ProjectsPage-660ec5bd965b", "Open space: 4 strefy pracy ciągłej z pomiarem światła dziennego"),
        cmsText("ProjectsPage-34a74cadbbc6", "Sale konferencyjne: 3 sale z panelami scen prezentacji i czujnikami CO2"),
        cmsText("ProjectsPage-855d79155aa6", "Gabinet prezesa: dyskretne sterowanie klimatem i roletami"),
        cmsText("ProjectsPage-f359302c9ed0", "Strefa kuchenna i chillout: oświetlenie nastrojowe i nagłośnienie"),
      ],
      protocols: [cmsText("ProjectsPage-43f43cd6a1c9", "KNX TP"), cmsText("ProjectsPage-271d2b858e11", "DALI-2"), cmsText("ProjectsPage-96f7f552bb8f", "BACnet/IP do BMS obiektu"), cmsText("ProjectsPage-b13b8276cf7e", "Modbus RTU dla liczników energii")],
      hardware: [cmsText("ProjectsPage-5ccd4eea36d7", "JUNG KNX F 40"), cmsText("ProjectsPage-45af2081659f", "Bramki DALI-2 IP"), cmsText("ProjectsPage-04ced401a915", "Sensory obecności Theben PlanoSpot")],
    },
    {
      id: 'dom-1',
      type: 'dom',
      title: cmsText("ProjectsPage-723bca3fb821", "Przykładowy zakres: Dom — światło, rolety i temperatura"),
      subtitle: cmsText("ProjectsPage-b3a31781afc0", "Dom jednorodzinny · przykładowy zakres · ~420 m²"),
      image: IMAGES.residentialResidence,
      summary:
        cmsText("ProjectsPage-a0d0ecf0dab2", "Zintegrowana automatyka willi jednorodzinnej. Połączenie sterowania strefami podłogówki, sufitów chłodzących, stacji pogodowej ze śledzeniem pozycji słońca oraz designerskiego osprzętu JUNG w wykończeniu z ciemnego mosiądzu i aluminium."),
      zones: [
        cmsText("ProjectsPage-d020ba214e37", "Strefa dzienna: salon o podwójnej wysokości z wieloobwodowym oświetleniem DALI"),
        cmsText("ProjectsPage-aaab52775a1a", "Sypialnie i garderoby: indywidualne harmonogramy termiczne i ciche karnisze"),
        cmsText("ProjectsPage-8276460b70f6", "Strefa SPA / basen: kontrola wilgotności, temperatury i oświetlenia relaksacyjnego"),
        cmsText("ProjectsPage-57a3fa265407", "Ogród i taras: automatyka nawadniania, oświetlenie zmierzchowe i markizy"),
      ],
      protocols: [cmsText("ProjectsPage-43f43cd6a1c9", "KNX TP"), cmsText("ProjectsPage-271d2b858e11", "DALI-2"), cmsText("ProjectsPage-77dee9c4c2ea", "Bramka KNX-Modbus do pompy ciepła"), cmsText("ProjectsPage-926cb08444ef", "Interfejs Apple HomeKit")],
      hardware: [cmsText("ProjectsPage-c5ce1d94361d", "JUNG LS 990 Mosiądz Antyczny"), cmsText("ProjectsPage-46e529d10183", "Stacja pogodowa KNX GPS"), cmsText("ProjectsPage-3444fbf2cc99", "Zawory termoelektryczne 24V")],
    },
    {
      id: 'apartament-1',
      type: 'apartament',
      title: cmsText("ProjectsPage-2cad2f052b70", "Przykładowy zakres: Apartament penthouse — strefy DALI i zintegrowany HVAC"),
      subtitle: cmsText("ProjectsPage-666c1f21048d", "Apartament z tarasem · Warszawa Śródmieście · ~180 m²"),
      image: IMAGES.jungLsZero,
      summary:
        cmsText("ProjectsPage-e3117a1ee1ba", "Kompaktowa, wyrafinowana rozdzielnica KNX ukryta w szafie gospodarczej. Pełna eliminacja termostatów ściennych i włączników wieloramkowych na rzecz pojedynczych manipulatorów JUNG LS ZERO zlicowanych ze strukturą tynku."),
      zones: [
        cmsText("ProjectsPage-e9b761cb16b0", "Salon z aneksem kuchennym: sceny świetlne do gotowania, kolacji i seansów filmowych"),
        cmsText("ProjectsPage-ffaf96cdc34a", "Master bedroom: sterowanie żaluzjami zaciemniającymi blackout i klimatyzacją"),
        cmsText("ProjectsPage-c6d06f942244", "Taras widokowy: ogrzewanie promiennikowe i oświetlenie obwodowe"),
      ],
      protocols: [cmsText("ProjectsPage-43f43cd6a1c9", "KNX TP"), cmsText("ProjectsPage-33a5febf9bae", "DALI-2 Tunable White"), cmsText("ProjectsPage-b99918b7128b", "Integracja klimatyzacji kanałowej VRF")],
      hardware: [cmsText("ProjectsPage-e692663a22d8", "JUNG LS ZERO"), cmsText("ProjectsPage-9d6b2425c53f", "Bramka Intesis KNX-VRF"), cmsText("ProjectsPage-4530ef5545a9", "Aktory ściemniające LED 24V")],
    },
  ];

  const cms = useCmsContent();
  const projects = cms.loaded ? cms.projects.map(p=>({...p,image:p.image || IMAGES.residentialResidence})) : fallbackProjects;
  const filteredProjects =
    filter === 'all' ? projects : projects.filter((p) => p.type === filter);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-[#17211C] text-white py-12 lg:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6F15A] font-semibold block">{cmsText("ProjectsPage-502eebeefb74", "Koncepcje do rozmowy o projekcie")}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">{cmsText("ProjectsPage-9f744f97d4e8", "Przykłady rozwiązań")}</h1>
            <p className="text-base sm:text-lg text-[#EDE9DF]/80 leading-relaxed pt-2">{cmsText("ProjectsPage-f2366d05afdc", "Przykładowe konfiguracje dla domów, apartamentów i biur. To koncepcje i ilustracje poglądowe, a nie portfolio wykonanych obiektów. Zakres oraz dobór urządzeń ustalamy dla konkretnego projektu.")}</p>
          </div>
        </div>
      </section>

      {/* Filter bar & List */}
      <section className="py-12 sm:py-16 bg-[#F7F8F5] border-b border-[#17211C]/10">
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
            >{cmsText("ProjectsPage-5483592e6d19", "Wszystkie opracowania")}</button>
            <button
              onClick={() => setFilter('biuro')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'biuro'
                  ? 'bg-[#0E4637] text-white shadow-sm'
                  : 'bg-white text-[#17211C]/70 hover:text-[#17211C] border border-[#17211C]/10'
              }`}
            >{cmsText("ProjectsPage-c4f6a547e920", "Biura i Fit-out")}</button>
            <button
              onClick={() => setFilter('dom')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'dom'
                  ? 'bg-[#0E4637] text-white shadow-sm'
                  : 'bg-white text-[#17211C]/70 hover:text-[#17211C] border border-[#17211C]/10'
              }`}
            >{cmsText("ProjectsPage-28040a623393", "Domy i Rezydencje")}</button>
            <button
              onClick={() => setFilter('apartament')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'apartament'
                  ? 'bg-[#0E4637] text-white shadow-sm'
                  : 'bg-white text-[#17211C]/70 hover:text-[#17211C] border border-[#17211C]/10'
              }`}
            >{cmsText("ProjectsPage-2bd7caa78cd2", "Apartamenty")}</button>
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
                    <img loading="lazy" decoding="async"                       src={p.image}
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
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#0E4637] font-semibold">{cmsText("ProjectsPage-1753d4e1e8c3", "Koncepcja architektoniczno-inżynierska")}</span>
                      <h3 className="text-2xl font-bold font-display text-[#17211C] mt-1">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#17211C]/75 mt-3 leading-relaxed">
                        {p.summary}
                      </p>

                      <div className="mt-6 pt-4 border-t border-[#17211C]/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17211C] block mb-2">{cmsText("ProjectsPage-40290fa2a6c0", "Podział na strefy instalacyjne:")}</span>
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
                          <span className="text-[#17211C]/60 block text-[11px] font-mono">{cmsText("ProjectsPage-71b26d6783d5", "Protokoły:")}</span>
                          <span className="font-semibold text-[#17211C]">{p.protocols.join(' · ')}</span>
                        </div>
                        <div>
                          <span className="text-[#17211C]/60 block text-[11px] font-mono">{cmsText("ProjectsPage-8d66941327ee", "Osprzęt i moduły:")}</span>
                          <span className="font-semibold text-[#17211C]">{p.hardware.join(' · ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#17211C]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button
                        onClick={onOpenConsultation}
                        className="px-5 py-2.5 bg-[#0E4637] hover:bg-[#17211C] text-[#E6F15A] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <span>{cmsText("ProjectsPage-fcd5abf229de", "Skonsultuj podobny zakres")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onNavigate('contact')}
                        className="text-xs font-semibold text-[#0E4637] hover:underline text-center"
                      >{cmsText("ProjectsPage-1571ee109283", "Prześlij rzuty do wyceny")}</button>
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
