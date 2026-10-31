import React from 'react';
import type { PageId } from '../types';
import { ContentHero, ContactCta, contentWidth } from '../components/ContentSections';
import { TeamProfiles } from '../components/TeamProfiles';

interface TeamPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onOpenConsultation }) => (
  <div>
    <ContentHero eyebrow="Ludzie InteliSpaces" title="Poznaj nasz zespół.">
      <p>Jan Jasek, Dariusz Maj i Marek Sakowski. Łączymy doradztwo projektowe, programowanie KNX i doświadczenie wykonawcze.</p>
    </ContentHero>
    <section className="py-12 sm:py-16 bg-surface" aria-labelledby="team-heading">
      <div className={contentWidth}>
        <h2 id="team-heading" className="sr-only">Doradztwo, integracja i wykonawstwo</h2>
        <TeamProfiles />
      </div>
    </section>
    <ContactCta title="Ustalmy, jak możemy pomóc." text="Powiedz, na jakim etapie jest Twój dom lub projekt wnętrza. Dobierzemy zakres współpracy do potrzeb inwestycji." onClick={onOpenConsultation} />
  </div>
);
