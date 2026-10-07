# Backend Projektanta KNX

Laravel 13 + Filament 5, PHP 8.4. Interfejs projektanta pozostaje w `../planner`, a WordPress zarządza treściami strony. KNX ma własną bazę danych, konta i prywatne dokumenty.

## Uruchomienie deweloperskie

```sh
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
# Zbuduj ../planner i skopiuj dist/ do public/planner/
php artisan knx:bootstrap-admin administrator@example.org
php artisan serve
```

Komenda pierwszego administratora jest dostępna tylko w pustej bazie; zapisuje dane dostępowe w prywatnym pliku zamiast wypisywać hasło. Panel: `/admin`, edytor: `/editor`. Nie publikuj pliku dostępowego.

W `.env` skonfiguruj `APP_URL`, `WEBSITE_URL`, bazę oraz bezpieczne ciasteczka. Przy podkatalogu CF sesja ma ścieżkę `/projektant-knx`. Na środowisku z TLS używaj `SESSION_SECURE_COOKIE=true`, `SESSION_ENCRYPT=true`, `APP_DEBUG=false`. Pocztę skonfiguruj osobno; aktualna instalacja nie wysyła zaproszeń ani powiadomień.

## Uprawnienia i trwałość

- Role `member` i `admin`; dezaktywowane konta nie mogą używać panelu/API.
- Właściciel i wskazani współpracownicy mogą edytować projekt; właściciel/admin zarządza udostępnieniem. Tylko admin zarządza kontami.
- Pliki są pobierane przez kontroler po sprawdzeniu dostępu do projektu. Nie twórz `storage:link` dla prywatnych załączników.
- Zapis projektu, rewizji i przekazanego briefu odbywa się transakcyjnie; niezgodna rewizja zwraca 409. Ostatnie 30 rewizji i niezmienne briefy są przechowywane osobno.
- Każdy zapis wymaga CSRF; logowanie i API mają ograniczenie częstotliwości. MFA TOTP z kodami odzyskiwania jest dostępne w profilu i wymaga skonfigurowania przez użytkownika.

## Sprawdzenie

`php artisan test --compact` używa bazy SQLite w pamięci oraz sztucznego magazynu plików. Testy obejmują izolację kont, uprawnienia, pliki, odrzucanie nieprawidłowych danych, konflikty wersji i odtwarzanie funkcji przycisków/pozycji PDF. Nie uruchamiaj testów z konfiguracją produkcyjnej bazy.

## Wdrożenie CF

Zobacz `../DEPLOYMENT.md`. Kod i vendor są wersjonowanym artefaktem, a `.env` i `storage` są współdzielone między wydaniami na serwerze. Migracje muszą być zgodne ze starszym kodem i nie usuwać istniejących danych. Automat tworzy kopię bazy i prywatnych plików przed zmianą. Powrót kodu nie przywraca starej bazy.
