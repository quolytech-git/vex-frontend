"use client";

import { useEffect, useRef } from "react";

/** Actions the mobile "+" button (and other shortcuts) can ask a page to open. */
export type QuickAction =
  | "ask-ai"
  | "tailor-cv"
  | "log-application"
  | "practice-interview"
  | "learn-skill"
  | "add-contact";

const EVT = "vex:quick-action";
let pending: QuickAction | null = null;

/** Queue an action; the page that handles it runs it when it mounts (or now, if mounted). */
export function triggerQuickAction(action: QuickAction) {
  pending = action;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVT, { detail: action }));
  }
}

/** Run `handler` when `action` is triggered — including one queued just before this page mounted. */
export function useQuickAction(action: QuickAction, handler: () => void) {
  const ref = useRef(handler);
  ref.current = handler;

  useEffect(() => {
    const run = () => {
      pending = null;
      // Let the page paint first so scroll/focus targets exist.
      window.setTimeout(() => ref.current(), 120);
    };
    if (pending === action) run();
    const onEvt = (e: Event) => {
      if ((e as CustomEvent<QuickAction>).detail === action) run();
    };
    window.addEventListener(EVT, onEvt);
    return () => window.removeEventListener(EVT, onEvt);
  }, [action]);
}

/** Scroll an element into view and focus it. */
export function focusField(selector: string) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.focus({ preventScroll: true });
}
