import type {Guide} from './guides.ts';

export const investorGuide: Guide = {
  id: 'knx-dla-inwestora',
  category: 'inwestorzy',
  title: 'KNX dla inwestora: od pierwszego planu do odbioru instalacji',
  summary: 'Co ustalić przed wyceną, jak porównać oferty i co odebrać od wykonawcy? Praktyczny przewodnik dla osób budujących dom, urządzających apartament lub przygotowujących biuro.',
  sections: [
    {title: '1. Co właściwie kupujesz, wybierając KNX?', paragraphs: [
      'KNX to standard komunikacji urządzeń automatyki budynkowej. Przyciski, czujniki i moduły wykonawcze mogą wspólnie obsługiwać światło, osłony okienne czy temperaturę. Urządzenia różnych producentów można łączyć w jednym projekcie, ale trzeba sprawdzić funkcje konkretnych modeli i prawidłowo je skonfigurować. Sam napis KNX nie oznacza, że każdy produkt zrealizuje dowolne zadanie.',
      'Najpierw określ oczekiwany efekt. „Inteligentny salon” jest trudny do wyceny i odbioru. „Jeden przycisk przy wyjściu wyłącza wskazane światła, pozostawia zasilanie lodówki i uruchamia ustaloną scenę rolet” daje wykonawcy konkretny zakres. Taką listę zachowaj do końcowych testów.'
    ]},
    {title: '2. Kiedy rozpocząć i co ustalić z projektantem?', paragraphs: [
      'Zaproś integratora do rozmowy przed wykonaniem instalacji i zamknięciem ścian. W przewodowym KNX TP komunikacja korzysta z dedykowanej magistrali. Rozwiązania KNX RF mogą pomóc przy modernizacji, gdy ułożenie przewodów jest trudne. Dobór technologii powinien wynikać z warunków obiektu, a nie z samej chęci uniknięcia remontu.',
      'Na jednym rzucie uzgodnij z architektem, elektrykiem i wykonawcą HVAC lokalizacje przycisków, czujników, rozdzielnic i urządzeń. Ustal rezerwę miejsca oraz trasy pod przyszłą rozbudowę. Zapisz, kto dostarcza każdy element, kto go podłącza i kto odpowiada za uruchomienie. Brak tych ustaleń zwykle ujawnia się wtedy, gdy ekipy są już na budowie.'
    ]},
    {title: '3. Podziel funkcje na niezbędne i dodatkowe', paragraphs: [
      'Przygotuj trzy grupy: funkcje potrzebne od początku, przydatne dodatki oraz pomysły na później. W pierwszej mogą znaleźć się wygodne sterowanie światłem, temperaturą i roletami. W kolejnych: rozbudowane sceny, wizualizacja, pomiary czy integracje. Każdemu pomieszczeniu przypisz kilka najważniejszych czynności użytkownika.',
      'Przykładowa scena „Wyjście” powinna mieć dokładną listę odbiorników i wyjątków. Scena „Noc” może pozostawiać delikatne światło komunikacyjne. Są to propozycje do uzgodnienia, a nie gotowe ustawienia odpowiednie dla każdego domu. Sprawdź też, czy gość potrafi włączyć podstawowe światło bez telefonu i instrukcji.'
    ]},
    {title: '4. Jak porównać oferty i zaplanować budżet?', paragraphs: [
      'Poproś oferentów o wycenę tej samej listy funkcji i liczby obwodów. Oddziel projekt, urządzenia, rozdzielnice, okablowanie, montaż, programowanie, testy, dokumentację oraz późniejszy serwis. Sprawdź, czy oferta obejmuje przyciski, czujniki, bramki integracyjne, wizualizację i ewentualne licencje lub abonamenty.',
      'Cena za metr kwadratowy bez opisu wyposażenia niewiele mówi. Dwa domy o podobnej powierzchni mogą mieć zupełnie inną liczbę obwodów, napędów i stref temperatury. Uzgodnij sposób wyceny zmian oraz zakres korekt po zamieszkaniu. Nie traktuj deklarowanego procentu oszczędności energii jako gwarancji: wynik zależy od budynku, ustawień i sposobu użytkowania.'
    ]},
    {title: '5. Integracje: sprawdź model, interfejs i zakres', paragraphs: [
      'Przy pompie ciepła, klimatyzacji, wentylacji czy oświetleniu poproś o potwierdzenie obsługiwanych funkcji dla dokładnego modelu. Odczyt temperatury, zmiana nastawy i pełna diagnostyka to różne zakresy. W zestawieniu powinny znaleźć się potrzebne bramki, licencje i odpowiedzialność za konfigurację obu stron połączenia.',
      'Ustal również, który układ podejmuje decyzję o ogrzewaniu i chłodzeniu oraz jak działają priorytety i blokady. Warto przed zamówieniem uzgodnić próbę najbardziej nietypowej integracji. Hasło „będzie współpracować” zastąp listą funkcji, którą będzie można sprawdzić podczas odbioru.'
    ]},
    {title: '6. Działanie lokalne, internet i bezpieczeństwo', paragraphs: [
      'Poproś o opis zależności: co działa lokalnie, co wymaga serwera, a co internetu lub usługi zewnętrznej. Podstawowe funkcje można zaprojektować lokalnie; aplikacja, zdalny dostęp i rozbudowana logika mogą mieć inne wymagania. W protokole odbioru uwzględnij uzgodnioną próbę bez internetu oraz zachowanie po powrocie zasilania.',
      'KNX Data Secure chroni komunikację przy użyciu zgodnych urządzeń i odpowiedniej konfiguracji. Sam zakup urządzenia obsługującego Secure nie potwierdza, że zabezpieczenie zostało włączone. Ustal sposób zdalnego serwisu, zarządzania dostępem i przechowywania kopii projektu oraz kluczy. Materiałów dostępowych nie umieszczaj w publicznej dokumentacji inwestycji.'
    ]},
    {title: '7. Odbiór instalacji: sprawdzaj zachowanie, nie tylko sprzęt', paragraphs: [
      'Przejdź z wykonawcą przez listę funkcji w każdym pomieszczeniu. Sprawdź przyciski, sceny, sterowanie osłonami, nastawy i informację zwrotną. Oceń czytelność opisów oraz wygodę obsługi. Próby dotyczące zabezpieczeń urządzeń i instalacji wykonuje odpowiednio przygotowany wykonawca według uzgodnionej procedury.',
      'Zapisz wynik, zauważone usterki, osobę odpowiedzialną i termin poprawki. Czujniki obecności oraz harmonogramy warto ocenić również podczas normalnego użytkowania. Uzgodnij krótkie szkolenie i późniejszą korektę ustawień, zamiast zakładać, że parametry z dnia uruchomienia od razu będą optymalne.'
    ]},
    {title: '8. Dokumentacja, dzięki której można serwisować system', paragraphs: [
      'ETS jest narzędziem do konfiguracji i uruchamiania instalacji KNX. Uzgodnij przekazanie aktualnego eksportu projektu ETS po odbiorze i po kolejnych zmianach. Sam plik projektu nie jest licencją na oprogramowanie ETS. Dokumentacja i dostęp do konfiguracji ułatwiają późniejszą współpracę z serwisem.',
      'W pakiecie odbiorowym zaplanuj schematy powykonawcze, opis obwodów i urządzeń, listę scen, instrukcję dla użytkownika oraz kopie konfiguracji dodatkowych systemów. Osobno ustal bezpieczne przekazanie haseł i materiałów KNX Secure. Wyznacz miejsce przechowywania kopii, osobę odpowiedzialną za aktualizacje i zasady zgłaszania usterek.'
    ]}
  ],
  checklist: [
    'Aktualne rzuty, etap inwestycji i planowany termin prac.',
    'Lista funkcji dla pomieszczeń: konieczne teraz, dodatkowe i przewidziane na później.',
    'Zestawienie obwodów światła, napędów osłon i stref temperatury.',
    'Dokładne modele urządzeń do integracji i dostępna dokumentacja ich interfejsów.',
    'Zakres budżetu oraz wspólna lista elementów do porównania ofert.',
    'Wymagania dotyczące działania bez internetu i zdalnego serwisu.',
    'Lista prób odbiorowych, pakiet dokumentacji i zasady opieki po uruchomieniu.'
  ],
  sources: [
    {title:'KNX Association — technologie TP, RF i IP',url:'https://knx.org/knx-technology'},
    {title:'KNX Association — ETS, konfiguracja i dokumentacja projektu',url:'https://knx.org/what-ets'},
    {title:'KNX Association — działanie KNX Data Secure',url:'https://support.knx.org/hc/en-us/articles/360012689639-KNX-Data-Secure'}
  ]
};
