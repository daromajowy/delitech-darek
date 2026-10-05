import { useCmsContent, cmsText } from '../cms/content.ts';
import React, { useState } from 'react';
import { GuideCard } from '../components/GuideCard.tsx';
import { GuideArticle } from '../components/GuideArticle.tsx';
import { guides } from '../content/guides.ts';
import { PageId } from '../types.ts';
import { ChevronDown, Search, BookOpen, HelpCircle, FileText, ArrowRight } from 'lucide-react';

interface KnowledgePageProps {
  initialHash?: string;
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}

export const KnowledgePage: React.FC<KnowledgePageProps> = ({
  initialHash,
  onNavigate,
  onOpenConsultation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [articleCategory, setArticleCategory] = useState<'wszystkie' | 'inwestorzy' | 'architekci' | 'biura'>('wszystkie');

  const faqs = [
    {
      q: cmsText("KnowledgePage-2ed80de4d020", "Na jakim etapie inwestycji należy rozpocząć projektowanie automatyki KNX?"),
      a: cmsText("KnowledgePage-1d936f0989d8", "Najlepiej rozpocząć w fazie koncepcji lub projektu wykonawczego, przed układaniem przewodów. W instalacji KNX TP trzeba zaplanować magistralę, zasilanie, lokalizację urządzeń i rozdzielnic. Sposób prowadzenia obwodów zależy od projektu; dostępne są także rozwiązania radiowe KNX RF. Wczesna koordynacja ogranicza późniejsze przeróbki."),
    },
    {
      q: cmsText("KnowledgePage-20b8c6b0073d", "Czym różni się standard KNX od popularnych bezprzewodowych systemów smart home?"),
      a: cmsText("KnowledgePage-8777d1ba96bc", "KNX jest otwartym standardem automatyki obejmującym m.in. komunikację przewodową TP, radiową RF i rozwiązania IP. Podstawowe funkcje można zaprojektować do pracy lokalnej, bez chmury. Rodzaj zasilania, zgodność urządzeń oraz wymagania zdalnego dostępu zależą od wybranego rozwiązania."),
    },
    {
      q: cmsText("KnowledgePage-cf6eafbaaf9b", "Dlaczego warto łączyć oświetlenie DALI z automatyką KNX?"),
      a: cmsText("KnowledgePage-d778bb55f177", "Bramka KNX–DALI pozwala włączyć sterowanie oświetleniem do scen i funkcji budynku. DALI umożliwia adresowanie urządzeń, grupowanie i diagnostykę w zakresie obsługiwanym przez konkretny sprzęt. Poziom ściemniania i jakość światła zależą od opraw i zasilaczy. Tunable White wymaga zgodnych urządzeń; samo oznaczenie DALI tego nie gwarantuje."),
    },
    {
      q: cmsText("KnowledgePage-a303b1e9b8da", "Czy instalacja KNX może być modyfikowana i rozbudowywana po zamieszkaniu lub odbiorze biura?"),
      a: cmsText("KnowledgePage-617cadc796b0", "Wiele funkcji przycisków i scen można zmienić programowo w ETS, bez ingerencji w ściany. Zakres i czas prac zależą od urządzeń, dokumentacji oraz dostępu do projektu. Rozbudowa o nowe obwody może wymagać dodatkowego okablowania i miejsca w rozdzielnicy — warto przewidzieć rezerwę na etapie projektu."),
    },
    {
      q: cmsText("KnowledgePage-b24d7c8b4908", "Jak wygląda koordynacja z branżą sanitarną / HVAC (klimatyzacja, pompy ciepła, rekuperacja)?"),
      a: cmsText("KnowledgePage-d17448ed54dc", "Uzgadniamy z dostawcami urządzeń dostępne interfejsy i funkcje sterowania. Zależnie od sprzętu integracja może korzystać z KNX, Modbus, BACnet lub dedykowanej bramki. Logikę ogrzewania, chłodzenia i wentylacji trzeba skoordynować, a następnie sprawdzić podczas uruchomienia."),
    },
    {
      q: cmsText("KnowledgePage-9e600be4e04d", "Czy Delitech Smart Spaces wykonuje również montaż fizyczny i prefabrykację szaf?"),
      a: cmsText("KnowledgePage-0f0da27ef15f", "Zakres ustalamy w ofercie: może obejmować projekt, prefabrykację rozdzielnic, dostawę osprzętu, montaż, programowanie i uruchomienie. Przy odbiorze warto uzgodnić przekazanie dokumentacji powykonawczej oraz pliku projektu ETS. Licencja programu ETS jest odrębną kwestią od przekazania pliku projektu."),
    },
  ];

  const cms = useCmsContent();
  const articles: typeof guides = cms.loaded ? cms.guides : guides;

  const filteredArticles =
    articleCategory === 'wszystkie'
      ? articles
      : articles.filter((a) => a.category === articleCategory);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedGuide = articles.find(guide => guide.id === initialHash);
  if (selectedGuide) return <GuideArticle guide={selectedGuide} onBack={() => onNavigate('knowledge')} onContact={() => onNavigate('contact')} />;

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-[#17211C] text-white py-12 lg:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6F15A] font-semibold block">{cmsText("KnowledgePage-3a6877b2e085", "Baza Wiedzy Inżynierskiej")}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">{cmsText("KnowledgePage-ec90638e5bbb", "Wiedza, poradniki i standardy KNX")}</h1>
            <p className="text-base sm:text-lg text-[#EDE9DF]/80 leading-relaxed pt-2">{cmsText("KnowledgePage-e28e82981182", "Dzielimy się wiedzą techniczną. Znajdziesz tu merytoryczne poradniki dla inwestorów, wytyczne dla pracowni architektonicznych oraz odpowiedzi na najczęstsze pytania dotyczące automatyki budynkowej.")}</p>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-12 sm:py-16 bg-white border-b border-[#17211C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText("KnowledgePage-f3165c191a8f", "Artykuły i Poradniki")}</span>
              <h2 className="text-3xl font-bold font-display text-[#17211C]">{cmsText("KnowledgePage-73f8645cf04e", "Praktyka inżynierska i projektowa")}</h2>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setArticleCategory('wszystkie')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  articleCategory === 'wszystkie'
                    ? 'bg-[#0E4637] text-white'
                    : 'bg-[#F7F8F5] text-[#17211C]/70 hover:bg-black/5'
                }`}
              >{cmsText("KnowledgePage-11366eeda268", "Wszystkie")}</button>
              <button
                onClick={() => setArticleCategory('architekci')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  articleCategory === 'architekci'
                    ? 'bg-[#0E4637] text-white'
                    : 'bg-[#F7F8F5] text-[#17211C]/70 hover:bg-black/5'
                }`}
              >{cmsText("KnowledgePage-0e9fc3336fac", "Dla architektów")}</button>
              <button
                onClick={() => setArticleCategory('biura')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  articleCategory === 'biura'
                    ? 'bg-[#0E4637] text-white'
                    : 'bg-[#F7F8F5] text-[#17211C]/70 hover:bg-black/5'
                }`}
              >{cmsText("KnowledgePage-26fce2603d13", "Dla biur & fit-out")}</button>
              <button
                onClick={() => setArticleCategory('inwestorzy')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  articleCategory === 'inwestorzy'
                    ? 'bg-[#0E4637] text-white'
                    : 'bg-[#F7F8F5] text-[#17211C]/70 hover:bg-black/5'
                }`}
              >{cmsText("KnowledgePage-9e214d1f6db4", "Dla inwestorów")}</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {filteredArticles.map(guide => <GuideCard key={guide.id} guide={guide} />)}
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion and Search */}
      <section className="py-12 sm:py-16 bg-[#F7F8F5] border-b border-[#17211C]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText("KnowledgePage-171afa2b2a68", "Odpowiedzi inżynierskie")}</span>
            <h2 className="text-3xl font-bold font-display text-[#17211C]">{cmsText("KnowledgePage-566e5cacfbb6", "Najczęściej zadawane pytania (FAQ)")}</h2>
            <p className="text-sm text-[#17211C]/70 mt-2">{cmsText("KnowledgePage-03f1e7f145b3", "Praktyczne odpowiedzi dotyczące kosztów, procesu, standardu DALI i odbiorów.")}</p>

            {/* Search Input */}
            <div className="mt-6 max-w-md mx-auto relative">
              <Search className="w-4 h-4 text-[#17211C]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={cmsText("KnowledgePage-a8f37e9d756b", "Szukaj w pytaniach i odpowiedziach")}
                placeholder={cmsText("KnowledgePage-c8c021ff1161", "Szukaj pytania (np. DALI, koszt, etapy, HVAC)...")}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#17211C]/15 rounded-lg text-xs text-[#17211C] focus:outline-none focus:ring-2 focus:ring-[#0E4637]"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#17211C]/10 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-sm text-[#17211C] leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#0E4637] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs text-[#17211C]/80 leading-relaxed border-t border-black/5 mt-1 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center bg-white p-6 rounded-2xl border border-[#17211C]/10 space-y-2">
            <h3 className="font-bold text-sm text-[#17211C]">{cmsText("KnowledgePage-4e37a90ffb07", "Masz inne pytanie techniczne?")}</h3>
            <p className="text-xs text-[#17211C]/70">{cmsText("KnowledgePage-9748b3db2fbd", "Opisz obiekt, etap prac i zagadnienie, które chcesz omówić. Pozwoli to przygotować rzeczową rozmowę o projekcie.")}</p>
            <div className="pt-2">
              <button
                onClick={onOpenConsultation}
                className="px-5 py-2.5 bg-[#0E4637] text-[#E6F15A] text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#17211C] transition-colors"
              >{cmsText("KnowledgePage-7643e6ddfba0", "Zapytaj inżyniera KNX")}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
