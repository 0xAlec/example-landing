import { MessageSquare } from "lucide-react";

import heading from "../HeadingAccent.module.css";
import { PaperCoworkers } from "./PaperCoworkers";
import { PaperSessionTicker } from "./PaperSessionTicker";
import section from "./PaperSections.module.css";
import styles from "./PaperCrew.module.css";

const sessionLabels = [
  "New chat", "Draft the brief", "Who owns this?", "Where’s the plan?",
  "Check the docs", "Run the tests", "Summarize this", "Make a plan",
  "Check edge cases", "Ask for approval", "Find the latest file", "Compare both answers",
  "Review the PR", "Fix the failing build", "Open another tab", "Copy the context",
  "Re-run the prompt", "Check the logs", "Find the decision", "Write a handoff",
  "Trace the bug", "Review the output", "Update the ticket", "Search the thread",
  "Start a new session", "Explain the error", "Check dependencies", "Draft a response",
  "Review the diff", "Find the owner", "Create a checklist", "Verify the result",
  "Reopen the task", "Ask for context", "Check the status", "Run it again",
  "Copy the link", "Read the notes", "Confirm the scope", "Find the artifact",
  "Update the plan", "Review permissions", "Check the branch", "Summarize changes",
  "Find prior work", "Open the workspace", "Compare versions", "Request a review",
  "Check the deadline", "Share the result",
];

const sessionColumns = [
  sessionLabels.filter((_, index) => index % 2 === 0),
  sessionLabels.filter((_, index) => index % 2 === 1),
];

export function PaperCrew() {
  return (
    <section aria-labelledby="crew-title" className={section.section} id="why-desa">
      <header className={`${section.heading} ${styles.comparisonHeading}`}>
        <h2 id="crew-title">
          <span>Other apps give you <span className={heading.accent}>sessions</span>.</span>{" "}
          <span>Desa gives you <span className={heading.accent}>coworkers</span>.</span>
        </h2>
      </header>
      <div className={styles.comparison}>
        <div className={styles.sessionsPanel}>
          <PaperSessionTicker className={styles.sessions}>
            {sessionColumns.map((column, columnIndex) => (
              <div className={styles.sessionColumn} key={columnIndex}>
                <div className={styles.sessionTrack}>
                  {[0, 1].map((copyIndex) => (
                    <ul className={styles.sessionGroup} key={copyIndex}>
                      {column.map((label) => (
                        <li key={label}>
                          <MessageSquare aria-hidden="true" size={10} />
                          <span>{label}</span>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            ))}
          </PaperSessionTicker>
        </div>
        <PaperCoworkers />
      </div>
    </section>
  );
}
