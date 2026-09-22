import Image from "next/image";
import type { ReactNode } from "react";

import studio from "@/assets/nori/section-studio-v1.webp";
import library from "@/assets/nori/section-library-v1.webp";
import depot from "@/assets/nori/section-depot-v1.webp";
import harbor from "@/assets/nori/section-harbor-v1.webp";
import styles from "./LandingSectionScene.module.css";

const artwork = {
  crew: studio,
  workflow: library,
  features: depot,
  harbor,
} as const;

type LandingSectionSceneProps = {
  scene: keyof typeof artwork;
  children: ReactNode;
};

/** Town scenery extends behind the existing section content. */
export function LandingSectionScene({ scene, children }: LandingSectionSceneProps) {
  return (
    <div className={styles.wrapper} data-section-scene={scene}>
      <div aria-hidden="true" className={styles.scenery}>
        <div className={styles.art}>
          <Image
            alt=""
            className={styles.image}
            draggable={false}
            loading="lazy"
            sizes="(min-width: 1910px) 840px, (min-width: 1273px) 44vw, (min-width: 1088px) 560px, 240px"
            src={artwork[scene]}
          />
        </div>
        {scene === "features" && (
          <div className={`${styles.art} ${styles.featureCompanion}`}>
            <Image
              alt=""
              className={styles.image}
              draggable={false}
              loading="lazy"
              sizes="(min-width: 1910px) 840px, (min-width: 1273px) 44vw, (min-width: 1088px) 560px, 240px"
              src={library}
            />
          </div>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
