"use client";

import { createContext, type PropsWithChildren, useContext, useEffect, useRef, useState } from "react";

type Playback = "static" | "active" | "paused";
const FeaturePlaybackContext = createContext<Playback>("static");

export function usePaperFeatureMotion() {
  return useContext(FeaturePlaybackContext);
}

type PaperFeatureMotionProps = PropsWithChildren<{
  className?: string;
  label: string;
}>;

export function PaperFeatureMotion({
  children,
  className,
  label,
}: PaperFeatureMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [playback, setPlayback] = useState<Playback>("static");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let isInView = false;
    const syncPlayback = () => {
      setPlayback(
        motionPreference.matches
          ? "static"
          : isInView && !document.hidden ? "active" : "paused",
      );
    };
    syncPlayback();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        syncPlayback();
      },
      { rootMargin: "0px 0px -8%", threshold: 0.35 },
    );

    observer.observe(root);
    motionPreference.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  return (
    <FeaturePlaybackContext.Provider value={playback}>
      <div
        aria-label={label}
        className={className}
        data-paper-feature-motion={playback}
        ref={rootRef}
        role="img"
      >
        {children}
      </div>
    </FeaturePlaybackContext.Provider>
  );
}

export default PaperFeatureMotion;
