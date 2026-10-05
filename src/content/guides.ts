import {investorGuide} from './investorGuide.ts';

export type Guide = {
  id: string;
  category: 'architekci' | 'biura' | 'inwestorzy';
  title: string;
  summary: string;
  sections: { title: string; paragraphs: string[] }[];
  checklist: string[];
  sources: { title: string; url: string }[];
};

export const guides: Guide[] = [
  investorGuide,
  {
    id: 'przyciski-i-scenariusze', category: 'architekci',
    title: 'Mniej przycisków, czytelniejsza obsługa',
    summary: 'Jak zaplanować sterowanie światłem, roletami i temperaturą bez przeładowania ścian.',
    sections: [
      { title: 'Zacznij od codziennych czynności', paragraphs: [
        'Przed wyborem osprzętu zapisz, co użytkownik robi przy wejściu do pomieszczenia, wieczorem i przy wyjściu z budynku. W salonie mogą to być sceny „Codziennie”, „Kolacja” i „Wyjście”. W sali spotkań: „Rozmowa”, „Prezentacja” i „Sprzątanie”. Każda scena powinna mieć prosty, przewidywalny rezultat.',
        'Nie każda funkcja potrzebuje osobnego klawisza. Rzadziej używane ustawienia można umieścić w aplikacji lub panelu, ale podstawowe światło powinno pozostać łatwo dostępne. Dobry projekt działa również dla gościa, który nie zna nazw wszystkich scen.'
      ]},
      { title: 'Wybierz funkcję, a potem ramkę', paragraphs: [
        'Rodzina wzornicza nie określa wszystkich możliwości urządzenia. Dla wybranego modelu sprawdź liczbę funkcji, sposób oznaczania przycisków, sygnalizację oraz obecność pomiaru temperatury. Przycisk wielofunkcyjny nie musi być ekranem dotykowym.',
        'JUNG LS 990 ma klasyczną ramkę; LS ZERO umożliwia jej zlicowanie z powierzchnią. Taki montaż trzeba uwzględnić na etapie przygotowania podłoża. Przed zamówieniem porównaj próbkę materiału w świetle, które rzeczywiście znajdzie się we wnętrzu.'
      ]},
      { title: 'Sprawdź projekt na krótkiej próbie', paragraphs: [
        'Wydrukuj układ klawiszy w skali i poproś osobę nieznającą projektu o wskazanie światła głównego i rolet. Jeżeli potrzebne jest długie objaśnienie, uprość nazwy lub podział funkcji. Ustal też wspólne zasady działania krótkiego i długiego naciśnięcia w całym obiekcie.'
      ]}
    ],
    checklist: ['Lista scen dla każdego pomieszczenia', 'Układ klawiszy i sposób ich opisania', 'Wysokości montażu oraz próbka wykończenia'],
    sources: [{ title: 'JUNG — LS ZERO i warianty montażu', url: 'https://www.jung-group.com/en-UK/Products/Switch-Ranges/LS-ZERO/' }]
  },
  {
    id: 'energia-w-biurze', category: 'biura',
    title: 'Oszczędności w biurze zaczynają się od pomiaru',
    summary: 'Obecność, światło dzienne i harmonogramy — jak ocenić ich wpływ bez obiecywania przypadkowych procentów.',
    sections: [
      { title: 'Ustal punkt odniesienia', paragraphs: [
        'Zbierz godziny użytkowania, moc oświetlenia oraz dostępne odczyty energii. Oddziel dni robocze od weekendów. Jeżeli porównujesz wyniki sprzed i po modernizacji, uwzględnij zmiany liczby pracowników, czasu pracy oraz ilości światła dziennego. Sam spadek rachunku nie mówi, która zmiana go spowodowała.'
      ]},
      { title: 'Dopasuj sterowanie do stref', paragraphs: [
        'Stanowiska przy oknach i stanowiska w głębi pomieszczenia mogą potrzebować innego poziomu doświetlenia. Sterowanie zależne od światła dziennego dostosowuje poziom oświetlenia; zmiana temperatury barwowej to osobna funkcja wymagająca odpowiednich urządzeń.',
        'Czujnik obecności dobierz do wielkości strefy i sposobu pracy. Osoba siedząca przy komputerze porusza się mniej niż ktoś przechodzący korytarzem. Zbyt krótki czas wyłączenia powoduje frustrację; zbyt długi ogranicza korzyść ze sterowania. Ustawienia warto skorygować po rozpoczęciu normalnej pracy biura.'
      ]},
      { title: 'Odbierz efekt, nie tylko instalację', paragraphs: [
        'Sprawdź działanie po godzinach, podczas spotkania i w słoneczny dzień. Ustal, kto może zmienić harmonogram oraz jak wrócić do ustawień podstawowych. Porównuj podobne okresy pomiarowe i zapisuj odstępstwa, np. pracę serwisową w weekend.',
        'Wynik zależy od stanu początkowego, urządzeń i sposobu użytkowania. Dlatego sensowna oferta opisuje metodę pomiaru oraz zakres sterowania, a nie gwarantuje identycznego procentu oszczędności w każdym obiekcie.'
      ]}
    ],
    checklist: ['Godziny pracy i użytkowanie stref', 'Pomiar bazowy oraz okres porównania', 'Scenariusze odbioru z użytkownikami'],
    sources: [{ title: 'DALI Alliance — pojęcia i funkcje sterowania', url: 'https://www.dali-alliance.org/about-us/terms.html' }]
  },
  {
    id: 'budzet-knx', category: 'inwestorzy',
    title: 'Jak przygotować porównywalny budżet KNX',
    summary: 'Co powinno znaleźć się w zapytaniu i ofercie, żeby porównać ten sam zakres prac.',
    sections: [
      { title: 'Metraż to za mało', paragraphs: [
        'Dwa obiekty o tej samej powierzchni mogą mieć inną liczbę obwodów światła, napędów rolet i stref temperatury. Różnicę robią też rodzaj osprzętu, integracje oraz stopień zaawansowania projektu. Sam przelicznik za metr kwadratowy nie zastąpi zestawienia funkcji.',
        'Przygotuj rzuty z nazwami pomieszczeń i krótką listę oczekiwań. Zaznacz elementy konieczne na start oraz te, które mogą powstać w kolejnym etapie. Pozwala to przewidzieć miejsce w rozdzielnicy i potrzebne okablowanie bez zamawiania całego wyposażenia od razu.'
      ]},
      { title: 'Porównuj kompletne pozycje', paragraphs: [
        'Poproś o osobne wskazanie projektu, urządzeń, rozdzielnic, montażu, programowania, integracji, uruchomienia i dokumentacji. Ustal, czy oferta obejmuje osprzęt ścienny, czujniki, aplikację, licencje i szkolenie. Sprawdź, czy cena jest netto czy brutto oraz jakie są wyłączenia.',
        'W istniejącym budynku osobną pozycją mogą być pomiary, dostosowanie instalacji i prace odtworzeniowe. Warto określić założenia dostępu do pomieszczeń i prac poza godzinami użytkowania.'
      ]},
      { title: 'Zapisz zasady zmian i przekazania', paragraphs: [
        'Uzgodnij sposób wyceny dodatkowych scen, liczbę rund ustawień i zakres opieki po odbiorze. W protokole przekazania powinny znaleźć się opis funkcji, kopia projektu ETS i uzgodnione dane dostępowe. Ustal odpowiedzialność za ich bezpieczne przechowywanie oraz warunki późniejszych zmian.'
      ]}
    ],
    checklist: ['Rzuty i lista funkcji zamiast samego metrażu', 'Jednoznaczne pozycje, wyłączenia i podatki', 'Dokumentacja oraz zasady serwisu po odbiorze'],
    sources: [{ title: 'KNX Association — technologia i architektura', url: 'https://www.knx.org/knx-technology' }]
  },
  {
    id: 'sala-konferencyjna', category: 'biura',
    title: 'Sala spotkań gotowa na codzienną pracę',
    summary: 'Sceny światła, osłony i wentylacja z perspektywy prowadzącego spotkanie.',
    sections: [
      { title: 'Trzy czytelne sceny zamiast kilkunastu funkcji', paragraphs: [
        'Zacznij od rozmowy przy stole, prezentacji na ekranie i wideokonferencji. Dla każdej sceny opisz światło nad stołem, tło za rozmówcami i pozycję osłon. Nie zaciemniaj automatycznie całej sali tylko dlatego, że włączono ekran — uczestnicy nadal potrzebują widzieć notatki i siebie nawzajem.'
      ]},
      { title: 'Światło dla kamery wymaga odpowiednich opraw', paragraphs: [
        'Scena może przywołać zapamiętane poziomy, ale nie poprawi sama widma źródła ani położenia oprawy. Podczas próby sprawdź twarze, odbicia w ekranie, tło i pracę kamery. Jakość oddawania barw oraz ewentualne migotanie trzeba ocenić dla wybranego źródła i zasilacza.',
        'Jeżeli potrzebna jest zmiana temperatury barwowej, sprawdź zgodność całego zestawu: opraw, zasilaczy oraz sterowania. Nazwa DALI nie oznacza automatycznie obsługi każdej funkcji koloru.'
      ]},
      { title: 'Uzgodnij współpracę z HVAC i AV', paragraphs: [
        'Określ, czy sygnał obecności, rezerwacja sali czy odczyt jakości powietrza mają wpływać na wentylację. Funkcje i dostępne interfejsy potwierdź z dostawcą HVAC oraz AV. Nie zakładaj, że każde urządzenie da się połączyć bez dodatkowej bramki.',
        'Na odbiór przygotuj krótką próbę: wejście grupy, rozpoczęcie połączenia, prezentacja, ręczna korekta i wyjście ostatniej osoby. Przetestuj powrót do stanu podstawowego oraz sytuację, w której rezerwacja się kończy, ale rozmowa nadal trwa.'
      ]}
    ],
    checklist: ['Sceny z opisanym działaniem światła i osłon', 'Próba z docelową kamerą i ekranem', 'Uzgodnione interfejsy oraz sterowanie ręczne'],
    sources: [{ title: 'DALI Alliance — typy urządzeń, w tym DT8', url: 'https://www.dali-alliance.org/tech-notes/device-types.html' }]
  },
  {
    id: 'otwarty-standard', category: 'inwestorzy',
    title: 'Co daje otwarty standard, a co trzeba sprawdzić',
    summary: 'KNX TP, RF, IP i IoT, dokumentacja oraz granice niezależności od jednego dostawcy.',
    sections: [
      { title: 'Standard i konkretna instalacja to różne rzeczy', paragraphs: [
        'KNX obejmuje różne sposoby komunikacji, w tym przewodowe TP, radiowe RF i rozwiązania IP. W modernizowanych wnętrzach można łączyć je w instalacje hybrydowe. Dlatego zdanie „KNX zawsze wymaga nowego przewodu do każdego przycisku” jest zbyt szerokie.',
        'Dobór zależy od możliwości prowadzenia przewodów, zasilania urządzeń i zakresu prac. Rozwiązania radiowe mogą wymagać baterii lub innego źródła zasilania; należy sprawdzić konkretny model i warunki montażu.'
      ]},
      { title: 'Niezależność wymaga dokumentacji', paragraphs: [
        'Urządzenia wielu producentów dają możliwość wyboru, ale serwis potrzebuje informacji o projekcie. Ustal przekazanie pliku ETS, dokumentacji rozdzielnicy, listy adresów i opisów scen. Wykaz urządzeń powinien pozwalać odnaleźć instrukcje i części.',
        'Podstawowe funkcje mogą działać lokalnie bez centralnego serwera. Zdalny dostęp, asystenci głosowi lub powiadomienia mogą jednak zależeć od bramek, internetu i usług dostawcy. W ofercie warto wyraźnie rozdzielić te grupy funkcji.'
      ]},
      { title: 'Kompatybilność sprawdza się dla urządzeń', paragraphs: [
        'Historia standardu nie jest gwarancją bezawaryjnej pracy każdego urządzenia przez określoną liczbę lat. Przy rozbudowie trzeba sprawdzić funkcje, aplikacje produktowe i dostępne interfejsy. Połączenie KNX IoT z istniejącą instalacją wymaga odpowiedniej architektury, np. routera pomiędzy mediami.'
      ]}
    ],
    checklist: ['Wykaz funkcji lokalnych i zależnych od internetu', 'Projekt ETS, dokumentacja i zasady dostępu', 'Warunki rozbudowy oraz dostępność urządzeń'],
    sources: [{ title: 'KNX Association — media transmisji i KNX IoT', url: 'https://www.knx.org/knx-technology' }]
  },
  {
    id: 'koordynacja-instalacji', category: 'architekci',
    title: 'Co uzgodnić przed zamknięciem ścian',
    summary: 'Lista decyzji dla architekta, elektryka i integratora — od przycisków po miejsce w rozdzielnicy.',
    sections: [
      { title: 'Zamknij listę funkcji, nie możliwość rozbudowy', paragraphs: [
        'Oznacz na rzucie miejsca przycisków, czujników, napędów i paneli. Dopisz funkcję punktu oraz uzgodnioną wysokość. Ustal, które elementy wymagają zasilania i jakich połączeń potrzebują. Zostaw zaplanowaną rezerwę tam, gdzie później przewidujesz dodatkowe osłony, klimatyzację lub panel.',
        'Nie dobieraj przewodów wyłącznie na podstawie krótkiego poradnika. Typy, trasy, separację i zabezpieczenia powinien określić projektant dla rzeczywistej instalacji oraz wymagań producentów.'
      ]},
      { title: 'Zaplanuj dostęp serwisowy', paragraphs: [
        'Miejsce na automatykę obejmuje nie tylko szerokość modułów, ale również okablowanie, zasilacze, wentylację i dostęp do zacisków. Uzgodnij lokalizację rozdzielnic, zasilaczy oświetlenia i bramek. Element wymagający obsługi nie powinien zostać trwale zamknięty za wykończeniem.',
        'Dla montażu zlicowanego, np. LS ZERO, potwierdź rozwiązanie z wykonawcą ściany lub mebla przed rozpoczęciem prac. Sprawdź wzajemne położenie osprzętu, okładzin i zabudowy.'
      ]},
      { title: 'Zrób wspólny przegląd branżowy', paragraphs: [
        'Na spotkaniu porównaj rzut architektoniczny z oświetleniem, elektryką i HVAC. Sprawdź miejsca kolizji, dostępne interfejsy i odpowiedzialność za dostawę każdego urządzenia. Zapisz decyzje w jednej aktualnej wersji dokumentacji.',
        'Przed zamknięciem ścian wykonaj dokumentację fotograficzną i uzgodnione sprawdzenia instalacji. Przygotuj również listę scen do późniejszego odbioru: sama obecność przewodu nie potwierdza działania funkcji.'
      ]}
    ],
    checklist: ['Rzuty z funkcjami, wysokościami i aktualną rewizją', 'Miejsce oraz dostęp serwisowy do urządzeń', 'Uzgodnienia branżowe i plan sprawdzeń'],
    sources: [{ title: 'JUNG — przygotowanie montażu LS ZERO', url: 'https://www.jung-group.com/en-UK/Products/Switch-Ranges/LS-ZERO/' }]
  }
];

export const guideReadingMinutes = (guide: Guide) => Math.max(1, Math.ceil(
  [guide.summary, ...guide.sections.flatMap(section => [section.title, ...section.paragraphs]), ...guide.checklist].join(' ').split(/\s+/).length / 180
));
