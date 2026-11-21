"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  "Get the app": installs Vex from the browser (PWA) on phone & PC.  */
/*  Chrome / Edge / Android: the browser's own install prompt.         */
/*  iPhone / iPad (Safari) and others: a short step-by-step guide.     */
/* ------------------------------------------------------------------ */

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type Platform = "ios" | "android" | "desktop";

interface Ctx {
  open: (target?: Platform) => void;
  installed: boolean;
  platform: Platform;
}

const InstallCtx = createContext<Ctx>({ open: () => {}, installed: false, platform: "desktop" });
export const useInstallApp = () => useContext(InstallCtx);

const STEPS: Record<Platform, React.ReactNode[]> = {
  ios: [
    <>Open this page in <b>Safari</b> and tap the <b>Share</b> button <Glyph d="M12 3v12M8 7l4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />.</>,
    <>Scroll down and tap <b>Add to Home Screen</b>.</>,
    <>Tap <b>Add</b>. Vex appears on your home screen.</>,
  ],
  android: [
    <>In Chrome, tap the <b>⋮</b> menu (top right).</>,
    <>Tap <b>Install app</b> (or <b>Add to Home screen</b>).</>,
    <>Confirm. Vex opens full-screen like any app.</>,
  ],
  desktop: [
    <>In Chrome or Edge, click the <b>install icon</b> <Glyph d="M3 4h18v13H3zM12 8v6M9 11l3 3 3-3M8 21h8" /> at the right of the address bar.</>,
    <>Or open the browser menu and choose <b>Install Vex</b>.</>,
    <>Vex opens in its own window with a desktop / dock icon.</>,
  ],
};

export function InstallAppProvider({ children }: { children: React.ReactNode }) {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [sheet, setSheet] = useState<Platform | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ua = navigator.userAgent;
    const ios =
      /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setPlatform(ios ? "ios" : /android/i.test(ua) ? "android" : "desktop");
    setInstalled(
      window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
      setSheet(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function open(target?: Platform) {
    const want = target ?? platform;
    // Use the browser's real install prompt when it's available for this device.
    if (deferred && want === platform) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    setSheet(want);
  }

  return (
    <InstallCtx.Provider value={{ open, installed, platform }}>
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {sheet && (
              <div
                className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center"
                role="dialog"
                aria-modal="true"
                aria-label="Install Vex"
              >
                <motion.button
                  type="button"
                  aria-label="Close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSheet(null)}
                  className="absolute inset-0 cursor-default bg-[#12222e]/45 backdrop-blur-[3px]"
                />
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="relative w-full max-w-[420px] rounded-t-[28px] bg-[#faf6ed] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[28px]"
                >
                  <div className="flex items-center gap-3.5">
                    <img src="/icons/icon-192.png" alt="" className="h-14 w-14 rounded-[14px] shadow-md" />
                    <div>
                      <p className="font-serif-display text-[24px] leading-tight text-[#212d3d]">
                        Install Vex {sheet === "desktop" ? "on your computer" : sheet === "ios" ? "on iPhone" : "on Android"}
                      </p>
                      <p className="text-[13px] text-[#5a6675]">Free · no app store · works offline</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 rounded-[12px] bg-[#ece6d8] p-1 text-[12px] font-semibold">
                    {(["ios", "android", "desktop"] as const).map((pf) => (
                      <button
                        key={pf}
                        type="button"
                        onClick={() => setSheet(pf)}
                        className={`cursor-pointer rounded-[9px] py-1.5 ${
                          sheet === pf ? "bg-white text-[#212d3d] shadow-sm" : "text-[#6f6a5f]"
                        }`}
                      >
                        {pf === "ios" ? "iPhone" : pf === "android" ? "Android" : "Computer"}
                      </button>
                    ))}
                  </div>

                  <ol className="mt-4 space-y-3 text-[14px] text-[#212d3d]">
                    {STEPS[sheet].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#212d3d] text-[11.5px] font-semibold text-[#faf6ed]">
                          {i + 1}
                        </span>
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ol>

                  <button
                    type="button"
                    onClick={() => setSheet(null)}
                    className="mt-5 w-full cursor-pointer rounded-full bg-[#212d3d] py-3 text-[14px] font-semibold text-[#faf6ed]"
                  >
                    Got it
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </InstallCtx.Provider>
  );
}

function Glyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mx-0.5 inline h-4 w-4 -translate-y-px"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/** Ready-made install button. Hides itself once Vex is installed. */
export function InstallAppButton({
  variant = "dark",
  target,
  label,
  className = "",
}: {
  variant?: "dark" | "light" | "glass" | "onDark";
  target?: Platform;
  label?: string;
  className?: string;
}) {
  const { open, installed, platform } = useInstallApp();
  if (installed && !target) return null;
  const text =
    label ??
    (target === "ios"
      ? "Get it for iPhone"
      : target === "android"
      ? "Get it for Android"
      : target === "desktop"
      ? "Get it for PC / Mac"
      : platform === "desktop"
      ? "Install desktop app"
      : "Get the app");
  const cls =
    variant === "dark"
      ? "bg-[#212d3d] text-[#faf6ed] hover:bg-[#33445c]"
      : variant === "light"
      ? "border border-[#cfc4a7] bg-white text-[#212d3d] hover:border-[#212d3d]"
      : variant === "onDark"
      ? "border border-white/25 text-[#faf6ed] hover:bg-white/10"
      : "border border-white/60 bg-white/55 text-[#212d3d] hover:bg-white/85";
  return (
    <button
      type="button"
      onClick={() => open(target)}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-colors ${cls} ${className}`}
    >
      <Glyph d="M12 3v12M7 10l5 5 5-5M5 21h14" />
      {text}
    </button>
  );
}
