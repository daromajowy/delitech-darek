import React from 'react';
import { Camera, Cable, Monitor, ArrowRight } from 'lucide-react';
import { PageId } from '../types';
import { pageUrl } from '../site';
import room from '../assets/images/proav-room-hybrid.webp';
import { ContentHero, ContactCta, contentWidth, actionClass } from '../components/ContentSections';

interface OfficesPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
  initialHash?: string;
}

export const OfficesPage: React.FC<OfficesPageProps> = ({ onOpenConsultation }) => (
  <div>
    <ContentHero eyebrow="Usługa dodatkowa · ProAV" title="Dobrze wyposażona sala spotkań.">
      <p>
        Pomagamy dobrać obraz, dźwięk i przyłącza do konkretnego pomieszczenia. Przygotowujemy
        rozwiązania do wideorozmów, prezentacji i spotkań zespołu.
      </p>
      <a
        href={pageUrl('proav')}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-ink text-sm font-semibold"
      >
        Zobacz rozwiązania ProAV <ArrowRight size={18} aria-hidden="true" />
      </a>
    </ContentHero>
    <section id="konferencyjne" className="py-16 sm:py-20 bg-white">
      <div className={contentWidth}>
        <figure>
          <img
            src={room}
            alt="Przykładowa sala spotkań z wideobarem i ekranem"
            className="w-full max-h-[520px] object-cover rounded-2xl"
          />
          <figcaption className="text-xs text-ink/65 mt-3">
            Wizualizacja przykładowego rozwiązania ProAV
          </figcaption>
        </figure>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            {
              icon: Camera,
              title: 'Rozmowy online',
              text: 'Kamery, wideobary i mikrofony dobrane do wielkości stołu, akustyki oraz platformy spotkań.',
            },
            {
              icon: Monitor,
              title: 'Czytelny obraz',
              text: 'Monitor lub ekran, wygodne udostępnianie prezentacji oraz uzgodniony sposób obsługi.',
            },
            {
              icon: Cable,
              title: 'Porządek w połączeniach',
              text: 'Mediaporty, gniazda w stole, trasy przewodów i okablowanie dopasowane do urządzeń.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-surface rounded-xl p-7 border border-ink/15">
              <Icon size={26} aria-hidden="true" />
              <h2 className="font-bold text-xl mt-4 mb-3">{title}</h2>
              <p className="text-sm leading-relaxed text-ink/80">{text}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-ink/80 leading-relaxed">
          Zakres obejmuje wyposażenie i uzgodnione sterowanie salą. Wymagania sieciowe, konta i
          licencje omawiamy z osobą odpowiedzialną za IT.
        </p>
        <a href={pageUrl('proav')} className={actionClass + ' mt-6'}>
          Poznaj pełny zakres ProAV <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
    <ContactCta
      title="Opowiedz nam o swojej sali."
      text="Podaj liczbę miejsc, używane aplikacje i obecny sprzęt. Ustalimy, co można wykorzystać i czego brakuje."
      onClick={onOpenConsultation}
    />
  </div>
);
