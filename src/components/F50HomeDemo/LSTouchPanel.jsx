import React, { useRef } from "react";
import frame from "../../assets/images/ls-touch-graphite.png";
import floorLight from "../../assets/images/ls-touch-light-floor.png";
import ceilingLight from "../../assets/images/ls-touch-light-ceiling.png";
import blindsIcon from "../../assets/images/ls-touch-blinds.png";
import movie from "../../assets/images/ls-touch-movie.png";
import power from "../../assets/images/ls-touch-power.png";
import "./LSTouchPanel.css";

const icons = { salon: floorLight, kitchen: ceilingLight, cinema: movie, "all-off": power };
const pageNames = ["Światła i sceny", "Rolety i temperatura"];

// The manufacturer's frame stays intact. Only its active display is covered by
// the live favourites UI. Both controllers use the same parent-owned actions.
export function LSTouchPanel({ buttons, temperature, blinds, pressed, page, onPageChange, onGestureCancel, blindEvents }) {
  const gesture = useRef(null);
  const swiped = useRef(false);
  const controls = Object.fromEntries(buttons.map(button => [button.id, button]));

  function gestureStart(event) {
    if (!event.isPrimary || event.button !== 0) return;
    gesture.current = { x: event.clientX, y: event.clientY };
    swiped.current = false;
  }
  function gestureEnd(event) {
    if (!gesture.current) return;
    const dx = event.clientX - gesture.current.x;
    const dy = event.clientY - gesture.current.y;
    gesture.current = null;
    if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swiped.current = true;
      onPageChange(dx < 0 ? 1 : 0);
    }
  }
  function gestureMove(event) {
    if (!gesture.current || swiped.current) return;
    const dx = Math.abs(event.clientX - gesture.current.x);
    const dy = Math.abs(event.clientY - gesture.current.y);
    if (dx > 14 && dx > dy * 1.5) {
      swiped.current = true;
      // A swipe starting on a blind arrow must not become a long press.
      onGestureCancel();
    }
  }
  function functionButton(id, className, children) {
    const control = controls[id];
    return (
      <button
        type="button"
        key={id}
        className={`${className}${pressed === id ? " is-pressed" : ""}`}
        data-active={!!control.active}
        aria-label={control.label}
        aria-pressed={["salon", "kitchen", "cinema", "all-off"].includes(id) ? !!control.active : undefined}
        aria-describedby={control.direction ? "f50-blind-instructions" : control.descriptionId}
        disabled={control.disabled}
        {...(control.direction ? blindEvents(control.direction) : { onClick: control.action })}
      >
        {children}
      </button>
    );
  }
  return (
    <div className="panel ls-touch-panel" role="group" aria-label="JUNG LS TOUCH, czarny mat, czarny ekran — pokazowy układ funkcji">
      <div className="ls-touch-device">
        <img className="ls-touch-frame" src={frame} alt="JUNG LS TOUCH z ramką LS 990 w czarnym macie" draggable="false" />
        <div
          className="ls-touch-screen"
          onPointerDownCapture={gestureStart}
          onPointerMoveCapture={gestureMove}
          onPointerUpCapture={gestureEnd}
          onPointerCancel={() => { gesture.current = null; }}
          onClickCapture={event => {
            if (swiped.current && event.detail !== 0) {
              event.preventDefault();
              event.stopPropagation();
              swiped.current = false;
            }
          }}
        >
          {page === 0 ? (
            <div className="ls-touch-favourites" role="group" aria-label={pageNames[0]}>
              {["salon", "kitchen", "cinema", "all-off"].map(id => functionButton(id, "ls-touch-tile", <>
                <img src={icons[id]} alt="" aria-hidden="true" draggable="false" />
                <span>{controls[id].short}</span>
                <span className="ls-touch-state" aria-hidden="true">{controls[id].active ? "●" : "○"}</span>
              </>))}
            </div>
          ) : (
            <div className="ls-touch-comfort" role="group" aria-label={pageNames[1]}>
              <div className="ls-touch-column">
                {functionButton("blind-open", "ls-touch-adjust", <span className="ls-touch-chevron up" aria-hidden="true" />)}
                <div className="ls-touch-value ls-touch-blinds" role="img" aria-label={`Rolety: ${Math.round(blinds)}% opuszczenia`}>
                  <img src={blindsIcon} alt="" draggable="false" />
                  <span>{Math.round(blinds)}%</span>
                </div>
                {functionButton("blind-close", "ls-touch-adjust", <span className="ls-touch-chevron down" aria-hidden="true" />)}
              </div>
              <div className="ls-touch-column">
                {functionButton("temp-up", "ls-touch-adjust", <span className="ls-touch-plus" aria-hidden="true" />)}
                <div className="ls-touch-value" role="img" aria-label={`Temperatura zadana: ${temperature.toFixed(1).replace(".", ",")} stopni`}>
                  <span className="ls-touch-temperature">{temperature.toFixed(1).replace(".", ",")}<span>°C</span></span>
                </div>
                {functionButton("temp-down", "ls-touch-adjust", <span className="ls-touch-minus" aria-hidden="true" />)}
              </div>
            </div>
          )}
          <div className="ls-touch-pagination" role="group" aria-label="Ekrany ulubionych LS TOUCH">
            {pageNames.map((name, index) => (
              <button
                key={name}
                type="button"
                aria-label={`LS TOUCH: ${name.toLowerCase()}`}
                aria-pressed={page === index}
                title={name}
                onClick={() => onPageChange(index)}
              ><span aria-hidden="true" /></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
