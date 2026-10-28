import { submitInquiry } from '../site';
import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  variant?: 'knx' | 'proav' | 'architects';
  onOpenPrivacy: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'Konsultacja projektu automatyki KNX',
  variant = 'knx',
  onOpenPrivacy,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    investmentType: 'dom',
    mode: 'warszawa-biuro', // 'warszawa-biuro', 'in-situ', 'online'
    preferredTime: 'rano',
    notes: '',
    consent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setError('');
      setFormData(data => ({ ...data, investmentType: variant === 'proav' ? 'sala-spotkan' : variant === 'architects' ? 'projekt-pracowni' : 'dom' }));
    }
  }, [isOpen, variant]);

  if (!isOpen) return null;

  const isPresentation = variant === 'architects' && initialTopic === 'Prezentacja konfiguratora KNX dla pracowni';
  const introLabel = variant === 'proav' ? 'ProAV · wyposażenie sal spotkań' : variant === 'architects' ? 'Dla architektów i projektantów' : 'Bezpośredni kontakt z inżynierem KNX';
  const introTitle = variant === 'proav' ? 'Porozmawiajmy o Twojej sali' : isPresentation ? 'Umów prezentację konfiguratora' : variant === 'architects' ? 'Porozmawiajmy o Twoim projekcie' : 'Porozmawiajmy o Twoim domu';
  const introText = variant === 'proav'
    ? 'Omówimy wielkość sali, sposób prowadzenia spotkań, obecny sprzęt i budżet. Ustalimy zakres wspólnie z Twoim IT i architektem.'
    : isPresentation
      ? 'Zostaw kontakt do swojej pracowni. Odezwiemy się, aby uzgodnić dogodny termin i pokazać narzędzie podczas krótkiej prezentacji.'
      : variant === 'architects'
        ? 'Opowiedz, nad czym pracujesz i na jakim etapie jest projekt. Uzgodnimy zakres wsparcia oraz termin rozmowy.'
        : 'Opisz etap inwestycji i potrzebne funkcje. Skontaktujemy się, aby ustalić zakres rozmowy oraz dogodny termin.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.consent) return;
    setBusy(true); setError('');
    try { await submitInquiry({...formData,kind:'consultation',topic:initialTopic}); setSubmitted(true); }
    catch(e) { setError(e instanceof Error ? e.message : 'Nie udało się zapisać zgłoszenia.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-ink/15 relative max-h-[calc(100dvh-2rem)] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-ink/75 hover:text-ink hover:bg-black/5"
          aria-label={"Zamknij"}
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-silver/50 rounded-full flex items-center justify-center text-ink">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 id="consultation-title" className="text-xl font-bold font-display text-ink">{"Zgłoszenie konsultacji zostało zapisane"}</h3>
            <p className="text-sm text-ink/75 max-w-md mx-auto">{"Dziękujemy. Zgłoszenie trafiło do zespołu InteliSpaces. Skontaktujemy się, aby uzgodnić termin i sposób spotkania."}</p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-ink text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-ink-hover"
              >{"Zamknij okno"}</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-ink bg-silver/30 px-2 py-0.5 rounded">{introLabel}</span>
              <h2 id="consultation-title" className="text-2xl font-bold font-display text-ink mt-2 pr-5">{introTitle}</h2>
              <p className="text-xs text-ink/70 mt-1">{introText}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p role="alert" className="text-red-700">{error}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="consultation-name" className="block text-xs font-semibold text-ink mb-1">{"Imię i nazwisko / Firma *"}</label>
                  <input id="consultation-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={"np. Jan Kowalski"}
                    className="w-full px-3 py-2 bg-surface border border-ink/15 rounded-lg text-xs focus:ring-2 focus:ring-ink focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="consultation-phone" className="block text-xs font-semibold text-ink mb-1">{"Numer telefonu *"}</label>
                  <input id="consultation-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+48 600 000 000"
                    className="w-full px-3 py-2 bg-surface border border-ink/15 rounded-lg text-xs focus:ring-2 focus:ring-ink focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="consultation-email" className="block text-xs font-semibold text-ink mb-1">{"Adres e-mail *"}</label>
                <input id="consultation-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={"kontakt@twojafirma.pl"}
                  className="w-full px-3 py-2 bg-surface border border-ink/15 rounded-lg text-xs focus:ring-2 focus:ring-ink focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="consultation-investment" className="block text-xs font-semibold text-ink mb-1">Czego dotyczy projekt?</label>
                <select id="consultation-investment" value={formData.investmentType}
                  onChange={e => setFormData({ ...formData, investmentType: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-ink/15 rounded-lg text-xs focus:ring-2 focus:ring-ink">
                  <option value="dom">Dom jednorodzinny</option>
                  <option value="apartament">Apartament / mieszkanie</option>
                  <option value="projekt-pracowni">Projekt dla klienta pracowni</option>
                  <option value="sala-spotkan">Sala spotkań / ProAV</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="consultation-mode" className="block text-xs font-semibold text-ink mb-1">{"Forma spotkania"}</label>
                  <select id="consultation-mode"
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-ink/15 rounded-lg text-xs focus:ring-2 focus:ring-ink"
                  >
                    <option value="warszawa-biuro">{"Biuro Warszawa (ul. Konwaliowa 7 lok. 103)"}</option>
                    <option value="online">{"Wideokonferencja online (Google Meet)"}</option>
                    <option value="in-situ">{"Wizyta na budowie / w lokalu"}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="consultation-preferredTime" className="block text-xs font-semibold text-ink mb-1">{"Preferowana pora"}</label>
                  <select id="consultation-preferredTime"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-ink/15 rounded-lg text-xs focus:ring-2 focus:ring-ink"
                  >
                    <option value="rano">{"Poranek (09:00 – 12:00)"}</option>
                    <option value="poludnie">{"Południe (12:00 – 15:00)"}</option>
                    <option value="popoludnie">{"Popołudnie (15:00 – 18:00)"}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="consultation-notes" className="block text-xs font-semibold text-ink mb-1">{"Krótki opis tematu rozmowy"}</label>
                <textarea id="consultation-notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={variant === 'proav' ? 'np. Sala dla 8 osób, Microsoft Teams, obecny monitor, potrzebne wideobar i przyłącza w stole…' : 'np. Weryfikacja projektu instalacji elektrycznej pod KNX, dobór osprzętu JUNG do apartamentu...'}
                  className="w-full px-3 py-2 bg-surface border border-ink/15 rounded-lg text-xs focus:ring-2 focus:ring-ink focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 text-[11px] text-ink/75 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded text-ink focus:ring-ink"
                  />
                  <span>{"Wyrażam zgodę na kontakt w celu umówienia konsultacji technicznej zgodnie z"}{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="text-ink font-semibold underline"
                    >{"Polityką prywatności"}</button>
                    .
                  </span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-ink/70 hover:text-ink"
                >{"Anuluj"}</button>
                <button
                  type="submit" disabled={busy}
                  className="px-6 py-2.5 bg-ink hover:bg-ink-hover text-accent text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                >{busy ? 'Wysyłanie…' : 'Poproś o kontakt'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
