import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const contentWidth = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
export const actionClass =
  'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-ink text-accent font-semibold text-sm hover:bg-ink-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink';

export function ProjectSteps() {
  const steps = [
    ['Rozmowa', 'Poznajemy pomieszczenia, potrzeby domowników i budżet.'],
    ['Założenia', 'Ustalamy funkcje, sceny i miejsca sterowania.'],
    [
      'Projekt i uzgodnienia',
      'Dobieramy urządzenia, określamy okablowanie oraz zadania poszczególnych wykonawców.',
    ],
    [
      'Montaż i programowanie',
      'Realizujemy uzgodniony zakres, łączymy urządzenia i konfigurujemy działanie.',
    ],
    [
      'Sprawdzenie i przekazanie',
      'Testujemy funkcje, pokazujemy obsługę i przekazujemy uzgodnioną dokumentację.',
    ],
  ];
  return (
    <ol className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {steps.map(([title, text], i) => (
        <li key={title} className="p-6 rounded-xl bg-white border border-ink/15">
          <span className="text-sm font-mono text-ink/65">0{i + 1}</span>
          <h3 className="font-bold text-lg mt-3 mb-3 leading-snug">{title}</h3>
          <p className="text-sm text-ink/80 leading-relaxed">{text}</p>
        </li>
      ))}
    </ol>
  );
}

export function ContentHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-ink text-white py-14 sm:py-20">
      <div className={contentWidth}>
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-widest text-accent font-semibold mb-4">
            {eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold font-display leading-tight">{title}</h1>
          <div className="mt-5 space-y-5 text-base sm:text-lg text-mist/90 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3 text-sm text-ink/85">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Check size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ContactCta({
  title = 'Porozmawiajmy o Twoim domu.',
  text = 'Powiedz, na jakim etapie jesteś i jakie funkcje są dla Ciebie ważne. Wspólnie ustalimy następny krok.',
  onClick,
}: {
  title?: string;
  text?: string;
  onClick: () => void;
}) {
  return (
    <section className="py-14 sm:py-20 bg-surface">
      <div className={contentWidth}>
        <div className="rounded-2xl bg-ink text-white p-7 sm:p-12 flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-display">{title}</h2>
            <p className="mt-4 text-mist/85 leading-relaxed">{text}</p>
          </div>
          <button
            type="button"
            onClick={onClick}
            className="shrink-0 self-start lg:self-center inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-accent text-ink font-semibold text-sm hover:bg-accent-hover"
          >
            Omów projekt <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
