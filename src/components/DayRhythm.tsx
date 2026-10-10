import React, { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDown, ArrowRight, Blinds, Lightbulb, Thermometer } from 'lucide-react';
import { plannerUrl } from '../site';
import morning from '../assets/images/day-rhythm-morning.webp';
import away from '../assets/images/day-rhythm-away.webp';
import returning from '../assets/images/day-rhythm-return.webp';
import relax from '../assets/images/day-rhythm-relax.webp';
import night from '../assets/images/day-rhythm-night.webp';
import shade from '../assets/images/day-rhythm-shade.webp';
import './DayRhythm.css';

const scenes = [
  { id: 'morning', image: morning, time: '07:00', label: 'Poranek', title: 'Dzień zaczyna się łagodnie.', text: 'Zasłony odsłaniają widok. Dom budzi się razem z Tobą.', light: 'Naturalne światło', curtains: 'Zasłony otwarte', temperature: '21°C' },
  { id: 'away', image: away, time: '09:00', label: 'Wyjście', title: 'Wychodzisz. Dom pamięta.', text: 'Światła gasną. Zasłony osłaniają wnętrze przed słońcem.', light: 'Światła wyłączone', curtains: 'Ochrona przed słońcem', temperature: '19°C' },
  { id: 'return', image: returning, time: '15:00', label: 'Powrót', title: 'Dobrze być z powrotem.', text: 'Ulubione światło. Przyjemna temperatura. Jesteś u siebie.', light: 'Delikatne światło', curtains: 'Zasłony otwarte', temperature: '21°C' },
  { id: 'relax', image: relax, time: '19:30', label: 'Relaks', title: 'Wieczór, który zwalnia.', text: 'Ciepłe światło. Zasłony przymknięte. Czas dla siebie.', light: 'Ciepłe światło', curtains: 'Zasłony przymknięte', temperature: '22°C' },
  { id: 'night', image: night, time: '23:00', label: 'Noc', title: 'Dobranoc. Dom też zwalnia.', text: 'Zasłony zamknięte. Tylko dyskretne światło przy podłodze.', light: 'Światło nocne', curtains: 'Zasłony zamknięte', temperature: '19°C' },
] as const;

