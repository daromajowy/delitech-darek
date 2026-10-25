# F50 — interaktywna demonstracja domu

Sekcja na `solutions/#steruj-domem`, osadzona poniżej wstępu strony „Co może Twój dom”. CSS jest ograniczony do `.f50-demo`, a link konfiguratora korzysta z `plannerUrl()` — również w podglądach gałęzi.

- Salon i kuchnia: niezależne przełączanie światła.
- Rolety: klik przesuwa o 15 punktów procentowych; przytrzymanie 500 ms uruchamia jazdę do końca. Materiał rolety przesuwa się bez rozciągania.
- Temperatura: nastawa 18–26°C, co 0,5°C; krótka łuna sygnalizuje zmianę.
- Kino: przygaszenie salonu, kuchni i przedpokoju, delikatne LED-y i włączony TV. Stan piętra pozostaje niezależny.
- ALL OFF: wyłączenie świateł obu kondygnacji, wiaty oraz TV. Nastawa temperatury i rolety pozostają niezależne.
- Diody pokazują bieżący stan; dymki pojawiają się chwilowo. Reset wraca do oświetlonego domu.

To demonstracja bez połączenia z rzeczywistymi urządzeniami KNX. TV pokazuje nieruchomy obraz. Oznaczenia funkcji i kolory diod są wybraną konfiguracją pokazową.

## Materiały

Zatwierdzony prototyp: `outputs/intelispaces-dom-f40-20261025` w głównym workspace KNX. Obrazy domu w scenie Kino/ALL OFF, obudowa panelu i roleta zostały wygenerowane narzędziem image_gen i sprawdzone w tym prototypie. Wersja strony używa WebP bez zmiany wymiarów; oryginalny `smart-home-cutaway.webp` jest współdzielony ze stroną główną. Dokładne prompty pozostają w `references/cinema-generation.json` prototypu.

Symbole LCD oparto na dokumentacji [JUNG F50](https://downloads.jung.de/Downloads/Produktdownloads/Produktdokumentation/KNX/xx529xD1ST/en_xx529xD1ST_99002323_td_20251113.pdf), s.167–175. Pozycje ośmiu diod: ta sama dokumentacja, s.10–11. Ilustracja obudowy nie jest zdjęciem produktu.

Cyfry wyświetlacza: [DSEG7 Classic Mini](https://github.com/keshikan/DSEG), OFL1.1; licencja w `src/assets/fonts/DSEG-LICENSE.txt`. To wizualny zamiennik, nie wyodrębniona czcionka producenta. Ikony klawiszy: istniejący `lucide-react`.

## Sprawdzenie

Projekt wymaga Node24. `npm run lint`, `npm test` (w tym przełączanie scen w `tests/f50-home-lighting.test.mjs`) oraz `SITE_BASE=/delitech-darek/Janka/ npm run build:preview`. Sprawdzić przeglądarkę na desktopie i telefonie, również szybko przełączane ALL OFF → kuchnia oraz obsługę klawiaturą.
