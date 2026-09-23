export const SITE_NAME = "Roam";
export const SITE_TITLE = "Roam — Make room for the journey";
export const SITE_DESCRIPTION =
  "A little space for your next adventure. Plan your days, collect places, and keep your trip together.";
const host =
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  process.env.VERCEL_URL?.trim();
export const SITE_URL = new URL(
  "/",
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (host ? `https://${host}` : "http://localhost:3000"),
);
