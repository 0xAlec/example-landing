"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";

import {
  getWaitlistEndpoint,
  submitWaitlistApplication,
  WaitlistSubmissionError,
} from "@/lib/waitlist";
import {
  WAITLIST_CLIENT_LIMITS,
  WAITLIST_FIELD_ERROR_MESSAGES,
} from "@/lib/waitlistContract";

import paperStyles from "./PaperInvitation.module.css";
import noriStyles from "../nori/NoriWaitlist.module.css";

type FormState = "idle" | "submitting" | "success" | "error";

const COMPACT_SIGNUP_COMPANY = "Not provided";

export function InvitationWaitlistForm({ appearance = "paper" }: { appearance?: "paper" | "nori" }) {
  const styles = appearance === "nori" ? noriStyles : paperStyles;
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.noValidate = true;
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const emailInput = form.elements.namedItem("email");

    if (
      !(emailInput instanceof HTMLInputElement) ||
      !emailInput.validity.valid
    ) {
      setState("error");
      setMessage(WAITLIST_FIELD_ERROR_MESSAGES.email);
      setIsEmailInvalid(true);
      if (emailInput instanceof HTMLInputElement) {
        emailInput.focus();
      }
      return;
    }

    setState("submitting");
    setMessage("");
    setIsEmailInvalid(false);

    try {
      await submitWaitlistApplication({
        agents: [],
        company: COMPACT_SIGNUP_COMPANY,
        email: emailInput.value,
      });
      form.reset();
      setState("success");
      setMessage("You’re on the list. We’ll email next steps.");
      setIsEmailInvalid(false);
    } catch (error) {
      const fieldMessage =
        error instanceof WaitlistSubmissionError
          ? error.fieldErrors.email
          : undefined;

      setState("error");
      setIsEmailInvalid(Boolean(fieldMessage));
      setMessage(
        fieldMessage ??
          (error instanceof Error
            ? error.message
            : "We could not submit your request. Please try again."),
      );
      if (fieldMessage) {
        emailInput.focus();
      }
    }
  }

  function clearMessage() {
    if (state !== "submitting" && state !== "idle") {
      setState("idle");
      setMessage("");
      setIsEmailInvalid(false);
    }
  }

  return (
    <form
      acceptCharset="UTF-8"
      action={getWaitlistEndpoint()}
      aria-busy={state === "submitting"}
      className={styles.form}
      encType="application/x-www-form-urlencoded"
      method="post"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <input
        name="company"
        readOnly
        type="hidden"
        value={COMPACT_SIGNUP_COMPANY}
      />

      <label className={styles.formLabel} htmlFor="paper-invitation-email">
        Work email
      </label>

      <div className={styles.formRow}>
        <input
          aria-describedby="paper-invitation-email-status"
          aria-invalid={isEmailInvalid ? true : undefined}
          autoComplete="email"
          className={styles.formInput}
          id="paper-invitation-email"
          inputMode="email"
          maxLength={WAITLIST_CLIENT_LIMITS.email}
          name="email"
          onChange={clearMessage}
          placeholder="you@company.com"
          required
          spellCheck={false}
          type="email"
        />

        <button
          aria-label={
            state === "submitting" ? "Requesting access" : "Request access"
          }
          className={styles.formSubmit}
          disabled={state === "submitting"}
          type="submit"
        >
          {state === "submitting" ? "Requesting…" : "Request access"}
        </button>
      </div>

      <p
        aria-atomic="true"
        aria-live="polite"
        className={styles.formStatus}
        data-state={state}
        id="paper-invitation-email-status"
        role={state === "error" ? "alert" : "status"}
      >
        {message ? (
          <span className={styles.formStatusMessage}>{message}</span>
        ) : null}
      </p>
    </form>
  );
}
