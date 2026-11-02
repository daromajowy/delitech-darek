import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Blinds, Camera, DoorOpen, Droplets, Fan, Layers3, Lightbulb, Network, Plus, ShieldCheck, Smartphone, Sprout, Thermometer, Zap } from 'lucide-react';
import type { PageId } from '../types';
import { pageUrl } from '../site';
import { DayRhythm } from '../components/DayRhythm';
import contactImage from '../assets/images/homes-contact.webp';
import './HomesPage.css';

interface HomesPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onOpenConsultation: () => void;
  initialHash?: string;
}

const functions = [
  {
    title: 'Oświetlenie', icon: Lightbulb,
    benefit: 'Włączanie i ściemnianie wybranych lamp, światło do czytania, gotowania czy odpoczynku. W nocy delikatne oświetlenie drogi do łazienki.',
    plan: 'Podział na obwody, możliwość ściemniania opraw i zasilaczy oraz miejsca przycisków i czujników.',
  },
  {
    title: 'Rolety, żaluzje i zasłony', icon: Blinds,
    benefit: 'Sterowanie pojedynczym oknem, całym pokojem lub grupą osłon. Ustawienia na wybraną godzinę albo zależne od nasłonecznienia.',
    plan: 'Typ napędów, ich zasilanie, okablowanie i sposób sterowania. Przy żaluzjach także regulację kąta lameli.',
  },
  {
    title: 'Ogrzewanie i chłodzenie', icon: Thermometer,
    benefit: 'Osobne ustawienia temperatury w pomieszczeniach oraz tryby obecności i nieobecności. Sterowanie dopasowane do tempa pracy instalacji.',
    plan: 'Rodzaj ogrzewania, podział na strefy, pomiar temperatury i możliwość integracji klimatyzacji. Podłogówka reaguje wolniej niż klimatyzator.',
  },
  {
    title: 'Wentylacja i jakość powietrza', icon: Fan,
    benefit: 'Zmiana intensywności wentylacji według obecności, wilgotności lub poziomu CO₂. Podgląd stanu rekuperatora i dostępnych komunikatów serwisowych.',
    plan: 'Model centrali, dostępny moduł komunikacji, miejsca czujników oraz zakres odczytu i sterowania. Nastawy uzgadniamy z wykonawcą wentylacji.',
  },
  {
    title: 'Sceny i wspólne polecenia', icon: Layers3,
    benefit: 'Kilka ustalonych działań pod jednym przyciskiem. Na przykład wyłączenie wybranych świateł i zmiana ustawień domu przy wyjściu.',
    plan: 'Dokładną listę działań, sposób uruchamiania i możliwość osobnej obsługi każdej funkcji. Ustalamy też, co ma pozostać włączone.',
  },
];

