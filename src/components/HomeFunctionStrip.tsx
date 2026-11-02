import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Lightbulb, MusicNotes, PersonSimpleWalk, Thermometer, Tree, WifiHigh } from '@phosphor-icons/react';
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

const ICON_STAGGER_MS = 130;
let playedThisDocument = false;

export function HomeFunctionStrip() {
  const list = useRef<HTMLUListElement>(null);
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
      } else if (!playedThisDocument && inView && !document.hidden) {
        playedThisDocument = true;
        setPhase('playing');
      } else {
        return;
      }
      observer?.disconnect();
    }

    if (list.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncSequence();
      });
      observer.observe(list.current);
    } else {
      inView = true;
    }
    syncSequence();
    document.addEventListener('visibilitychange', syncSequence);
    motion.addEventListener('change', syncSequence);
    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', syncSequence);
      motion.removeEventListener('change', syncSequence);
    };
  }, []);

  return (
    <section id="mozliwosci-domu" className="home-function-strip" data-phase={phase} aria-label="Możliwości inteligentnego domu">
      <h1 id="home-intro-title" className="sr-only">InteliSpaces – automatyka KNX do domów, apartamentów i biur</h1>
      <ul ref={list} onAnimationEnd={event => {
        if (event.animationName === 'strip-icon-in' && event.target === event.currentTarget.lastElementChild) {
          setPhase('done');
        }
      }}>
        {capabilities.map(({ icon: Icon, title, text }, index) => (
          <li key={title} style={{ '--icon-at': `${index * ICON_STAGGER_MS}ms` } as CSSProperties}>
            <Icon size={56} weight="light" aria-hidden="true" />
            <h2>{title}</h2>
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
