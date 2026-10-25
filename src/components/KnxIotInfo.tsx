import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { IMAGES } from '../assets.ts';

const investorBenefits = [
  'Modernizacja bez kucia ścian i układania nowych tras kablowych',
  'Rozbudowa gotowej instalacji etapami, także w lokalach o zmiennej aranżacji',
  'Otwarty standard i konfiguracja w ETS, bez zamkniętej aplikacji jednego producenta',
];

const architectBenefits = [
  'Manipulatory i czujniki tam, gdzie kabel byłby trudny, drogi lub niemożliwy do poprowadzenia',
  'Wykończone ściany bez ingerencji, a urządzenie wymaga tylko zasilania',
  'Ta sama logika projektu: adresy grupowe, pełna zgodność z klasycznym KNX',
];

const infrastructure = [
  { title: 'Urządzenia KNX IoT', text: 'Czujniki i manipulatory w radiowej sieci Thread typu mesh' },
  { title: 'Hub (router IoT)', text: 'Łączy sieć Thread z klasyczną magistralą KNX i siecią IP' },
  { title: 'Projekt w ETS', text: 'Osobna linia IoT, te same adresy grupowe co w instalacji przewodowej' },
  { title: 'Bezpieczeństwo', text: 'Szyfrowanie sieci i danych KNX, kod QR każdego urządzenia' },
];

const BenefitList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="rounded-xl bg-surface p-6">
    <h4 className="mb-3 font-display text-base font-bold text-ink">{title}</h4>
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-ink/80">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const KnxIotInfo: React.FC = () => (
  <div className="rounded-2xl border border-ink/15 bg-white p-8 sm:p-10">
    <span className="mb-3 block font-mono text-xs font-semibold uppercase tracking-wider text-ink">{"KNX IoT · bez nowych przewodów magistrali"}</span>
    <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{"Bezprzewodowo, ale wciąż w standardzie KNX"}</h3>
    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/80 sm:text-base">{"Urządzenia komunikują się przez sieć radiową zamiast przewodu, a projektuje się je tak samo jak klasyczny KNX. Uzupełnia to instalację przewodową, a jej nie zastępuje."}</p>

    <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
      <BenefitList title={"Dla inwestora"} items={investorBenefits} />
      <BenefitList title={"Dla architekta"} items={architectBenefits} />
    </div>

    <div className="mt-8">
      <span className="mb-3 block font-mono text-xs font-semibold uppercase tracking-wider text-ink">{"Jak jest zbudowana infrastruktura"}</span>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {infrastructure.map((step) => (
          <li key={step.title} className="rounded-xl border border-ink/15 p-4">
            <b className="font-display text-sm text-ink">{step.title}</b>
            <p className="mt-1 text-xs leading-relaxed text-ink/75">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>

    <figure className="mt-7">
      <img
        src={IMAGES.iotKnx}
        alt={"Schemat: urządzenie KNX IoT, hub KNX IoT (Thread), router KNX IP, urządzenie KNX TP"}
        className="mx-auto h-auto w-full max-w-3xl rounded-xl"
        loading="lazy"
      />
      <figcaption className="mt-2.5 text-center font-mono text-xs text-ink/70">{"Droga sygnału: urządzenie KNX IoT → hub (Thread) → router KNX IP → urządzenie KNX TP"}</figcaption>
    </figure>

    <p className="mt-6 text-xs leading-relaxed text-ink/70">
      {"Do funkcji krytycznych i w nowych budynkach z łatwym dostępem do przewodu nadal rekomendujemy klasyczną magistralę KNX TP. KNX IoT traktujemy jako uzupełnienie. "}
      <span className="font-mono">{"Źródło: KNX Polska, baza wiedzy, „KNX IoT – programowanie w praktyce” (2026)."}</span>
    </p>
  </div>
);
