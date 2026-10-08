# InteliSpaces: GitHub → Cyber_Folks

## Współpraca i podglądy

- Repozytorium: `daromajowy/delitech-darek`.
- Codex pracuje na `Janka`, Darek na `Darka`. Zatwierdzone zmiany trafiają do `main`; tylko ta gałąź publikuje produkcję CF.
- Podglądy: `https://daromajowy.github.io/delitech-darek/Janka/`, odpowiednio `/Darka/` i `/main/`.
- Konfigurator w podglądzie pod `projektant-knx/` używa przykładowych danych wyłącznie w pamięci karty. Nie łączy się z produkcyjnym API; odświeżenie usuwa zmiany. Formularze podglądu nie wysyłają zgłoszeń.
- Przed pracą pobierz gałąź i sprawdź różnice. Uzgadniaj wspólne modele i migracje bazy; nie nadpisuj nieznanych zmian ani nie używaj force push.

## Architektura i dane

- `https://intelispaces.pl/`: 11 statycznych stron React/Vite, wygenerowanych także jako HTML. WordPress nie jest wymagany.
- `content/site.json`: aktualne publiczne treści wyeksportowane z CMS przed migracją. Edytuj je i komponenty w Git. Obrazy oraz film są w `src/assets/`.
- `https://knx.intelispaces.pl/`: jedna aplikacja React + Laravel 13 + Filament 5, PHP 8.4. Panel: `/admin`, edytor: `/editor`. Stary adres `intelispaces.pl/projektant-knx/` przekierowuje na nową subdomenę.
- Konta, pracownie, projekty, rewizje i dokumenty pozostają w istniejącej bazie KNX i prywatnym magazynie CF.
- Formularze strony trafiają do `/api/inquiries` w Laravel. Pola i metadane plików są szyfrowane kluczem aplikacji; załączniki pozostają prywatne. Odczytuje je wyłącznie aktywny administrator w panelu. Powiadomienia e-mail nie są częścią tego wdrożenia.
- Publiczny formularz ma osobny zakres CORS, limity i walidację. Prywatne API projektów zachowuje uwierzytelnianie, CSRF i kontrolę dostępu do pracowni.
- PS9 i Elektrodesign pozostają poza zakresem. Późniejsze osadzenie konfiguratora korzystałoby z tej jednej aplikacji.

## Publikacja

Workflow `cf.yml` sprawdza TypeScript, model i demo konfiguratora, uprawnienia Laravel, formularze i walidację paczek. `main` publikuje release `cf-<SHA>`: `site.tar.gz`, `knx.tar.gz` oraz SHA-256. Paczki nie zawierają `.env`, bazy ani dokumentów klientów.

CF co 3 minuty pobiera wyłącznie paczkę aktualnego `main`. Kontrolery sprawdzają konto, serwer, katalog, domenę, SHA i zawartość archiwum. Przed podmianą zachowują poprzedni kod, bazę i pliki. KNX przechodzi krótki tryb konserwacji; migracje muszą być addytywne i zgodne z poprzednim kodem. Cofnięcie kodu nie przywraca starej bazy ani nie usuwa nowszych projektów.

Obie domeny udostępniają `/release.json` z SHA. Etap „Confirm both applications” jest zielony dopiero po potwierdzeniu obu aplikacji.

GitHub nie przechowuje hasła SSH ani klucza CF. Kontroler pobiera publiczne paczki HTTPS; repozytorium musi pozostać publiczne do czasu wdrożenia osobnego uwierzytelniania. Sekretów, baz i dokumentów klientów nie wolno dodawać do Git ani podglądów.

Domyślna gałąź to `Darka`. Przy zmianie workflow jej wersja musi obejmować workflow publikowany na `main` (ograniczenie tworzenia Releases przez `GITHUB_TOKEN`).

## Obsługa CF i odzyskiwanie

- Konto `horcwnciix`, serwer `s78.cyber-folks.pl`.
- Strona: `/home/horcwnciix/domains/intelispaces.pl/public_html`.
- Laravel: `public_html/knx/app`; document root subdomeny: `knx/app/public`. Zachowuje to izolację PHP subdomeny do `public_html/knx`. Katalog aplikacji ma blokadę HTTP; nie zmieniaj document root na katalog aplikacji. Statyczny deploy podmienia wyłącznie `knx/index.html`, nigdy katalog aplikacji.
- Kontrolery poza WWW: `/home/horcwnciix/intelispaces-deploy/`. Konfiguracja: `config.json`.
- `cf-deploy-static.py --config .../config.json` aktualizuje stronę, `cf-deploy-knx.py --work .../intelispaces-deploy` aktualizuje KNX.
- Stan: `deployed.json`, `deployed-knx.json`; logi: `deploy.log`, `deploy-knx.log`; kopie: `backups/`, `knx-backups/`.
- `PAUSED` zatrzymuje oba kontrolery, `KNX_PAUSED` tylko konfigurator. Usuń odpowiedni plik, aby wznowić.
- Kontrolery nie aktualizują własnego kodu; zmiana skryptów wymaga sprawdzonej instalacji SSH.
- **Ograniczenie Installatrona (sprawdzone 08.10.2026):** katalog CF obsługuje Laravel do 13.17.0, aplikacja używa 13.35.0. Panel odrzuca tę wersję i po odświeżeniu zmienia ścieżkę wpisu z katalogu aplikacji na `public`. Jedna kopia została utworzona i odczytana, ale kolejna próba po odświeżeniu wykazała niezgodność. Kopii i klonowania przez „Moje aplikacje” nie należy uznawać za działające do czasu poprawki CF. Nie zmieniaj wersji biblioteki ani bezpiecznego document root tylko dla zgodności z katalogiem.
- Aktywny wpis Laravel zachowano informacyjnie; automatyczne aktualizacje i kopie Installatrona są wyłączone. Kopie wykonywane przy publikacji obejmują bazę, prywatne pliki i poprzedni kod, niezależnie od panelu. Pełną kopię konta można wykonać standardowym narzędziem kopii DirectAdmin. Prywatne `.env` używa `DB_HOST=127.0.0.1`, `DB_PORT=3308`.
- Rollback: nowy commit cofający zmianę na `main`, ponownie sprawdzony w CI. Awaryjnie wstrzymaj kontrolery i przywróć kod z kopii, zachowując aktualne pliki klientów. Nie importuj starej bazy bez analizy nowszych danych.
- Kopia sprzed migracji: `/home/horcwnciix/intelispaces-static-backup-20261008T085937Z/` (pliki, obie bazy, cron, konfiguracja, SHA-256).
- Kopie na tym samym koncie nie zastępują kopii poza hostingiem. Klon musi mieć osobną bazę i magazyn, tryb testowy i wyłączone wysyłki. Nigdy nie podłączaj podglądu do produkcyjnej bazy.

## Testy lokalne

Node 24: `npm ci`, `npm run lint`, `npm run build`. Podgląd: `SITE_BASE=/ npm run build:preview`.

Planner: `npm ci --prefix planner`, `npm test --prefix planner`, `npm run build --prefix planner`. Demo wymaga `VITE_KNX_DEMO=1` podczas budowania; produkcja nie ustawia tej flagi.

Python: `python -m unittest discover -s tests -v`, `python scripts/package-site.py`.

Laravel: skopiuj `.env.example` do prywatnego `.env`, zainstaluj Composer, wygeneruj lokalny klucz, skopiuj build planner do `public/planner`, uruchom `php artisan test --compact` i `vendor/bin/pint --test`. Testy używają izolowanego SQLite, nie bazy CF.
