import React from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Cable, CalendarDays, Camera, Check,
  ChevronRight, Laptop, Lightbulb, Mic, Monitor, Network, Plug,
  Presentation, SlidersHorizontal, Speaker, Sun, Usb, Users,
} from 'lucide-react';
import type { PageId } from '../types';
import { siteConfig } from '../site';
import roomImage from '../assets/images/proav-room-hybrid.webp';
import videoImage from '../assets/images/proav-videobar-detail.webp';
import presentationImage from '../assets/images/proav-presentation-room.webp';
import cablingImage from '../assets/images/proav-cabling-detail.webp';
import tableImage from '../assets/images/proav-mediaport-usbc.webp';
import './ProAVPage.css';

// Generated visuals illustrate possible solutions, not client installations or particular device models.
// Originals and prompts: outputs/intelispaces-proav-visual-20261025.
// Table detail: mediaporty.com.pl/img/cms/mediaporty-av-home-20260813/mediaporty-usbc-logic-fade-v3.jpg
interface ProAVPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onOpenConsultation: (topic?: string) => void;
}

const questions = [
  { title: 'Czy można zachować obecny sprzęt?', text: 'Tak, jeśli pasuje do planowanego sposobu pracy. Sprawdzamy monitor, kamerę, złącza i oprogramowanie. Wskazujemy, co można wykorzystać, a co warto uzupełnić.' },
  { title: 'Logitech czy Poly?', text: 'Dobieramy konkretny zestaw do stołu, akustyki i platformy spotkań. Porównujemy kadr kamery, zasięg mikrofonów, możliwości rozbudowy i wymagania Waszego IT.' },
  { title: 'Czy zadziała z aplikacją gościa?', text: 'W trybie z własnym laptopem korzystasz ze swojej aplikacji i konta. W Teams Rooms obsługa innych platform oraz przełączanie na laptop zależą od urządzeń i ich oprogramowania. Sprawdzamy to przy doborze.' },
  { title: 'Co przygotować do pierwszej rozmowy?', text: 'Wystarczą przybliżone wymiary sali, liczba miejsc, używane aplikacje i lista obecnego sprzętu. Warto też wskazać, co dziś przeszkadza: dźwięk, obraz, przewody czy sama obsługa.' },
];

const Photo = ({ src, alt, width, height, caption }: { src: string; alt: string; width: number; height: number; caption?: string }) => (
  <figure className="proav-photo">
    <img src={src} alt={alt} width={width} height={height} loading="lazy" />
    <figcaption>{caption || 'Wizualizacja przykładowego rozwiązania'}</figcaption>
  </figure>
);

