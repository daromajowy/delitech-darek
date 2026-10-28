import React from 'react';
import {
  ArrowUpRight, Blinds, CarFront, CirclePlay, DoorOpen, Fan, Lightbulb, Moon,
  Music2, PanelsTopLeft, ShieldCheck, ShowerHead, Smartphone, Snowflake,
  BatteryCharging, Sprout, Sun, Thermometer, type LucideIcon,
} from 'lucide-react';
import type { PageId } from '../types';
import { F50HomeDemo } from '../components/F50HomeDemo/F50HomeDemo';
import cinema from '../assets/images/solutions-scene-cinema.webp';
import morning from '../assets/images/solutions-scene-morning.webp';
import leaving from '../assets/images/solutions-scene-leaving.webp';
import returning from '../assets/images/solutions-scene-return.webp';
import night from '../assets/images/solutions-scene-night.webp';
import './SolutionsPage.css';

interface SolutionsPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onOpenConsultation: () => void;
  initialHash?: string;
}

interface SceneEffect {
  icon: LucideIcon;
  text: string;
}

const cinemaEffects: SceneEffect[] = [
  { icon: Lightbulb, text: 'Światło przygasa' },
  { icon: Blinds, text: 'Zasłony się zamykają' },
  { icon: CirclePlay, text: 'Kino startuje' },
];

const scenes = [
  {
    title: 'Poranek',
    image: morning,
    alt: 'Jasna sypialnia z odsłoniętym oknem i łazienką w głębi — wizualizacja',
    lead: 'Dom spokojnie zaczyna dzień.',
    effects: [
      { icon: Blinds, text: 'Rolety w górę' },
      { icon: Sun, text: 'Delikatne światło' },
      { icon: ShowerHead, text: 'Komfort w łazience' },
    ],
  },
  {
    title: 'Wyjście',
    image: leaving,
    alt: 'Strefa wejścia z drzwiami i przyciskiem na ścianie — wizualizacja',
    lead: 'Jedno naciśnięcie przed zamknięciem drzwi.',
    effects: [
      { icon: Lightbulb, text: 'Wybrane światła gasną' },
      { icon: ShieldCheck, text: 'Tryb nieobecności' },
      { icon: PanelsTopLeft, text: 'Informacja o oknach' },
    ],
  },
  {
    title: 'Powrót',
    image: returning,
    alt: 'Przytulne wejście i salon oświetlony na powrót domowników — wizualizacja',
    lead: 'Przygotuj dom na swój powrót.',
    effects: [
      { icon: Lightbulb, text: 'Światło przy wejściu' },
      { icon: Thermometer, text: 'Ustalone temperatury' },
      { icon: Music2, text: 'Wybrana muzyka' },
    ],
  },
  {
    title: 'Dobranoc',
    image: night,
    alt: 'Przyciemniona sypialnia z niskim światłem prowadzącym do łazienki — wizualizacja',
    lead: 'Dom zwalnia razem z Tobą.',
    effects: [
      { icon: Lightbulb, text: 'Światła gasną' },
      { icon: Blinds, text: 'Rolety w dół' },
      { icon: Moon, text: 'Nocna droga do łazienki' },
    ],
  },
];

const integrations = [
  { id: 'dali', icon: Lightbulb, title: 'Oświetlenie', text: 'Lampy, ściemnianie i grupy światła.' },
  { id: 'fasady', icon: Blinds, title: 'Rolety i zasłony', text: 'Prywatność i kontrola słońca.' },
  { id: 'hvac', icon: Thermometer, title: 'Ogrzewanie', text: 'Temperatura dla każdego pokoju.' },
  { id: 'klimatyzacja', icon: Snowflake, title: 'Klimatyzacja', text: 'Chłodzenie dopasowane do potrzeb.' },
  { id: 'wentylacja', icon: Fan, title: 'Wentylacja', text: 'Tryby pracy i pomiary powietrza.' },
  { id: 'multimedia', icon: Music2, title: 'Muzyka i kino', text: 'Dźwięk i obraz w domowych scenach.' },
  { id: 'wejscie', icon: DoorOpen, title: 'Domofon i brama', text: 'Wygodna obsługa wejścia.' },
  { id: 'bezpieczenstwo', icon: ShieldCheck, title: 'Alarm i czujniki', text: 'Sygnały z okien i czujników wody.' },
  { id: 'ogrod', icon: Sprout, title: 'Ogród i podlewanie', text: 'Światło na zewnątrz i nawadnianie.' },
  { id: 'energia', icon: BatteryCharging, title: 'Fotowoltaika i magazyn', text: 'Informacje o energii w domu.' },
  { id: 'ladowanie', icon: CarFront, title: 'Ładowanie samochodu', text: 'Współpraca ze zgodną ładowarką.' },
  { id: 'obsluga', icon: Smartphone, title: 'Panel, aplikacja i głos', text: 'Sposób obsługi dobrany do Ciebie.' },
];

