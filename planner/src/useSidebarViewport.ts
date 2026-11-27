import { useLayoutEffect, useRef } from 'react';

// Keep a sidebar inside the available viewport while the document scrolls.
export function useSidebarViewport(minWidth = 721) {
  const sidebar = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const panel = sidebar.current;
    if (!panel) return;
    const desktop = window.matchMedia(`(min-width: ${minWidth}px)`);
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!desktop.matches) { panel.style.removeProperty('--sidebar-height'); return; }
      const top = Math.max(16, panel.getBoundingClientRect().top);
      panel.style.setProperty('--sidebar-height', `${Math.max(96, window.innerHeight - top - 12)}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    if (panel.parentElement) observer.observe(panel.parentElement);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [minWidth]);
  return sidebar;
}
