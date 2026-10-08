# KNX unified flow — Janka implementation QA

Date: 2026-10-08. Scope: branch Janka only. No production deployment or changes to Elektrodesign.

## Visual truth and evidence

Approved source: `C:/Users/Asdmin/Documents/ChatGPT/KNX/outputs/knx-wspolny-proces-20261008/koncepcja.html` and its `01-przestrzen.png`, `02-funkcje-i-sceny.png`, `03-sterowanie.png`, `04-sprawdz-i-przekaz.png`.

Browser-rendered implementation: `http://127.0.0.1:3058/`, synthetic in-memory example project. Screenshots in `C:/Users/Asdmin/Documents/ChatGPT/KNX/outputs/janka-knx-implementation-20261008/`:

- `01-przestrzen-desktop.png`: uploaded two-page PDF, selected Salon and marked room area.
- `02-funkcje-desktop.png`: Kino selected, real circuit references, dimming slider and scene suggestions.
- `03-sterowanie-desktop.png`: P01, JUNG F40, fourth key assigned to Kino, PDF placement.
- `04-sprawdz-desktop.png`: fourth key triggered, lights off, LED 20%, curtains closed, untouched devices unknown.
- `mobile-przestrzen.png`, `mobile-sceny.png`, `tablet-sceny.png`: responsive checks.
- `pdf-page-3.png`, `pdf-page-8.png`: actual exported PDF with sensor photo and point on the uploaded plan.

Desktop source and implementation: 1536 × 1024 pixels, CSS viewport 1536 × 1024, DPR 1. Mobile: 390 × 844, tablet: 900 × 1024, DPR 1. No image resampling or browser chrome was used for comparison. Each source and implementation pair was opened together in the same comparison input, including a second post-fix comparison of steps 2–4.

The implementation uses eight existing example rooms rather than the four visible in the concept; those additional rooms remain accessible by scrolling. The plan is an actual synthetic PDF uploaded for QA, rather than the concept's illustrative floor plan. The GitHub demo notice adds a top strip. These content/state differences are intentional and were excluded from pixel-level judgments.

## Findings and iteration history

- P2, scene editor density: the initial narrow sidebar truncated receiver names; the room function overview pushed the last scene row below the fold. Widened the scene sidebar to 380px at desktop widths and reduced overview/card spacing. Post-fix `02-funkcje-desktop.png` shows all six suggestions and readable receiver/action choices.
- P2, review density: the general plan-height selector overrode the review-specific height, hiding the result cards. Corrected selector specificity, set the review canvas to 280px, used three result columns on desktop, and collapsed optional direct-scene controls. Post-fix `04-sprawdz-desktop.png` shows all six receiver states without scrolling.
- P2, redundant control: a correctly assigned scene unnecessarily required a second “Uruchom scenę” select. Removed the redundant field only for valid scene commands; legacy invalid commands retain an editable action and warning. Post-fix `03-sterowanie-desktop.png` shows one scene choice and its live summary.
- Functional issue found during QA: room thumbnail framing did not reset when selecting another room on the same PDF. The transform identity now includes the focused room. Read-only markers can be selected without draggable disabled attributes; inactive room overlays are removed from the tab order.

## Required fidelity surfaces

- Typography: retained the application's Noto Sans, readable Polish labels, hierarchy and weights. Headings and point/scene labels wrap; controls retain full accessible labels. The source is a concept image rather than an exact font specification.
- Layout: retained the compact project header, four-step navigation, room/plan/context composition, fixed next/back actions, and progressive disclosure. Smaller screens switch to two columns, then one. Document-level horizontal overflow was absent at 390px and 900px; room lists intentionally scroll locally.
- Colors: preserved existing white, ink, teal and soft teal tokens; selected keys, scenes, room areas and changed simulation states use the same semantic accent. Unknown states are distinct from off.
- Assets: existing JUNG photographs, existing logo and Lucide icons; no generated product substitutes. Spatial key overlay is enabled only for the known four-key F40 image. Other sensors retain a photo and numbered functional controls with a variant clarification.
- Copy: room/function/scene/key vocabulary follows the approved flow. Empty scenes, unknown actions, remaining questions and demo limitations are explicit. The first release provides 2D assumption simulation; the concept's furnished 3D view remains a separate later feature.

Full-size image pairs made the controls and sidebar text legible, so additional cropped comparisons were unnecessary. Native PDF pages were also opened at readable resolution.

## Verification

- Browser: PDF upload, two pages, room marking, page navigation, fullscreen and Escape, point drag/drop, click placement, arrow-key movement, 10% button/wheel zoom, F40 selection, scene creation, scene-to-key assignment, shared scene edits, simulation reset and preservation of project revision.
- Shared Kino test: changing LED to 50% updated the bound key and preview immediately; unrelated circuits retained their state. The simulation did not save or contact an installation.
- Export: generated PDF, XLSX and JSON. The PDF was parsed and visually checked for sensor images, scene text and plan marker placement. Demo brief submission remained disabled; production submission logic and authorization paths were preserved.
- Automated: 22 planner tests, 27 Laravel tests / 150 assertions, 18 deployment-boundary tests. TypeScript, planner/site production builds and Laravel Pint passed.
- Browser console: no error or warning entries during the tested interactions.

## Boundaries and follow-up

No schema migration or authentication changes. New optional room areas and scene room references remain in the existing validated JSON project payload. Laravel validates referenced rooms, document ownership and plan bounds. Existing scene IDs, point IDs, autosave, conflict handling and exports remain compatible.

Production publication and a production-account end-to-end test are intentionally outside this Janka-only delivery. CI validates backend behavior; GitHub Pages exercises the isolated memory-only demo. No hardware/ETS simulation or 3D reconstruction is claimed.

P3 follow-up: more model-specific sensor key maps can be added when exact variant photos and layouts are available.

Implementation checklist: all P2 findings above fixed; responsive layouts checked; exports checked; tests passed; publish to Janka and verify Pages.

final result: passed
