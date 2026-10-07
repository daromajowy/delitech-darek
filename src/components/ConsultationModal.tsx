import { cmsText, submitInquiry } from '../cms';
import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  onOpenPrivacy: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'Konsultacja projektu automatyki KNX',
  onOpenPrivacy,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    investmentType: 'biuro',
    mode: 'warszawa-biuro', // 'warszawa-biuro', 'in-situ', 'online'
    preferredTime: 'rano',
    notes: '',
    consent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');

  if (!isOpen) return null;

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
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#17211C]/15 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#17211C]/60 hover:text-[#17211C] hover:bg-black/5"
          aria-label={cmsText("consultationmodal.1aa0b9229c", "Zamknij")}
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-[#CFE3C4]/50 rounded-full flex items-center justify-center text-[#0E4637]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#17211C]">{cmsText("consultationmodal.5a5c7eaeb6", "Zgłoszenie konsultacji zostało zapisane")}</h3>
            <p className="text-sm text-[#17211C]/75 max-w-md mx-auto">{cmsText("consultationmodal.da7d042ff5", "Dziękujemy. Zgłoszenie trafiło do zespołu InteliSpaces. Skontaktujemy się, aby uzgodnić termin i sposób spotkania.")}</p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#0E4637] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#17211C]"
              >{cmsText("consultationmodal.a582bfedf2", "Zamknij okno")}</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#0E4637] bg-[#CFE3C4]/30 px-2 py-0.5 rounded">{cmsText("consultationmodal.6986c05e8c", "Bezpośredni kontakt z inżynierem KNX")}</span>
              <h2 className="text-2xl font-bold font-display text-[#17211C] mt-2">{cmsText("consultationmodal.330b3ac86e", "Umów bezpłatną konsultację")}</h2>
              <p className="text-xs text-[#17211C]/70 mt-1">{cmsText("consultationmodal.122a06ca80", "30 minut merytorycznej rozmowy: rzuty, scenariusze, standard DALI, budżet i koordynacja branżowa.")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p role="alert" className="text-red-700">{error}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17211C] mb-1">{cmsText("consultationmodal.9c53b6f7a6", "Imię i nazwisko / Firma *")}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={cmsText("consultationmodal.c1174a36a1", "np. Jan Kowalski")}
                    className="w-full px-3 py-2 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-xs focus:ring-2 focus:ring-[#0E4637] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17211C] mb-1">{cmsText("consultationmodal.7e757909f6", "Numer telefonu *")}</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+48 600 000 000"
                    className="w-full px-3 py-2 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-xs focus:ring-2 focus:ring-[#0E4637] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17211C] mb-1">{cmsText("consultationmodal.4ecd10e708", "Adres e-mail *")}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={cmsText("consultationmodal.818594c046", "kontakt@twojafirma.pl")}
                  className="w-full px-3 py-2 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-xs focus:ring-2 focus:ring-[#0E4637] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17211C] mb-1">{cmsText("consultationmodal.9dbeac0d14", "Forma spotkania")}</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-xs focus:ring-2 focus:ring-[#0E4637]"
                  >
                    <option value="warszawa-biuro">{cmsText("consultationmodal.c8e409d3eb", "Biuro Warszawa (ul. Konwaliowa 7 lok. 103)")}</option>
                    <option value="online">{cmsText("consultationmodal.5480c8df37", "Wideokonferencja online (Google Meet)")}</option>
                    <option value="in-situ">{cmsText("consultationmodal.9418479d40", "Wizyta na budowie / w lokalu")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17211C] mb-1">{cmsText("consultationmodal.1693091366", "Preferowana pora")}</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-xs focus:ring-2 focus:ring-[#0E4637]"
                  >
                    <option value="rano">{cmsText("consultationmodal.d50a95343b", "Poranek (09:00 – 12:00)")}</option>
                    <option value="poludnie">{cmsText("consultationmodal.08b212cf96", "Południe (12:00 – 15:00)")}</option>
                    <option value="popoludnie">{cmsText("consultationmodal.43ccaaf243", "Popołudnie (15:00 – 18:00)")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17211C] mb-1">{cmsText("consultationmodal.0e45f1a574", "Krótki opis tematu rozmowy")}</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={cmsText("consultationmodal.7c343c97e8", "np. Weryfikacja projektu instalacji elektrycznej pod KNX, dobór osprzętu JUNG do apartamentu...")}
                  className="w-full px-3 py-2 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-xs focus:ring-2 focus:ring-[#0E4637] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 text-[11px] text-[#17211C]/75 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded text-[#0E4637] focus:ring-[#0E4637]"
                  />
                  <span>{cmsText("consultationmodal.299cd3dad9", "Wyrażam zgodę na kontakt w celu umówienia konsultacji technicznej zgodnie z")}{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="text-[#0E4637] font-semibold underline"
                    >{cmsText("consultationmodal.ae34c1f01f", "Polityką prywatności")}</button>
                    .
                  </span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#17211C]/70 hover:text-[#17211C]"
                >{cmsText("consultationmodal.9b081f149a", "Anuluj")}</button>
                <button
                  type="submit" disabled={busy}
                  className="px-6 py-2.5 bg-[#0E4637] hover:bg-[#17211C] text-[#E6F15A] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                >{cmsText("consultationmodal.bf4669f716", "Potwierdź konsultację")}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
