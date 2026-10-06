import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import { PageId } from '../types.ts';
import { ChevronDown, Menu, PhoneCall, X } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, subSectionHash?: string) => void;
  onOpenConsultation: () => void;
}

type SubItem = { label: string; hash?: string; page?: PageId };
type NavItem = { id: PageId; label: string; subItems?: SubItem[] };

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenConsultation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Mirrors the production intelispaces.pl navigation hierarchy.
  const navItems: NavItem[] = [
    { id: 'architects', label: 'Dla architektów', subItems: [
      { label: 'Wsparcie projektowe', hash: 'wsparcie' },
      { label: 'Pakiet dla architekta', hash: 'pakiet' },
      { label: 'Osprzęt i materiały', hash: 'jung' },
    ] },
    { id: 'homes', label: 'Domy i apartamenty', subItems: [
      { label: 'Dom jednorodzinny', hash: 'dom' },
      { label: 'Apartament', hash: 'apartament' },
      { label: 'Modernizacja instalacji', hash: 'modernizacja' },
    ] },
    { id: 'offices', label: 'Biura', subItems: [
      { label: 'Strefy pracy', hash: 'open-space' },
      { label: 'Sale konferencyjne', hash: 'konferencyjne' },
      { label: 'Projekt i fit-out', hash: 'audyt' },
    ] },
    { id: 'about', label: 'Jak pracujemy', subItems: [
      { label: 'Etapy i odpowiedzialność' },
      { label: 'Przykłady rozwiązań', page: 'projects' },
      { label: 'Technologie i integracje', page: 'solutions' },
      { label: 'Kontakt', page: 'contact' },
    ] },
    // The production "Salon" route is represented by the existing projects page on Darka.
    { id: 'projects', label: 'Salon' },
    { id: 'knowledge', label: 'Wiedza', subItems: [
      { label: 'KNX dla inwestora', hash: 'knx-dla-inwestora' },
      { label: 'Poznaj standard KNX', page: 'knx' },
      { label: 'Wszystkie poradniki i FAQ' },
    ] },
  ];

  const handleNavClick = (pageId: PageId, hash?: string) => {
    onNavigate(pageId, hash);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header sticky top-0 z-50 w-full bg-[#F7F8F5]/95 backdrop-blur-md border-b border-[#17211C]/10 transition-colors">
      <div className="bg-[#0E4637] text-[#EDE9DF] text-[11px] font-medium tracking-wider uppercase border-b border-[#0E4637]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E6F15A]" />
            <span>KNX dla architektów, inwestorów i biur</span>
          </div>
          <div className="flex w-full sm:w-auto items-center justify-between gap-3 text-[#CFE3C4]">
            <span>Warszawa · realizacje w całej Polsce</span><span aria-hidden="true">·</span>
            <a href="tel:+48505260715" className="hover:text-white transition-colors flex items-center gap-1 normal-case font-mono tracking-normal text-xs whitespace-nowrap">+48 505 260 715</a>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => handleNavClick('home')} className="group shrink-0 flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E4637] rounded-md p-1 -m-1" aria-label="Delitech Smart Spaces - Strona główna">
          <Logo variant="light" size="md" />
        </button>

        <nav className="hidden min-[1280px]:flex items-center gap-0.5 min-[1440px]:gap-1 text-[13px] font-medium tracking-tight text-[#17211C]" aria-label="Główne menu">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const hasChildren = Boolean(item.subItems?.length);
            const itemClass = isActive ? 'text-[#0E4637] font-semibold bg-[#CFE3C4]/25' : 'text-[#17211C]/80 hover:text-[#0E4637] hover:bg-black/5';
            if (!hasChildren) return <button key={item.id} onClick={() => handleNavClick(item.id)} className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${itemClass}`}>{item.label}</button>;
            return (
              <div key={item.id} className="relative" onMouseEnter={() => setActiveDropdown(item.id)} onMouseLeave={() => setActiveDropdown(null)} onFocus={() => setActiveDropdown(item.id)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveDropdown(null); }} onKeyDown={(event) => { if (event.key === 'Escape') setActiveDropdown(null); }}>
                <button onClick={() => item.id === 'knowledge' ? setActiveDropdown(item.id) : handleNavClick(item.id)} aria-expanded={activeDropdown === item.id} className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors whitespace-nowrap ${itemClass}`}>
                  <span>{item.label}</span><ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
                {activeDropdown === item.id && (
                  <div className="absolute top-full left-0 w-64 pt-2 shadow-xl z-50"><div className="bg-white border border-[#17211C]/10 rounded-xl p-2 shadow-lg backdrop-blur-sm">
                    {item.subItems?.map((sub) => <button key={`${sub.page || item.id}/${sub.hash || sub.label}`} onClick={() => handleNavClick(sub.page || item.id, sub.hash)} className="w-full text-left px-3 py-2 text-xs font-medium text-[#17211C]/85 hover:text-[#0E4637] hover:bg-[#F7F8F5] rounded-lg transition-colors flex items-center justify-between group"><span>{sub.label}</span><span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-[#E6F15A] transition-colors" /></button>)}
                  </div></div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={onOpenConsultation} className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E4637] hover:bg-[#17211C] text-[#E6F15A] font-semibold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] whitespace-nowrap"><PhoneCall className="w-3.5 h-3.5 text-[#E6F15A]" /><span>Omów projekt</span></button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="min-[1280px]:hidden p-2 rounded-lg text-[#17211C] hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#0E4637]" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Zamknij menu mobilne' : 'Otwórz menu mobilne'}>{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="min-[1280px]:hidden bg-[#F7F8F5] border-t border-[#17211C]/10 px-4 pt-3 pb-6 max-h-[calc(100dvh-110px)] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => <div key={item.id} className="py-1">
              <button onClick={() => handleNavClick(item.id)} className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg flex items-center justify-between ${currentPage === item.id ? 'bg-[#0E4637] text-white' : 'text-[#17211C] hover:bg-black/5'}`}><span>{item.label}</span></button>
              {item.subItems && <div className="pl-4 mt-1 space-y-1 border-l border-[#0E4637]/20 ml-3">{item.subItems.map((sub) => <button key={`${sub.page || item.id}/${sub.hash || sub.label}`} onClick={() => handleNavClick(sub.page || item.id, sub.hash)} className="w-full text-left px-3 py-1.5 text-xs text-[#17211C]/75 hover:text-[#0E4637] rounded-md transition-colors">{sub.label}</button>)}</div>}
            </div>)}
            <div className="pt-4 mt-3 border-t border-[#17211C]/10 flex flex-col gap-2">
              <button onClick={() => { setMobileMenuOpen(false); onOpenConsultation(); }} className="w-full py-3 bg-[#0E4637] text-[#E6F15A] font-semibold text-xs uppercase tracking-wider rounded-lg text-center flex items-center justify-center gap-2"><PhoneCall className="w-4 h-4" /><span>Omów projekt</span></button>
              <button onClick={() => handleNavClick('contact')} className="w-full py-2.5 border border-[#0E4637]/20 text-[#0E4637] font-medium text-xs uppercase tracking-wider rounded-lg text-center">Prześlij rzuty do wyceny</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
