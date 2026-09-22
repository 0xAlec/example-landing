"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { LandingReviewPreview } from "./LandingReviewPreview";
import { usePreviewMotion } from "./usePreviewMotion";
import styles from "./LandingWorkflowRail.module.css";

type WorkflowTool = { name: string; logo: string };

const connectionAgents = [
  { name: "Codex", logo: "openai.svg" },
  { name: "Claude Code", logo: "claude.svg" },
  { name: "Pi", logo: "pi.svg" },
  { name: "Cursor", logo: "cursor.svg" },
];

const steps = [
  {
    id: "configure",
    title: "Configure your tools 🛠️",
    description: "Connect your repository, tools, and workflows. Equip coworkers with the context and access they need.",
  },
  {
    id: "connect",
    title: "Connect your agents 🤖",
    description: "Bring Codex, Claude Code, Pi, and other agents into Desa.",
  },
  {
    id: "review",
    title: "Start shipping 🚀",
    description: "Give your crew a task, then review the changes and checks.",
  },
];

function EnvironmentPreview({ active, tools }: { active: boolean; tools: readonly WorkflowTool[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let inView = false;
    const syncMotion = () => {
      root.dataset.orbitMotion = active && inView && !document.hidden ? "active" : "paused";
    };
    syncMotion();
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      syncMotion();
    }, { threshold: 0.25 });

    observer.observe(root);
    document.addEventListener("visibilitychange", syncMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncMotion);
    };
  }, [active]);

  return (
    <div className={styles.environment} data-orbit-motion="paused" ref={rootRef}>
      <div aria-label="Your connected tools surround your Desa cloud workspace" className={styles.toolMap} role="group">
        <span aria-hidden="true" className={styles.orbit} />
        <div className={styles.workspaceMark}>
          <Image alt="Desa" draggable={false} height={88} src="/brand/desa-mark-256.webp" width={88} />
        </div>
        <div className={styles.toolOrbit}>
          {tools.map((tool, index) => {
            const angle = (index / tools.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <span
                className={styles.toolNode}
                key={tool.name}
                style={{ left: `${(50 + 36 * Math.cos(angle)).toFixed(3)}%`, top: `${(50 + 36 * Math.sin(angle)).toFixed(3)}%` }}
                title={tool.name}
              >
                <span className={styles.toolFace}>
                  <Image alt={tool.name} draggable={false} height={40} src={`/logos/${tool.logo}`} unoptimized width={40} />
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AgentConnectionsPreview({ active, animate }: { active: boolean; animate: boolean }) {
  const rootRef = usePreviewMotion<HTMLDivElement>(active && animate);

  return (
    <div className={styles.agentConnections} data-animate={animate} data-motion-state="paused" ref={rootRef}>
      <ul aria-label="Agents that work with Desa" className={styles.agents}>
        {connectionAgents.map(({ name, logo }) => (
          <li className={styles.agent} key={name}>
            <span className={styles.agentBadge} data-agent={name}>
              <Image alt="" draggable={false} height={36} src={`/logos/${logo}`} unoptimized width={36} />
            </span>
            <span>{name}</span>
          </li>
        ))}
      </ul>
      <svg aria-hidden="true" className={styles.agentRoutes} fill="none" preserveAspectRatio="none" viewBox="0 0 400 72">
        <path d="M50 0v20a14 14 0 0 0 14 14h272a14 14 0 0 0 14-14V0M150 0v34M250 0v34M200 34v38" />
      </svg>
      <div className={styles.agentWorkspaceMark}>
        <Image alt="Desa" draggable={false} height={88} src="/brand/desa-mark-256.webp" width={88} />
      </div>
    </div>
  );
}

export function LandingWorkflowRail({ tools }: { tools: readonly WorkflowTool[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewSessions, setPreviewSessions] = useState(steps.map(() => ({ visit: 0, animate: false })));
  const [progressCycle, setProgressCycle] = useState(0);
  const rootRef = usePreviewMotion<HTMLDivElement>(true);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function selectStep(index: number, animate: boolean) {
    setActiveIndex(index);
    setProgressCycle((cycle) => cycle + 1);
    if (index === activeIndex) return;
    // Keep outgoing content intact during its fade. Reset only the selected preview.
    setPreviewSessions((sessions) => sessions.map((session, sessionIndex) =>
      sessionIndex === index ? { visit: session.visit + 1, animate } : session,
    ));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowDown": nextIndex = (index + 1) % steps.length; break;
      case "ArrowUp": nextIndex = (index - 1 + steps.length) % steps.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = steps.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectStep(nextIndex, false);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className={styles.workflow} data-motion-state="paused" ref={rootRef}>
      <div aria-label="Workflow steps" aria-orientation="vertical" className={styles.rail} role="tablist">
        {steps.map((step, index) => (
          <button
            aria-controls={`workflow-panel-${step.id}`}
            aria-describedby={index === activeIndex ? `workflow-description-${step.id}` : undefined}
            aria-label={step.title}
            aria-selected={index === activeIndex}
            className={styles.step}
            id={`workflow-tab-${step.id}`}
            key={step.id}
            onClick={(event) => selectStep(index, event.detail > 0)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            ref={(element) => { tabRefs.current[index] = element; }}
            role="tab"
            tabIndex={index === activeIndex ? 0 : -1}
            type="button"
          >
            <span aria-hidden="true" className={styles.stepProgress}>
              <span
                className={styles.stepProgressFill}
                key={progressCycle}
                onAnimationEnd={(event) => {
                  if (event.target !== event.currentTarget || index !== activeIndex) return;
                  // A focus or visibility change can arrive after the last animation frame.
                  const root = rootRef.current;
                  const hovered = window.matchMedia("(hover: hover) and (pointer: fine)").matches && root?.matches(":hover");
                  if (!root || root.dataset.motionState !== "running" || document.hidden || hovered || root.contains(document.activeElement) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    setProgressCycle((cycle) => cycle + 1);
                    return;
                  }
                  selectStep((index + 1) % steps.length, true);
                }}
              />
            </span>
            <span className={styles.stepHeading}>{step.title}</span>
            <span aria-hidden={index !== activeIndex} className={styles.description} id={`workflow-description-${step.id}`}>
              <span className={styles.descriptionInner}>
                <span className={styles.descriptionCopy}>{step.description}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
      <div className={styles.previewFrame}>
        {steps.map((step, index) => (
          <div
            aria-hidden={index !== activeIndex}
            aria-labelledby={`workflow-tab-${step.id}`}
            className={styles.panel}
            data-active={index === activeIndex}
            data-step={step.id}
            id={`workflow-panel-${step.id}`}
            inert={index !== activeIndex}
            key={step.id}
            role="tabpanel"
            tabIndex={index === activeIndex ? 0 : -1}
          >
            {step.id === "configure" ? (
              <EnvironmentPreview active={index === activeIndex} key={previewSessions[index].visit} tools={tools} />
            ) : step.id === "connect" ? (
              <AgentConnectionsPreview active={index === activeIndex} animate={previewSessions[index].animate} key={previewSessions[index].visit} />
            ) : (
              <LandingReviewPreview active={index === activeIndex} animate={previewSessions[index].animate} key={previewSessions[index].visit} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
