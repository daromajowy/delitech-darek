import React from 'react';
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import { pageUrl, plannerUrl } from '../site';
import { ContentHero, FeatureList, contentWidth, actionClass } from '../components/ContentSections';

interface ContactPageProps {
  onOpenConsultation: () => void;
}
export const ContactPage: React.FC<ContactPageProps> = ({ onOpenConsultation }) => (
  <div>
    <ContentHero eyebrow="Kontakt z InteliSpaces" title="Porozmawiajmy o Twoim domu.">
      <p>
        Budujesz, urządzasz apartament lub projektujesz wnętrze dla klienta? Opowiedz nam o
        potrzebach. Pomożemy ustalić zakres automatyki i kolejny krok.
      </p>
    </ContentHero>
    <section className="py-16 sm:py-20 bg-surface">
      <div className={contentWidth + ' grid lg:grid-cols-2 gap-7'}>
        <div className="p-7 sm:p-9 bg-white border border-ink/15 rounded-2xl">
          <h2 className="text-2xl font-bold font-display mb-6">Skontaktuj się z zespołem</h2>
          <address className="not-italic space-y-6 text-ink/85">
            <a
              href="tel:+48505260715"
              className="flex items-center gap-3 text-xl font-semibold hover:underline"
            >
              <Phone size={24} aria-hidden="true" />
              +48 505 260 715
            </a>
            <a
              href="mailto:kontakt@delitech.pl"
              className="flex items-center gap-3 font-semibold break-all hover:underline"
            >
              <Mail size={24} className="shrink-0" aria-hidden="true" />
              kontakt@delitech.pl
            </a>
            <p className="flex gap-3">
              <MapPin size={24} className="shrink-0" aria-hidden="true" />
              <span>
                Delitech Sp.j.
                <br />
                ul. Konwaliowa 7, lok. 103
                <br />
                03-194 Warszawa
              </span>
            </p>
          </address>
          <a
            href="https://maps.google.com/?q=Konwaliowa+7,+Warszawa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex underline underline-offset-4 text-sm font-semibold mt-5"
          >
            Sprawdź dojazd w Google Maps ↗
          </a>
          <p className="text-sm text-ink/70 mt-5">
            Przed wizytą ustalmy termin. Możemy też zacząć od rozmowy online.
          </p>
          <button onClick={onOpenConsultation} className={actionClass + ' mt-6'}>
            Poproś o kontakt <ArrowRight size={18} aria-hidden="true" />
          </button>
          <p className="mt-6 pt-5 border-t border-ink/15 text-xs text-ink/65">NIP: 1132919580</p>
        </div>
        <div className="p-7 sm:p-9 bg-white border border-ink/15 rounded-2xl">
          <p className="text-xs uppercase tracking-widest font-mono mb-3">
            Nie musisz znać parametrów urządzeń
          </p>
          <h2 className="text-2xl font-bold font-display mb-6">Co warto przygotować?</h2>
          <FeatureList
            items={[
              'Lokalizacja i etap inwestycji: projekt, budowa lub remont.',
              'Rodzaj przestrzeni i przybliżona liczba pomieszczeń.',
              'Funkcje, które są dla Ciebie najważniejsze.',
              'Planowany termin i budżet, jeśli są już określone.',
            ]}
          />
          <p className="mt-6 text-sm text-ink/80 leading-relaxed">
            Na pierwszą rozmowę wystarczy opis potrzeb. Wycena wymaga ustalenia zakresu, urządzeń i
            warunków wykonania.
          </p>
          <a
            href={pageUrl('homes', 'koszt')}
            className="mt-6 inline-flex underline underline-offset-4 font-semibold text-sm"
          >
            Od czego zależy koszt instalacji?
          </a>
        </div>
      </div>
    </section>
    <section className="pb-16 sm:pb-20 bg-surface">
      <div className={contentWidth}>
        <h2 className="text-2xl font-bold font-display mb-6">Wybierz temat rozmowy</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <a
            href={pageUrl('architects')}
            className="block p-6 rounded-xl border border-ink/20 bg-white hover:bg-mist/50"
          >
            <h3 className="font-bold text-lg">Projektuję dla klienta</h3>
            <p className="text-sm text-ink/80 mt-3">
              Wsparcie pracowni, funkcje przycisków i dobór osprzętu.
            </p>
          </a>
          <a href={plannerUrl()} className="block p-6 rounded-xl bg-ink text-white">
            <h3 className="font-bold text-lg text-accent">Chcę zebrać założenia</h3>
            <p className="text-sm text-mist/90 mt-3">
              Konfigurator KNX pomoże uporządkować pomieszczenia i funkcje.
            </p>
          </a>
          <a
            href={pageUrl('proav')}
            className="block p-6 rounded-xl border border-ink/20 bg-white hover:bg-mist/50"
          >
            <p className="text-xs uppercase font-mono mb-2 text-ink/65">Dodatkowa usługa</p>
            <h3 className="font-bold text-lg">Wyposażam salę spotkań</h3>
            <p className="text-sm text-ink/80 mt-3">ProAV: wideokonferencje, ekrany i przyłącza.</p>
          </a>
        </div>
      </div>
    </section>
  </div>
);
