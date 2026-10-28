# Architects page — selected concept 1, Janka

Date: 2026-10-28. Scope: implement the selected “Pracownia i partner” concept at /architects/ on Janka. Main, Darka, CF production, the KNX backend and public demo access are outside this change.

## Visual source and evidence

Approved source: C:/Users/Asdmin/Documents/ChatGPT/KNX/outputs/architects-knx-concepts-20261028/01-pracownia-i-partner.png (992 × 1586).

Local implementation: http://127.0.0.1:3081/delitech-darek/Janka/architects/. Evidence directory: C:/Users/Asdmin/Documents/ChatGPT/KNX/outputs/architects-knx-concepts-20261028/.

- qa-desktop-final.png and qa-geometry.json: rendered page and measured section geometry at a 1440 × 1000 CSS viewport; screenshot content width 1425 px, excluding the scrollbar.
- qa-comparison-final.png: selected concept and browser content together, each normalized to 850 px width, with the shared navigation, preview strip and footer excluded.
- qa-hero-comparison-final.png and qa-banner-comparison-final.png: paired focused views of typography, spacing, image composition and CTA.
- qa-mobile-final.png, qa-mobile-presentation-form.png, qa-tablet.png and qa-narrow-final.png: phone, presentation form, tablet and 320 px checks.
- qa-responsive.json: width and overflow observations. The final 320 px headline correction was checked separately in qa-narrow-final.png.

## Findings and fixes

1. P2, resolved: initial supporting text and CTAs were smaller than the selected concept. Increased responsive body/button type, support icons and small lime dividers.
2. P2, resolved: the first typography adjustment wrapped “zaplanować KNX.” into two lines on desktop. Restored the four-line headline and verified each line's DOM height.
3. P2, resolved: the 320 px viewport also split that phrase. Lowered the mobile font minimum to 32 px; all four headline lines now fit without horizontal overflow.
4. Final full-page and focused paired comparisons have no actionable P0/P1/P2 issues within this scope.

## Fidelity and content

The implementation retains the split ivory hero, large warm interior image, three open support columns, image/advice split and navy configurator invitation. Typography uses the existing Manrope and Plus Jakarta Sans families; navy and lime follow the established brand. Three dedicated ImageGen assets are optimized as WebP (about 789 kB total); only the hero loads eagerly.

The photographs are conceptual illustrations, explicitly labeled in the hero and advice section. No invented project counts, years of experience, certifications or testimonials were added. The configurator is promoted through a private presentation invitation without screenshots, workflow details or feature descriptions. This is an editorial change, not a new access restriction: the existing demo and footer link remain available.

## Functional and responsive checks

- Project CTA opens “Porozmawiajmy o Twoim projekcie”.
- Presentation CTA opens “Umów prezentację konfiguratora”, selects “Projekt dla klienta pracowni” and supplies a dedicated inquiry topic through the existing form integration.
- Hero/header invitation links target #pakiet; on mobile the menu closes and the section clears the sticky header.
- All three advice disclosures open and close; Enter and Space keyboard activation were checked on native summary elements.
- No horizontal overflow at 320, 390, 768, 1024, 1440 or 1920 CSS px. Phone composition stacks imagery and copy; the form stays inside the viewport and scrolls internally.
- All three images load successfully. Browser logs contain no warnings or errors during the checked interactions.
- TypeScript check passed. All 8 existing site-content/F50-lighting tests passed. The branch-prefixed preview build produced all 12 static pages. Existing Vite __dirname warning is unrelated to this change.
- No real inquiry was submitted. GitHub preview form sending remains disabled, verified by the existing preview test.

## Intentional differences

The existing shared navigation/footer and preview notice remain, rather than replacing them with the mock's simplified presentation chrome. The new header invitation destination is scoped to architects. Generated photos reproduce the composition, not every material detail. Image captions use a dark backing for readable contrast. Mobile layout is adapted for touch; the selected source supplied only desktop artwork.

Implementation checklist: completed. Follow-up polish: none required.

**final result: passed**

---

# Smart-home integrations — selected concept 2, Janka

Selection: 2026-10-20. Scope: add the interactive house immediately AFTER the existing “Co automatyzujemy w obiekcie” section and BEFORE DayRhythm. The original section is preserved in full. No changes to the hero video, planner, backend, main or Darka.

## Visual truth and evidence

Source: `C:/Users/Asdmin/Documents/ChatGPT/KNX/outputs/smart-home-integracje-20261020/propozycja-2.png` (1705 × 922 pixels).

Implementation: `http://127.0.0.1:3057/#integracje-domu`. Evidence folder: `C:/Users/Asdmin/Documents/ChatGPT/KNX/outputs/smart-home-integracje-implementation-20261020/`.

