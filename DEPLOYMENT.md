# InteliSpaces: GitHub → Cyber_Folks

## Współpraca i podglądy

- Repozytorium: `daromajowy/delitech-darek`.
- Codex pracuje na `Janka`, Darek na `Darka`. Zatwierdzone zmiany trafiają do `main`, który automatycznie publikuje **InteliSpaces Staging**. Produkcja wymaga osobnego, ręcznego uruchomienia publikacji po testach.
- Staging strony: `https://staging.intelispaces.pl/`. Staging konfiguratora i panelu: `https://knx-staging.intelispaces.pl/`.
- Podglądy: `https://daromajowy.github.io/delitech-darek/Janka/`, odpowiednio `/Darka/` i `/main/`.
- Konfigurator w podglądzie pod `projektant-knx/` używa przykładowych danych wyłącznie w pamięci karty. Nie łączy się z produkcyjnym API; odświeżenie usuwa zmiany. Formularze podglądu nie wysyłają zgłoszeń.
- Przed pracą pobierz gałąź i sprawdź różnice. Uzgadniaj wspólne modele i migracje bazy; nie nadpisuj nieznanych zmian ani nie używaj force push.

## Architektura i dane

- `https://intelispaces.pl/`: 11 statycznych stron React/Vite, wygenerowanych także jako HTML. WordPress nie jest wymagany.
- Teksty edytujemy bezpośrednio w `src/pages/` i `src/components/`; poradniki w `src/content/guides.ts`. Metadane i adresy są w `src/page-config.ts`, obrazy oraz film w `src/assets/`. Nie ma dodatkowej warstwy CMS ani JSON-u nadpisującego treść komponentów. Instrukcja pracy: `README.md`.
- `https://knx.intelispaces.pl/`: jedna aplikacja React + Laravel 13 + Filament 5, PHP 8.4. Panel: `/admin`, edytor: `/editor`. Stary adres `intelispaces.pl/projektant-knx/` przekierowuje na nową subdomenę.
- Konta, pracownie, projekty, rewizje i dokumenty pozostają w istniejącej bazie KNX i prywatnym magazynie CF.
- Formularze strony trafiają do `/api/inquiries` w Laravel. Pola i metadane plików są szyfrowane kluczem aplikacji; załączniki pozostają prywatne. Odczytuje je wyłącznie aktywny administrator w panelu. Powiadomienia e-mail nie są częścią tego wdrożenia.
- Publiczny formularz ma osobny zakres CORS, limity i walidację. Prywatne API projektów zachowuje uwierzytelnianie, CSRF i kontrolę dostępu do pracowni.
- PS9 i Elektrodesign pozostają poza zakresem. Późniejsze osadzenie konfiguratora korzystałoby z tej jednej aplikacji.

## Publikacja

Workflow `cf.yml` sprawdza TypeScript, model i demo konfiguratora, uprawnienia Laravel, formularze, izolację środowisk i walidację paczek. `main` publikuje release `cf-<SHA>`: `site.tar.gz`, `knx.tar.gz` oraz SHA-256. Paczki nie zawierają `.env`, bazy ani dokumentów klientów.

CF co 3 minuty sprawdza aktualny `main` i wdraża go na staging. Strona i KNX są sprawdzane razem, a oznaczenie `ready` pojawia się dopiero po kontroli obu aplikacji. Produkcja pobiera wyłącznie wersję zatwierdzoną w ręcznym workflow `promote.yml`; samo przesunięcie `main` nie uprawnia do publikacji na produkcji.

Kontroler sprawdza konto, serwer, katalog, domenę, bazę, SHA i zawartość obu archiwów przed ich użyciem. Przed podmianą zachowuje poprzedni kod, bazę i pliki danego środowiska. KNX przechodzi krótki tryb konserwacji; migracje muszą być addytywne i zgodne z poprzednim kodem. Cofnięcie kodu nie przywraca starej bazy ani nie usuwa nowszych projektów.

### Ręczna publikacja po testach

