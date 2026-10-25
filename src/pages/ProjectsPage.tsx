import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PageId } from '../types';
import { IMAGES } from '../assets';
import { pageUrl } from '../site';
import { ContentHero, ContactCta, FeatureList, contentWidth } from '../components/ContentSections';

interface ProjectsPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}
export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenConsultation }) => (
  <div>
    <ContentHero eyebrow="Pomysły do omówienia" title="Jak może działać Twój dom?">
      <p>
        Dwa przykładowe zestawy funkcji. To ilustracje możliwego zakresu, a nie prezentacja
        wykonanych przez nas inwestycji. Każdy projekt ustalamy indywidualnie.
      </p>
    </ContentHero>
    <section className="py-16 sm:py-20 bg-white">
      <div className={contentWidth + ' grid lg:grid-cols-2 gap-7'}>
        {[
          {
            title: 'Dom jednorodzinny',
            image: IMAGES.residentialResidence,
            lead: 'Światło, osłony okienne i temperatura dopasowane do rytmu domowników.',
            items: [
              'Przy wejściu: scena „Wyjście” wyłącza wybrane światła.',
              'W salonie: sceny do odpoczynku i przyjmowania gości.',
              'W sypialni: obsługa rolet i światła przy łóżku.',
              'Na zewnątrz: uzgodnione sterowanie oświetleniem tarasu.',
            ],
          },
          {
            title: 'Apartament',
            image: IMAGES.salonOsiedle,
            lead: 'Spójny wygląd osprzętu i wygodna obsługa najważniejszych funkcji.',
            items: [
              'W kuchni: osobne światło do przygotowania posiłków.',
              'Przy stole: scena „Kolacja” ze światłem o wybranej intensywności.',
              'W salonie: sterowanie zasłonami i oświetleniem z jednego miejsca.',
              'W nocy: dyskretne oświetlenie przejścia do łazienki.',
            ],
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl overflow-hidden border border-ink/15 bg-surface"
          >
            <img
              src={item.image}
              alt={'Przykładowa aranżacja: ' + item.title}
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
            />
            <div className="p-7 sm:p-9">
              <p className="text-xs uppercase font-mono tracking-widest">Przykładowy scenariusz</p>
              <h2 className="text-3xl font-bold font-display mt-3">{item.title}</h2>
              <p className="mt-4 mb-6 text-ink/80 leading-relaxed">{item.lead}</p>
              <FeatureList items={item.items} />
            </div>
          </article>
        ))}
        <p className="lg:col-span-2 text-sm text-ink/75 max-w-3xl">
          Przed doborem sprawdzamy możliwości instalacji, opraw, napędów i pozostałych urządzeń.
          Zdjęcia są ilustracjami koncepcji.
        </p>
        <a
          href={pageUrl('solutions')}
          className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
        >
          Poznaj więcej funkcji domu <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
    <ContactCta onClick={onOpenConsultation} />
  </div>
);