export const ProAVPage: React.FC<ProAVPageProps> = ({ onNavigate, onOpenConsultation }) => {
  const officesUrl = siteConfig()?.urls.offices || '/offices/';
  return (
    <div className="proav-page">
      <section className="proav-hero" aria-labelledby="proav-heading">
        <div className="proav-hero-image">
          <img src={roomImage} alt="Sala spotkań z dużym monitorem, wideobarem, panelem dotykowym i przyłączem w stole" width="1672" height="941" fetchPriority="high" />
          <span>Wizualizacja przykładowej sali</span>
        </div>
        <div className="proav-container proav-hero-content">
          <nav className="proav-breadcrumb" aria-label="Ścieżka strony">
            <a href={officesUrl}>Biura</a><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">ProAV</span>
          </nav>
          <p className="proav-eyebrow"><span />ProAV · sale spotkań</p>
          <h1 id="proav-heading">Sala gotowa.<br />Możemy <span>zaczynać.</span></h1>
          <p className="proav-hero-lead">Dobry obraz. Wyraźny głos. Prosta obsługa.</p>
          <p className="proav-hero-text">Łączymy kamery, dźwięk, ekrany i przyłącza w jeden wygodny system. Ty skupiasz się na spotkaniu.</p>
          <div className="proav-actions">
            <button className="proav-button proav-button-lime" onClick={() => onOpenConsultation()}>Zaplanujmy Twoją salę <ArrowUpRight size={18} /></button>
            <a className="proav-text-link" href="#wyposazenie">Zobacz, co łączymy <ArrowDown size={16} /></a>
          </div>
          <div className="proav-hero-scope"><span>Projekt</span><span>Dobór sprzętu</span><span>Uruchomienie</span></div>
        </div>
      </section>

      <section className="proav-benefits" aria-label="Co daje dobrze wyposażona sala">
        <div className="proav-container">
          <article><Camera aria-hidden="true" /><div><h2>Widać uczestników</h2><p>Kadr dobrany do stołu i miejsc w sali.</p></div></article>
          <article><Mic aria-hidden="true" /><div><h2>Słychać rozmowę</h2><p>Mikrofony i akustyka dopasowane do wnętrza.</p></div></article>
          <article><Plug aria-hidden="true" /><div><h2>Łatwo się połączyć</h2><p>Laptop lub panel sali. Jasny sposób obsługi.</p></div></article>
        </div>
      </section>

      <section id="wyposazenie" className="proav-section proav-story" aria-labelledby="video-heading">
        <div className="proav-container proav-story-grid">
          <Photo src={videoImage} alt="Kamera i głośniki wideobaru w jednej obudowie zamontowanej pod monitorem" width={1536} height={1024} />
          <div className="proav-story-copy">
            <p className="proav-eyebrow">01 / Wideokonferencje</p>
            <h2 id="video-heading">Dobrze Cię widać.<br />Dobrze Cię słychać.</h2>
            <p>Wideobar łączy kamerę, mikrofony i głośniki w jednej obudowie. W większej sali uzupełniamy go dodatkowymi mikrofonami lub dobieramy osobne urządzenia.</p>
            <ul className="proav-feature-list">
              <li><Camera aria-hidden="true" /><div><strong>Kamera obejmuje stół</strong><span>Dobieramy kadr i funkcje zbliżania do układu miejsc.</span></div></li>
              <li><Mic aria-hidden="true" /><div><strong>Głos dociera z całej sali</strong><span>Uwzględniamy odległość od mikrofonu, pogłos i hałas.</span></div></li>
              <li><Speaker aria-hidden="true" /><div><strong>Rozmówcy są wyraźnie słyszalni</strong><span>Nagłośnienie dopasowujemy do wielkości pomieszczenia.</span></div></li>
            </ul>
            <div className="proav-brand-note"><span>Przykładowe rodziny rozwiązań</span><strong>Logitech Rally Bar / MeetUp · HP Poly Studio</strong></div>
          </div>
        </div>
      </section>

      <section id="sposob-spotkan" className="proav-meeting-section" aria-labelledby="meeting-heading">
        <div className="proav-container">
          <div className="proav-section-heading"><div><p className="proav-eyebrow">Dwa proste sposoby na spotkanie</p><h2 id="meeting-heading">Z laptopa albo z panelu na stole.</h2></div><p>Wybór zależy od tego, jak pracuje Wasz zespół. Oba rozwiązania mogą też działać w jednej sali.</p></div>
          <div className="proav-meeting-grid">
            <article>
              <div className="proav-meeting-title"><Laptop size={30} aria-hidden="true" /><span>Twój laptop · BYOD</span></div>
              <h3>Podłączasz się i prowadzisz rozmowę.</h3>
              <p>Uruchamiasz swoją aplikację. Korzystasz z kamery, mikrofonów, głośników i ekranu sali.</p>
              <ul className="proav-checks"><li><Check aria-hidden="true" />Wygodne dla gości i różnych aplikacji.</li><li><Check aria-hidden="true" />Spotkanie odbywa się z Twojego konta.</li><li><Check aria-hidden="true" />Przyłącze masz pod ręką, przy stole.</li></ul>
              <p className="proav-small-note">Jedno USB-C może obsłużyć obraz, urządzenia sali i ładowanie — jeśli laptop oraz cały zestaw są z tym zgodne.</p>
            </article>
            <article>
              <div className="proav-meeting-title"><CalendarDays size={30} aria-hidden="true" /><span>System sali · Microsoft Teams Rooms</span></div>
              <h3>Zapraszasz salę. Dołączasz z panelu.</h3>
              <p>Spotkanie widać w kalendarzu sali. Rozpoczynasz je na panelu, a rozmowę prowadzi system zainstalowany w pomieszczeniu.</p>
              <ul className="proav-checks"><li><Check aria-hidden="true" />Laptop nie musi prowadzić wideorozmowy.</li><li><Check aria-hidden="true" />Jedno, znajome miejsce obsługi spotkań.</li><li><Check aria-hidden="true" />Konto i zarządzanie ustalamy z Waszym IT.</li></ul>
              <p className="proav-small-note">Teams Rooms wymaga zgodnego sprzętu, konta sali i właściwej licencji. Obsługę gości i innych platform sprawdzamy dla danego zestawu.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="proav-section proav-story proav-story-reverse" aria-labelledby="table-heading">
        <div className="proav-container proav-story-grid">
          <Photo src={tableImage} alt="Laptop połączony przewodem z mediaportem INTEGRA LOGIC w blacie konferencyjnym" width={1486} height={819} caption="Detal stołu · INTEGRA LOGIC / Mediaporty.com.pl" />
          <div className="proav-story-copy">
            <p className="proav-eyebrow">02 / Mediaporty i przyłącza</p>
            <h2 id="table-heading">Podłącz się<br />przy stole.</h2>
            <p>Zasilanie laptopa, ładowanie telefonu, prezentacja i sieć. Potrzebne gniazda umieszczamy w blacie, zamiast prowadzić przewody przez całą salę.</p>
            <div className="proav-ports">
              <div><Plug aria-hidden="true" /><strong>230 V</strong><span>Zasilanie urządzeń</span></div>
              <div><Usb aria-hidden="true" /><strong>USB-C</strong><span>Ładowanie i połączenie*</span></div>
              <div><Monitor aria-hidden="true" /><strong>HDMI</strong><span>Obraz na ekranie</span></div>
              <div><Network aria-hidden="true" /><strong>LAN</strong><span>Połączenie z siecią</span></div>
            </div>
            <p className="proav-small-note">*Gniazdo USB-C do ładowania nie zastępuje połączenia z kamerą i monitorem. Dobieramy właściwe moduły oraz cały tor sygnału.</p>
            <p>Dobieramy kolor, sposób otwierania i wyposażenie mediaportu. Ze stolarzem uzgadniamy otwór w blacie oraz miejsce na przewody.</p>
            <a className="proav-text-link" href="https://mediaporty.com.pl/" target="_blank" rel="noopener noreferrer">Zobacz systemy INTEGRA, Bachmann i EVOline <ArrowUpRight size={17} /></a>
          </div>
        </div>
      </section>

      <section className="proav-section proav-story proav-story-white" aria-labelledby="display-heading">
        <div className="proav-container proav-story-grid">
          <Photo src={presentationImage} alt="Sala szkoleniowa z ekranem projekcyjnym, projektorem sufitowym i mobilnymi stołami" width={1672} height={941} />
          <div className="proav-story-copy">
            <p className="proav-eyebrow">03 / Monitory, ekrany i projekcja</p>
            <h2 id="display-heading">Pokaż więcej.<br />Wszystkim w sali.</h2>
            <p>Wykres, projekt czy twarz rozmówcy — obraz powinien być czytelny także z końca stołu. Dobieramy rozmiar, jasność i miejsce montażu.</p>
            <ul className="proav-feature-list">
              <li><Monitor aria-hidden="true" /><div><strong>Monitor do codziennych spotkań</strong><span>Wideorozmowy, dokumenty i prezentacje na jednym ekranie.</span></div></li>
              <li><Users aria-hidden="true" /><div><strong>Dwa ekrany, dwa widoki</strong><span>Uczestnicy obok prezentacji, jeśli system obsługuje taki układ.</span></div></li>
              <li><Presentation aria-hidden="true" /><div><strong>Projektor i ekran do większej sali</strong><span>Duży obraz na szkoleniach i spotkaniach całego zespołu.</span></div></li>
            </ul>
            <p className="proav-small-note">Przy salach dzielonych i zmiennym ustawieniu stołów planujemy osobne strefy dźwięku, kamery i przełączanie źródeł.</p>
          </div>
        </div>
      </section>

      <section className="proav-section proav-story proav-story-reverse" aria-labelledby="cabling-heading">
        <div className="proav-container proav-story-grid">
          <Photo src={cablingImage} alt="Uporządkowane przewody i urządzenia AV zamocowane w metalowym kanale pod stołem" width={1536} height={1024} />
          <div className="proav-story-copy">
            <p className="proav-eyebrow">04 / Okablowanie i infrastruktura</p>
            <h2 id="cabling-heading">Przewody mają<br />swoje miejsce.</h2>
            <p>Od przyłącza w stole do ekranu na ścianie. Projektujemy całą trasę, montujemy urządzenia i zostawiamy wygodny dostęp do serwisu.</p>
            <ul className="proav-feature-list">
              <li><Cable aria-hidden="true" /><div><strong>USB, HDMI i sieć na właściwą odległość</strong><span>Dobieramy przewody i urządzenia przedłużające sygnał.</span></div></li>
              <li><SlidersHorizontal aria-hidden="true" /><div><strong>Porządek pod blatem i w szafie AV</strong><span>Uchwyty, kanały, opisane połączenia i miejsce na rozbudowę.</span></div></li>
              <li><Network aria-hidden="true" /><div><strong>Uzgodnione z działem IT</strong><span>LAN, zasilanie PoE, dostęp do usług i zasady aktualizacji.</span></div></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="proav-room-control" aria-labelledby="control-heading">
        <div className="proav-container">
          <div className="proav-control-intro"><p className="proav-eyebrow">05 / ProAV + automatyka KNX</p><h2 id="control-heading">Spotkanie zaczyna się.<br />Sala też jest gotowa.</h2><p>Scena „Spotkanie” może przygotować kilka elementów wnętrza jednocześnie. Zakres dobieramy do urządzeń i dostępnych połączeń.</p></div>
          <div className="proav-control-features">
            <article><Lightbulb aria-hidden="true" /><h3>Światło</h3><p>Twarze są oświetlone, a ekran nie konkuruje z lampami.</p></article>
            <article><Sun aria-hidden="true" /><h3>Rolety</h3><p>Ograniczamy słońce i odbicia przeszkadzające w prezentacji.</p></article>
            <article><Monitor aria-hidden="true" /><h3>Obraz</h3><p>Wybór źródła i przygotowanie wyświetlania do spotkania.</p></article>
          </div>
          <button className="proav-text-link" onClick={() => onNavigate('offices', 'konferencyjne')}>Poznaj automatykę biura <ArrowUpRight size={18} /></button>
        </div>
      </section>

      <section id="wdrozenie" className="proav-section" aria-labelledby="process-heading">
        <div className="proav-container">
          <div className="proav-section-heading"><div><p className="proav-eyebrow">Od pomysłu do pierwszej rozmowy</p><h2 id="process-heading">Jak przygotujemy Twoją salę?</h2></div><p>Nowe biuro lub modernizacja obecnego. Zaczynamy od tego, czego potrzebujecie.</p></div>
          <ol className="proav-process">
            {[
              ['Poznajemy salę', 'Wymiary, liczba miejsc, aplikacje, obecny sprzęt i budżet.'],
              ['Dobieramy całość', 'Urządzenia, przyłącza, trasy przewodów i uzgodnienia z IT.'],
              ['Montujemy i łączymy', 'Instalacja, konfiguracja i przygotowanie sposobu obsługi.'],
              ['Sprawdzamy w praktyce', 'Rozmowa zdalna, prezentacja, podłączenie gościa i instrukcja dla zespołu.'],
            ].map(([title, description], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}
          </ol>
        </div>
      </section>

      <section id="pytania" className="proav-section proav-answers-section" aria-labelledby="answers-heading">
        <div className="proav-container"><p className="proav-eyebrow">Krótko i konkretnie</p><h2 id="answers-heading">Dobrze wiedzieć przed startem.</h2><div className="proav-answers">{questions.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div>
      </section>

      <section className="proav-contact-section" aria-labelledby="contact-proav-heading">
        <div className="proav-container proav-contact">
          <div><p className="proav-eyebrow">Porozmawiajmy o Waszym biurze</p><h2 id="contact-proav-heading">Opowiedz nam o sali.<br />Dobierzemy resztę.</h2><p>Mały pokój spotkań, sala zarządu czy przestrzeń szkoleniowa — zaczniemy od potrzeb Twojego zespołu.</p></div>
          <div className="proav-contact-actions"><button className="proav-button proav-button-ink" onClick={() => onOpenConsultation()}>Omów projekt ProAV <ArrowUpRight size={20} /></button><a href="tel:+48505260715">+48 505 260 715 <ArrowRight size={16} /></a><span>Warszawa · realizacje w całej Polsce</span></div>
        </div>
        <div className="proav-container proav-references"><span>Poznaj rozwiązania:</span><a href="https://www.logitech.com/en-us/business/shop/p/rallybar" target="_blank" rel="noopener noreferrer">Logitech <ArrowUpRight size={13} /></a><a href="https://support.hp.com/in-en/document/ish_15254712-12757922-16" target="_blank" rel="noopener noreferrer">HP Poly <ArrowUpRight size={13} /></a><a href="https://learn.microsoft.com/en-us/microsoftteams/rooms/" target="_blank" rel="noopener noreferrer">Microsoft Teams Rooms <ArrowUpRight size={13} /></a><a href="https://mediaporty.com.pl/" target="_blank" rel="noopener noreferrer">Mediaporty.com.pl <ArrowUpRight size={13} /></a></div>
      </section>
    </div>
  );
};
