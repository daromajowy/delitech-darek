import type { PageId } from './types';

// Adresy i metadane stron. Treści widoczne na stronie edytujemy w src/pages i src/components.
export const pages: Record<PageId, { path: string; title: string; description: string }> = {
  home: {
    path: '/',
    title: 'Inteligentne domy i apartamenty KNX | InteliSpaces',
    description:
      'Planujemy i uruchamiamy automatykę KNX dla domów i apartamentów. Światło, rolety, temperatura i wygodne sterowanie. Współpracujemy z inwestorami i architektami.',
  },
  architects: {
    path: '/architects/',
    title: 'KNX dla architektów i projektantów | InteliSpaces',
    description:
      'KNX dla pracowni architektonicznych: doradztwo, dobór osprzętu do wnętrza i współpraca z wykonawcami. Poznaj etapy współpracy i umów prezentację konfiguratora.',
  },
  homes: {
    path: '/homes/',
    title: 'Automatyka KNX — domy i apartamenty | InteliSpaces',
    description:
      'Zaplanuj wygodne sterowanie światłem, roletami i temperaturą. Poznaj etapy współpracy, możliwości modernizacji i czynniki wpływające na koszt instalacji KNX.',
  },
  offices: {
    path: '/offices/',
    title: 'Sale spotkań i ProAV — dodatkowa usługa | InteliSpaces',
    description:
      'Wyposażenie sal spotkań: obraz, dźwięk, wideokonferencje i przyłącza. Dodatkowa usługa InteliSpaces dopasowana do konkretnego pomieszczenia.',
  },
  proav: {
    path: '/offices/proav/',
    title: 'ProAV — wideobary, ekrany i sale spotkań | InteliSpaces',
    description:
      'ProAV jako dodatkowa usługa: wideobary Logitech i Poly, Teams Rooms, ekrany, mediaporty i okablowanie. Dobór i uruchomienie wyposażenia sal spotkań.',
  },
  about: {
    path: '/about/',
    title: 'O nas — Jan Jasek, Dariusz Maj, Marek Sakowski | InteliSpaces',
    description:
      'Poznaj Jana Jaska, Dariusza Maja i Marka Sakowskiego. Doradztwo dla inwestorów i projektantów, integracja KNX oraz wykonawstwo instalacji elektrycznych.',
  },
  team: {
    path: '/team/',
    title: 'Nasz zespół | InteliSpaces',
    description:
      'Poznaj zespół InteliSpaces: Dariusz Maj, Jan Jasek i Marek Sakowski. Współpraca z inwestorami i architektami, integracja KNX oraz instalacje elektryczne.',
  },
  projects: {
    path: '/projects/',
    title: 'Przykłady funkcji inteligentnego domu | InteliSpaces',
    description:
      'Przykładowe sceny i funkcje KNX do domu oraz apartamentu. Światło, rolety i wygodna obsługa — inspiracje do ustalenia własnego zakresu.',
  },
  solutions: {
    path: '/solutions/',
    title: 'Co może Twój dom? Funkcje smart home | InteliSpaces',
    description:
      'Zobacz, jak funkcje KNX działają razem. Wypróbuj pokazowy dom, poznaj sceny Poranek, Kino i Dobranoc oraz możliwości integracji światła, klimatu, muzyki i energii.',
  },
  knowledge: {
    path: '/knowledge/',
    title: 'KNX — pytania i odpowiedzi | InteliSpaces',
    description:
      'Kiedy planować automatykę, czym jest scena i od czego zależy koszt? Praktyczne odpowiedzi dla inwestorów oraz architektów domów i apartamentów.',
  },
  knx: {
    path: '/knx/',
    title: 'Czym jest KNX? Prosto o automatyce domu | InteliSpaces',
    description:
      'KNX to otwarty standard automatyki budynkowej. Dowiedz się, jak łączy urządzenia i na co zwrócić uwagę przy planowaniu inteligentnego domu.',
  },
  contact: {
    path: '/contact/',
    title: 'Kontakt — porozmawiajmy o Twoim domu | InteliSpaces',
    description:
      'Zadzwoń, napisz lub poproś o kontakt w sprawie KNX dla domu, apartamentu albo projektu pracowni. InteliSpaces, ul. Konwaliowa 7 lok. 103, Warszawa.',
  },
};
