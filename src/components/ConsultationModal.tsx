import React, { useEffect, useId, useRef } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone, X } from 'lucide-react';
import { cmsText } from '../cms/content.ts';
import { contactEmailHref } from './ContactForm.tsx';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  onOpenPrivacy: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialTopic,
  onOpenPrivacy,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const topic = initialTopic || cmsText('ConsultationModal-v2-default-topic', 'Rozmowa o projekcie automatyki KNX');

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;

    // A modal HTML dialog keeps keyboard focus inside and makes the page behind it inert.
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
      aria-describedby={descriptionId}
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
      className="m-auto w-[calc(100%_-_2rem)] max-w-xl max-h-[calc(100dvh_-_2rem)] overflow-y-auto overscroll-contain rounded-2xl border border-[#17211C]/15 bg-white p-0 text-[#17211C] shadow-2xl backdrop:bg-black/65 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-6 sm:p-8">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-[#17211C]/75 hover:bg-[#F7F8F5] hover:text-[#17211C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E4637]"
          aria-label={cmsText('ConsultationModal-v2-close', 'Zamknij okno kontaktu')}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <p className="pr-10 text-xs font-semibold uppercase tracking-wider text-[#0E4637]">
          {cmsText('ConsultationModal-v2-eyebrow', 'Zacznijmy od rozmowy')}
        </p>
        <h2 id={titleId} className="mt-3 pr-8 text-2xl sm:text-3xl font-bold font-display">
          {cmsText('ConsultationModal-v2-title', 'Ustalmy kolejny krok')}
        </h2>
        <p id={descriptionId} className="mt-3 text-sm leading-relaxed text-[#17211C]/75">
          {cmsText('ConsultationModal-v2-intro', 'Zadzwoń lub napisz, aby porozmawiać o projekcie albo uzgodnić spotkanie w salonie. Termin potwierdzimy bezpośrednio z Tobą.')}
        </p>
        <p className="mt-4 rounded-lg bg-[#F7F8F5] p-3 text-xs leading-relaxed text-[#0E4637] break-words">
          <span className="font-semibold">{cmsText('ConsultationModal-v2-topic-label', 'Temat: ')}</span>{topic}
        </p>

        <div className="mt-5 space-y-3">
          <a
            href="tel:+48505260715"
            className="flex items-center gap-3 rounded-xl bg-[#0E4637] p-4 text-white hover:bg-[#17211C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E4637]"
          >
            <Phone className="h-5 w-5 shrink-0 text-[#E6F15A]" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-white/80">{cmsText('ConsultationModal-v2-call', 'Zadzwoń')}</span>
              <span className="block text-lg font-semibold">{cmsText('ConsultationModal-v2-phone', '+48 505 260 715')}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
          <a
            href={contactEmailHref(topic)}
            className="flex items-center gap-3 rounded-xl border border-[#0E4637]/25 bg-[#F7F8F5] p-4 text-[#0E4637] hover:bg-[#CFE3C4]/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E4637]"
          >
            <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs">{cmsText('ConsultationModal-v2-write', 'Napisz e-mail')}</span>
              <span className="block break-all text-base sm:text-lg font-semibold">{cmsText('ConsultationModal-v2-email', 'biuro@intelispaces.pl')}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[#17211C]/65">
          {cmsText('ConsultationModal-v2-mail-explanation', 'Otworzy się Twoja aplikacja pocztowa z tematem rozmowy. Opis i załączniki dodaj w wiadomości, a następnie ją wyślij. Jeśli nie korzystasz z aplikacji, skopiuj adres do swojej poczty.')}
        </p>

        <div className="mt-6 flex items-start gap-3 border-t border-[#17211C]/10 pt-5 text-sm">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0E4637]" aria-hidden="true" />
          <div>
            <p className="font-semibold">{cmsText('ConsultationModal-v2-salon-title', 'Spotkajmy się w salonie sprzedaży')}</p>
            <p className="mt-1 text-[#17211C]/75">{cmsText('ConsultationModal-v2-salon-address', 'ul. Konwaliowa 7 lok. 103, 03-194 Warszawa')}</p>
            <p className="mt-2 text-xs leading-relaxed text-[#17211C]/65">{cmsText('ConsultationModal-v2-salon-appointment', 'Przed wizytą uzgodnijmy termin. Architekta zapraszamy także wspólnie z inwestorem.')}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenPrivacy();
          }}
          className="mt-5 rounded text-xs text-[#0E4637] underline underline-offset-4 hover:text-[#17211C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E4637]"
        >
          {cmsText('ConsultationModal-v2-privacy', 'Jak przetwarzamy dane kontaktowe')}
        </button>
      </div>
    </dialog>
  );
};
