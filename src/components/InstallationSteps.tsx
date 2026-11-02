import React from 'react';
import './InstallationSteps.css';

const steps = [
  { title: 'Potrzeby domowników', text: 'Przechodzimy przez pomieszczenia i codzienne sytuacje. Ustalamy, co ma działać automatycznie, a co uruchamiasz samodzielnie.', result: 'Uzgodniona lista funkcji.' },
  { title: 'Dobór i wycena', text: 'Dobieramy urządzenia do ustalonego zakresu. Oddzielamy funkcje potrzebne teraz od opcji, które możesz zaplanować na później.', result: 'Lista urządzeń, zakres i warianty.' },
  { title: 'Uzgodnienia instalacyjne', text: 'Z architektem i wykonawcami ustalamy wymagania dla przewodów, rozdzielnicy, osprzętu i podłączanych urządzeń.', result: 'Wymagania i podział prac.' },
  { title: 'Programowanie i odbiór', text: 'Uruchamiamy uzgodniony zakres, sprawdzamy funkcje i sceny oraz pokazujemy domownikom, jak korzystać z instalacji.', result: 'Sprawdzone działanie i instruktaż.' },
];

export function InstallationSteps() {
  return (
    <section id="etapy" className="installation-steps" aria-labelledby="installation-steps-title">
      <div className="installation-steps__inner">
        <div className="installation-steps__heading">
          <div>
            <p className="installation-steps__eyebrow">Od ustaleń do uruchomienia</p>
            <h2 id="installation-steps-title">Co powstaje na<br />każdym etapie?</h2>
          </div>
          <p>Najpierw określamy oczekiwany sposób działania. Na tej podstawie dobieramy urządzenia i uzgadniamy prace.</p>
        </div>
        <ol>
          {steps.map(({ title, text, result }, index) => (
            <li key={title}>
              <span className="installation-steps__number" aria-hidden="true">0{index + 1}</span>
              <h3>{title}</h3><p>{text}</p>
              <p className="installation-steps__result"><span>Efekt</span>{result}</p>
            </li>
          ))}
        </ol>
        <p className="installation-steps__note">W ofercie określamy zakres dokumentacji, dostaw, montażu, programowania i późniejszego wsparcia. Ustalamy również podział odpowiedzialności między wykonawcami.</p>
      </div>
    </section>
  );
}
