import React from 'react';
import { ArrowRight, AudioLines, Blinds, Monitor, Sun, Thermometer, Users } from 'lucide-react';
import type { PageId } from '../types';
import { pageUrl, plannerUrl } from '../site';
import { HeroVideo } from '../components/HeroVideo';
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
  { icon: Sun, title: 'Światło i nastrój', text: 'Sceny świetlne dopasowane do Twojego dnia.', hash: 'dali' },
  { icon: Blinds, title: 'Rolety i prywatność', text: 'Automatycznie lub wtedy, kiedy tego potrzebujesz.', hash: 'fasady' },
  { icon: Thermometer, title: 'Komfortowa temperatura', text: 'Ogrzewanie i chłodzenie dopasowane do pomieszczenia.', hash: 'hvac' },
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
      <p className="home-editorial__lead">Światło, rolety i temperatura dopasowane do Twojej codzienności.</p>
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
      <ul className="home-editorial__benefits">
        {homeBenefits.map(({ icon: Icon, title, text, hash }) => (
          <li key={title}>
            <a href={pageUrl('solutions', hash)}>
              <Icon size={48} strokeWidth={1.3} aria-hidden="true" />
              <div><h3>{title}</h3><p>{text}</p></div>
            </a>
          </li>
        ))}
      </ul>
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
