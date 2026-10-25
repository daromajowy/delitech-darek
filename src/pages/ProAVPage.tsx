import React, { useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Cable, CalendarDays, Check,
  ChevronRight, Laptop, Lightbulb, Mic, Monitor, Network, Plus,
  Presentation, SlidersHorizontal, Usb, Users, Video,
} from 'lucide-react';
import type { PageId } from '../types';
import { siteConfig } from '../site';
import roomImage from '../assets/images/proav-meeting-room.webp';
import tableImage from '../assets/images/proav-mediaport-usbc.webp';
import './ProAVPage.css';

// Room: our Mediaporty MTR concept, 2026-10-16 (illustration, not a client project).
// Table: mediaporty.com.pl/img/cms/mediaporty-av-home-20260813/mediaporty-usbc-logic-fade-v3.jpg
// Solution references: Logitech Rally Bar, HP Poly Studio and Microsoft Teams Rooms documentation.

interface ProAVPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onOpenConsultation: (topic?: string) => void;
}

const scenarios = [
  {
    id: 'byod', label: 'Z własnym laptopem', short: 'BYOD', icon: Laptop,
    eyebrow: 'Dla zespołów i gości', title: 'Podłącz laptop. Korzystaj z całej sali.',
    description: 'Prowadzisz spotkanie w swojej aplikacji, a obraz, kamera, mikrofony i głośniki należą do sali. To wygodny punkt wyjścia, gdy zapraszacie gości lub korzystacie z różnych platform.',
    benefits: ['Spotkanie z konta i aplikacji użytkownika', 'Przyłącze dostępne przy stole', 'Wideobar i ekran dobrane do pomieszczenia'],
    flow: [
      { icon: Laptop, label: 'Twój laptop', detail: 'aplikacja spotkania' },
      { icon: Usb, label: 'Przyłącze w stole', detail: 'dobrany tor USB / obrazu' },
      { icon: Video, label: 'Wyposażenie sali', detail: 'kamera, dźwięk i ekran' },
    ],
    result: 'Twój laptop prowadzi spotkanie. Sala zapewnia obraz i dźwięk.',
    note: 'Obsługa jednym USB-C wymaga zgodnego laptopa, przewodu i układu przełączania. Sam port ładowania USB-C w mediaporcie nie podłącza wideobaru ani monitora.',
  },
  {
    id: 'mtr', label: 'Microsoft Teams Rooms', short: 'MTR', icon: CalendarDays,
    eyebrow: 'Dla sal z własnym kalendarzem', title: 'Zapraszasz salę. Dołączasz z panelu.',
    description: 'Sala ma własne konto i system Microsoft Teams Rooms. Zaplanowane spotkanie uruchamiasz na panelu dotykowym, bez używania prywatnego laptopa jako centrum wideokonferencji.',
    benefits: ['Spotkania widoczne w kalendarzu sali', 'Kamera, dźwięk i ekran obsługiwane przez system', 'Konfiguracja konta i zarządzania wspólnie z IT'],
    flow: [
      { icon: CalendarDays, label: 'Zaproszenie sali', detail: 'konto zasobu i kalendarz' },
      { icon: SlidersHorizontal, label: 'Panel dotykowy', detail: 'wybór spotkania' },
      { icon: Users, label: 'Teams Rooms', detail: 'system sali prowadzi rozmowę' },
    ],
    result: 'To sala dołącza do rozmowy. Laptop może służyć do prezentacji.',
    note: 'Potrzebne są zgodny zestaw urządzeń, konto zasobu i licencja Teams Rooms. Tryb gościa oraz obsługę innych platform sprawdzamy dla konkretnego zestawu i oprogramowania.',
  },
  {
    id: 'flex', label: 'Sala wielofunkcyjna', short: 'FLEX', icon: Presentation,
    eyebrow: 'Spotkania, szkolenia, prezentacje', title: 'Jeden pokój. Kilka sposobów pracy.',
    description: 'Większy stół, zmienny układ krzeseł lub sala z przegrodą wymagają innego podejścia. Dobieramy osobno kamery, mikrofony, nagłośnienie i sposób prezentacji treści.',
    benefits: ['Pokrycie dźwiękiem całej strefy rozmowy', 'Obraz czytelny również z ostatniego rzędu', 'Sceny dopasowane do układu i funkcji sali'],
    flow: [
      { icon: Presentation, label: 'Sposób pracy', detail: 'spotkanie lub szkolenie' },
      { icon: SlidersHorizontal, label: 'Sterowanie AV', detail: 'wybór źródła i trybu' },
      { icon: Mic, label: 'System modułowy', detail: 'kamery, audio i wyświetlanie' },
    ],
    result: 'Wyposażenie wynika z akustyki i układu sali, nie tylko z liczby krzeseł.',
    note: 'Dla większych i dzielonych sal ustalamy strefy mikrofonów, obróbkę dźwięku oraz przełączanie sygnałów. Zakres integracji potwierdzamy na etapie projektu.',
  },
];

