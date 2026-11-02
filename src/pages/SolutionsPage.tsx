import React from 'react';
import {
  ArrowRight, ArrowUpRight, Blinds, CarFront, CloudRain, DoorOpen, Droplets, Fan, Lightbulb, Moon,
  Music2, PanelsTopLeft, ShieldCheck, ShowerHead, Smartphone, Snowflake,
  BatteryCharging, Sprout, Sun, Thermometer, type LucideIcon,
} from 'lucide-react';
import { pageUrl } from '../site';
import { F50HomeDemo } from '../components/F50HomeDemo/F50HomeDemo';
import { KnxFilm } from '../components/KnxFilm';
import { HomeSystemComparison, IoTIntegrations } from '../components/HomeTechnologySections';
import morning from '../assets/images/solutions-scene-morning.webp';
import leaving from '../assets/images/solutions-scene-leaving.webp';
import returning from '../assets/images/solutions-scene-return.webp';
import night from '../assets/images/solutions-scene-night.webp';
import './SolutionsPage.css';

interface SolutionsPageProps {
  onOpenConsultation: (topic: string) => void;
}

interface SceneEffect {
  icon: LucideIcon;
  text: string;
}

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

const everydayFunctions = [
  {
    id: 'dali', icon: Sun, title: 'Światło w Twoim rytmie',
    text: 'Jasne światło do pracy, łagodne wieczorem i dyskretne przejście do łazienki w nocy. Jednym przyciskiem zmieniasz nastrój kilku lamp, a czujniki i harmonogramy mogą uruchamiać ustalone sceny automatycznie.',
  },
  {
    id: 'fasady', icon: Blinds, title: 'Cień i prywatność',
    text: 'Rolety i żaluzje ograniczają ostre słońce, zanim salon zdąży się nagrzać. Wieczorem osłony lub zasłony zapewniają prywatność. Mogą reagować na nasłonecznienie, działać według harmonogramu albo na Twoje polecenie.',
  },
  {
    id: 'hvac', icon: Thermometer, title: 'Temperatura po Twojemu',
    text: 'Ustalasz temperaturę osobno w sypialni, salonie czy łazience. Ogrzewanie i chłodzenie współpracują, zamiast działać przeciwko sobie. Czujnik otwarcia okna może ograniczyć ich pracę na czas wietrzenia, a tryb wyjazdu zmienić ustawienia na czas nieobecności.',
  },
  {
    id: 'pogoda', icon: CloudRain, title: 'Dom reaguje na pogodę',
    text: 'Gdy czujnik wykryje deszcz, okna wyposażone w zgodne napędy mogą zamknąć się automatycznie. Przy silnym wietrze system ustawia zewnętrzne osłony w pozycji ochronnej. Reakcje dobieramy do rodzaju okien, markiz i żaluzji oraz zaleceń ich producentów.',
  },
  {
    id: 'ogrod', icon: Sprout, title: 'Ogród podlewany z głową',
    text: 'Trawnik i rabaty mogą mieć osobne pory i długość podlewania. Czujniki wilgotności gleby i deszczu pozwalają wstrzymać nawadnianie, gdy wody już wystarcza. Sterowane zawory obsługują wybrane części ogrodu także podczas Twojego wyjazdu.',
  },
  {
    id: 'wyciek', icon: Droplets, title: 'Reakcja na wyciek',
    text: 'Czujnik przy pralce, zmywarce lub pod zlewem wykrywa wodę tam, gdzie nie powinno jej być. System może wtedy odciąć dopływ wody przez odpowiednio dobrany, sterowany zawór. Zakres ochrony planujemy razem z rozmieszczeniem czujników i instalacją wodną.',
  },
];

const integrations = [
  { id: 'klimatyzacja', icon: Snowflake, title: 'Klimatyzacja', text: 'Chłodzenie dopasowane do potrzeb.' },
  { id: 'wentylacja', icon: Fan, title: 'Wentylacja', text: 'Tryby pracy i pomiary powietrza.' },
  { id: 'multimedia', icon: Music2, title: 'Muzyka i kino', text: 'Dźwięk i obraz w domowych scenach.' },
  { id: 'wejscie', icon: DoorOpen, title: 'Domofon i brama', text: 'Wygodna obsługa wejścia.' },
  { id: 'bezpieczenstwo', icon: ShieldCheck, title: 'Alarm i czujniki', text: 'Sygnały z okien, drzwi i zgodnego systemu alarmowego.' },
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

      <section id="projekt-knx" aria-labelledby="solutions-project-title" className="relative overflow-hidden border-b border-ink/10 bg-surface py-8 lg:pt-6 lg:pb-11">
        <div className="bg-grid-subtle pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="min-w-0 space-y-6 lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-md bg-ink/10 px-3 py-1 font-mono text-xs font-medium tracking-tight text-ink">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink" aria-hidden="true" />
                Integrator Automatyki Budynkowej w standardzie KNX
              </p>
              <h2 id="solutions-project-title" className="text-balance font-display text-section-title leading-[1.08] font-extrabold tracking-tight text-ink">
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

      <section className="solutions-functions" id="integracje" aria-labelledby="solutions-functions-title">
        <div className="solutions-container">
          <div className="solutions-section-intro">
            <h2 id="solutions-functions-title">Dom reaguje. Ty korzystasz.</h2>
            <p>Codzienna wygoda w domu i ogrodzie. Zobacz, jak to może działać u Ciebie.</p>
          </div>
          <ul className="solutions-functions__grid">
            {everydayFunctions.map(({ id, icon: Icon, title, text }) => (
              <li key={id} id={id} aria-labelledby={`function-${id}-title`}>
                <Icon size={48} strokeWidth={1.3} aria-hidden="true" />
                <h3 id={`function-${id}-title`}>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
          <p className="solutions-functions__note">Funkcje dobieramy do Twojego domu, urządzeń i sposobu życia. Potrzebne czujniki i napędy uwzględniamy w projekcie.</p>
        </div>
      </section>

      <section className="solutions-integrations" aria-labelledby="solutions-integrations-title">
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

      <IoTIntegrations />
      <HomeSystemComparison onOpenConsultation={onOpenConsultation} />

      <section className="solutions-cta" aria-labelledby="solutions-cta-title">
        <div className="solutions-container">
          <div className="solutions-cta__action">
            <h2 id="solutions-cta-title">Zaplanujmy możliwości Twojego domu.</h2>
            <button type="button" onClick={() => onOpenConsultation('Funkcje inteligentnego domu')}>
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
