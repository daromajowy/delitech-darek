import React from "react";
import {
  Lightbulb,
  Thermometer,
  Clapperboard,
  Power,
  Blinds,
} from "lucide-react";
import { describeLight } from "./homeLighting";
import { house, houseOff, houseRest, houseCinema } from "./assets";

const temperatureText = (value) => value.toFixed(1).replace(".", ",");

export function HouseScene({
  home,
  blinds,
  target,
  moving,
  temp,
  pulse,
  feedback,
  sceneFeedback,
}) {
  const off = sceneFeedback === "off";
  const allOn = sceneFeedback === "all-on";
  const sceneLabel = off
    ? "Światła i TV wyłączone"
    : allOn
      ? "Pełne oświetlenie domu"
      : "Scena Kino · TV włączony";
  return (
    <div
      className="house-scene"
      role="img"
      aria-label={
        "Pokazowy dom: światło w salonie " +
        describeLight(home.salon) +
        ", w kuchni " +
        describeLight(home.kitchen) +
        ", w przedpokoju " +
        describeLight(home.hall) +
        ", pozostałe światła " +
        (home.rest ? "włączone" : "wyłączone") +
        ", telewizor " +
        (home.tv ? "włączony" : "wyłączony") +
        ", rolety " +
        Math.round(blinds) +
        "% opuszczenia, temperatura " +
        temperatureText(temp) +
        " stopni"
      }
    >
      <img
        className="house-base"
        width={1448}
        height={1086}
        src={houseOff}
        alt="Ten sam przekrój domu: salon, kuchnia i wejście na parterze, sypialnie na piętrze"
      />
      {["upper", "carport"].map((zone) => (
        <img
          key={zone}
          className={"house-layer room-light zone-" + zone}
          src={houseRest}
          style={{ opacity: home.rest ? 1 : 0 }}
          alt=""
          aria-hidden="true"
        />
      ))}
      {["hall", "salon", "kitchen"].map((zone) => (
        <React.Fragment key={zone}>
          <img
            data-room={zone}
            data-level="100"
            className={"house-layer room-light zone-" + zone}
            src={zone === "salon" ? house : houseRest}
            style={{ opacity: home[zone] === 100 ? 1 : 0 }}
            alt=""
            aria-hidden="true"
          />
          <img
            data-room={zone}
            data-level="20"
            className={"house-layer room-light zone-" + zone}
            src={houseCinema}
            style={{ opacity: home[zone] === 20 ? 1 : 0 }}
            alt=""
            aria-hidden="true"
          />
        </React.Fragment>
      ))}
      <img
        className="house-layer tv-layer"
        data-on={home.tv}
        src={houseCinema}
        style={{ opacity: home.tv ? 1 : 0 }}
        alt=""
        aria-hidden="true"
      />
      <div className="blind-window" aria-hidden="true">
        <div
          className="blind-material"
          style={{ transform: "translateY(" + (blinds - 100) + "%)" }}
        />
      </div>

      {["salon", "kitchen"].map((zone) => (
        <div
          key={zone}
          aria-hidden={!feedback[zone]}
          className={
            "house-tag " +
            (zone === "salon" ? "light-tag" : "kitchen-tag") +
            " bubble-feedback " +
            (feedback[zone] ? "is-visible " : "") +
            (home[zone] > 0 ? "enabled" : "")
          }
        >
          <Lightbulb size={15} />
          <span>
            {zone === "salon" ? "Salon" : "Kuchnia"} ·{" "}
            {home[zone] > 0 ? "światło włączone" : "światło wyłączone"}
          </span>
        </div>
      ))}
      <div
        aria-hidden={!feedback.blinds}
        className={
          "house-tag blind-tag bubble-feedback " +
          (feedback.blinds ? "is-visible " : "") +
          (target ? "enabled" : "")
        }
      >
        <Blinds size={15} />
        <span>
          {moving
            ? (target > blinds ? "Opuszczanie" : "Podnoszenie") +
              " · " +
              Math.round(blinds) +
              "%"
            : blinds === 0
              ? "Rolety otwarte"
              : blinds === 100
                ? "Rolety opuszczone"
                : "Rolety · " + Math.round(blinds) + "%"}
        </span>
      </div>
      {pulse && (
        <div
          key={pulse.key}
          className={"floor-feedback " + (pulse.up ? "warmer" : "cooler")}
          aria-hidden="true"
        />
      )}
      <div
        aria-hidden={!feedback.heat}
        className={
          "house-tag temperature-tag bubble-feedback " +
          (feedback.heat ? "is-visible " : "") +
          (pulse ? "warming" : "")
        }
      >
        <Thermometer size={15} />
        <span>{temperatureText(temp)}°C</span>
      </div>
      <div
        aria-hidden={!feedback.scene}
        className={
          "house-tag scene-tag bubble-feedback " +
          (feedback.scene ? "is-visible " : "") +
          (off ? "" : "enabled")
        }
      >
        {off ? (
          <Power size={15} />
        ) : allOn ? (
          <Lightbulb size={15} />
        ) : (
          <Clapperboard size={15} />
        )}
        <span>{sceneLabel}</span>
      </div>
    </div>
  );
}
