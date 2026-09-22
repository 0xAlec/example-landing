"use client";

import Image from "next/image";
import { useState } from "react";

import noriSticker from "@/assets/nori/nori-chat-sticker-v1.webp";

import styles from "./LandingChatSection.module.css";

const clientGroups = [
  {
    id: "desk",
    label: "At your desk",
    clients: [
      { name: "Codex", logo: "openai.svg", href: "https://openai.com/codex/" },
      { name: "Claude Code", logo: "claude.svg", href: "https://claude.com/product/claude-code" },
      { name: "Cursor", logo: "cursor.svg", href: "https://cursor.com/" },
    ],
  },
  {
    id: "on-the-go",
    label: "On the go",
    clients: [
      { name: "Instinct", logo: "instinct.svg", href: "https://instinct.com/" },
      { name: "Grok Bot", logo: "grok-bot.png", href: "https://x.ai/bot" },
      { name: "Muse", logo: "muse.webp", href: "https://apps.apple.com/us/app/muse-from-meta/id6760173601" },
    ],
  },
  {
    id: "tools",
    label: "In your tools",
    clients: [
      { name: "Slack", logo: "slack.svg", href: "https://slack.com/" },
      { name: "Linear", logo: "linear.svg", href: "https://linear.app/" },
      { name: "GitHub", logo: "github.svg", href: "https://github.com/" },
    ],
  },
];

function ChatClientGroup({ id, label, clients }: (typeof clientGroups)[number]) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const activeIndex = hoveredIndex ?? focusedIndex ?? -1;

  return (
    <div className={styles.clients} data-engaged={activeIndex !== -1}>
      <h3 className={styles.groupHeading} id={`chat-clients-${id}`}>{label}</h3>
      <ul aria-labelledby={`chat-clients-${id}`} className={styles.logoStack} onPointerLeave={() => setHoveredIndex(null)} role="list">
        {clients.map(({ name, logo, href }, index) => (
          <li
            className={styles.client}
            data-active={activeIndex === index}
            data-side={index < activeIndex ? "before" : "after"}
            key={name}
          >
            <a
              aria-label={`${name} (opens in a new tab)`}
              className={styles.clientLink}
              href={href}
              onBlur={() => setFocusedIndex(null)}
              onFocus={() => setFocusedIndex(index)}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") setHoveredIndex(index);
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className={styles.clientIcon} data-client={name}>
                <Image alt="" draggable={false} height={40} src={`/logos/${logo}`} unoptimized width={40} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingChatSection() {
  return (
    <section aria-labelledby="chat-with-nori-title" className={styles.section} id="chat-with-nori" tabIndex={-1}>
      <h2 id="chat-with-nori-title">
        Chat with <span className={styles.noriIdentity}>
          <Image alt="" className={styles.noriSticker} draggable={false} src={noriSticker} />
          <span className={styles.name}>Nori</span>
        </span><br />wherever work happens
      </h2>
      <p>Start work in your cloud factory from anywhere. Check on your progress and bring work back into the tools you already use.</p>
      <div className={styles.clientGroups}>
        {clientGroups.map((group) => <ChatClientGroup key={group.id} {...group} />)}
      </div>
    </section>
  );
}
