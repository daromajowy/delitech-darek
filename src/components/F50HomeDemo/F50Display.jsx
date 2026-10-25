import React from "react";

import { glyphs } from "./assets";
const glyph = (name) => glyphs[name];

// LS990/CD500 segment positions and symbols: JUNG technical manual, pp. 167–175.
// These eight function symbols are static ETS assignments; state is shown by the LEDs.
export function F50Display({ temperature, heating }) {
  return (
    <div
      className="lcd"
      role="img"
      aria-label={
        "Wyświetlacz F50: temperatura zadana " +
        temperature.toFixed(1).replace(".", ",") +
        " stopni, tryb komfort" +
        (heating ? ", zapotrzebowanie na ogrzewanie" : "")
      }
    >
      <img
        className="lcd-comfort"
        src={glyph("comfort")}
        alt=""
        aria-hidden="true"
      />
      {[
        ["toggle", "left", 1],
        ["toggle", "right", 1],
        ["up", "left", 2],
        ["down", "right", 2],
        ["minus", "left", 3],
        ["plus", "right", 3],
        ["on", "left", 4],
        ["off", "right", 4],
      ].map(([symbol, side, row]) => (
        <span
          key={side + row}
          className={"lcd-function " + side + " lcd-row-" + row}
          aria-hidden="true"
        >
          {symbol === "toggle" ? (
            <span className="lcd-toggle-symbols">
              {["on", "off"].map((value) => (
                <img key={value} src={glyph(value)} alt="" />
              ))}
            </span>
          ) : symbol === "plus" || symbol === "minus" ? (
            <span className="lcd-segment-set">
              {(symbol === "plus" ? ["g", "h", "i"] : ["g"]).map((segment) => (
                <img key={segment} src={glyph("plus-" + segment)} alt="" />
              ))}
            </span>
          ) : (
            <img
              className={"lcd-symbol lcd-symbol-" + symbol}
              src={glyph(symbol)}
              alt=""
            />
          )}
        </span>
      ))}
      <div className="lcd-temperature" aria-hidden="true">
        <img className="lcd-controller" src={glyph("controller")} alt="" />
        <span>
          {temperature.toFixed(1)}
          <span className="lcd-unit">°C</span>
        </span>
      </div>
      <img
        className="lcd-setpoint"
        src={glyph("setpoint")}
        alt=""
        aria-hidden="true"
      />
      <img
        className={"lcd-heating" + (heating ? " is-on" : "")}
        src={glyph("heating")}
        alt=""
        aria-hidden="true"
      />
    </div>
  );
}
