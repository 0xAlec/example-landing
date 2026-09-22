/**
 * Runtime-safe waitlist facts shared by the enhanced form and its client
 * submission boundary. The standalone Sites worker embeds the same public
 * validation facts without shipping worker-only policy knobs to the browser.
 */

export const WAITLIST_CLIENT_LIMITS = Object.freeze({
  email: 254,
  company: 120,
  teamSize: 16,
  challenge: 1_000,
  errorMessage: 200,
});

export const WAITLIST_TEAM_SIZES = Object.freeze(
  /** @type {const} */ (["1-2", "3-10", "11-30", "31-75", "76+"]),
);

export const WAITLIST_AGENT_OPTIONS = Object.freeze(
  /** @type {const} */ (["Codex", "Claude Code", "Cursor", "Other"]),
);

export const WAITLIST_EMAIL_PATTERN =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export const WAITLIST_VALIDATION_ERROR =
  "Check the highlighted fields and try again.";

export const WAITLIST_FIELD_ERROR_MESSAGES = Object.freeze({
  email: "Enter a valid work email.",
  company: "Enter your company name.",
  teamSize: "Choose a listed team size or leave it blank.",
  agents: "Choose one listed coding agent or leave it blank.",
  challenge: `Enter ${WAITLIST_CLIENT_LIMITS.challenge.toLocaleString("en-US")} characters or fewer, or leave it blank.`,
});

export const WAITLIST_FIELDS = Object.freeze(
  /** @type {const} */ ([
    "email",
    "company",
    "teamSize",
    "agents",
    "challenge",
  ]),
);

export function isWaitlistTeamSize(value) {
  return WAITLIST_TEAM_SIZES.includes(value);
}

export function isWaitlistAgent(value) {
  return WAITLIST_AGENT_OPTIONS.includes(value);
}
