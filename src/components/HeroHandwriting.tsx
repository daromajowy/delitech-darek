import { useEffect, useState, type CSSProperties } from 'react';
import { HERO_PEN_STROKES, HERO_PEN_VIEWBOX } from '../assets/handwriting/hero-pen-paths';
import './HeroHandwriting.css';

const WRITE_MS = 4800;
const LOAD_DELAY_MS = 2000;

// One pass per document load, including remounts when navigating locally.
let hasPlayed = false;

export function HeroHandwriting() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (hasPlayed || motion.matches) return;

    let disposed = false;
    let startTimer: number | undefined;
    let finishTimer: number | undefined;

    const schedule = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const elapsedSinceLoad = navigation?.loadEventEnd ? performance.now() - navigation.loadEventEnd : 0;
      startTimer = window.setTimeout(() => {
        if (disposed || hasPlayed || motion.matches) return;
        hasPlayed = true;
        setVisible(true);
        finishTimer = window.setTimeout(() => setVisible(false), WRITE_MS * 2);
      }, Math.max(0, LOAD_DELAY_MS - elapsedSinceLoad));
    };

    const stopForReducedMotion = () => {
      if (!motion.matches) return;
      window.clearTimeout(startTimer);
      window.clearTimeout(finishTimer);
      setVisible(false);
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    motion.addEventListener('change', stopForReducedMotion);

    return () => {
      disposed = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(finishTimer);
      window.removeEventListener('load', schedule);
      motion.removeEventListener('change', stopForReducedMotion);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="hero-handwriting" aria-hidden="true">
      <svg className="hero-handwriting__ink" viewBox={HERO_PEN_VIEWBOX} focusable="false">
        {HERO_PEN_STROKES.map((stroke, index) => (
          <path
            className="hero-handwriting__stroke"
            key={index}
            d={stroke.d}
            pathLength={1}
            style={{
              '--stroke-duration': `${stroke.duration * WRITE_MS}ms`,
              '--write-at': `${stroke.at * WRITE_MS}ms`,
              '--erase-at': `${WRITE_MS + (1 - stroke.at - stroke.duration) * WRITE_MS}ms`,
            } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}
