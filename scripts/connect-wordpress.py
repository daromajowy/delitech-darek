from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
def edit(name,old,new):
 p=root/name;s=p.read_text(encoding='utf-8');assert old in s,name+': missing target';p.write_text(s.replace(old,new),encoding='utf-8')
edit('src/App.tsx',"import React, { useState, useEffect } from 'react';","import React, { useState, useEffect } from 'react';\nimport { cms } from './cms';")
edit('src/App.tsx',"useState<PageId>('home')","useState<PageId>((cms()?.page === 'custom' ? 'home' : cms()?.page) || 'home')")
edit('src/App.tsx',"const meta = pageMetadata[currentPage];","const base = pageMetadata[currentPage];\n    const meta = cms() ? {title: cms()!.title || base.title, desc: cms()!.description || base.desc} : base;")
edit('src/App.tsx',"const handleHashChange = () => {","const handleHashChange = () => {\n      if (cms()) {\n        const legacy = window.location.hash.slice(1).split('/');\n        if (cms()?.urls[legacy[0]]) { window.location.replace(cms()!.urls[legacy[0]] + (legacy[1] ? '#' + legacy[1] : '')); return; }\n        setCurrentHash(window.location.hash.slice(1) || undefined);\n        return;\n      }")
edit('src/App.tsx',"const handleNavigate = (page: PageId, subHash?: string) => {","const handleNavigate = (page: PageId, subHash?: string) => {\n    if (cms()?.urls[page]) { window.location.assign(cms()!.urls[page] + (subHash ? '#' + subHash : '')); return; }")
edit('src/App.tsx',"{currentPage === 'home' && (","{currentPage === 'home' && cms()?.page !== 'custom' && (")
edit('src/App.tsx',"      </main>","        {cms()?.additional && <div className=\"cms-additional max-w-7xl mx-auto px-6 py-10\" dangerouslySetInnerHTML={{__html: cms()!.additional!}} />}\n      </main>")
edit('src/components/HeroVideo.tsx',"() => window.matchMedia('(prefers-reduced-motion: reduce)').matches","() => false")
edit('src/assets.ts',"export const IMAGES = {","import { cmsImage } from './cms';\nexport const IMAGES = {")
for name in ['heroDelitechArch','officeCommSpace','residentialResidence','knxSwitchHardware']:
 edit('src/assets.ts','  '+name+',',f"  get {name}() {{ return cmsImage('image.{name}', {name}); }},")
