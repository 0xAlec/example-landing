# Example landing

A standalone copy of the Desa landing page from `0xAlec/desa`, commit `15f9f2b0b2e17cd19316e8a1109e339fe01a0247`.
Copied on 22 September 2026. The page keeps its original text, artwork, animations, and town video.

## Run locally

Use Node.js 22.12 or later.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Check and build

```sh
npm run typecheck
npm run build
```

The build creates static files in `out/`. The build downloads the Geist and Nunito fonts from Google.

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the site's URL before a production build.
Set `NEXT_PUBLIC_WAITLIST_ENDPOINT` to a compatible waitlist service. The form sends JSON with `email`, `company`, and `agents`. The service must return a successful HTTP status to accept a request. An external service must permit requests from the site's origin.

The default form endpoint is `/api/waitlist`. This static copy does not include the original Worker or a waitlist database. Form submissions require a configured service. No credentials or environment files were copied.

The source components and styles are copied without visual changes. Shared public asset imports and the shared loading stylesheet now use local paths. The desktop app, signed-in routes, backend, and release scripts are outside this repository.
