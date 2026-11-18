"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      infinite: false,
      autoRaf: true,
      anchors: true,
      allowNestedScroll: true,
    });
    lenisRef.current = lenis;

    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a[href*='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.pathname === window.location.pathname && url.hash) {
        const el = document.querySelector(url.hash);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, {
            offset: -20,
            duration: 1.1,
          });
        }
      }
    };

    document.addEventListener("click", handleHashClick);

    return () => {
      document.removeEventListener("click", handleHashClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        requestAnimationFrame(() => {
          lenis.scrollTo(target as HTMLElement, {
            offset: -20,
            duration: 1.05,
          });
        });
        return;
      }
    }

    lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
