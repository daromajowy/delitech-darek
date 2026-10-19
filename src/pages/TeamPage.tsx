import React from 'react';
import { PageId } from '../types.ts';
import { Users, Award, ShieldCheck, Mail, Phone, ArrowRight, Sparkles, Cpu, Layers } from 'lucide-react';
import janekPhoto from '../assets/images/janek.jpg';
import darekPhoto from '../assets/images/darek.jpg';

interface TeamPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  certifications: string[];
  photoUrl?: string;
  email?: string;
  phone?: string;
  specialization: string;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onNavigate, onOpenConsultation }) => {
  // Przykładowa lista członków zespołu z miejscem na własne zdjęcia i opisy
  const teamMembers: TeamMember[] = [
    {
      id: 'darek',
      name: "Darek Maj",
      role: "Integrator i koordynator wdrożen KNX",
      specialization: "Automatyka komercyjna, integracje DALI-2",
      bio: "Wieloletnie doświadczenie w branży IT, w zarządzaniu projektami w dużych korporacjach w srodkowisku ściśle regulowanym. Odpowiedzialny za wspópłprace z projektatnami,  koncepcje techniczne, konsutlacje z Inwestorem,  programowanie podzespołów KNX oraz nadzór nad wdrożeniami.",
      certifications: ["KNX Partner Advanced", "DALI-2 Specialist", "ETS Certified"],
      photoUrl: darekPhoto,
      email: "darek@intelispaces.pl",
      phone: '+48 885 253 934',
    },
    {
      id: 'janek',
      name: "Jan Jasek",
      role: "głowny Architekt,Integrator i koordynator Integracji instalacji KNX ",
      specialization: "Współpraca z pracowniami architektonicznymi, dobór i doradztwo w osprzęcie KNX, Programowanie ETS, wizualizacje, logistyka dostaw, konsultacje i wsparcie dla Inwestorów",
      bio: "Specjalista w zakresie programowania logiki sterowania, prefabrykacji szaf automatyki oraz uruchamiania instalacji na obiektach rezydencjalnych i biurowych. Posiada ogromne doświadczenie w ofercie podzespołów systemów automatyki oraz przykłada wiele  dbałości o bezbłędny standard montażu.",
      certifications: ["KNX Cerified Partner"],
      photoUrl: janekPhoto,
      email: "janek@intelispaces.pl",
    },
    {
      id: 'Marek',
      name: "Marek Sakowski",
      role: "Specjalista ds. instalacji elektrycznych i automatyki budynkowej",
      specialization: "xxx",
      bio: "Specjalista ds. instalacji elektrycznych i automatyki budynkowej 20 lat doświadczenia w realizacji instalacji elektrycznych, automatyki budynkowej KNX, monitoringu, systemów alarmowych i fotowoltaiki. Łączy praktyczną wiedzę z dbałością o bezpieczeństwo, niezawodność i precyzję wykonania. Posiada pełne uprawnienia elektryczne, wykonuje pomiary i przeprowadza odbiory instalacji. Zapewnia fachowe wsparcie na każdym etapie realizacji — od doboru rozwiązań, przez montaż i uruchomienie, po końcową weryfikację poprawności działania..",
      certifications: ["xxxx", "xxx"],
      email: "marek@intelispaces.pl",
    },
  ];

  return (
    <div className="space-y-0">
      {/* 1. Hero sekcja */}
      <section className="bg-ink text-white py-16 lg:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-ink border border-silver/20 rounded-full text-xs font-mono uppercase tracking-wider text-accent">
              <Users className="w-3.5 h-3.5" />
              <span>{"Ludzie · Wiedza · Inżynieria"}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white">{"Kim jesteśmy"}</h1>
            <p className="text-base sm:text-lg text-mist/80 leading-relaxed font-display">{"Poznaj zespół inżynierów i specjalistów INTELISPACES. Łączymy precyzyjną wiedzę instalacyjną, certyfikację standardu KNX oraz wrażliwość na architekturę wnętrz."}</p>
          </div>
        </div>
      </section>

      {/* 2. Krótka misja i podejście */}
      <section className="py-12 bg-white border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-surface border border-ink/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-ink text-accent flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg font-display text-ink">{"Certyfikowana wiedza"}</h3>
              <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">{"Każdy projekt prowadzimy zgodnie z międzynarodowymi normami KNX i standardami bezpieczeństwa instalacji."}</p>
            </div>

            <div className="p-6 rounded-xl bg-surface border border-ink/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-ink text-accent flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg font-display text-ink">{"Własna prefabrykacja"}</h3>
              <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">{"Nie zlecamy szaf automatyki podwykonawcom. Montujemy i testujemy rozdzielnice we własnym punkcie w Warszawie."}</p>
            </div>

            <div className="p-6 rounded-xl bg-surface border border-ink/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-ink text-accent flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg font-display text-ink">{"Partner dla architektów"}</h3>
              <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">{"Mówimy językiem projektantów i wspomagamy ich pracę. Dbamy o spójność detali, wzornictwo osprzętu i czytelne wytyczne dla instalatorów."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Karty Zespołu (Team Grid) */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-ink font-semibold block">{"Poznaj nasz zespół"}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">{"Zespół stojący za Twoją instalacją"}</h2>
            <p className="text-sm sm:text-base text-ink/75 leading-relaxed">{"Prezentację naszego zespołu."}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Kontener na zdjęcie / awatar */}
                  <div className="aspect-[4/5] bg-ink relative flex items-center justify-center text-white overflow-hidden group">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    <div
                      className={`flex flex-col items-center justify-center text-center p-6 space-y-2 ${
                        member.photoUrl ? 'hidden' : 'flex'
                      }`}
                    >
                      <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-bold font-display text-accent">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="text-[11px] font-mono text-silver/80 uppercase tracking-wider">{"[ Miejsce na oryginalne zdjęcie ]"}</span>
                    </div>

                    {/* Tag specjalizacji w rogu */}
                    <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] text-mist border border-white/10 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-accent shrink-0" />
                      <span className="truncate">{member.specialization}</span>
                    </div>
                  </div>

                  {/* Treść karty */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold font-display text-ink">{member.name}</h3>
                      <p className="text-xs font-semibold text-ink uppercase tracking-wider mt-0.5 font-mono">
                        {member.role}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Certyfikaty / Tagi */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {member.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-2.5 py-1 bg-surface border border-ink/10 rounded-md text-[10px] font-mono font-medium text-ink"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stopka karty z kontaktem */}
                {(member.email || member.phone) && (
                  <div className="p-4 px-6 bg-surface/80 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-ink/70">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-ink flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-ink" />
                        <span>{member.email}</span>
                      </a>
                    )}
                    {member.phone && (
                      <a
                        href={`tel:${member.phone.replace(/\s+/g, '')}`}
                        className="hover:text-ink flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-ink" />
                        <span>{member.phone}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sekcja CTA – Zaproszenie do kontaktu */}
      <section className="py-16 sm:py-20 bg-white border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-2xl bg-ink text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">{"Dołącz do grona zadowolonych inwestorów"}</span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">{"Porozmawiajmy o Twojej inwestycji"}</h3>
              <p className="text-xs sm:text-sm text-silver max-w-xl leading-relaxed">{"Skontaktuj się bezpośrednio z naszym zespołem. Przeanalizujemy rzuty architektoniczne i przygotujemy propozycję automatyki dopasowaną do potrzeb."}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-white text-ink text-xs font-bold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap"
              >{"Umów rozmowę z inżynierem"}</button>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto px-6 py-3 border border-white/20 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap"
              >{"Przejdź do kontaktu"}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
