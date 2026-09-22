import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowDown, Cloud, FolderSimple, LockSimple, TerminalWindow } from "@phosphor-icons/react/ssr";

import kikoPortrait from "@/public/portraits/agents/kiko-loose-ink-v1.webp";
import mossPortrait from "@/public/portraits/agents/moss-loose-ink-v1.webp";
import noriPortrait from "@/public/portraits/agents/nori-loose-ink-v1.webp";
import piperPortrait from "@/public/portraits/agents/piper-loose-ink-v1.webp";
import quillPortrait from "@/public/portraits/agents/quill-loose-ink-v1.webp";

import styles from "./PaperCloudFeatureGraphic.module.css";
import { PaperLogoCarousel } from "./PaperLogoCarousel";

export function CloudSandboxesGraphic() {
  const agents = [
    { id: "piper", name: "Piper", portrait: piperPortrait, offset: "0s", tasks: ["Billing fix", "API tests", "Data import"] },
    { id: "moss", name: "Moss", portrait: mossPortrait, offset: "-16s", tasks: ["Code review", "QA checks", "Security"] },
    { id: "kiko", name: "Kiko", portrait: kikoPortrait, offset: "-8s", tasks: ["UI polish", "Layout fix", "Icon update"] },
  ];

  return (
    <div aria-hidden="true" className={styles.canvas}>
      <div className={styles.sandboxCarousel}>
        {agents.map(({ id, name, portrait, offset, tasks }) => (
          <div
            className={styles.sandboxScene}
            data-sandbox-agent={id}
            key={id}
            style={{ "--scene-offset": offset } as CSSProperties}
          >
            <div className={styles.sandboxScale}>
              <div className={styles.sandboxOwner}>
                <Image alt="" height={32} src={portrait} width={32} />
                <b>{name}</b>
              </div>
              <svg className={styles.taskConnections} fill="none" preserveAspectRatio="none" viewBox="0 0 300 28">
                <path d="M150 0v14" />
                <path className={styles.taskConnectionCenter} d="M150 14v14" />
                <path className={styles.taskConnectionBranches} d="M0 28v-8a6 6 0 0 1 6-6h288a6 6 0 0 1 6 6v8" />
              </svg>
              <div className={styles.sandboxAssignments}>
                {tasks.map((task) => (
                  <div className={styles.taskFlow} data-task={task} key={task}>
                    <div className={styles.taskTicket}><b>{task}</b></div>
                    <ArrowDown className={styles.assignmentArrow} size={18} weight="regular" />
                    <div className={styles.sandbox}>
                      <div className={styles.sandboxHeader}>
                        <Cloud size={16} weight="regular" />
                        <LockSimple size={12} weight="regular" />
                      </div>
                      <div className={styles.sandboxTools}>
                        <span><FolderSimple size={16} weight="regular" />Files</span>
                        <span><TerminalWindow size={16} weight="regular" />Terminal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SubscriptionGraphic() {
  const harnesses = [
    { name: "Codex", src: "/logos/openai.svg", monochrome: true },
    { name: "Claude Code", src: "/logos/claude.svg" },
    { name: "Cursor", src: "/logos/cursor.svg", monochrome: true },
    // Icon from https://docs.devin.ai/enterprise/overview.
    { name: "Devin", src: "/logos/devin.png", monochrome: true, scale: 1.29 },
  ];
  const coworkers = [
    { name: "Nori", portrait: noriPortrait },
    { name: "Moss", portrait: mossPortrait },
    { name: "Quill", portrait: quillPortrait },
    { name: "Piper", portrait: piperPortrait },
    { name: "Kiko", portrait: kikoPortrait },
  ];

  return (
    <div aria-hidden="true" className={styles.canvas}>
      <div className={styles.subscription}>
        <PaperLogoCarousel logos={harnesses} />
        <svg
          className={styles.powerConnections}
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 300 76"
        >
          <path d="M150 0v76" />
          <path d="M30 76V58a10 10 0 0 1 10-10h220a10 10 0 0 1 10 10v18M90 48v28M210 48v28" />
        </svg>
        <div className={styles.coworkers}>
          {coworkers.map(({ name, portrait }) => (
            <div className={styles.coworker} key={name}>
              <Image alt="" height={40} src={portrait} width={40} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
