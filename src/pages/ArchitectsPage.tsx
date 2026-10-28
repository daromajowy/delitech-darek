import React from 'react';
import { ArrowRight, ArrowUpRight, Blocks, Layers, MessageCircle, Palette, Plus, RefreshCw, UsersRound } from 'lucide-react';
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

const knxBenefits = [
  {
    icon: Palette,
    title: 'Wygląd pasujący do Twojej wizji',
    text: 'KNX obejmuje urządzenia wielu producentów. Możesz szukać przycisku, materiału i koloru, które pasują do wnętrza, a my sprawdzimy funkcje oraz zgodność wybranego osprzętu.',
  },
  {
    icon: Layers,
    title: 'Spokojniejsza ściana. Prostsza obsługa.',
    text: 'Odpowiednio dobrany przycisk lub panel może obsługiwać kilka funkcji. Wspólnie ustalamy, co połączyć i jak to oznaczyć, żeby domownicy łatwo odnaleźli się we własnym domu.',
  },
  {
    icon: RefreshCw,
    title: 'Miejsce na kolejne potrzeby',
    text: 'Funkcje można zmieniać w konfiguracji w granicach możliwości urządzeń. Dalszą rozbudowę warto przewidzieć już w projekcie okablowania i rozdzielnicy.',
  },
];

const collaborationSteps = [
  {
    title: 'Poznajemy projekt i domowników',
    text: 'Rozmawiamy o układzie wnętrza, zwyczajach klienta, etapie inwestycji i budżecie. Na początek wystarczy opis potrzeb.',
    result: 'Wspólne priorytety i temat do dalszej pracy.',
  },
  {
    title: 'Ustalamy, jak ma działać dom',
    text: 'Dobieramy potrzebne funkcje i sposób obsługi. Omawiamy je z Tobą oraz inwestorem, zanim wybierzemy konkretne urządzenia.',
    result: 'Czytelne założenia do uzgodnienia z klientem.',
  },
  {
    title: 'Łączymy detal z techniką',
    text: 'Dobieramy osprzęt i miejsca sterowania. Z projektantem instalacji oraz elektrykiem uzgadniamy wymagania, zakres prac i odpowiedzialności.',
    result: 'Ustalenia potrzebne pracowni i wykonawcom.',
  },
  {
    title: 'Sprawdzamy efekt z użytkownikami',
    text: 'W uzgodnionym zakresie uruchomienia sprawdzamy działanie i sposób obsługi z domownikami. Omawiamy ustawienia oraz możliwe korekty.',
    result: 'Przekazanie rozwiązania i omówienie dalszego wsparcia.',
  },
];

