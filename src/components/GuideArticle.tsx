import React from 'react';
import {ArrowLeft, ArrowRight, CheckCircle2, ExternalLink} from 'lucide-react';
import {Guide, guideReadingMinutes} from '../content/guides.ts';

export function GuideArticle({guide, onBack, onContact}: {guide: Guide; onBack: () => void; onContact: () => void}) {
  return <article>
    <header className="bg-[#17211C] text-white py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <a href="#knowledge" onClick={event=>{event.preventDefault();onBack();}} className="inline-flex items-center gap-2 text-sm text-[#CFE3C4] hover:underline mb-8"><ArrowLeft size={16}/>Wszystkie poradniki</a>
        <p className="text-xs font-mono uppercase tracking-widest text-[#E6F15A] mb-4">Poradnik · {guideReadingMinutes(guide)} min czytania</p>
        <h1 className="text-3xl sm:text-5xl font-display font-bold leading-tight max-w-3xl">{guide.title}</h1>
        <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#CFE3C4] max-w-3xl">{guide.summary}</p>
      </div>
    </header>
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <nav aria-label="Spis treści poradnika" className="bg-white rounded-2xl border border-[#17211C]/10 p-6 mb-10">
        <h2 className="font-bold text-lg mb-4">W tym poradniku</h2>
        <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-[#0E4637]">
          {guide.sections.map((section,index)=><li key={section.title}><button className="text-left hover:underline underline-offset-4" onClick={()=>{const target=document.getElementById(`guide-section-${index}`);target?.focus({preventScroll:true});target?.scrollIntoView({behavior:'smooth',block:'start'});}}>{section.title}</button></li>)}
        </ol>
      </nav>
      <div className="guide-body mx-auto text-base">
        {guide.sections.map((section,index)=><section key={section.title} id={`guide-section-${index}`} tabIndex={-1} className="scroll-mt-32 mb-9"><h2 className="text-xl sm:text-2xl font-bold font-display leading-snug">{section.title}</h2>{section.paragraphs.map(text=><p key={text}>{text}</p>)}</section>)}
        <section className="bg-[#E7EFDF] border border-[#0E4637]/10 rounded-2xl p-6 sm:p-8 my-10">
          <h2 className="text-xl font-bold mb-5">Przygotuj na pierwszą rozmowę</h2>
          <ul>{guide.checklist.map(item=><li key={item} className="flex gap-3"><CheckCircle2 className="w-5 h-5 shrink-0 mt-1 text-[#0E4637]"/><span>{item}</span></li>)}</ul>
        </section>
        <section className="border-t border-[#17211C]/10 pt-6">
          <h2 className="font-bold text-lg">Źródła techniczne i dalsza lektura</h2>
          <ul className="text-sm">{guide.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink className="inline ml-2 w-3 h-3"/></a></li>)}</ul>
        </section>
      </div>
      <div className="mt-10 bg-[#0E4637] text-white rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold">Przełóż pomysły na zakres instalacji</h2>
        <p className="text-[#CFE3C4] mt-3 mb-5 leading-relaxed">Przygotuj rzuty i listę najważniejszych funkcji. To dobry początek rozmowy o Twojej inwestycji.</p>
        <a href="#contact" onClick={event=>{event.preventDefault();onContact();}} className="inline-flex items-center gap-2 text-[#E6F15A] font-semibold hover:underline">Przejdź do kontaktu<ArrowRight size={18}/></a>
      </div>
    </div>
  </article>;
}
