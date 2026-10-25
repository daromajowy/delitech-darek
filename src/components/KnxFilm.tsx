import React from 'react';
import { IMAGES } from '../assets.ts';
import knxFilmUrl from '../assets/knx-polska.mp4';

// The film comes from the site's own assets: no third-party player and no cookies.
// preload="none" keeps the 9 MB file from loading until the visitor presses play.
export const KnxFilm: React.FC = () => (
  <div className="space-y-5">
    <video
      className="aspect-video w-full rounded-2xl border border-ink/15 bg-ink object-cover shadow-xl"
      src={knxFilmUrl}
      poster={IMAGES.knxFilm}
      controls
      playsInline
      preload="none"
      title="Film KNX Polska o standardzie KNX"
    />

    <div>
      <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-widest text-ink">{"Film · KNX Polska"}</span>
      <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{"Poznaj automatykę w standardzie KNX."}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">{"Krótki materiał stowarzyszenia KNX Polska o otwartym standardzie automatyki budynkowej."}</p>
    </div>
  </div>
);
