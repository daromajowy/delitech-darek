import React from 'react';
import { ArrowRight, AudioLines, Monitor, Users } from 'lucide-react';
import type { PageId } from '../types';
import { HeroVideo } from '../components/HeroVideo';
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
