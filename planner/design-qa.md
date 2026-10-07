# Release Design QA

Date: 2026-10-07

final result: passed

Scope: a functional InteliSpaces adaptation of the approved five-screen KNX brief concept, not a pixel-identical Elektrodesign skin. Runtime: https://intelispaces.pl/projektant-knx/ . Shared password-protected team workspace.

## Evidence

Source directory on the authoring workstation:
`C:/Users/Asdmin/.codex/generated_images/019eb20a-34d1-77d1-b05e-2bb5c0563853/`

Implementation evidence directory (outside Git, no credentials):
`C:/Users/Asdmin/Documents/New project 3/intelispaces-knx-evidence/`

| View and state | Source image | Rendered screenshot under evidence/screenshots |
| --- | --- | --- |
| Investment, example house | exec-41e51ddc-300f-4f37-aa4c-828c69468cf7.png | final-01-investment.png |
| Rooms, Salon selected | exec-2ea33597-1af8-437f-8ff8-97b112c738c3.png | final-02-rooms.png |
| Controls, Przy wejsciu, JUNG F50 | exec-19152103-56de-45a0-8511-314d0426c542.png | final-03-controls.png |
| Scenes, Kino selected | exec-265ba754-14f8-40f5-98ab-3c9aa21889e0.png | final-04-scenes.png |
| Brief for the example house | exec-75eba2d8-6239-49b6-b643-1ee0f327c52b.png | final-05-brief.png |

Sources are 1487 x 1058 pixels. Desktop browser CSS viewport was 1487 x 1058. The browser screenshot provider returned 1472 x 1047 rasters (approximately 0.99 scale); comparisons used the full content frame at equivalent displayed size, without counting the scrollbar/one-percent density difference as design drift. Both source and rendered images were opened together for full-view comparison. Reference and implementation represent the same workflow steps, but editable fields, example counts and branding intentionally differ. No pixel-error score is claimed.

Mobile checks used 390 x 844 and 360 x 800 CSS viewports. Captures are 375 x 812 and 345 x 767 respectively because of provider scaling. Evidence: mobile-01.png, mobile-02-final.png, mobile-03-final.png, mobile-04.png and mobile-05.png. `mobile-360-checks.json` records all five views: no root horizontal overflow, footer inside viewport and no broken images. Mobile is a responsive adaptation; the reference set has no mobile screens.

Full-resolution form labels, field boundaries, selected navigation states, tables and sensor pictures were readable in the full-view comparisons. Separate cropped comparisons were not necessary. PDF pages were independently rendered at 1200-pixel height and all five pages visually inspected: `brief-shipping-1.png` through `brief-shipping-5.png`.

## Findings And Comparison History

No open P0, P1 or P2 release findings remain.

| Earlier issue | Severity | Change | Post-fix evidence |
| --- | --- | --- | --- |
| Room rows and metadata consumed too much vertical space | P2 | One selected-row parameters area; room metadata behind an edit control | final-02-rooms.png |
| Investment form too narrow with excessive stacking | P2 | Full-width content track and three-column desktop metadata | final-01-investment.png |
| Reference sensor image insufficiently prominent | P2 | Increased photo area and real product image, preserving aspect ratio | final-03-controls.png |
| Mobile room table caused root horizontal overflow | P2 | Positioned table scroll container for its screen-reader-only label | mobile-02-final.png and mobile-360-checks.json |
| Empty room headings pushed mobile control points down | P2 | Navigation shows rooms with points; all rooms remain available in the point editor | mobile-03-final.png |
| Project button lacked a meaningful mobile accessible name | P2 | Explicit accessible name and tooltip | Browser accessibility tree |
| PDF generated orphan headings and empty trailing pages | P2 | Keep headings with rows, compact issue table and omit empty attachment section | Five-page browser-generated PDF; brief-shipping-1.png to brief-shipping-5.png |

## Required Fidelity Surfaces

