"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Cloud page transition (Clash-of-Clans style).                      */
/*  Two banks of fresco clouds roll in from the sides and meet in the  */
/*  middle, the Vex temple + a tip appear, the next page loads behind  */
/*  them, then the clouds part to reveal it.                           */
/*                                                                      */
/*  - Website: any internal <a> click is routed through the clouds.    */
/*  - Dashboard: call useCloudTransition().run(() => setSection(...)). */
/* ------------------------------------------------------------------ */

type Phase = "idle" | "closing" | "closed" | "opening";

const IS_PHONE = typeof window !== "undefined" && window.matchMedia("(max-width: 1023.98px)").matches;
const CLOSE_S = IS_PHONE ? 0.3 : 0.42;
const OPEN_S = IS_PHONE ? 0.38 : 0.55;
const MAX_WAIT_MS = 2500; // never hold the clouds longer than this

const TIPS = [
  "Tip: verified skills count for more than self-declared ones.",
  "Tip: follow up 5–7 days after applying if you hear nothing.",
  "Tip: keep only roles at 80%+ fit — quality beats quantity.",
  "Tip: end every STAR answer with a measurable result.",
  "Tip: one specific detail about a person doubles reply rates.",
  "Tip: the extension never presses Submit — you do.",
  "Tip: reject any CV edit you can't prove in an interview.",
];

interface Ctx {
  run: (change: () => void, opts?: { waitForRoute?: boolean }) => void;
}
const CloudCtx = createContext<Ctx>({ run: (c) => c() });
export const useCloudTransition = () => useContext(CloudCtx);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [tip, setTip] = useState(TIPS[0]);
  const pending = useRef<{ waitForRoute: boolean; fromPath: string; timer?: number } | null>(null);
  const busy = useRef(false);

  const reveal = useCallback(() => {
    if (!pending.current) return;
    window.clearTimeout(pending.current.timer);
    pending.current = null;
    // A beat so the new page paints under the clouds before they part.
    window.setTimeout(() => setPhase("opening"), IS_PHONE ? 60 : 140);
  }, []);

  const run = useCallback(
    (change: () => void, opts?: { waitForRoute?: boolean }) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || busy.current) {
        change();
        return;
      }
      busy.current = true;
      setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
      setPhase("closing");
      window.setTimeout(() => {
        setPhase("closed");
        pending.current = { waitForRoute: !!opts?.waitForRoute, fromPath: window.location.pathname + window.location.search };
        change();
        window.scrollTo(0, 0);
        if (!opts?.waitForRoute) {
          requestAnimationFrame(() => requestAnimationFrame(reveal));
        } else if (pending.current) {
          pending.current.timer = window.setTimeout(reveal, MAX_WAIT_MS);
        }
      }, CLOSE_S * 1000);
    },
    [reveal]
  );

  // Route finished changing → part the clouds.
  useEffect(() => {
    const p = pending.current;
    if (p?.waitForRoute && window.location.pathname + window.location.search !== p.fromPath) reveal();
  }, [pathname, reveal]);

  // Send internal link clicks through the clouds.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (/\.(mp4|webm|jpg|png|pdf|zip|json)$/i.test(url.pathname)) return;
      const here = window.location.pathname + window.location.search;
      const there = url.pathname + url.search;
      if (there === here) return; // same page (or just a #hash) — let it be
      e.preventDefault();
      run(() => router.push(there + url.hash), { waitForRoute: true });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, run]);

  return (
    <CloudCtx.Provider value={{ run }}>
      {children}
      <CloudCurtain
        phase={phase}
        tip={tip}
        onOpened={() => {
          setPhase("idle");
          busy.current = false;
        }}
      />
    </CloudCtx.Provider>
  );
}

/* ---------------------------- Visuals ---------------------------- */

