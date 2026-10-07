import { cmsText } from '../cms';
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
    <footer className="bg-[#17211C] text-[#EDE9DF] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-xs sm:text-sm text-[#EDE9DF]/70 max-w-sm leading-relaxed pt-2">{cmsText("footer.3661925314", "Automatyka budynku, która pracuje dla ludzi i przestrzeni. Certyfikowany integrator otwartego standardu KNX dla biur komercyjnych, rezydencji oraz apartamentów premium.")}</p>

            <div className="pt-3 flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0E4637] rounded-lg border border-[#CFE3C4]/20 text-[11px] font-mono text-[#CFE3C4]">
                <Award className="w-4 h-4 text-[#E6F15A]" />
                <span>{cmsText("footer.69deace2c7", "Certyfikowany Partner KNX International")}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#EDE9DF]/50 space-y-0.5 font-mono">
              <p>{cmsText("footer.9b51f2f234", "NIP: 1132919580")}</p>
              <p>{cmsText("footer.0404032a8d", "Delitech Sp.j.")}</p>
            </div>
          </div>

          {/* Col 2: Oferta i Segmenty */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#CFE3C4]">{cmsText("footer.9295ce079a", "Obszary & Usługi")}</h4>
            <ul className="space-y-2 text-xs text-[#EDE9DF]/75">
              <li>
                <button
                  onClick={() => onNavigate('offices')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.836278a6c6", "Automatyka dla biur & Fit-out")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offices', 'konferencyjne')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.6f60adff15", "Sale konferencyjne & Zarząd")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('homes')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.967f6cd5ab", "Domy jednorodzinne & Rezydencje")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('homes', 'apartament')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.5e43615005", "Apartamenty premium")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('solutions', 'dali')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.6ff744e9ed", "Sterowanie DALI & Oświetlenie")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('solutions', 'hvac')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.44f7c49c67", "Integracja HVAC & Energia")}</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Architekci & Standard KNX */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#CFE3C4]">{cmsText("footer.682c3baf57", "Standard & Partnerzy")}</h4>
            <ul className="space-y-2 text-xs text-[#EDE9DF]/75">
              <li>
                <button
                  onClick={() => onNavigate('architects')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.73364db0f4", "Strefa architekta i projektanta")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('architects', 'jung')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.58fa1ab0fc", "Osprzęt architektoniczny JUNG")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('knx')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.d435d81102", "Dlaczego standard KNX?")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.f1d2186e64", "Przykładowe zakresy realizacji")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('knowledge')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.f5040fb016", "Baza wiedzy & FAQ")}</button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >{cmsText("footer.0e027f35aa", "O firmie & Filozofia")}</button>
              </li>
              <li className="pt-2 border-t border-white/10 mt-2">
                <span className="block text-[10px] font-mono text-[#CFE3C4]/60 uppercase tracking-wider mb-1.5">{cmsText("footer.1b1550218b", "Polecane portale branżowe")}</span>
              </li>
              <li>
                <a
                  href="https://puszkipodlogowe.pl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                >
                  <span>{cmsText("footer.d35fdcb1bb", "Puszki podłogowe i floorboxy")}</span>
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
                  <span>{cmsText("footer.2ff357a24f", "Mediaporty i gniazda meblowe")}</span>
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
                  <span>{cmsText("footer.8425c220f6", "Designerski osprzęt elektroinstalacyjny")}</span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#E6F15A]">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Siedziba i Kontakt */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#CFE3C4]">{cmsText("footer.719336c275", "Biuro Warszawa")}</h4>
            <div className="space-y-2.5 text-xs text-[#EDE9DF]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E6F15A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{cmsText("footer.e96f626a73", "ul. Konwaliowa 7 / lok. 103")}</p>
                  <p>{cmsText("footer.5d871570ac", "03-194 Warszawa")}</p>
                  <p className="text-[11px] text-[#EDE9DF]/50">{cmsText("footer.dfb3ff7936", "Realizacje w całej Polsce")}</p>
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
                <a href="mailto:kontakt@delitech.pl" className="hover:text-white font-mono">{cmsText("footer.30a99cd273", "kontakt@delitech.pl")}</a>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E4637] hover:bg-[#0E4637]/80 text-[#E6F15A] font-semibold text-[11px] uppercase tracking-wider rounded transition-colors"
                >
                  <span>{cmsText("footer.ade78808e4", "Prześlij rzuty")}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EDE9DF]/50">
          <p>© {new Date().getFullYear()}{cmsText("footer.14cb06dd37", " INTELISPACES. Wszelkie prawa zastrzeżone.")}</p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenPrivacy('privacy')}
              className="hover:text-white transition-colors"
            >{cmsText("footer.137ba0012e", "Polityka prywatności")}</button>
            <span>·</span>
            <button
              onClick={() => onOpenPrivacy('rodo')}
              className="hover:text-white transition-colors"
            >{cmsText("footer.64df2cb9b9", "Klauzula RODO")}</button>
            <span>·</span>
            <button
              onClick={() => onOpenPrivacy('cookies')}
              className="hover:text-white transition-colors"
            >{cmsText("footer.c243985591", "Ustawienia cookies")}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