- `qa-desktop-final.png`: browser-rendered default state, Rolety i zasłony selected.
- `qa-section-final.png`: normalized section crop; same state as the selected concept.
- `qa-comparison-final.png`: source and final implementation together in one comparison image, both at the same display width.
- `qa-type-comparison.png`, `qa-detail-comparison.png`: focused paired comparisons of heading typography and the navy description strip.
- `qa-mobile-top.png`, `qa-mobile-detail.png`: 390 × 844 CSS viewport, list/house and intercom detail/CTA respectively.
- `qa-tablet.png`: 1024 × 900 CSS viewport.
- `qa-narrow-final.png`: 320 × 900 CSS viewport after spacing fix.
- `qa-capture.json`: exact final desktop DOM bounds and viewport.

Desktop CSS viewport: 1706 × 1150. IAB capture: 1691 × 1140 pixels. The capture was normalized back to the CSS viewport for cropping; the final section crop is 1691 × 901 pixels, excluding the sticky page header, scrollbar and adjacent sections. Comparison sheets scale each source to the same width. No screenshots were used as product UI assets.

## Findings and comparison history

1. **P2, resolved — excess image height.** The first render retained the full 4:3 asset height, pushing the detail panel too far below the choices. Evidence: `qa-before-spacing.png`. Set an 8:5 image viewport, remove the image's intrinsic-height contribution with absolute positioning, and crop only outer garden/white margins. The entire roof and all six relevant interior areas remain visible. Final section height is about 901 CSS px at the comparison width, versus the concept's 922 px.
2. **P2, resolved — heading wrap and secondary text density.** Initial paired comparison `qa-comparison.png` showed smaller controls/detail copy and the wrong desktop heading wrap. Enlarged the CTA/detail type and widened the left track to `.88fr`. Final focused comparison `qa-type-comparison.png` confirms the intended “Zobacz, co możemy / połączyć.” wrap.
3. **P2, resolved — narrow-screen icon overlap.** At 320 CSS px, the music and temperature hit targets overlapped slightly. Their mobile positions are now 50% and 68%. Rechecked geometry: no intersecting pin hit targets or horizontal overflow at 320, 390, 520, 768, 1024 or 1706 px. Evidence: `qa-narrow-final.png` and browser geometry checks.
4. Final full-view and focused comparisons contain **no actionable P0/P1/P2 findings**.

## Required fidelity surfaces

- **Fonts/typography:** existing Manrope headings, Plus Jakarta Sans body, JetBrains Mono eyebrow; not a new font system. Desktop heading wrap matches the selected concept. Labels, CTA and descriptions remain readable at tested widths.
- **Spacing/layout:** left selector, right cutaway house and navy detail strip follow concept 2. On phones the list becomes two columns above the house, with the CTA below the description. The original technical section remains immediately before this section, confirmed from the rendered DOM and the HomePage diff.
- **Colors/tokens:** existing navy `#182C3D`, green `#9FBF36`, white and mist tokens. The brighter lime in the generated mock is intentionally replaced by the approved logo accent. Active selection and keyboard focus are visible without relying on text color alone.
- **Image fidelity:** dedicated ImageGen cutaway-house artwork plus individual blinds, intercom and charging photographs, optimized as WebP (new files total about 390 kB). The house keeps the bedroom, blinds, front door, TV area, dining area and garage. Existing inspected DayRhythm interiors illustrate light, comfort and music. No invented SVG/CSS house or rasterized controls. Photos are illustrative, not presented as completed projects.
- **Copy/content:** six everyday categories and short examples of potential integrations. Device/project compatibility note and illustration label remain visible. No fabricated live measurements or claims of a real connected controller.

## Functional and accessibility checks

- All six list buttons update the description and the corresponding house selection; exactly one button is active in each group.
- Clicking the charging and intercom pins updates the list and detail, including the appropriate photograph.
- Space activates a list button; visible keyboard focus and native button semantics are retained. Changes are announced through a polite live region.
- Touch targets on the small house are 44 × 44 px. On narrow screens the repeated long pin labels are hidden visually, with full accessible names and the labeled selector list still present.
- Layout checks at 320, 390, 520, 768, 1024 and 1706 CSS px: no horizontal overflow or overlapping hit targets after the fix.
- No browser console errors during the new section's interactions. Images loaded successfully.
- CTA uses the existing `plannerUrl()` deployment helper, preserving local/branch/production destinations.
- TypeScript check and the two existing site-content tests passed. The branch-prefixed preview build passed for all 11 site routes. Existing Vite warning about `__dirname` is unrelated to this addition.

## Accepted differences and limits

The clean house illustration was generated from the selected reference, so furnishings are not pixel-identical. The description includes an extra plain-language sentence about privacy. Phone composition is intentionally adapted to touch use; a phone-specific source mock was not supplied. No physical KNX devices, backend forms or private project data were exercised.

Implementation checklist: completed. Follow-up polish: none required for this scope.

**final result: passed**

---

# Previous QA — KNX unified flow, Janka implementation

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