const integrations = [
  {
    title: 'Wideodomofony, furtki i bramy', icon: DoorOpen,
    benefit: 'Obraz i rozmowa z gościem na zgodnym panelu lub telefonie, otwarcie furtki i sterowanie bramą. Wywołanie może też włączyć światło przy wejściu.',
    plan: 'Model wideodomofonu i napędów, sieć, moduły połączeniowe, dostępne sygnały położenia oraz uprawnienia do otwierania. Zakres obsługi poza domem zależy od wybranego rozwiązania.',
  },
  {
    title: 'Kamery i podgląd posesji', icon: Camera,
    benefit: 'Podgląd wybranych kamer w panelu lub aplikacji. Obsługiwane zdarzenie z kamery może uruchomić oświetlenie albo powiadomienie.',
    plan: 'Zgodność obrazu i zdarzeń z systemem wizualizacji, sieć oraz dostęp użytkowników. Zapis i odtwarzanie nagrań dobieramy osobno, w systemie monitoringu.',
  },
  {
    title: 'Alarmy i czujniki', icon: ShieldCheck,
    benefit: 'Reakcja domu na uzbrojenie alarmu, informacja o otwartym oknie lub wykrytym zalaniu. Możliwe są ustalone reakcje światła, temperatury i powiadomienia.',
    plan: 'Centralę alarmową, czujniki, moduł integracji i dozwolone sygnały. Automatykę uzgadniamy z instalatorem alarmu; dedykowany system ochrony zachowuje własne funkcje.',
  },
  {
    title: 'Zdalny dostęp', icon: Smartphone,
    benefit: 'Sprawdzenie stanu domu i zmiana wybranych ustawień spoza posesji. Powiadomienia o uzgodnionych zdarzeniach oraz dostęp serwisowy, jeśli go potrzebujesz.',
    plan: 'Szyfrowane połączenie przez odpowiednią bramkę lub VPN, konta i uprawnienia, dostęp do internetu oraz ewentualne opłaty. Dostęp serwisowy uruchamiamy za Twoją zgodą.',
  },
  {
    title: 'Urządzenia IoT i audio', icon: Network,
    benefit: 'Włączenie zgodnych lamp, gniazd, czujników i systemu audio do obsługi przyciskiem lub wspólnych scen. Wybrane urządzenia IoT mogą współpracować z instalacją KNX.',
    plan: 'Konkretny model, obsługiwane funkcje i sposób połączenia, np. Matter albo interfejs producenta. Dobieramy bramkę lub serwer i sprawdzamy zależność od chmury.',
  },
  {
    title: 'Podlewanie ogrodu', icon: Droplets,
    benefit: 'Osobne harmonogramy dla stref ogrodu, podlewanie zależne od wilgotności gleby lub opadów i możliwość wstrzymania go, gdy korzystasz z tarasu.',
    plan: 'Podział na sekcje, elektrozawory, sterownik, czujniki i okablowanie. Z wykonawcą ogrodu ustalamy czasy pracy, warunki blokady i obsługę ręczną.',
  },
  {
    title: 'Roboty koszące', icon: Sprout,
    benefit: 'Dla zgodnych modeli: podgląd stanu, wstrzymanie koszenia i polecenie powrotu do stacji. Możemy uzgodnić pracę kosiarki z harmonogramem podlewania i korzystaniem z ogrodu.',
    plan: 'Model robota, dostępne polecenia, moduł łączności i integrację producenta. Część połączeń wymaga konta oraz chmury; uwzględniamy reakcję na brak łączności.',
  },
  {
    title: 'Energia, fotowoltaika i ładowanie', icon: Zap,
    benefit: 'Podgląd zużycia i produkcji energii, wykorzystanie nadwyżki z fotowoltaiki do ładowania auta oraz dopasowanie ładowania do dostępnej mocy.',
    plan: 'Liczniki, falownik, ładowarkę, dostępne dane i możliwość sterowania. Wymagane są zgodne urządzenia oraz uzgodnione limity i priorytety zarządzania energią.',
  },
];

function FunctionRows({ items }: { items: typeof functions }) {
  return (
    <>
      <div className="homes-functions__head" aria-hidden="true"><span>Obszar</span><span>Co możesz uzyskać</span><span>Co ustalamy przed wykonaniem</span></div>
      <div className="homes-functions__list">
        {items.map(({ title, icon: Icon, benefit, plan }) => (
          <article className="homes-function" key={title}>
            <h3><Icon size={30} strokeWidth={1.4} aria-hidden="true" />{title}</h3>
            <div><span className="homes-function__label">Co możesz uzyskać</span><p>{benefit}</p></div>
            <div className="homes-function__plan"><span className="homes-function__label">Co ustalamy przed wykonaniem</span><p>{plan}</p></div>
          </article>
        ))}
      </div>
    </>
  );
}

const steps = [
  { title: 'Potrzeby domowników', text: 'Przechodzimy przez pomieszczenia i codzienne sytuacje. Ustalamy, co ma działać automatycznie, a co uruchamiasz samodzielnie.', result: 'Uzgodniona lista funkcji.' },
  { title: 'Dobór i wycena', text: 'Dobieramy urządzenia do ustalonego zakresu. Oddzielamy funkcje potrzebne teraz od opcji, które możesz zaplanować na później.', result: 'Lista urządzeń, zakres i warianty.' },
  { title: 'Uzgodnienia instalacyjne', text: 'Z architektem i wykonawcami ustalamy wymagania dla przewodów, rozdzielnicy, osprzętu i podłączanych urządzeń.', result: 'Wymagania i podział prac.' },
  { title: 'Programowanie i odbiór', text: 'Uruchamiamy uzgodniony zakres, sprawdzamy funkcje i sceny oraz pokazujemy domownikom, jak korzystać z instalacji.', result: 'Sprawdzone działanie i instruktaż.' },
];

