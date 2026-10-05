import { cmsText } from '../cms/content.ts';
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
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (isOpen) setActiveTab(defaultTab);
  }, [isOpen, defaultTab]);

  React.useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
          onClose();
        }
      }}
      className="m-auto w-[calc(100%_-_2rem)] max-w-3xl max-h-[90dvh] rounded-2xl border border-[#17211C]/15 bg-white p-0 text-[#17211C] shadow-2xl overflow-hidden backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div
        className="bg-white w-full max-h-[90dvh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="shrink-0 p-4 sm:p-6 border-b border-[#17211C]/10 flex items-center justify-between bg-[#F7F8F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0E4637] text-[#E6F15A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id={titleId} className="text-lg font-bold font-display text-[#17211C]">{cmsText("PrivacyModal-e7631951a578", "Informacje Prawne i Ochrona Danych")}</h2>
              <p className="text-xs text-[#17211C]/60">{cmsText("PrivacyModal-cc127a4b9ece", "Delitech Smart Spaces · Warszawa")}</p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#17211C]/60 hover:text-[#17211C] hover:bg-black/5 transition-colors"
            aria-label={cmsText("PrivacyModal-a91ce1f50126", "Zamknij okno")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="shrink-0 flex flex-wrap border-b border-[#17211C]/10 px-3 sm:px-6 bg-[#F7F8F5]/50 gap-2">
          <button
            type="button"
            aria-pressed={activeTab === 'privacy'}
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-[#0E4637] text-[#0E4637]'
                : 'border-transparent text-[#17211C]/60 hover:text-[#17211C]'
            }`}
          >{cmsText("PrivacyModal-8808f86b8025", "Polityka Prywatności")}</button>
          <button
            type="button"
            aria-pressed={activeTab === 'rodo'}
            onClick={() => setActiveTab('rodo')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'rodo'
                ? 'border-[#0E4637] text-[#0E4637]'
                : 'border-transparent text-[#17211C]/60 hover:text-[#17211C]'
            }`}
          >{cmsText("PrivacyModal-6bbf534ed904", "Klauzula Informacyjna RODO")}</button>
          <button
            type="button"
            aria-pressed={activeTab === 'cookies'}
            onClick={() => setActiveTab('cookies')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'cookies'
                ? 'border-[#0E4637] text-[#0E4637]'
                : 'border-transparent text-[#17211C]/60 hover:text-[#17211C]'
            }`}
          >{cmsText("PrivacyModal-b346e9b2797a", "Polityka Cookies")}</button>
        </div>

        {/* Content Body */}
        <div tabIndex={0} className="min-h-0 p-6 overflow-y-auto text-sm text-[#17211C]/80 space-y-4 leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#17211C] text-base">{cmsText("PrivacyModal-ac7ef1a08b76", "1. Administrator Danych Osobowych")}</h3>
              <p>{cmsText("PrivacyModal-2f08dd03cdeb", "Administratorem danych osobowych zbieranych za pośrednictwem portalu jest Delitech Jasek spółka jawna z siedzibą przy ul. Myśliborskiej 85A/8, 03-185 Warszawa, NIP: 1132919580, e-mail: biuro@intelispaces.pl, tel: +48 505 260 715.")}</p>

              <h3 className="font-bold text-[#17211C] text-base pt-2">{cmsText("PrivacyModal-840b225dd58f", "2. Zakres i Cel Zbierania Danych")}</h3>
              <p>{cmsText("PrivacyModal-10a437d00b8e", "Przetwarzamy dane osobowe (imię, nazwisko, adres e-mail, numer telefonu, nazwa pracowni/firmy, dokumentacja rzutów architektonicznych i instalacyjnych) wyłącznie w celach:")}</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>{cmsText("PrivacyModal-9b31e16f43f2", "przygotowania analizy technicznej, audytu rzutów oraz oferty cenowo-funkcjonalnej automatyki KNX (art. 6 ust. 1 lit. b RODO),")}</li>
                <li>{cmsText("PrivacyModal-65f2ffab4030", "kontaktu telefonicznego i mailowego w sprawie przesłanego zapytania (art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes administratora),")}</li>
                <li>{cmsText("PrivacyModal-2c96f6772b56", "realizacji umów wdrożeniowych, programistycznych i serwisowych.")}</li>
              </ul>

              <h3 className="font-bold text-[#17211C] text-base pt-2">{cmsText("PrivacyModal-d9c62206d133", "3. Poufność Rzutów Architektonicznych")}</h3>
              <p className="text-xs bg-[#F7F8F5] p-3 rounded-lg border border-[#17211C]/10">{cmsText("PrivacyModal-96d5f81d82df", "Wszelkie materiały projektowe (pliki DWG, PDF, modele BIM, specyfikacje techniczne) przekazane do zespołu podlegają ścisłej tajemnicy zawodowej i nie są udostępniane podmiotom trzecim bez wyraźnej pisemnej zgody inwestora lub architekta.")}</p>
            </div>
          )}

          {activeTab === 'rodo' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#17211C] text-base">{cmsText("PrivacyModal-94efdee48af0", "Prawa Osób, Których Dane Dotyczą")}</h3>
              <p>{cmsText("PrivacyModal-c6cb96bdeb09", "Zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO), każdemu użytkownikowi przysługuje prawo do:")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#0E4637] block">{cmsText("PrivacyModal-6b0e0f043b11", "Prawo dostępu do danych")}</span>{cmsText("PrivacyModal-9b31358742d7", "Możliwość uzyskania informacji o przetwarzanych danych i ich kopii.")}</div>
                <div className="p-2.5 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#0E4637] block">{cmsText("PrivacyModal-4a81a7dc25b7", "Prawo do sprostowania")}</span>{cmsText("PrivacyModal-1bb2d35bed70", "Możliwość poprawienia nieprawidłowych lub nieaktualnych informacji.")}</div>
                <div className="p-2.5 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#0E4637] block">{cmsText("PrivacyModal-6388d7997da6", "Prawo do usunięcia danych")}</span>{cmsText("PrivacyModal-f3c3f1f4ffe4", "Prawo do bycia zapomnianym po zakończeniu procesu ofertowania/realizacji.")}</div>
                <div className="p-2.5 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#0E4637] block">{cmsText("PrivacyModal-ffca9d84219c", "Prawo do sprzeciwu")}</span>{cmsText("PrivacyModal-7780b1f8484c", "Prawo do wniesienia sprzeciwu wobec przetwarzania na podstawie art. 6 ust. 1 lit. f RODO.")}</div>
              </div>
              <p className="text-xs pt-2">{cmsText("PrivacyModal-1b253e40fe37", "W celu realizacji powyższych praw prosimy o kontakt pod adresem: ")}<span className="font-mono text-[#0E4637] font-semibold">{cmsText("PrivacyModal-82142b8e52d7", "rodo@delitech.pl")}</span>.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[#17211C] text-base">{cmsText("PrivacyModal-4a10bca78fec", "Zasady Wykorzystywania Plików Cookies")}</h3>
              <p>{cmsText("PrivacyModal-4713631384e6", "Nasz portal wykorzystuje niezbędne pliki cookies służące do prawidłowego działania sesji, zapamiętywania preferencji nawigacji oraz anonimowych pomiarów wydajnościowych.")}</p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#17211C]">{cmsText("PrivacyModal-8a9308c71944", "Cookies techniczne (niezbędne):")}</span>
                  <p className="text-[#17211C]/70 mt-0.5">{cmsText("PrivacyModal-d6dfa591a2b6", "Umożliwiają poprawne renderowanie podstron, zapamiętanie statusu formularza oraz polityki cookies.")}</p>
                </div>
                <div className="p-3 bg-[#F7F8F5] rounded-lg border border-[#17211C]/10">
                  <span className="font-semibold text-[#17211C]">{cmsText("PrivacyModal-45033d58fc47", "Brak inwazyjnego śledzenia reklamowego:")}</span>
                  <p className="text-[#17211C]/70 mt-0.5">{cmsText("PrivacyModal-4e946688adad", "Nie profilujemy użytkowników komercyjnie ani nie przekazujemy danych brokerom behawioralnym.")}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 bg-[#F7F8F5] border-t border-[#17211C]/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#0E4637] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#17211C] transition-colors"
          >{cmsText("PrivacyModal-00b8d851752c", "Zamknij")}</button>
        </div>
      </div>
    </dialog>
  );
};
