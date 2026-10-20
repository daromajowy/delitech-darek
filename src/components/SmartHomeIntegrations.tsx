import React, { useState } from 'react';
import { ArrowRight, Blinds, ChevronRight, Leaf, Music2, Shield, Sun, Thermometer } from 'lucide-react';
import { plannerUrl } from '../site';
import house from '../assets/images/smart-home-cutaway.webp';
import blinds from '../assets/images/smart-home-blinds.webp';
import intercom from '../assets/images/smart-home-intercom.webp';
import energy from '../assets/images/smart-home-energy.webp';
import morning from '../assets/images/day-rhythm-morning.webp';
import evening from '../assets/images/day-rhythm-relax.webp';
import './SmartHomeIntegrations.css';

const integrations = [
  {
    id: 'light', label: 'Światło', pin: 'Światło', icon: Sun, image: evening,
    title: 'Światło na każdą chwilę.',
    description: 'Jednym przyciskiem ustawiasz światło do kolacji, kina albo nocnego przejścia do kuchni.',
  },
  {
    id: 'blinds', label: 'Rolety i zasłony', pin: 'Rolety', icon: Blinds, image: blinds,
    title: 'Rolety reagują na słońce.',
    description: 'Więcej cienia w salonie, kiedy robi się gorąco. Wieczorem zasłony dbają o prywatność.',
  },
  {
    id: 'climate', label: 'Temperatura', pin: 'Temperatura', icon: Thermometer, image: morning,
    title: 'Każdy pokój ma swój klimat.',
    description: 'Ogrzewanie, klimatyzacja i wentylacja współpracują. Ustawiasz temperaturę, a dom pilnuje komfortu.',
  },
  {
    id: 'security', label: 'Alarm i domofon', pin: 'Domofon', icon: Shield, image: intercom,
    title: 'Wiesz, kto stoi przy drzwiach.',
    description: 'Odbierasz domofon z wybranego panelu. Przy wyjściu jedna scena może wyłączyć światła i uzbroić alarm.',
  },
  {
    id: 'music', label: 'Muzyka', pin: 'Muzyka', icon: Music2, image: evening,
    title: 'Twoja muzyka. W całym domu.',
    description: 'Wybierasz muzykę w salonie lub kilku pokojach. Scena „relaks” może też przyciemnić światło.',
  },
  {
    id: 'energy', label: 'Energia', pin: 'Ładowanie auta', icon: Leaf, image: energy,
    title: 'Energia tam, gdzie jej potrzebujesz.',
    description: 'Podgląd zużycia i ładowanie auta dopasowane do dostępnej mocy. Możemy uwzględnić też fotowoltaikę.',
  },
] as const;

/** An explorable illustration of possible integrations, not a live device controller. */
export function SmartHomeIntegrations() {
  const [activeId, setActiveId] = useState<(typeof integrations)[number]['id']>('blinds');
  const active = integrations.find(item => item.id === activeId)!;

  return (
    <section id="integracje-domu" className="smart-home" aria-labelledby="smart-home-title">
      <div className="smart-home__layout">
        <div className="smart-home__sidebar">
          <div className="smart-home__intro">
            <p className="smart-home__eyebrow">Twój inteligentny dom</p>
            <h2 id="smart-home-title">Zobacz, co możemy połączyć.</h2>
            <p className="smart-home__lead">Wybierz element domu i poznaj jego możliwości.</p>
          </div>

          <div className="smart-home__choices" role="group" aria-label="Funkcje inteligentnego domu">
            {integrations.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" className="smart-home__choice"
                aria-pressed={activeId === id} aria-controls="smart-home-detail"
                onClick={() => setActiveId(id)}>
                <Icon aria-hidden="true" strokeWidth={1.6} />
                <span>{label}</span>
                <ChevronRight className="smart-home__chevron" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="smart-home__footer">
            <a className="smart-home__cta" href={plannerUrl()}>
              Zaplanuj swój dom <ArrowRight aria-hidden="true" size={22} />
            </a>
            <p>Zakres integracji dobieramy do urządzeń i projektu.</p>
          </div>
        </div>

        <div className="smart-home__visual">
          <div className="smart-home__house" role="group" aria-label="Wybierz funkcję na ilustracji domu">
            <img className="smart-home__house-image" src={house} width={1448} height={1086}
              loading="lazy" decoding="async"
              alt="Przekrój przykładowego domu: sypialnia i łazienka na piętrze, wejście, salon i jadalnia na parterze oraz garaż z ładowarką samochodu." />
            {integrations.map(({ id, label, pin, icon: Icon }) => (
              <button key={id} type="button"
                className={`smart-home__pin smart-home__pin--${id}`}
                aria-label={`${label} — zobacz możliwości`} aria-pressed={activeId === id}
                aria-controls="smart-home-detail" onClick={() => setActiveId(id)}>
                <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                <span>{pin}</span>
              </button>
            ))}
          </div>

          <div className="smart-home__detail" id="smart-home-detail" aria-live="polite" aria-atomic="true">
            <img src={active.image} alt="" width={240} height={150} loading="lazy" decoding="async" />
            <div className="smart-home__detail-copy">
              <h3>{active.title}</h3>
              <p>{active.description}</p>
            </div>
            <span className="smart-home__disclaimer">Wizualizacja przykładowych funkcji</span>
          </div>
        </div>
      </div>
    </section>
  );
}