const questions = [
  { id: 'dom', title: 'Kiedy najlepiej się odezwać?', text: 'Przed wykonaniem instalacji elektrycznej i zamówieniem napędów osłon. Wtedy możemy uwzględnić przewody, miejsca sterowania i rozdzielnicę bez późniejszego przerabiania gotowych wnętrz.' },
  { id: 'etapowanie', title: 'Czy mogę zacząć od części funkcji?', text: 'Tak. Wybieramy zakres na pierwszy etap i ustalamy, co przygotować pod późniejszą rozbudowę. Warto od razu zaplanować potrzebne przewody oraz miejsce w rozdzielnicy — samo przeprogramowanie nie zastąpi brakującej infrastruktury.' },
  { id: 'apartament', title: 'Co trzeba sprawdzić w apartamencie?', text: 'Możliwości sterowania ogrzewaniem, klimatyzacją i osłonami, zakres instalacji dewelopera oraz wymagane uzgodnienia z administracją. Z architektem ustalamy położenie i wygląd osprzętu, zanim zostaną zamknięte ściany i zabudowy.' },
  { id: 'modernizacja', title: 'Czy KNX ma sens w gotowym wnętrzu?', text: 'Najpierw sprawdzamy istniejące okablowanie, rozdzielnicę i urządzenia, które chcesz zachować. Dopiero po tym określamy dostępne funkcje, sposób sterowania i zakres ingerencji we wnętrze. Możliwość integracji weryfikujemy dla konkretnych modeli.' },
  { id: 'zgodnosc', title: 'Czy połączymy urządzenia, które już mam?', text: 'Podaj producenta, model i funkcję, na której Ci zależy. Sprawdzamy dostępny interfejs, obsługiwane polecenia i informacje zwrotne. Na tej podstawie określamy potrzebne moduły, zakres integracji oraz ewentualne koszty usług producenta.' },
  { id: 'internet', title: 'Co działa po utracie internetu?', text: 'Podstawowe funkcje KNX planujemy lokalnie. Zdalny dostęp wymaga internetu, a działanie integracji IoT zależy od sposobu połączenia. W projekcie określamy, które funkcje pozostaną dostępne lokalnie, które korzystają z chmury i jak instalacja ma reagować na utratę łączności.' },
  { id: 'koszt', title: 'Od czego zależy koszt instalacji?', text: 'Od liczby sterowanych obwodów światła, osłon i stref temperatury, wybranego osprzętu, integracji oraz zakresu prac. Sam metraż nie wystarcza. Do wstępnej rozmowy przydadzą się plan pomieszczeń, etap inwestycji i lista oczekiwanych funkcji.' },
];

