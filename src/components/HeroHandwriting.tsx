import { useEffect, useState, type CSSProperties } from 'react';
import './HeroHandwriting.css';

const WORDS = ['Tworzymy', 'inteligentne', 'przestrzenie'];
const LETTER_COUNT = WORDS.join(' ').length;
const WRITE_MS = 4800;
const LETTER_MS = WRITE_MS / LETTER_COUNT;
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
    const fontReady = document.fonts.load('500 80px "InteliSpaces Handwriting"').catch(() => []);

    const schedule = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const elapsedSinceLoad = navigation?.loadEventEnd ? performance.now() - navigation.loadEventEnd : 0;
      startTimer = window.setTimeout(async () => {
        await fontReady;
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

  let position = 0;
  return (
    <div className="hero-handwriting" aria-hidden="true">
      <p className="hero-handwriting__text">
        {WORDS.map(word => {
          const wordStart = position;
          position += word.length + 1;
          return (
            <span className="hero-handwriting__word" key={word}>
              {Array.from(word).map((letter, index) => {
                const order = wordStart + index;
                return (
                  <span
                    className="hero-handwriting__letter"
                    key={index}
                    style={{
                      '--letter-duration': `${LETTER_MS}ms`,
                      '--write-at': `${order * LETTER_MS}ms`,
                      '--erase-at': `${WRITE_MS + (LETTER_COUNT - 1 - order) * LETTER_MS}ms`,
                    } as CSSProperties}
                  >{letter}</span>
                );
              })}
            </span>
          );
        })}
      </p>
    </div>
  );
}
