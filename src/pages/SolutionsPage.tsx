import { cmsText } from '../cms/content.ts';
import React, { useState } from 'react';
import { PageId } from '../types.ts';
import {
  SunMedium,
  Sliders,
  Wind,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface SolutionsPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
  initialHash?: string;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({
  onNavigate,
  onOpenConsultation,
  initialHash,
}) => {
  const [activeSolution, setActiveSolution] = useState<string>(initialHash || 'dali');

  const solutions = [
    {
      id: 'dali',
      title: cmsText("SolutionsPage-ab058c26c5a6", "Oświetlenie i DALI-2"),
      badge: 'Architektura światła',
      icon: SunMedium,
      lead: 'Sterowanie oświetleniem dopasowane do opraw, ich zasilaczy i sposobu użytkowania wnętrza.',
      content:
        'DALI umożliwia adresowanie urządzeń sterujących oświetleniem oraz tworzenie grup i scen. Minimalny poziom ściemniania, jakość światła i diagnostyka zależą od wybranych urządzeń. Tunable White wymaga zgodnych opraw, zasilaczy (np. DT8 Tc) i bramki KNX–DALI.',
      features: [
        cmsText("SolutionsPage-d53d68007960", "Do 64 adresów urządzeń wykonawczych na jednej magistrali DALI"),
        cmsText("SolutionsPage-8de3a5e94249", "Sterowanie Tunable White (HCL — Human Centric Lighting)"),
        cmsText("SolutionsPage-0a12eff07c8b", "Stała kontrola natężenia światła (Constant Light Control)"),
        cmsText("SolutionsPage-98f427fcbf0b", "Weryfikacja ściemniania i pracy zasilaczy z wybraną oprawą"),
      ],
    },
    {
      id: 'fasady',
      title: cmsText("SolutionsPage-25cdc3409002", "Rolety, żaluzje i fasady"),
      badge: 'Komfort termiczny i optyczny',
      icon: Sliders,
      lead: 'Automatyczna ochrona przed przegrzewaniem wnętrza latem i ucieczką ciepła zimą.',
      content:
        'Żaluzje zewnętrzne i fasadowe nie służą tylko do zasłaniania okien. System KNX wyposażony w stację meteorologiczną na dachu śledzi dokładną pozycję słońca (Sun Tracking) i ustawia lamele pod optymalnym kątem — tak, aby wpuścić naturalne dzienne światło, ale zatrzymać bezpośrednie promieniowanie cieplne.',
      features: [
        cmsText("SolutionsPage-6bf397e0e155", "Automatyczny kąt lameli żaluzji fasadowych w zależności od azymutu słońca"),
        cmsText("SolutionsPage-f3177a00da8a", "Zabezpieczenie przed silnym wiatrem, oblodzeniem i gradem"),
        cmsText("SolutionsPage-14ac4aebbc8e", "Ciche sterowanie roletami screen, zasłonami i karniszami elektrycznymi"),
        cmsText("SolutionsPage-fde65cdbaf38", "Zintegrowane sceny prywatności o zmroku"),
      ],
    },
    {
      id: 'hvac',
      title: cmsText("SolutionsPage-143651b18ad4", "HVAC: Ogrzewanie, Chłodzenie i Wentylacja"),
      badge: 'Klimat pod pełną kontrolą',
      icon: Wind,
      lead: 'Harmonia pomiędzy podłogówką, klimatyzacją kanałową i rekuperacją.',
      content:
        'W tradycyjnych instalacjach klimatyzacja często chłodzi przestrzeń, podczas gdy grzejniki lub podłogówka dogrzewają pomieszczenie. Integracja KNX eliminuje ten konflikt (Deadband Control). Jeden estetyczny regulator zarządza zaworami grzewczymi, siłownikami, klimakonwektorami i centralą wentylacyjną.',
      features: [
        cmsText("SolutionsPage-d70a440f98ae", "Dobór strefy neutralnej i blokada równoczesnego grzania i chłodzenia"),
        cmsText("SolutionsPage-d19638fdd801", "Automatyczne obniżenie nastawy temperatury po otwarciu okna (kontaktrony)"),
        cmsText("SolutionsPage-e55bda41c3b5", "Kontrola wilgotności powietrza i stężenia CO2 (sterowanie nawiewem)"),
        cmsText("SolutionsPage-c9a6a961443c", "Zdalna zmiana harmonogramu przed powrotem do domu lub biura"),
      ],
    },
    {
      id: 'sceny',
      title: cmsText("SolutionsPage-8fb68d4ebce9", "Sceny i sterowanie"),
      badge: 'Intuicyjna obsługa przestrzeni',
      icon: Sparkles,
      lead: 'Zamiast dziesięciu włączników — jeden czytelny gest.',
      content:
        'Sceny to sedno automatyki budynkowej. Zamiast manualnego ustawiania kilkunastu obwodów, rolet i temperatury, użytkownik naciska jeden klawisz lub wybiera scenę w telefonie. „Spotkanie zarządu”, „Kino domowe”, „Kolacja z przyjaciółmi”, „Wyjście z obiektu” — cała przestrzeń reaguje synchronicznie.',
      features: [
        cmsText("SolutionsPage-20303676987b", "Programowanie scen dopasowanych do stylu życia i procedur biurowych"),
        cmsText("SolutionsPage-a03022b2f2d3", "Klawiatury wielofunkcyjne JUNG z grawerowanymi symbolami lub tekstem"),
        cmsText("SolutionsPage-8007b8675da2", "Dotykowe panele ścienne z podglądem całego obiektu"),
        cmsText("SolutionsPage-40a5dbe28ca3", "Możliwość samodzielnej modyfikacji poziomów scen przez użytkownika"),
      ],
    },
    {
      id: 'energia',
      title: cmsText("SolutionsPage-935f0e97ddca", "Energia i pomiary"),
      badge: 'Efektywność i oszczędności',
      icon: Zap,
      lead: 'Dokładny wgląd w zużycie prądu, wody i ciepła dla inwestora i zarządcy.',
      content:
        'Instalujemy certyfikowane liczniki energii na magistralę KNX / Modbus. W biurach umożliwia to dokładne rozliczenie poszczególnych najemców i generowanie raportów ESG. W domach — inteligentne kierowanie nadwyżek z fotowoltaiki do ładowania auta elektrycznego lub podgrzewania bufora ciepła.',
      features: [
        cmsText("SolutionsPage-26e8202f14e8", "Pomiar energii elektrycznej z podziałem na obwody (oświetlenie, HVAC, gniazda)"),
        cmsText("SolutionsPage-3a550c26b8c1", "Zarządzanie obciążeniem (Load Shedding) — ochrona przed przekroczeniem mocy umownej"),
        cmsText("SolutionsPage-175a1ed00656", "Integracja z falownikami fotowoltaicznymi i magazynami energii"),
        cmsText("SolutionsPage-1e7b1dd01007", "Raporty zużycia energii do analizy; zakres uzgadniany z doradcą certyfikacji"),
      ],
    },
    {
      id: 'bezpieczenstwo',
      title: cmsText("SolutionsPage-89b5fa134015", "Bezpieczeństwo i monitoring"),
      badge: 'Ochrona mienia i instalacji',
      icon: ShieldCheck,
      lead: 'Działania prewencyjne: czujniki zalania, dymu, kontaktrony i symulacja obecności.',
      content:
        'System KNX współpracuje z instalacją alarmową (SSWiN) i przeciwpożarową. W przypadku wykrycia wycieku wody, system automatycznie odcina główny elektrozawór i wysyła powiadomienie. Podczas urlopu system odtwarza realistyczną symulację obecności domowników.',
      features: [
        cmsText("SolutionsPage-d46b51ad1fee", "Automatyczne odcięcie wody po detekcji zalania"),
        cmsText("SolutionsPage-ddb5f2282585", "Współpraca z centralami alarmowymi Satel / DSC"),
        cmsText("SolutionsPage-80cbde7ef716", "Symulacja obecności oparta na realnych nawykach oświetleniowych"),
        cmsText("SolutionsPage-c57d57c30bdb", "Oświetlenie ewakuacyjne i odblokowanie rolet w razie alarmu pożarowego"),
      ],
    },
    {
      id: 'integracje',
      title: cmsText("SolutionsPage-bb60753791ef", "Integracje systemowe i IoT"),
      badge: 'Otwartość na przyszłość',
      icon: Cpu,
      lead: 'Połączenie niezawodnej magistrali przewodowej z nowoczesnym ekosystemem IP.',
      content:
        'Łączymy stabilność standardu KNX z aplikacjami mobilnymi, Apple HomeKit, asystentami głosowymi, systemami multiroom audio (Sonos, Bluesound) oraz protokołami automatyki budynkowej BMS (BACnet, Modbus, MQTT).',
      features: [
        cmsText("SolutionsPage-fed4b9fb036e", "Bramki KNX-IP z szyfrowaniem KNX Secure"),
        cmsText("SolutionsPage-9d7ef876ff09", "Natywne wsparcie Apple HomeKit, Google Assistant, Amazon Alexa"),
        cmsText("SolutionsPage-da06eb91d428", "Integracja systemów audio-wideo i sal spotkań"),
        cmsText("SolutionsPage-e77821d061c7", "API do autorskich systemów rezerwacji biurowej"),
      ],
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-[#17211C] text-white py-12 lg:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6F15A] font-semibold block">{cmsText("SolutionsPage-cbaca6d64e44", "Inżynieria systemów budynkowych")}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">{cmsText("SolutionsPage-e4413b21dc89", "Rozwiązania technologiczne KNX")}</h1>
            <p className="text-base sm:text-lg text-[#EDE9DF]/80 leading-relaxed pt-2">{cmsText("SolutionsPage-d217c02949f8", "Zobacz poszczególne elementy układanki. Każdy moduł projektujemy z dbałością o najwyższą niezawodność, ergonomię użytkowania oraz kompatybilność na dekady.")}</p>
          </div>
        </div>
      </section>

      {/* Interactive Solutions Browser */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#17211C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pills / tabs */}
          <div className="flex flex-wrap gap-2 mb-12 border-b border-[#17211C]/10 pb-4">
            {solutions.map((sol) => {
              const isActive = activeSolution === sol.id;
              return (
                <button
                  key={sol.id}
                  onClick={() => setActiveSolution(sol.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#0E4637] text-[#E6F15A] shadow-sm'
                      : 'bg-[#F7F8F5] text-[#17211C]/75 hover:text-[#17211C] hover:bg-black/5'
                  }`}
                >
                  {sol.title}
                </button>
              );
            })}
          </div>

          {/* Solution details */}
          {solutions
            .filter((s) => s.id === activeSolution)
            .map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className="bg-[#F7F8F5] border border-[#17211C]/15 rounded-2xl p-8 sm:p-12 shadow-sm animate-fade-in"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-8 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#0E4637] text-[#E6F15A] flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-mono uppercase tracking-wider text-[#0E4637] font-semibold">
                            {s.badge}
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#17211C]">
                            {s.title}
                          </h2>
                        </div>
                      </div>

                      <p className="text-lg font-semibold text-[#0E4637] font-display">
                        {s.lead}
                      </p>

                      <p className="text-sm text-[#17211C]/80 leading-relaxed">
                        {s.content}
                      </p>

                      <div className="pt-2 space-y-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17211C] block mb-2">{cmsText("SolutionsPage-7e56743ab504", "Standardy inżynierskie Delitech:")}</span>
                        {s.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-[#17211C]/85">
                            <CheckCircle2 className="w-4 h-4 text-[#0E4637] shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-[#17211C]/10 flex items-center gap-4">
                        <button
                          onClick={onOpenConsultation}
                          className="px-5 py-2.5 bg-[#0E4637] hover:bg-[#17211C] text-[#E6F15A] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                        >
                          <span>{cmsText("SolutionsPage-10469bf95cab", "Skonsultuj rozwiązanie z inżynierem")}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onNavigate('contact')}
                          className="text-xs font-semibold text-[#0E4637] hover:underline"
                        >{cmsText("SolutionsPage-72d391b9ba2f", "Prześlij specyfikację")}</button>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-[#17211C]/10 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#17211C] pb-2 border-b border-[#17211C]/10">{cmsText("SolutionsPage-ff2901b7bb49", "Integracja w obiekcie")}</h3>
                      <div className="text-xs text-[#17211C]/75 space-y-3">
                        <p>
                          <strong className="text-[#17211C]">{cmsText("SolutionsPage-3a143dc1140d", "Uporządkowana instalacja:")}</strong>{cmsText("SolutionsPage-af6fbd7ae93b", " Moduły automatyki umieszczamy w opisanej rozdzielnicy, z miejscem na serwis i uzgodnioną rezerwą na rozbudowę.")}</p>
                        <p>
                          <strong className="text-[#17211C]">{cmsText("SolutionsPage-476c03569127", "Serwis:")}</strong>{cmsText("SolutionsPage-cee9a991bd83", " Zakres odpowiedzialności, warunki gwarancji i obsługę powdrożeniową określamy w umowie.")}</p>
                        <p>
                          <strong className="text-[#17211C]">{cmsText("SolutionsPage-9829bdf387cc", "Dokumentacja:")}</strong>{cmsText("SolutionsPage-6cc276fdc260", " Każdy obwód, adres DALI i adres fizyczny KNX otrzymuje dokładne oznaczenie na schemacie powykonawczym.")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
};
