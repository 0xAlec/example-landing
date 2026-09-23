# Roam trip planner

A small, working travel planner built with Next.js, React, and TypeScript.
The existing GitHub repository and Vercel project keep their `example-landing`
identifiers so connected clients and deployment links continue to work.

## What you can do

- Start with a four-day Lisbon sample, or create a trip of 1–14 days.
- Add, edit, move between days, and delete activities. Undo the last deletion.
- Mark activities visited and track trip preparation.
- Collect and search saved places, then add them to an itinerary.
- Keep trip notes. Export and import trips as JSON.
- Set a budget per day and compare it with activity planned costs. Use one currency for all amounts.
  Blank costs remain unpriced; visited activities still count. Blank budgets remove the limit.

Trips are saved in this browser with `localStorage`, under `roam.trips.v1`.
There is no account, shared database, or cross-device sync. Export before clearing
browser data. An unreadable saved record is kept intact and editing becomes
session-only. A save failure is shown in the interface. Imported trips are added
without replacing existing trips.

The Lisbon itinerary is sample content, not a booking or live travel advisory.
Map links open Google Maps searches; no map key is required. Confirm schedules,
opening hours, availability, and other trip details yourself.

## Develop

Use Node 22.12+ and npm. Run commands from the repository root.

```sh
npm ci --engine-strict
npm run dev
```

Open `http://localhost:3000`. The development server binds to loopback.
The only optional public configuration is `NEXT_PUBLIC_SITE_URL` for metadata.
Vercel supplies the production URL if it is not set. No credentials are needed.

## Verify

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite serves the production `out/` directory on port 3322 and stops
its server afterwards. Build first. It tests desktop and mobile rendering,
activity changes, persistence, independent trips, saved places, import/export,
invalid storage protection, and dialog keyboard behavior. It sends no messages,
uses no real travel service, and does not change a shared backend. Browser data
is isolated per test. Screenshots, traces on failure, and results are under
`test-results/` and `playwright-report/` (ignored).

Use `npm run preview` to serve the built app locally. `PORT` can change the
preview port. `PLAYWRIGHT_BASE_URL` selects an existing deployment for browser
checks without starting a local server. These checks only change the test
browser's local storage. Linux may require Playwright's documented system
libraries; the Desa Node 22 image already contains Chromium dependencies.

## Deployment and future demo tasks

Next.js exports static files to `out/`. Geist is downloaded through
`next/font/google` during builds. The existing Vercel deployment continues to
use this repository. No backend migration is needed.

Useful next requests for Instinct: add packing-list editing
or an activity category filter. These features are not included yet. The current
app deliberately provides working data and browser checks for those changes.

The decorative Lisbon artwork was generated with OpenAI imagegen. Its prompt
and provenance are in `public/images/README.md`. This project replaces the
previous copied Desa marketing page; its old waitlist and marketing assets
have been removed.
