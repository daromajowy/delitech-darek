import React from 'react';
import { HeroVideo } from '../components/HeroVideo';
import { HomeFunctionStrip } from '../components/HomeFunctionStrip';
import { HomeKnxReasons } from '../components/HomeTechnologySections';
import { JungEquipment } from '../components/JungEquipment';
import './HomePage.css';

const steps = [
  { title: 'Porozmawiajmy.', text: 'Poznajemy potrzeby, styl życia i pomysł na wnętrze.' },
  { title: 'Zaplanujmy.', text: 'Dobieramy funkcje i osprzęt. Uzgadniamy rozwiązania z projektantem.' },
  { title: 'Uruchommy.', text: 'Konfigurujemy system i pokazujemy, jak z niego korzystać.' },
];
export const HomePage = () => (
  <div className="home-editorial">
    <HeroVideo />
    <HomeFunctionStrip />
    <HomeKnxReasons />
    <JungEquipment />

    <section className="home-editorial__process home-editorial__wrap" aria-labelledby="home-process-title">
      <h2 id="home-process-title" className="home-editorial__eyebrow">Jak pracujemy</h2>
      <ol className="home-editorial__steps">
        {steps.map(({ title, text }, index) => (
          <li key={title}>
            <span className="home-editorial__step-number" aria-hidden="true">0{index + 1}</span>
            <h3>{title}</h3><p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  </div>
);
