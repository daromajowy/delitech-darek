import React, { useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowsLeftRight, Bluetooth, Check, Circuitry,
  HouseLine, Lightbulb, Microphone, MusicNotes,
  PlugsConnected, Ruler, VideoCamera, WifiHigh,
} from '@phosphor-icons/react';
import { pageUrl } from '../site';
import { homeIntegrationAreas } from './home-integration-areas';
import './HomeTechnologySections.css';

const knxReasons = [
  {
    title: 'Wybór urządzeń różnych marek',
    text: 'KNX jest wspólnym standardem wielu producentów. Dobieramy zgodne urządzenia według funkcji, wyglądu i budżetu oraz sprawdzamy ich współpracę.',
  },
  {
    title: 'Przycisk do codziennej obsługi',
    text: 'Światło, osłony czy scenę możesz uruchomić przyciskiem na ścianie. Aplikacja i panel mogą uzupełniać obsługę tam, gdzie są potrzebne.',
  },
  {
    title: 'Podstawowe funkcje działają lokalnie',
    text: 'Odpowiednio zaprojektowane sterowanie światłem, osłonami i temperaturą nie wymaga internetu. Zdalny dostęp i usługi internetowe potrzebują dodatkowych rozwiązań.',
  },
  {
    title: 'Ustawienia można zmienić',
    text: 'Funkcje przycisków i scen można przeprogramować. Dodanie nowych urządzeń zależy od przygotowanego okablowania, miejsca w rozdzielnicy i możliwości instalacji.',
  },
];

