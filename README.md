# Delitech Smart Spaces / InteliSpaces

Editable source of the production website at https://intelispaces.pl/, copied to the existing `Janka` branch on 2026-10-05.

## Included

- React/Vite website, production media, contact links, investor guide, architect materials and showroom page.
- Sanity Studio source and schemas in `studio/` (project `suto7hva`, dataset `production`).
- Current published CMS export in `cms-data/published-snapshot.json`. This contains published documents only and is a point-in-time backup, not an automatic import.
- `production-snapshot.json`: SHA-256 manifest captured from the live hosting directory. The compiled website and Studio were verified against the last deployed release; compiled build output remains excluded from Git.
- The homepage video file and its component are unchanged.

## Develop and build

Use Node.js 24 LTS. In the repository root run `npm ci`, `npm run dev`, `npm run lint` and `npm run build`.
Run CMS checks with `node --import tsx --test scripts/test-cms.mjs`.

For Studio: `cd studio`, `npm ci`, then `npm run dev` or `npm run build`.
The production Studio is hosted at https://intelispaces.pl/studio/; build its output separately for `/studio/`.

The site loads published CMS content at runtime. Text fallbacks, guides and projects included in the source remain available if the API is unavailable. `public/cms-config.json` contains public project identifiers, not credentials. Editor changes in Sanity do not create Git commits automatically.

The printable architect packet is `public/materialy/pakiet-architekta.html` and is maintained in code. Contact links open the user's phone or email application.

## Hosting and branch scope

Production runs on Cyber_Folks. This commit only synchronizes GitHub; it does not redeploy production or change DNS, mail or permissions. Existing Pages workflows are preserved. The website uses domain-root routes and `/cms-config.json`; hosting under a GitHub Pages subdirectory requires adapting the path and validating the Sanity CORS origin before it can be treated as an equivalent preview.

Do not commit `.env` files, API tokens, hosting passwords, local Sanity auth state, dependencies, logs or private hosting/mail configuration. Keep one-time content migrations separate from routine builds.
