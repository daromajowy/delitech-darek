import { cmsText } from '../cms/content.ts';
import React from 'react';
import { ProjectPreparation } from '../components/ProjectPreparation.tsx';
import { PageId } from '../types.ts';
import { ContactForm } from '../components/ContactForm.tsx';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Calculator, Check, ArrowRight } from 'lucide-react';

interface ContactPageProps {
  onOpenPrivacy: (tab?: 'privacy' | 'cookies' | 'rodo') => void;
  onOpenConsultation: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onOpenPrivacy,
  onOpenConsultation,
}) => {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-[#17211C] text-white py-12 lg:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E6F15A] font-semibold block">{cmsText("ContactPage-5fdd887b5268", "Kontakt z zespołem Delitech")}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">{cmsText("ContactPage-ec0678d054b0", "Porozmawiajmy o Twoim projekcie.")}</h1>
            <p className="text-base sm:text-lg text-[#EDE9DF]/80 leading-relaxed pt-2">{cmsText("ContactPage-c3ab81299f93", "Wspieramy architektów, inwestorów i zespoły fit-out. Napisz, na jakim etapie jest projekt i co chcesz ustalić. Możesz dołączyć rzuty do wiadomości e-mail.")}</p>
          </div>
        </div>
      </section>

      {/* Main Grid: Info + Map Placeholder + Interactive Form */}
      <section className="py-12 sm:py-16 bg-[#F7F8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Col: Contact Details & Google Maps */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Details Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#17211C]/10 shadow-sm space-y-6">
                <h2 className="text-xl font-bold font-display text-[#17211C]">{cmsText("ContactPage-01ccf3a7383d", "Salon sprzedaży i kontakt")}</h2>

                <div className="space-y-4 text-xs text-[#17211C]/80">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#0E4637] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-[#17211C]">{cmsText("ContactPage-758c48e9fb71", "Delitech Jasek spółka jawna")}</p>
                      <p>{cmsText("ContactPage-c001add53a0d", "ul. Konwaliowa 7 lok. 103")}</p>
                      <p>{cmsText("ContactPage-fbb27500dc9a", "03-194 Warszawa, Polska")}</p>
                      <p className="text-[#17211C]/60 text-[11px] mt-0.5">{cmsText("ContactPage-74b868aeb50d", "Salon sprzedaży. Spotkania po wcześniejszym uzgodnieniu.")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#0E4637] shrink-0" />
                    <div>
                      <span className="text-[11px] text-[#17211C]/60 block">{cmsText("ContactPage-2fdee1238cd7", "Kontakt telefoniczny:")}</span>
                      <a href="tel:+48505260715" className="font-mono text-sm font-semibold text-[#0E4637] hover:underline">
                        +48 505 260 715
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#0E4637] shrink-0" />
                    <div>
                      <span className="text-[11px] text-[#17211C]/60 block">{cmsText("ContactPage-deae7649c1b3", "Adres dla zapytań i rzutów:")}</span>
                      <a href={"mailto:" + cmsText("ContactPage-3aaae08d2a31", "biuro@intelispaces.pl")} className="font-mono text-sm font-semibold text-[#0E4637] hover:underline">{cmsText("ContactPage-3aaae08d2a31", "biuro@intelispaces.pl")}</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#0E4637] shrink-0" />
                    <div>
                      <span className="text-[11px] text-[#17211C]/60 block">{cmsText("ContactPage-aa119009fd36", "Spotkania w salonie:")}</span>
                      <span className="font-medium">{cmsText("ContactPage-9fe843445062", "Termin ustalamy telefonicznie lub e-mailem.")}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#17211C]/10 text-[11px] font-mono text-[#17211C]/60 space-y-0.5">
                  <p>{cmsText("ContactPage-c1cfd89bbd73", "NIP: 1132919580 · REGON: 36555562000000 · KRS: 0000640314")}</p>
                  <p>{cmsText("ContactPage-56d2593f164d", "Forma prawna: spółka jawna")}</p>
                  <p>{cmsText('ContactPage-registered-address', 'Siedziba rejestrowa: ul. Myśliborska 85A/8, 03-185 Warszawa')}</p>
                </div>
              </div>

              {/* Stylized Google Maps Area */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#17211C]/10 shadow-sm">
                <div className="p-4 bg-[#F7F8F5] border-b border-[#17211C]/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#17211C]">{cmsText("ContactPage-9cd1062ed1bc", "Salon sprzedaży: Warszawa Białołęka")}</span>
                  <a
                    href="https://maps.google.com/?q=Konwaliowa+7+lok.+103%2C+03-194+Warszawa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#0E4637] font-semibold hover:underline"
                  >{cmsText("ContactPage-6132be6dabe7", "Otwórz w Google Maps →")}</a>
                </div>

                <div className="h-64 bg-[#17211C] relative flex items-center justify-center p-6 text-center text-white overflow-hidden">
                  <div className="absolute inset-0 bg-grid-dark-subtle opacity-40" />
                  
                  {/* Map Pin Mockup */}
                  <div className="relative z-10 space-y-2">
                    <div className="w-10 h-10 mx-auto bg-[#0E4637] border-2 border-[#E6F15A] rounded-full flex items-center justify-center shadow-xl">
                      <MapPin className="w-5 h-5 text-[#E6F15A]" />
                    </div>
                    <p className="font-bold text-sm text-white">{cmsText("ContactPage-323383cbf602", "Delitech Smart Spaces")}</p>
                    <p className="text-xs text-[#EDE9DF]/70">{cmsText("ContactPage-ef67874f99ca", "ul. Konwaliowa 7 lok. 103, 03-194 Warszawa")}</p>
                    <span className="inline-block text-[10px] font-mono bg-white/10 px-2.5 py-0.5 rounded text-[#CFE3C4]">{cmsText("ContactPage-2e39920427d5", "Salon sprzedaży · lokal 103")}</span>
                  </div>
                </div>
              </div>

              <ProjectPreparation />
            </div>

            {/* Right Col: Full Blueprint & Request Form */}
            <div className="lg:col-span-7">
              <ContactForm
                onOpenPrivacy={() => onOpenPrivacy('privacy')}
                defaultType="inne"
                sourceContext="Kontakt z Delitech"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
