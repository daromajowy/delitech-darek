import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { IMAGES } from '../assets.ts';

const VIDEO_ID = '2HleUZfaK2Q';

// The YouTube player loads only after a click (privacy-enhanced domain), so no third-party cookies are set on page load.
export const KnxFilm: React.FC = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="space-y-5">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-ink/15 bg-ink shadow-xl">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
            title="Film KNX Polska o standardzie KNX"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Odtwórz film KNX Polska"
            className="group absolute inset-0 block h-full w-full"
          >
            <img
              src={IMAGES.knxFilm}
              alt="Kadr z filmu KNX Polska"
              className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-accent shadow-lg transition-transform duration-200 group-hover:scale-110 sm:h-20 sm:w-20">
              <Play className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
            </span>
          </button>
        )}
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-widest text-ink">{"Film · KNX Polska"}</span>
        <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{"Zobacz, jak działa standard KNX."}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">{"Krótki materiał stowarzyszenia KNX Polska o otwartym standardzie automatyki budynkowej."}</p>
        {!playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-xs font-bold uppercase tracking-wider text-accent transition-colors hover:bg-ink-hover"
          >
            {"Obejrzyj film"}
          </button>
        )}
      </div>
    </div>
  );
};
