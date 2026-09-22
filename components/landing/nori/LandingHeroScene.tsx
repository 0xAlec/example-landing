import Image from "next/image";

import townHall from "@/assets/nori/hero-town-hall-v3.webp";
import observatory from "@/assets/nori/hero-observatory-v3.webp";
import styles from "./LandingHeroScene.module.css";

/** Town landmarks blend behind the hero copy and the top of the town preview. */
export function LandingHeroScene() {
  return (
    <div aria-hidden="true" className={styles.scene}>
      <div className={`${styles.bank} ${styles.leftBank}`}>
        <Image alt="" className={styles.shoreline} draggable={false} loading="eager" sizes="(min-width: 1910px) 840px, (min-width: 1273px) 44vw, (min-width: 1089px) 560px, 272px" src={townHall} />
      </div>
      <div className={`${styles.bank} ${styles.rightBank}`}>
        <Image alt="" className={styles.shoreline} draggable={false} loading="eager" sizes="(min-width: 1910px) 840px, (min-width: 1273px) 44vw, (min-width: 1089px) 560px, 272px" src={observatory} />
      </div>
    </div>
  );
}