function SceneEffects({ items, className = '' }: { items: SceneEffect[]; className?: string }) {
  return (
    <ul className={`solutions-effects ${className}`}>
      {items.map(({ icon: Icon, text }) => (
        <li key={text}>
          <Icon size={31} strokeWidth={1.5} aria-hidden="true" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

export function SolutionsPage({ onOpenConsultation }: SolutionsPageProps) {
  return (
    <div className="solutions-page">
      <F50HomeDemo asHero />

      <section className="solutions-cinema" aria-labelledby="solutions-together-title">
        <div className="solutions-container solutions-cinema__intro">
          <h2 id="solutions-together-title">Najwięcej daje to, co działa razem.</h2>
          <p>Światło, klimat i urządzenia dopasowane do Twoich codziennych sytuacji.</p>
        </div>
        <div className="solutions-cinema__image">
          <img
            src={cinema}
            alt="Wieczór filmowy w salonie: przygaszone światło, zamknięte zasłony i włączony telewizor — wizualizacja"
            width={2216}
            height={709}
            loading="lazy"
          />
          <div className="solutions-container solutions-cinema__caption">
            <h3>Jeden przycisk.<br />Wieczór gotowy.</h3>
          </div>
        </div>
        <div className="solutions-cinema__reactions">
          <div className="solutions-container">
            <p>Scena „Kino”</p>
            <SceneEffects items={cinemaEffects} />
          </div>
        </div>
      </section>

      <section className="solutions-scenes solutions-container" id="sceny" aria-labelledby="solutions-scenes-title">
        <div className="solutions-section-intro">
          <h2 id="solutions-scenes-title">Przykładowe sceny. Twój własny rytm.</h2>
          <p>Jedno polecenie uruchamia kilka ustalonych działań.</p>
        </div>
        <div className="solutions-scenes__grid">
          {scenes.map(({ title, image, alt, lead, effects }) => (
            <article className="solutions-scene" key={title}>
              <img src={image} alt={alt} width={2025} height={779} loading="lazy" />
              <h3>{title}</h3>
              <p>{lead}</p>
              <SceneEffects items={effects} />
            </article>
          ))}
        </div>
      </section>

      <section className="solutions-integrations" id="integracje" aria-labelledby="solutions-integrations-title">
        <div className="solutions-container">
          <div className="solutions-section-intro">
            <h2 id="solutions-integrations-title">Co jeszcze możemy połączyć?</h2>
            <p>Wybierasz to, co ma sens w Twoim domu.</p>
          </div>
          <ul className="solutions-integrations__grid">
            {integrations.map(({ id, icon: Icon, title, text }) => (
              <li key={id} id={id}>
                <Icon size={36} strokeWidth={1.5} aria-hidden="true" />
                <div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="solutions-cta" aria-labelledby="solutions-cta-title">
        <div className="solutions-container">
          <div className="solutions-cta__action">
            <h2 id="solutions-cta-title">Zaplanujmy możliwości Twojego domu.</h2>
            <button type="button" onClick={onOpenConsultation}>
              Omów projekt <ArrowUpRight size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="solutions-cta__notes">
            <p>Sceny są przykładami. Zakres integracji sprawdzamy dla konkretnych urządzeń i instalacji.</p>
            <p>Wizualizacje koncepcyjne</p>
          </div>
        </div>
      </section>
    </div>
  );
}
