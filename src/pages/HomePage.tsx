import React from 'react';
import { ArrowRight, AudioLines, Blinds, CloudRain, Droplets, Monitor, Sprout, Sun, Thermometer, Users } from 'lucide-react';
import type { PageId } from '../types';
import { pageUrl, plannerUrl } from '../site';
import { HeroVideo } from '../components/HeroVideo';
import { KnxFilm } from '../components/KnxFilm';
import { HomeFunctionStrip, HomeKnxReasons, HomeTechnologySections } from '../components/HomeTechnologySections';
import planningImage from '../assets/images/architects-advice.webp';
import homeImage from '../assets/images/home-editorial-interior.webp';
import meetingImage from '../assets/images/home-editorial-meeting.webp';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: (topic?: string) => void;
}

export const WORKSPACE_CONSULTATION = 'Konsultacja Smart Workspace / sala konferencyjna';

const homeBenefits = [
  { icon: Sun, title: 'Światło w Twoim rytmie', text: 'Jasno przy pracy, przytulnie wieczorem. Jednym przyciskiem lub automatycznie.', hash: 'dali' },
  { icon: Blinds, title: 'Cień i prywatność', text: 'Osłony ograniczają ostre słońce w dzień, a wieczorem zapewniają prywatność.', hash: 'fasady' },
  { icon: Thermometer, title: 'Temperatura po Twojemu', text: 'Ogrzewanie i chłodzenie dopasowane do pomieszczenia i Twojego dnia.', hash: 'hvac' },
  { icon: CloudRain, title: 'Dom reaguje na pogodę', text: 'Zaczyna padać? Okna z napędem mogą zamknąć się automatycznie.', hash: 'pogoda' },
  { icon: Sprout, title: 'Ogród podlewany z głową', text: 'Podlewanie uwzględnia wilgotność ziemi i deszcz. Także podczas Twojego wyjazdu.', hash: 'ogrod' },
  { icon: Droplets, title: 'Reakcja na wyciek', text: 'Czujnik wykrywa wodę, a system zamyka jej dopływ przez sterowany zawór.', hash: 'wyciek' },
];
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

    <section className="home-editorial__intro home-editorial__wrap" aria-labelledby="home-intro-title">
      <h1 id="home-intro-title">
        <span>Tworzymy </span><span>inteligentne </span><span>przestrzenie</span>
      </h1>
      <div className="home-editorial__intro-copy">
        <p>Technologia ma ułatwiać codzienność. Łączymy ją z architekturą, pomagając tworzyć miejsca wygodne do życia i pracy.</p>
        <p>Doradzamy, projektujemy i uruchamiamy.</p>
        <button type="button" className="home-editorial__button" onClick={() => onOpenConsultation('Konsultacja projektu automatyki KNX')}>
          Porozmawiajmy o projekcie <ArrowRight size={19} aria-hidden="true" />
        </button>
      </div>
    </section>

    <section id="dom" className="home-editorial__homes home-editorial__wrap" aria-labelledby="home-dom-title">
      <p className="home-editorial__eyebrow">Domy i apartamenty</p>
      <h2 id="home-dom-title">Dom w Twoim rytmie.</h2>
      <p className="home-editorial__lead">Codzienny komfort, zadbany ogród i reakcja wtedy, kiedy jej potrzebujesz.</p>
      <div className="home-editorial__photo-pair">
        <figure>
          <img src={planningImage} alt="Rzut mieszkania obok próbek kamienia, drewna i tkaniny oraz przycisku ściennego" width={1440} height={1008} loading="lazy" decoding="async" />
          <figcaption><span>Od pomysłu</span></figcaption>
        </figure>
        <figure>
          <img src={homeImage} alt="Przykładowe wnętrze salonu z dużymi oknami, zasłonami i dyskretnym oświetleniem" width={1402} height={1122} loading="lazy" decoding="async" />
          <figcaption><span>Do codziennej wygody</span></figcaption>
        </figure>
      </div>
      <ul className="home-editorial__benefits" id="funkcje-domu">
        {homeBenefits.map(({ icon: Icon, title, text, hash }) => (
          <li key={title}>
            <a href={pageUrl('solutions', hash)}>
              <Icon size={48} strokeWidth={1.3} aria-hidden="true" />
              <div><h3>{title}</h3><p>{text}</p></div>
            </a>
          </li>
        ))}
      </ul>
      <p className="home-editorial__benefits-note">Funkcje dobieramy do Twojego domu, urządzeń i sposobu życia.</p>
      <section className="home-editorial__process" aria-labelledby="home-process-title">
        <h3 id="home-process-title" className="home-editorial__eyebrow">Jak pracujemy</h3>
        <ol className="home-editorial__steps">
          {steps.map(({ title, text }, index) => (
            <li key={title}>
              <span className="home-editorial__step-number" aria-hidden="true">0{index + 1}</span>
              <h4>{title}</h4><p>{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </section>

    <HomeTechnologySections onOpenConsultation={onOpenConsultation} />

    <section className="home-editorial__advice" aria-labelledby="home-advice-title">
      <div className="home-editorial__wrap">
        <p className="home-editorial__eyebrow">Wsparcie dla inwestorów i projektantów</p>
        <div className="home-editorial__advice-grid">
          <div>
            <h2 id="home-advice-title">Nie musisz znać KNX.</h2>
            <p className="home-editorial__lead">Opowiedz, jak chcesz korzystać z wnętrza. Pomożemy dobrać rozwiązania i uzgodnić je z architektem oraz elektrykiem.</p>
            <a href={plannerUrl()} className="home-editorial__button">Poznaj konfigurator KNX <ArrowRight size={19} aria-hidden="true" /></a>
          </div>
          <ul className="home-editorial__support">
            <li>Zrozumiały język.</li>
            <li>Osprzęt dopasowany do wnętrza.</li>
            <li>Wsparcie od pomysłu do uruchomienia.</li>
          </ul>
        </div>
      </div>
    </section>

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
