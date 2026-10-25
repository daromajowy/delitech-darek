import { useCallback, useEffect, useRef, useState } from "react";

export function useTransientFeedback() {
  const [visible, setVisible] = useState({});
  const timers = useRef({});
  const show = useCallback((name, duration = 2400) => {
    clearTimeout(timers.current[name]);
    setVisible((current) => ({ ...current, [name]: true }));
    timers.current[name] = setTimeout(() => {
      setVisible((current) => ({ ...current, [name]: false }));
      delete timers.current[name];
    }, duration);
  }, []);
  const clear = useCallback(() => {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
    setVisible({});
  }, []);
  const hide = useCallback((name) => {
    clearTimeout(timers.current[name]);
    delete timers.current[name];
    setVisible((current) => ({ ...current, [name]: false }));
  }, []);
  useEffect(
    () => () => Object.values(timers.current).forEach(clearTimeout),
    [],
  );
  return { visible, show, hide, clear };
}
