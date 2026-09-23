---
version: 1
runtime: node-22
delivery:
  provider: github
  environment: Production
  url: https://example-landing-five.vercel.app/
environment:
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000"
services: []
setup:
  - id: install
    run: npm ci --engine-strict
    timeoutSeconds: 600
  - id: install-browser
    run: npx playwright install chromium
    timeoutSeconds: 600
checks:
  - id: typecheck
    run: npm run typecheck
    timeoutSeconds: 300
    required: true
  - id: unit
    run: npm test
    timeoutSeconds: 120
    required: true
  - id: build
    run: npm run build && test -s out/index.html
    timeoutSeconds: 600
    required: true
  - id: browser
    run: npm run test:e2e
    timeoutSeconds: 300
    required: true
preview:
  app:
    run: npm run dev -- --port "$PORT"
    readyPath: /
    readyTimeoutSeconds: 120
---

# Project environment

Roam is a personal trip planner in the existing `0xAlec/example-landing`
repository. Run commands at the repository root. Next.js exports a static app
into `out/`; browser local storage owns the user's trip data.

## Tools and versions

`package.json` and `package-lock.json` define Node >=22.12, npm, Next.js, React,
TypeScript, and Playwright. Use Node 22 in cloud work. The install command
enforces engine constraints. Installation needs the npm registry; browser setup
needs Playwright's Chromium download host. Builds need Google Fonts for Geist
and Lora. The Desa Node 22 image includes Chromium's Linux system libraries.
Do not substitute unverified browser executables or silently skip browser tests.

## Development workflow

Use `npm ci --engine-strict`, `npx playwright install chromium`, and
`npm run dev`. The default development URL is `http://localhost:3000`.
Managed previews pass the assigned port and wait for `/`.

Run type checking, unit tests, the production build, then the browser suite.
The browser suite starts its own static server on port 3322 and stops it on
completion. It uses isolated browser contexts; it does not require an existing
server or saved browser profile. `PLAYWRIGHT_BASE_URL` selects an existing
preview for explicit deployment verification. Do not set it for ordinary local
checks. Logs, screenshots, and failure traces are in `test-results/` and
`playwright-report/`, outside the recipe. Build output and test output are
ignored and disposable. Never clear a person's browser storage as test cleanup.

## Services and data

No saved secrets, database, backend, account, or waitlist service is used.
The sample itinerary is fictional planning data. Map links are Google Maps
searches, not a live map integration or verified travel route. The app has no
booking, payment, or real message submission workflow.

The storage key is `roam.trips.v1`. Tests use isolated contexts and synthetic
trips. Trip export/import supports a person's own backups. Storage failures
must remain visible and corrupt saved data must not be overwritten silently.
`NEXT_PUBLIC_SITE_URL` affects metadata only; no private data belongs in it.

## Verification coverage

| Workflow | Evidence | Command | Required assertions and limits |
| --- | --- | --- | --- |
| Install | Manifest and lockfile | `install` | Engine enforcement and locked dependencies |
| Browser setup | Playwright dependency | `install-browser` | Install matching Chromium; needs network |
| Types | `tsconfig.json` | `typecheck` | Route generation and TypeScript validation |
| Trip data | `lib/trips.test.ts` | `unit` | Date boundaries, saved records, invalid data, sorted daily views |
| Static app | `next.config.ts` | `build` | Production export and nonempty HTML |
| Browser behavior | `tests/planner.spec.ts` | `browser` check | Desktop/mobile, editing, persistence, trip isolation, places, backups, dialogs; isolated browser data only |

No external booking service or shared-data workflow is present. No CI workflow
is configured in this repository. Passing browser checks does not prove live
travel details, cross-device sync, or provider deployment status.

## Local and cloud differences

| Requirement | Local evidence | Cloud behavior |
| --- | --- | --- |
| Node | Local shell uses Node 25; manifest permits Node >=22.12 | Node 22 profile; same scripts and lockfile |
| Browser | Playwright-managed Chromium on macOS | Matching Chromium download and Linux libraries in the runtime |
| Saved data | Local storage on the person's device | Isolated test browser storage; no copy of personal data |
| Fonts and assets | Geist, Lora, and local Lisbon artwork | Same build downloads and repository asset |
| Application server | Loopback development server or static preview | Managed preview; tests start and clean up their own loopback server |

Keep current cloud verification results in Desa records, not this file.

## Delivery workflow

The existing Vercel project still uses the `example-landing` identifier and
serves the trip planner at `delivery.url`. Do not rename the GitHub repository
or hosting project as a side effect of application changes.

For a connected client's first task, suggest adding a daily budget, editable
packing list, or category filter. Do not start sample work during connection
setup. Run required checks and capture a screenshot for visible changes.
Ordinary code tasks use Desa's configured PR publication. Setup tasks keep
explicit publication. After publication, check the deployment for the exact
commit and inspect the requested behavior before returning a preview URL.
Record missing access or failed checks. A provider's ready status alone does
not prove page behavior. This file grants no merge or deployment permission.

## Related instructions

Read `README.md`, `package.json`, `lib/trips.ts`, and the relevant Next.js docs
in `node_modules/next/dist/docs/`. No repository AGENTS.md or required Library
item is present. Current verification results and task IDs belong in the setup
report so they do not change accepted recipe bytes.