const systems = [
  { icon: Video, title: 'Wideobary i kamery', text: 'Kamera, mikrofony i głośniki w jednej obudowie albo osobne urządzenia do większej sali. Kadr i zasięg dobieramy do stołu, odległości oraz akustyki.', detail: 'Logitech Rally Bar / MeetUp · HP Poly Studio' },
  { icon: Monitor, title: 'Monitory, ekrany i projekcja', text: 'Prezentacja ma być czytelna z każdego miejsca. Dobieramy wielkość i jasność wyświetlacza, układ jednego lub dwóch monitorów, a gdy potrzeba — projektor i ekran projekcyjny.', detail: 'Widoczność treści · sposób montażu · światło dzienne' },
  { icon: Usb, title: 'Mediaporty i przyłącza', text: 'Zasilanie, ładowanie, obraz i sieć tam, gdzie siedzisz. Dopasowujemy moduły, wykończenie i otwór w blacie do stołu oraz rzeczywistych potrzeb użytkowników.', detail: 'INTEGRA · Bachmann · EVOline' },
  { icon: Mic, title: 'Dźwięk i akustyka', text: 'Rozmówca po drugiej stronie powinien słyszeć każdą osobę. Sprawdzamy pogłos, hałas i zasięg mikrofonów. Dobieramy nagłośnienie oraz, w razie potrzeby, procesor audio.', detail: 'Mikrofony stołowe lub sufitowe · głośniki · DSP' },
  { icon: Cable, title: 'Okablowanie i sieć', text: 'Projektujemy całą drogę sygnału od stołu do ekranu. Uwzględniamy długości przewodów, przedłużacze sygnału, zasilanie, PoE i dostęp do urządzeń podczas serwisu.', detail: 'USB · HDMI · LAN · trasy kablowe i szafa AV' },
  { icon: Lightbulb, title: 'Sterowanie salą i KNX', text: 'Scena „Spotkanie” może ustawić światło i rolety oraz przygotować obraz. Łączymy automatykę z AV przez interfejsy dostępne w dobranych urządzeniach.', detail: 'Światło · zaciemnienie · źródła obrazu · sceny' },
];

const faq = [
  { question: 'Czym różni się Teams Rooms od Teams na laptopie?', answer: 'W Teams Rooms spotkanie prowadzi system zainstalowany w sali, korzystający z jej konta i kalendarza. W trybie BYOD prowadzi je Twój laptop, do którego podłączasz urządzenia sali. Oba podejścia mogą współistnieć, jeśli przewidzimy odpowiednie przełączanie i kompatybilny sprzęt.' },
  { question: 'Czy możemy wykorzystać obecny monitor lub wideobar?', answer: 'Tak, jeśli pasują do planowanego sposobu pracy. Sprawdzamy model, dostępne złącza, oprogramowanie, wielkość obrazu i zgodność z platformą spotkań. Po tej weryfikacji wskazujemy, co zostaje, a co wymaga wymiany lub uzupełnienia.' },
  { question: 'Czy jeden kabel USB-C naprawdę wystarczy?', answer: 'Może wystarczyć, ale musi działać cały tor: port laptopa, przewód, stacja lub przełącznik i urządzenia sali. Osobno sprawdzamy obraz, dostęp do kamery i mikrofonów oraz moc ładowania Power Delivery. Gniazdo USB-C przeznaczone tylko do ładowania nie zapewnia tych funkcji.' },
  { question: 'Logitech czy Poly — co będzie lepsze?', answer: 'Zaczynamy od sali i sposobu spotkań. Znaczenie mają odległość od kamery, zasięg mikrofonów, akustyka, wybrana platforma i wymagania działu IT. Porównujemy konkretne zestawy Logitech oraz HP Poly, zamiast zakładać, że jedna marka będzie najlepsza w każdym pomieszczeniu.' },
  { question: 'Czy potrzebujemy licencji i udziału działu IT?', answer: 'Dla Teams Rooms potrzebne są konto zasobu oraz właściwa licencja Teams Rooms. Z IT uzgadniamy sieć, dostęp do usług, zarządzanie urządzeniami i aktualizacje. W trybie BYOD użytkownik korzysta ze swojej aplikacji i konta, zgodnie z zasadami organizacji.' },
];

