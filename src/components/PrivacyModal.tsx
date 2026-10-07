import { cmsText } from '../cms';
import React from 'react';
import { X, ShieldCheck, Lock, FileCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'cookies' | 'rodo';
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = React.useState<'privacy' | 'cookies' | 'rodo'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#17211C]/15 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#17211C]/10 flex items-center justify-between bg-[#F7F8F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0E4637] text-[#E6F15A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-lg font-bold font-display text-[#17211C]">{cmsText("privacymodal.e956cb5040", "Informacje Prawne i Ochrona Danych")}</h2>
              <p className="text-xs text-[#17211C]/60">{cmsText("privacymodal.367dc7937a", "Delitech Smart Spaces · Warszawa")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#17211C]/60 hover:text-[#17211C] hover:bg-black/5 transition-colors"
            aria-label={cmsText("privacymodal.e0fdaa164d", "Zamknij okno")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#17211C]/10 px-6 bg-[#F7F8F5]/50 gap-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-[#0E4637] text-[#0E4637]'
                : 'border-transparent text-[#17211C]/60 hover:text-[#17211C]'
            }`}
          >{cmsText("privacymodal.abf59dedd6", "Polityka Prywatności")}</button>
          <button
            onClick={() => setActiveTab('rodo')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'rodo'
                ? 'border-[#0E4637] text-[#0E4637]'
                : 'border-transparent text-[#17211C]/60 hover:text-[#17211C]'
            }`}
          >{cmsText("privacymodal.ed62697191", "Klauzula Informacyjna RODO")}</button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'cookies'
                ? 'border-[#0E4637] text-[#0E4637]'
                : 'border-transparent text-[#17211C]/60 hover:text-[#17211C]'
            }`}
          >{cmsText("privacymodal.1af7a20978", "Polityka Cookies")}</button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto text-sm text-[#17211C]/80 space-y-4 leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#17211C] text-base">{cmsText("privacymodal.be91aa855b", "1. Administrator Danych Osobowych")}</h3>
              <p>{cmsText("privacymodal.c51c399c87", "Administratorem danych osobowych zbieranych za pośrednictwem portalu jest Delitech Sp.j. z siedzibą przy ul. Konwaliowej 7 lok. 103, 03-194 Warszawa, NIP: 1132919580, e-mail: kontakt@delitech.pl, tel: +48 505 260 715.")}</p>

              <h3 className="font-bold text-[#17211C] text-base pt-2">{cmsText("privacymodal.e24677a5f6", "2. Zakres i Cel Zbierania Danych")}</h3>
              <p>{cmsText("privacymodal.d0919d5775", "Przetwarzamy dane osobowe (imię, nazwisko, adres e-mail, numer telefonu, nazwa pracowni/firmy, dokumentacja rzutów architektonicznych i instalacyjnych) wyłącznie w celach:")}</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>{cmsText("privacymodal.857cd333cf", "przygotowania analizy technicznej, audytu rzutów oraz oferty cenowo-funkcjonalnej automatyki KNX (art. 6 ust. 1 lit. b RODO),")}</li>
                <li>{cmsText("privacymodal.149837c377", "kontaktu telefonicznego i mailowego w sprawie przesłanego zapytania (art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes administratora),")}</li>
                <li>{cmsText("privacymodal.0e2e9ba7a3", "realizacji umów wdrożeniowych, programistycznych i serwisowych.")}</li>
              </ul>

              <h3 className="font-bold text-[#17211C] text-base pt-2">{cmsText("privacymodal.e1f72b4c3f", "3. Poufność Rzutów Architektonicznych")}</h3>
              <p className="text-xs bg-[#F7F8F5] p-3 rounded-lg border border-[#17211C]/10">{cmsText("privacymodal.f596a25a58", "Wszelkie materiały projektowe (pliki DWG, PDF, modele BIM, specyfikacje techniczne) przesłane przez formularz podlegają ścisłej tajemnicy zawodowej i nie są udostępniane podmiotom trzecim bez wyraźnej pisemnej zgody inwestora lub architekta.")}</p>
            </div>
          )}

          {activeTab === 'rodo' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#17211C] text-base">{cmsText("privacymodal.c445d8be7a", "Prawa Osób, Których Dane Dotyczą")}</h3>
              <p>{cmsText("privacymodal.f987d5ec3c", "Zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO), każdemu użytkownikowi przysługuje prawo do:")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#0E4637] block">{cmsText("privacymodal.8ee3d4c28f", "Prawo dostępu do danych")}</span>{cmsText("privacymodal.feb66efba6", "Możliwość uzyskania informacji o przetwarzanych danych i ich kopii.")}</div>
                <div className="p-2.5 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#0E4637] block">{cmsText("privacymodal.b0fc69a21c", "Prawo do sprostowania")}</span>{cmsText("privacymodal.0f39b3ca67", "Możliwość poprawienia nieprawidłowych lub nieaktualnych informacji.")}</div>
                <div className="p-2.5 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#0E4637] block">{cmsText("privacymodal.2043bbe872", "Prawo do usunięcia danych")}</span>{cmsText("privacymodal.b4f9f03c84", "Prawo do bycia zapomnianym po zakończeniu procesu ofertowania/realizacji.")}</div>
                <div className="p-2.5 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#0E4637] block">{cmsText("privacymodal.e6cef638f6", "Prawo do sprzeciwu")}</span>{cmsText("privacymodal.b135222e6f", "Prawo do wniesienia sprzeciwu wobec przetwarzania na podstawie art. 6 ust. 1 lit. f RODO.")}</div>
              </div>
              <p className="text-xs pt-2">{cmsText("privacymodal.9808d18842", "W celu realizacji powyższych praw prosimy o kontakt pod adresem: ")}<span className="font-mono text-[#0E4637] font-semibold">{cmsText("privacymodal.0b3ebbcf41", "rodo@delitech.pl")}</span>.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#17211C] text-base">{cmsText("privacymodal.ff92179956", "Zasady Wykorzystywania Plików Cookies")}</h3>
              <p>{cmsText("privacymodal.31200f2e80", "Nasz portal wykorzystuje niezbędne pliki cookies służące do prawidłowego działania sesji, zapamiętywania preferencji nawigacji oraz anonimowych pomiarów wydajnościowych.")}</p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#17211C]">{cmsText("privacymodal.d7b182672c", "Cookies techniczne (niezbędne):")}</span>
                  <p className="text-[#17211C]/70 mt-0.5">{cmsText("privacymodal.77956c0da5", "Umożliwiają poprawne renderowanie podstron, zapamiętanie statusu formularza oraz polityki cookies.")}</p>
                </div>
                <div className="p-3 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#17211C]">{cmsText("privacymodal.4bb55d13ce", "Brak inwazyjnego śledzenia reklamowego:")}</span>
                  <p className="text-[#17211C]/70 mt-0.5">{cmsText("privacymodal.e7e6945946", "Nie profilujemy użytkowników komercyjnie ani nie przekazujemy danych brokerom behawioralnym.")}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F8F5] border-t border-[#17211C]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0E4637] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#17211C] transition-colors"
          >{cmsText("privacymodal.7960adec02", "Zamknij")}</button>
        </div>
      </div>
    </div>
  );
};
