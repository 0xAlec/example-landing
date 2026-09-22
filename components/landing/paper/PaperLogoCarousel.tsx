import Image from "next/image";
import type { CSSProperties } from "react";

import styles from "./PaperLogoCarousel.module.css";

type CarouselLogo = {
  name: string;
  src: string;
  monochrome?: boolean;
  circular?: boolean;
  scale?: number;
};

export function PaperLogoCarousel({ logos }: { logos: readonly CarouselLogo[] }) {
  return (
    <div
      className={styles.carousel}
      data-logo-carousel=""
      style={{ "--logo-count": logos.length } as CSSProperties}
    >
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <div className={styles.group} key={copy}>
            {logos.map(({ name, src, monochrome, circular, scale }) => (
              <span
                className={styles.logo}
                data-logo-name={name}
                data-monochrome={monochrome || undefined}
                data-circular={circular || undefined}
                key={name}
                style={scale ? { "--logo-scale": scale } as CSSProperties : undefined}
              >
                <Image alt="" height={28} loading="eager" src={src} width={28} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
