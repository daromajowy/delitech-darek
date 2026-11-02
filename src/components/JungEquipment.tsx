import React from 'react';
import { ArrowRight } from 'lucide-react';
import jungPhoneImage from '../assets/images/homes-jung-phone.webp';
import jungF40Image from '../assets/images/homes-jung-f40-interior.webp';
import jungF50Image from '../assets/images/homes-jung-f50-interior.webp';
import jungTouchImage from '../assets/images/homes-jung-ls-touch.webp';
import jungPanelImage from '../assets/images/homes-jung-sc5.webp';
import jungDoorImage from '../assets/images/homes-jung-intercom.webp';
import './JungEquipment.css';

const controls = [
  {
    name: 'Dom w Twoim telefonie', model: 'JUNG Smart Visu Server · aplikacja KNX',
    image: jungPhoneImage, width: 1309, height: 561,
    alt: 'Telefon w dłoni z aplikacją JUNG Smart Visu Server do sterowania oświetleniem, na tle jadalni i salonu',
    text: 'Sprawdzasz stan świateł, zmieniasz ustawienia osłon i temperatury lub uruchamiasz scenę. Aplikację łączymy z instalacją przez serwer wizualizacji; dostęp spoza domu wymaga skonfigurowanego bezpiecznego połączenia.',
    use: 'Z kanapy: przyciemniasz lampy nad stołem lub wybierasz przygotowaną scenę wieczorną.',
    source: 'https://www.jung-group.com/en-UK/Products/Systems/KNX-building-technology/Smart-Visu-Server/',
  },
  {
    name: 'Światło i sceny pod palcem', model: 'JUNG F 40 · sensory przyciskowe KNX',
    image: jungF40Image, width: 1582, height: 1582,
    alt: 'Cały grafitowy sensor JUNG F 40 z opisanymi klawiszami na ciemnej drewnianej ścianie, obok półki z dekoracją',
    text: 'Duże klawisze obsługują światło, rolety i zaprogramowane sceny. Dobieramy liczbę przycisków, ich opisy oraz wykończenie: od matowych kolorów po stal, aluminium i mosiądz.',
    use: 'Przy kanapie: osobny klawisz do czytania, przyciemnienia światła lub sceny „Film”.',
    source: 'https://www.jung-group.com/en-UK/Products/Systems/KNX-building-technology/KNX-F-40-push-button/',
  },
  {
    name: 'Funkcje pokoju w jednym miejscu', model: 'JUNG F 50 · sensory i regulatory KNX',
    image: jungF50Image, width: 1309, height: 561,
    alt: 'Grafitowy regulator pokojowy JUNG F 50 z wyświetlaczem i przyciskami na ścianie, obok przejścia do jasnego salonu',
    text: 'Smukłe klawisze, czytelne oznaczenia i sygnalizacja stanu pomagają rozpoznać funkcje. Wersja z wyświetlaczem łączy sterowanie światłem i osłonami z regulacją temperatury.',
    use: 'Przy wejściu do pokoju: ustawiasz temperaturę, sterujesz roletami i wywołujesz scenę „Dobranoc”.',
    source: 'https://www.jung-group.com/en-UK/Products/Systems/KNX-building-technology/KNX-F-50-push-button/',
  },
  {
    name: 'Cały pokój pod ręką', model: 'JUNG LS TOUCH · regulator pokojowy KNX',
    image: jungTouchImage, width: 662, height: 662,
    alt: 'Panel dotykowy JUNG LS TOUCH w mosiężnej ramce z widokiem temperatury i sterowania żaluzją',
    text: 'Kompaktowy ekran w stylistyce LS 990 łączy obsługę światła, osłon, temperatury i scen. Kolor lub metalową ramkę dobieramy do pozostałego osprzętu.',
    use: 'W salonie lub sypialni: wybór sceny, zmiana temperatury i sprawdzenie ustawień pokoju.',
    source: 'https://www.jung-group.com/en-UK/Products/Systems/KNX-building-technology/LS-TOUCH/',
  },
  {
    name: 'Wspólny panel domu', model: 'JUNG Smart Control 5 · panel dotykowy',
    image: jungPanelImage, width: 1582, height: 1582,
    alt: 'Obsługa pionowego panelu dotykowego JUNG Smart Control 5 na jasnej ścianie',
    text: 'Ekran do obsługi pomieszczeń i podglądu wybranych funkcji. Do KNX dobieramy serwer wizualizacji; obsługa domofonu Siedle wymaga odpowiedniej bramki.',
    use: 'W centralnym miejscu: sprawdzenie świateł, osłon i temperatur bez chodzenia po pokojach.',
    source: 'https://www.jung-group.com/en-ASIA/Products/Solutions/Display-devices/Smart-Control-5/',
  },
  {
    name: 'Wideodomofon w tym samym stylu', model: 'JUNG · wewnętrzna stacja wideo',
    image: jungDoorImage, width: 1309, height: 561,
    alt: 'Wewnętrzna stacja wideodomofonu JUNG w drewnianej zabudowie, obok wejścia do salonu',
    text: 'Stacja wewnętrzna może pasować do ramek i łączników w domu. Zapewnia obraz, rozmowę i otwieranie wejścia w odpowiednio dobranym systemie JUNG / Siedle.',
    use: 'Przy wejściu lub w kuchni: widzisz gościa i otwierasz furtkę. Integrację ze scenami ustalamy osobno.',
    source: 'https://www.jung-group.com/nl-NL/Producten/Oplossingen/Deurcommunicatie/',
  },
];

export function JungEquipment() {
  return (
    <section id="osprzet" className="homes-design" aria-labelledby="homes-design-title">
      <div className="homes-design__inner">
        <div className="homes-design__heading">
          <div><p className="homes-design__eyebrow">Design i obsługa · przykłady JUNG</p><h2 id="homes-design-title">Osprzęt dopasowany<br />do Twojego wnętrza.</h2></div>
          <p>Łącznik, sensor przyciskowy, panel czy wideodomofon — każdy może być częścią projektu wnętrza. Dobieramy wygląd i funkcje do miejsca: inaczej przy łóżku, inaczej przy wejściu.</p>
        </div>
        <div className="homes-design__grid">
          {controls.map((control, index) => (
            <article className={`homes-design-card homes-design-card--${index + 1}`} key={control.name}>
              <figure><img src={control.image} alt={control.alt} width={control.width} height={control.height} loading="lazy" decoding="async" /></figure>
              <p className="homes-design-card__model">{control.model}</p>
              <h3>{control.name}</h3>
              <p className="homes-design-card__text">{control.text}</p>
              <p className="homes-design-card__use"><span>W Twoim domu</span>{control.use}</p>
              <a href={control.source} target="_blank" rel="noreferrer" className="homes-design__link" aria-label={`Zobacz u producenta: ${control.model} (nowa karta)`}>Zobacz u producenta <ArrowRight size={16} aria-hidden="true" /></a>
            </article>
          ))}
        </div>
        <p className="homes-design__credits">Zdjęcia i materiały produktowe: JUNG / Albrecht JUNG GmbH &amp; Co. KG. Wnętrze ze stacją wideo: fot. Constantin Meyer. Przykłady producenta; funkcje i dostępność wykończeń potwierdzamy dla wybranych modeli.</p>
      </div>
    </section>
  );
}
