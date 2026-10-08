import React from "react";
import { createRoot } from "react-dom/client";
import { Access } from "./Access";
import { isDemo } from "./api";
import "./style.css";
import "./control.css";
import "./flow.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isDemo && <div className="demo-banner" role="status">Podgląd demonstracyjny · projekty i pliki pozostają wyłącznie w pamięci tej karty. Odświeżenie usuwa zmiany. <a href="https://knx.intelispaces.pl/">Otwórz właściwy konfigurator</a></div>}
    <Access />
  </React.StrictMode>,
);
