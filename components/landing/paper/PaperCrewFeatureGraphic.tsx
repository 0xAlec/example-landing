import Image from "next/image";
import type { CSSProperties } from "react";
import { Check, FileText, PencilSimple, Plus } from "@phosphor-icons/react/ssr";

import kikoPortrait from "@/public/portraits/agents/kiko-loose-ink-v1.webp";
import mossPortrait from "@/public/portraits/agents/moss-loose-ink-v1.webp";
import piperPortrait from "@/public/portraits/agents/piper-loose-ink-v1.webp";
import quillPortrait from "@/public/portraits/agents/quill-loose-ink-v1.webp";

import styles from "./PaperCrewFeatureGraphic.module.css";
import { PaperLogoCarousel } from "./PaperLogoCarousel";

const configurations = [
  {
    name: "Piper", role: "Backend", portrait: piperPortrait, offset: "0s", tone: "peach",
    tools: [{ id: "github", name: "GitHub" }, { id: "linear", name: "Linear" }],
    skills: ["API design", "Testing"], instruction: "Keep the existing API stable.",
  },
  {
    name: "Moss", role: "Reviewer", portrait: mossPortrait, offset: "-8s", tone: "mint",
    tools: [{ id: "github", name: "GitHub" }, { id: "sentry", name: "Sentry" }],
    skills: ["Code review", "Security"], instruction: "Check edge cases before approval.",
  },
  {
    name: "Kiko", role: "Designer", portrait: kikoPortrait, offset: "-4s", tone: "lavender",
    tools: [{ id: "figma", name: "Figma" }, { id: "github", name: "GitHub" }],
    skills: ["UI polish", "Accessibility"], instruction: "Use the existing design system.",
  },
] as const;

function AttachmentState() {
  return (
    <span className={styles.attachmentState}>
      <Plus className={styles.availableMark} size={10} />
      <Check className={styles.attachedMark} size={10} weight="bold" />
    </span>
  );
}

function attachmentTiming(index: number): CSSProperties {
  return { "--attach-start": `${2 + index * 2}%`, "--attach-end": `${4 + index * 2}%` } as CSSProperties;
}

export function CoworkerToolsGraphic() {
  return (
    <div aria-hidden="true" className={`${styles.canvas} ${styles.configurationCarousel}`}>
      {configurations.map(({ name, role, portrait, offset, tone, tools, skills, instruction }) => (
        <div
          className={styles.configurationScene}
          data-configuration={name}
          data-tone={tone}
          key={name}
          style={{ "--configuration-offset": offset } as CSSProperties}
        >
          <div className={styles.configuration}>
            <div className={styles.customizationMap}>
              <div className={styles.toolCollection}>
                <span className={styles.collectionLabel}>Tools</span>
                {tools.map(({ id, name: toolName }, index) => (
                  <div className={styles.attachment} key={id} style={attachmentTiming(index)}>
                    <Image alt="" height={18} src={`/logos/${id}.svg`} width={18} />
                    <span>{toolName}</span>
                    <AttachmentState />
                  </div>
                ))}
              </div>
              <div className={styles.coworkerCard}>
                <div className={styles.portraitHalo}><Image alt="" height={48} src={portrait} width={48} /></div>
                <b>{name}</b>
                <span>{role}</span>
                <span className={styles.coworkerPort} />
              </div>
              <div className={styles.skillCollection}>
                <span className={styles.collectionLabel}>Skills</span>
                {skills.map((skill, index) => (
                  <div className={styles.attachment} key={skill} style={attachmentTiming(index + 2)}>
                    <FileText className={styles.skillIcon} size={14} />
                    <span>{skill}</span>
                    <AttachmentState />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.instructionConnector} />
            <div className={styles.instructionCard}>
              <div className={styles.instructionHeader}><PencilSimple size={12} /><span>Instructions</span></div>
              <div className={styles.instructionText}>{instruction}<span className={styles.editCaret} /></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const remoteTasks = [
  { name: "Piper", portrait: piperPortrait, task: "Billing fix", tone: "peach", route: "M150 0v12a14 14 0 0 1-14 14H64a14 14 0 0 0-14 14v18" },
  { name: "Moss", portrait: mossPortrait, task: "API tests", tone: "mint", route: "M150 0v58" },
  { name: "Quill", portrait: quillPortrait, task: "Release notes", tone: "lavender", route: "M150 0v12a14 14 0 0 0 14 14h72a14 14 0 0 1 14 14v18" },
] as const;

const mcpClients = [
  { name: "Codex", src: "/logos/openai.svg", monochrome: true },
  { name: "Claude Code", src: "/logos/claude.svg" },
  { name: "Slack", src: "/logos/slack.svg" },
  { name: "Poke", src: "/logos/poke.png", circular: true },
  { name: "Instinct", src: "/logos/instinct.svg", circular: true },
  // Match the visible logo height inside the native icon's transparent padding.
  { name: "Grok Bot", src: "/logos/grok-bot.png", scale: 1.23 },
] as const;

function taskFlowTiming(index: number): CSSProperties {
  return { "--task-phase": `${index * 160}ms` } as CSSProperties;
}

export function LocalOrchestrationGraphic() {
  return (
    <div aria-hidden="true" className={styles.canvas}>
      <div className={styles.orchestration}>
        <div className={styles.localSession}>
          <PaperLogoCarousel logos={mcpClients} />
        </div>
        <svg className={styles.orchestrationRoutes} fill="none" preserveAspectRatio="none" viewBox="0 0 300 58">
          <path className={styles.routeLine} d="M150 0v58M150 12a14 14 0 0 1-14 14H64a14 14 0 0 0-14 14v18M150 12a14 14 0 0 0 14 14h72a14 14 0 0 1 14 14v18" />
          {remoteTasks.map(({ name, tone, route }, index) => (
            <g data-tone={tone} key={name} style={taskFlowTiming(index)}>
              {(["outbound", "inbound"] as const).map((direction) => (
                <g
                  className={styles.flowHighlight}
                  data-direction={direction}
                  key={direction}
                >
                  <path className={styles.routeGlow} d={route} pathLength={100} />
                  <path className={styles.routeHighlight} d={route} pathLength={100} />
                </g>
              ))}
            </g>
          ))}
        </svg>
        <div className={styles.remoteAgents}>
          {remoteTasks.map(({ name, portrait, task, tone }, index) => (
            <div
              className={styles.remoteAgent}
              data-tone={tone}
              key={name}
              style={taskFlowTiming(index)}
            >
              <div className={styles.agentPortrait}>
                <Image alt="" height={42} src={portrait} width={42} />
                <span className={styles.agentComplete}><Check size={10} weight="bold" /></span>
              </div>
              <span className={styles.taskName}>{task}</span>
              <div className={styles.taskOutput}><i /><i /><i /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
