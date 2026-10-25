# InteliSpaces — praca nad stroną

**Tekst zmieniamy bezpośrednio w pliku strony. Ten sam kod obsługuje podgląd lokalny, GitHub Pages i publikację na CF.**

Nie ma panelu WordPress ani drugiego pliku z treściami nadpisującego komponenty. Eksporty dawnego CMS zostały usunięte z bieżącej wersji; są zachowane w historii Git i kopiach.

## Gdzie edytować

| Co zmieniasz | Plik |
| --- | --- |
| Zespół: nazwiska, stanowiska, opisy | `src/pages/TeamPage.tsx` |
| Strona główna i pozostałe podstrony | `src/pages/` |
| Menu, stopka, formularze, komunikaty | `src/components/` |
| Poradniki | `src/content/guides.ts` |
| Zdjęcia i film | `src/assets/` |
| Paleta strony: tła, tekst, akcenty | `src/index.css` — blok `@theme` |
| Adresy podstron, tytuły kart i opisy SEO | `src/page-config.ts` |
| Konfigurator KNX | `planner/` i `knx-backend/` |

Przykład w `TeamPage.tsx`: zmień `role: "Opis stanowiska"` i zapisz plik. Nie trzeba kopiować tego tekstu do JSON-u, zmieniać identyfikatora ani korzystać z CMS.

### Kolory strony — Granat i technologia

Paleta publicznej strony to `surface` (`#F3F5F2`), `ink` (`#182C3D`),
`silver` (`#A9B8C2`) oraz `accent` (`#9FBF36`, oryginalny kolor kropki w logo).
`mist` jest jasnym błękitnym tłem pomocniczym, a `ink-hover` i `accent-hover`
zapewniają widoczną reakcję przycisków. Używaj klas takich jak `bg-surface`,
`text-ink/80`, `border-ink/10` i `bg-accent text-ink`; kolory zmieniamy w jednym
bloku `@theme`, bez kopiowania wartości HEX do każdej podstrony.
Zieleń jest akcentem, duże ciemne powierzchnie są granatowe. Logo i kolory
fotografii pozostają oryginalne. Konfigurator KNX ma osobny arkusz stylów w `planner/`.

## Podgląd i publikacja

Wymagany Node.js 24. Po pobraniu własnej gałęzi: `npm ci`, następnie `npm run dev`. Możesz otworzyć np. `/team/`. Podgląd lokalny nie wysyła formularzy; link do pełnego KNX prowadzi na jego staging.

Przed wysłaniem zmian uruchom `npm run lint`, `npm test` i `npm run build`. `npm run preview` pokazuje zbudowaną wersję. Nie wprowadzaj prawdziwych danych klientów podczas testów; do wyłączonej wysyłki formularzy buduj przez `npm run build:preview`.

- Darek: gałąź `Darka` → [podgląd Darka](https://daromajowy.github.io/delitech-darek/Darka/).
- Janek/Codex: gałąź `Janka` → [podgląd Janka](https://daromajowy.github.io/delitech-darek/Janka/).
- Zatwierdzone zmiany połącz z `main` → [staging na CF](https://staging.intelispaces.pl/).
- Po teście stagingu publikacja produkcyjna jest osobnym, ręcznym krokiem w GitHub Actions.

Po otrzymaniu wspólnych poprawek pobierz swoją gałąź (`git pull --ff-only`). Jeśli masz własne niezapisane zmiany lub rozbieżną historię, najpierw je zachowaj i połącz — nie resetuj gałęzi ani nie używaj force push.

Gałęzie kopii zapasowych archiwizujemy jako tagi `archive/...`. Tag wskazuje dokładny zapis historii; przywrócenie zaczyna się od nowej gałęzi utworzonej z wybranego tagu. Tagi `cf-...` identyfikują wydania i pozostają bez zmian.

Szczegóły publikacji, izolacji baz i odzyskiwania: [DEPLOYMENT.md](DEPLOYMENT.md).
