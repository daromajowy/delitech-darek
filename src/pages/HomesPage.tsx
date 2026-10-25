import React from 'react';
import type { PageId } from '../types';
import { IMAGES } from '../assets';
import { pageUrl } from '../site';
import { ArrowRight } from 'lucide-react';
import {
  ContentHero,
  ContactCta,
  FeatureList,
  ProjectSteps,
  actionClass,
  contentWidth,
} from '../components/ContentSections';

interface HomesPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onOpenConsultation: () => void;
  initialHash?: string;
}

export function HomesPage({ onOpenConsultation }: HomesPageProps) {
  return (
    <>
      <ContentHero
        eyebrow="Domy i apartamenty · instalacje KNX"
        title="Dom zaplanowany wokół Ciebie."
      >
        <p>
          Łączymy światło, osłony okienne i temperaturę w wygodną obsługę. Ustalamy potrzebne
          funkcje, dobieramy urządzenia i uruchamiamy instalację razem z wykonawcami Twojego domu.
        </p>
        <button
          onClick={onOpenConsultation}
          className="inline-flex items-center gap-2 bg-accent text-ink px-6 py-3 rounded-lg text-sm font-semibold"
        >
          Porozmawiajmy o Twoim domu <ArrowRight size={18} />
        </button>
      </ContentHero>

      <section className="py-14 sm:py-20 bg-white">
        <div className={contentWidth}>
          <nav
            aria-label="Na tej stronie"
            className="flex flex-wrap gap-3 mb-14 text-sm font-semibold"
          >
            {[
              ['dom', 'Dom jednorodzinny'],
              ['apartament', 'Apartament'],
              ['etapy', 'Jak pracujemy'],
              ['koszt', 'Od czego zależy koszt'],
              ['modernizacja', 'Modernizacja'],
            ].map(([id, label]) => (
              <a
                key={id}
                href={'#' + id}
                className="px-4 py-2 border border-ink/20 rounded-full hover:bg-surface"
              >
                {label}
              </a>
            ))}
          </nav>
          <div id="dom" className="grid lg:grid-cols-2 gap-9 lg:gap-14 items-center">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-widest font-mono">Dom jednorodzinny</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display">
                Wygoda w każdym pomieszczeniu.
              </h2>
              <p className="text-ink/80 leading-relaxed">
                Przy wejściu wyłączasz wybrane światła. Z łóżka zasłaniasz okna. W salonie
                uruchamiasz scenę wieczorną. Zaczynamy od tego, jak korzystasz z domu — zakres
                automatyki dopasowujemy do tych potrzeb.
              </p>
              <FeatureList
                items={[
                  'Światło dopasowane do gotowania, odpoczynku i nocnego przejścia.',
                  'Rolety i żaluzje sterowane przyciskiem, harmonogramem lub czujnikami.',
                  'Osobne ustawienia temperatury w wybranych pokojach.',
                  'Uzgodnione sterowanie oświetleniem tarasu i ogrodu.',
                ]}
              />
            </div>
            <figure className="overflow-hidden rounded-2xl border border-ink/10">
              <img
                src={IMAGES.residentialResidence}
                width={1200}
                height={900}
                alt="Przykładowa nowoczesna rezydencja"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              <figcaption className="p-3 text-xs text-ink/65 bg-surface">
                Wizualizacja przykładowego domu
              </figcaption>
            </figure>
          </div>
          <div id="apartament" className="grid lg:grid-cols-2 gap-9 lg:gap-14 items-center mt-20">
            <figure className="overflow-hidden rounded-2xl border border-ink/10 lg:order-first order-last">
              <img
                src={IMAGES.salonOsiedle}
                width={1200}
                height={900}
                alt="Salon apartamentu z dużymi oknami"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              <figcaption className="p-3 text-xs text-ink/65 bg-surface">
                Przykładowa aranżacja apartamentu
              </figcaption>
            </figure>
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-widest font-mono">Apartament</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display">
                Mniej przycisków. Więcej porządku.
              </h2>
              <p className="text-ink/80 leading-relaxed">
                Wspólnie z architektem ustalamy miejsca sterowania i wygląd osprzętu. Jeden przycisk
                może obsługiwać kilka funkcji, a sceny łączą światło i zasłony w ustawienia na różne
                chwile dnia.
              </p>
              <FeatureList
                items={[
                  'Przyciski i panele dopasowane do materiałów we wnętrzu.',
                  'Sceny „Kolacja”, „Kino” i „Wyjście” ustalone z domownikami.',
                  'Sterowanie zasłonami, ogrzewaniem i klimatyzacją zgodnie z możliwościami urządzeń.',
                  'Miejsce na urządzenia i przewody uzgodnione przed wykończeniem.',
                ]}
              />
            </div>
          </div>
          <p className="mt-12 text-sm text-ink/70 max-w-3xl">
            Funkcje i integracje sprawdzamy dla konkretnych urządzeń. W apartamencie uwzględniamy
            również instalacje wspólne budynku i wymagane uzgodnienia z administracją.
          </p>
          <a href={pageUrl('solutions')} className={actionClass + ' mt-6'}>
            Zobacz, co może Twój dom <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section id="etapy" className="py-14 sm:py-20 bg-surface">
        <div className={contentWidth}>
          <p className="text-xs uppercase tracking-widest font-mono mb-3">
            Od pomysłu do uruchomienia
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-5">
            Wiesz, co robimy na każdym etapie.
          </h2>
          <p className="max-w-3xl text-ink/80 mb-9">
            Najlepiej porozmawiać przed wykonaniem instalacji elektrycznej. Zakres dokumentacji,
            montażu, uruchomienia i współpracy z pozostałymi ekipami określamy w ofercie.
          </p>
          <ProjectSteps />
        </div>
      </section>

      <section id="koszt" className="py-14 sm:py-20 bg-white">
        <div className={contentWidth}>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xs uppercase tracking-widest font-mono mb-3">
                Budżet bez zgadywania
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display">
                Od czego zależy koszt KNX?
              </h2>
              <p className="mt-5 text-ink/80">
                Sam metraż nie określa zakresu instalacji. Dwa podobne mieszkania mogą potrzebować
                zupełnie innej liczby obwodów, przycisków i integracji.
              </p>
            </div>
            <div className="p-7 rounded-2xl bg-surface border border-ink/10">
              <FeatureList
                items={[
                  'Liczba pomieszczeń, obwodów światła, rolet i stref temperatury.',
                  'Wybrany osprzęt, panele, wykończenia oraz sposób obsługi.',
                  'Integracje z ogrzewaniem, wentylacją, audio i innymi urządzeniami.',
                  'Stan okablowania oraz zakres projektu, montażu i programowania.',
                ]}
              />
              <p className="text-sm text-ink/70 mt-6">
                Na początek wystarczy etap inwestycji, lokalizacja i lista potrzeb. Przygotujemy
                zakres do wyceny.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="modernizacja" className="py-14 sm:py-20 bg-surface">
        <div className={contentWidth}>
          <div className="max-w-4xl space-y-5">
            <p className="text-xs uppercase tracking-widest font-mono">Istniejący dom lub remont</p>
            <h2 className="text-3xl font-bold font-display">Najpierw sprawdzamy instalację.</h2>
            <p className="text-ink/80">
              Oglądamy okablowanie, rozdzielnicę i urządzenia, które chcesz zachować. Dopiero wtedy
              ustalamy, co można rozbudować, gdzie potrzebne będą przewody i czy rozwiązania radiowe
              mają zastosowanie. Zakres prac oraz ingerencję we wnętrze poznajesz przed decyzją.
            </p>
            <a
              href={pageUrl('knowledge')}
              className="inline-flex items-center gap-2 font-semibold underline underline-offset-4"
            >
              Odpowiedzi na pytania o KNX <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <ContactCta onClick={onOpenConsultation} />
    </>
  );
}
