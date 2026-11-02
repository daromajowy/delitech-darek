import type { PageId } from './types';

// Adresy i metadane stron. Treści widoczne na stronie edytujemy w src/pages i src/components.
export const siteOrigin = 'https://intelispaces.pl';
export const pages: Record<PageId, { path: string; previousPath?: string; title: string; description: string }> = {
  home: {
    path: '/',
    title: 'Automatyka KNX dla domów i apartamentów | InteliSpaces',
    description:
      'Projektujemy, programujemy i uruchamiamy instalacje KNX dla domów i apartamentów. Doradzamy inwestorom i architektom w Warszawie i całej Polsce.',
  },
  architects: {
    path: '/dla-architektow/',
    previousPath: '/architects/',
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
    path: '/o-nas/',
    previousPath: '/about/',
    title: 'O nas — Jan Jasek, Dariusz Maj, Marek Sakowski | InteliSpaces',
    description:
      'Poznaj Jana Jaska, Dariusza Maja i Marka Sakowskiego. Doradztwo dla inwestorów i projektantów, integracja KNX oraz wykonawstwo instalacji elektrycznych.',
  },
  team: {
    path: '/zespol/',
    previousPath: '/team/',
    title: 'Nasz zespół | InteliSpaces',
    description:
      'Poznaj zespół InteliSpaces: Dariusz Maj, Jan Jasek i Marek Sakowski. Współpraca z inwestorami i architektami, integracja KNX oraz instalacje elektryczne.',
  },
  projects: {
    path: '/przyklady-automatyki/',
    previousPath: '/projects/',
    title: 'Przykłady funkcji inteligentnego domu | InteliSpaces',
    description:
      'Przykładowe sceny i funkcje KNX do domu oraz apartamentu. Światło, rolety i wygodna obsługa — inspiracje do ustalenia własnego zakresu.',
  },
  solutions: {
    path: '/co-moze-twoj-dom/',
    previousPath: '/solutions/',
    title: 'Co może Twój dom? Funkcje smart home | InteliSpaces',
    description:
      'Wypróbuj sterowanie domem, przejdź przez dzień od poranka po noc i zobacz, jak planujemy i uruchamiamy Twoją instalację KNX.',
  },
  knowledge: {
    path: '/pytania-o-knx/',
    previousPath: '/knowledge/',
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
    path: '/kontakt/',
    previousPath: '/contact/',
    title: 'Kontakt z integratorem KNX w Warszawie | InteliSpaces',
    description:
      'Zadzwoń, napisz lub poproś o kontakt w sprawie KNX dla domu, apartamentu albo projektu pracowni. InteliSpaces, ul. Konwaliowa 7 lok. 103, Warszawa.',
  },
};

// Nie publikujemy tych kategorii. Dawne adresy prowadzą do przeniesionych sekcji.
function section(page: PageId, hash = '') {
  return pages[page].path.slice(1) + (hash ? '#' + hash : '');
}
const contact = { '': section('contact') };
export const retiredPages: Partial<Record<PageId, Record<string, string>>> = {
  homes: {
    '': section('solutions', 'sceny'),
    'rytm-dnia': section('solutions', 'sceny'),
    'day-rhythm-title': section('solutions', 'sceny'),
    sceny: section('solutions', 'sceny'),
    etapy: section('solutions', 'etapy'),
    'homes-process-title': section('solutions', 'etapy'),
    mozliwosci: section('solutions', 'integracje'),
    integracje: section('solutions', 'integracje-knx'),
    'integracje-knx': section('solutions', 'integracje-knx'),
    osprzet: '#osprzet',
    'dlaczego-knx': '#dlaczego-knx',
    'homes-title': section('solutions', 'systemy'),
    apartament: section('solutions', 'systemy'),
    modernizacja: section('solutions', 'systemy'),
    dom: section('knowledge', 'planowanie'),
    etapowanie: section('knowledge', 'etapowanie'),
    zgodnosc: section('knowledge', 'urzadzenia'),
    internet: '#dlaczego-knx',
    koszt: section('knowledge', 'koszt'),
    'homes-questions-title': section('knowledge'),
    'homes-contact-title': section('contact'),
  },
  offices: contact,
  proav: contact,
};

export function redirectPath(targets: Record<string, string>, hash: string): string {
  return Object.hasOwn(targets, hash) ? targets[hash] : targets[''];
}
