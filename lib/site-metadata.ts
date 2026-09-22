export const SITE_NAME = "Desa";
export const SITE_TITLE = "Desa — Run your coding agents. From anywhere.";
export const SITE_DESCRIPTION =
  "Run Codex, Claude Code, or Pi in a managed cloud workspace configured for your repo and tools. Start and steer work from the apps you already use.";
const VERCEL_SITE_HOST =
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  process.env.VERCEL_URL?.trim();
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (VERCEL_SITE_HOST ? `https://${VERCEL_SITE_HOST}` : "http://localhost:3000");
export const SITE_URL = new URL("/", SITE_ORIGIN);
export const SOCIAL_IMAGE = {
  url: "/og-landing-preview.png",
  width: 1200,
  height: 630,
  alt: "Nori on slate blue beside the cream Desa wordmark",
};