- Typography: locally bundled Noto Sans with Polish glyphs, regular/bold hierarchy and zero letter spacing. Controls use compact UI type; headings are not hero-sized. Labels wrap without covering controls. The generated reference's apparent font is approximated, not claimed as an exact font match.
- Layout: the five-step shell, selected left navigation, central editor and contextual right column are preserved. InteliSpaces branding, working editable fields and a narrower supporting column are intentional adaptations. Scene editors can scroll vertically; the next/back bar stays available. No floating page-section cards or nested decorative cards.
- Colors: white and pale-gray work surfaces, graphite text, restrained teal interaction states and InteliSpaces green branding. Focus and selected states remain visible. Semantic states include text/icons rather than color alone.
- Images: actual JUNG F40/F50/LS TOUCH assets, unchanged aspect ratios, no fake product recoloring. Finish swatches express preferences; the image is explicitly identified as a reference. The scene context uses an existing InteliSpaces interior photo instead of the generated mock's living room. Lucide provides interface and PDF scene icons.
- Copy: Polish workflow labels, explicit unknown requirements, actual calculated counts and clear shared-team wording. Brief submission says that it archives a version, not that it sends email or places an order. Technical selection and compatibility require later confirmation.

## Functional Verification

- Eight model tests passed, including copy/reference integrity and unresolved-requirement calculations.
- Thirty deployed API/authentication checks passed; see external `api-tests.json`. Covered anonymous asset/API/storage denial, valid login, CSRF/origin rejection, persisted edits, stale revision rejection, path traversal, safe uploads, protected downloads, immutable/idempotent brief submissions, detached-document history and logout.
- Browser: all five steps, edited metadata, new room, outdoor scene, integration notes, reload persistence, PDF and XLSX downloads, desktop/mobile navigation. No browser console errors were recorded.
- Latest browser-generated PDF: `Dom_w_Konstancinie-KNX (4).pdf`, 5 A4 pages, 244643 bytes. All pages inspected; sensor image, scene icons, Polish text, table wrapping and final page are present without blank sections.
- XLSX: eight worksheets verified with openpyxl; no executable formula cells.
- TypeScript, planner production build and parent website production build passed. Production dependency audit: zero reported vulnerabilities at verification time. Export libraries are lazy-loaded.
- Scoped deployment SHA-256 checks passed. Existing parent website files were identical before and after deployment. No shop or PrestaShop changes.
- Technical test projects were moved to a private recovery archive; only the clearly labeled demonstration project remains in the workspace.

## Boundaries And Follow-Up

This is a shared team password, not isolated per-client accounts. PDF is visually verified but is not a tagged accessibility document. Safari and physical touch devices were not independently tested; responsive Chrome checks are recorded above. External integrations record requirements and do not operate building devices. An off-host storage backup schedule remains an operational follow-up, not an installed feature.

P3 follow-up: a denser optional scene table and product-specific photographs for each confirmed finish can be considered after user feedback. Neither is required for collecting a valid architectural brief.

## Completed Release Checklist

- [x] Five desktop reference/state comparisons
- [x] Mobile navigation, overflow and image checks
- [x] Authentication, persistence and attachment tests
- [x] PDF/XLSX content and rendered PDF inspection
- [x] Protected deployment with parent-site integrity check
- [x] No credentials or project data in repository

## Laravel/Filament integration (2026-10-07)

The preceding sections describe the historical Janka/shared-password release, not the current authentication architecture. Current runtime: `https://horcwnciix.cfolks.pl/projektant-knx/`. Individual accounts, scoped project access and private files are enforced by Laravel; administration is in Filament.

Current checks: 13 frontend model tests; 20 Laravel tests (88 assertions); 12 deployment/archive tests. Browser verification covered setting a separate long-press target, dragging P01/P02 from the room list onto the supplied PDF, moving an existing marker, panning, zooming and restoring the saved data after reload. Generated PDF has six brief pages with photos/key descriptions plus one original vector plan page with the two sensor markers. The user's PDF and generated output are excluded from Git.
