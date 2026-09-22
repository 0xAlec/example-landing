"use client";

import { type PropsWithChildren, useEffect, useRef } from "react";

export function PaperSessionTicker({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let isInView = false;
    const updateMotion = () => {
      root.dataset.sessionMotion =
        isInView && !document.hidden ? "active" : "paused";
    };
    updateMotion();
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
      aria-hidden="true"
      className={className}
      data-session-motion="paused"
      ref={rootRef}
    >
      {children}
    </div>
  );
}