export function HomesPage({ onOpenConsultation, initialHash }: HomesPageProps) {
  const page = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!initialHash) return;
    if (initialHash === 'integracje-knx') {
      window.location.replace(pageUrl('solutions', initialHash));
      return;
    }
    if (initialHash === 'osprzet' || initialHash === 'dlaczego-knx') {
      window.location.replace(pageUrl('home', initialHash));
      return;
    }
    const question = Array.from(page.current?.querySelectorAll('details') || []).find((item) => item.id === initialHash);
    if (question) question.open = true;
  }, [initialHash]);

  return (
    <div className="homes-page" ref={page}>
      <DayRhythm asHero />
      <section className="homes-intro homes-width" aria-labelledby="homes-title">
        <div>
          <p className="homes-eyebrow">Domy i apartamenty · KNX</p>
          <h2 id="homes-title">Oświetlenie, rolety i temperatura.<span>Zaplanowane jako jeden system.</span></h2>
        </div>
        <div className="homes-intro__copy">
          <p>Łączymy instalacje domu w standardzie KNX. Ustalamy, które funkcje mają działać automatycznie, co chcesz obsługiwać przyciskiem i gdzie potrzebujesz indywidualnych ustawień.</p>
          <p>Dobieramy też integracje: od wideodomofonu i alarmu po urządzenia IoT i automatykę ogrodu. Uzgadniamy wymagania z wykonawcami i uruchamiamy ustalony zakres.</p>
          <button type="button" className="homes-button" onClick={onOpenConsultation}>Omów instalację w swoim domu <ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </section>

      <nav className="homes-jump homes-width" aria-label="Skróty dla domów i apartamentów">
        <span>Przejdź do</span>
        <a href={pageUrl('solutions', 'integracje-knx')} aria-label="Możliwości KNX – w kategorii Co może Twój dom">Możliwości KNX <ArrowUpRight size={14} aria-hidden="true" /></a>
        <a href={pageUrl('home', 'osprzet')} aria-label="Design i obsługa – sekcja na stronie głównej">Design i obsługa <ArrowUpRight size={14} aria-hidden="true" /></a>
        <a href={pageUrl('homes', 'mozliwosci')}>Funkcje domu <ArrowDown size={14} aria-hidden="true" /></a>
        <a href={pageUrl('homes', 'integracje')}>Integracje i ogród <ArrowDown size={14} aria-hidden="true" /></a>
        <a href={pageUrl('home', 'dlaczego-knx')} aria-label="Dlaczego KNX – sekcja na stronie głównej">Dlaczego KNX <ArrowUpRight size={14} aria-hidden="true" /></a>
        <a href={pageUrl('homes', 'etapy')}>Etapy współpracy <ArrowDown size={14} aria-hidden="true" /></a>
        <a href={pageUrl('homes', 'koszt')}>Koszt i przygotowanie <ArrowDown size={14} aria-hidden="true" /></a>
      </nav>

      <section id="mozliwosci" className="homes-functions homes-width homes-section" aria-labelledby="homes-functions-title">
        <div className="homes-section-heading">
          <div><p className="homes-eyebrow">Funkcje, które wybierasz</p><h2 id="homes-functions-title">Co może obsługiwać<br />Twój dom?</h2></div>
          <p>Zaczynamy od konkretnych potrzeb. Przy każdej funkcji ustalamy sposób działania i wymagania dla instalacji.</p>
        </div>
        <FunctionRows items={functions} />
        <p className="homes-note">Zakres dobieramy do konkretnych urządzeń. Możliwość integracji sprawdzamy przed ich zakupem.</p>
      </section>

      <section id="integracje" className="homes-integrations" aria-labelledby="homes-integrations-title">
        <div className="homes-width homes-section">
          <div className="homes-section-heading">
            <div><p className="homes-eyebrow">Dom, wejście i ogród</p><h2 id="homes-integrations-title">Co jeszcze możemy<br />połączyć z KNX?</h2></div>
            <p>Łączymy KNX z wybranymi systemami IP i IoT. Ustalamy, co ma współpracować, gdzie będzie obsługiwane i jakie informacje zobaczysz w panelu lub aplikacji.</p>
          </div>
          <FunctionRows items={integrations} />
          <p className="homes-note">Każdą integrację potwierdzamy dla konkretnego modelu: dostępne funkcje, potrzebny moduł lub serwer, działanie lokalne albo przez chmurę oraz ewentualne opłaty. Zakres obsługi w jednej aplikacji zależy od wybranych systemów.</p>
        </div>
      </section>

      <section id="etapy" className="homes-process" aria-labelledby="homes-process-title">
        <div className="homes-width homes-section">
          <div className="homes-section-heading"><div><p className="homes-eyebrow">Od ustaleń do uruchomienia</p><h2 id="homes-process-title">Co powstaje na<br />każdym etapie?</h2></div><p>Najpierw określamy oczekiwany sposób działania. Na tej podstawie dobieramy urządzenia i uzgadniamy prace.</p></div>
          <ol className="homes-process__steps">
            {steps.map((step, index) => (
              <li key={step.title}><span className="homes-number" aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p><p className="homes-process__result"><span>Efekt</span>{step.result}</p></li>
            ))}
          </ol>
          <p className="homes-note">W ofercie określamy zakres dokumentacji, dostaw, montażu, programowania i późniejszego wsparcia. Ustalamy również podział odpowiedzialności między wykonawcami.</p>
        </div>
      </section>

      <section className="homes-questions homes-width homes-section" aria-labelledby="homes-questions-title">
        <div className="homes-questions__intro"><p className="homes-eyebrow">Przed pierwszą rozmową</p><h2 id="homes-questions-title">Etap inwestycji.<br />Zakres. Koszt.</h2><p>Budujesz, wykańczasz czy modernizujesz? Od tego zależy, co warto przygotować i jakie rozwiązania możemy zaproponować.</p></div>
        <div className="homes-questions__list">
          {questions.map((question) => (
            <details id={question.id} key={question.id}><summary>{question.title}<Plus size={20} aria-hidden="true" /></summary><p>{question.text}</p></details>
          ))}
        </div>
      </section>

      <section className="homes-contact" aria-labelledby="homes-contact-title">
        <img className="homes-contact__image" src={contactImage} alt="" width={2172} height={724} loading="lazy" decoding="async" />
        <div className="homes-contact__content homes-width">
          <div><p className="homes-eyebrow">Zacznijmy od Twoich planów</p><h2 id="homes-contact-title">Budujesz dom<br />lub wykańczasz<br />apartament?</h2></div>
          <div className="homes-contact__copy"><p>Powiedz, na jakim etapie jesteś. Ustalimy, co warto przygotować teraz, jakie funkcje mają sens i co jest potrzebne do wyceny.</p><button type="button" className="homes-button" onClick={onOpenConsultation}>Omów zakres instalacji <ArrowRight size={20} aria-hidden="true" /></button></div>
        </div>
      </section>
    </div>
  );
}
