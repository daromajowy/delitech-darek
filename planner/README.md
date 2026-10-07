# InteliSpaces: Projektant KNX

Password-protected, shared team workspace for architectural KNX briefs.

## Deployment Boundaries

- Website integration: `daromajowy/delitech-darek`, branch `Janka` only.
- Website entry points: Dla architektow menu and the architect package section.
- Protected runtime: `https://intelispaces.pl/projektant-knx/`.
- GitHub Pages hosts the public website, not the authenticated application. Pages cannot execute this PHP authentication layer.
- No changes to PrestaShop, Elektrodesign, Mediaporty or Oktawave.
- Only `public_html/projektant-knx/` and the new storage directory belong to this application. Never replace the parent website or its `.htaccess`.

## Workflow

1. Investment: studio/contact, building, area, stage, budget, priorities, scope and documents.
2. Rooms: floors, templates, duplication, circuits, control type, parameters and notes.
3. Controls: JUNG F40/F50/LS TOUCH preferences, finishes, mounting height and function assignments.
4. Scenes: indoor/outdoor presets, triggers, actions, exceptions and integration requirements.
5. Brief: unresolved requirements, PDF with sensor pictures and scene icons, eight-sheet XLSX, JSON copy and immutable team submission.

Sensor images are reference images, not a guarantee that every finish or button layout is available. The brief records requirements; it is not a technical design, device compatibility certificate, price quotation or ETS configuration. JUNG actuators are specified as a selection constraint; exact references must be selected after circuit verification.

## Team Access And Data

This release has one shared team password. Anyone holding it can see and edit all projects in this workspace. Do not distribute it as individual client access. Separate per-architect accounts and tenant isolation require a subsequent release.

No credentials, password hashes, customer data or generated briefs are included in this repository. The installation password is handed over locally outside Git.

The server uses PHP password hashing, session regeneration, Secure/HttpOnly/SameSite cookies, CSRF validation, origin checks, a login rate limit and no-cache/noindex headers. The controller authenticates every application asset and document request. Sessions expire after two hours of inactivity or twelve hours absolute duration.

The hosting account enforces `open_basedir` within `public_html`. Storage is therefore in `public_html/.knx-storage/`, protected by a directory `.htaccess` containing `Require all denied` and `Options -Indexes`. Direct HTTP access must return 403 or 404 and never file contents. Directory mode is 0700 and private files 0600. Do not remove this denial rule or deploy on a server that ignores `.htaccess` without equivalent web-server rules.

Storage contains `config.json`, projects, uploads, revisions, briefs, sessions and rate limits. Writes are atomic and serialized; optimistic revision checks reject stale edits. Autosave preserves unsaved edits on network failures and offers a JSON recovery copy. Last 30 saved project revisions are retained; immutable submissions and uploaded binaries have no automatic deletion. Detaching a document only removes its current association; submitted versions retain access.

Limits: 100 projects, 100 rooms/project, 200 circuits/room, 500 control points/project, 100 scenes/project, 20 documents/project, 12 MB/document and 512 MB total uploads. PDF/JPEG/PNG only. Arrange periodic backups of the entire storage directory; this release does not install a backup schedule.

Submission creates an immutable version in the team area. It does **not** send email, place an order or activate any building device.

## Build And Verify

Use Node 24 and PHP 8.2 or newer.

```sh
cd planner
npm ci
npm test
npm run build
php -l server/index.php
```

Vite development mode on port 3047 is only a frontend preview. Complete login, file and persistence tests must run against the PHP deployment; never replace server authentication with a browser-only password prompt.

Build output is ignored. Deploy `dist/*` to `projektant-knx/app/`; deploy `server/index.php`, `server/.htaccess` and `server/.user.ini` to `projektant-knx/`. Provision storage separately with a PHP-generated `password_hash(..., PASSWORD_DEFAULT)` stored under the `passwordHash` key in `config.json`. Generate the password outside Git and never put it in a frontend environment variable. Replacing the stored hash invalidates old sessions.

Stage a complete release, verify upload hashes and PHP syntax, then rename only the application directory. Keep the previous release outside the public webroot for rollback. Never overwrite `.knx-storage` during a code release. Restoring the previous code must retain current project data.

Before publication, verify anonymous denial of API, JS, physical `app/` paths and storage; authorized login; create/save/reload; stale revision and CSRF rejection; file upload/download; immutable submission; PDF/XLSX; logout; desktop/mobile UI. Hash the preexisting parent website before and after the scoped deployment.

## Third-Party Assets

JUNG reference images and the existing InteliSpaces residential image are used to identify the selected devices and context, not as generated approximations. Noto Sans fonts are bundled under their included SIL Open Font License. Lucide supplies interface and scene icons. PDF and spreadsheet libraries are lazy-loaded only for exports.

See `design-qa.md` for the release verification record.
