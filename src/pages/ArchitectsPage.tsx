import React from 'react';
import { ArrowRight, Blocks, MessageCircle, UsersRound } from 'lucide-react';
import { PageId } from '../types';
import { pageUrl } from '../site';
import heroImage from '../assets/images/architects-hero.webp';
import adviceImage from '../assets/images/architects-advice.webp';
import presentationImage from '../assets/images/architects-presentation.webp';
import './ArchitectsPage.css';

interface ArchitectsPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: (topic?: string) => void;
}

const support = [
  { icon: MessageCircle, title: 'Doradztwo od początku', text: 'Pomagamy uporządkować pomysły i zaplanować automatykę, zanim pojawią się pytania na budowie.' },
  { icon: Blocks, title: 'Osprzęt dobrany do wnętrza', text: 'Dobieramy przyciski i wykończenia do projektu. Łączymy estetykę z wygodną, prostą obsługą.' },
  { icon: UsersRound, title: 'Uzgodnienia z wykonawcami', text: 'Pomagamy przełożyć założenia na konkretne ustalenia z projektantem instalacji i elektrykiem.' },
];

const advice = [
  { title: 'Co warto zaplanować wcześniej', text: 'Porozmawiajmy, zanim zostanie ustalone okablowanie. Wspólnie sprawdzimy potrzeby domowników, miejsca sterowania i elementy wnętrza, które mają ze sobą współpracować.' },
  { title: 'Jak połączyć wygląd i wygodę', text: 'Przycisk jest częścią wnętrza. Pomagamy dobrać materiał, kolor, miejsce montażu i sposób obsługi. Wymagania techniczne oraz dostępność wybranego osprzętu sprawdzamy przed podjęciem decyzji.' },
  { title: 'Co uzgodnić z elektrykiem', text: 'Przekładamy założenia automatyki na ustalenia potrzebne wykonawcom. Omawiamy wymagania instalacyjne, podział odpowiedzialności i kolejność prac. Zakres dokumentacji ustalamy dla konkretnego projektu.' },
];

export const ArchitectsPage: React.FC<ArchitectsPageProps> = ({ onOpenConsultation }) => (
  <div className="architects-page">
    <section className="architects-hero" aria-labelledby="architects-title">
      <div className="architects-hero__copy">
        <p className="architects-eyebrow">Dla architektów i projektantów</p>
        <h1 id="architects-title">
          <span>Ty projektujesz</span>{' '}
          <span>wnętrze.</span>{' '}
          <span>My pomagamy</span>{' '}
          <span>zaplanować KNX.</span>
        </h1>
        <p className="architects-hero__intro">Pomagamy połączyć estetykę wnętrza z wygodnym sterowaniem domem. Od pierwszych założeń po uzgodnienia techniczne.</p>
        <div className="architects-hero__actions">
          <button className="architects-button" onClick={() => onOpenConsultation()}>
            Porozmawiajmy o projekcie <ArrowRight size={20} aria-hidden="true" />
          </button>
          <a className="architects-text-link" href={pageUrl('architects', 'pakiet')}>Poznaj konfigurator</a>
        </div>
      </div>
      <figure className="architects-hero__image architects-image">
        <img src={heroImage} alt="Wizualizacja metalowego przycisku na kamiennej ścianie w ciepłym, nowoczesnym wnętrzu" width={1254} height={1254} fetchPriority="high" />
        <figcaption>Wizualizacja koncepcyjna</figcaption>
      </figure>
    </section>

    <section id="wsparcie" className="architects-support" aria-labelledby="architects-support-title">
      <h2 id="architects-support-title" className="sr-only">Wsparcie dla Twojej pracowni</h2>
      {support.map(({ icon: Icon, title, text }) => (
        <article key={title}>
          <Icon size={42} strokeWidth={1.5} aria-hidden="true" />
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </section>

    <section id="jung" className="architects-advice" aria-labelledby="architects-advice-title">
      <figure className="architects-advice__image architects-image">
        <img src={adviceImage} alt="Wizualizacja stołu projektanta: rzut domu, próbki kamienia, drewna i osprzętu" width={1440} height={1008} loading="lazy" decoding="async" />
        <figcaption>Wizualizacja koncepcyjna</figcaption>
      </figure>
      <div className="architects-advice__copy">
        <h2 id="architects-advice-title">Doświadczenie, które pomaga podejmować decyzje.</h2>
        <p className="architects-advice__intro">Znamy osprzęt i jego zastosowania. Pomagamy wybrać rozwiązania, które pasują do wnętrza i codziennego życia domowników.</p>
        <div className="architects-advice__topics">
          {advice.map(({ title, text }) => (
            <details key={title}>
              <summary><span>{title}</span><ArrowRight size={21} strokeWidth={1.5} aria-hidden="true" /></summary>
              <p>{text}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section id="pakiet" className="architects-presentation" aria-labelledby="architects-presentation-title">
      <img className="architects-presentation__image" src={presentationImage} alt="" width={2000} height={667} loading="lazy" decoding="async" />
      <div className="architects-presentation__copy">
        <p className="architects-eyebrow">Narzędzie dla pracowni</p>
        <h2 id="architects-presentation-title">Konfigurator KNX.<br />Dobry początek współpracy.</h2>
        <p className="architects-presentation__intro">Poznaj nasze narzędzie podczas krótkiej prezentacji. Pokażemy je w kontekście Twojej pracowni.</p>
        <button className="architects-button architects-button--lime" onClick={() => onOpenConsultation('Prezentacja konfiguratora KNX dla pracowni')}>
          Umów prezentację <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  </div>
);