1. Sprawdź stronę oraz konfigurator na stagingu. Pomarańczowe oznaczenie **InteliSpaces Staging** pokazuje 12 znaków identyfikatora wersji; po rozwinięciu zawiera link do publikacji.
2. Otwórz [Actions → Publikuj staging na produkcji](https://github.com/daromajowy/delitech-darek/actions/workflows/promote.yml), kliknij **Run workflow** i wklej tę wersję. Można wybrać gałąź `main`; workflow zawsze pobiera narzędzie publikacji z `main`. Opcja **Tylko sprawdź gotowość** nie publikuje niczego.
3. Workflow odrzuci inną, niekompletną albo zmienioną w trakcie sprawdzania wersję. Zapisze autoryzowane żądanie GitHub Deployment z dokładnym SHA i sumami obu przetestowanych archiwów.
4. CF opublikuje te same paczki na produkcji, zachowując jej konta, bazę, pliki i sekrety. Stagingowe adresy i oznaczenie testowe są jedynymi dodatkami konfiguracyjnymi do statycznej paczki. Nie ma kopiowania testowej bazy na produkcję ani przebudowy kodu podczas promocji.
5. Zielony workflow oznacza potwierdzenie strony i KNX na produkcji. Przerwany lub błędny workflow nie autoryzuje późniejszego rozpoczęcia publikacji. Sprawdź logi w razie błędu, szczególnie jeżeli jedna aplikacja zdążyła się już zaktualizować.

Każda aplikacja udostępnia `/release.json` z SHA, środowiskiem i sumą archiwum oraz `/deployment.json` z wynikiem całego wdrożenia. Workflow stagingu dodatkowo sprawdza gotowość do ręcznej promocji, bez wysyłania żądania publikacji produkcyjnej.

Staging ma własną bazę `horcwnciix_knxstage`, klucz szyfrowania, konta, sesje i magazyn plików. Nie zawiera skopiowanych projektów ani formularzy klientów. Ma blokadę indeksowania i transport poczty `log`; formularze akceptują wyłącznie źródło `staging.intelispaces.pl`. Produkcja używa bazy `horcwnciix_knx` i `APP_ENV=production`. Oba środowiska działają na tym samym dedykowanym koncie CF.

GitHub nie przechowuje hasła SSH ani klucza CF. Kontroler pobiera publiczne paczki HTTPS; repozytorium musi pozostać publiczne do czasu wdrożenia osobnego uwierzytelniania. Sekretów, baz i dokumentów klientów nie wolno dodawać do Git ani podglądów.

Domyślna gałąź to `Darka`. Przy zmianie workflow jej wersja musi obejmować workflow publikowany na `main` (ograniczenie tworzenia Releases przez `GITHUB_TOKEN`).

## Obsługa CF i odzyskiwanie

- Konto `horcwnciix`, serwer `s78.cyber-folks.pl`.
- Strona: `/home/horcwnciix/domains/intelispaces.pl/public_html`.
- Laravel: `public_html/knx/app`; document root subdomeny: `public_html/knx`. Publiczny `index.php` uruchamia `app/public/index.php`, a zatwierdzone katalogi zasobów mają linki do `app/public`. Brama blokuje wszystkie żądania HTTP do `app`, plików ukrytych i `cgi-bin`; sam katalog aplikacji dodatkowo ma `Require all denied`. Baza, `.env` i pliki klientów nie są wystawiane. Statyczny deploy podmienia wyłącznie `knx/index.html`, nigdy katalog aplikacji ani bramę.
- **Ważne dla CF:** ustawienie document root na `app/public` po przebudowie konfiguracji hostingu zawęża `open_basedir` do samego `public` i blokuje Laravelowi odczyt własnego `vendor`. Dlatego utrzymujemy wyżej opisaną publiczną bramę i izolację PHP do `knx` (odpowiednio `knx-staging`). Zmianę katalogu na tym hostingu wykonuj w narzędziu CF „Przypisz katalog domeny”; ogólny endpoint DirectAdmin zwraca inne, nieefektywne ustawienia. Po zmianie sprawdź także efektywne `open_basedir`: CF może zachować poprzednią ścieżkę do czasu przebudowy reguł separacji. Separacja musi pozostać włączona; sam komunikat o zapisaniu katalogu nie potwierdza działania PHP.
- Kontrolery poza WWW: `/home/horcwnciix/intelispaces-deploy/`. Konfiguracja: `config.json`.
- Staging: strona w `public_html/staging`, aplikacja w `public_html/knx-staging/app`; document root konfiguratora to `knx-staging` z taką samą publiczną bramą. Kontroler i kopie: `/home/horcwnciix/intelispaces-staging-deploy/`.
- Jeden kontroler na środowisko: `cf-deploy-release.py --config .../config.json`. Stare punkty wejścia `cf-deploy-static.py` i `cf-deploy-knx.py` przekazują sterowanie temu samemu mechanizmowi; nie omijają ręcznej zgody na produkcję.
- Stan: `deployed.json`, `deployed-knx.json`, `deployed-release.json`; log: `release-deploy.log`; kopie: `backups/`, `knx-backups/`. Archiwa wydań są w `releases/<SHA>/`.
- `PAUSED` albo `KNX_PAUSED` w katalogu kontrolera zatrzymuje całe wdrożenie tego środowiska, aby nie publikować połowy nowej wersji. Usuń plik, aby wznowić.
- Kontrolery nie aktualizują własnego kodu; zmiana skryptów wymaga sprawdzonej instalacji SSH.
- **Ograniczenie Installatrona (sprawdzone 08.10.2026):** katalog CF obsługuje Laravel do 13.17.0, aplikacja używa 13.35.0. Panel odrzuca tę wersję i po odświeżeniu zmienia ścieżkę wpisu z katalogu aplikacji na `public`. Jedna kopia została utworzona i odczytana, ale kolejna próba po odświeżeniu wykazała niezgodność. Kopii i klonowania przez „Moje aplikacje” nie należy uznawać za działające do czasu poprawki CF. Nie zmieniaj wersji biblioteki ani układu chroniącego prywatne pliki tylko dla zgodności z katalogiem.
- Aktywny wpis Laravel zachowano informacyjnie; automatyczne aktualizacje i kopie Installatrona są wyłączone. Kopie wykonywane przy publikacji obejmują bazę, prywatne pliki i poprzedni kod, niezależnie od panelu. Pełną kopię konta można wykonać standardowym narzędziem kopii DirectAdmin. Prywatne `.env` używa `DB_HOST=127.0.0.1`, `DB_PORT=3308`.
- Rollback: nowy commit cofający zmianę na `main`, ponownie sprawdzony w CI i na stagingu, następnie ręczna promocja. Awaryjnie wstrzymaj kontrolery i przywróć kod z kopii, zachowując aktualne pliki klientów. Nie importuj starej bazy bez analizy nowszych danych.
- Kopia sprzed migracji: `/home/horcwnciix/intelispaces-static-backup-20261008T085937Z/` (pliki, obie bazy, cron, konfiguracja, SHA-256).
- Kopie na tym samym koncie nie zastępują kopii poza hostingiem. Klon musi mieć osobną bazę i magazyn, tryb testowy i wyłączone wysyłki. Nigdy nie podłączaj podglądu do produkcyjnej bazy.

## Testy lokalne

Node 24: `npm ci`, `npm run lint`, `npm run build`. Podgląd: `SITE_BASE=/ npm run build:preview`.

Planner: `npm ci --prefix planner`, `npm test --prefix planner`, `npm run build --prefix planner`. Demo wymaga `VITE_KNX_DEMO=1` podczas budowania; produkcja nie ustawia tej flagi.

Python: `python -m unittest discover -s tests -v`, `python scripts/package-site.py`.

Laravel: skopiuj `.env.example` do prywatnego `.env`, zainstaluj Composer, wygeneruj lokalny klucz, skopiuj build planner do `public/planner`, uruchom `php artisan test --compact` i `vendor/bin/pint --test`. Testy używają izolowanego SQLite, nie bazy CF.
