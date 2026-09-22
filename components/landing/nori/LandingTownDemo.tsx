"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./LandingTownDemo.module.css";

export function LandingTownDemo() {
  const [intent, setIntent] = useState<"auto" | "play" | "pause">("auto");
  const [shouldLoad, setShouldLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let active = true;
    let attempt = 0;
    const sync = () => {
      const canPlay = visibleRef.current && !document.hidden && (intent === "play" || (intent === "auto" && !motion.matches && !connection?.saveData));
      if (!canPlay) { attempt += 1; video.pause(); return; }
      const currentAttempt = ++attempt;
      if (!shouldLoad) setShouldLoad(true);
      else void video.play().catch(() => {
        if (active && currentAttempt === attempt) setIntent("pause");
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 });
    observer.observe(video);
    video.addEventListener("canplay", sync);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    sync();
    return () => {
      active = false;
      attempt += 1;
      observer.disconnect();
      video.pause();
      video.removeEventListener("canplay", sync);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, [intent, shouldLoad]);

  return (
    <figure aria-label="Desa town, from day to night" className={styles.town} data-hero-town id="product">
      <button aria-label={playing ? "Pause town video" : "Play town video"} className={styles.scene} onClick={() => {
        const video = videoRef.current;
        if (playing) { video?.pause(); setIntent("pause"); }
        else { if (video?.error) video.load(); setIntent("play"); }
      }} type="button">
        <video aria-hidden="true" className={styles.video} loop muted playsInline poster="/media/town-campus-day-to-night-v1-poster.webp" preload="none" ref={videoRef}
          onError={() => setIntent("pause")} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)}
          src={shouldLoad ? "/media/town-campus-day-to-night-v1-1600p120.mp4" : undefined} />
      </button>
    </figure>
  );
}
