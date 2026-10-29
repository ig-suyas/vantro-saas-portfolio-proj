"use client";

import { useEffect } from "react";

/** Lenis smooth scroll on fine pointers only, off for reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    let lenis: import("lenis").default | undefined;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), autoRaf: true, anchors: true });
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, []);

  return null;
}
