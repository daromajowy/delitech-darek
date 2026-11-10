import React from "react";
import panel from "../../assets/images/f40-demo-panel-aluminium.jpg";
import "./F40Panel.css";

// Four physical rockers, with an independent upper and lower function on each.
const rockers = [
  { label: "Światła", ids: ["salon", "kitchen"] },
  { label: "Rolety", ids: ["blind-open", "blind-close"] },
  { label: "Temperatura", ids: ["temp-up", "temp-down"] },
  { label: "Sceny", ids: ["cinema", "all-off"] },
];
const toggleIds = ["salon", "kitchen", "cinema", "all-off"];

export function F40Panel({ buttons, pressed, ledState, blindEvents }) {
  const controls = Object.fromEntries(buttons.map(button => [button.id, button]));
  return (
    <div className="panel f40-panel" role="group" aria-label="JUNG F40 aluminium, cztery klawisze — pokazowy układ ośmiu funkcji">
      <div className="f40-device">
        <img className="f40-art" src={panel} alt="Aluminiowy JUNG F40 z czterema dużymi klawiszami w ramce LS 990" draggable="false" />
        <div className="f40-light-guide" aria-hidden="true" />
        <div className="f40-keys">
          {rockers.map(({ label, ids }) => (
            <div className="f40-key" role="group" aria-label={label} key={label}>
              {ids.map(id => {
                const control = controls[id];
                const Icon = control.Icon;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`f40-action${pressed === id ? " is-pressed" : ""}`}
                    data-function={id}
                    aria-label={control.label}
                    aria-pressed={toggleIds.includes(id) ? !!control.active : undefined}
                    aria-describedby={control.direction ? "f50-blind-instructions" : control.descriptionId}
                    title={control.label + (control.direction ? " — klik: 15%, przytrzymanie: do końca" : "")}
                    disabled={control.disabled}
                    {...(control.direction ? blindEvents(control.direction) : { onClick: control.action })}
                  >
                    <Icon aria-hidden="true" strokeWidth={1.65} />
                    <span>{control.short}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="f40-leds" aria-hidden="true">
          {rockers.flatMap(({ ids }, group) => ids.map((id, half) => {
            const on = toggleIds.includes(id) ? controls[id].active : ledState[id] !== "off";
            return (
              <span
                key={id}
                className={`f40-led${on ? " is-on" : ""}${id.startsWith("blind-") && ledState[id] === "blue" ? " in-motion" : ""}`}
                data-led={id}
                data-state={on ? "on" : "off"}
                style={{ "--led-side": group % 2, "--led-row": Math.floor(group / 2) * 2 + half }}
              />
            );
          }))}
          <span className="f40-operation-led" />
        </div>
      </div>
    </div>
  );
}
