export const SITE_NAME = "Roam";
export const SITE_TITLE = "Roam — Trip planner";
export const SITE_DESCRIPTION =
  "Plan daily activities, save places, and keep trip notes in one place.";
const host =
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  process.env.VERCEL_URL?.trim();
export const SITE_URL = new URL(
  "/",
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (host ? `https://${host}` : "http://localhost:3000"),
);
