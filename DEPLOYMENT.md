# GitHub → Cyber_Folks

## Źródła i współpraca

- Repozytorium: `daromajowy/delitech-darek`.
- `Darka`: prace Darka i Claude Code. Po synchronizacji zawiera tę samą wersję WordPressa co `main`.
- `main`: zatwierdzony kod, z którego CF pobiera paczkę po testach.
- Codex pracuje na `codex/<zadanie>` utworzonej ze świeżego `main`; zadania przechodzą przez pull request do `main`. Po przyjęciu zmian Darek scala `main` do swojej gałęzi.
- Historia obu gałęzi sprzed migracji: `backup/main-before-wordpress-20261007` i `backup/darka-before-wordpress-20261007`.
- `Janka` nie jest zmieniana w tej synchronizacji. Zawiera wcześniejsze, osobne prace; nie używaj jej starego workflow Pages do publikacji WordPressa.

## Co jest w Git, a co w bazie

Git zawiera kod React, własny motyw i wtyczkę WordPress, film i obrazy źródłowe, skrypty budowania oraz publiczną kopię treści `content/cf-snapshot-20261007.json`. Jest ona punktem odniesienia, nie eksportem całej bazy.

Teksty i zdjęcia zmieniane w CMS, konta użytkowników, zapytania, prywatne dokumenty, ustawienia i hasła pozostają na CF. Zmiany układu/funkcji trafiają do Git. Aktualizacja treści istniejącej strony przez kod wymaga jawnego skryptu migracji z kontrolą dotychczasowej wartości; samo zmienienie tekstu zapasowego w React nie zastąpi tekstu zapisanego w CMS. Automat nigdy nie uruchamia importu treści ani SQL.

## Automatyczna publikacja

1. `Darka` i pull requesty: `npm ci`, TypeScript, budowanie WordPressa, składnia PHP, testy bezpieczeństwa paczki.
2. `main`: te same kontrole, następnie GitHub Release `cf-<pełny SHA>` z `site.tar.gz` i SHA-256.
3. CF co 3 minuty sprawdza `main`. Przyjmuje wyłącznie paczkę bieżącego SHA; starsza lub niepełna paczka nie jest instalowana.
4. Kontroler sprawdza hash, listę plików i składnię PHP. Tworzy kopię obecnego kodu i bazy, włącza na chwilę tryb konserwacji i podmienia wyłącznie `wp-content/themes/intelispaces` oraz `wp-content/plugins/intelispaces-backend`.
5. Po kontroli WordPressa publikuje identyfikator wdrożenia. W razie błędu wraca poprzedni kod; baza i uploads nie są podmieniane.
6. Workflow sprawdza identyfikator na CF. Zielony etap „Confirm deployment” oznacza potwierdzenie aktualizacji hostingu.

Aktualny cel: **https://horcwnciix.cfolks.pl/wordpress/**, czyli utworzona instancja testowa. Proces nie przełącza domeny intelispaces.pl i nie dotyka PS9. Zmiana celu produkcyjnego będzie osobnym wdrożeniem.

Nie ma hasła SSH ani klucza hostingu w GitHubie. Używany jest krótkotrwały `GITHUB_TOKEN` do publikacji paczki w tym samym repozytorium; CF pobiera publiczne paczki przez HTTPS. Dlatego repozytorium musi pozostawać publiczne, dopóki nie zostanie skonfigurowany osobny mechanizm uwierzytelniania. Tylko zatwierdzony kod należy scalać do `main` — PHP motywu i wtyczki działa z uprawnieniami konta WordPressa.

Domyślna gałąź repozytorium jest obecnie `Darka`. Właściciel może ustawić `main` jako domyślną i włączyć ochronę PR/checków. Jeżeli zmieniacie same workflow, zadbajcie, by `Darka` zawierała tę samą ich wersję co publikowany `main` (GitHub ogranicza tworzenie release z workflow różnymi od gałęzi domyślnej dla `GITHUB_TOKEN`).

## Obsługa na CF

