"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import noriPortrait from "@/assets/nori/portraits/nori.webp";
import mossPortrait from "@/assets/nori/portraits/moss.webp";
import quillPortrait from "@/assets/nori/portraits/quill.webp";
import piperPortrait from "@/assets/nori/portraits/piper.webp";
import kikoPortrait from "@/assets/nori/portraits/kiko.webp";
import shared from "./PaperCrew.module.css";
import styles from "./PaperCoworkers.module.css";

// Role titles follow infra/development/development-role-candidates.ts.
const coworkers = [
  {
    name: "Moss", portrait: mossPortrait, role: "Quality Engineer",
    description: "Reviews changes, tests edge cases, and traces failures to their cause.",
  },
  {
    name: "Quill", portrait: quillPortrait, role: "Engineer",
    description: "Builds features, fixes bugs, and leaves working code with recorded checks.",
  },
  {
    name: "Piper", portrait: piperPortrait, role: "Product Manager",
    description: "Researches the problem, compares options, and turns ideas into clear requirements.",
  },
  {
    name: "Nori", portrait: noriPortrait, role: "Chief of Staff",
    description: "Breaks work into tasks, brings in the right crew, and combines their results.",
  },
  {
    name: "Kiko", portrait: kikoPortrait, role: "Product Designer",
    description: "Shapes user flows, refines interactions, and makes interfaces clear and accessible.",
  },
];

export function PaperCoworkers() {
  const [selected, setSelected] = useState(3);
  const [input, setInput] = useState("pointer");
  const rootRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let isInView = false;
    const updateMotion = () => {
      root.dataset.crewMotion = isInView && !document.hidden ? "active" : "paused";
    };
    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
      updateMotion();
    });

    observer.observe(root);
    document.addEventListener("visibilitychange", updateMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateMotion);
    };
  }, []);

  return (
    <div
      className={`${shared.coworkersPanel} ${styles.panel}`}
      data-crew-motion="paused"
      data-input={input}
      onKeyDownCapture={() => setInput("keyboard")}
      onPointerDownCapture={() => setInput("pointer")}
      ref={rootRef}
    >
      <div className={styles.chooser}>
        <p className={styles.hint} id={`${id}-hint`}>Select a character to meet them.</p>
        <div aria-describedby={`${id}-hint`} aria-label="Meet the crew" className={styles.group} role="radiogroup">
        {coworkers.map(({ name, portrait, role, description }, index) => (
          <button
            aria-checked={selected === index}
            aria-controls={`${id}-profile-${index}`}
            aria-describedby={`${id}-description-${index}`}
            aria-label={`${name}, ${role}`}
            className={styles.character}
            data-person={name.toLowerCase()}
            key={name}
            onClick={() => setSelected(index)}
            onFocus={() => setSelected(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % coworkers.length;
              else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + coworkers.length) % coworkers.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = coworkers.length - 1;
              else return;
              event.preventDefault();
              buttons.current[next]?.focus();
            }}
            ref={(node) => { buttons.current[index] = node; }}
            role="radio"
            tabIndex={selected === index ? 0 : -1}
            type="button"
          >
            <span className={styles.face}>
              <span className={styles.float}>
                <Image alt="" className={styles.portrait} draggable={false} sizes="(max-width: 760px) 30vw, 160px" src={portrait} />
              </span>
            </span>
            <span className={styles.name}>{name}</span>
            <span className={styles.screenReader} id={`${id}-description-${index}`}>{description}</span>
          </button>
        ))}
        </div>
      </div>

      <div className={styles.captions}>
        {coworkers.map(({ name, role, description }, index) => (
          <div
            aria-hidden={selected !== index}
            className={styles.caption}
            data-selected={selected === index}
            id={`${id}-profile-${index}`}
            key={name}
          >
            <div className={styles.captionHeading}>
              <h3>{name}</h3>
              <span>{role}</span>
            </div>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
