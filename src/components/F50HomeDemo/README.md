# JUNG F50 / LS TOUCH — interaktywna demonstracja domu

Sekcja na `solutions/#steruj-domem`, osadzona poniżej wstępu strony „Co może Twój dom”. CSS jest ograniczony do `.f50-demo`, a link konfiguratora korzysta z `plannerUrl()` — również w podglądach gałęzi.

Wybór nad panelem przełącza aluminiowy F50 i LS TOUCH LS 990 w czarnym macie (LS 459 D 1S SWM), z czarnym tłem ekranu. Stan domu i akcje należą do wspólnego komponentu: wymiana panelu zachowuje światła, scenę, telewizor, temperaturę oraz położenie i ruch rolet.

LS TOUCH ma dwa ekrany ulubionych: cztery pola „Salon / Kuchnia / Kino / ALL OFF” i dwie kolumny „Rolety / Temperatura”. Kwadraty pod funkcjami i gest poziomy przełączają strony. Przesunięcie zaczęte na strzałce rolety anuluje przytrzymanie, a gest nie uruchamia przypadkowo funkcji pod palcem. Wszystkie funkcje i przełączniki są dostępne klawiaturą. Reset pozostawia wybrany model i przywraca pierwszy ekran LS TOUCH.

- Salon i kuchnia: niezależne przełączanie światła.
- Rolety: klik przesuwa o 15 punktów procentowych; przytrzymanie 500 ms uruchamia jazdę do końca. Materiał rolety przesuwa się bez rozciągania.
- Temperatura: nastawa 18–26°C, co 0,5°C; krótka łuna sygnalizuje zmianę.
- Kino: przygaszenie salonu, kuchni i przedpokoju, delikatne LED-y i włączony TV. Stan piętra pozostaje niezależny.
- ALL OFF: wyłączenie świateł obu kondygnacji, wiaty oraz TV. Ponowne naciśnięcie przy wygaszonym domu przywraca wszystkie światła do pełnej jasności. TV pozostaje wyłączony; nastawa temperatury i rolety pozostają niezależne.
- Diody F50 oraz warianty ikon LS TOUCH pokazują bieżący stan; dymki pojawiają się chwilowo. Reset wraca do oświetlonego domu.

To demonstracja bez połączenia z rzeczywistymi urządzeniami KNX. TV pokazuje nieruchomy obraz. Oznaczenia funkcji i kolory diod są wybraną konfiguracją pokazową.

## Materiały

Zatwierdzony prototyp: `outputs/intelispaces-dom-f40-20261025` w głównym workspace KNX. Obrazy domu w scenie Kino/ALL OFF, obudowa panelu i roleta zostały wygenerowane narzędziem image_gen i sprawdzone w tym prototypie. Wersja strony używa WebP bez zmiany wymiarów; oryginalny `smart-home-cutaway.webp` jest współdzielony ze stroną główną. Dokładne prompty pozostają w `references/cinema-generation.json` prototypu.

Symbole LCD oparto na dokumentacji [JUNG F50](https://downloads.jung.de/Downloads/Produktdownloads/Produktdokumentation/KNX/xx529xD1ST/en_xx529xD1ST_99002323_td_20251113.pdf), s.167–175. Pozycje ośmiu diod: ta sama dokumentacja, s.10–11. Ilustracja obudowy nie jest zdjęciem produktu.

Aktualna aluminiowa ilustracja F50 pochodzi z działającej demonstracji [Elektrodesign](https://elektrodesign.pl/automatyka-394#steruj-domem); zachowano jej położenie klawiszy i kontrolek, zmieniając wyłącznie format pliku na WebP.

LS TOUCH: niezmieniony front z [katalogu JUNG, LS 459 D 1S SWM](https://www.jung-group.com/en-DE/p/KNX-room-controller-LS-TOUCH-with-frame-LS-990-Secure-matt-graphite-black/LS-459-D-1S-SWM), z interaktywną warstwą na obszarze wyświetlacza. Oryginalne ikony „Lights – Floor – 1”, „Lights – Ceiling”, „Blinds – Vertical”, „Scene – Movie” i „Switching – Power” wyodrębniono bez przerysowywania z [dokumentacji JUNG LS TOUCH, 09.10.2026](https://downloads.jung.de/Downloads/Produktdownloads/Produktdokumentation/KNX/459D1S/en_459D1S_20261009_TD.pdf), s. 53–55. CSS odwraca ich kolor dla czarnego tła. Front i ikony: © ALBRECHT JUNG GMBH & CO. KG. To interaktywna demonstracja konfiguracji, nie oprogramowanie sprzętowego LS TOUCH.

Podział czterech pól odwzorowuje zdjęcie referencyjne i układ ze s. 57 dokumentacji: jasny krzyż o grubości 1 px, wyśrodkowany na ekranie, z końcami odsuniętymi od krawędzi. Pola nie mają tła po najechaniu, ramki podpowiedzi ani kropek stanu. Fokus klawiatury pozostaje widoczny. Warianty nieaktywne ikon przygotowano w SVG przez maskowanie promieni lamp oraz oznaczeń aktywności kina i zasilania; nie są to osobno opublikowane pliki OFF producenta. Kształt zmienia się wraz ze stanem domu, przy stałej jasności symboli. ALL OFF pokazuje okrąg po wygaszeniu domu i symbol zasilania po przywróceniu świateł. Kwadraty na dole służą wyłącznie do wyboru ekranu.

Cyfry wyświetlacza: [DSEG7 Classic Mini](https://github.com/keshikan/DSEG), OFL1.1; licencja w `src/assets/fonts/DSEG-LICENSE.txt`. To wizualny zamiennik, nie wyodrębniona czcionka producenta. Ikony klawiszy: istniejący `lucide-react`.

## Sprawdzenie

Projekt wymaga Node24. `npm run lint`, `npm test` (w tym przełączanie scen w `tests/f50-home-lighting.test.mjs`) oraz `SITE_BASE=/delitech-darek/Janka/ npm run build:preview`. Sprawdzić przeglądarkę na desktopie i telefonie: oba światła, Kino, ALL OFF → kuchnia, temperaturę 18–26°C i blokady, klik i przytrzymanie rolet, zmianę panelu bez utraty stanu, przełączanie ekranów LS TOUCH kwadratami i gestem (również zaczętym na strzałce), reset oraz obsługę klawiaturą.
