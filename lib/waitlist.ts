import {
  WAITLIST_EMAIL_PATTERN,
  WAITLIST_FIELD_ERROR_MESSAGES,
  WAITLIST_FIELDS,
  WAITLIST_CLIENT_LIMITS,
  WAITLIST_VALIDATION_ERROR,
  isWaitlistAgent,
  isWaitlistTeamSize,
} from "./waitlistContract.js";
export type WaitlistField = (typeof WAITLIST_FIELDS)[number];
export type WaitlistFieldErrors = Partial<Record<WaitlistField, string>>;

export type WaitlistApplication = {
  email: string;
  company: string;
  teamSize?: string;
  agents?: [] | [string];
  challenge?: string;
};

const FALLBACK_ERROR = "We could not submit your request. Please try again.";

export class WaitlistSubmissionError extends Error {
  readonly fieldErrors: WaitlistFieldErrors;

  constructor(message: string, fieldErrors: WaitlistFieldErrors = {}) {
    super(message);
    this.name = "WaitlistSubmissionError";
    this.fieldErrors = fieldErrors;
  }
}

function normalizeApplication(application: WaitlistApplication): {
  application: WaitlistApplication;
  fieldErrors: WaitlistFieldErrors;
} {
  const fieldErrors: WaitlistFieldErrors = {};
  const email = typeof application.email === "string"
    ? application.email.trim().toLowerCase()
    : "";
  const company = typeof application.company === "string"
    ? application.company.trim()
    : "";
  const teamSize = typeof application.teamSize === "string"
    ? application.teamSize.trim()
    : "";
  const challenge = typeof application.challenge === "string"
    ? application.challenge.trim()
    : "";
  const submittedAgents = Array.isArray(application.agents)
    ? application.agents
    : [];
  const invalidAgents = application.agents !== undefined && (
    !Array.isArray(application.agents)
    || submittedAgents.length > 1
    || submittedAgents.some(
      (agent) => typeof agent !== "string" || !isWaitlistAgent(agent.trim()),
    )
  );
  const agent = submittedAgents.length === 1
    && typeof submittedAgents[0] === "string"
    ? submittedAgents[0].trim()
    : "";

  if (
    !email ||
    email.length > WAITLIST_CLIENT_LIMITS.email ||
    !WAITLIST_EMAIL_PATTERN.test(email)
  ) {
    fieldErrors.email = WAITLIST_FIELD_ERROR_MESSAGES.email;
  }
  if (!company || company.length > WAITLIST_CLIENT_LIMITS.company) {
    fieldErrors.company = WAITLIST_FIELD_ERROR_MESSAGES.company;
  }
  if (
    application.teamSize !== undefined
    && (
      typeof application.teamSize !== "string"
      || (teamSize && !isWaitlistTeamSize(teamSize))
    )
  ) {
    fieldErrors.teamSize = WAITLIST_FIELD_ERROR_MESSAGES.teamSize;
  }
  if (invalidAgents) {
    fieldErrors.agents = WAITLIST_FIELD_ERROR_MESSAGES.agents;
  }
  if (
    application.challenge !== undefined
    && (
      typeof application.challenge !== "string"
      || challenge.length > WAITLIST_CLIENT_LIMITS.challenge
    )
  ) {
    fieldErrors.challenge = WAITLIST_FIELD_ERROR_MESSAGES.challenge;
  }

  const agents: [] | [string] = agent ? [agent] : [];
  return {
    application: {
      email,
      company,
      ...(teamSize ? { teamSize } : {}),
      agents,
      ...(challenge ? { challenge } : {}),
    },
    fieldErrors,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function safeFieldErrors(value: unknown): WaitlistFieldErrors {
  if (!isRecord(value)) {
    return {};
  }

  const fieldErrors: WaitlistFieldErrors = {};
  for (const field of WAITLIST_FIELDS) {
    const message = value[field];
    if (typeof message === "string") {
      const normalized = message.trim();
      if (
        normalized &&
        normalized.length <= WAITLIST_CLIENT_LIMITS.errorMessage
      ) {
        fieldErrors[field] = normalized;
      }
    }
  }
  return fieldErrors;
}

export function getWaitlistEndpoint(): string {
  return process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT?.trim() || "/api/waitlist";
}

/**
 * The only network boundary for the waitlist form.
 *
 * Production uses the project-owned same-origin Worker route. A custom endpoint
 * can still be supplied for non-Sites environments.
 */
export async function submitWaitlistApplication(
  unnormalizedApplication: WaitlistApplication,
): Promise<void> {
  const { application, fieldErrors } = normalizeApplication(
    unnormalizedApplication,
  );
  if (Object.keys(fieldErrors).length > 0) {
    throw new WaitlistSubmissionError(WAITLIST_VALIDATION_ERROR, fieldErrors);
  }

  let response: Response;
  try {
    response = await fetch(getWaitlistEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    });
  } catch {
    throw new WaitlistSubmissionError(FALLBACK_ERROR);
  }

  if (!response.ok) {
    let message = FALLBACK_ERROR;
    let responseFieldErrors: WaitlistFieldErrors = {};

    try {
      const payload: unknown = await response.json();
      if (isRecord(payload)) {
        if (typeof payload.error === "string" && payload.error.trim()) {
          message = payload.error.trim();
        }
        responseFieldErrors = safeFieldErrors(payload.fieldErrors);
      }
    } catch {
      // Keep the safe fallback when an upstream returns a non-JSON error.
    }

    throw new WaitlistSubmissionError(message, responseFieldErrors);
  }
}
