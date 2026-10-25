import React from 'react';
import { Logo } from './Logo';
import { PageId } from '../types';
import { pageUrl, plannerUrl } from '../site';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenPrivacy: (tab?: 'privacy' | 'cookies' | 'rodo') => void;
}
const linkClass = 'inline-block py-1 hover:text-white hover:underline underline-offset-4';

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy }) => (
  <footer className="bg-ink text-mist border-t border-white/10 pt-14 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/15">
        <div>
          <Logo variant="dark" size="lg" />
          <p className="mt-5 text-sm leading-relaxed text-mist/80">
            Automatyka KNX dla domów i apartamentów. Pomagamy inwestorom i architektom zaplanować
            wygodne sterowanie światłem, temperaturą i roletami.
          </p>
          <p className="mt-5 text-xs text-mist/75">Delitech Sp.j. · NIP: 1132919580</p>
        </div>
        <nav aria-label="Dom i współpraca">
          <h2 className="text-sm font-semibold mb-4 text-white">Twój inteligentny dom</h2>
          <ul className="text-sm text-mist/85 space-y-1">
            <li>
              <a href={pageUrl('homes')} className={linkClass}>
                Domy i apartamenty
              </a>
            </li>
            <li>
              <a href={pageUrl('solutions')} className={linkClass}>
                Co może Twój dom
              </a>
            </li>
            <li>
              <a href={pageUrl('homes', 'etapy')} className={linkClass}>
                Etapy współpracy
              </a>
            </li>
            <li>
              <a href={pageUrl('homes', 'koszt')} className={linkClass}>
                Od czego zależy koszt
              </a>
            </li>
            <li>
              <a href={pageUrl('architects')} className={linkClass}>
                Dla architektów
              </a>
            </li>
            <li>
              <a href={plannerUrl()} className={linkClass + ' text-accent font-semibold'}>
                Konfigurator KNX ↗
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-label="O firmie i dodatkowe usługi">
          <h2 className="text-sm font-semibold mb-4 text-white">Poznaj InteliSpaces</h2>
          <ul className="text-sm text-mist/85 space-y-1">
            <li>
              <a href={pageUrl('about')} className={linkClass}>
                O nas
              </a>
            </li>
            <li>
              <a href={pageUrl('team')} className={linkClass}>
                Nasz zespół
              </a>
            </li>
            <li>
              <a href={pageUrl('knx')} className={linkClass}>
                Czym jest KNX
              </a>
            </li>
            <li>
              <a href={pageUrl('knowledge')} className={linkClass}>
                Pytania i odpowiedzi
              </a>
            </li>
            <li>
              <a href={pageUrl('projects')} className={linkClass}>
                Przykłady funkcji w domu
              </a>
            </li>
          </ul>
          <p className="text-xs uppercase tracking-wider text-mist/65 mt-6 mb-2">
            Dodatkowa usługa
          </p>
          <a href={pageUrl('proav')} className={linkClass + ' text-sm'}>
            Sale spotkań · ProAV
          </a>
        </nav>
        <div>
          <h2 className="text-sm font-semibold mb-4 text-white">Porozmawiajmy o projekcie</h2>
          <address className="not-italic text-sm text-mist/85 space-y-4">
            <p className="flex gap-2">
              <MapPin size={18} className="shrink-0 text-accent" aria-hidden="true" />
              <span>
                ul. Konwaliowa 7, lok. 103
                <br />
                03-194 Warszawa
              </span>
            </p>
            <a href="tel:+48505260715" className="flex items-center gap-2 hover:text-white">
              <Phone size={18} className="text-accent" aria-hidden="true" />
              +48 505 260 715
            </a>
            <a
              href="mailto:kontakt@delitech.pl"
              className="flex items-center gap-2 hover:text-white break-all"
            >
              <Mail size={18} className="shrink-0 text-accent" aria-hidden="true" />
              kontakt@delitech.pl
            </a>
          </address>
          <a
            href={pageUrl('contact')}
            className="inline-flex items-center gap-2 text-accent mt-5 text-sm font-semibold"
          >
            Kontakt <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="py-6 flex flex-wrap gap-x-6 gap-y-3 text-xs text-mist/80 border-b border-white/15">
        <span>Nasze portale branżowe:</span>
        <a
          href="https://elektrodesign.pl/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white underline underline-offset-4"
        >
          Elektrodesign ↗
        </a>
        <a
          href="https://mediaporty.com.pl/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white underline underline-offset-4"
        >
          Mediaporty ↗
        </a>
        <a
          href="https://puszkipodlogowe.pl/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white underline underline-offset-4"
        >
          Puszki podłogowe ↗
        </a>
      </div>
      <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-mist/75">
        <p>© {new Date().getFullYear()} INTELISPACES</p>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => onOpenPrivacy('privacy')} className="hover:text-white">
            Polityka prywatności
          </button>
          <button onClick={() => onOpenPrivacy('rodo')} className="hover:text-white">
            Klauzula RODO
          </button>
          <button onClick={() => onOpenPrivacy('cookies')} className="hover:text-white">
            Ustawienia cookies
          </button>
        </div>
      </div>
    </div>
  </footer>
);
