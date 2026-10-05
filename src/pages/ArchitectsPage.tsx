import { cmsText } from '../cms/content.ts';
import React, { useEffect } from 'react';
import { PageId } from '../types.ts';
import { IMAGES } from '../assets.ts';
import { ArrowRight, CheckCircle2, Compass, FileText, Layers, Mail, MapPin, Phone, Sliders } from 'lucide-react';

interface ArchitectsPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
  onOpenPrivacy: () => void;
}

const packageHref = `${import.meta.env.BASE_URL}materialy/pakiet-architekta.html`;

export const ArchitectsPage: React.FC<ArchitectsPageProps> = ({ onOpenConsultation }) => {
  useEffect(() => {
    let frame = 0;
    const scrollToSection = () => {
      const [page, section] = window.location.hash.slice(1).split('/');
      if (page !== 'architects' || !section) return;
      const anchors: Record<string, string> = {
        pakiet: 'arch-pakiet', wsparcie: 'arch-karta', wytyczne: 'arch-wytyczne',
        jung: 'arch-jung', konsultacja: 'arch-kontakt',
        'arch-pakiet': 'arch-pakiet', 'arch-karta': 'arch-karta', 'arch-kontakt': 'arch-kontakt',
      };
      const anchor = anchors[section];
      if (!anchor) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'auto' }));
    };
    scrollToSection();
    window.addEventListener('hashchange', scrollToSection);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', scrollToSection); };
  }, []);

  return (
    <div className="space-y-0">
      <section className="bg-[#17211C] text-white py-12 lg:py-16 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark-subtle opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6F15A] font-semibold block">{cmsText('ArchitectsPage-v2-eyebrow', 'Dla architektów i projektantów wnętrz')}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">{cmsText('ArchitectsPage-v2-title', 'Projektujesz wnętrze. My pomagamy zaplanować, jak będzie działać.')}</h1>
            <p className="text-base sm:text-lg text-[#EDE9DF]/80 leading-relaxed max-w-3xl">{cmsText('ArchitectsPage-v2-intro', 'Zaczynamy od rzutu, codziennych sytuacji i detalu na ścianie. Wspólnie porządkujemy sposób sterowania światłem, osłonami i temperaturą, zanim decyzje trafią na budowę.')}</p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button onClick={onOpenConsultation} className="px-6 py-3 bg-[#E6F15A] hover:bg-white text-[#0E4637] font-bold text-sm rounded-lg transition-colors flex items-center gap-2">{cmsText('ArchitectsPage-v2-main-cta', 'Omów projekt')}<ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
              <button onClick={() => document.getElementById('arch-pakiet')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-medium text-sm rounded-lg transition-colors border border-white/20">{cmsText('ArchitectsPage-v2-package-cta', 'Zobacz pakiet architekta')}</button>
            </div>
          </div>
          <aside className="lg:col-span-4 rounded-2xl border border-white/20 bg-white/5 p-6">
            <FileText className="w-7 h-7 text-[#E6F15A] mb-4" aria-hidden="true" />
            <h2 className="text-xl font-display font-bold">{cmsText('ArchitectsPage-v2-hero-card-title', 'Zacznij od jednego pomieszczenia')}</h2>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">{cmsText('ArchitectsPage-v2-hero-card-text', 'Przygotowaliśmy przykładową kartę salonu i listę decyzji do wspólnego ustalenia. Otworzysz je bez zakładania konta.')}</p>
            <a href={packageHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#E6F15A] underline underline-offset-4">{cmsText('ArchitectsPage-v2-hero-card-link', 'Otwórz materiał do druku')}<ArrowRight className="w-4 h-4" aria-hidden="true" /></a>
          </aside>
        </div>
      </section>

      <section id="arch-pakiet" className="py-12 sm:py-16 bg-white border-b border-[#17211C]/10 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText('ArchitectsPage-v2-package-eyebrow', 'Materiał do wspólnej pracy')}</span>
            <h2 className="text-3xl font-bold font-display text-[#17211C]">{cmsText('ArchitectsPage-v2-package-title', 'Pakiet architekta. Konkret na początek rozmowy.')}</h2>
            <p className="text-base text-[#17211C]/75 mt-3 leading-relaxed">{cmsText('ArchitectsPage-v2-package-intro', 'Cztery części, które pomagają nazwać potrzeby i zapisać uzgodnienia. To wzór roboczy; dokumentację i zakres współpracy dobieramy osobno do inwestycji.')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Compass, title: cmsText('ArchitectsPage-v2-pack-brief-title', '01. Brief inwestycji'), text: cmsText('ArchitectsPage-v2-pack-brief-text', 'Etap prac, domownicy, priorytety i decyzje, których jeszcze brakuje.') },
              { icon: Sliders, title: cmsText('ArchitectsPage-v2-pack-room-title', '02. Karta pomieszczenia'), text: cmsText('ArchitectsPage-v2-pack-room-text', 'Przykład salonu: cztery sceny, punkty sterowania i pytania do inwestora.') },
              { icon: Layers, title: cmsText('ArchitectsPage-v2-pack-coordination-title', '03. Przed instalacją'), text: cmsText('ArchitectsPage-v2-pack-coordination-text', 'Lista uzgodnień dotyczących światła, osłon, temperatury i przycisków.') },
              { icon: FileText, title: cmsText('ArchitectsPage-v2-pack-handover-title', '04. Przy przekazaniu'), text: cmsText('ArchitectsPage-v2-pack-handover-text', 'Pytania o testy, dokumentację, konfigurację, dostępy i późniejszy serwis.') },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10 p-5"><Icon className="w-6 h-6 text-[#0E4637] mb-4" aria-hidden="true" /><h3 className="font-bold text-[#17211C]">{title}</h3><p className="text-sm text-[#17211C]/75 mt-2 leading-relaxed">{text}</p></div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={packageHref} target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-[#0E4637] hover:bg-[#17211C] text-white font-semibold text-sm rounded-lg transition-colors">{cmsText('ArchitectsPage-v2-pack-open', 'Otwórz pakiet i wydrukuj')}</a>
            <a href={packageHref} download="Delitech-pakiet-architekta.html" className="px-5 py-3 border border-[#0E4637]/25 hover:bg-[#F7F8F5] text-[#0E4637] font-semibold text-sm rounded-lg transition-colors">{cmsText('ArchitectsPage-v2-pack-download', 'Pobierz plik HTML')}</a>
          </div>
          <p className="text-xs text-[#53635A] mt-3">{cmsText('ArchitectsPage-v2-pack-format', 'Wersja do druku lub zapisania jako PDF z przeglądarki. Przykład koncepcyjny, nie projekt wykonawczy.')}</p>
        </div>
      </section>

      <section id="arch-karta" className="py-12 sm:py-16 bg-[#F7F8F5] border-b border-[#17211C]/10 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText('ArchitectsPage-v2-room-eyebrow', 'Zajrzyj do pakietu')}</span>
            <h2 className="text-3xl font-bold font-display text-[#17211C]">{cmsText('ArchitectsPage-v2-room-title', 'Jedno pomieszczenie. Cztery zwykłe sytuacje.')}</h2>
            <p className="text-sm text-[#17211C]/75 mt-4 leading-relaxed">{cmsText('ArchitectsPage-v2-room-intro', 'Salon z jadalnią. Zamiast wybierać urządzenia w ciemno, najpierw zapisujemy, co ma się wydarzyć. Poziomy światła i zachowanie osłon ustalamy z użytkownikiem.')}</p>
            <p className="mt-4 rounded-lg border border-[#0E4637]/15 bg-white p-4 text-xs text-[#53635A] leading-relaxed">{cmsText('ArchitectsPage-v2-room-note', 'To ilustracja sposobu planowania, nie opis wykonanej realizacji ani gotowe ustawienia do skopiowania do instalacji.')}</p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
            {[
              { number: '01', title: cmsText('ArchitectsPage-v2-scene-dinner-title', 'Kolacja'), action: cmsText('ArchitectsPage-v2-scene-dinner-action', 'Światło nad stołem i delikatne tło. Reszta strefy wyciszona.'), question: cmsText('ArchitectsPage-v2-scene-dinner-question', 'Do ustalenia: które oprawy można ściemniać i skąd wywołać scenę?') },
              { number: '02', title: cmsText('ArchitectsPage-v2-scene-film-title', 'Film'), action: cmsText('ArchitectsPage-v2-scene-film-action', 'Mniej światła przy ekranie, subtelne światło orientacyjne.'), question: cmsText('ArchitectsPage-v2-scene-film-question', 'Do ustalenia: czy scena ma obejmować osłony okien i sprzęt AV?') },
              { number: '03', title: cmsText('ArchitectsPage-v2-scene-clean-title', 'Sprzątanie'), action: cmsText('ArchitectsPage-v2-scene-clean-action', 'Jasne oświetlenie wszystkich potrzebnych stref.'), question: cmsText('ArchitectsPage-v2-scene-clean-question', 'Do ustalenia: wygodne wywołanie i powrót do poprzedniej sceny.') },
              { number: '04', title: cmsText('ArchitectsPage-v2-scene-leave-title', 'Wyjście'), action: cmsText('ArchitectsPage-v2-scene-leave-action', 'Wyłączenie wskazanych świateł jednym poleceniem.'), question: cmsText('ArchitectsPage-v2-scene-leave-question', 'Do ustalenia: wyjątki, potwierdzenie i zachowanie pozostałych systemów.') },
            ].map(({ number, title, action, question }) => (
              <article key={number} className="bg-white rounded-2xl border border-[#17211C]/10 p-5"><div className="flex items-center gap-3 mb-3"><span className="font-mono text-xs text-[#0E4637] bg-[#E6F15A]/70 px-2 py-1 rounded">{number}</span><h3 className="font-bold text-lg text-[#17211C]">{title}</h3></div><p className="text-sm text-[#17211C]/80 leading-relaxed">{action}</p><p className="text-xs text-[#53635A] mt-3 pt-3 border-t border-[#17211C]/10 leading-relaxed">{question}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section id="arch-wytyczne" className="py-12 sm:py-16 bg-white border-b border-[#17211C]/10 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8"><h2 className="text-3xl font-bold font-display text-[#17211C]">{cmsText('ArchitectsPage-v2-roles-title', 'Dobry detal potrzebuje dobrych uzgodnień.')}</h2><p className="text-base text-[#17211C]/75 mt-3 leading-relaxed">{cmsText('ArchitectsPage-v2-roles-intro', 'Na początku ustalamy, kto projektuje, kto wykonuje i kto zatwierdza. Poniższy podział porządkuje rozmowę; ostateczne obowiązki zapisujemy w zakresie współpracy.')}</p></div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: cmsText('ArchitectsPage-v2-role-architect', 'Architekt + inwestor'), text: cmsText('ArchitectsPage-v2-role-architect-text', 'Układ wnętrza, sposób korzystania z pomieszczeń, materiały i akceptacja scenariuszy. Przyciski mają pasować do projektu i być zrozumiałe dla domowników.') },
              { title: cmsText('ArchitectsPage-v2-role-integrator', 'Integrator automatyki'), text: cmsText('ArchitectsPage-v2-role-integrator-text', 'Logika działania, dobór rozwiązań sterowania oraz uzgodnienie punktów styku z oświetleniem, osłonami i instalacjami. Zakres projektu, programowania i wsparcia wymaga ustalenia.') },
              { title: cmsText('ArchitectsPage-v2-role-trades', 'Projektanci i wykonawcy branżowi'), text: cmsText('ArchitectsPage-v2-role-trades-text', 'Projekty, dobór i wykonanie instalacji w swoim zakresie oraz potwierdzenie zgodności urządzeń z uzgodnionym sterowaniem. Odbiory i pomiary wymagają właściwych kompetencji.') },
            ].map(({ title, text }) => (<article key={title} className="p-6 rounded-2xl border border-[#17211C]/10 bg-[#F7F8F5]"><CheckCircle2 className="w-5 h-5 text-[#0E4637] mb-3" aria-hidden="true" /><h3 className="font-bold text-lg text-[#17211C]">{title}</h3><p className="mt-3 text-sm text-[#17211C]/75 leading-relaxed">{text}</p></article>))}
          </div>
          <div className="mt-6 p-5 rounded-xl bg-[#E6F15A]/20 border border-[#0E4637]/10"><h3 className="font-bold text-[#0E4637]">{cmsText('ArchitectsPage-v2-wall-title', 'Zanim zatwierdzisz punkty na ścianie')}</h3><p className="text-sm text-[#17211C]/80 leading-relaxed mt-2">{cmsText('ArchitectsPage-v2-wall-text', 'Uzgodnij funkcję każdego przycisku, czytelne oznaczenia, wysokości, otwieranie drzwi, zabudowy i technologię montażu. Liczba klawiszy powinna wynikać z użytecznych funkcji, a nie z liczby obwodów.')}</p></div>
        </div>
      </section>

      <section id="arch-jung" className="py-12 sm:py-16 bg-[#F7F8F5] border-b border-[#17211C]/10 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <figure><div className="rounded-2xl overflow-hidden border border-[#17211C]/15 aspect-[4/3] bg-[#17211C]"><img loading="lazy" decoding="async" src={IMAGES.jungLsZero} alt={cmsText('ArchitectsPage-v2-jung-alt', 'JUNG LS ZERO — osprzęt zlicowany z powierzchnią ściany. Fotografia JUNG.')} className="w-full h-full object-cover" referrerPolicy="no-referrer" /></div><figcaption className="text-xs text-[#53635A] mt-3">{cmsText('ArchitectsPage-v2-jung-credit', 'Fotografia: JUNG · ')}<a href="https://www.jung-group.com/en-UK/Products/Switch-Ranges/LS-ZERO/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{cmsText('ArchitectsPage-v2-jung-source', 'Zobacz kolekcję LS ZERO')}</a></figcaption></figure>
          <div className="space-y-5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold">{cmsText('ArchitectsPage-v2-detail-eyebrow', 'Funkcja spotyka materiał')}</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#17211C]">{cmsText('ArchitectsPage-v2-detail-title', 'Przycisk jest częścią wnętrza.')}</h2>
            <p className="text-base text-[#17211C]/80 leading-relaxed">{cmsText('ArchitectsPage-v2-detail-text', 'Dobór osprzętu to forma, wykończenie i sposób obsługi. Porozmawiajmy o JUNG LS 990 i LS ZERO w kontekście konkretnej ściany, materiału i funkcji pomieszczenia. Możliwości zależą od wybranego modelu.')}</p>
            <p className="text-sm text-[#53635A] leading-relaxed">{cmsText('ArchitectsPage-v2-detail-samples', 'Chcesz porównać próbki z inwestorem? Przed spotkaniem potwierdzimy dostępność interesujących Cię wzorników i produktów.')}</p>
            <button onClick={onOpenConsultation} className="px-5 py-3 bg-[#0E4637] text-white text-sm font-semibold rounded-lg hover:bg-[#17211C] transition-colors">{cmsText('ArchitectsPage-v2-detail-cta', 'Zapytaj o próbki i spotkanie')}</button>
          </div>
        </div>
      </section>

      <section id="arch-kontakt" className="py-12 sm:py-16 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0E4637] font-semibold block mb-2">{cmsText('ArchitectsPage-v2-contact-eyebrow', 'Zacznijmy od Twojego projektu')}</span>
            <h2 className="text-3xl font-bold font-display text-[#17211C]">{cmsText('ArchitectsPage-v2-contact-title', 'Masz rzut albo pierwsze pytania?')}</h2>
            <p className="text-base text-[#17211C]/75 mt-4 leading-relaxed">{cmsText('ArchitectsPage-v2-contact-intro', 'Napisz, jaki obiekt projektujesz, na jakim etapie są prace i co chcesz uzgodnić. Rzut koncepcyjny możesz dołączyć do wiadomości e-mail. Ustalimy dalszy krok i zakres pomocy.')}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="mailto:biuro@intelispaces.pl?subject=Projekt%20do%20om%C3%B3wienia%20%E2%80%94%20architekt" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0E4637] text-white font-semibold text-sm hover:bg-[#17211C] transition-colors"><Mail className="w-4 h-4" aria-hidden="true" />{cmsText('ArchitectsPage-v2-email', 'biuro@intelispaces.pl')}</a>
              <a href="tel:+48505260715" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#0E4637]/25 text-[#0E4637] font-semibold text-sm hover:bg-[#F7F8F5] transition-colors"><Phone className="w-4 h-4" aria-hidden="true" />{cmsText('ArchitectsPage-v2-phone', '+48 505 260 715')}</a>
            </div>
          </div>
          <aside className="lg:col-span-5 p-6 rounded-2xl bg-[#F7F8F5] border border-[#17211C]/10"><MapPin className="w-6 h-6 text-[#0E4637] mb-3" aria-hidden="true" /><h3 className="text-lg font-bold text-[#17211C]">{cmsText('ArchitectsPage-v2-showroom-title', 'Spotkanie z architektem i inwestorem')}</h3><p className="text-sm text-[#17211C]/75 leading-relaxed mt-3">{cmsText('ArchitectsPage-v2-showroom-text', 'Salon sprzedaży w Warszawie: ul. Konwaliowa 7 lok. 103, 03-194 Warszawa. Skontaktuj się przed wizytą, aby ustalić termin i potrzebne materiały.')}</p><a href="https://maps.google.com/?q=Konwaliowa+7+lok.+103%2C+03-194+Warszawa" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-[#0E4637] font-semibold underline underline-offset-4">{cmsText('ArchitectsPage-v2-showroom-map', 'Zobacz dojazd')}<ArrowRight className="w-4 h-4" aria-hidden="true" /></a></aside>
        </div>
      </section>
    </div>
  );
};
