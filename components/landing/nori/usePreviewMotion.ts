import { useEffect, useRef } from "react";

/** Pause the selected preview's CSS timeline while it cannot be seen. */
export function usePreviewMotion<T extends HTMLElement>(enabled: boolean) {
  const rootRef = useRef<T>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.motionState = "paused";
    if (!enabled) return;

    let inView = false;
    const syncMotion = () => {
      root.dataset.motionState = inView && !document.hidden ? "running" : "paused";
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      syncMotion();
    }, { threshold: 0.25 });

    observer.observe(root);
    document.addEventListener("visibilitychange", syncMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncMotion);
      root.dataset.motionState = "paused";
    };
  }, [enabled]);

  return rootRef;
}
