import React, { useEffect, useRef } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import type { PageId } from '../types';
import { pageUrl } from '../site';
import heroImage from '../assets/images/homes-evening-hero.webp';
import morningImage from '../assets/images/homes-morning.webp';
import leavingImage from '../assets/images/homes-leaving.webp';
import eveningImage from '../assets/images/homes-evening-scene.webp';
import contactImage from '../assets/images/homes-contact.webp';
import './HomesPage.css';

interface HomesPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onOpenConsultation: () => void;
  initialHash?: string;
}

const scenes = [
  { title: 'Dzień dobry', text: 'Łagodne światło i odsłonięte rolety.', image: morningImage, alt: 'Wizualizacja jasnej sypialni z lnianą pościelą i odsłoniętym oknem' },
  { title: 'Wychodzę', text: 'Wybrane funkcje domu pod jednym przyciskiem.', image: leavingImage, alt: 'Wizualizacja przedpokoju z dyskretnym przyciskiem przy wyjściu' },
  { title: 'Dobry wieczór', text: 'Światło i osłony dopasowane do odpoczynku.', image: eveningImage, alt: 'Wizualizacja jadalni z ciepłym światłem i widokiem na ogród o zmierzchu' },
];

const questions = [
  { id: 'dom', title: 'Kiedy zacząć planowanie domu?', text: 'Najlepiej przed wykonaniem instalacji elektrycznej. Zaczynamy od potrzeb domowników, potem uzgadniamy funkcje, okablowanie i dobór urządzeń. Zakres projektu, montażu i uruchomienia określamy w ofercie.' },
  { id: 'apartament', title: 'Co warto ustalić w apartamencie?', text: 'Wspólnie z architektem dobieramy wygląd osprzętu i miejsca sterowania. Sprawdzamy możliwości ogrzewania, klimatyzacji i osłon okiennych oraz wymagane uzgodnienia z administracją budynku.' },
  { id: 'koszt', title: 'Od czego zależy koszt KNX?', text: 'Od liczby obwodów światła, rolet i stref temperatury, wybranego osprzętu, integracji oraz zakresu prac. Sam metraż nie wystarczy do wyceny. Na początek przygotuj etap inwestycji, lokalizację i listę potrzeb.' },
  { id: 'modernizacja', title: 'A jeśli dom jest już gotowy?', text: 'Najpierw sprawdzamy okablowanie, rozdzielnicę i urządzenia, które chcesz zachować. Dopiero wtedy ustalamy możliwości rozbudowy i potrzebne prace. Funkcje oraz integracje weryfikujemy dla konkretnych urządzeń.' },
];

export function HomesPage({ onOpenConsultation, initialHash }: HomesPageProps) {
  const page = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!initialHash) return;
    const question = Array.from(page.current?.querySelectorAll('details') || []).find((item) => item.id === initialHash);
    if (question) question.open = true;
  }, [initialHash]);

  return (
    <div className="homes-page" ref={page}>
      <section className="homes-intro homes-width" aria-labelledby="homes-title">
        <h1 id="homes-title"><span>Twój dom.</span><span>Twój rytm dnia.</span></h1>
        <div className="homes-intro__copy">
          <p>Planujemy inteligentne wnętrza w technologii KNX, które wspierają Twój codzienny komfort. Ustalamy rozwiązania dopasowane do Twojego domu, stylu życia i potrzeb domowników.</p>
          <button type="button" className="homes-button" onClick={onOpenConsultation}>Porozmawiajmy o Twoim domu <ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </section>
      <figure className="homes-hero">
        <img src={heroImage} alt="Wizualizacja salonu o zmierzchu: ciepłe oświetlenie, wygodna sofa i otwarcie na ogród" width={1942} height={809} fetchPriority="high" />
        <figcaption><span>Wieczór. Światło, które pozwala odpocząć.</span><span>Wizualizacja koncepcyjna</span></figcaption>
      </figure>
      <section className="homes-scenes homes-width" aria-labelledby="homes-scenes-title">
        <p className="homes-eyebrow">Przykładowe sceny do wspólnego zaplanowania</p>
        <h2 id="homes-scenes-title">Dobre ustawienia.<br />Mniej codziennych czynności.</h2>
        <div className="homes-scenes__grid">
          {scenes.map((scene) => (
            <article className="homes-scene" key={scene.title}>
              <img src={scene.image} alt={scene.alt} width={1322} height={1190} loading="lazy" decoding="async" />
              <h3>{scene.title}</h3>
              <p>{scene.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="etapy" className="homes-contact" aria-labelledby="homes-contact-title">
        <img className="homes-contact__image" src={contactImage} alt="" width={2172} height={724} loading="lazy" decoding="async" />
        <div className="homes-contact__content homes-width">
          <div>
            <p className="homes-eyebrow">Twój dom, nasze wsparcie</p>
            <h2 id="homes-contact-title">Zaplanujmy dom<br />po Twojemu.</h2>
          </div>
          <div className="homes-contact__copy">
            <p>Dobieramy funkcje do pomieszczeń i zwyczajów domowników. Ty decydujesz, co naprawdę się przyda.</p>
            <button type="button" className="homes-button" onClick={onOpenConsultation}>Porozmawiajmy o Twoim domu <ArrowRight size={20} aria-hidden="true" /></button>
          </div>
        </div>
      </section>
      <section className="homes-questions homes-width" aria-labelledby="homes-questions-title">
        <div className="homes-questions__intro">
          <h2 id="homes-questions-title">Dobry początek to rozmowa.</h2>
          <p>Od potrzeb i założeń, przez uzgodnienia z wykonawcami, po uruchomienie i wspólne sprawdzenie działania.</p>
          <a href={pageUrl('solutions')}>Zobacz, co może Twój dom <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <div className="homes-questions__list">
          {questions.map((question) => (
            <details id={question.id} key={question.id}>
              <summary>{question.title}<Plus size={20} aria-hidden="true" /></summary>
              <p>{question.text}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
