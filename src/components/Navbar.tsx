import { cmsText } from '../cms/content.ts';
import React, { useRef, useState } from 'react';
import { Logo } from './Logo.tsx';
import { PageId } from '../types.ts';
import { ChevronDown, Menu, X, PhoneCall } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, subSectionHash?: string) => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenConsultation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems: {id:PageId;label:string;subItems?:{label:string;hash:string;page?:PageId}[]}[] = [
    {id:'architects',label:cmsText('Navbar-v2-architects','Dla architektów'),subItems:[
      {label:cmsText('Navbar-v2-support','Wsparcie projektowe'),hash:'wsparcie'},
      {label:cmsText('Navbar-v2-pack','Pakiet dla architekta'),hash:'pakiet'},
      {label:cmsText('Navbar-v2-jung','Osprzęt i materiały'),hash:'jung'}
    ]},
    {id:'homes',label:cmsText('Navbar-v2-homes','Domy i apartamenty'),subItems:[
      {label:cmsText('Navbar-v2-house','Dom jednorodzinny'),hash:'dom'},
      {label:cmsText('Navbar-v2-apartment','Apartament'),hash:'apartament'},
      {label:cmsText('Navbar-v2-modernize','Modernizacja instalacji'),hash:'modernizacja'}
    ]},
    {id:'offices',label:cmsText('Navbar-v2-offices','Biura'),subItems:[
      {label:cmsText('Navbar-v2-open','Strefy pracy'),hash:'open-space'},
      {label:cmsText('Navbar-v2-meeting','Sale konferencyjne'),hash:'konferencyjne'},
      {label:cmsText('Navbar-v2-fitout','Projekt i fit-out'),hash:'audyt'}
    ]},
    {id:'about',label:cmsText('Navbar-v2-process','Jak pracujemy'),subItems:[
      {label:cmsText('Navbar-v2-stages','Etapy i odpowiedzialność'),hash:''},
      {label:cmsText('Navbar-v2-examples','Przykłady rozwiązań'),hash:'',page:'projects'},
      {label:cmsText('Navbar-v2-solutions','Technologie i integracje'),hash:'',page:'solutions'},
      {label:cmsText('Navbar-v2-contact','Kontakt'),hash:'',page:'contact'}
    ]},
    {id:'showroom',label:cmsText('Navbar-v2-showroom','Salon')},
    {id:'knowledge',label:cmsText('Navbar-v2-knowledge','Wiedza'),subItems:[
      {label:cmsText('Navbar-knx-investor-guide','KNX dla inwestora'),hash:'knx-dla-inwestora'},
      {label:cmsText('Navbar-v2-knx','Poznaj standard KNX'),hash:'',page:'knx'},
      {label:cmsText('Navbar-v2-guides','Wszystkie poradniki i FAQ'),hash:''}
    ]}
  ];

  const handleNavClick = (pageId: PageId, hash?: string) => {
    onNavigate(pageId, hash);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header sticky top-0 z-50 w-full bg-[#F7F8F5]/95 backdrop-blur-md border-b border-[#17211C]/10 transition-colors">
      {/* 1. Pre-Header Informational Strip */}
      <div className="bg-[#0E4637] text-[#EDE9DF] text-[11px] font-medium tracking-wider uppercase border-b border-[#0E4637]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E6F15A]" />
            <span>{cmsText("Navbar-3c6c92355e18", "KNX dla architektów, inwestorów i biur")}</span>
          </div>
          <div className="flex w-full sm:w-auto items-center justify-between gap-3 text-[#CFE3C4]">
            <span>{cmsText("Navbar-b0e72a2fe58e", "Warszawa · realizacje w całej Polsce")}</span>
            <span aria-hidden="true">·</span>
            <a
              href="tel:+48505260715"
              className="hover:text-white transition-colors flex items-center gap-1 normal-case font-mono tracking-normal text-xs whitespace-nowrap"
            >
              +48 505 260 715
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header: Strict 3-Zone Contract */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark & Connected Grid Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="group shrink-0 flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E4637] rounded-md p-1 -m-1"
          aria-label={cmsText("Navbar-268c60ce0543", "Delitech Smart Spaces - Strona główna")}
        >
          <Logo variant="light" size="md" />
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav
          className="hidden min-[1280px]:flex items-center gap-0.5 min-[1440px]:gap-1 text-[13px] font-medium tracking-tight text-[#17211C]"
          aria-label={cmsText("Navbar-50d83f738c9f", "Główne menu")}
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const hasChildren = item.subItems && item.subItems.length > 0;

            if (hasChildren) {
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  onFocus={() => setActiveDropdown(item.id)}
                  onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveDropdown(null); }}
                  onKeyDown={event => { if (event.key === 'Escape') setActiveDropdown(null); }}
                >
                  <button
                    onClick={() => item.id === 'knowledge' ? setActiveDropdown(item.id) : handleNavClick(item.id)}
                    aria-expanded={activeDropdown === item.id}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-[#0E4637] font-semibold bg-[#CFE3C4]/25'
                        : 'text-[#17211C]/80 hover:text-[#0E4637] hover:bg-black/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === item.id && (
                    <div className="absolute top-full left-0 w-64 pt-2 shadow-xl z-50">
                      <div className="bg-white border border-[#17211C]/10 rounded-xl p-2 shadow-lg backdrop-blur-sm">
                        {item.subItems?.map((sub) => (
                          <a
                            key={(sub.page || item.id) + '/' + sub.hash}
                            href={`#${sub.page || item.id}${sub.hash ? '/' + sub.hash : ''}`}
                            onClick={event => {event.preventDefault();handleNavClick(sub.page || item.id, sub.hash);}}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-[#17211C]/85 hover:text-[#0E4637] hover:bg-[#F7F8F5] rounded-lg transition-colors flex items-center justify-between group"
                          >
                            <span>{sub.label}</span>
                            <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-[#E6F15A] transition-colors" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#0E4637] font-semibold bg-[#CFE3C4]/25'
                    : 'text-[#17211C]/80 hover:text-[#0E4637] hover:bg-black/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E4637] hover:bg-[#17211C] text-[#E6F15A] font-semibold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#E6F15A]" />
            <span>{cmsText("Navbar-df5714c7d60a", "Omów projekt")}</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            ref={mobileToggleRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-[1280px]:hidden p-2 rounded-lg text-[#17211C] hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#0E4637]"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? cmsText("Navbar-v2-close-menu", "Zamknij menu mobilne") : cmsText("Navbar-b615cfd3278a", "Otwórz menu mobilne")}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="min-[1280px]:hidden bg-[#F7F8F5] border-t border-[#17211C]/10 px-4 pt-3 pb-6 max-h-[calc(100dvh-110px)] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <div key={item.id} className="py-1">
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg flex items-center justify-between ${
                    currentPage === item.id
                      ? 'bg-[#0E4637] text-white'
                      : 'text-[#17211C] hover:bg-black/5'
                  }`}
                >
                  <span>{item.label}</span>
                </button>

                {item.subItems && (
                  <div className="pl-4 mt-1 space-y-1 border-l border-[#0E4637]/20 ml-3">
                    {item.subItems.map((sub) => (
                      <a
                        key={(sub.page || item.id) + '/' + sub.hash}
                        href={`#${sub.page || item.id}${sub.hash ? '/' + sub.hash : ''}`}
                        onClick={event => {event.preventDefault();handleNavClick(sub.page || item.id, sub.hash);}}
                        className="block w-full text-left px-3 py-1.5 text-xs text-[#17211C]/75 hover:text-[#0E4637] rounded-md transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 mt-3 border-t border-[#17211C]/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  mobileToggleRef.current?.focus();
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full py-3 bg-[#0E4637] text-[#E6F15A] font-semibold text-xs uppercase tracking-wider rounded-lg text-center flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{cmsText("Navbar-df5714c7d60a", "Omów projekt")}</span>
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full py-2.5 border border-[#0E4637]/20 text-[#0E4637] font-medium text-xs uppercase tracking-wider rounded-lg text-center"
              >{cmsText("Navbar-1571ee109283", "Kontakt i adres")}</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
