import Image from "next/image";
import { useId, useState } from "react";
import { Check, ChevronDown, CircleAlert, CircleDashed, CircleX, GitPullRequest, GitPullRequestDraft } from "lucide-react";

import { reviewGroups, type ReviewRequest } from "./landing-review-data";
import { usePreviewMotion } from "./usePreviewMotion";
import styles from "./LandingReviewPreview.module.css";

const checkLabels = { passed: "Checks passed", failed: "Checks failed", pending: "Checks not run" };
const checkIcons = { passed: Check, failed: CircleX, pending: CircleDashed };

function RequestRow({ request, draft }: { request: ReviewRequest; draft: boolean }) {
  const { number, title, author, crew, codingAssistant, age, repository, added, removed, checks } = request;
  const RequestIcon = draft ? GitPullRequestDraft : GitPullRequest;
  const CheckIcon = checkIcons[checks];

  return (
    <div className={styles.requestRow}>
      <RequestIcon aria-hidden="true" className={styles.requestIcon} data-draft={draft} size={14} />
      <p className={styles.title} title={`#${number} ${title}`}>
        <span className={styles.number}>#{number}</span> {title}
      </p>
      <div className={styles.outcome}>
        <span aria-label={`${added} lines added, ${removed} lines removed`} className={styles.diffCount} role="img">
          <span aria-hidden="true">+{added}</span><span aria-hidden="true">−{removed}</span>
        </span>
        <span aria-label={checkLabels[checks]} className={styles.checkStatus} data-state={checks} role="img">
          <CheckIcon aria-hidden="true" size={14} />
        </span>
      </div>
      <div className={styles.metadata}>
        <span>{age}</span><span aria-hidden="true" className={styles.separator}>·</span>
        <span aria-label={`Author: ${author.name}`} className={styles.person}>
          <Image alt="" className={styles.humanAvatar} draggable={false} height={16} src={author.portrait} width={16} />{author.name}
        </span>
        <span aria-label={`Repository: ${repository}`} className={styles.repository}>
          <Image alt="" draggable={false} height={12} src="/logos/github.svg" unoptimized width={12} />{repository}
        </span>
        <span className={styles.crew}>
          <Image alt="" className={styles.crewAvatar} draggable={false} height={14} src={crew.portrait} width={14} />{crew.name}
        </span>
        <Image alt={codingAssistant.name} className={styles.codingAssistant} draggable={false} height={14} src={`/logos/${codingAssistant.logo}`} title={codingAssistant.name} unoptimized width={14} />
      </div>
    </div>
  );
}

function ReviewSequence({ active, animate }: { active: boolean; animate: boolean }) {
  const [openGroup, setOpenGroup] = useState<string | null>("approved");
  const [interacted, setInteracted] = useState(false);
  const [demonstrated, setDemonstrated] = useState(false);
  const [keyboardInput, setKeyboardInput] = useState(!animate);
  const shouldPlay = animate && !interacted && !demonstrated;
  const rootRef = usePreviewMotion<HTMLElement>(active && shouldPlay);
  const id = useId();

  return (
    <figure
      aria-label="Example pull requests with human authors, Desa crew members, and coding assistants"
      className={styles.preview}
      data-animate={shouldPlay}
      data-keyboard={keyboardInput}
      data-motion-state="paused"
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget || !active || !shouldPlay) return;
        const root = rootRef.current;
        const hovered = window.matchMedia("(hover: hover) and (pointer: fine)").matches && root?.matches(":hover");
        if (!root || root.dataset.motionState !== "running" || document.hidden || hovered || root.contains(document.activeElement) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setInteracted(true);
          return;
        }
        setDemonstrated(true);
        setOpenGroup("review");
      }}
      onFocusCapture={() => setInteracted(true)}
      onKeyDownCapture={() => setKeyboardInput(true)}
      ref={rootRef}
    >
      {reviewGroups.map((group) => {
        const isOpen = openGroup === group.id;
        const groupId = `${id}-${group.id}`;
        const GroupIcon = group.id === "draft" ? GitPullRequestDraft : group.id === "review" ? CircleAlert : GitPullRequest;
        return (
          <div className={styles.results} key={group.id}>
            <h3 className={styles.groupHeading}>
              <button
                aria-controls={`${groupId}-list`}
                aria-expanded={isOpen}
                className={styles.header}
                id={groupId}
                onClick={(event) => {
                  setInteracted(true);
                  setKeyboardInput(event.detail === 0);
                  setOpenGroup(isOpen ? null : group.id);
                }}
                type="button"
              >
                <GroupIcon aria-hidden="true" className={group.id === "approved" ? styles.approvedIcon : group.id === "review" ? styles.reviewIcon : undefined} size={14} />
                <span>{group.label}</span>
                <span className={styles.count}>{group.requests.length}</span>
                <span className={styles.headerSpacer} />
                <ChevronDown aria-hidden="true" className={styles.chevron} size={14} />
              </button>
            </h3>
            <div aria-hidden={!isOpen} className={styles.disclosure} data-open={isOpen} id={`${groupId}-list`} inert={!isOpen}>
              <div className={styles.disclosureInner}>
                <ul aria-labelledby={groupId} className={styles.requests}>
                  {group.requests.map((request) => (
                    <li className={styles.request} key={request.number}>
                      <RequestRow draft={group.id === "draft"} request={request} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </figure>
  );
}

export function LandingReviewPreview({ active, animate }: { active: boolean; animate: boolean }) {
  return <ReviewSequence active={active} animate={animate} />;
}
