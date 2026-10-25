import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PageId } from '../types';
import { pageUrl } from '../site';
import { ContentHero, ContactCta, contentWidth } from '../components/ContentSections';

interface KnowledgePageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}
const questions = [
  [
    'Kiedy zacząć planowanie?',
    'Najlepiej podczas projektowania wnętrza, przed ustaleniem i wykonaniem okablowania. Możemy wtedy uzgodnić funkcje, miejsca przycisków i potrzeby instalacyjne z architektem oraz elektrykiem.',
  ],
  [
    'Czy muszę od razu automatyzować wszystko?',
    'Zakres wybierasz według potrzeb i budżetu. Warto wcześniej wskazać także przyszłe funkcje, aby przewidzieć miejsce oraz odpowiednią infrastrukturę. Późniejsza rozbudowa zależy od przygotowania instalacji i dostępnych urządzeń.',
  ],
  [
    'Co to jest scena?',
    'To zestaw wybranych ustawień uruchamiany jednym poleceniem. Na przykład scena „Kolacja” może przyciemnić światło w salonie, włączyć lampę nad stołem i zasłonić okna. Jej działanie ustalamy z Tobą.',
  ],
  [
    'Czy dom obsłużę zwykłym przyciskiem?',
    'Tak — sposób codziennej obsługi planujemy wokół zrozumiałych przycisków i ich opisów. Panel lub aplikacja mogą uzupełniać sterowanie. Nie trzeba wykonywać każdej czynności telefonem.',
  ],
  [
    'Ile kosztuje instalacja?',
    'Cena zależy od funkcji, liczby obwodów i stref, wybranych urządzeń oraz zakresu prac. Sam metraż nie wystarcza do wyceny. Najpierw zbieramy potrzeby i sprawdzamy projekt, a potem przygotowujemy ofertę.',
  ],
  [
    'Czy można wykorzystać istniejące urządzenia?',
    'Sprawdzamy konkretny model, dostępne połączenia i możliwości sterowania. Dotyczy to m.in. opraw, rolet, klimatyzacji i wentylacji. Czasem potrzebny jest dodatkowy interfejs, zmiana urządzenia lub okablowania.',
  ],
  [
    'Czy można zmienić funkcje po zamieszkaniu?',
    'Wiele ustawień, np. scen czy przypisania przycisków, można zmienić w konfiguracji. Dodanie nowego urządzenia lub obwodu może wymagać także prac instalacyjnych. Zakres sprawdzamy przed zmianą.',
  ],
  [
    'Co daje konfigurator architektowi?',
    'Pomaga zebrać pomieszczenia, potrzebne funkcje i punkty sterowania na rzucie. Powstaje wspólna podstawa do rozmowy z inwestorem i integratorem. Dokumentacja wykonawcza i wycena wymagają osobnego opracowania.',
  ],
];
export const KnowledgePage: React.FC<KnowledgePageProps> = ({ onOpenConsultation }) => (
  <div>
    <ContentHero eyebrow="Przed pierwszą rozmową" title="KNX — pytania i proste odpowiedzi.">
      <p>
        O planowaniu, obsłudze i kosztach automatyki domu. Jeśli dopiero zaczynasz, nie musisz znać
        nazw urządzeń ani technicznych skrótów.
      </p>
    </ContentHero>
    <section id="knx-dla-inwestora" className="py-16 sm:py-20 bg-white">
      <div className={contentWidth}>
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
          {questions.map(([q, a]) => (
            <article key={q} className="border-t border-ink/20 pt-6">
              <h2 className="text-xl font-bold font-display">{q}</h2>
              <p className="mt-4 leading-relaxed text-ink/80">{a}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-6 text-sm font-semibold">
          {[
            ['homes', 'Planowanie i koszt'],
            ['architects', 'Wsparcie dla architektów'],
            ['knx', 'Czym jest standard KNX'],
          ].map(([page, label]) => (
            <a
              key={page}
              href={pageUrl(page as PageId)}
              className="inline-flex items-center gap-2 underline underline-offset-4"
            >
              {label}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
    <ContactCta
      title="Masz pytanie o swój projekt?"
      text="Opisz etap inwestycji i to, co chcesz osiągnąć. Zaczniemy od potrzeb, a szczegóły techniczne ustalimy wspólnie."
      onClick={onOpenConsultation}
    />
  </div>
);
