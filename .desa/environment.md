---
version: 1
runtime: node-22
environment:
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000"
  NEXT_PUBLIC_WAITLIST_ENDPOINT: ""
services: []
setup:
  - id: install
    run: npm ci --engine-strict
    timeoutSeconds: 600
checks:
  - id: typecheck
    run: npm run typecheck
    timeoutSeconds: 300
    required: true
  - id: build
    run: npm run build && test -s out/index.html
    timeoutSeconds: 600
    required: true
  - id: development-page
    run: >-
      node --input-type=module -e 'import assert from "node:assert/strict"; const response = await fetch(process.env.BASE_URL); assert.equal(response.status, 200); const html = await response.text(); assert.match(html, /id="hero-title"/); assert.match(html, /Run your coding agents/); assert.match(html, /id="main-content"/);'
    timeoutSeconds: 180
    required: true
    managed:
      app:
        run: npm run dev -- --port "$PORT"
        readyPath: /
        readyTimeoutSeconds: 120
preview:
  app:
    run: npm run dev -- --port "$PORT"
    readyPath: /
    readyTimeoutSeconds: 120
---

# Project environment

This repository contains the standalone Desa landing page. Run all commands from
the repository root. It uses Next.js with a static export to `out/`.

## Tools and versions

`package.json` requires Node.js 22.12.0 or later. The cloud profile uses Node.js 22.
`npm ci --engine-strict` enforces the manifest engine constraints. Use npm with
`package-lock.json`; do not substitute another package manager. The manifest pins
Next.js 16.2.11, React 19.2.4, and TypeScript 5.9.3.

Installation needs the npm registry. The page imports Geist and Nunito through
`next/font/google`, so development startup and builds need Google Fonts access.
No repository requirement for a database, native desktop app, or browser test
runner is present.

## Development workflow

Run `npm ci --engine-strict`, then `npm run dev`. The default local URL is
`http://localhost:3000`. For local environment files, copy `.env.example` to
`.env.local`. Desa supplies the same public defaults from this file.

The managed check and preview pass their assigned port to the existing dev
script. Readiness uses `/`. The managed check fetches the page and checks the
landing heading and main content marker. Its app stops after the check. A setup
command must not start a background app for later commands.

Run `npm run typecheck` and `npm run build` before submitting changes. Build
output is in `out/`; generated Next.js files are in `.next/`. These directories
are disposable and ignored by Git. There are no synthetic users or seed data.
Keep command logs and current verification results in the task evidence, outside
this file.

## Services and data

No credentials or external data services are required for install, type checking,
static export, or page checks. The repository has no waitlist backend or database.
An empty `NEXT_PUBLIC_WAITLIST_ENDPOINT` uses `/api/waitlist`, which this static
application does not serve. A live submission therefore requires a separately
configured compatible service. This setup does not submit waitlist requests.

Before a website release, set `NEXT_PUBLIC_SITE_URL` to the approved public URL
and `NEXT_PUBLIC_WAITLIST_ENDPOINT` to the approved waitlist service. The endpoint
must accept the contract in `README.md` and `lib/waitlist.ts` and permit the site's
origin. These public values are bundled into the client. Do not put credentials
in them. Service provisioning, real submissions, and deployment require separate
authorization. There are no migrations, shared test records, or cleanup operations.

## Verification coverage

| Workflow | Repository evidence | Command ID | Requirement and assertions | Limits |
| --- | --- | --- | --- | --- |
| Install | `package.json`, `package-lock.json`, `README.md` | `install` | Required; locked install with engine enforcement | Needs npm network access |
| Types | `package.json`, `tsconfig.json` | `typecheck` | Required; Next.js route type generation and TypeScript validation | Does not execute browser interactions |
| Static export | `package.json`, `next.config.ts`, `README.md` | `build` | Required; production build and nonempty `out/index.html` | Needs Google Fonts; no deployment |
| Development server | `package.json`, `app/page.tsx`, `components/landing/nori/NoriLanding.tsx` | `development-page` | Required; HTTP 200, hero heading, and main content marker | HTML check; not visual, hydration, or interaction proof |

No CI workflows, test scripts, or lint scripts are present in the repository.
Do not invent commands for them. Browser behavior, visual review, and live
waitlist acceptance remain separate checks when relevant to a change.

## Local and cloud differences

| Requirement | Local evidence | Cloud behavior and limits |
| --- | --- | --- |
| Node and npm | Manifest requires Node >=22.12.0; observed local shell uses Node 25.3.0 and npm 11.7.0 | Use Node.js 22 profile and the locked npm install; the local version is not a new requirement |
| Application startup | `README.md` documents port 3000; the dev script binds to 127.0.0.1 | Managed startup supplies a port and waits for `/` |
| Public configuration | `.env.example` supplies localhost and no waitlist endpoint | Use equivalent public defaults; configure real delivery values separately |
| Application checks | Type and build scripts are present; no repository browser suite exists | Run the same scripts and an HTTP content check; these do not prove visual or live service behavior |
| Data services | No backend, database, or seed workflow exists | No database or saved secret environment is needed |

## Delivery workflow

For ordinary code changes, complete the required checks during the Run. Capture
a screenshot when the change affects the page. Return the saved commit and
report failed or missing checks. Desa publishes an ordinary completed code task
to its task branch and PR unless the task disables publication. Setup tasks
retain their explicit publication step.

After PR publication, the connected client must check the Vercel deployment for
the exact task commit. Return a preview URL only after that deployment is ready
and the requested page change is verified. Use the GitHub deployment record or
authorized Vercel tools. Report missing access or failed preview checks. A ready
deployment alone does not prove page behavior. If the PR does not yet exist,
record these client checks as pending.

These instructions do not grant deployment, merge, service access, or waitlist
submission permission. They do not start an automatic task after completion.

## Related instructions

Read `README.md`, `package.json`, `next.config.ts`, `.env.example`, and
`lib/waitlist.ts`. No repository `AGENTS.md` or required Library item is present.
For Next.js code changes, use the documentation for the installed version.
