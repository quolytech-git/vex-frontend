"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  App loading screen: the "hands reaching for Vex" video.            */
/*  Shows once per browser session when Vex opens, then fades away     */
/*  when the clip ends. Tap / click / any key skips it.                */
/* ------------------------------------------------------------------ */

const SESSION_KEY = "vex_splash_seen";
const MIN_MS = 1200; // never flash for less than this
const MAX_MS = 6500; // never block longer than this, even if the video stalls

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startRef = useRef(0);

  // Decide on mount: skip if already seen this session or reduced motion is on.
  useEffect(() => {
    setMounted(true);
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage blocked — just show it */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    startRef.current = Date.now();
    document.documentElement.style.overflow = "hidden";
    const hardStop = window.setTimeout(() => setShow(false), MAX_MS);
    return () => window.clearTimeout(hardStop);
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
          key="vex-splash"
          role="dialog"
          aria-label="Loading Vex"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onClick={finish}
          className="fixed inset-0 z-[200] flex cursor-pointer items-center justify-center overflow-hidden bg-[#e8dcc4]"
        >
          {/* Blurred fill so portrait phones have no empty bands */}
          <img
            src="/images/vex-creation.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
          />

          {/* Rendered only in the browser so `muted` is applied before playback
              (React drops the muted attribute from server HTML). */}
          {mounted && (
          <video
            ref={(el) => {
              videoRef.current = el;
              if (el) {
                el.muted = true;
                el.defaultMuted = true;
                el.volume = 0;
                el.setAttribute("muted", "");
              }
            }}
            src="/videos/vex-loading.mp4"
            poster="/images/vex-creation.png"
            autoPlay
            muted
            playsInline
            disableRemotePlayback
            preload="auto"
            onVolumeChange={(e) => {
              // Never allow sound, even if something tries to unmute it.
              const v = e.currentTarget;
              if (!v.muted || v.volume > 0) {
                v.muted = true;
                v.volume = 0;
              }
            }}
            onEnded={finish}
            onError={finish}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgress(v.currentTime / v.duration);
            }}
            className="relative h-full w-full object-cover portrait:h-auto portrait:object-contain"
          />
          )}

          {/* Bottom: progress + skip hint */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-6 pb-[max(28px,env(safe-area-inset-bottom))]">
            <div className="h-[3px] w-40 overflow-hidden rounded-full bg-[#212d3d]/15">
              <div
                className="h-full rounded-full bg-[#212d3d]/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="text-[11px] font-medium tracking-[0.14em] text-[#212d3d]/55 uppercase">
              Tap to skip
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
