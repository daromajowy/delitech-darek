import React from 'react';
import { ArrowRight, AudioLines, Monitor, Users } from 'lucide-react';
import type { PageId } from '../types';
import { pageUrl } from '../site';
import { HeroVideo } from '../components/HeroVideo';
import { KnxFilm } from '../components/KnxFilm';
import { HomeFunctionStrip } from '../components/HomeFunctionStrip';
import { HomeIntegrations, HomeKnxReasons } from '../components/HomeTechnologySections';
import meetingImage from '../assets/images/home-editorial-meeting.webp';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: (topic?: string) => void;
}

export const WORKSPACE_CONSULTATION = 'Konsultacja Smart Workspace / sala konferencyjna';

const steps = [
  { title: 'Porozmawiajmy.', text: 'Poznajemy potrzeby, styl życia i pomysł na wnętrze.' },
  { title: 'Zaplanujmy.', text: 'Dobieramy funkcje i osprzęt. Uzgadniamy rozwiązania z projektantem.' },
  { title: 'Uruchommy.', text: 'Konfigurujemy system i pokazujemy, jak z niego korzystać.' },
];
const workspaceBenefits = [
  { icon: Monitor, text: 'Prezentacja bez odblasków' },
  { icon: Users, text: 'Komfort podczas spotkań' },
  { icon: AudioLines, text: 'Obraz i dźwięk pod kontrolą' },
];

export const HomePage: React.FC<HomePageProps> = ({ onOpenConsultation }) => (
  <div className="home-editorial">
    <HeroVideo />
    <HomeFunctionStrip />
    <HomeKnxReasons />

    <section id="projekt-knx" aria-labelledby="home-project-title" className="home-project relative overflow-hidden border-b border-ink/10 bg-surface py-8 lg:pt-6 lg:pb-11">
      <div className="bg-grid-subtle pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="min-w-0 space-y-6 lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-md bg-ink/10 px-3 py-1 font-mono text-xs font-medium tracking-tight text-ink">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink" aria-hidden="true" />
              Integrator Automatyki Budynkowej w standardzie KNX
            </p>
            <h2 id="home-project-title" className="home-project__title">
              Zaprojektuj przestrzeń, która myśli razem z Tobą.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
              Wykonujemy, programujemy i uruchamiamy automatykę pomieszczeń dla domów, apartamentów i biur. Łączymy komfort użytkownika, energię pod kontrolą i dopracowany detal wnętrza.
            </p>
            <div className="flex flex-col items-stretch gap-3.5 pt-2 sm:flex-row sm:items-center">
              <button type="button" onClick={() => onOpenConsultation('Funkcje inteligentnego domu')} className="group flex items-center justify-center gap-2.5 rounded-lg bg-ink px-6 py-3.5 text-xs font-semibold tracking-wider text-accent uppercase shadow-sm transition-colors hover:bg-ink-hover">
                Porozmawiajmy o projekcie
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <a href={pageUrl('offices')} className="rounded-lg border border-ink/25 bg-white px-6 py-3.5 text-center text-xs font-semibold tracking-wider text-ink uppercase transition-colors hover:bg-mist/60">
                Poznaj automatykę biura
              </a>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-5">
            <KnxFilm />
          </div>
        </div>
      </div>
    </section>

    <section className="home-editorial__process home-editorial__wrap" aria-labelledby="home-process-title">
      <h2 id="home-process-title" className="home-editorial__eyebrow">Jak pracujemy</h2>
      <ol className="home-editorial__steps">
        {steps.map(({ title, text }, index) => (
          <li key={title}>
            <span className="home-editorial__step-number" aria-hidden="true">0{index + 1}</span>
            <h3>{title}</h3><p>{text}</p>
          </li>
        ))}
      </ol>
    </section>

    <HomeIntegrations />

    <section id="smart-workspace" className="home-editorial__workspace home-editorial__wrap" aria-labelledby="home-workspace-title">
      <div className="home-editorial__workspace-copy">
        <p className="home-editorial__eyebrow">Smart Workspace</p>
        <h2 id="home-workspace-title">Sala gotowa do spotkania.</h2>
        <p className="home-editorial__lead">Światło, rolety, temperatura i sprzęt do wideorozmów. Połączone tak, żeby łatwiej prowadzić spotkania.</p>
        <ul className="home-editorial__workspace-benefits">
          {workspaceBenefits.map(({ icon: Icon, text }) => (
            <li key={text}><Icon size={40} strokeWidth={1.3} aria-hidden="true" /><span>{text}</span></li>
          ))}
        </ul>
        <button type="button" className="home-editorial__button" onClick={() => onOpenConsultation(WORKSPACE_CONSULTATION)}>
          Porozmawiajmy o Twojej sali <ArrowRight size={19} aria-hidden="true" />
        </button>
      </div>
      <figure className="home-editorial__meeting-image">
        <img src={meetingImage} alt="Przykładowa sala spotkań z ekranem, wideobarem, żaluzjami i oświetleniem nad stołem" width={1254} height={1254} loading="lazy" decoding="async" />
        <figcaption>Przykładowy scenariusz — dobieramy do instalacji.</figcaption>
      </figure>
    </section>
  </div>
);
