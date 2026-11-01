import { DeviceMobile, Lightbulb, Lightning, MusicNotes, ShieldCheck, Tree, Wind } from '@phosphor-icons/react';
import { BlindsIcon } from './HomeTechnologyIcons';

export const homeIntegrationAreas = [
  {
    id: 'lighting', icon: Lightbulb, title: 'Światło i sceny', short: 'Jasność, barwa, nastrój. Osobno lub razem.',
    promise: 'Światło zaprojektowane do życia.',
    systems: ['Oświetlenie LED', 'DALI / DALI-2', 'Czujniki obecności'],
    everyday: ['Scena do pracy, kolacji lub odpoczynku.', 'Ściemnianie oraz zmiana bieli i koloru w odpowiednich oprawach.', 'Światło reagujące na obecność i ilość światła dziennego.'],
    project: ['Podział na obwody, grupy i sceny jeszcze na etapie projektu wnętrza.', 'Dobór sterownika do źródła: załączanie, ściemnianie, LED lub bramka DALI.', 'Zgodność opraw i zasilaczy z funkcją Tunable White lub RGBW.'],
    note: 'Efekt świetlny zależy od opraw, zasilaczy i sterowania. Sam przycisk nie dodaje możliwości ściemniania ani zmiany barwy.',
  },
  {
    id: 'climate', icon: Wind, title: 'Klimat i powietrze', short: 'Ogrzewanie, chłodzenie i wentylacja we współpracy.',
    promise: 'Przyjemna temperatura. Świeże powietrze.',
    systems: ['Ogrzewanie strefowe', 'Klimatyzacja', 'Rekuperacja', 'Pompa ciepła'],
    everyday: ['Inna temperatura w sypialni, łazience i salonie.', 'Wentylacja dopasowana do obecności lub pomiaru CO₂ i wilgotności.', 'Uzgodniona reakcja na otwarte okno i tryb nieobecności.'],
    project: ['Podział na strefy i lokalizacja czujników temperatury oraz jakości powietrza.', 'Interfejsy konkretnych central, klimatyzatorów i pomp ciepła.', 'Koordynacja grzania i chłodzenia z automatyką producenta urządzeń.'],
    note: 'Wymiana danych może odbywać się przez dedykowaną bramkę, Modbus lub zgodne wejścia sterujące. Zakres zależy od modelu urządzenia.',
  },
  {
    id: 'shading', icon: BlindsIcon, title: 'Osłony i pogoda', short: 'Rolety, żaluzje, zasłony i markizy.',
    promise: 'Wpuść światło. Zatrzymaj nadmiar ciepła.',
    systems: ['Napędy osłon', 'Stacja pogodowa', 'Czujniki okien'],
    everyday: ['Ustawienie rolet i lameli dla wybranej elewacji.', 'Zacienianie pomieszczeń zgodnie ze słońcem i porą dnia.', 'Reakcja markiz na wiatr oraz możliwość ręcznej zmiany ustawień.'],
    project: ['Rodzaj napędu, zasilanie, przewody i sposób przekazywania pozycji.', 'Podział elewacji oraz miejsce montażu stacji pogodowej.', 'Priorytety: ochrona osłon, polecenie domownika, automatyka.'],
    note: 'Funkcje ochronne dobiera się do wymagań producenta napędów i osłon. Nie każdy napęd udostępnia informację o swojej pozycji.',
  },
  {
    id: 'energy', icon: Lightning, title: 'Energia i ładowanie', short: 'Zużycie, fotowoltaika, magazyn i samochód.',
    promise: 'Wiesz, skąd płynie energia i na co ją zużywasz.',
    systems: ['Liczniki', 'Falownik PV', 'Magazyn energii', 'Ładowarka EV'],
    everyday: ['Podgląd poboru, produkcji i przepływów energii.', 'Ładowanie auta z uwzględnieniem nadwyżki z fotowoltaiki.', 'Priorytety odbiorników i ograniczanie szczytowego poboru.'],
    project: ['Punkty pomiarowe i dostępne dane falownika, magazynu oraz ładowarki.', 'Zgodna bramka lub interfejs, np. Modbus, oraz logika zarządzania energią.', 'Limit mocy, termin gotowości auta i priorytety użytkownika.'],
    note: 'To funkcje odpowiednio dobranego systemu zarządzania energią. Sam pomiar zużycia nie oznacza automatycznego sterowania ładowaniem.',
  },
  {
    id: 'protection', icon: ShieldCheck, title: 'Ochrona i dostęp', short: 'Alarm, okna, woda, domofon i bramy.',
    promise: 'Dom przekazuje informacje i reaguje na zdarzenia.',
    systems: ['Centrala alarmowa', 'Czujniki zalania', 'Wideodomofon', 'Bramy i kamery'],
    everyday: ['Podgląd otwartych okien i stanu alarmu.', 'Scena nieobecności powiązana z uzbrojeniem alarmu.', 'Powiadomienie o wycieku i sterowanie uzgodnionym zaworem wody.'],
    project: ['Lista sygnałów z centrali: stan, zdarzenia i dozwolone polecenia.', 'Interfejs wideodomofonu, kamer i napędów bram.', 'Uprawnienia, sposób potwierdzania poleceń oraz reakcje awaryjne.'],
    note: 'KNX może odbierać sygnały z systemów ochrony. Integracja nie zastępuje funkcji ani wymaganych zabezpieczeń systemu alarmowego lub pożarowego.',
  },
  {
    id: 'media', icon: MusicNotes, title: 'Muzyka i kino', short: 'Multiroom, ekran, projektor i sceny AV.',
    promise: 'Jeden gest zmienia salon w miejsce odpoczynku.',
    systems: ['Multiroom audio', 'TV / projektor', 'Ekran', 'System AV'],
    everyday: ['Muzyka w wybranych pomieszczeniach.', 'Scena Kino łącząca obraz, dźwięk, światło i zasłony.', 'Sterowanie głośnością lub źródłem z odpowiedniego panelu.'],
    project: ['Dobór urządzeń AV z obsługiwanym interfejsem lub API.', 'Strefy audio, okablowanie, sieć i miejsce na urządzenia.', 'Zakres poleceń oraz informacja zwrotna o stanie urządzeń.'],
    note: 'Integracja jest realizowana przez zgodny interfejs lub serwer. Nie każdy telewizor i odtwarzacz obsługuje te same polecenia.',
  },
  {
    id: 'garden', icon: Tree, title: 'Ogród i woda', short: 'Podlewanie, taras i wybrane funkcje basenu.',
    promise: 'Wygoda wychodzi poza ściany domu.',
    systems: ['Nawadnianie', 'Oświetlenie ogrodu', 'Czujniki', 'Automatyka basenu'],
    everyday: ['Podlewanie w ustalonych porach z uwzględnieniem warunków.', 'Scena Taras łącząca światło, osłony i muzykę.', 'Podgląd oraz wybrane nastawy automatyki basenu.'],
    project: ['Strefy podlewania, czujniki, elektrozawory i sposób kontroli pompy.', 'Sygnały dostępne z dedykowanego sterownika basenu.', 'Warunki blokowania pracy, komunikaty o awarii i obsługa ręczna.'],
    note: 'Ogród i basen wymagają własnego projektu instalacji. KNX łączy udostępnione funkcje; nie zastępuje specjalistycznej automatyki technologicznej.',
  },
  {
    id: 'control', icon: DeviceMobile, title: 'Aplikacje i obsługa', short: 'Przycisk, panel, telefon i dostęp zdalny.',
    promise: 'Każdy domownik steruje tak, jak mu wygodnie.',
    systems: ['Przyciski KNX', 'Panele', 'Serwer wizualizacji', 'Usługi głosowe'],
    everyday: ['Wspólna wizualizacja wybranych instalacji.', 'Własne sceny, harmonogramy i komunikaty.', 'Sterowanie spoza domu lub głosem po dobraniu odpowiedniej usługi.'],
    project: ['Zakres wizualizacji i funkcje, które mają działać lokalnie.', 'Dobór serwera, integracji IP, kont oraz sposobu dostępu zdalnego.', 'Uprawnienia, dokumentacja, kopia projektu i przekazanie obsługi.'],
    note: 'Podstawowe funkcje KNX mogą działać bez internetu. Dostęp zdalny i usługi chmurowe mają osobne wymagania; nie są automatycznie częścią każdego urządzenia.',
  },
];

