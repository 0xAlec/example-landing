import type { ReactNode } from "react";

import styles from "./LandingNavigation.module.css";

export function LandingNavigation({ brand }: { brand: ReactNode }) {
  return (
    <header className={styles.header}>
      <nav aria-label="Primary navigation" className={styles.navigation}>
        <div className={styles.brand}>{brand}</div>
        <div className={styles.actions}>
          <div className={styles.links}>
            <a className={styles.link} href="#why-desa">Why Desa</a>
            <a className={styles.link} href="#product">The town</a>
            {/* <a className={styles.link} href="#messages">Messages</a> */}
            <a className={styles.link} href="#features">Features</a>
          </div>
          <a className={styles.cta} href="#waitlist">Request access</a>
        </div>
      </nav>
    </header>
  );
}
