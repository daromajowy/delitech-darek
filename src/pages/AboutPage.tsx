import React from 'react';
import { ArrowDown, ArrowRight, Lightbulb, Layers, Wrench } from 'lucide-react';
import type { PageId } from '../types';
import { pageUrl } from '../site';
import { TeamProfiles } from '../components/TeamProfiles';
import { ContactCta } from '../components/ContentSections';
import './AboutPage.css';

interface AboutPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}

const strengths = [
  { icon: Lightbulb, title: 'Dobór z doświadczeniem.', text: 'Znamy urządzenia i ich zastosowania. Pomagamy wybrać rozwiązania pasujące do wnętrza, potrzeb i budżetu.' },
  { icon: Layers, title: 'Wspólny język z projektantem.', text: 'Łączymy pomysł na wnętrze z techniką. Uzgadniamy funkcje, osprzęt i szczegóły potrzebne do przygotowania instalacji.' },
  { icon: Wrench, title: 'Plan, który da się wykonać.', text: 'Patrzymy na projekt także oczami wykonawcy. Łączymy doradztwo, programowanie i praktyczną wiedzę o montażu.' },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation }) => (
  <div className="about-page">
    <section className="about-page__intro about-page__wrap" aria-labelledby="about-title">
      <p className="about-page__eyebrow">O InteliSpaces</p>
      <div className="about-page__intro-grid">
        <h1 id="about-title">Za technologią<br />stoją ludzie.</h1>
        <div className="about-page__intro-copy">
          <p>Łączymy znajomość rynku, programowanie KNX i doświadczenie na budowie. Dzięki temu patrzymy na Twój projekt od pierwszych decyzji po działającą instalację.</p>
          <p>InteliSpaces rozwijamy w ramach Delitech. Pracujemy z inwestorami i projektantami domów, apartamentów oraz sal spotkań.</p>
        </div>
      </div>
      <a href="#zespol" className="about-page__text-link">Poznaj nasz zespół <ArrowDown size={18} aria-hidden="true" /></a>
    </section>

    <section id="zespol" className="about-page__team about-page__wrap" aria-labelledby="about-team-title">
      <div className="about-page__section-heading">
        <p className="about-page__eyebrow">Ludzie InteliSpaces</p>
        <h2 id="about-team-title">Wiesz, z kim pracujesz.</h2>
        <p>Trzy uzupełniające się obszary: doradztwo, integracja i wykonawstwo.</p>
      </div>
      <TeamProfiles />
    </section>

    <section className="about-page__strengths" aria-labelledby="about-strengths-title">
      <div className="about-page__wrap">
        <p className="about-page__eyebrow">Co to daje Twojemu projektowi</p>
        <h2 id="about-strengths-title">Dobre decyzje. Od początku.</h2>
        <div className="about-page__strength-grid">
          {strengths.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
        <a href={pageUrl('architects')} className="about-page__text-link">Zobacz, jak wspieramy projektantów <ArrowRight size={18} aria-hidden="true" /></a>
      </div>
    </section>

    <section className="about-page__meeting about-page__wrap" aria-labelledby="about-meeting-title">
      <div>
        <p className="about-page__eyebrow">Zacznijmy od rozmowy</p>
        <h2 id="about-meeting-title">Spotkajmy się w Warszawie.<br />Albo porozmawiajmy online.</h2>
        <p>Nasze biuro: ul. Konwaliowa 7, lok. 103, 03-194 Warszawa. Omówimy Twój pomysł, etap inwestycji i zakres, w którym możemy pomóc.</p>
        <a href={pageUrl('contact')} className="about-page__text-link">Kontakt i dojazd <ArrowRight size={18} aria-hidden="true" /></a>
      </div>
      <aside className="about-page__proav" aria-labelledby="about-proav-title">
        <p className="about-page__eyebrow">Również do pracy</p>
        <h3 id="about-proav-title">Sala spotkań, która ułatwia rozmowę.</h3>
        <p>Obraz, dźwięk, wideokonferencje i wygodne przyłącza — jako dodatkowy zakres do Twojej przestrzeni.</p>
        <a href={pageUrl('proav')} className="about-page__text-link">Poznaj ProAV <ArrowRight size={18} aria-hidden="true" /></a>
      </aside>
    </section>

    <ContactCta title="Opowiedz nam o swoim projekcie." text="Dom, apartament lub sala spotkań — ustalimy, jakie wsparcie będzie potrzebne i od czego zacząć." onClick={onOpenConsultation} />
  </div>
);