export function HomeKnxReasons() {
  return (
    <section id="dlaczego-knx" className="home-technology ht-why" aria-labelledby="home-why-knx-title">
      <div className="home-editorial__wrap ht-why__layout">
        <div>
          <p className="ht-eyebrow">Wspólny standard</p>
          <h2 id="home-why-knx-title">Dlaczego <br />KNX?</h2>
          <p className="ht-why__lead">Oświetlenie, osłony i temperatura mogą współpracować w jednej instalacji. O jej działaniu decydują dobrane urządzenia i zaprogramowane funkcje.</p>
          <a className="ht-why__link" href={pageUrl('solutions')}>
            Poznaj funkcje domu <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <ol className="ht-why__reasons">
          {knxReasons.map(({ title, text }, index) => (
            <li key={title}>
              <span className="ht-why__number" aria-hidden="true">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FeatureList({ items }: { items: readonly string[] }) {
  return <ul className="ht-check-list">{items.map(item => <li key={item}><Check size={18} weight="light" aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

export function HomeIntegrations() {
  const [selected, setSelected] = useState(homeIntegrationAreas[0].id);
  const detail = useRef<HTMLElement>(null);
  const active = homeIntegrationAreas.find(area => area.id === selected) || homeIntegrationAreas[0];
  const ActiveIcon = active.icon;

  function choose(id: string) {
    setSelected(id);
    if (window.matchMedia('(max-width: 650px)').matches) {
      requestAnimationFrame(() => {
        detail.current?.focus({ preventScroll: true });
        detail.current?.scrollIntoView({
          block: 'start',
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
      });
    }
  }

  return (
    <section id="integracje-knx" className="home-technology ht-integrations" aria-labelledby="ht-integrations-title">
      <div className="solutions-container">
        <div className="ht-heading">
          <div><p className="ht-eyebrow">Możliwości KNX</p><h2 id="ht-integrations-title">Wiele instalacji.<br />Jeden pomysł na dom.</h2></div>
          <div className="ht-intro">
            <p>KNX daje urządzeniom wspólny język. Światło, ogrzewanie, osłony i inne instalacje mogą wymieniać informacje i działać według wspólnie ustalonego planu.</p>
            <p>Wybierz obszar. Zobacz, co zyskujesz na co dzień i co warto przewidzieć w projekcie.</p>
          </div>
        </div>
        <ul className="ht-principles">
          <li><Circuitry size={23} weight="light" aria-hidden="true" />Otwarty standard</li>
          <li><HouseLine size={23} weight="light" aria-hidden="true" />Lokalne funkcje podstawowe</li>
          <li><Ruler size={23} weight="light" aria-hidden="true" />Rozbudowa zaplanowana od początku</li>
        </ul>
        <div className="ht-area-grid" role="group" aria-label="Wybierz obszar integracji KNX">
          {homeIntegrationAreas.map(({ id, icon: Icon, title, short }, index) => (
            <button key={id} id={`ht-area-${id}`} type="button" onClick={() => choose(id)} aria-pressed={selected === id} aria-controls="ht-integration-detail" aria-label={`Poznaj: ${title}`}>
              <span className="ht-card-top"><Icon size={35} weight="light" aria-hidden="true" /><span>{String(index + 1).padStart(2, '0')}</span></span>
              <strong>{title}</strong>
              <span className="ht-card-copy">{short}</span>
              <span className="ht-card-action">{selected === id ? 'Wybrany obszar' : 'Poznaj możliwości'}<ArrowDown size={18} aria-hidden="true" /></span>
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">Wybrano: {active.title}. Szczegóły poniżej.</p>
        <section ref={detail} id="ht-integration-detail" className="ht-detail" aria-labelledby="ht-detail-title" tabIndex={-1}>
          <div className="ht-detail-heading">
            <ActiveIcon size={45} weight="light" aria-hidden="true" />
            <div><p className="ht-detail-category">{active.title}</p><h3 id="ht-detail-title">{active.promise}</h3></div>
          </div>
          <ul className="ht-tags" aria-label="Przykładowe urządzenia i systemy">{active.systems.map(item => <li key={item}>{item}</li>)}</ul>
          <div className="ht-perspectives">
            <div><h4><HouseLine size={22} weight="light" aria-hidden="true" />Dla inwestora <span>na co dzień</span></h4><FeatureList items={active.everyday} /></div>
            <div><h4><Ruler size={22} weight="light" aria-hidden="true" />Dla projektanta <span>do zaplanowania</span></h4><FeatureList items={active.project} /></div>
          </div>
          <p className="ht-condition">{active.note}</p>
          <a className="ht-back" href="#integracje-knx">Wybierz inny obszar <ArrowRight size={18} aria-hidden="true" /></a>
        </section>
      </div>
    </section>
  );
}

const iotExamples = [
  { icon: Lightbulb, title: 'Światło Philips Hue', text: 'Lampy dekoracyjne dołączają do sceny sterowanej przyciskiem KNX.', connection: 'Hue Bridge + zgodny serwer' },
  { icon: MusicNotes, title: 'Muzyka Sonos', text: 'Wybrana muzyka i głośność stają się częścią scenariusza w pomieszczeniu.', connection: 'Sieć domowa + obsługiwana integracja' },
  { icon: Microphone, title: 'Sterowanie głosem', text: 'Uruchom wybraną scenę przez Amazon Alexa lub Google Assistant.', connection: 'Zgodna usługa, konto i dostęp do internetu' },
  { icon: VideoCamera, title: 'Kamery IP', text: 'Podgląd obsługiwanej kamery pojawia się w wizualizacji domu.', connection: 'Zgodny strumień obrazu + wizualizacja' },
];

export function IoTIntegrations() {
  return (
    <section id="iot" className="home-technology ht-iot" aria-labelledby="ht-iot-title">
      <div className="home-editorial__wrap">
        <div className="ht-heading">
          <div><p className="ht-eyebrow">Internet rzeczy · IoT</p><h2 id="ht-iot-title">KNX spotyka<br />świat IoT.</h2></div>
          <div className="ht-iot-lead"><p>Twoje ulubione urządzenia mogą być częścią większego planu.</p><p>IoT to urządzenia wymieniające dane przez sieć oraz powiązane aplikacje i usługi. Po odpowiednim połączeniu z KNX mogą współtworzyć sceny, pokazywać stan domu i reagować na zdarzenia.</p></div>
        </div>
        <div className="ht-connection" role="group" aria-label="Przykładowe połączenie instalacji KNX z dobranym serwerem lub bramką i zgodnymi urządzeniami IoT">
          <div><Circuitry size={32} weight="light" aria-hidden="true" /><span><strong>Instalacja KNX</strong><small>Przyciski, czujniki, funkcje domu</small></span></div>
          <ArrowsLeftRight className="ht-flow-arrow" size={26} weight="light" aria-hidden="true" />
          <div><PlugsConnected size={32} weight="light" aria-hidden="true" /><span><strong>Serwer lub bramka</strong><small>Dobór do urządzeń i funkcji</small></span></div>
          <ArrowsLeftRight className="ht-flow-arrow" size={26} weight="light" aria-hidden="true" />
          <div><WifiHigh size={32} weight="light" aria-hidden="true" /><span><strong>Urządzenia i usługi IoT</strong><small>Wybrane funkcje we wspólnych scenach</small></span></div>
        </div>
        <div className="ht-iot-examples">{iotExamples.map(({ icon: Icon, title, text, connection }) => (
          <article key={title}><Icon size={34} weight="light" aria-hidden="true" /><h3>{title}</h3><p>{text}</p><span>{connection}</span></article>
        ))}</div>
        <p className="ht-fine-print">To przykłady dostępne w odpowiednio dobranych rozwiązaniach, m.in. JUNG Smart Visu Server. Zakres sprawdzamy dla konkretnego modelu, wersji oprogramowania i usługi.</p>
      </div>
    </section>
  );
}

export function HomeSystemComparison({ onOpenConsultation }: { onOpenConsultation: (topic: string) => void }) {
  return (
    <section id="systemy" className="home-technology ht-systems" aria-labelledby="ht-systems-title">
      <div className="home-editorial__wrap">
        <h2 id="ht-systems-title">Dobierz system do swojego domu.</h2>
        <p className="ht-section-lead">Sprawdzone technologie, które dopasujesz do swoich potrzeb.</p>
        <div className="ht-system-grid">
          <article className="ht-system-card">
            <div className="ht-system-heading"><Circuitry size={40} weight="light" aria-hidden="true" /><span>Otwarty standard</span></div>
            <h3>KNX</h3><p className="ht-system-promise">Jeden plan. Możliwości całego domu.</p>
            <p>Oświetlenie, rolety, ogrzewanie i inne instalacje połączone w system dobrany do budynku i Twojego sposobu życia.</p>
            <FeatureList items={['Urządzenia wielu producentów', 'Rozbudowane sceny i integracje', 'Projekt i profesjonalne uruchomienie']} />
            <div className="ht-system-fit"><strong>Gdy planujesz więcej.</strong><span>Do nowych instalacji i modernizacji, także z KNX RF.</span></div>
            <a href={pageUrl('knx')} className="ht-button">Poznaj KNX <ArrowRight size={19} aria-hidden="true" /></a>
          </article>
          <article className="ht-system-card ht-system-card--jung">
            <div className="ht-system-heading"><Bluetooth size={40} weight="light" aria-hidden="true" /><span>Bluetooth® Mesh</span></div>
            <h3>JUNG HOME</h3><p className="ht-system-promise">Wygoda zaczyna się od przycisku.</p>
            <p>Inteligentne funkcje na bazie instalacji 230 V. Urządzenia komunikują się bezprzewodowo, a podstawowe ustawienia wybierasz w aplikacji.</p>
            <FeatureList items={['Światło, rolety i temperatura', 'Sceny i harmonogramy dnia', 'Rozbudowa o zgodne urządzenia']} />
            <div className="ht-system-fit"><strong>Gdy chcesz zacząć od codzienności.</strong><span>Do istniejącego mieszkania lub nowego domu.</span></div>
            <a href="https://elektrodesign.pl/jung-home-756" target="_blank" rel="noopener noreferrer" className="ht-button" aria-label="Poznaj JUNG HOME w Elektrodesign (nowa karta)">Poznaj JUNG HOME <ArrowRight size={19} aria-hidden="true" /></a>
          </article>
        </div>
        <div className="ht-system-help">
          <p>Nie musisz wybierać technologii na początek.<br /><strong>Zacznij od tego, co dom ma robić dla Ciebie.</strong></p>
          <button type="button" onClick={() => onOpenConsultation('Dobór systemu KNX lub JUNG HOME')}>Opowiedz nam o swoim domu <ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
