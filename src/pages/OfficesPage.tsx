import React from 'react';
import { ArrowRight, AudioLines, Blinds, Camera, Monitor, Moon, Sun, Thermometer, Users } from 'lucide-react';
import { pageUrl } from '../site';
import room from '../assets/images/proav-room-hybrid.webp';
import meetingImage from '../assets/images/home-editorial-meeting.webp';
import { ContentHero, ContactCta, contentWidth, actionClass } from '../components/ContentSections';
import './OfficesPage.css';

interface OfficesPageProps {
  onOpenConsultation: (topic: string) => void;
}

const workspaceBenefits = [
  { icon: Monitor, text: 'Prezentacja bez odblasków' },
  { icon: Users, text: 'Komfort podczas spotkań' },
  { icon: AudioLines, text: 'Obraz i dźwięk pod kontrolą' },
];

export const OfficesPage: React.FC<OfficesPageProps> = ({ onOpenConsultation }) => (
  <div>
    <ContentHero eyebrow="Smart Workspace · Biura i sale konferencyjne" title="Przestrzeń gotowa do pracy i spotkań.">
      <p>
        Światło, osłony, temperatura oraz obraz i dźwięk mogą działać razem. Dobieramy automatykę
        do gabinetów, mniejszych biur i sal konferencyjnych — tak, żeby łatwiej było pracować,
        prowadzić prezentacje i rozmawiać z zespołem.
      </p>
      <a
        href={pageUrl('proav')}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-ink text-sm font-semibold"
      >
        Poznaj wyposażenie sal ProAV <ArrowRight size={18} aria-hidden="true" />
      </a>
    </ContentHero>
    <section id="smart-workspace" className="smart-workspace" aria-labelledby="smart-workspace-title">
      <div className="smart-workspace__copy">
        <p className="smart-workspace__eyebrow">Smart Workspace</p>
        <h2 id="smart-workspace-title">Sala gotowa do spotkania.</h2>
        <p className="smart-workspace__lead">Światło, rolety, temperatura i sprzęt do wideorozmów. Połączone tak, żeby łatwiej prowadzić spotkania.</p>
        <ul className="smart-workspace__benefits">
          {workspaceBenefits.map(({ icon: Icon, text }) => (
            <li key={text}><Icon size={40} strokeWidth={1.3} aria-hidden="true" /><span>{text}</span></li>
          ))}
        </ul>
        <button type="button" className="smart-workspace__button" onClick={() => onOpenConsultation('Konsultacja Smart Workspace / sala konferencyjna')}>
          Porozmawiajmy o Twojej sali <ArrowRight size={19} aria-hidden="true" />
        </button>
      </div>
      <figure className="smart-workspace__image">
        <img src={meetingImage} alt="Przykładowa sala spotkań z ekranem, wideobarem, żaluzjami i oświetleniem nad stołem" width={1254} height={1254} loading="lazy" decoding="async" />
        <figcaption>Przykładowy scenariusz — dobieramy do instalacji.</figcaption>
      </figure>
    </section>
    <section id="konferencyjne" className="py-16 sm:py-20 bg-white">
      <div className={contentWidth}>
        <figure>
          <img
            src={room}
            alt="Przykładowa sala spotkań z wideobarem i ekranem"
            width={1672}
            height={941}
            className="w-full max-h-[520px] object-cover rounded-2xl"
          />
          <figcaption className="text-xs text-ink/65 mt-3">
            Wizualizacja przykładowego rozwiązania ProAV
          </figcaption>
        </figure>
        <div id="funkcje-biura" className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6 mt-10 scroll-mt-36" aria-label="Pięć sposobów na wygodniejsze biuro i spotkania">
          {[
            {
              id: 'swiatlo',
              icon: Sun,
              title: 'Światło dopasowane do pracy',
              text: 'Jasno przy biurku, łagodniej podczas prezentacji. Oświetlenie może reagować na obecność i ilość światła dziennego albo zmieniać się po naciśnięciu przycisku.',
            },
            {
              id: 'oslony',
              icon: Blinds,
              title: 'Prezentacja bez odblasków',
              text: 'Rolety i żaluzje ograniczają ostre słońce na ekranie oraz przy stanowiskach pracy. Ich pozycję możemy połączyć ze sceną „Prezentacja” lub dopasować do nasłonecznienia.',
            },
            {
              id: 'klimat',
              icon: Thermometer,
              title: 'Komfort przez całe spotkanie',
              text: 'Temperatura dopasowana do pomieszczenia, a wentylacja do aktualnych potrzeb. Czujnik CO₂ może sygnalizować potrzebę przewietrzenia lub sterować zgodną instalacją wentylacyjną.',
            },
            {
              id: 'wideospotkania',
              icon: Camera,
              title: 'Dobrze widać. Dobrze słychać.',
              text: 'Kamera, mikrofony i ekran dobrane do stołu oraz akustyki sali. Mediaporty porządkują połączenia, a rozmowę uruchamiasz z laptopa lub panelu — zależnie od wybranego zestawu.',
            },
            {
              id: 'po-spotkaniu',
              icon: Moon,
              title: 'Sala odpoczywa po spotkaniu',
              text: 'Po ustalonym czasie bez obecności światła mogą zgasnąć, a ogrzewanie i chłodzenie przejść w tryb ograniczonej pracy. Ustawiamy opóźnienia i sposób ręcznej obsługi pod rytm Waszego biura.',
            },
          ].map(({ id, icon: Icon, title, text }, index) => (
            <article key={id} id={id} className={`bg-surface rounded-xl p-7 border border-ink/15 scroll-mt-36 ${index < 3 ? 'lg:col-span-2' : index === 3 ? 'lg:col-span-3' : 'sm:col-span-2 lg:col-span-3'}`}>
              <Icon size={44} strokeWidth={1.3} aria-hidden="true" />
              <h2 className="font-bold text-xl mt-4 mb-3">{title}</h2>
              <p className="text-sm leading-relaxed text-ink/80">{text}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-ink/80 leading-relaxed">
          Scena „Prezentacja” może jednocześnie ustawić światło i osłony oraz uruchomić zgodny ekran.
          Potrzebne czujniki, urządzenia i sposób sterowania ustalamy dla konkretnego pomieszczenia.
          Wymagania sieciowe, konta i licencje do wideospotkań omawiamy z osobą odpowiedzialną za IT.
        </p>
        <a href={pageUrl('proav')} className={actionClass + ' mt-6'}>
          Poznaj pełny zakres ProAV <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
    <ContactCta
      title="Opowiedz nam o swoim biurze lub sali."
      text="Powiedz, ile osób korzysta z pomieszczenia i co dziś utrudnia pracę. Sprawdzimy istniejącą instalację, sprzęt i możliwości ich połączenia."
      onClick={() => onOpenConsultation('Konsultacja ProAV / sala spotkań')}
    />
  </div>
);
