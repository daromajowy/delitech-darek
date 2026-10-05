import React from 'react';
import { ArrowUpRight, FileText, Mail, Phone } from 'lucide-react';
import { cmsText } from '../cms/content.ts';
import type { InquiryFormData } from '../types.ts';

interface ContactFormProps {
  onOpenPrivacy: () => void;
  defaultType?: InquiryFormData['investmentType'];
  className?: string;
  sourceContext?: string;
}

export function contactEmailHref(topic: string): string {
  const subject = Array.from(topic.replace(/[\r\n]+/g, ' ').trim()).slice(0, 200).join('');
  return `mailto:biuro@intelispaces.pl?subject=${encodeURIComponent(subject)}`;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onOpenPrivacy,
  defaultType = 'inne',
  className = '',
  sourceContext,
}) => {
  const topics: Record<InquiryFormData['investmentType'], string> = {
    biuro: cmsText('ContactForm-v2-topic-office', 'Automatyka biura — rozmowa o projekcie'),
    dom: cmsText('ContactForm-v2-topic-home', 'Automatyka domu — rozmowa o projekcie'),
    apartament: cmsText('ContactForm-v2-topic-apartment', 'Automatyka apartamentu — rozmowa o projekcie'),
    komercyjny: cmsText('ContactForm-v2-topic-commercial', 'Automatyka obiektu — rozmowa o projekcie'),
    inne: cmsText('ContactForm-v2-topic-general', 'Delitech — rozmowa o projekcie'),
  };

  return (
    <div className={`bg-white border border-[#17211C]/10 rounded-2xl p-6 sm:p-8 shadow-sm ${className}`}>
      {sourceContext && (
        <p className="mb-3 text-xs font-medium text-[#0E4637] break-words">{sourceContext}</p>
      )}
      <h3 className="font-display text-2xl font-bold text-[#17211C]">
        {cmsText('ContactForm-v2-title', 'Porozmawiajmy o Twoim projekcie')}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[#17211C]/75">
        {cmsText('ContactForm-v2-intro', 'Masz rzuty, pierwsze pomysły albo pytania? Zadzwoń lub napisz. Wspólnie ustalimy, od czego zacząć.')}
      </p>

      <div className="mt-6 space-y-3">
        <a
          href="tel:+48505260715"
          className="flex items-center gap-3 rounded-xl bg-[#0E4637] p-4 text-white hover:bg-[#17211C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E4637]"
        >
          <Phone className="h-5 w-5 shrink-0 text-[#E6F15A]" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-white/80">{cmsText('ContactForm-v2-call-label', 'Zadzwoń')}</span>
            <span className="block text-lg font-semibold">{cmsText('ContactForm-v2-phone', '+48 505 260 715')}</span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
        <a
          href={contactEmailHref(sourceContext || topics[defaultType])}
          className="flex items-center gap-3 rounded-xl border border-[#0E4637]/25 bg-[#F7F8F5] p-4 text-[#0E4637] hover:bg-[#CFE3C4]/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E4637]"
        >
          <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs">{cmsText('ContactForm-v2-email-label', 'Napisz e-mail')}</span>
            <span className="block break-all text-base sm:text-lg font-semibold">{cmsText('ContactForm-v2-email', 'biuro@intelispaces.pl')}</span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[#17211C]/65">
        {cmsText('ContactForm-v2-mail-explanation', 'Link otwiera Twoją aplikację pocztową. Treść i załączniki dodajesz w niej, a wiadomość wysyłasz samodzielnie. Możesz też skopiować adres do swojej poczty.')}
      </p>

      <div className="mt-6 border-t border-[#17211C]/10 pt-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#17211C]">
          <FileText className="h-4 w-4 text-[#0E4637]" aria-hidden="true" />
          {cmsText('ContactForm-v2-prepare-title', 'Co warto dołączyć do wiadomości?')}
        </div>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#17211C]/75 marker:text-[#0E4637]">
          <li>{cmsText('ContactForm-v2-prepare-location', 'Rodzaj obiektu, lokalizację i etap projektu.')}</li>
          <li>{cmsText('ContactForm-v2-prepare-needs', 'Krótki opis tego, czym chcesz sterować.')}</li>
          <li>{cmsText('ContactForm-v2-prepare-plan', 'Rzut lub szkic, jeśli już go masz. Na początek nie potrzebujesz pełnej dokumentacji.')}</li>
        </ul>
      </div>
      <button
        type="button"
        onClick={onOpenPrivacy}
        className="mt-5 rounded text-xs text-[#0E4637] underline underline-offset-4 hover:text-[#17211C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E4637]"
      >
        {cmsText('ContactForm-v2-privacy', 'Jak przetwarzamy dane kontaktowe')}
      </button>
    </div>
  );
};
