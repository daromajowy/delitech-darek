import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { pageUrl, plannerUrl } from '../site';
import { Logo } from './Logo';
import type { PageId } from '../types';
import './Navbar.css';

const navigation: { page: PageId; label: string }[] = [
  { page: 'homes', label: 'Domy i apartamenty' },
  { page: 'solutions', label: 'Co może Twój dom' },
  { page: 'architects', label: 'Dla architektów' },
  { page: 'about', label: 'O nas' },
  { page: 'contact', label: 'Kontakt' },
];

export function Navbar({ currentPage }: { currentPage: PageId }) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const activePage = currentPage === 'team' ? 'about' : currentPage;

  useEffect(() => {
    setOpen(false);
  }, [currentPage]);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1280px)');
    const resized = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    desktop.addEventListener('change', resized);
    return () => {
      document.removeEventListener('keydown', escape);
      document.removeEventListener('pointerdown', outside);
      desktop.removeEventListener('change', resized);
    };
  }, [open]);

  const links = navigation.map(({ page, label }) => (
    <a
      key={page}
      href={pageUrl(page)}
      aria-current={activePage === page ? 'page' : undefined}
      onClick={() => setOpen(false)}
    >
      {label}
    </a>
  ));

  return (
    <header ref={header} className="site-header primary-header">
      <a className="primary-header__skip" href="#main-content">
        Przejdź do treści
      </a>
      <div className="primary-header__bar">
        <a
          href={pageUrl('home')}
          className="primary-header__logo"
          aria-label="InteliSpaces — strona główna"
        >
          <Logo />
        </a>
        <nav className="primary-header__desktop" aria-label="Główne menu">
          {links}
        </nav>
        <div className="primary-header__actions">
          <a href={plannerUrl()} className="primary-header__planner">
            Konfigurator KNX <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <button
            ref={toggle}
            type="button"
            className="primary-header__toggle"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            <span>Menu</span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-navigation" className="primary-header__mobile" aria-label="Menu mobilne">
          {links}
          <a href={plannerUrl()} className="primary-header__mobile-planner">
            Konfigurator KNX <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a className="primary-header__phone" href="tel:+48505260715">
            <Phone size={17} aria-hidden="true" /> +48 505 260 715
          </a>
        </nav>
      )}
    </header>
  );
}
