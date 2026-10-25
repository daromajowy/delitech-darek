import React from "react";
import { Mail, Phone } from "lucide-react";
import { PageId } from "../types";
import janekPhoto from "../assets/images/janek.jpg";
import darekPhoto from "../assets/images/darek.jpg";
import { ContentHero, ContactCta, contentWidth } from "../components/ContentSections";

interface TeamPageProps {
  onNavigate: (page: PageId, subHash?: string) => void;
  onOpenConsultation: () => void;
}
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
  email: string;
  phone?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Dariusz Maj",
    role: "Integrator i koordynator wdrożeń KNX",
    bio: "Łączy doświadczenie w branży IT i zarządzaniu projektami ze współpracą z projektantami oraz inwestorami. Przygotowuje koncepcje techniczne, programuje urządzenia KNX i koordynuje wdrożenia.",
    photoUrl: darekPhoto,
    email: "darek@intelispaces.pl",
    phone: "+48 885 253 934",
  },
  {
    name: "Jan Jasek",
    role: "Integrator i koordynator instalacji KNX",
    bio: "Współpracuje z pracowniami architektonicznymi i pomaga dobierać osprzęt do wnętrz. Zajmuje się programowaniem sterowania, wizualizacjami, konsultacjami z inwestorem i koordynacją dostaw.",
    photoUrl: janekPhoto,
    email: "janek@intelispaces.pl",
    phone: "+48 505 260 848",
  },
  {
    name: "Marek Sakowski",
    role: "Specjalista ds. instalacji elektrycznych i automatyki",
    bio: "Zajmuje się wykonaniem instalacji elektrycznych i automatyki budynkowej. Wspiera dobór rozwiązań, montaż, uruchomienie oraz sprawdzenie działania instalacji.",
    email: "marek@intelispaces.pl",
  },
];

export const TeamPage: React.FC<TeamPageProps> = ({ onOpenConsultation }) => (
  <div>
    <ContentHero eyebrow="Ludzie InteliSpaces" title="Poznaj nasz zespół.">
      <p>
        Łączymy planowanie funkcji, dobór urządzeń, koordynację projektu i wykonanie instalacji.
        Wspólnie pomagamy stworzyć wygodny dom oraz dopracować sposób jego obsługi.
      </p>
    </ContentHero>
    <section className="py-16 sm:py-20 bg-surface">
      <div className={contentWidth + " grid md:grid-cols-2 lg:grid-cols-3 gap-7"}>
        {teamMembers.map((member) => (
          <article
            key={member.email}
            className="rounded-2xl overflow-hidden border border-ink/15 bg-white flex flex-col"
          >
            <div className="aspect-[4/5] bg-ink flex items-center justify-center">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <span aria-hidden="true" className="text-6xl font-display font-bold text-accent">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              )}
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h2 className="text-2xl font-bold font-display">{member.name}</h2>
              <p className="mt-2 font-semibold text-sm text-ink/80">{member.role}</p>
              <p className="mt-5 text-sm text-ink/80 leading-relaxed">{member.bio}</p>
              <address className="not-italic mt-auto pt-6 space-y-3 text-sm">
                <a
                  href={"mailto:" + member.email}
                  className="flex items-center gap-2 hover:underline break-all"
                >
                  <Mail size={17} className="shrink-0" aria-hidden="true" />
                  {member.email}
                </a>
                {member.phone && (
                  <a
                    href={"tel:" + member.phone.replaceAll(" ", "")}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <Phone size={17} aria-hidden="true" />
                    {member.phone}
                  </a>
                )}
              </address>
            </div>
          </article>
        ))}
      </div>
    </section>
    <ContactCta
      title="Ustalmy, jak możemy pomóc."
      text="Powiedz, na jakim etapie jest Twój dom lub projekt wnętrza. Dobierzemy zakres współpracy do potrzeb inwestycji."
      onClick={onOpenConsultation}
    />
  </div>
);
