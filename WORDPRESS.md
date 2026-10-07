# InteliSpaces / DARKA — WordPress na Cyber_Folks

Źródło: `daromajowy/delitech-darek`, gałąź `Darka`, commit `175c4a97f17af86119de7f660afaba5943689a49`.
Prace migracyjne: `codex/wordpress-cf`. Zakres: WordPress i strona; bez konfiguratora i Laravel/Filament.

## Uruchomiona instancja

- Strona testowa: https://horcwnciix.cfolks.pl/wordpress/
- Panel: https://horcwnciix.cfolks.pl/wordpress/wp-admin/
- DirectAdmin: https://s78.cyber-folks.pl:2223 → Moje aplikacje → **InteliSpaces — DARKA / test** → zaloguj.
- Installatron ID: `ernjm6kkxk0ggwsg048888so4`.
- Katalog: `/home/horcwnciix/domains/horcwnciix.cfolks.pl/public_html/wordpress`.
- Baza: `horcwnciix_iicb1`, osobna dla tej instancji.

Hasła i klucze nie są przechowywane w repozytorium. Wejście przez SSO DirectAdmin działa; własne hasło oraz parowanie 2FA użytkownik ustawia w swoim profilu. Wtyczka Two Factor jest zainstalowana, ale drugi składnik nie jest jeszcze przypisany do konta.

## Edycja treści

- **Strony**: 11 podstron z gałęzi DARKA. W edytorze znajdują się bloki InteliSpaces z polami tekstowymi.
- **Elementy wspólne**: menu i nagłówek, stopka, komunikaty formularzy, prywatność, cookies oraz zdjęcia. Zdjęcia wybiera się z biblioteki mediów.
- Zachowany układ React korzysta z treści zapisanej w bazie WordPress. Tekst i zdjęcia zmieniają się bez przebudowy kodu. Film jest częścią motywu.
- Istniejące bloki InteliSpaces służą do edycji pól stałego układu, nie do przesuwania sekcji wizualnych. Nie duplikuj ani nie usuwaj tych bloków. Zmiana układu wymaga zmiany motywu.
- Zwykłe bloki Gutenberga można dopisywać pod istniejącą treścią. Nowe strony obsługują zwykłe bloki. Można podpiąć je do menu „Dodatkowe strony”.
- **Zapytania**: prywatne zgłoszenia formularzy i załączniki. Wysyłka powiadomień e-mail nie jest skonfigurowana.
- Treści źródłowe DARKA, w tym obietnice handlowe i dane zespołu, wymagają zatwierdzenia przed uruchomieniem produkcyjnym.

## Budowanie i wdrażanie

Aktualny proces GitHub → CF, zasady gałęzi i automatyczne wdrażanie opisuje `DEPLOYMENT.md`. Poniższe skrypty importu służą do założenia nowej instancji, nie do aktualizacji istniejącej bazy.

1. Użyj Node 22 i zainstaluj zależności przez `npm ci` (wersje są w `package-lock.json`).
2. `npm run lint` oraz `npm run build:wordpress`.
3. Spakuj katalogi `wordpress/intelispaces` i `wordpress/intelispaces-backend`. Wygenerowane `dist`, `media` i `templates` są wymagane na serwerze.
4. Przed wdrożeniem wykonaj kopię bazy i plików. Wgraj tylko własny motyw i wtyczkę. Nie nadpisuj `wp-config.php`, uploads ani bazy przy aktualizacji kodu.
5. `scripts/seed-wordpress.php` służy do pierwszego importu. Jest idempotentny i nie nadpisuje istniejących podstron. Uruchamiaj przez `wp eval-file` po aktywowaniu motywu i wtyczki.
6. Skrypty `extract-cms.mjs`, `connect-wordpress.py` i `repair-import.php` są narzędziami jednorazowej migracji. Nie uruchamiaj ich ponownie na treściach edytowanych przez użytkowników.
7. Na stagingu `scripts/verify-staging.php` sprawdza 11 tras, blokady dostępu, walidację formularza, zapis prywatnego zgłoszenia i pobieranie załącznika. Wymaga testowego `cms-test.png` obok skryptu; testowe zgłoszenie przenosi do kosza.

## Ochrona i ograniczenia hostingu

- HTTPS, WordPress staging, noindex, logowanie wymagane dla frontendu oraz REST; rejestracja publiczna wyłączona.
- Edytor plików PHP w panelu wyłączony; ograniczenie prób logowania; wtyczki ochronne mają automatyczne aktualizacje.
- Nonce, kontrola origin, walidacja danych i typów plików, limity rozmiaru i zgłoszeń.
- CF ogranicza PHP przez `open_basedir` do katalogu domeny. Załączniki znajdują się w `wp-content/intelispaces-private`, z blokadą HTTP `.htaccess` (sprawdzone 403), losowymi nazwami i uprawnieniami 0600. Pobieranie wyłącznie przez endpoint administratora z nonce. Przy migracji na Nginx trzeba dodać odpowiadającą regułę `deny all` i ponownie wykonać test bezpośredniego dostępu.
- Kopie Installatrona: 3 dzienne, 2 tygodniowe i 1 miesięczna na tym koncie hostingowym. Są to kopie na tym samym serwerze, nie niezależny backup zewnętrzny.
- PS9 i wcześniejszy hosting pozostają poza zakresem. DNS produkcyjnej domeny nie został przełączony.

## Wycofanie zmian

Kopie migracji są poza public_html w `/home/horcwnciix/intelispaces-migration/backup-20261007/`. Odtwarzanie pełnej kopii przez Installatron przywraca pliki oraz bazę; przed przywróceniem zachowaj nowsze zgłoszenia i treści. Aktualizacji produkcyjnej nie wykonuje się przez bezwarunkowe kopiowanie bazy stagingowej.