export const ProAVPage: React.FC<ProAVPageProps> = ({ onNavigate, onOpenConsultation }) => {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scenario = scenarios[selected];
  const officesUrl = siteConfig()?.urls.offices || '/offices/';

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % scenarios.length;
    else if (event.key === 'ArrowLeft') next = (index + scenarios.length - 1) % scenarios.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = scenarios.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="proav-page">
      <section className="proav-hero" aria-labelledby="proav-heading">
        <div className="proav-hero-image">
          <img src={roomImage} alt="Przykładowa sala: duży ekran z wideobarem, panel dotykowy i mediaporty w stole" width="1672" height="941" fetchPriority="high" />
          <span>Wizualizacja przykładowej sali</span>
        </div>
        <div className="proav-container proav-hero-content">
          <nav className="proav-breadcrumb" aria-label="Ścieżka strony">
            <a href={officesUrl}>Biura</a><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">ProAV</span>
          </nav>
          <p className="proav-eyebrow"><span />ProAV · sale spotkań</p>
          <h1 id="proav-heading">Sala gotowa.<br />Możemy <span>zaczynać.</span></h1>
          <p className="proav-hero-lead">Dobry obraz. Wyraźny głos. Prosta obsługa.</p>
          <p className="proav-hero-text">Łączymy wideokonferencję, ekrany, mediaporty i automatykę w salę, w której możesz skupić się na rozmowie.</p>
          <div className="proav-actions">
            <button className="proav-button proav-button-lime" onClick={() => onOpenConsultation()}>Zaplanujmy Twoją salę <ArrowUpRight size={18} /></button>
            <a className="proav-text-link" href="#sposob-spotkan">Poznaj możliwości <ArrowDown size={16} /></a>
          </div>
          <div className="proav-hero-scope"><span>Projekt</span><span>Dobór sprzętu</span><span>Uruchomienie</span></div>
        </div>
      </section>

      <nav className="proav-section-nav" aria-label="Sekcje ProAV">
        <div className="proav-container">
          <a href="#sposob-spotkan"><span>01</span> Sposób spotkań</a>
          <a href="#wyposazenie"><span>02</span> Co integrujemy</a>
          <a href="#wdrozenie"><span>03</span> Jak wdrażamy</a>
          <a href="#pytania">Pytania i odpowiedzi <ArrowDown size={14} /></a>
        </div>
      </nav>

      <section id="sposob-spotkan" className="proav-section proav-scenarios" aria-labelledby="scenarios-heading">
        <div className="proav-container">
          <div className="proav-section-heading">
            <div><p className="proav-eyebrow">Najpierw sposób pracy</p><h2 id="scenarios-heading">Jak spotyka się Twój zespół?</h2></div>
            <p>Nie każda sala potrzebuje tego samego zestawu. Wybierz scenariusz, który jest Wam najbliższy.</p>
          </div>
          <div className="proav-tabs" role="tablist" aria-label="Sposób korzystania z sali">
            {scenarios.map((item, index) => {
              const Icon = item.icon;
              return <button key={item.id} ref={(node) => { tabRefs.current[index] = node; }} role="tab" id={`proav-tab-${item.id}`} aria-controls="proav-scenario-panel" aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => onTabKeyDown(event, index)}>
                <Icon size={21} aria-hidden="true" /><span>{item.label}</span><span className="proav-tab-code">{item.short}</span>
              </button>;
            })}
          </div>
          <div className="proav-scenario-panel" id="proav-scenario-panel" role="tabpanel" aria-labelledby={`proav-tab-${scenario.id}`} tabIndex={0}>
            <div className="proav-scenario-copy">
              <p className="proav-eyebrow">{scenario.eyebrow}</p>
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
              <ul className="proav-checks">{scenario.benefits.map(item => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul>
              <button className="proav-text-link" onClick={() => onOpenConsultation(`Konsultacja ProAV / ${scenario.label}`)}>Omów ten wariant <ArrowUpRight size={17} /></button>
            </div>
            <div className="proav-scenario-diagram">
              <div className="proav-diagram-heading"><span>Połączenie w praktyce</span><span>{scenario.short}</span></div>
              <ol className="proav-flow">{scenario.flow.map((step, i) => {
                const Icon = step.icon;
                return <li key={step.label}><div className="proav-flow-icon"><Icon size={27} strokeWidth={1.5} aria-hidden="true" /></div><div><strong>{step.label}</strong><span>{step.detail}</span></div><span className="proav-flow-number">0{i + 1}</span></li>;
              })}</ol>
              <p className="proav-diagram-result">{scenario.result}</p>
            </div>
            <p className="proav-scenario-note"><span>Przed doborem</span>{scenario.note}</p>
          </div>
        </div>
      </section>

      <section id="wyposazenie" className="proav-section proav-systems" aria-labelledby="systems-heading">
        <div className="proav-container">
          <div className="proav-section-heading"><div><p className="proav-eyebrow">Od stołu po ekran</p><h2 id="systems-heading">Sześć elementów.<br />Jedna spójna sala.</h2></div><p>Dobieramy urządzenia jako kompletny system. Ważne jest to, jak współpracują ze sobą i z wnętrzem.</p></div>
          <div className="proav-systems-grid">{systems.map((system, index) => {
            const Icon = system.icon;
            return <article key={system.title} className="proav-system"><div className="proav-system-top"><Icon size={29} strokeWidth={1.5} aria-hidden="true" /><span>0{index + 1}</span></div><h3>{system.title}</h3><p>{system.text}</p><p className="proav-system-detail">{system.detail}</p></article>;
          })}</div>
          <div className="proav-references"><span>Przykładowe technologie i rozwiązania</span><a href="https://www.logitech.com/en-us/business/shop/p/rallybar" target="_blank" rel="noopener noreferrer">Logitech <ArrowUpRight size={14} /></a><a href="https://support.hp.com/in-en/document/ish_15254712-12757922-16" target="_blank" rel="noopener noreferrer">HP Poly <ArrowUpRight size={14} /></a><a href="https://learn.microsoft.com/en-us/microsoftteams/rooms/" target="_blank" rel="noopener noreferrer">Microsoft Teams Rooms <ArrowUpRight size={14} /></a><a href="https://mediaporty.com.pl/" target="_blank" rel="noopener noreferrer">Mediaporty.com.pl <ArrowUpRight size={14} /></a></div>
        </div>
      </section>

      <section className="proav-table-section" aria-labelledby="table-heading">
        <div className="proav-container proav-table-grid">
          <div className="proav-table-visual"><img src={tableImage} alt="Laptop podłączony przewodem USB-C przez przepust w zamkniętym mediaporcie INTEGRA LOGIC" width="1486" height="819" loading="lazy" /><span>Detal stołu · INTEGRA LOGIC / Mediaporty.com.pl</span></div>
          <div className="proav-table-copy"><p className="proav-eyebrow">Technologia wpisana w mebel</p><h2 id="table-heading">Na stole porządek.<br />Pod ręką wszystko.</h2><p>Mediaport łączy wyposażenie sali z miejscem pracy. Wybieramy potrzebne złącza, sposób otwierania i kolor. Ze stolarzem uzgadniamy montaż, a pod blatem zostawiamy miejsce na przewody i dostęp serwisowy.</p><div className="proav-table-ports"><span>230 V</span><span>USB-C / PD</span><span>HDMI</span><span>LAN</span></div><p className="proav-table-note">Jeden przewód do laptopa? Tak, jeśli przewidzimy odpowiedni tor obrazu, danych i ładowania. Zakres funkcji ustalamy przed doborem modułów.</p><a className="proav-text-link" href="https://mediaporty.com.pl/" target="_blank" rel="noopener noreferrer">Poznaj systemy mediaportów <ArrowUpRight size={18} /></a></div>
        </div>
      </section>

      <section className="proav-infrastructure proav-section" aria-labelledby="infrastructure-heading">
        <div className="proav-container proav-infrastructure-grid">
          <div><p className="proav-eyebrow">To, czego nie widać</p><h2 id="infrastructure-heading">Dobry ProAV zaczyna się<br />przed montażem ekranu.</h2><p>Koordynujemy instalację z architektem, wykonawcą mebli i działem IT. Wtedy technologia pasuje do sali, a sala do codziennej pracy.</p><button className="proav-text-link" onClick={() => onNavigate('offices', 'konferencyjne')}>Połącz ProAV z automatyką biura <ArrowUpRight size={18} /></button></div>
          <div className="proav-infrastructure-list">
            <article><Cable size={23} aria-hidden="true" /><div><h3>Trasy i dostęp serwisowy</h3><p>Od podłogi przez stół aż do ściany: długości przewodów, promienie gięcia, przepusty i dostęp do zasilaczy.</p></div></article>
            <article><Network size={23} aria-hidden="true" /><div><h3>Sieć i odpowiedzialność IT</h3><p>Połączenia LAN, PoE, konta sal, uprawnienia i aktualizacje. Ustalamy, kto zarządza systemem po uruchomieniu.</p></div></article>
            <article><Mic size={23} aria-hidden="true" /><div><h3>Akustyka i światło</h3><p>Sprawdzamy pogłos, hałas wentylacji, odbicia na ekranie oraz oświetlenie twarzy. Sama lepsza kamera nie usunie tych problemów.</p></div></article>
          </div>
        </div>
      </section>

      <section id="wdrozenie" className="proav-section" aria-labelledby="process-heading">
        <div className="proav-container">
          <div className="proav-section-heading"><div><p className="proav-eyebrow">Od pomysłu do pierwszego spotkania</p><h2 id="process-heading">Jasny zakres. Sprawdzone połączenia.</h2></div><p>Możemy przygotować nową salę lub zacząć od przeglądu tej, z której już korzystacie.</p></div>
          <ol className="proav-process">
            {[
              ['Rozmowa i oględziny', 'Poznajemy układ sali, liczbę uczestników, platformy spotkań i to, co już macie.'],
              ['Koncepcja i dobór', 'Ustalamy wyposażenie, schemat połączeń, prace meblowe i wymagania dla IT.'],
              ['Montaż i konfiguracja', 'Łączymy urządzenia, konfigurujemy system i uzgodnione sceny sterowania.'],
              ['Test i przekazanie', 'Sprawdzamy rozmowę zdalną, udostępnianie treści i obsługę gościa. Przekazujemy instrukcję i dokumentację.'],
            ].map(([title, description], index) => <li key={title}><span className="proav-step-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}
          </ol>
        </div>
      </section>

      <section id="pytania" className="proav-section proav-faq-section" aria-labelledby="faq-heading">
        <div className="proav-container proav-faq-grid"><div><p className="proav-eyebrow">Przed decyzją</p><h2 id="faq-heading">Kilka dobrych<br />pytań na start.</h2><p>Bez skrótów myślowych.<br />I bez kupowania sprzętu w ciemno.</p></div><div className="proav-faq">{faq.map(item => <details key={item.question}><summary>{item.question}<Plus size={19} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div>
      </section>

      <section className="proav-contact-section" aria-labelledby="contact-proav-heading"><div className="proav-container proav-contact"><div><p className="proav-eyebrow">Porozmawiajmy o Waszym biurze</p><h2 id="contact-proav-heading">Zacznijmy od sali.<br />Sprzęt dobierzemy do niej.</h2><p>Powiedz nam, ile osób spotyka się przy stole, z jakich aplikacji korzystacie i co chcesz usprawnić.</p></div><div className="proav-contact-actions"><button className="proav-button proav-button-ink" onClick={() => onOpenConsultation()}>Omów projekt ProAV <ArrowUpRight size={20} /></button><a href="tel:+48505260715">+48 505 260 715 <ArrowRight size={16} /></a><span>Warszawa · realizacje w całej Polsce</span></div></div></section>
    </div>
  );
};
