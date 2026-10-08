# InteliSpaces - Projektant KNX

Frontend React przeniesiony z gałęzi Janka i rozwinięty na podstawie prac z czatu PS9 ELDSGN. Obecny backend to Laravel + Filament w `../knx-backend`; stary serwer ze wspólnym hasłem nie jest wdrażany.

## Obsługa

1. Inwestycja: dane projektu, zakres, priorytety i prywatne pliki PDF/JPEG/PNG.
2. Pomieszczenia: obwody i punkty sterowania z trwałymi numerami P01, P02 itd.
3. Sterowanie: punkty pogrupowane po lewej według pomieszczeń, sensor/przycisk/panel pośrodku, funkcje klawiszy po prawej. Krótkie i długie naciśnięcie mogą wskazywać różne obwody lub sceny. Pod edytorem znajduje się rzut PDF.
4. Sceny: wyzwalanie, działania, warunki i integracje.
5. Brief: PDF ze zdjęciami sensorów, funkcjami każdego klawisza i oryginalnymi rzutami z numerami punktów; XLSX i JSON; zapis niezmiennej wersji briefu dla zespołu.

Punkty można przeciągać z lewego panelu na rzut, przesuwać na nim lub umieszczać narzędziem wskazywania pozycji. Kółko/przyciski powiększają rzut, narzędzie dłoni go przesuwa. Strzałki przesuwają wybrany znacznik, Shift zwiększa krok. Dostępny jest duży widok rzutu i dokumenty wielostronicowe (do 200 stron). Pozycje są zapisane względem dokumentu i strony niezależnie od wielkości ekranu. Zapisywany jest też widok planszy.

## Konta i dane

Każdy użytkownik ma konto Laravel. Widzi własne i udostępnione projekty; administrator widzi wszystkie. Współpracowników wybiera właściciel projektu lub administrator w Filament. Nie ma publicznej rejestracji ani wspólnego hasła. MFA można włączyć w profilu panelu.

API i pliki wymagają sesji. Załączniki pozostają w prywatnym magazynie na CF. Zapis używa numeru rewizji: równoczesna edycja nie może po cichu nadpisać nowszej wersji. Zachowywanych jest 30 ostatnich rewizji oraz przekazane briefy. Odpięty plik pozostaje dostępny w zapisanej wersji briefu.

Limity: 100 projektów na właściciela, 100 pomieszczeń, 200 obwodów/pomieszczenie, 500 punktów, 100 scen, 20 aktywnych załączników, 12 MB/plik, 256 MB plików na projekt. Wysłanie briefu zapisuje go w panelu; nie wysyła maila i nie uruchamia żadnego urządzenia.

## Budowanie

Node 24:

```sh
npm ci
npm test
npm run build
```

Wynik `dist/` trafia do `knx-backend/public/planner/`. Laravel renderuje stronę edytora z adresem API i tokenem CSRF. Sam `npm run dev` jest tylko podglądem interfejsu; pełny przepływ wymaga backendu. Nie zastępuj logowania sprawdzaniem hasła w JavaScript.

Kod publikujemy przez PR do `main`. Automat buduje statyczną stronę i konfigurator, a CF pobiera oba artefakty bieżącego commita. Gałęzie `Janka`, `Darka` i `main` mają podgląd Pages z `VITE_KNX_DEMO=1`: przykład i pliki istnieją wyłącznie w pamięci karty, bez dostępu do prawdziwych projektów. Szczegóły są w `../DEPLOYMENT.md`. Bazy, hasła, pliki projektantów i wygenerowane briefy nie trafiają do Git.

## Materiały

Zdjęcia JUNG F40/F50/LS TOUCH są referencyjne; wybór koloru nie potwierdza dostępności konkretnego wykonania. Brief zbiera wymagania i nie jest projektem wykonawczym ani konfiguracją ETS. Fonty Noto Sans zawierają licencję SIL OFL, ikony pochodzą z Lucide. Biblioteki PDF/XLSX są ładowane na żądanie.
