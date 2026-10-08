import type { PageId } from './types';

// Adresy i metadane stron. Treści widoczne na stronie edytujemy w src/pages i src/components.
export const pages: Record<PageId, { path: string; title: string; description: string }> = {
  "home": {
    "path": "/",
    "title": "Strona główna | InteliSpaces",
    "description": "Projektujemy, wykonujemy i uruchamiamy automatykę KNX dla nowoczesnych biur, domów i apartamentów. Łączymy komfort użytkownika, energię pod kontrolą i dopracowany detal wnętrza."
  },
  "architects": {
    "path": "/architects/",
    "title": "Dla architektów | InteliSpaces",
    "description": "Jesteśmy technicznym partnerem Twojej pracowni. Dbamy o to, aby instalacja automatyki i sterowania nie popsuła czystości Twojej architektury. Przejmujemy koordynację branżową i przygotowujemy precyzyjne wytyczne podtynkowe."
  },
  "homes": {
    "path": "/homes/",
    "title": "Domy i apartamenty | InteliSpaces",
    "description": "„Komfort od pierwszego dotknięcia.” Tworzymy spójne instalacje KNX w domach jednorodzinnych, willach i luksusowych apartamentach. Zastępujemy baterie włączników na ścianach szlachetnymi manipulatorami JUNG i automatycznymi scenami."
  },
  "offices": {
    "path": "/offices/",
    "title": "Biura | InteliSpaces",
    "description": "W dużych strefach open space kluczem jest unikanie olśnienia i zmęczenia wzroku pracowników. Magistrala KNX zintegrowana z DALI-2 automatycznie dopasowuje natężenie i temperaturę barwową opraw do ilości światła wpadającego przez fasadę szklaną (Daylight Harvesting)."
  },
  "about": {
    "path": "/about/",
    "title": "Jak pracujemy | InteliSpaces",
    "description": "Delitech Smart Spaces powstał z potrzeby wypełnienia luki pomiędzy światem ambitnej architektury a surową inżynierią instalacyjną. Nie pozycjonujemy się jako sprzedawca elektronicznych gadżetów smart home. Jesteśmy kompetentnym partnerem technicznym i projektowym dla inwestorów, architektów wnętrz, projektantów instalacji oraz generalnych wykonawców fit-out."
  },
  "team": {
    "path": "/team/",
    "title": "Kim jesteśmy | InteliSpaces",
    "description": "Wieloletnie doświadczenie w branży IT, w zarządzaniu projektami w dużych korporacjach w srodkowisku ściśle regulowanym. Odpowiedzialny za wspópłprace z projektatnami,  koncepcje techniczne, konsutlacje z Inwestorem,  programowanie podzespołów KNX oraz nadzór nad wdrożeniami."
  },
  "projects": {
    "path": "/projects/",
    "title": "Salon i przykłady | InteliSpaces",
    "description": "Architektura systemu obejmująca centralne zarządzanie oświetleniem DALI-2, koordynację 28 klimakonwektorów 4-rurowych, integrację sal konferencyjnych z systemem wideokonferencji oraz automatyczne procedury redukcji poboru mocy po godzinach pracy."
  },
  "solutions": {
    "path": "/solutions/",
    "title": "Rozwiązania | InteliSpaces",
    "description": "Zobacz poszczególne elementy układanki. Każdy moduł projektujemy z dbałością o najwyższą niezawodność, ergonomię użytkowania oraz kompatybilność na dekady."
  },
  "knowledge": {
    "path": "/knowledge/",
    "title": "Wiedza | InteliSpaces",
    "description": "Optymalnym momentem jest faza koncepcji architektonicznej lub projektu budowlanego/wykonawczego, ZANIM elektryk rozpocznie układanie tras kablowych. KNX wymaga topologii magistralnej (przewód zielony KNX YCYM) doprowadzonej do włączników i czujników oraz sprowadzenia obwodów wykonawczych do rozdzielnicy głównej. Wczesne zaangażowanie pozwala uniknąć prucia ścian i niepotrzebnych kosztów tradycyjnego okablowania."
  },
  "knx": {
    "path": "/knx/",
    "title": "Standard KNX | InteliSpaces",
    "description": "W świecie technologii, w którym aplikacje znikają po kilku latach, a producenci zamykają swoje chmury, KNX jest jedynym otwartym standardem automatyki budynkowej z ponad 30-letnią nieprzerwaną historią i pełną kompatybilnością wsteczną."
  },
  "contact": {
    "path": "/contact/",
    "title": "Kontakt | InteliSpaces",
    "description": "Warszawa i okolice · realizacje w całej Polsce. Przeanalizujemy rzuty architektoniczne, wskażemy optymalne rozwiązania instalacji KNX i przygotujemy rzeczowy kosztorys."
  }
};
