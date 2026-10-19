import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Calculator, ArrowRight } from 'lucide-react';

interface ContactPageProps {
  onOpenConsultation: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onOpenConsultation,
}) => {
  // Quick Preliminary Scope Estimator for Architects and Investors
  const [calcSpace, setCalcSpace] = useState<'biuro' | 'dom' | 'apartament'>('biuro');
  const [calcArea, setCalcArea] = useState<number>(350);

  // Approximate module count calculation based on technical standards
  const estimatedZones = Math.max(2, Math.round(calcArea / 35));
  const estimatedDaliBusses = Math.max(1, Math.ceil(calcArea / 300));
  const estimatedKnxChannels = Math.round(estimatedZones * 2.5);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-ink text-white py-16 lg:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold block">{"Kontakt z zespołem"}</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white">{"Porozmawiajmy o Twoim projekcie."}</h1>
            <p className="text-base sm:text-lg text-mist/80 leading-relaxed pt-2">{"Masz pytania o automatykę KNX? Zadzwoń, napisz lub umów konsultację. Działamy w Warszawie i realizujemy projekty w całej Polsce."}</p>
          </div>
        </div>
      </section>

      {/* Contact details, location and preliminary scope estimator */}
      <section className="py-16 sm:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Direct contact */}
            <div className="lg:col-span-7 space-y-6">
              {/* Direct Details Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-6">
                <h2 className="text-xl font-bold font-display text-ink">{"Biuro inżynierskie w Warszawie"}</h2>

                <div className="space-y-4 text-xs text-ink/80">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-ink shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-ink">{"Delitech Sp.j."}</p>
                      <p>{"ul. Konwaliowa 7 lok. 103"}</p>
                      <p>{"03-194 Warszawa, Polska"}</p>
                      <p className="text-ink/75 text-[11px] mt-0.5">{"Dojazd: sprawdź trasę do salonu w Google Maps."}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-ink shrink-0" />
                    <div>
                      <span className="text-[11px] text-ink/75 block">{"Infolinia techniczna / Biuro:"}</span>
                      <a href="tel:+48505260715" className="font-mono text-sm font-semibold text-ink hover:underline">
                        +48 505 260 715
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-ink shrink-0" />
                    <div>
                      <span className="text-[11px] text-ink/75 block">{"Napisz do nas:"}</span>
                      <a href="mailto:kontakt@delitech.pl" className="font-mono text-sm font-semibold text-ink hover:underline">{"kontakt@delitech.pl"}</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-ink shrink-0" />
                    <div>
                      <span className="text-[11px] text-ink/75 block">{"Godziny pracy inżynierów:"}</span>
                      <span className="font-medium">{"Poniedziałek – Piątek: 08:30 – 17:30"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-ink/10 text-[11px] font-mono text-ink/75 space-y-0.5">
                  <p>{"NIP: 1132919580"}</p>
                  <p>{"Dane do płatności przekazujemy wraz z ofertą."}</p>
                </div>
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-ink hover:bg-ink-hover text-accent font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  Umów konsultację <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            <div className="lg:col-span-5 space-y-6">
              {/* Stylized Google Maps Area */}
              <div className="bg-white rounded-2xl overflow-hidden border border-ink/10 shadow-sm">
                <div className="p-4 bg-surface border-b border-ink/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">{"Lokalizacja: Warszawa"}</span>
                  <a
                    href="https://maps.google.com/?q=Konwaliowa+7,+Warszawa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-ink font-semibold hover:underline"
                  >{"Otwórz w Google Maps →"}</a>
                </div>

                <div className="h-64 bg-ink relative flex items-center justify-center p-6 text-center text-white overflow-hidden">
                  <div className="absolute inset-0 bg-grid-dark-subtle opacity-40" />
                  
                  {/* Map Pin Mockup */}
                  <div className="relative z-10 space-y-2">
                    <div className="w-10 h-10 mx-auto bg-ink border-2 border-accent rounded-full flex items-center justify-center shadow-xl">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <p className="font-bold text-sm text-white">{"Delitech Smart Spaces"}</p>
                    <p className="text-xs text-mist/70">{"ul. Konwaliowa 7 lok. 103, 03-194 Warszawa"}</p>
                    <span className="inline-block text-[10px] font-mono bg-white/10 px-2.5 py-0.5 rounded text-silver">{"ul. Konwaliowa 7 lok. 103"}</span>
                  </div>
                </div>
              </div>

              {/* Preliminary Scope Calculator Card */}
              <div className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase font-semibold text-ink">
                  <Calculator className="w-4 h-4" />
                  <span>{"Wstępny estymator skali instalacji"}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-ink">{"Typ obiektu:"}</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['biuro', 'dom', 'apartament'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setCalcSpace(t)}
                          className={`py-1.5 text-xs font-semibold rounded capitalize transition-colors ${
                            calcSpace === t
                              ? 'bg-ink text-white'
                              : 'bg-surface text-ink/70 hover:bg-black/5'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1 text-ink">
                      <span>{"Powierzchnia użytkowa:"}</span>
                      <span className="font-mono text-ink">{calcArea}{" m²"}</span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={1500}
                      step={10}
                      value={calcArea}
                      onChange={(e) => setCalcArea(Number(e.target.value))}
                      className="w-full accent-ink"
                    />
                  </div>

                  <div className="p-3 bg-surface rounded-xl border border-ink/10 space-y-1.5 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-ink/75">{"Szacowana liczba stref regulacji:"}</span>
                      <span className="font-bold text-ink">~{estimatedZones}{" stref"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink/75">{"Bramki magistrali DALI-2:"}</span>
                      <span className="font-bold text-ink">{estimatedDaliBusses}{" magistrala(e)"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink/75">{"Kanały wykonawcze KNX:"}</span>
                      <span className="font-bold text-ink">~{estimatedKnxChannels}{" kanałów"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
