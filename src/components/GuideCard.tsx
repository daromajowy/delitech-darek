import React from 'react';
import { ArrowDown, BookOpen, CheckCircle2, ExternalLink } from 'lucide-react';
import { Guide, guideReadingMinutes } from '../content/guides.ts';

export function GuideCard({ guide }: { guide: Guide }) {
  const labels = { architekci: 'Dla architektów', biura: 'Dla biur', inwestorzy: 'Dla inwestorów' };
  return <details className="guide-card rounded-2xl bg-[#F7F8F5] border border-[#17211C]/15 transition-colors group" id={`poradnik-${guide.id}`}>
    <summary className="cursor-pointer p-6 sm:p-7 rounded-2xl">
      <div className="flex items-center justify-between gap-3 text-xs text-[#53635A] mb-4">
        <span className="font-mono uppercase font-semibold text-[#0E4637]">{labels[guide.category]}</span>
        <span className="whitespace-nowrap">{guideReadingMinutes(guide)} min czytania</span>
      </div>
      <BookOpen className="w-6 h-6 text-[#0E4637] mb-4" aria-hidden="true" />
      <h3 className="text-xl font-bold font-display text-[#17211C] leading-snug">{guide.title}</h3>
      <p className="text-sm text-[#53635A] mt-3 leading-relaxed max-w-2xl">{guide.summary}</p>
      <span className="mt-6 pt-4 border-t border-[#17211C]/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0E4637]">
        <span className="guide-open">Przeczytaj poradnik</span><span className="guide-close">Zwiń poradnik</span>
        <ArrowDown className="w-4 h-4 group-open:rotate-180" aria-hidden="true" />
      </span>
    </summary>
    <div className="px-6 sm:px-7 pb-7 border-t border-[#17211C]/10">
      <div className="guide-body mx-auto py-2 text-sm">
        {guide.sections.map(section => <section key={section.title}><h4>{section.title}</h4>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}
        <div className="bg-white rounded-xl border border-[#17211C]/10 p-5 my-6">
          <h4 className="!mt-0">Do przygotowania przed rozmową</h4>
          <ul className="mt-3">{guide.checklist.map(item => <li key={item} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-1 shrink-0 text-[#0E4637]" aria-hidden="true" /><span>{item}</span></li>)}</ul>
        </div>
        <p className="!mb-2 font-semibold text-[#0E4637]">Dokumentacja i dalsza lektura</p>
        <ul>{guide.sources.map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}<ExternalLink className="inline w-3 h-3 ml-1" aria-hidden="true" /></a></li>)}</ul>
      </div>
    </div>
  </details>;
}
