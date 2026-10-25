import React from 'react';
import { F50HomeDemo } from '../components/F50HomeDemo/F50HomeDemo';
import type { PageId } from '../types';
import {
  Sun,
  Blinds,
  Thermometer,
  SlidersHorizontal,
  Bell,
  Music2,
  ArrowRight,
} from 'lucide-react';
import { pageUrl } from '../site';
import { IMAGES } from '../assets';
import light from '../assets/images/day-rhythm-relax.webp';
import blinds from '../assets/images/smart-home-blinds.webp';
import climate from '../assets/images/day-rhythm-morning.webp';
import intercom from '../assets/images/smart-home-intercom.webp';
import energy from '../assets/images/smart-home-energy.webp';
import { ContentHero, ContactCta, FeatureList, contentWidth } from '../components/ContentSections';

interface SolutionsPageProps {
  onNavigate: (page: PageId, hash?: string) => void;
  onOpenConsultation: () => void;
  initialHash?: string;
}

const capabilities = [
  {
    id: 'dali',
    title: 'Światło na każdą chwilę',
    icon: Sun,
    image: light,
    alt: 'Wieczorne oświetlenie salonu',
    lead: 'Jasno do pracy przy blacie, spokojnie do kolacji i delikatnie w nocy.',
    items: [
      'Włączanie i ściemnianie wybranych lamp.',
      'Sceny obejmujące kilka obwodów jednocześnie.',
      'Sterowanie przyciskiem, czujnikiem lub harmonogramem.',
    ],
    condition:
      'Sposób ściemniania i ewentualną zmianę barwy dobieramy do opraw oraz ich zasilaczy. DALI jest jednym z możliwych rozwiązań.',
  },
  {
    id: 'fasady',
    title: 'Rolety, żaluzje i zasłony',
    icon: Blinds,
    image: blinds,
    alt: 'Zasłony i duże przeszklenia w salonie',
    lead: 'Odsłaniasz widok rano i dbasz o prywatność wieczorem.',
    items: [
      'Sterowanie pojedynczym oknem lub grupą osłon.',
      'Ustawienia dopasowane do pory dnia i nasłonecznienia.',
      'Wspólna scena światła oraz zasłon.',
    ],
    condition:
      'Automatykę pogodową i priorytety ochronne ustalamy według wymagań producenta osłon, napędów i czujników.',
  },
  {
    id: 'hvac',
    title: 'Temperatura i świeże powietrze',
    icon: Thermometer,
    image: climate,
    alt: 'Jasne wnętrze domu o poranku',
    lead: 'W sypialni chłodniej, w łazience cieplej. Ustawienia dopasowane do pomieszczenia.',
    items: [
      'Osobne nastawy w wybranych strefach ogrzewania.',
      'Uzgodniona współpraca ogrzewania i klimatyzacji.',
      'Sterowanie wentylacją według dostępnych trybów i pomiarów.',
    ],
    condition:
      'Sprawdzamy modele urządzeń i dostępne interfejsy wspólnie z wykonawcą ogrzewania, klimatyzacji lub wentylacji.',
  },
  {
    id: 'sceny',
    title: 'Przyciski, panele i sceny',
    icon: SlidersHorizontal,
    image: IMAGES.knxSwitchHardware,
    alt: 'Przykładowy przycisk do sterowania funkcjami pomieszczenia',
    lead: 'Jeden zrozumiały sposób obsługi dla domowników i gości.',
    items: [
      'Funkcje klawiszy ustalone dla każdego miejsca w domu.',
      'Sceny „Wyjście”, „Kolacja” czy „Dobranoc”.',
      'Panel lub aplikacja jako uzupełnienie przycisków.',
    ],
    condition:
      'Wygląd, liczbę klawiszy i opisy wybieramy razem z Tobą i architektem. Obsługa zdalna zależy od wybranego systemu.',
  },
  {
    id: 'bezpieczenstwo',
    title: 'Powiadomienia i reakcje domu',
    icon: Bell,
    image: intercom,
    alt: 'Przykładowa strefa wejścia z domofonem',
    lead: 'Wiesz o zdarzeniach, które wymagają Twojej uwagi.',
    items: [
      'Informacja o otwartym oknie lub wykryciu wody.',
      'Uzgodniona reakcja światła na sygnał z alarmu.',
      'Domofon i podgląd wejścia na zgodnym panelu.',
    ],
    condition:
      'Zakres zależy od czujników, centrali alarmowej i interfejsów. Automatyka uzupełnia dedykowane systemy ochrony; reakcje ustalamy z ich wykonawcą.',
  },
  {
    id: 'integracje',
    title: 'Muzyka, energia i inne urządzenia',
    icon: Music2,
    image: energy,
    alt: 'Przykładowy dom z instalacją fotowoltaiczną i ładowaniem samochodu',
    lead: 'Łączymy te elementy, które mają sens w Twoim domu.',
    items: [
      'Muzyka w wybranych pokojach i scenach.',
      'Podgląd zużycia energii z odpowiednich liczników.',
      'Współpraca z fotowoltaiką lub ładowarką, jeśli urządzenia ją umożliwiają.',
    ],
    condition:
      'Każde połączenie sprawdzamy dla konkretnego modelu, oprogramowania i dostępnej komunikacji.',
  },
];

export function SolutionsPage({ onOpenConsultation }: SolutionsPageProps) {
  return (
    <>
      <ContentHero eyebrow="Możliwości inteligentnego domu" title="Co może Twój dom?">
        <p>
          Wybierz funkcje, które ułatwią Ci codzienność. Pokażemy, jak je połączyć w instalacji KNX
          i co będzie potrzebne do ich działania.
        </p>
      </ContentHero>
      <F50HomeDemo />
      <section className="py-14 sm:py-20 bg-white">
        <div className={contentWidth}>
          <div className="grid md:grid-cols-2 gap-7 lg:gap-9">
            {capabilities.map(({ id, title, icon: Icon, image, alt, lead, items, condition }) => (
              <article
                id={id}
                key={id}
                className="rounded-2xl overflow-hidden border border-ink/15 bg-surface flex flex-col"
              >
                <img
                  src={image}
                  alt={alt}
                  width={900}
                  height={560}
                  loading="lazy"
                  className="w-full aspect-[16/9] object-cover"
                />
                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  <div className="flex items-start gap-3">
                    <Icon className="shrink-0 mt-1" size={23} aria-hidden="true" />
                    <h2 className="text-2xl font-bold font-display">{title}</h2>
                  </div>
                  <p className="text-ink/80 my-5">{lead}</p>
                  <FeatureList items={items} />
                  <p
                    id={id === 'integracje' ? 'energia' : undefined}
                    className="text-sm text-ink/70 border-t border-ink/15 pt-5 mt-6"
                  >
                    {condition}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="text-xs text-ink/65 mt-5">
            Ilustracje przedstawiają przykładowe rozwiązania i aranżacje.
          </p>
          <div className="mt-12 flex flex-wrap gap-6 text-sm font-semibold">
            <a
              href={pageUrl('homes', 'etapy')}
              className="inline-flex items-center gap-2 underline underline-offset-4"
            >
              Jak powstaje instalacja <ArrowRight size={17} />
            </a>
            <a
              href={pageUrl('knx')}
              className="inline-flex items-center gap-2 underline underline-offset-4"
            >
              KNX prostym językiem <ArrowRight size={17} />
            </a>
            <a
              href={pageUrl('projects')}
              className="inline-flex items-center gap-2 underline underline-offset-4"
            >
              Przykłady do domu i apartamentu <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
      <ContactCta onClick={onOpenConsultation} />
    </>
  );
}
