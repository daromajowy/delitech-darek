import { cmsText } from '../cms/content.ts';
import React, { useState } from 'react';
import { PageId } from '../types.ts';
import { ContactForm } from '../components/ContactForm.tsx';
import {
  Monitor,
  Users,
  Building2,
  Briefcase,
  RefreshCw,
  FileSearch,
  ArrowRight,
  Sun,
  Wind,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface OfficesPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
  onOpenPrivacy: () => void;
  initialHash?: string;
}

export const OfficesPage: React.FC<OfficesPageProps> = ({
  onNavigate,
  onOpenConsultation,
  onOpenPrivacy,
  initialHash,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>(initialHash || 'open-space');

  const zones = [
    {
      id: 'open-space',
      title: cmsText("OfficesPage-35277720e640", "Open space i strefy pracy"),
      subtitle: cmsText("OfficesPage-477d4aba46cc", "Światło, które podąża za słońcem i skupieniem zespołu"),
      icon: Users,
      desc: cmsText("OfficesPage-844617c58a7d", "W dużych strefach open space kluczem jest unikanie olśnienia i zmęczenia wzroku pracowników. KNX zintegrowany z DALI-2 może dopasowywać poziom oświetlenia do światła dziennego (Daylight Harvesting). Zmiana temperatury barwowej wymaga dodatkowo zgodnych opraw, zasilaczy i sterowania Tunable White."),
      bullets: [
        cmsText("OfficesPage-3a146e74469b", "Regulacja Tunable White (2700K – 6500K) wspierająca rytm dobowy i koncentrację"),
        cmsText("OfficesPage-6ec1b10b75bc", "Strefowe sensory obecności o wysokiej czułości w technologii PIR / ultradźwiękowej"),
        cmsText("OfficesPage-5bb9a80a8805", "Zintegrowane żaluzje fasadowe redukujące refleksy na monitorach komputerowych"),
        cmsText("OfficesPage-07f9dce0d65d", "Automatyczne odłączenie zbędnych odbiorników po wyjściu ostatniego pracownika"),
      ],
      tag: 'Biurowa strefa operacyjna',
    },
    {
      id: 'konferencyjne',
      title: cmsText("OfficesPage-ca1d1327ba6f", "Sale konferencyjne i meeting roomy"),
      subtitle: cmsText("OfficesPage-bb564fae0ac9", "Jeden przycisk przygotowuje całą salę do spotkania lub prezentacji"),
      icon: Monitor,
      desc: cmsText("OfficesPage-c7ee00bc2153", "Koniec z szukaniem włączników i pilotów przed ważnym spotkaniem z klientem. Integracja KNX z systemem AV pozwala za pomocą jednego kliknięcia lub komendy z panelu rezerwacji uruchomić scenę „Prezentacja” lub „Wideokonferencja”."),
      bullets: [
        cmsText("OfficesPage-8aa7a9be1c64", "Scena „Prezentacja”: rolety opadają, światło nad ekranem gaśnie, oprawy obwodowe przyciemniają się do 25%"),
        cmsText("OfficesPage-c6f69caa748b", "Scena „Wideorozmowa”: oświetlenie twarzy dobrane pod kątem położenia opraw i jakości oddawania barw"),
        cmsText("OfficesPage-df12bca2b105", "Monitorowanie poziomu CO2 i automatyczne zwiększanie wydatku wentylacji w czasie długich spotkań"),
        cmsText("OfficesPage-52f20e08606f", "Integracja z kalendarzem Google Workspace / MS Teams i dotykowymi panelami rezerwacji sal"),
      ],
      tag: 'Prezencja i ergonomia spotkań',
    },
    {
      id: 'recepcja',
      title: cmsText("OfficesPage-9710cd5109f2", "Recepcje i przestrzenie wspólne"),
      subtitle: cmsText("OfficesPage-b93b708d6001", "Pierwsze wrażenie gościa i dyskretny prestiż organizacji"),
      icon: Building2,
      desc: cmsText("OfficesPage-edbcb201a44d", "Recepcja i hol wejściowy budują wizerunek firmy od progu. Sceny świetlne płynnie zmieniają się w zależności od pory roku i dnia: poranny powitalny blask, dynamiczne światło w ciągu dnia oraz kameralny nastrój wieczorny."),
      bullets: [
        cmsText("OfficesPage-62b91d96494e", "Scenariusze powitalne skorelowane z zegarem astronomicznym i obecnością"),
        cmsText("OfficesPage-98d90c70f78f", "Wyróżnienie elementów brandingu i ścian recepcyjnych akcentowym oświetleniem DALI"),
        cmsText("OfficesPage-ea638960feb2", "Sterowanie strefami chillout, kawiarniami biurowymi i ciągami komunikacyjnymi"),
        cmsText("OfficesPage-072f2dd9c390", "Harmonogramy weekendowe i świąteczne bez konieczności pamiętania przez recepcjonistę"),
      ],
      tag: 'Strefa reprezentacyjna',
    },
    {
      id: 'gabinety',
      title: cmsText("OfficesPage-868423c3c2b4", "Gabinety i biura zarządu"),
      subtitle: cmsText("OfficesPage-6dca32a39306", "Maksymalna prywatność, akustyka i indywidualna kontrola klimatu"),
      icon: Briefcase,
      desc: cmsText("OfficesPage-8addd181085e", "W przestrzeniach gabinetowych liczy się absolutna dyskrecja, komfort akustyczny i natychmiastowa reakcja na potrzeby użytkownika. Zapewniamy ciche silniki żaluzji i zlicowany osprzęt JUNG z szlachetnych metali."),
      bullets: [
        cmsText("OfficesPage-d16190304e11", "Przyciski KNX w stylistyce JUNG LS 990 w wykończeniach mosiądz, stal szlachetna lub ciemny antracyt"),
        cmsText("OfficesPage-8f87006c2a4c", "Indywidualny termostat i precyzyjne utrzymanie zadanej temperatury bez przeciągów"),
        cmsText("OfficesPage-4fea33b95fec", "Scena „Poufne spotkanie”: zaciemnienie przeszkleń (szkło ciekłokrystaliczne / rolety) i wyciszenie"),
        cmsText("OfficesPage-c92ba0a40cc9", "Dyskretna integracja z gabinetowym systemem nagłośnienia multiroom"),
      ],
      tag: 'Segment Executive',
    },
    {
      id: 'modernizacja',
      title: cmsText("OfficesPage-55527f7b519e", "Modernizacja istniejących biur"),
      subtitle: cmsText("OfficesPage-87fae989f288", "Wymiana przestarzałego sterowania bez paraliżu bieżącej pracy firmy"),
      icon: RefreshCw,
      desc: cmsText("OfficesPage-552bd6b48ce8", "Specjalizujemy się w modernizacjach instalacji w działających biurach. Wykorzystujemy istniejące okablowanie lub wprowadzamy magistralę KNX i moduły radiowe KNX RF tam, gdzie kucie ścian jest wykluczone."),
      bullets: [
        cmsText("OfficesPage-03d663c3e3d0", "Audyt istniejącej infrastruktury elektrycznej i oświetleniowej"),
        cmsText("OfficesPage-54ec2dea3df2", "Możliwość etapowania prac (np. piętro po piętrze, po godzinach pracy biura lub w weekendy)"),
        cmsText("OfficesPage-c3d4aee88f03", "Ocena potencjału oszczędności na podstawie pomiarów, godzin pracy i stanu istniejącej instalacji"),
        cmsText("OfficesPage-5e0bd7f8fb21", "Współpraca z zarządcami budynków biurowych klasy A i B+ w Warszawie"),
      ],
      tag: 'Modernizacja i optymalizacja',
    },
    {
      id: 'audyt',
      title: cmsText("OfficesPage-6a26fd168a29", "Audyt projektu i wycena"),
      subtitle: cmsText("OfficesPage-9b14b7c7cd81", "Weryfikacja rzutów fit-out pod kątem instalacji niskoprądowych i KNX"),
      icon: FileSearch,
      desc: cmsText("OfficesPage-645af3e46585", "Przesyłasz nam rzuty aranżacji wnętrz i branży elektrycznej. Wskazujemy miejsca kolizji, sugerujemy uproszczenie tras kablowych i przygotowujemy rzetelny kosztorys urządzeń oraz wdrożenia."),
      bullets: [
        cmsText("OfficesPage-33842ccd4da7", "Weryfikacja poprawności doboru bramek DALI i zasilaczy magistrali"),
        cmsText("OfficesPage-21658c9933d7", "Wytyczne dla podwykonawcy elektrycznego przed rozpoczęciem prac na budowie"),
        cmsText("OfficesPage-84ae740d99e8", "Wycena modułów automatyki, prefabrykacji szaf i programowania ETS"),
        cmsText("OfficesPage-68b5d1e813b2", "Uzgodnienie wymagań dotyczących pomiarów i sterowania z zespołem inwestycji"),
      ],
      tag: 'Doradztwo inżynierskie',
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Subpage */}
      <section className="bg-[#17211C] text-white py-12 lg:py-16 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark-subtle opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6F15A] font-semibold block">{cmsText("OfficesPage-cb1b65fde7f0", "Biurowy standard KNX · Warszawa i Polska")}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">{cmsText("OfficesPage-0d4a6b6198d3", "Automatyka dla biur i przestrzeni komercyjnych")}</h1>
            <p className="text-base sm:text-lg text-[#EDE9DF]/80 leading-relaxed pt-2">{cmsText("OfficesPage-df8782eddecc", "Projektujemy inteligentne systemy KNX dla biur open space, gabinetów zarządu i sal konferencyjnych. Ograniczamy zużycie energii i tworzymy środowisko pracy wspierające zdrowie i produktywność zespołu.")}</p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenConsultation}
                className="px-6 py-3 bg-[#E6F15A] hover:bg-white text-[#0E4637] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
              >
                <span>{cmsText("OfficesPage-298c1b7636b3", "Skonsultuj projekt biura")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('biuro-kontakt');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-medium text-xs uppercase tracking-wider rounded-lg transition-colors border border-white/15"
              >{cmsText("OfficesPage-d5ca12e43175", "Prześlij rzuty do audytu")}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Zone Navigator */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#17211C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText("OfficesPage-5b085eba274c", "Strefy obiektu biurowego")}</span>
            <h2 className="text-3xl font-bold font-display text-[#17211C]">{cmsText("OfficesPage-adb510384f00", "Wybierz strefę i poznaj scenariusze sterowania")}</h2>
          </div>

          {/* Tab buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
            {zones.map((z) => {
              const isActive = selectedZone === z.id;
              const Icon = z.icon;
              return (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`p-3.5 text-left rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'bg-[#0E4637] text-white border-[#0E4637] shadow-md'
                      : 'bg-[#F7F8F5] text-[#17211C] border-[#17211C]/10 hover:bg-black/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#E6F15A]' : 'text-[#0E4637]'}`} />
                  <span className="text-xs font-bold leading-tight line-clamp-2">
                    {z.title.split(' i ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Zone Detail Card */}
          {zones
            .filter((z) => z.id === selectedZone)
            .map((z) => {
              const Icon = z.icon;
              return (
                <div
                  key={z.id}
                  className="bg-[#F7F8F5] border border-[#17211C]/15 rounded-2xl p-8 sm:p-12 shadow-sm animate-fade-in"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-7 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#0E4637] text-[#E6F15A] flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[#0E4637] font-semibold">
                            {z.tag}
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#17211C]">
                            {z.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-base text-[#0E4637] font-semibold font-display">
                        {z.subtitle}
                      </p>

                      <p className="text-sm text-[#17211C]/80 leading-relaxed">
                        {z.desc}
                      </p>

                      <div className="pt-2 space-y-2.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#17211C] block mb-2">{cmsText("OfficesPage-e95e66242690", "Kluczowe funkcjonalności automatyki:")}</span>
                        {z.bullets.map((b, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-[#17211C]/85">
                            <CheckCircle2 className="w-4 h-4 text-[#0E4637] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-[#17211C]/10 flex flex-wrap gap-4">
                        <button
                          onClick={onOpenConsultation}
                          className="px-5 py-2.5 bg-[#0E4637] hover:bg-[#17211C] text-[#E6F15A] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                        >
                          <span>{cmsText("OfficesPage-298c1b7636b3", "Skonsultuj projekt biura")}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Technical spec sidebar */}
                    <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-[#17211C]/10 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17211C] pb-2 border-b border-[#17211C]/10">{cmsText("OfficesPage-e68bbab81cab", "Specyfikacja integracji KNX")}</h4>

                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-[#17211C]/60 block text-[11px]">{cmsText("OfficesPage-40ac484af1e3", "Protokół magistralny:")}</span>
                          <span className="font-semibold text-[#17211C]">{cmsText("OfficesPage-e980fb728654", "KNX TP (skrętka certyfikowana) + DALI-2")}</span>
                        </div>
                        <div>
                          <span className="text-[#17211C]/60 block text-[11px]">{cmsText("OfficesPage-2105e9f04011", "Integracja HVAC:")}</span>
                          <span className="font-semibold text-[#17211C]">{cmsText("OfficesPage-6d26d0590226", "Bramki Modbus / BACnet do BMS obiektu")}</span>
                        </div>
                        <div>
                          <span className="text-[#17211C]/60 block text-[11px]">{cmsText("OfficesPage-bcea7a7573ef", "Osprzęt sterujący:")}</span>
                          <span className="font-semibold text-[#17211C]">{cmsText("OfficesPage-12f4dc62c8ea", "JUNG KNX F 40 / F 50 / czujniki obecności Mini")}</span>
                        </div>
                        <div>
                          <span className="text-[#17211C]/60 block text-[11px]">{cmsText("OfficesPage-0215910666b1", "Wpływ na zużycie energii:")}</span>
                          <span className="font-semibold text-[#0E4637]">{cmsText("OfficesPage-11724ef447bf", "Potencjał oszczędności oceniany dla projektu")}</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10 text-[11px] text-[#17211C]/75">
                        <p className="font-semibold text-[#17211C] mb-1">{cmsText("OfficesPage-b536cd149c9d", "Dla firm fit-out i generalnych wykonawców:")}</p>{cmsText("OfficesPage-def6fd0f8553", "Dostarczamy gotowe schematy podłączenia rozdzielnic oraz wsparcie na budowie w Warszawie i okolicach.")}</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Office Lead Capture Form */}
      <section id="biuro-kontakt" className="py-12 sm:py-16 bg-[#F7F8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText("OfficesPage-99d425f558d2", "Audyt i Wycena")}</span>
            <h2 className="text-3xl font-bold font-display text-[#17211C]">{cmsText("OfficesPage-47c23fafeb9e", "Prześlij rzuty biura do wstępnej analizy")}</h2>
            <p className="text-sm text-[#17211C]/75 mt-2">{cmsText("OfficesPage-8c33acd67d79", "Otrzymasz wstępną koncepcję magistrali KNX, podział na strefy DALI oraz szacunek kosztów wdrożenia.")}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ContactForm
              onOpenPrivacy={onOpenPrivacy}
              defaultType="biuro"
              sourceContext="Podstrona: Automatyka dla biur"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
