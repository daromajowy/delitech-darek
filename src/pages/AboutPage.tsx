import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PageId } from '../types';
import { pageUrl } from '../site';
import {
  ContentHero,
  ContactCta,
  FeatureList,
  ProjectSteps,
  contentWidth,
  actionClass,
} from '../components/ContentSections';

interface AboutPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation }) => (
  <div>
    <ContentHero eyebrow="O InteliSpaces" title="Technologia ma pasować do ludzi i wnętrza.">
      <p>
        Łączymy automatykę KNX z codziennym życiem w domach i apartamentach. Pracujemy z
        inwestorami, architektami wnętrz i projektantami instalacji — od ustalenia funkcji po
        uruchomienie uzgodnionego zakresu.
      </p>
    </ContentHero>
    <section className="py-16 sm:py-20 bg-white">
      <div className={contentWidth + ' grid lg:grid-cols-2 gap-10 items-start'}>
        <div>
          <h2 className="text-3xl font-bold font-display">
            Poznaj ludzi, z którymi będziesz pracować.
          </h2>
          <p className="my-5 text-ink/80 leading-relaxed">
            InteliSpaces rozwijamy w ramach Delitech. Nasz zespół łączy doświadczenie w koordynacji
            projektów, integracji automatyki i instalacjach elektrycznych. Rozmawiasz z osobami
            zaangażowanymi w przygotowanie i wdrożenie rozwiązania.
          </p>
          <a href={pageUrl('team')} className={actionClass}>
            Poznaj nasz zespół <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="p-7 sm:p-9 bg-surface rounded-2xl border border-ink/15">
          <h2 className="text-2xl font-bold font-display mb-5">Co ustalamy przed rozpoczęciem?</h2>
          <FeatureList
            items={[
              'Jakie funkcje są potrzebne i jak będą obsługiwane.',
              'Jakie urządzenia można ze sobą połączyć.',
              'Za co odpowiadamy my, projektant i pozostali wykonawcy.',
              'Zakres prac, dokumentacji, budżet oraz terminy.',
              'Sposób sprawdzenia działania i przekazania instalacji.',
            ]}
          />
        </div>
      </div>
    </section>
    <section className="py-16 sm:py-20 bg-surface">
      <div className={contentWidth}>
        <h2 className="text-3xl font-bold font-display mb-4">Jasny proces współpracy.</h2>
        <p className="text-ink/80 mb-8 max-w-2xl">
          Rozpoczynamy od potrzeb domowników. Szczegółowy zakres usług potwierdzamy w ofercie dla
          danej inwestycji.
        </p>
        <ProjectSteps />
      </div>
    </section>
    <section className="py-14 bg-white">
      <div className={contentWidth + ' grid md:grid-cols-2 gap-8'}>
        <div>
          <h2 className="text-2xl font-bold font-display">Spotkajmy się w Warszawie.</h2>
          <p className="text-ink/80 leading-relaxed mt-4">
            Nasze biuro mieści się przy ul. Konwaliowej 7, lok. 103. Możemy też zacząć od rozmowy
            online. Miejsce realizacji i możliwość dojazdu ustalamy przy omawianiu projektu.
          </p>
          <a
            href={pageUrl('contact')}
            className="inline-flex font-semibold text-sm underline underline-offset-4 mt-5"
          >
            Dane kontaktowe i dojazd
          </a>
        </div>
        <div className="border border-ink/15 rounded-xl p-6">
          <p className="text-xs uppercase font-mono tracking-widest text-ink/65">
            Dodatkowa usługa
          </p>
          <h2 className="text-2xl font-bold font-display mt-3">Wyposażenie sal spotkań ProAV.</h2>
          <p className="text-ink/80 leading-relaxed mt-4">
            Pomagamy dobrać obraz, dźwięk, wideokonferencje i przyłącza do konkretnej sali.
          </p>
          <a
            href={pageUrl('proav')}
            className="inline-flex items-center gap-2 mt-5 font-semibold text-sm underline underline-offset-4"
          >
            Poznaj zakres ProAV <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
    <ContactCta onClick={onOpenConsultation} />
  </div>
);
