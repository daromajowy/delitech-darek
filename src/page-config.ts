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
    title: 'Biura i sale konferencyjne — automatyka i ProAV | InteliSpaces',
    description:
      'Światło, osłony, temperatura i wideospotkania w jednym pomieszczeniu. Automatyka KNX i ProAV do gabinetów, mniejszych biur oraz sal konferencyjnych.',
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
      'Wypróbuj sterowanie domem, przejdź przez dzień od poranka po noc i zobacz, jak planujemy i uruchamiamy Twoją instalację KNX.',
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

// Nie publikujemy tych kategorii. Dawne adresy prowadzą do przeniesionych sekcji.
const contact = { '': 'contact/' };
export const retiredPages: Partial<Record<PageId, Record<string, string>>> = {
  homes: {
    '': 'solutions/#sceny',
    'rytm-dnia': 'solutions/#sceny',
    'day-rhythm-title': 'solutions/#sceny',
    sceny: 'solutions/#sceny',
    etapy: 'solutions/#etapy',
    'homes-process-title': 'solutions/#etapy',
    mozliwosci: 'solutions/#integracje',
    integracje: 'solutions/#integracje-knx',
    'integracje-knx': 'solutions/#integracje-knx',
    osprzet: '#osprzet',
    'dlaczego-knx': '#dlaczego-knx',
    'homes-title': 'solutions/#systemy',
    apartament: 'solutions/#systemy',
    modernizacja: 'solutions/#systemy',
    dom: 'knowledge/#planowanie',
    etapowanie: 'knowledge/#etapowanie',
    zgodnosc: 'knowledge/#urzadzenia',
    internet: '#dlaczego-knx',
    koszt: 'knowledge/#koszt',
    'homes-questions-title': 'knowledge/',
    'homes-contact-title': 'contact/',
  },
  offices: contact,
  proav: contact,
};

export function redirectPath(targets: Record<string, string>, hash: string): string {
  return Object.hasOwn(targets, hash) ? targets[hash] : targets[''];
}
