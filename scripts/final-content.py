from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
changes={
 'Dojazd: Metro Rondo Daszyńskiego (3 min pieszo) · Miejsca parkingowe dla gości':'Dojazd: sprawdź trasę do salonu w Google Maps.',
 'Konto bankowe: mBank S.A. (PLN / EUR)':'Dane do płatności przekazujemy wraz z ofertą.',
 'Lokalizacja: Warszawa Wola':'Lokalizacja: Warszawa',
 'Współrzędne GPS: 52.2307° N, 20.9882° E':'ul. Konwaliowa 7 lok. 103',
 ' (budynek Wola Center)':'',' (Wola Center)':'',
 ' · REGON: 387129012 · KRS: 0000865120':'',' · REGON: 387129012':'',
 'INTELISPACES Sp. z o.o.':'Delitech Sp.j.',
 'Administratorem danych osobowych zbieranych za pośrednictwem portalu jest Delitech Smart Spaces':'Administratorem danych osobowych zbieranych za pośrednictwem portalu jest Delitech Sp.j.',
 'Nasza odpowiedź trafi':'Nasza odpowiedź trafi',
 'Nasz inżynier prowadzący skontaktuje się telefonicznie w ciągu 4 godzin roboczych, aby potwierdzić dogodną godzinę spotkania (online lub w naszym biurze przy ul. Prostej w Warszawie).':'Dziękujemy. Zgłoszenie trafiło do zespołu InteliSpaces. Skontaktujemy się, aby uzgodnić termin i sposób spotkania.',
 'https://maps.google.com/?q=Prosta+68,+Warszawa':'https://maps.google.com/?q=Konwaliowa+7,+Warszawa',
}
for p in list((root/'src').rglob('*.tsx'))+[root/'wordpress/intelispaces/content-seed.json']:
 s=p.read_text(encoding='utf-8')
 for before,after in changes.items():s=s.replace(before,after)
 p.write_text(s,encoding='utf-8')
(root/'scripts/content-corrections.json').write_text(json.dumps(changes,ensure_ascii=False),encoding='utf-8')
