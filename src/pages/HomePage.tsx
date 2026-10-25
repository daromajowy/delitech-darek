import React from 'react';
import {
  ArrowRight,
  Sun,
  Blinds,
  Thermometer,
  SlidersHorizontal,
  ShieldCheck,
  Music2,
  Monitor,
} from 'lucide-react';
import { PageId } from '../types';
import { pageUrl, plannerUrl } from '../site';
import { HeroVideo } from '../components/HeroVideo';
import { DayRhythm } from '../components/DayRhythm';
import { KnxFilm } from '../components/KnxFilm';
import { SmartHomeIntegrations } from '../components/SmartHomeIntegrations';
import { ProjectSteps, ContactCta, contentWidth, actionClass } from '../components/ContentSections';
import { IMAGES } from '../assets';

interface HomePageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}

const functions = [
  {
    icon: Sun,
    title: 'Światło',
    text: 'Jasno do pracy, przytulnie przy kolacji, dyskretnie w nocy.',
    hash: 'dali',
  },
  {
    icon: Blinds,
    title: 'Rolety i zasłony',
    text: 'Cień w upalny dzień i prywatność po zmroku.',
    hash: 'fasady',
  },
  {
    icon: Thermometer,
    title: 'Temperatura',
    text: 'Ogrzewanie i chłodzenie dopasowane do poszczególnych pokoi.',
    hash: 'hvac',
  },
  {
    icon: SlidersHorizontal,
    title: 'Przyciski i sceny',
    text: 'Jedno naciśnięcie przygotowuje dom do wyjścia lub odpoczynku.',
    hash: 'sceny',
  },
  {
    icon: ShieldCheck,
    title: 'Dom pod kontrolą',
    text: 'Wybrane powiadomienia i reakcje na zdarzenia, także podczas nieobecności.',
    hash: 'bezpieczenstwo',
  },
  {
    icon: Music2,
    title: 'Połączone urządzenia',
    text: 'Muzyka, domofon czy podgląd energii w uzgodnionym systemie.',
    hash: 'integracje',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onOpenConsultation }) => (
  <div>
    <HeroVideo />
    <section className="relative overflow-hidden bg-surface py-12 lg:py-20 border-b border-ink/10">
      <div className="absolute inset-0 bg-grid-subtle opacity-70 pointer-events-none" />
      <div className={contentWidth + ' relative'}>
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-mono uppercase tracking-widest text-ink/80 mb-5">
              Inteligentne domy i apartamenty · KNX
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.08] text-balance">
              Twój dom.
              <br />
              Twój sposób życia.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-ink/80 leading-relaxed max-w-2xl">
              Łączymy światło, rolety, temperaturę i sterowanie w jeden przemyślany system.
              Planujemy instalację KNX, dobieramy urządzenia i uruchamiamy uzgodnione funkcje w
              domach i apartamentach.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={onOpenConsultation} className={actionClass}>
                Porozmawiajmy o Twoim domu <ArrowRight size={18} aria-hidden="true" />
              </button>
              <a
                href={pageUrl('solutions')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white border border-ink/20 font-semibold text-sm hover:bg-mist"
              >
                Zobacz, co może Twój dom
              </a>
            </div>
            <p className="mt-6 text-sm text-ink/70">
              Dla inwestorów, architektów wnętrz i projektantów instalacji.
            </p>
          </div>
          <div className="lg:col-span-5">
            <KnxFilm />
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-16 sm:py-20">
      <div className={contentWidth}>
        <p className="text-xs font-mono uppercase tracking-widest text-ink/70 mb-3">
          Od pomysłu do wygodnej codzienności
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold font-display mb-9">
          Planujesz dom czy projektujesz wnętrze?
        </h2>
        <div className="grid lg:grid-cols-12 gap-6">
          <article className="lg:col-span-7 bg-ink text-white rounded-2xl overflow-hidden flex flex-col">
            <img
              src={IMAGES.salonOsiedle}
              alt="Przykładowy salon z dużymi przeszkleniami"
              className="w-full h-60 object-cover"
              loading="lazy"
            />
            <div className="p-7 sm:p-9 flex flex-col flex-1">
              <p className="text-xs font-mono uppercase tracking-widest text-accent">
                Nasza główna specjalizacja
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold font-display mt-3">
                Domy i apartamenty
              </h3>
              <p className="mt-4 text-mist/90 leading-relaxed">
                Zaczynamy od tego, jak chcesz mieszkać. Ustalamy funkcje każdego pomieszczenia,
                miejsca sterowania i zakres instalacji. Możesz zacząć od prostych scen, które
                naprawdę przydadzą się na co dzień.
              </p>
              <a
                href={pageUrl('homes')}
                className="mt-7 self-start inline-flex items-center gap-2 bg-accent text-ink font-semibold px-5 py-3 rounded-lg hover:bg-accent-hover"
              >
                Zaplanuj automatykę domu <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </article>
          <article className="lg:col-span-5 bg-surface border border-ink/15 rounded-2xl p-7 sm:p-9 flex flex-col">
            <p className="text-xs font-mono uppercase tracking-widest text-ink/70">
              Dla architektów i projektantów
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display mt-3">
              Ty projektujesz wnętrze.
              <br />
              My pomagamy zaplanować sterowanie.
            </h3>
            <p className="mt-5 text-ink/80 leading-relaxed">
              Ustalimy funkcje przycisków, dopasujemy osprzęt do wnętrza i uzgodnimy potrzeby
              instalacyjne. Konfigurator KNX pomaga zebrać założenia na rzucie pomieszczeń.
            </p>
            <ol className="my-7 space-y-3 text-sm text-ink/80">
              <li>01 · Pomieszczenia i codzienne potrzeby</li>
              <li>02 · Przyciski, funkcje i miejsca na rzucie</li>
              <li>03 · Zestawienie do omówienia z zespołem</li>
            </ol>
            <div className="mt-auto flex flex-wrap gap-5 items-center">
              <a
                href={pageUrl('architects')}
                className="font-semibold text-sm underline underline-offset-4"
              >
                Zobacz, jak współpracujemy
              </a>
              <a href={plannerUrl()} className={actionClass}>
                Konfigurator KNX <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section className="bg-surface py-16 sm:py-20 border-y border-ink/10">
      <div className={contentWidth}>
        <div className="max-w-2xl mb-9">
          <p className="text-xs font-mono uppercase tracking-widest text-ink/70 mb-3">
            Funkcje, z których korzystasz
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            Mniej czynności. Więcej wygody.
          </h2>
          <p className="mt-4 text-ink/80 leading-relaxed">
            Wybieramy to, co pasuje do Twojego domu. Możliwości połączenia sprawdzamy dla
            konkretnych urządzeń i instalacji.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {functions.map(({ icon: Icon, title, text, hash }) => (
            <a
              key={hash}
              href={pageUrl('solutions', hash)}
              className="group block bg-white rounded-xl border border-ink/15 p-7 hover:border-ink/40 hover:shadow-md transition-shadow"
            >
              <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
              <h3 className="mt-5 font-display font-bold text-xl">{title}</h3>
              <p className="mt-3 text-sm text-ink/80 leading-relaxed">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                Poznaj możliwości <ArrowRight size={16} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
    <SmartHomeIntegrations />
    <DayRhythm />

    <section className="py-16 sm:py-20 bg-surface">
      <div className={contentWidth}>
        <div className="max-w-2xl mb-9">
          <p className="text-xs font-mono uppercase tracking-widest text-ink/70 mb-3">
            Jasne ustalenia na każdym etapie
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            Jak powstaje Twoja instalacja?
          </h2>
          <p className="mt-4 text-ink/80 leading-relaxed">
            Najpierw potrzeby i zakres. Później dobór urządzeń, wykonanie i sprawdzenie działania.
          </p>
        </div>
        <ProjectSteps />
        <a
          href={pageUrl('homes', 'etapy')}
          className="inline-flex items-center gap-2 mt-7 text-sm font-semibold underline underline-offset-4"
        >
          Zobacz etapy i zasady wyceny <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
    <section className="bg-white py-10 border-y border-ink/10">
      <div className={contentWidth + ' flex flex-col md:flex-row md:items-center gap-6'}>
        <Monitor size={36} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-xs font-mono uppercase tracking-widest text-ink/65 mb-2">
            Dodatkowa usługa
          </p>
          <h2 className="text-xl font-bold font-display">ProAV do sal spotkań</h2>
          <p className="mt-2 text-sm text-ink/80 max-w-2xl">
            Wideobary, ekrany, przyłącza w stole i okablowanie. Dobieramy wyposażenie do sposobu
            prowadzenia spotkań.
          </p>
        </div>
        <a
          href={pageUrl('proav')}
          className="inline-flex items-center gap-2 font-semibold text-sm shrink-0 underline underline-offset-4"
        >
          Poznaj ProAV <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
    <ContactCta onClick={onOpenConsultation} />
  </div>
);
