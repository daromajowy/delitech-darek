import React from 'react';
import { Mail, Phone } from 'lucide-react';
import './TeamProfiles.css';
import janPhoto from '../assets/images/janek.jpg';
import dariuszPhoto from '../assets/images/darek.jpg';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: readonly string[];
  focus: readonly string[];
  photo?: { src: string; width: number; height: number };
  email: string;
  phone?: string;
}

// Jan and Marek: experience and roles supplied by the business owner.
// Dariusz: existing team biography, including repository history before the CMS migration.
// Do not add unverified certificates or infer a number of years for Dariusz.
const teamMembers: readonly TeamMember[] = [
  {
    id: 'jan-jasek',
    name: 'Jan Jasek',
    role: 'Ekspert KNX · doradztwo i dobór rozwiązań',
    specialty: '20 lat w branży i we współpracy z projektantami',
    bio: [
      'Od 20 lat działa w branży i współpracuje z projektantami. Jest ekspertem KNX oraz właścicielem Delitech i Elektromotyw. Doskonale zna rynek osprzętu, automatyki i wyposażenia instalacyjnego — zarówno od strony dostaw, jak i produkcji puszek oraz mediaportów.',
      'Przez lata dostarczał rozwiązania do domów, apartamentów i biur. Dzięki temu rozumie potrzeby inwestorów i realia pracy projektantów. Pomaga połączyć oczekiwania dotyczące wygody, estetyki i budżetu z konkretnymi urządzeniami oraz możliwościami instalacji.',
    ],
    focus: ['Doradztwo projektowe', 'Osprzęt i automatyka KNX', 'Puszki i mediaporty'],
    photo: { src: janPhoto, width: 1024, height: 1536 },
    email: 'janek@intelispaces.pl',
    phone: '+48 505 260 848',
  },
  {
    id: 'dariusz-maj',
    name: 'Dariusz Maj',
    role: 'Integrator KNX · programowanie i koordynacja wdrożeń',
    specialty: 'Doświadczenie IT połączone z automatyką budynku',
    bio: [
      'Łączy wieloletnie doświadczenie w branży IT i zarządzaniu projektami w dużych organizacjach z praktyką integracji KNX. Praca w środowisku o wysokich wymaganiach nauczyła go porządkować złożone zadania, uzgadniać szczegóły i pilnować kolejnych etapów wdrożenia.',
      'Współpracuje z projektantami i inwestorami, przygotowuje koncepcje techniczne, programuje urządzenia KNX i koordynuje uruchomienie. Przekłada pomysł na wnętrze na konkretne funkcje i czytelny sposób sterowania.',
    ],
    focus: ['Koncepcje techniczne', 'Programowanie KNX', 'Koordynacja wdrożeń'],
    photo: { src: dariuszPhoto, width: 1097, height: 1434 },
    email: 'darek@intelispaces.pl',
    phone: '+48 885 253 934',
  },
  {
    id: 'marek-sakowski',
    name: 'Marek Sakowski',
    role: 'Generalny wykonawca · ekspert instalacji elektrycznych i KNX',
    specialty: '20 lat doświadczenia wykonawczego',
    bio: [
      'Od 20 lat zajmuje się instalacjami elektrycznymi i automatyką KNX. Jako generalny wykonawca łączy wiedzę techniczną z praktyką na budowie. Jego doświadczenie obejmuje także systemy alarmowe, monitoring i fotowoltaikę.',
      'Patrzy na projekt od strony wykonania: tras przewodów, montażu urządzeń i współpracy poszczególnych instalacji. Wspiera dobór rozwiązań, prowadzi prace instalacyjne i uczestniczy w uruchomieniu oraz sprawdzeniu działania systemu.',
    ],
    focus: ['Instalacje elektryczne i KNX', 'Alarmy i monitoring', 'Fotowoltaika'],
    email: 'marek@intelispaces.pl',
  },
];

export const TeamProfiles: React.FC = () => (
  <div className="team-profiles">
    {teamMembers.map((member) => (
      <article key={member.id} id={member.id} className="team-profile" aria-labelledby={member.id + '-name'}>
        <div className="team-profile__portrait">
          {member.photo ? (
            <img src={member.photo.src} alt={member.name} width={member.photo.width} height={member.photo.height} loading="lazy" decoding="async" />
          ) : (
            <div className="team-profile__monogram" aria-hidden="true">
              <span>MS</span><span className="team-profile__mark" />
            </div>
          )}
          <p className="team-profile__specialty">{member.specialty}</p>
        </div>
        <div className="team-profile__details">
          <h3 id={member.id + '-name'}>{member.name}</h3>
          <p className="team-profile__role">{member.role}</p>
          <div className="team-profile__bio">{member.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <ul className="team-profile__focus" aria-label={'Obszary pracy: ' + member.name}>
            {member.focus.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <address className="team-profile__contact">
            {member.phone && <a href={'tel:' + member.phone.replaceAll(' ', '')}><Phone size={18} aria-hidden="true" />{member.phone}</a>}
            <a href={'mailto:' + member.email}><Mail size={18} aria-hidden="true" />{member.email}</a>
          </address>
        </div>
      </article>
    ))}
  </div>
);