- Kontroler i konfiguracja: `/home/horcwnciix/intelispaces-deploy/` (poza public_html).
- Stan: `deployed.json`; log: `deploy.log`; kopie: `backups/<czas>-<sha>/`.
- Pauza: utwórz plik `PAUSED` w katalogu kontrolera. Wznów przez usunięcie tego pliku.
- Ręczne sprawdzenie: `/usr/bin/python3 /home/horcwnciix/intelispaces-deploy/cf-deploy.py --config /home/horcwnciix/intelispaces-deploy/config.json`.
- Powrót do wcześniejszego kodu: cofnij wadliwą zmianę nowym commitem w `main`, aby ponownie przeszła CI. Awaryjnie wstrzymaj kontroler i przywróć oba katalogi z kopii kodu. Nie importuj starej bazy bez analizy nowszych danych.
- Kontroler nie aktualizuje własnego kodu automatycznie. Jego zmiany wymagają osobnej kontroli i instalacji przez SSH.
- Kopie wdrożeniowe są zachowywane; okresowo sprawdzaj miejsce i ustal retencję. Kopie Installatrona działają niezależnie.

## Lokalny test

Node 22: `npm ci`, `npm run lint`, `npm run build:wordpress`.
Python: `python -m unittest discover -s tests -v`.
Paczka: `python scripts/package-wordpress.py`.
Pełny test formularzy na stagingu: zgodnie z `WORDPRESS.md`.

## Projektant KNX: Laravel + Filament

Źródłem frontendowym są Janka oraz rozwinięcie punktów/klawiszy/PDF z prac PS9 ELDSGN. Jest ono przeniesione jako kod; hosting PS9 i Elektrodesign nie jest modyfikowany. Stary kontroler PHP ze wspólnym hasłem został zastąpiony osobnymi kontami Laravel.

- Frontend: `planner/`, Node 24. Backend: `knx-backend/`, PHP 8.4, Composer, Laravel 13, Filament 5.
- Adres testowy: `https://horcwnciix.cfolks.pl/projektant-knx/`; panel `/admin`, edytor `/editor`.
- W menu WordPressa: Dla architektów → Projektant KNX. Adres można zmienić opcją WP `is_knx_url`.
- Prywatna aplikacja: `public_html/.knx-laravel/releases/<sha>-<czas>`, symlink `current`; trwałe `.env` i `storage` w `shared/`. Ze względu na open_basedir CF prywatny katalog jest wewnątrz public_html, z bezwzględną blokadą HTTP przez `.htaccess`. Bez tej ochrony instalacja jest niedopuszczalna.
- Publicznie dostępne są tylko front controller i statyczne zasoby w `public_html/projektant-knx/`. Dane projektu/plików wymagają zalogowania.
- Osobna baza `horcwnciix_knx` na instancji MariaDB 10.11. Konto WordPress nie jest automatycznie kontem KNX. Administrator zarządza użytkownikami w Filament.

CI wykonuje testy modelu React, testy Laravel na izolowanym SQLite oraz walidację paczek. Release `cf-<sha>` zawiera dodatkowo `knx.tar.gz` i `knx.sha256` bez `.env`, danych, storage i testowych projektów. `scripts/cf-deploy-knx.py` jest drugim kontrolerem CF, z osobną blokadą procesu i stanem `deployed-knx.json`. Wspólny plik `PAUSED` zatrzymuje oba kontrolery; `KNX_PAUSED` zatrzymuje tylko KNX. Kontrolery nie aktualizują się automatycznie.

Przed wydaniem KNX wykonywany jest dump bazy oraz archiwum prywatnych plików z SHA-256 w `intelispaces-deploy/knx-backups/`. Poprzednie wydanie kodu i publiczne zasoby pozostają dostępne do cofnięcia. Aktualizacja podmienia kod, wykonuje migracje i sprawdza logowanie oraz odmowę anonimowego dostępu do API. Dopiero potem publikuje `/projektant-knx/release.json`. Workflow potwierdza **oba** znaczniki: WordPress i KNX.

Migracje wdrażane automatycznie muszą być addytywne i zgodne wstecz. Nie wolno automatycznie importować starej bazy ani usuwać kolumn/danych podczas powrotu do poprzedniego kodu. Przy niepowodzeniu przeanalizuj log i stan migracji przed ponowieniem.

Aktualne kopie wdrożeniowe są na tym samym koncie CF; nie zastępują kopii poza hostingiem ani ustalonej retencji. Integracja nie przełącza DNS intelispaces.pl. Wysyłka maili, publiczna rejestracja i połączenie z kontami WordPressa nie są włączone.
