"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  App loading screen: the "hands reaching for Vex" video.            */
/*  Shows once per browser session when Vex opens, then fades away     */
/*  when the clip ends. (A tap, click or key still skips it quietly.)  */
/*                                                                      */
/*  The <video> is written straight into the server HTML (with a real  */
/*  `muted` attribute), so the browser starts playing it the moment    */
/*  the page arrives — before any JavaScript has loaded.               */
/* ------------------------------------------------------------------ */

export const SPLASH_SESSION_KEY = "vex_splash_seen";
const MIN_MS = 1200; // never flash for less than this
const MAX_MS = 6500; // never block longer than this, even if the video stalls

// Plain HTML so `muted autoplay playsinline` reach the browser exactly as written.
const VIDEO_HTML = `
<video id="vex-splash-video" autoplay muted playsinline preload="auto" disableremoteplayback
  poster="/videos/vex-loading-poster.jpg"
  style="position:relative;width:100%;height:var(--vex-splash-h,100%);transform:scale(var(--vex-splash-scale,1));object-fit:var(--vex-splash-fit,cover);-webkit-mask-image:var(--vex-splash-mask,none);mask-image:var(--vex-splash-mask,none)">
  <source src="/videos/vex-loading.webm" type="video/webm" />
  <source src="/videos/vex-loading.mp4" type="video/mp4" />
</video>`;

/**
 * Runs in <head> before the page paints: if the splash was already seen this
 * session (or reduced motion is on), mark <html> so CSS hides it instantly —
 * no flash on reloads.
 */
export const SPLASH_HEAD_SCRIPT = `try{if(sessionStorage.getItem('${SPLASH_SESSION_KEY}')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-splash','off')}}catch(e){}`;

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const startRef = useRef(Date.now());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.documentElement.getAttribute("data-splash") === "off") {
      (document.getElementById("vex-splash-video") as HTMLVideoElement | null)?.pause();
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    document.documentElement.style.overflow = "hidden";

    const v = document.getElementById("vex-splash-video") as HTMLVideoElement | null;
    if (!v) {
      setShow(false);
      return;
    }
    // Belt and braces: keep it silent no matter what.
    v.muted = true;
    v.volume = 0;
    const keepSilent = () => {
      if (!v.muted || v.volume > 0) {
        v.muted = true;
        v.volume = 0;
      }
    };
    v.addEventListener("volumechange", keepSilent);
    v.addEventListener("ended", finish);
    v.addEventListener("error", finish, true);
    if (v.ended) finish();
    else v.play().catch(() => {}); // in case autoplay was deferred

    const hardStop = window.setTimeout(() => setShow(false), MAX_MS);
    return () => {
      window.clearTimeout(hardStop);
      v.removeEventListener("volumechange", keepSilent);
      v.removeEventListener("ended", finish);
      v.removeEventListener("error", finish, true);
    };
  }, []);

  // Release scroll and listen for skip keys while visible.
  useEffect(() => {
    if (!show) {
      document.documentElement.style.overflow = "";
      return;
    }
    const onKey = () => finish();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  function finish() {
    const wait = Math.max(0, MIN_MS - (Date.now() - startRef.current));
    window.setTimeout(() => setShow(false), wait);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={rootRef}
          id="vex-splash"
          key="vex-splash"
          role="dialog"
          aria-label="Loading Vex"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          onClick={finish}
          className="vex-splash fixed inset-0 z-[200] flex cursor-pointer items-center justify-center overflow-hidden"
        >
          <div className="relative flex h-full w-full items-center" dangerouslySetInnerHTML={{ __html: VIDEO_HTML }} />

        </motion.div>
      )}
    </AnimatePresence>
  );
}
