import React from 'react';
import { ArrowRight, SlidersHorizontal, Network, Blocks } from 'lucide-react';
import { PageId } from '../types';
import { pageUrl } from '../site';
import { ContentHero, ContactCta, FeatureList, contentWidth } from '../components/ContentSections';

interface KNXPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}
export const KNXPage: React.FC<KNXPageProps> = ({ onOpenConsultation }) => (
  <div>
    <ContentHero eyebrow="KNX prostym językiem" title="Wspólny język urządzeń w Twoim domu.">
      <p>
        KNX to otwarty standard automatyki budynkowej. Umożliwia współpracę urządzeń różnych
        producentów — od przycisków i czujników po sterowanie oświetleniem, roletami i temperaturą.
      </p>
    </ContentHero>
    <section className="py-16 sm:py-20 bg-white">
      <div className={contentWidth}>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: SlidersHorizontal,
              title: 'Wygodna obsługa',
              text: 'Jeden przycisk może wywołać scenę złożoną z kilku funkcji. Ustalasz, jak ma reagować Twój dom.',
            },
            {
              icon: Network,
              title: 'Wybór urządzeń',
              text: 'Możemy dobierać certyfikowane urządzenia KNX różnych marek. Konkretne funkcje i zgodność interfejsów sprawdzamy w projekcie.',
            },
            {
              icon: Blocks,
              title: 'Plan na przyszłość',
              text: 'Przy projektowaniu przewidujemy możliwą rozbudowę. Jej zakres zależy od infrastruktury i możliwości wybranego sprzętu.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="p-7 rounded-xl bg-surface border border-ink/15">
              <Icon size={28} aria-hidden="true" />
              <h2 className="text-xl font-bold font-display mt-5 mb-3">{title}</h2>
              <p className="text-ink/80 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-10 mt-14">
          <div>
            <h2 className="text-3xl font-bold font-display">W domu i w apartamencie.</h2>
            <p className="mt-5 text-ink/80 leading-relaxed">
              W domu możemy uwzględnić wiele pomieszczeń, taras i ogród. W apartamencie ważne są
              także miejsce na urządzenia, wygląd osprzętu i uzgodnienia dotyczące instalacji
              wspólnych budynku. Zakres wynika z Twoich potrzeb.
            </p>
            <a
              href={pageUrl('solutions')}
              className="inline-flex items-center gap-2 mt-6 underline underline-offset-4 font-semibold text-sm"
            >
              Zobacz przykłady funkcji <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="p-7 rounded-xl border border-ink/15">
            <h2 className="text-2xl font-bold font-display mb-5">
              O czym porozmawiać z integratorem?
            </h2>
            <FeatureList
              items={[
                'Które funkcje mają działać z przycisków, a które automatycznie.',
                'Które połączenia korzystają z internetu i jak zachowają się bez niego.',
                'Jakie są możliwości oraz ograniczenia wybranych urządzeń.',
                'Jak sprawdzimy działanie i jaki zakres dokumentacji otrzymasz.',
              ]}
            />
          </div>
        </div>
        <p className="mt-9 text-sm text-ink/70">
          Więcej o standardzie:{' '}
          <a
            href="https://www.knx.org/explore-knx/knx-home-building-owners"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            KNX Association — informacje dla właścicieli domów ↗
          </a>
        </p>
      </div>
    </section>
    <ContactCta
      title="Sprawdźmy, czego potrzebuje Twój dom."
      text="Omówimy oczekiwania, etap inwestycji i możliwości instalacji. Jeśli masz już KNX, zacznijmy od opisu urządzeń i dostępnej dokumentacji."
      onClick={onOpenConsultation}
    />
  </div>
);
