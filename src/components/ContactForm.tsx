import { cmsText, submitInquiry } from '../cms';
import React, { useState, useRef } from 'react';
import { InquiryFormData } from '../types.ts';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface ContactFormProps {
  onOpenPrivacy: () => void;
  defaultType?: InquiryFormData['investmentType'];
  className?: string;
  sourceContext?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onOpenPrivacy,
  defaultType = 'biuro',
  className = '',
  sourceContext,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments,setAttachments] = useState<File[]>([]);
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    investmentType: defaultType,
    location: 'Warszawa',
    stage: 'projekt',
    areaSquareMeters: '',
    scopeItems: ['Oświetlenie i DALI', 'Sterowanie HVAC'],
    description: '',
    files: [],
    consentDataProcessing: false,
    consentMarketing: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);

  const scopeOptions = [
    cmsText("contactform.19f4a109c5", "Oświetlenie i DALI"),
    cmsText("contactform.6bc24f9c83", "Rolety i żaluzje fasadowe"),
    cmsText("contactform.abda7c20d4", "Sterowanie HVAC (klimatyzacja / ogrzewanie / wentylacja)"),
    cmsText("contactform.e7dd100607", "Automatyka sal konferencyjnych i stref wspólnych"),
    cmsText("contactform.7a30b41ece", "Monitoring zużycia energii elektrycznej"),
    cmsText("contactform.b8d062691a", "Osprzęt designerski JUNG / tactile panels"),
    cmsText("contactform.1d8835a792", "Integracja z systemem BMS / Audio-Video"),
    cmsText("contactform.295e47e7e3", "Kontrola dostępu i bezpieczeństwo"),
  ];

  const handleScopeToggle = (item: string) => {
    setFormData((prev) => {
      const exists = prev.scopeItems.includes(item);
      return {
        ...prev,
        scopeItems: exists
          ? prev.scopeItems.filter((i) => i !== item)
          : [...prev.scopeItems, item],
      };
    });
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    if (attachments.length + newFiles.length > 10 || [...attachments,...newFiles].reduce((n,f)=>n+f.size,0) > 20*1024*1024 || newFiles.some(f=>f.size>10*1024*1024 || !/\.(pdf|dwg|dxf|png|jpe?g|zip)$/i.test(f.name))) {
      setErrors(prev=>({...prev,submit:'Dozwolone PDF, DWG, DXF, PNG, JPG, ZIP: maks. 10 plików, 10 MB na plik i 20 MB łącznie.'})); return;
    }
    setAttachments(prev=>[...prev,...newFiles]);
    const formatted = newFiles.map((f) => ({
      name: f.name,
      size: Math.round(f.size / 1024), // in KB
      type: f.name.split('.').pop()?.toUpperCase() || 'PLIK',
    }));
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...formatted],
    }));
  };

  const removeFile = (index: number) => {
    setAttachments(prev=>prev.filter((_,i)=>i!==index));
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Wpisz imię i nazwisko lub nazwę firmy';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Wprowadź prawidłowy adres e-mail';
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      newErrors.phone = 'Wprowadź numer telefonu kontaktowego';
    }
    if (!formData.consentDataProcessing) {
      newErrors.consent = 'Wymagana zgoda na przetwarzanie danych w celu przygotowania oferty';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const reference = await submitInquiry({...formData,sourceContext,kind:'project'},attachments);
      setSubmittedReference(reference);
    } catch(error) { setErrors(prev=>({...prev,submit:error instanceof Error ? error.message : 'Błąd zapisu zgłoszenia.'})); }
    finally { setIsSubmitting(false); }
  };

  const resetForm = () => {
    setSubmittedReference(null);
    setAttachments([]);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      investmentType: defaultType,
      location: 'Warszawa',
      stage: 'projekt',
      areaSquareMeters: '',
      scopeItems: ['Oświetlenie i DALI', 'Sterowanie HVAC'],
      description: '',
      files: [],
      consentDataProcessing: false,
      consentMarketing: false,
    });
    setErrors({});
  };

  if (submittedReference) {
    return (
      <div className={`bg-white border border-[#0E4637]/20 rounded-2xl p-8 sm:p-12 text-center ${className}`}>
        <div className="w-16 h-16 mx-auto mb-6 bg-[#CFE3C4]/40 rounded-full flex items-center justify-center text-[#0E4637]">
          <CheckCircle2 className="w-8 h-8 text-[#0E4637]" />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-[#0E4637] mb-2 font-semibold">{cmsText("contactform.e92a582e47", "Zgłoszenie przyjęte · ID: ")}{submittedReference}
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#17211C] mb-4">{cmsText("contactform.9e4f9d5df5", "Dziękujemy za przesłanie rzutów i zapytania")}</h3>
        <p className="text-[#17211C]/75 max-w-xl mx-auto mb-8 text-sm leading-relaxed">{cmsText("contactform.88c93e3b6d", "Nasz inżynier prowadzący w Warszawie przeanalizuje nadesłaną dokumentację rzutów i specyfikację. Wrócimy z konkretnymi pytaniami technicznymi i wstępną koncepcją automatyki KNX w ciągu 24–48 godzin roboczych.")}</p>

        <div className="bg-[#F7F8F5] border border-[#17211C]/10 rounded-xl p-5 max-w-lg mx-auto text-left text-xs mb-8 space-y-2">
          <div className="flex justify-between border-b border-black/5 pb-1">
            <span className="text-[#17211C]/60">{cmsText("contactform.ee8d3dcef1", "Inwestor / Kontakt:")}</span>
            <span className="font-semibold text-[#17211C]">{formData.name}</span>
          </div>
          <div className="flex justify-between border-b border-black/5 pb-1">
            <span className="text-[#17211C]/60">{cmsText("contactform.2fd93e780d", "Typ inwestycji:")}</span>
            <span className="font-semibold text-[#17211C] capitalize">{formData.investmentType} ({formData.location})</span>
          </div>
          <div className="flex justify-between border-b border-black/5 pb-1">
            <span className="text-[#17211C]/60">{cmsText("contactform.77112d1488", "Przesłane pliki:")}</span>
            <span className="font-semibold text-[#17211C]">{formData.files.length}{cmsText("contactform.3d0090b978", " załącznik(ów)")}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-2.5 bg-[#0E4637] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#17211C] transition-colors"
        >{cmsText("contactform.c73fb4ad20", "Prześlij kolejne zapytanie")}</button>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-[#17211C]/10 rounded-2xl p-6 sm:p-10 shadow-sm ${className}`}>
      {sourceContext && (
        <div className="mb-4 text-xs font-mono uppercase tracking-wider text-[#0E4637] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E6F15A] border border-[#0E4637]" />
          <span>{cmsText("contactform.d146d290df", "Kontekst: ")}{sourceContext}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errors.submit && <p role="alert" className="text-sm text-red-700 p-3 bg-red-50 rounded-lg">{errors.submit}</p>}
        {/* Row 1: Dane kontaktowe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17211C] mb-1.5">{cmsText("contactform.553630586b", "Imię i nazwisko / Firma ")}<span className="text-[#0E4637]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={cmsText("contactform.127917a60f", "np. Architektura Jan Kowalski / Sp. z o.o.")}
              className={`w-full px-3.5 py-2.5 bg-[#F7F8F5] border rounded-lg text-sm text-[#17211C] placeholder:text-[#17211C]/40 focus:outline-none focus:ring-2 focus:ring-[#0E4637] focus:bg-white transition-all ${
                errors.name ? 'border-red-500' : 'border-[#17211C]/15'
              }`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17211C] mb-1.5">{cmsText("contactform.92fec85b7e", "Adres e-mail ")}<span className="text-[#0E4637]">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={cmsText("contactform.cbd96eaad6", "kontakt@twojadomena.pl")}
              className={`w-full px-3.5 py-2.5 bg-[#F7F8F5] border rounded-lg text-sm text-[#17211C] placeholder:text-[#17211C]/40 focus:outline-none focus:ring-2 focus:ring-[#0E4637] focus:bg-white transition-all ${
                errors.email ? 'border-red-500' : 'border-[#17211C]/15'
              }`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Row 2: Telefon i Lokalizacja */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17211C] mb-1.5">{cmsText("contactform.c609e7074b", "Numer telefonu ")}<span className="text-[#0E4637]">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+48 600 000 000"
              className={`w-full px-3.5 py-2.5 bg-[#F7F8F5] border rounded-lg text-sm text-[#17211C] placeholder:text-[#17211C]/40 focus:outline-none focus:ring-2 focus:ring-[#0E4637] focus:bg-white transition-all ${
                errors.phone ? 'border-red-500' : 'border-[#17211C]/15'
              }`}
            />
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17211C] mb-1.5">{cmsText("contactform.bd6d7170dd", "Lokalizacja inwestycji")}</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={cmsText("contactform.dee29342da", "np. Warszawa Mokotów, Konstancin, Wrocław...")}
              className="w-full px-3.5 py-2.5 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-sm text-[#17211C] placeholder:text-[#17211C]/40 focus:outline-none focus:ring-2 focus:ring-[#0E4637] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Row 3: Rodzaj inwestycji i Etap */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17211C] mb-1.5">{cmsText("contactform.6369463f7c", "Rodzaj obiektu")}</label>
            <select
              value={formData.investmentType}
              onChange={(e) => setFormData({ ...formData, investmentType: e.target.value as any })}
              className="w-full px-3.5 py-2.5 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-sm text-[#17211C] focus:outline-none focus:ring-2 focus:ring-[#0E4637] focus:bg-white"
            >
              <option value="biuro">{cmsText("contactform.7e6eaadbcc", "Biuro / Przestrzeń komercyjna")}</option>
              <option value="dom">{cmsText("contactform.60b5b19204", "Dom jednorodzinny / Rezydencja")}</option>
              <option value="apartament">{cmsText("contactform.dd2089a945", "Apartament premium")}</option>
              <option value="komercyjny">{cmsText("contactform.038e38eab0", "Obiekt komercyjny / HoReCa")}</option>
              <option value="inne">{cmsText("contactform.7e43c24a7f", "Inny obiekt")}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17211C] mb-1.5">{cmsText("contactform.ed5e0faa73", "Etap inwestycji")}</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
              className="w-full px-3.5 py-2.5 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-sm text-[#17211C] focus:outline-none focus:ring-2 focus:ring-[#0E4637] focus:bg-white"
            >
              <option value="koncepcja">{cmsText("contactform.510adc0fcf", "Koncepcja funkcjonalna / Rzuty wstępne")}</option>
              <option value="projekt">{cmsText("contactform.b996b78ebb", "Projekt wykonawczy / Branżowy")}</option>
              <option value="stan-surowy">{cmsText("contactform.f042151512", "Stan surowy / Deweloperski")}</option>
              <option value="wykonczenie">{cmsText("contactform.38c7bbdcef", "Fit-out / Wykończenie wnętrz")}</option>
              <option value="modernizacja">{cmsText("contactform.46eafb2ee5", "Modernizacja działającego obiektu")}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17211C] mb-1.5">{cmsText("contactform.25e0bdf023", "Powierzchnia (m²)")}</label>
            <input
              type="text"
              value={formData.areaSquareMeters}
              onChange={(e) => setFormData({ ...formData, areaSquareMeters: e.target.value })}
              placeholder={cmsText("contactform.19bf0d85a9", "np. 450 m²")}
              className="w-full px-3.5 py-2.5 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-sm text-[#17211C] placeholder:text-[#17211C]/40 focus:outline-none focus:ring-2 focus:ring-[#0E4637] focus:bg-white transition-all font-mono"
            />
          </div>
        </div>

        {/* Row 4: Zakres automatyki (Checkboxy) */}
        <div>
          <label className="block text-xs font-semibold text-[#17211C] mb-2">{cmsText("contactform.247bc65768", "Wstępnie planowany zakres instalacji (zaznacz interesujące obszary):")}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scopeOptions.map((opt) => {
              const checked = formData.scopeItems.includes(opt);
              return (
                <label
                  key={opt}
                  onClick={() => handleScopeToggle(opt)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                    checked
                      ? 'bg-[#CFE3C4]/30 border-[#0E4637]/40 text-[#0E4637] font-medium'
                      : 'bg-[#F7F8F5] border-[#17211C]/10 text-[#17211C]/80 hover:bg-black/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="mt-0.5 rounded text-[#0E4637] focus:ring-[#0E4637]"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Row 5: Drag & Drop upload rzutów */}
        <div>
          <label className="block text-xs font-semibold text-[#17211C] mb-1.5">{cmsText("contactform.500d641a32", "Rzuty architektoniczne / schematy instalacji (PDF, DWG, DXF, PNG, ZIP)")}</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#0E4637]/30 hover:border-[#0E4637] bg-[#F7F8F5] hover:bg-[#CFE3C4]/15 rounded-xl p-5 text-center cursor-pointer transition-all group"
          >
            <Upload className="w-6 h-6 mx-auto text-[#0E4637] mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-[#17211C]">{cmsText("contactform.0e366fa036", "Przeciągnij i upuść pliki rzutów tutaj lub ")}<span className="text-[#0E4637] font-semibold underline underline-offset-2">{cmsText("contactform.3077bf0550", "przeglądaj dysk")}</span>
            </p>
            <p className="text-[11px] text-[#17211C]/60 mt-1">{cmsText("contactform.0043be0805", "PDF, DWG, DXF, PNG, JPG, ZIP — do 10 MB na plik, 20 MB łącznie")}</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.zip"
            />
          </div>

          {/* List of uploaded files */}
          {formData.files.length > 0 && (
            <div className="mt-3 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0E4637]">{cmsText("contactform.4f63d3160a", "Dołączone pliki (")}{formData.files.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-white border border-[#17211C]/15 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-4 h-4 text-[#0E4637] shrink-0" />
                      <span className="truncate font-medium text-[#17211C]">{file.name}</span>
                      <span className="text-[10px] font-mono text-[#17211C]/50 shrink-0">
                        {file.size}{cmsText("contactform.8d2fbf1b1a", " KB")}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="text-[#17211C]/40 hover:text-red-600 p-1"
                      aria-label={cmsText("contactform.5504ddb672", "Usuń plik")}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Row 6: Opis projektu */}
        <div>
          <label className="block text-xs font-semibold text-[#17211C] mb-1.5">{cmsText("contactform.7adb3be593", "Opis projektu, uwagi techniczne lub specyficzne wymagania")}</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={cmsText("contactform.e2c434d3ed", "Opisz specyfikę przestrzeni, oczekiwany harmonogram lub kluczowe założenia sterowania (np. sceny prezentacji w sali zarządu, integracja z pompą ciepła)...")}
            className="w-full px-3.5 py-2.5 bg-[#F7F8F5] border border-[#17211C]/15 rounded-lg text-sm text-[#17211C] placeholder:text-[#17211C]/40 focus:outline-none focus:ring-2 focus:ring-[#0E4637] focus:bg-white transition-all resize-y"
          />
        </div>

        {/* Row 7: Zgody formalne RODO i wysyłka */}
        <div className="pt-2 border-t border-[#17211C]/10 space-y-3">
          <label className="flex items-start gap-2 text-xs text-[#17211C]/80 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consentDataProcessing}
              onChange={(e) => setFormData({ ...formData, consentDataProcessing: e.target.checked })}
              className="mt-0.5 rounded text-[#0E4637] focus:ring-[#0E4637]"
            />
            <span>{cmsText("contactform.624b99f336", "Wyrażam zgodę na przetwarzanie podanych danych osobowych przez Delitech Smart Spaces w celu opracowania i przedstawienia oferty techniczno-handlowej oraz kontaktu w sprawie projektu.")}{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-[#0E4637] font-semibold underline underline-offset-2 hover:text-[#17211C]"
              >{cmsText("contactform.85059b130d", "Polityka prywatności i RODO")}</button>
              .
            </span>
          </label>
          {errors.consent && <p className="text-xs text-red-600">{errors.consent}</p>}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-[#17211C]/60 text-left">
              <ShieldCheck className="w-4 h-4 text-[#0E4637] shrink-0" />
              <span>{cmsText("contactform.e38cbbc21d", "Gwarancja poufności rzutów i dokumentacji projektowej")}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 bg-[#0E4637] hover:bg-[#17211C] text-[#E6F15A] font-semibold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group shadow-sm disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Przesyłanie danych...' : 'Prześlij rzuty do analizy'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
