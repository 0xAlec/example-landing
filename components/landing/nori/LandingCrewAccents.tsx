import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import nori from "@/assets/nori/portraits/nori.webp";
import moss from "@/assets/nori/portraits/moss.webp";
import kiko from "@/assets/nori/portraits/kiko.webp";
import quill from "@/assets/nori/portraits/quill.webp";
import piper from "@/assets/nori/portraits/piper.webp";
import styles from "./LandingCrewAccents.module.css";

export function LandingCrewTrail() {
  return (
    <div className={styles.crewTrail}>
      <span aria-hidden="true" className={styles.trailPortraits}>
        {[nori, moss, quill, piper, kiko].map((portrait) => <Image alt="" draggable={false} key={portrait.src} sizes="36px" src={portrait} />)}
      </span>
      <span>One town. Your whole crew.</span>
      <a href="#why-desa">Meet the crew <ArrowUpRight aria-hidden="true" size={15} /></a>
    </div>
  );
}

export function LandingStudioCrew() {
  return (
    <div aria-hidden="true" className={styles.studioScene}>
      <div className={styles.studioCrew}>
        {[piper, moss, nori, quill, kiko].map((portrait, index) => (
          <Image alt="" className={styles.studioPortrait} data-seat={index} draggable={false} key={portrait.src} sizes="(max-width: 600px) 50vw, 210px" src={portrait} />
        ))}
      </div>
    </div>
  );
}