edit('src/pages/TeamPage.tsx',"import { cmsText } from '../cms';","import { cmsText, cmsImage } from '../cms';")
for name in ['janek','darek']:edit('src/pages/TeamPage.tsx',f'photoUrl: {name}Photo,',f"photoUrl: cmsImage('image.{name}', {name}Photo),")
edit('src/components/ContactForm.tsx',"import { cmsText } from '../cms';","import { cmsText, submitInquiry } from '../cms';")
edit('src/components/ContactForm.tsx',"const fileInputRef = useRef<HTMLInputElement>(null);","const fileInputRef = useRef<HTMLInputElement>(null);\n  const [attachments,setAttachments] = useState<File[]>([]);")
edit('src/components/ContactForm.tsx',"  const addFiles = (newFiles: File[]) => {","  const addFiles = (newFiles: File[]) => {\n    if (attachments.length + newFiles.length > 10 || [...attachments,...newFiles].reduce((n,f)=>n+f.size,0) > 20*1024*1024 || newFiles.some(f=>f.size>10*1024*1024 || !/\\.(pdf|dwg|dxf|png|jpe?g|zip)$/i.test(f.name))) {\n      setErrors(prev=>({...prev,submit:'Dozwolone PDF, DWG, DXF, PNG, JPG, ZIP: maks. 10 plików, 10 MB na plik i 20 MB łącznie.'})); return;\n    }\n    setAttachments(prev=>[...prev,...newFiles]);")
edit('src/components/ContactForm.tsx',"  const removeFile = (index: number) => {","  const removeFile = (index: number) => {\n    setAttachments(prev=>prev.filter((_,i)=>i!==index));")
edit('src/components/ContactForm.tsx',"  const handleSubmit = (e: React.FormEvent) => {","  const handleSubmit = async (e: React.FormEvent) => {")
edit('src/components/ContactForm.tsx',"    // Simulate CRM / backend pipeline integration\n    setTimeout(() => {\n      const ref = `KNX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;\n      setSubmittedReference(ref);\n      setIsSubmitting(false);\n    }, 600);","    try {\n      const reference = await submitInquiry({...formData,sourceContext,kind:'project'},attachments);\n      setSubmittedReference(reference);\n    } catch(error) { setErrors(prev=>({...prev,submit:error instanceof Error ? error.message : 'Błąd zapisu zgłoszenia.'})); }\n    finally { setIsSubmitting(false); }")
edit('src/components/ContactForm.tsx',"    setSubmittedReference(null);","    setSubmittedReference(null);\n    setAttachments([]);")
# Display server errors in the actual form, not in the success view.
p=root/'src/components/ContactForm.tsx';s=p.read_text(encoding='utf-8');pos=s.index('<form ');end=s.index('>',pos)+1;s=s[:end]+'\n      {errors.submit && <p role="alert" className="text-sm text-red-700 p-3 bg-red-50 rounded-lg">{errors.submit}</p>}'+s[end:];p.write_text(s,encoding='utf-8')
edit('src/components/ConsultationModal.tsx',"import { cmsText } from '../cms';","import { cmsText, submitInquiry } from '../cms';")
edit('src/components/ConsultationModal.tsx',"  const [submitted, setSubmitted] = useState(false);","  const [submitted, setSubmitted] = useState(false);\n  const [busy,setBusy] = useState(false);\n  const [error,setError] = useState('');")
edit('src/components/ConsultationModal.tsx',"  const handleSubmit = (e: React.FormEvent) => {","  const handleSubmit = async (e: React.FormEvent) => {")
edit('src/components/ConsultationModal.tsx',"    setSubmitted(true);","    setBusy(true); setError('');\n    try { await submitInquiry({...formData,kind:'consultation',topic:initialTopic}); setSubmitted(true); }\n    catch(e) { setError(e instanceof Error ? e.message : 'Nie udało się zapisać zgłoszenia.'); }\n    finally { setBusy(false); }")
edit('src/components/ConsultationModal.tsx','<form onSubmit={handleSubmit} className="space-y-4">','<form onSubmit={handleSubmit} className="space-y-4">\n              {error && <p role="alert" className="text-red-700">{error}</p>}')
edit('src/components/ConsultationModal.tsx','type="submit"','type="submit" disabled={busy}')
# Preserve the latest company details already approved by the owner.
replacements={
 'ul. Prostej 68, 00-838 Warszawa':'ul. Konwaliowej 7 lok. 103, 03-194 Warszawa',
 'ul. Prostej 68':'ul. Konwaliowej 7 lok. 103', 'ul. Prosta 68':'ul. Konwaliowa 7 lok. 103',
 '00-838 Warszawa':'03-194 Warszawa','525-28-40-192':'1132919580',
 '+48 22 354 67 76':'+48 505 260 715','tel:+48223546776':'tel:+48505260715',
 'Delitech Smart Spaces Sp. z o.o.':'Delitech Sp.j.',
 'Konsultacja została zarezerwowana':'Zgłoszenie konsultacji zostało zapisane',
 'Akceptowane formaty: PDF, DWG, DXF, PNG, JPG, ZIP (do 50 MB)':'PDF, DWG, DXF, PNG, JPG, ZIP — do 10 MB na plik, 20 MB łącznie',
 'Nasza odpowiedź trafi':'Nasza odpowiedź trafi',
}
for p in list((root/'src').rglob('*.tsx'))+[root/'wordpress/intelispaces/content-seed.json']:
 s=p.read_text(encoding='utf-8')
 for a,b in replacements.items():s=s.replace(a,b)
 p.write_text(s,encoding='utf-8')
seed=json.loads((root/'wordpress/intelispaces/content-seed.json').read_text(encoding='utf-8'))
seed['Images']=[{'key':'image.'+key,'label':label,'value':filename,'type':'image'} for key,label,filename in [
 ('heroDelitechArch','Architektura — zdjęcie główne','hero_delitech_architecture_1790288114067.jpg'),
 ('officeCommSpace','Biuro','office_commercial_space_1790288126038.jpg'),
 ('residentialResidence','Dom','residential_residence_1790288136955.jpg'),
 ('knxSwitchHardware','Osprzęt KNX','knx_switch_hardware_1790288148780.jpg'),
 ('janek','Jan Jasek','janek.jpg'),('darek','Darek Maj','darek.jpg')]]
(root/'wordpress/intelispaces/content-seed.json').write_text(json.dumps(seed,ensure_ascii=False,indent=2),encoding='utf-8')
