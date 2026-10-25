import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  ArrowRight,
  Lightbulb,
  ChevronsUp,
  ChevronsDown,
  Thermometer,
  Minus,
  Plus,
  Clapperboard,
  Power,
  RotateCcw,
  MousePointer2,
  Check,
  Blinds,
} from "lucide-react";
import "./F50HomeDemo.css";
import { plannerUrl } from "../../site";
import { panel } from "./assets";
import { F50Display } from "./F50Display";
import { useTransientFeedback } from "./useTransientFeedback";

import { HouseScene } from "./HouseScene";
import {
  initialLighting,
  lightingReducer,
  cinemaActive,
  allLightsOff,
} from "./homeLighting";

const temperatureText = (t) => t.toFixed(1).replace(".", ",");
export function F50HomeDemo() {
  const feedback = useTransientFeedback();
  const [home, dispatchHome] = useReducer(lightingReducer, initialLighting);
  const [sceneFeedback, setSceneFeedback] = useState("cinema");
  const [target, setTarget] = useState(0);
  const [blinds, setBlinds] = useState(0);
  const [temp, setTemp] = useState(21);
  const [pulse, setPulse] = useState(null);
  const [last, setLast] = useState({
    kind: "intro",
    title: "Twój dom. Jeden przycisk od zmiany.",
    text: "Naciśnij symbol na panelu i zobacz, co się wydarzy.",
  });
  const [pressed, setPressed] = useState("");
  const pulseTimer = useRef(),
    pressTimer = useRef(),
    progress = useRef(0),
    raf = useRef(),
    latest = useRef(0);
  const holdTimer = useRef(),
    holdTriggered = useRef(false),
    holdDirection = useRef(null),
    targetRef = useRef(0),
    moveMode = useRef("idle");
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = target;
      setBlinds(target);
      moveMode.current = "idle";
      return;
    }
    const start = performance.now(),
      from = progress.current;
    const duration = Math.max(
      280,
      Math.abs(target - from) * (moveMode.current === "full" ? 40 : 30),
    );
    const frame = (now) => {
      const time = Math.min(1, (now - start) / duration);
      const value = from + (target - from) * time;
      progress.current = value;
      setBlinds(value);
      if (time < 1) raf.current = requestAnimationFrame(frame);
      else moveMode.current = "idle";
    };
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  useEffect(
    () => () => {
      clearTimeout(pulseTimer.current);
      clearTimeout(pressTimer.current);
      clearTimeout(holdTimer.current);
      cancelAnimationFrame(raf.current);
    },
    [],
  );
  function press(id) {
    setPressed(id);
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => setPressed(""), 220);
  }
  function toggleRoom(room) {
    const on = home[room] === 0;
    press(room);
    dispatchHome({ type: "toggle-room", room });
    feedback.hide("scene");
    feedback.show(room);
    setLast({
      kind: "light",
      title:
        (room === "salon" ? "Salon" : "Kuchnia") +
        ". Światło " +
        (on ? "włączone." : "wyłączone."),
      text: "Kolejne naciśnięcie tego samego klawisza ponownie przełączy światło.",
    });
  }
  function shade(direction, full = false) {
    const base =
      moveMode.current === "step" ? targetRef.current : progress.current;
    const next = full
      ? direction > 0
        ? 100
        : 0
      : Math.max(0, Math.min(100, base + direction * 15));
    feedback.show(
      "blinds",
      Math.max(280, Math.abs(next - progress.current) * (full ? 40 : 30)) +
        1600,
    );
    targetRef.current = next;
    moveMode.current = full ? "full" : "step";
    press(direction > 0 ? "blind-close" : "blind-open");
    setTarget(next);
    setLast({
      kind: "blinds",
      title: full
        ? direction > 0
          ? "Roleta zjeżdża do końca."
          : "Roleta podnosi się do końca."
        : "Mały ruch. Dokładnie tyle, ile chcesz.",
      text: full
        ? "Możesz już puścić klawisz. Roleta dojedzie do końca w wybranym kierunku."
        : "Kliknięcie przesuwa roletę o 15%. Przytrzymaj klawisz przez pół sekundy, żeby pojechała do końca.",
    });
  }
  function holdStart(direction) {
    clearTimeout(holdTimer.current);
    holdTriggered.current = false;
    holdDirection.current = direction;
    setPressed(direction > 0 ? "blind-close" : "blind-open");
    holdTimer.current = setTimeout(() => {
      holdTriggered.current = true;
      shade(direction, true);
    }, 500);
  }
  function holdEnd() {
    clearTimeout(holdTimer.current);
    if (holdDirection.current !== null && !holdTriggered.current)
      shade(holdDirection.current);
    holdDirection.current = null;
    setPressed("");
  }
  function holdCancel() {
    clearTimeout(holdTimer.current);
    holdDirection.current = null;
    setPressed("");
  }
  function blindEvents(direction) {
    return {
      onPointerDown: (e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        holdStart(direction);
      },
      onPointerUp: (e) => {
        holdEnd();
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId);
      },
      onPointerCancel: () => {
        if (holdDirection.current === direction) holdCancel();
      },
      onLostPointerCapture: () => {
        if (holdDirection.current === direction) holdCancel();
      },
      onKeyDown: (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (!e.repeat) holdStart(direction);
        }
      },
      onKeyUp: (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          holdEnd();
        }
      },
      onBlur: () => {
        if (holdDirection.current === direction) holdCancel();
      },
      onClick: (e) => {
        if (e.detail === 0) shade(direction);
      },
    };
  }
  function heat(delta) {
    feedback.show("heat", 2600);
    press(delta > 0 ? "temp-up" : "temp-down");
    const next = Math.max(18, Math.min(26, temp + delta));
    setTemp(next);
    const key = ++latest.current;
    setPulse({ key, up: delta > 0 });
    clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(null), 2600);
    setLast({
      kind: "heat",
      title: "Ustawiasz " + temperatureText(next) + "°C.",
      text: "Krótka łuna pokazuje zmianę nastawy. W prawdziwym domu podłoga nagrzewa się stopniowo.",
    });
  }
  function activateCinema() {
    press("cinema");
    dispatchHome({ type: "cinema" });
    setSceneFeedback("cinema");
    feedback.clear();
    feedback.show("scene", 3200);
    setLast({
      kind: "cinema",
      title: "Kino. Zostań wygodnie na kanapie.",
      text: "Salon, kuchnia i przedpokój przygasają. Zostaje delikatne światło LED, a telewizor się włącza.",
    });
  }
  function allOff() {
    press("all-off");
    dispatchHome({ type: "all-off" });
    setSceneFeedback("off");
    setPulse(null);
    clearTimeout(pulseTimer.current);
    feedback.clear();
    feedback.show("scene");
    setLast({
      kind: "off",
      title: "ALL OFF. Dom gaśnie.",
      text: "Światła w całym domu i telewizor są wyłączone.",
    });
  }
  function reset() {
    feedback.clear();
    holdCancel();
    targetRef.current = 0;
    moveMode.current = "idle";
    dispatchHome({ type: "reset" });
    setTarget(0);
    setTemp(21);
    setPulse(null);
    clearTimeout(pulseTimer.current);
    setLast({
      kind: "intro",
      title: "Zacznij od jednego naciśnięcia.",
      text: "Steruj salonem i kuchnią osobno albo wybierz scenę Kino.",
    });
  }
  const cinema = cinemaActive(home),
    everythingOff = allLightsOff(home);
  const moving = Math.abs(blinds - target) > 0.5;
  const buttons = [
    {
      id: "salon",
      row: 1,
      side: "left",
      Icon: Lightbulb,
      label: "Światło w salonie",
      short: "Salon",
      active: home.salon > 0,
      action: () => toggleRoom("salon"),
    },
    {
      id: "kitchen",
      row: 1,
      side: "right",
      Icon: Lightbulb,
      label: "Światło w kuchni",
      short: "Kuchnia",
      active: home.kitchen > 0,
      action: () => toggleRoom("kitchen"),
    },
    {
      id: "blind-open",
      row: 2,
      side: "left",
      Icon: ChevronsUp,
      label: "Otwórz rolety",
      short: "Góra",
      active: moving && target < blinds,
      direction: -1,
    },
    {
      id: "blind-close",
      row: 2,
      side: "right",
      Icon: ChevronsDown,
      label: "Zamknij rolety",
      short: "Dół",
      active: target > 0,
      direction: 1,
    },
    {
      id: "temp-down",
      row: 3,
      side: "left",
      Icon: Minus,
      label: "Zmniejsz temperaturę o pół stopnia",
      short: "Chłodniej",
      action: () => heat(-0.5),
      disabled: temp <= 18,
    },
    {
      id: "temp-up",
      row: 3,
      side: "right",
      Icon: Plus,
      label: "Zwiększ temperaturę o pół stopnia",
      short: "Cieplej",
      active: pulse?.up,
      action: () => heat(0.5),
      disabled: temp >= 26,
    },
    {
      id: "cinema",
      row: 4,
      side: "left",
      Icon: Clapperboard,
      label: "Scena Kino",
      short: "Kino",
      active: cinema,
      action: activateCinema,
    },
    {
      id: "all-off",
      row: 4,
      side: "right",
      Icon: Power,
      label: "ALL OFF — wyłącz światła i telewizor",
      short: "ALL OFF",
      active: everythingOff,
      action: allOff,
    },
  ];
  const ledState = {
    salon: home.salon > 0 ? "green" : "blue",
    kitchen: home.kitchen > 0 ? "green" : "blue",
    "blind-open": moving
      ? target < blinds
        ? "blue"
        : "off"
      : blinds === 0
        ? "green"
        : "off",
    "blind-close": moving
      ? target > blinds
        ? "blue"
        : "off"
      : blinds > 0
        ? "green"
        : "off",
    "temp-down": temp < 21 ? "blue" : "off",
    "temp-up": temp > 21 ? "red" : "off",
    cinema: cinema ? "green" : "off",
    "all-off": everythingOff ? "blue" : "off",
  };
  const LastIcon = {
    light: Lightbulb,
    blinds: Blinds,
    heat: Thermometer,
    cinema: Clapperboard,
    off: Power,
    intro: MousePointer2,
  }[last.kind];
  return (
    <section
      className="f50-demo"
      id="steruj-domem"
      aria-labelledby="f50-demo-title"
    >
      <div className="f50-demo__inner">
        <section className="section-head">
          <div>
            <p className="eyebrow">
              <span />
              CO MOŻE TWÓJ DOM
            </p>
            <h2 id="f50-demo-title">Naciśnij. Dom odpowie.</h2>
            <p className="intro">
              Światło, prywatność, ciepło i domowe kino.
              <br className="mobile-break" /> Zobacz, jak łatwo nimi sterować.
            </p>
          </div>
          <span className="demo-label">
            <span />
            Interaktywna demonstracja
          </span>
        </section>
        <section
          className="experience"
          aria-label="Steruj pokazowym domem panelem JUNG F50"
        >
          <aside className="control-area">
            <div className="control-title">
              <span className="eyebrow">TWÓJ PRZYCISK</span>
              <span>JUNG F50</span>
            </div>
            <div className="panel-plinth">
              <div
                className="panel"
                aria-label="JUNG F50 z wyświetlaczem — pokazowy układ funkcji"
              >
                <img
                  className="panel-art"
                  src={panel}
                  alt="Biały panel JUNG F50, centralny wyświetlacz i osiem klawiszy"
                />
                <F50Display temperature={temp} heating={temp > 21} />
                {buttons.map(
                  ({
                    id,
                    row,
                    side,
                    Icon,
                    label,
                    short,
                    active,
                    action,
                    disabled,
                    direction,
                  }) => (
                    <button
                      key={id}
                      className={
                        "rocker " +
                        side +
                        " row-" +
                        row +
                        (active ? " active" : "") +
                        (pressed === id ? " pushed" : "")
                      }
                      aria-label={label}
                      aria-describedby={
                        direction ? "f50-blind-instructions" : undefined
                      }
                      aria-pressed={
                        ["salon", "kitchen"].includes(id) ? !!active : undefined
                      }
                      title={
                        label +
                        (direction
                          ? " — klik: 15%, przytrzymanie: do końca"
                          : "")
                      }
                      disabled={disabled}
                      {...(direction
                        ? blindEvents(direction)
                        : { onClick: action })}
                    >
                      <Icon size={21} strokeWidth={1.65} />
                      <span className="rocker-label">{short}</span>
                    </button>
                  ),
                )}
                <div className="status-leds" aria-hidden="true">
                  {buttons.map(({ id, row, side }) => (
                    <span
                      key={id}
                      data-led={id}
                      data-state={ledState[id]}
                      className={
                        "status-led " +
                        side +
                        " led-row-" +
                        row +
                        " " +
                        ledState[id] +
                        (moving &&
                        id.startsWith("blind-") &&
                        ledState[id] === "blue"
                          ? " in-motion"
                          : "")
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="panel-hint">
              <MousePointer2 size={16} />
              <span>
                Kliknij symbol na przycisku.
                <br />
                Diody pokazują stan funkcji.
              </span>
            </p>
            <div className="control-note" id="f50-blind-instructions">
              <Blinds size={16} />
              <span>
                Rolety: klik — mały ruch.
                <br />
                Przytrzymaj — do końca.
              </span>
            </div>
          </aside>
          <div className="home-area">
            <HouseScene
              home={home}
              blinds={blinds}
              target={target}
              moving={moving}
              temp={temp}
              pulse={pulse}
              feedback={feedback.visible}
              sceneFeedback={sceneFeedback}
            />
            <div className="feedback" role="status" aria-live="polite">
              <span className="feedback-icon">
                <LastIcon size={24} />
              </span>
              <div>
                <h3>{last.title}</h3>
                <p>{last.text}</p>
              </div>
              <span className="feedback-check">
                <Check size={16} />
              </span>
            </div>
          </div>
        </section>
        <section className="bottom-bar">
          <p>
            <span className="small-dot" />
            To tylko kilka możliwości. Twój dom może więcej.
          </p>
          <button className="reset" onClick={reset}>
            <RotateCcw size={15} />
            Zacznij od nowa
          </button>
          <a className="primary-cta" href={plannerUrl()}>
            Zaplanuj swój dom <ArrowRight size={18} />
          </a>
        </section>
        <p className="demo-note">
          Pokazowy układ funkcji. Zakres integracji dobieramy do urządzeń i
          projektu.
        </p>
      </div>
    </section>
  );
}
export default F50HomeDemo;