// Cloud puffs, as [vertical centre %, diameter in vmin]. Generated once.
const FRONT = Array.from({ length: 14 }, (_, i) => [-4 + i * 8.2, 30 + ((i * 7) % 5) * 5] as const);
const BACK = Array.from({ length: 8 }, (_, i) => [-6 + i * 15, 54 + ((i * 5) % 3) * 9] as const);

function Puff({ side, cx, cy, size, tone }: { side: "left" | "right"; cx: number; cy: number; size: number; tone: "front" | "back" }) {
  return (
    <span
      className="absolute rounded-full"
      style={{
        top: `calc(${cy}% - ${size / 2}vmin)`,
        [side]: `calc(${cx}% - ${size / 2}vmin)`,
        width: `${size}vmin`,
        height: `${size}vmin`,
        background:
          tone === "front"
            ? "radial-gradient(circle at 40% 34%, #fdf8ee 0%, #f3e9d6 48%, #e8d9bd 100%)"
            : "radial-gradient(circle at 42% 38%, #efe3cd 0%, #e5d5b8 70%, #dcc8a7 100%)",
        boxShadow:
          tone === "front"
            ? "inset -0.8vmin -1.4vmin 2.6vmin rgba(150,120,80,0.13), 0 0.8vmin 2.4vmin rgba(110,85,50,0.10)"
            : "inset -1vmin -1.6vmin 3vmin rgba(140,110,70,0.12)",
      } as React.CSSProperties}
    />
  );
}

function Bank({ side, phase }: { side: "left" | "right"; phase: Phase }) {
  const out = side === "left" ? "-112%" : "112%";
  const covered = phase === "closing" || phase === "closed";
  return (
    <motion.div
      className="absolute inset-y-0 w-[64%] will-change-transform"
      style={{ [side]: 0 } as React.CSSProperties}
      initial={{ x: out }}
      animate={{ x: covered ? "0%" : out }}
      transition={
        covered
          ? { duration: CLOSE_S, ease: [0.25, 1, 0.5, 1] }
          : { duration: OPEN_S, ease: [0.55, 0, 0.75, 0.2] }
      }
    >
      {/* Body (its straight inner edge is hidden behind the back puffs) */}
      <div className="absolute inset-y-0 w-[62%] bg-[#e5d5b8]" style={{ [side]: 0 } as React.CSSProperties} />
      {BACK.map(([cy, size], i) => (
        <Puff key={`b${i}`} side={side} cx={60} cy={cy} size={size} tone="back" />
      ))}
      {FRONT.map(([cy, size], i) => (
        <Puff key={`f${i}`} side={side} cx={80 + ((i * 3) % 4) * 3} cy={cy} size={size} tone="front" />
      ))}
    </motion.div>
  );
}

function CloudCurtain({ phase, tip, onOpened }: { phase: Phase; tip: string; onOpened: () => void }) {
  const visible = phase !== "idle";

  useEffect(() => {
    if (phase !== "opening") return;
    const t = window.setTimeout(onOpened, OPEN_S * 1000 + 40);
    return () => window.clearTimeout(t);
  }, [phase, onOpened]);

  if (!visible) return null;
  const covered = phase === "closing" || phase === "closed";

  return (
    <div className="pointer-events-auto fixed inset-0 z-[190] overflow-hidden" aria-busy="true" aria-live="polite">
      <Bank side="left" phase={phase} />
      <Bank side="right" phase={phase} />

      {/* Emblem + tip, shown while the clouds are closed */}
      <AnimatePresence>
        {phase === "closed" && covered && (
          <motion.div
            key="emblem"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          >
            <img
              src="/icons/icon-192.png"
              alt=""
              className="h-20 w-20 rounded-[22px] shadow-[0_10px_30px_rgba(90,70,40,0.25)]"
            />
            <div className="mt-5 flex items-center gap-1.5" aria-label="Loading">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-[#5c4a33]"
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
            <p className="mt-4 max-w-[34ch] font-serif-display text-[17px] leading-snug text-[#4a3b28]">{tip}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
