import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Lightbulb, MusicNotes, PersonSimpleWalk, Thermometer, Tree, WifiHigh } from '@phosphor-icons/react';
import { HERO_PEN_STROKES, HERO_PEN_VIEWBOX } from '../assets/handwriting/hero-pen-paths';
import { BlindsIcon, ScenesIcon } from './HomeTechnologyIcons';
import './HomeFunctionStrip.css';

const capabilities = [
  { icon: Lightbulb, title: 'Światło', text: 'Tworzy nastrój i poprawia komfort.' },
  { icon: BlindsIcon, title: 'Rolety', text: 'Dają prywatność i kontrolę nad światłem.' },
  { icon: Thermometer, title: 'Temperatura', text: 'Przyjemny klimat w każdym pomieszczeniu.' },
  { icon: PersonSimpleWalk, title: 'Obecność', text: 'Dom reaguje na to, gdzie jesteś.' },
  { icon: ScenesIcon, title: 'Sceny', text: 'Kilka zmian jednym przyciskiem.' },
  { icon: MusicNotes, title: 'Multimedia', text: 'Muzyka i obraz w Twoim rytmie.' },
  { icon: WifiHigh, title: 'IoT', text: 'Ulubione urządzenia we wspólnych scenach.' },
  { icon: Tree, title: 'Ogród', text: 'Podlewanie dopasowane do pogody i potrzeb roślin.' },
];

const START_DELAY_MS = 2000;
const PEN_MS = 2800;
const READ_MS = 900;
const ERASE_START_MS = START_DELAY_MS + PEN_MS + READ_MS;
const ICON_START_MS = ERASE_START_MS + PEN_MS;
const ICON_STAGGER_MS = 130;
let playedThisDocument = false;

function PenLettering() {
  return (
    <svg className="home-function-strip__ink" viewBox={HERO_PEN_VIEWBOX} aria-hidden="true" focusable="false">
      {HERO_PEN_STROKES.map((stroke, index) => (
        <path
          key={index}
          d={stroke.d}
          pathLength={1}
          style={{
            '--stroke-duration': `${stroke.duration * PEN_MS}ms`,
            '--write-at': `${START_DELAY_MS + stroke.at * PEN_MS}ms`,
            '--erase-at': `${ERASE_START_MS + stroke.at * PEN_MS}ms`,
          } as CSSProperties}
        />
      ))}
    </svg>
  );
}

export function HomeFunctionStrip() {
  const heading = useRef<HTMLHeadingElement>(null);
  const [phase, setPhase] = useState<'waiting' | 'playing' | 'done'>(() => playedThisDocument ? 'done' : 'waiting');

  useEffect(() => {
    if (playedThisDocument) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    let observer: IntersectionObserver | undefined;

    function syncSequence() {
      if (motion.matches) {
        playedThisDocument = true;
        setPhase('done');
      } else if (!playedThisDocument && inView && document.readyState === 'complete' && !document.hidden) {
        playedThisDocument = true;
        setPhase('playing');
      } else {
        return;
      }
      observer?.disconnect();
    }

    if (heading.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncSequence();
      });
      observer.observe(heading.current);
    } else {
      inView = true;
    }
    syncSequence();
    window.addEventListener('load', syncSequence, { once: true });
    document.addEventListener('visibilitychange', syncSequence);
    motion.addEventListener('change', syncSequence);
    return () => {
      observer?.disconnect();
      window.removeEventListener('load', syncSequence);
      document.removeEventListener('visibilitychange', syncSequence);
      motion.removeEventListener('change', syncSequence);
    };
  }, []);

  return (
    <section id="mozliwosci-domu" className="home-function-strip" data-phase={phase} aria-label="Możliwości inteligentnego domu">
      <h1 ref={heading} id="home-intro-title" className="home-function-strip__signature">
        <span className="sr-only">Tworzymy inteligentne przestrzenie</span>
        {phase === 'playing' && <PenLettering />}
      </h1>
      <ul onAnimationEnd={event => {
        if (event.animationName === 'strip-icon-in' && event.target === event.currentTarget.lastElementChild) {
          setPhase('done');
        }
      }}>
        {capabilities.map(({ icon: Icon, title, text }, index) => (
          <li key={title} style={{ '--icon-at': `${ICON_START_MS + index * ICON_STAGGER_MS}ms` } as CSSProperties}>
            <Icon size={56} weight="light" aria-hidden="true" />
            <h2>{title}</h2>
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
