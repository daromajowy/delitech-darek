import { cmsText } from '../cms/content.ts';
import React from 'react';
import { Logo } from './Logo.tsx';
import { PageId } from '../types.ts';
import { MapPin, Phone, Mail, Award, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenPrivacy: (tab?: 'privacy' | 'cookies' | 'rodo') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPrivacy }) => {
  return (
    <footer className="bg-[#17211C] text-[#EDE9DF] border-t border-white/10 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-xs sm:text-sm text-[#EDE9DF]/70 max-w-sm leading-relaxed pt-2">{cmsText("Footer-c2de178f44cd", "Partner architektów i inwestorów w planowaniu automatyki KNX. Światło, osłony i temperatura dopasowane do wnętrza.")}</p>

            <div className="pt-3 flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0E4637] rounded-lg border border-[#CFE3C4]/20 text-[11px] font-mono text-[#CFE3C4]">
                <Award className="w-4 h-4 text-[#E6F15A]" />
                <span>{cmsText("Footer-e1e7597c9acc", "KNX · DALI · automatyka pomieszczeń")}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#EDE9DF]/50 space-y-0.5 font-mono">
              <p>{cmsText("Footer-a72cbeddf553", "NIP: 1132919580 · REGON: 36555562000000")}</p>
              <p>{cmsText("Footer-758c48e9fb71", "Delitech Jasek spółka jawna")}</p>
              <p>{cmsText('Footer-registered-address', 'Siedziba rejestrowa: ul. Myśliborska 85A/8, 03-185 Warszawa')}</p>
            </div>
          </div>

          {/* Col 2: Oferta i Segmenty */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#CFE3C4]">{cmsText("Footer-90b5ad1fe110", "Obszary & Usługi")}</h4>
            <ul className="space-y-2 text-xs text-[#EDE9DF]/75">
              <li><button onClick={() => onNavigate('architects')} className="hover:text-white hover:underline text-left">{cmsText("Footer-v2-architects", "Współpraca z architektami")}</button></li>
              <li>
                <button
                  onClick={() => onNavigate('offices')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-2d4320c44946", "Automatyka dla biur & Fit-out")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offices', 'konferencyjne')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-1daad06a30d7", "Sale konferencyjne & Zarząd")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('homes')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-61554b5b2bc8", "Domy jednorodzinne & Rezydencje")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('homes', 'apartament')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-36b83c3290a7", "Apartamenty premium")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('solutions', 'dali')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-f93cb367f145", "Sterowanie DALI & Oświetlenie")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('solutions', 'hvac')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-193e10837c5f", "Integracja HVAC & Energia")}</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Architekci & Standard KNX */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#CFE3C4]">{cmsText("Footer-a64488a41e20", "Wiedza i materiały")}</h4>
            <ul className="space-y-2 text-xs text-[#EDE9DF]/75">
              <li>
                <button
                  onClick={() => onNavigate('architects')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-1c46e232e05b", "Strefa architekta i projektanta")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('architects', 'jung')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-64de4d3b934b", "Osprzęt architektoniczny JUNG")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('knx')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-ad0e16d8e224", "Dlaczego standard KNX?")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-9f744f97d4e8", "Przykłady rozwiązań")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('knowledge')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-04aae6752296", "Baza wiedzy & FAQ")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("Footer-b6c751124f3c", "Jak pracujemy")}</button>
              </li>
              <li className="pt-2 border-t border-white/10 mt-2">
                <span className="block text-[10px] font-mono text-[#CFE3C4]/60 uppercase tracking-wider mb-1.5">{cmsText("Footer-0c2fe068f904", "Polecane portale branżowe")}</span>
              </li>
              <li>
                <a
                  href="https://puszkipodlogowe.pl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                >
                  <span>{cmsText("Footer-d9d9694e1e63", "Puszki podłogowe i floorboxy")}</span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#E6F15A]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://mediaporty.com.pl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                >
                  <span>{cmsText("Footer-61e8a88f2749", "Mediaporty i gniazda meblowe")}</span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#E6F15A]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://elektrodesign.pl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                >
                  <span>{cmsText("Footer-e5e5492232a7", "Designerski osprzęt elektroinstalacyjny")}</span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#E6F15A]">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Siedziba i Kontakt */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#CFE3C4]">{cmsText("Footer-b9a6e82b27ea", "Salon sprzedaży")}</h4>
            <div className="space-y-2.5 text-xs text-[#EDE9DF]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E6F15A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{cmsText("Footer-ea7f84fb3479", "ul. Konwaliowa 7 lok. 103")}</p>
                  <p>{cmsText("Footer-f2fb354d7114", "03-194 Warszawa")}</p>
                  <p className="text-[11px] text-[#EDE9DF]/50">{cmsText("Footer-8520659aea8e", "Realizacje w całej Polsce")}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E6F15A] shrink-0" />
                <a href="tel:+48505260715" className="hover:text-white font-mono">
                  +48 505 260 715
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E6F15A] shrink-0" />
                <a href={"mailto:" + cmsText("Footer-3aaae08d2a31", "biuro@intelispaces.pl")} className="hover:text-white font-mono">{cmsText("Footer-3aaae08d2a31", "biuro@intelispaces.pl")}</a>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E4637] hover:bg-[#0E4637]/80 text-[#E6F15A] font-semibold text-[11px] uppercase tracking-wider rounded transition-colors"
                >
                  <span>{cmsText("Footer-fcbf5c493409", "Prześlij rzuty")}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EDE9DF]/50">
          <p>© {new Date().getFullYear()}{cmsText("Footer-14d0048fb323", " Delitech Smart Spaces. Wszelkie prawa zastrzeżone.")}</p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenPrivacy('privacy')}
              className="hover:text-white transition-colors"
            >{cmsText("Footer-a7a190663e33", "Polityka prywatności")}</button>
            <span>·</span>
            <button
              onClick={() => onOpenPrivacy('rodo')}
              className="hover:text-white transition-colors"
            >{cmsText("Footer-46f3a4957f51", "Klauzula RODO")}</button>
            <span>·</span>
            <button
              onClick={() => onOpenPrivacy('cookies')}
              className="hover:text-white transition-colors"
            >{cmsText("Footer-87ba3ef1718d", "Ustawienia cookies")}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