const questions = [
  {
    title: 'To mój pierwszy projekt z KNX. Od czego zacząć?',
    text: 'Od wnętrza i potrzeb klienta. Nie musisz znać parametrów urządzeń ani sposobu ich programowania. Pomożemy przełożyć pomysł na funkcje domu, a szczegóły techniczne omówimy wspólnie z osobami odpowiedzialnymi za instalację.',
  },
  {
    title: 'Kiedy najlepiej włączyć Was do projektu?',
    text: 'Najlepiej przed zamknięciem projektu instalacji elektrycznej. Wtedy łatwiej skoordynować oświetlenie, osłony okienne, ogrzewanie i miejsca sterowania z wnętrzem. Przy rozpoczętej budowie lub remoncie najpierw sprawdzamy dostępne możliwości.',
  },
  {
    title: 'Inwestor ma już elektryka. Czy możemy działać razem?',
    text: 'Możemy uzgodnić wymagania automatyki z elektrykiem inwestora. Na początku określamy, kto odpowiada za projekt instalacji, okablowanie, rozdzielnicę, montaż i programowanie. Zakres naszej pracy dopasowujemy do potrzeb oraz kompetencji wykonawców.',
  },
  {
    title: 'Czy można zacząć od wybranych funkcji?',
    text: 'Tak. Wspólnie wybieramy to, co rzeczywiście przyda się domownikom. Możemy też omówić przygotowanie instalacji pod przyszłe potrzeby. Zakres, urządzenia i koszt ustalamy dla konkretnego projektu.',
  },
  {
    title: 'Jakie materiały otrzyma moja pracownia?',
    text: 'Zakres materiałów ustalamy przed rozpoczęciem prac. Może obejmować założenia funkcjonalne, dobór osprzętu i informacje potrzebne do koordynacji z wykonawcami. Osobno uzgadniamy zakres dokumentacji technicznej — koncepcja wnętrza nie zastępuje projektu instalacji.',
  },
  {
    title: 'Jak przygotować się do pierwszej rozmowy?',
    text: 'Przygotuj etap i lokalizację inwestycji, najważniejsze potrzeby klienta oraz planowany termin. Jeśli masz już kierunek stylistyczny lub wybrane urządzenia, opowiedz nam o nich. Nie potrzebujesz gotowej listy produktów.',
  },
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
        <p className="architects-hero__intro">Pomagamy połączyć estetykę wnętrza z wygodnym sterowaniem domem. Ty znasz wizję i potrzeby klienta. My wspieramy Cię w decyzjach o automatyce.</p>
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
        <p className="architects-advice__intro">Znamy osprzęt i jego zastosowania. Rozmawiamy o materiale, świetle i wygodzie, a potem sprawdzamy, co jest potrzebne, żeby ten pomysł dobrze działał.</p>
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

    <section id="knx-dla-pracowni" className="architects-standard architects-content-width" aria-labelledby="architects-standard-title">
      <div className="architects-section-intro">
        <div>
          <p className="architects-eyebrow">KNX w języku wnętrz</p>
          <h2 id="architects-standard-title">Technologia, która daje<br />swobodę projektowania.</h2>
        </div>
        <p className="architects-section-lead">KNX to wspólny standard komunikacji urządzeń w domu. Pomaga połączyć światło, osłony okienne i temperaturę w spójny sposób obsługi. Dla pracowni oznacza to konkretne możliwości.</p>
      </div>
      <div className="architects-standard__grid">
        {knxBenefits.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <a className="architects-source-link" href="https://knxpoland.pl/strefa-architekta/" target="_blank" rel="noopener noreferrer">
        Więcej o standardzie: Strefa Architekta KNX Polska <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </section>

    <section id="wspolpraca" className="architects-process architects-content-width" aria-labelledby="architects-process-title">
      <div className="architects-process__intro">
        <p className="architects-eyebrow">Pracownia + InteliSpaces</p>
        <h2 id="architects-process-title">Od pierwszego pomysłu<br />wiesz, co dalej.</h2>
        <p className="architects-section-lead">Nie musisz być specjalistą od automatyki. Wnosisz wizję wnętrza i znajomość klienta. My pomagamy zaplanować sterowanie, dobrać osprzęt i uzgodnić techniczną stronę projektu.</p>
        <div className="architects-process__note">
          <MessageCircle size={24} strokeWidth={1.5} aria-hidden="true" />
          <p>Możemy porozmawiać wspólnie z inwestorem. Wyjaśnimy możliwości prostym językiem i pomożemy ustalić priorytety.</p>
        </div>
        <button type="button" className="architects-text-button" onClick={() => onOpenConsultation('Współpraca z pracownią architektoniczną')}>
          Omówmy zakres współpracy <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
      <ol className="architects-process__steps">
        {collaborationSteps.map(({ title, text, result }, index) => (
          <li key={title}>
            <span className="architects-process__number" aria-hidden="true">0{index + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
              <p className="architects-process__result"><span>Na tym etapie:</span> {result}</p>
            </div>
          </li>
        ))}
      </ol>
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

    <section id="pytania" className="architects-faq architects-content-width" aria-labelledby="architects-faq-title">
      <div className="architects-faq__intro">
        <p className="architects-eyebrow">Zanim zaczniemy</p>
        <h2 id="architects-faq-title">Pierwszy projekt z KNX?<br />Masz kogo zapytać.</h2>
        <p className="architects-section-lead">Zebraliśmy sprawy, które warto omówić na początku. Szczegóły dopasujemy do Twojej pracowni i konkretnej inwestycji.</p>
      </div>
      <div className="architects-faq__questions">
        {questions.map(({ title, text }) => (
          <details key={title}>
            <summary>{title}<Plus size={21} aria-hidden="true" /></summary>
            <p>{text}</p>
          </details>
        ))}
      </div>
    </section>

    <section id="kontakt-pracownia" className="architects-contact architects-content-width" aria-labelledby="architects-contact-title">
      <div className="architects-contact__copy">
        <p className="architects-eyebrow">Porozmawiajmy po ludzku</p>
        <h2 id="architects-contact-title">Za technologią<br />stoją konkretne osoby.</h2>
        <p className="architects-section-lead">InteliSpaces rozwijamy w ramach Delitech. Łączymy dobór osprzętu, planowanie automatyki i koordynację wdrożenia. Porozmawiasz z ludźmi zaangażowanymi w Twój projekt.</p>
        <div className="architects-contact__actions">
          <button type="button" className="architects-button" onClick={() => onOpenConsultation()}>
            Porozmawiajmy o współpracy <ArrowRight size={20} aria-hidden="true" />
          </button>
          <a className="architects-text-link architects-contact__team-link" href={pageUrl('team')}>Poznaj cały zespół InteliSpaces <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <p className="architects-contact__location">Warszawa, ul. Konwaliowa 7, lok. 103 — po umówieniu terminu. Możemy też zacząć od rozmowy online.</p>
      </div>
    </section>
  </div>
);
