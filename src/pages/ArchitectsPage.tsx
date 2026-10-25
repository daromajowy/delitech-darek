import React from 'react';
import { ArrowRight, Compass, FileText, SlidersHorizontal, Users } from 'lucide-react';
import { PageId } from '../types';
import { plannerUrl, pageUrl } from '../site';
import { IMAGES } from '../assets';
import { ContentHero, ContactCta, FeatureList, contentWidth } from '../components/ContentSections';

interface ArchitectsPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}
const support = [
  {
    icon: Compass,
    title: 'Funkcje przed urządzeniami',
    text: 'Wspólnie ustalamy, co ma dziać się w każdym pokoju. Przekładamy potrzeby inwestora na sceny, funkcje przycisków i miejsca sterowania.',
  },
  {
    icon: FileText,
    title: 'Uzgodnienia instalacyjne',
    text: 'Określamy wymagania automatyki i uzgadniamy je z projektantem instalacji oraz wykonawcami. Zakres dokumentacji ustalamy dla konkretnego projektu.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Osprzęt pasujący do wnętrza',
    text: 'Pomagamy wybrać przyciski, panele, materiały i sposób montażu. Sprawdzamy funkcje i wymagania techniczne wybranych modeli.',
  },
  {
    icon: Users,
    title: 'Wspólne sprawdzenie działania',
    text: 'Po uruchomieniu uzgadniamy sceny i sposób obsługi z domownikami oraz architektem. Każdy wie, za jaką część prac odpowiada.',
  },
];

export const ArchitectsPage: React.FC<ArchitectsPageProps> = ({ onOpenConsultation }) => (
  <div>
    <ContentHero
      eyebrow="Dla architektów wnętrz i projektantów"
      title="Dobry projekt wnętrza. Przemyślane sterowanie."
    >
      <p>
        Pomagamy zaplanować automatykę domów i apartamentów już na etapie koncepcji. Ty określasz
        układ i charakter wnętrza, a wspólnie ustalamy, jak będzie się z niego korzystać.
      </p>
      <div className="flex flex-wrap gap-4 pt-2">
        <a
          href={plannerUrl()}
          className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-ink font-semibold text-sm rounded-lg"
        >
          Otwórz konfigurator KNX <ArrowRight size={18} aria-hidden="true" />
        </a>
        <button
          onClick={onOpenConsultation}
          className="px-5 py-3 border border-white/40 rounded-lg text-sm font-semibold"
        >
          Omów projekt z zespołem
        </button>
      </div>
    </ContentHero>
    <section id="wsparcie" className="py-16 sm:py-20 bg-white">
      <div className={contentWidth}>
        <h2 className="text-3xl font-bold font-display mb-9">W czym wspieramy pracownię?</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {support.map(({ icon: Icon, title, text }) => (
            <article key={title} className="p-7 rounded-xl bg-surface border border-ink/15">
              <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
              <h3 className="text-xl font-bold mt-5 mb-3">{title}</h3>
              <p className="text-ink/80 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
    <section id="pakiet" className="py-16 sm:py-20 bg-mist/60">
      <div className={contentWidth}>
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-widest mb-3">Konfigurator KNX</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            Zbierz pomysł na dom w jednym projekcie.
          </h2>
          <p className="mt-5 text-ink/80 leading-relaxed">
            Pracuj na pomieszczeniach i rzucie. Opisz funkcje, dobierz punkty sterowania i przygotuj
            zestawienie do dalszych uzgodnień.
          </p>
        </div>
        <ol className="grid md:grid-cols-3 gap-5 mt-9">
          {[
            [
              'Pomieszczenia i potrzeby',
              'Dodaj pomieszczenia, wybierz potrzebne funkcje i ustal sceny codziennego życia.',
            ],
            [
              'Przyciski na rzucie',
              'Wczytaj PDF, rozmieść punkty sterowania i przypisz funkcje przyciskom.',
            ],
            [
              'Zestawienie do rozmowy',
              'Przygotuj podsumowanie projektu, które pomoże uzgodnić zakres i dobór urządzeń.',
            ],
          ].map(([title, text], i) => (
            <li key={title} className="rounded-xl border border-ink/15 bg-white p-6">
              <span className="font-mono text-sm text-ink/65">0{i + 1}</span>
              <h3 className="text-lg font-bold mt-4 mb-3">{title}</h3>
              <p className="text-sm leading-relaxed text-ink/80">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-7 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <a
            href={plannerUrl()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-accent rounded-lg font-semibold text-sm shrink-0"
          >
            Uruchom konfigurator <ArrowRight size={18} aria-hidden="true" />
          </a>
          <p className="text-sm text-ink/75 max-w-2xl">
            Konfigurator porządkuje założenia. Projekt wykonawczy, dobór techniczny i wycenę
            przygotowujemy po ich weryfikacji.
          </p>
        </div>
      </div>
    </section>
    <section id="jung" className="py-16 sm:py-20 bg-white">
      <div className={contentWidth + ' grid lg:grid-cols-2 gap-10 items-center'}>
        <figure>
          <img
            src={IMAGES.knxSwitchHardware}
            alt="Przykład minimalistycznego osprzętu ściennego"
            className="w-full aspect-[4/3] object-cover rounded-2xl"
            loading="lazy"
          />
          <figcaption className="text-xs text-ink/60 mt-3">
            Ilustracja kierunku estetycznego. Model i wykończenie dobieramy indywidualnie.
          </figcaption>
        </figure>
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-3">
            Przycisk jest częścią wnętrza
          </p>
          <h2 className="text-3xl font-bold font-display">Forma, materiał i wygodna obsługa.</h2>
          <p className="my-5 text-ink/80 leading-relaxed">
            Przy wyborze osprzętu, także kolekcji JUNG, łączymy wygląd z funkcją. Liczy się miejsce
            przycisku, układ klawiszy, oznaczenia i sposób obsługi przez domowników.
          </p>
          <FeatureList
            items={[
              'Funkcje klawiszy uzgodnione z inwestorem.',
              'Wysokości i miejsca montażu skoordynowane z wnętrzem.',
              'Wykończenia i dostępność próbek potwierdzone przed wyborem.',
            ]}
          />
          <a
            href={pageUrl('solutions', 'sceny')}
            className="inline-flex items-center gap-2 font-semibold text-sm underline underline-offset-4 mt-6"
          >
            Zobacz przykłady scen <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
    <ContactCta
      title="Omówmy założenia Twojego projektu."
      text="Najlepiej porozmawiać przed ustaleniem okablowania. Przygotuj etap inwestycji, układ pomieszczeń i listę funkcji, na których zależy klientowi."
      onClick={onOpenConsultation}
    />
  </div>
);