/** A self-contained, decorative demonstration; no connection to a real installation. */
export function DayRhythm() {
  const [active, setActive] = useState(3);
  const [nearby, setNearby] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const manualUntil = useRef(0);
  const headerHeight = useRef(90);
  const current = scenes[active];

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    // Load the other scenes shortly before reaching this part of the homepage.
    if (!('IntersectionObserver' in window)) { setNearby(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setNearby(true);
        observer.disconnect();
      }
    }, { rootMargin: '900px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header');
    const sync = () => {
      headerHeight.current = header?.offsetHeight ?? 0;
      track.current?.style.setProperty('--day-rhythm-header', `${headerHeight.current}px`);
    };
    sync();
    const observer = new ResizeObserver(sync);
    if (header) observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !nearby) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!track.current || !stage.current || performance.now() < manualUntil.current) return;
      const box = track.current.getBoundingClientRect();
      const distance = track.current.offsetHeight - stage.current.offsetHeight;
      // Short screens use normal page flow, so every control remains reachable.
      if (distance <= 1 || box.top > headerHeight.current + 2 || box.bottom < headerHeight.current) return;
      const progress = Math.max(0, Math.min(1, (headerHeight.current - box.top) / distance));
      setActive(Math.min(scenes.length - 1, Math.floor(progress * scenes.length)));
      setEngaged(true);
    };
    const queueUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    queueUpdate();
    return () => {
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion, nearby]);

  function selectScene(index: number, focus = false) {
    setActive(index);
    setNearby(true);
    setEngaged(true);
    manualUntil.current = performance.now() + 1500;
    if (track.current && stage.current && !reducedMotion) {
      const distance = track.current.offsetHeight - stage.current.offsetHeight;
      if (distance > 1) {
        const top = window.scrollY + track.current.getBoundingClientRect().top - headerHeight.current;
        window.scrollTo({ top: top + distance * ((index + 0.15) / scenes.length), behavior: 'smooth' });
      }
    }
    if (focus) tabs.current[index]?.focus({ preventScroll: true });
  }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const targets: Record<string, number> = {
      ArrowRight: (index + 1) % scenes.length,
      ArrowLeft: (index + scenes.length - 1) % scenes.length,
      Home: 0,
      End: scenes.length - 1,
    };
    if (Object.hasOwn(targets, event.key)) {
      event.preventDefault();
      selectScene(targets[event.key], true);
    }
  }

  return (
    <section id="rytm-dnia" ref={track} className="day-rhythm" aria-labelledby="day-rhythm-title">
      <div ref={stage} className="day-rhythm__stage" data-scene={current.id}>
        <div className="day-rhythm__images" aria-hidden="true">
          {scenes.map((scene, index) => (
            <img key={scene.id} src={index === 3 || nearby ? scene.image : undefined}
              alt="" width={1536} height={1024} decoding="async" loading={nearby ? 'eager' : 'lazy'}
              className={`day-rhythm__image${index === active ? ' is-active' : ''}`} />
          ))}
        </div>
        <div className="day-rhythm__shade" style={{ backgroundImage: `url(${shade})` }} aria-hidden="true" />
        <div className="day-rhythm__intro">
          <p className="day-rhythm__eyebrow"><span aria-hidden="true" />JEDEN DZIEŃ Z INTELISPACES</p>
          <h2 id="day-rhythm-title">Twój dzień.<br />Jego rytm.</h2>
          <p className="day-rhythm__description">Dom dopasowuje światło, temperaturę<br className="day-rhythm__break" /> i prywatność do Ciebie.</p>
          <button type="button" className="day-rhythm__next" onClick={() => selectScene(engaged ? (active + 1) % scenes.length : 0)}>
            <ArrowDown size={28} strokeWidth={1} aria-hidden="true" />
            <span>{engaged || reducedMotion ? 'Odkryj kolejną porę dnia' : 'Odkryj, jak zmienia się dom'}</span>
          </button>
        </div>
        <div className="day-rhythm__summary" role="tabpanel" id="day-rhythm-panel"
          aria-labelledby={`day-rhythm-tab-${current.id}`} aria-live="polite" aria-atomic="true">
          <div key={current.id} className="day-rhythm__copy">
            <p className="day-rhythm__time">{current.time}</p>
            <h3>{current.title}</h3>
            <p className="day-rhythm__scene-description">{current.text}</p>
          </div>
          <div className="day-rhythm__status" aria-label="Przykładowe ustawienia sceny">
            <span><Lightbulb size={16} aria-hidden="true" />{current.light}</span>
            <span><Blinds size={16} aria-hidden="true" />{current.curtains}</span>
            <span><Thermometer size={16} aria-hidden="true" />{current.temperature}</span>
          </div>
        </div>
        <div className="day-rhythm__bottom">
          <div className="day-rhythm__timeline" role="tablist" aria-label="Wybierz porę dnia">
            {scenes.map((scene, index) => (
              <button type="button" role="tab" key={scene.id} id={`day-rhythm-tab-${scene.id}`}
                ref={element => { tabs.current[index] = element; }} aria-controls="day-rhythm-panel"
                aria-selected={active === index} tabIndex={active === index ? 0 : -1}
                className={`day-rhythm__stop${active === index ? ' is-selected' : ''}`}
                onClick={() => selectScene(index)} onKeyDown={event => handleKey(event, index)}>
                <span className="day-rhythm__dot" aria-hidden="true" />
                <span>{scene.time}</span><span className="day-rhythm__label">{scene.label}</span>
              </button>
            ))}
          </div>
          <a className="day-rhythm__plan" href={plannerUrl()}>
            Zaplanuj swój inteligentny dom <ArrowRight size={19} aria-hidden="true" />
          </a>
          <p className="day-rhythm__note">Wizualizacja przykładowych scen automatyki</p>
        </div>
      </div>
    </section>
  );
}
