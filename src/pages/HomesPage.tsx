import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import type { PageId } from '../types';
import { pageUrl } from '../site';
import contactImage from '../assets/images/homes-contact.webp';
import './HomesPage.css';

interface HomesPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onOpenConsultation: () => void;
  initialHash?: string;
}

const redirectedSections = new Map<string, [PageId, string]>([
  ['mozliwosci', ['solutions', 'integracje']],
  ['integracje', ['solutions', 'integracje-knx']],
  ['integracje-knx', ['solutions', 'integracje-knx']],
  ['osprzet', ['home', 'osprzet']],
  ['dlaczego-knx', ['home', 'dlaczego-knx']],
]);


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
    const destination = redirectedSections.get(initialHash);
    if (destination) {
      window.location.replace(pageUrl(...destination));
      return;
    }
    const question = Array.from(page.current?.querySelectorAll('details') || []).find((item) => item.id === initialHash);
    if (question) question.open = true;
  }, [initialHash]);

  return (
    <div className="homes-page" ref={page}>
      <section className="homes-intro homes-width" aria-labelledby="homes-title">
        <div>
          <p className="homes-eyebrow">Domy i apartamenty · KNX</p>
          <h2 id="homes-title">Przewody dopiero w planie?<span> A może już w ścianach?</span></h2>
        </div>
        <div className="homes-intro__copy">
          <p>W nowym domu przewodowy KNX najlepiej zaplanować, zanim elektryk ułoży kable. Na rzucie z meblami ustalimy, po której stronie łóżka chcesz gasić światło i przy którym oknie zostawić zasilanie do przyszłej rolety.</p>
          <p>W apartamencie z ułożonymi kablami sprawdzamy przewody i miejsce w puszkach. Jeśli instalacja 230 V na to pozwala, dobieramy JUNG HOME. Jego urządzenia komunikują się bezprzewodowo, więc przycisk przy wyjściu może zgasić światła w kilku pokojach bez dodatkowego przewodu sterującego.</p>
          <button type="button" className="homes-button" onClick={onOpenConsultation}>Omów instalację w swoim domu <ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </section>

      <nav className="homes-jump homes-width" aria-label="Skróty dla domów i apartamentów">
        <span>Przejdź do</span>
        <a href={pageUrl('solutions', 'integracje-knx')} aria-label="Możliwości KNX – w kategorii Co może Twój dom">Możliwości KNX <ArrowUpRight size={14} aria-hidden="true" /></a>
        <a href={pageUrl('home', 'osprzet')} aria-label="Design i obsługa – sekcja na stronie głównej">Design i obsługa <ArrowUpRight size={14} aria-hidden="true" /></a>
        <a href={pageUrl('home', 'dlaczego-knx')} aria-label="Dlaczego KNX – sekcja na stronie głównej">Dlaczego KNX <ArrowUpRight size={14} aria-hidden="true" /></a>
        <a href={pageUrl('solutions', 'etapy')}>Etapy współpracy <ArrowUpRight size={14} aria-hidden="true" /></a>
        <a href={pageUrl('homes', 'koszt')}>Koszt i przygotowanie <ArrowDown size={14} aria-hidden="true" /></a>
      </nav>


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
