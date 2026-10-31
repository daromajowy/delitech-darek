import React from 'react';
import { ArrowUpRight, Globe, Mail, Phone } from 'lucide-react';
import type { PageId } from '../types';
import { pageUrl } from '../site';
import { Logo } from './Logo';
import './HomeFooter.css';

interface HomeFooterProps {
  onOpenPrivacy: (tab?: 'privacy' | 'cookies' | 'rodo') => void;
}

const links: { page: PageId; label: string }[] = [
  { page: 'homes', label: 'Domy i apartamenty' },
  { page: 'solutions', label: 'Co może Twój dom' },
  { page: 'offices', label: 'Biura' },
  { page: 'architects', label: 'Dla architektów' },
  { page: 'about', label: 'O nas' },
  { page: 'contact', label: 'Kontakt' },
];

export const HomeFooter: React.FC<HomeFooterProps> = ({ onOpenPrivacy }) => (
  <footer className="home-footer">
    <div className="home-footer__wrap">
      <div className="home-footer__top">
        <a href={pageUrl('home')} className="home-footer__logo" aria-label="InteliSpaces — strona główna">
          <Logo variant="dark" size="lg" />
        </a>
        <nav aria-label="Nawigacja w stopce">
          {links.map(({ page, label }) => <a key={page} href={pageUrl(page)}>{label}</a>)}
        </nav>
      </div>
      <div className="home-footer__contact-row">
        <address>
          <a href="tel:+48505260715"><Phone size={21} aria-hidden="true" />+48 505 260 715</a>
          <a href="mailto:kontakt@delitech.pl"><Mail size={21} aria-hidden="true" />kontakt@delitech.pl</a>
          <a href="https://intelispaces.pl/"><Globe size={21} aria-hidden="true" />intelispaces.pl</a>
        </address>
        <a href={pageUrl('proav')} className="home-footer__proav">ProAV do sal spotkań <ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
      <div className="home-footer__legal">
        <p>© {new Date().getFullYear()} InteliSpaces · Delitech Sp.j. · NIP 1132919580</p>
        <div>
          <button type="button" onClick={() => onOpenPrivacy('privacy')}>Polityka prywatności</button>
          <button type="button" onClick={() => onOpenPrivacy('rodo')}>Klauzula RODO</button>
          <button type="button" onClick={() => onOpenPrivacy('cookies')}>Ustawienia cookies</button>
        </div>
      </div>
    </div>
  </footer>
);
