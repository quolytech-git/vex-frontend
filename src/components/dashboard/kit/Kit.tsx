"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Shared dashboard kit: cards, states, score explanations, dialogs.  */
/*  Palladio tokens: cream #faf6ed, navy #212d3d, line #e3dccb,        */
/*  muted #5a6675. Works the same on PC and phone.                     */
/* ------------------------------------------------------------------ */

export function KitCard({
  title,
  eyebrow,
  action,
  children,
  className = "",
  tone = "light",
}: {
  title?: React.ReactNode;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "cream" | "dark";
}) {
  const bg =
    tone === "dark"
      ? "bg-[#212d3d] text-[#faf6ed] border-transparent"
      : tone === "cream"
      ? "bg-[#f2eee2] border-[#e3dccb]"
      : "bg-white border-[#e3dccb]";
  return (
    <section className={`vex-kit rounded-[22px] border p-5 sm:p-6 ${bg} ${className}`}>
      {(title || eyebrow || action) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <p
                className={`text-[10.5px] font-semibold tracking-[0.14em] uppercase ${
                  tone === "dark" ? "text-[#faf6ed]/60" : "text-[#7a705c]"
                }`}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h3 className={`mt-0.5 font-serif-display text-[22px] leading-tight ${tone === "dark" ? "" : "text-[#212d3d]"}`}>
                {title}
              </h3>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "info" | "navy";
}) {
  const cls = {
    neutral: "bg-[#f2eee2] text-[#5a6675]",
    good: "bg-[#067647]/10 text-[#067647]",
    warn: "bg-[#b54708]/10 text-[#b54708]",
    bad: "bg-[#b42318]/10 text-[#b42318]",
    info: "bg-[#175cd3]/10 text-[#175cd3]",
    navy: "bg-[#212d3d] text-[#faf6ed]",
  }[tone];
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap ${cls}`}>
      {children}
    </span>
  );
}

export function KitButton({
  children,
  onClick,
  variant = "dark",
  type = "button",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "dark" | "light" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const cls = {
    dark: "bg-[#212d3d] text-[#faf6ed] hover:bg-[#33445c]",
    light: "border border-[#d6cbb2] bg-white text-[#212d3d] hover:border-[#212d3d]",
    ghost: "text-[#5a6675] hover:text-[#212d3d]",
    danger: "bg-[#b42318] text-white hover:bg-[#912018]",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${cls} ${className}`}
    >
      {children}
    </button>
  );
}

/* ----------------------------- States ----------------------------- */

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#d6cbb2] bg-[#faf6ed] px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f2eee2] text-[#7a705c]">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 7h16v12H4zM4 7l2-3h12l2 3M9 12h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="mt-3 font-serif-display text-[21px] text-[#212d3d]">{title}</p>
      <p className="mx-auto mt-1 max-w-[42ch] text-[13.5px] leading-snug text-[#5a6675]">{text}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function LoadingRows({ rows = 3, label = "Loading" }: { rows?: number; label?: string }) {
  return (
    <div role="status" aria-live="polite" className="space-y-2.5">
      <span className="sr-only">{label}…</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-[16px] bg-[#f2eee2] p-4">
          <div className="h-3 w-2/5 rounded-full bg-[#e3dccb]" />
          <div className="mt-2.5 h-2.5 w-4/5 rounded-full bg-[#ebe4d4]" />
        </div>
      ))}
      <p className="text-center text-[12px] text-[#7a705c]">{label}…</p>
    </div>
  );
}

export function ErrorState({
  title = "We couldn't load this",
  text = "Your work is saved. Try again, or continue with what you have.",
  onRetry,
}: {
  title?: string;
  text?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="rounded-[18px] border border-[#b42318]/20 bg-[#b42318]/5 p-4">
      <p className="text-[14px] font-semibold text-[#b42318]">{title}</p>
      <p className="mt-0.5 text-[13px] text-[#5a6675]">{text}</p>
      {onRetry && (
        <div className="mt-3">
          <KitButton onClick={onRetry}>Retry</KitButton>
        </div>
      )}
    </div>
  );
}

/* --------------------------- Score info --------------------------- */

/** Small (i) button that explains what a number means — and what it doesn't. */
export function ScoreInfo({
  label,
  means,
  notMeans,
  dark = false,
}: {
  label: string;
  means: string;
  notMeans: string;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span
        role="button"
        tabIndex={0}
        aria-label={`What does ${label} mean?`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }
        }}
        className={`ml-1 inline-flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full align-middle text-[10.5px] font-bold ${
          dark ? "bg-white/15 text-[#faf6ed]" : "bg-[#212d3d]/10 text-[#212d3d]"
        }`}
      >
        i
      </span>
      <Modal open={open} onClose={() => setOpen(false)} title={label}>
        <div className="space-y-3 text-[14px] leading-snug">
          <div className="rounded-[14px] bg-[#067647]/8 p-3">
            <p className="text-[11px] font-semibold tracking-[0.1em] text-[#067647] uppercase">It means</p>
            <p className="mt-1 text-[#212d3d]">{means}</p>
          </div>
          <div className="rounded-[14px] bg-[#b42318]/6 p-3">
            <p className="text-[11px] font-semibold tracking-[0.1em] text-[#b42318] uppercase">It does not mean</p>
            <p className="mt-1 text-[#212d3d]">{notMeans}</p>
          </div>
        </div>
      </Modal>
    </>
  );
}

export const SCORE_DEFINITIONS: { label: string; means: string; notMeans: string }[] = [
  {
    label: "Readiness score",
    means: "How many of the 7 first-day readiness checks you have completed (profile, jobs, CV, applications, interview practice).",
    notMeans: "Your chance of getting an interview or a job.",
  },
  {
    label: "Match %",
    means: "The share of a job's listed requirements that your profile has evidence for, weighted towards must-haves.",
    notMeans: "A prediction that the employer will reply or hire you.",
  },
  {
    label: "CV quality",
    means: "How many of Vex's CV checks pass: contact, focused summary, concrete bullets, enough verified skills, no unsupported claims.",
    notMeans: "How a recruiter will rate your CV.",
  },
  {
    label: "ATS score",
    means: "How readable your CV is for applicant tracking systems: one column, standard headings, extractable text.",
    notMeans: "That an ATS will rank you highly for a specific job.",
  },
  {
    label: "Interview answer scores",
    means: "Structure, clarity and relevance of one practice answer, checked against the STAR outline.",
    notMeans: "How a real interviewer will judge you.",
  },
  {
    label: "Skill level",
    means: "Vex's estimate from the evidence shown next to it (self-reported, CV, demonstrated in Vex, or verified).",
    notMeans: "A certified or professionally verified level, unless it says Verified.",
  },
];

/* ----------------------------- Modal ------------------------------ */

/** Centred dialog on PC, bottom sheet on phone. */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[130] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#12222e]/45 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className={`relative max-h-[88vh] w-full overflow-y-auto rounded-t-[26px] bg-[#faf6ed] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[26px] sm:p-6 ${
              wide ? "sm:max-w-[640px]" : "sm:max-w-[460px]"
            }`}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#212d3d]/15 sm:hidden" />
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 className="font-serif-display text-[24px] leading-tight text-[#212d3d]">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#ece9df] text-[16px] text-[#212d3d]"
              >
                ×
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ------------------ Sample-data banner + sync status ----------------- */

const DEMO_KEY = "vex_demo_banner_hidden";

export function SampleDataBanner() {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    try {
      setHidden(sessionStorage.getItem(DEMO_KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);
  if (hidden) return null;
  return (
    <div className="mb-4 flex items-start gap-3 rounded-[16px] border border-[#b54708]/25 bg-[#fef6e7] px-4 py-3 text-[13px] text-[#7a3d06]">
      <span className="mt-0.5 rounded-full bg-[#b54708] px-2 py-0.5 text-[10.5px] font-bold tracking-[0.08em] text-white uppercase">
        Sample data
      </span>
      <p className="min-w-0 flex-1 leading-snug">
        Jobs, applications and scores here are examples so you can explore Vex. Nothing has been submitted to a real employer.
      </p>
      <button
        type="button"
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem(DEMO_KEY, "1");
          } catch {
            /* ignore */
          }
        }}
        className="shrink-0 cursor-pointer text-[12px] font-semibold underline underline-offset-2"
      >
        Got it
      </button>
    </div>
  );
}

export function SyncIndicator({ className = "" }: { className?: string }) {
  const [online, setOnline] = useState(true);
  const [time, setTime] = useState("");
  useEffect(() => {
    const stamp = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    stamp();
    const t = window.setInterval(stamp, 30000);
    const on = () => setOnline(navigator.onLine);
    on();
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => {
      window.clearInterval(t);
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${
        online ? "bg-[#067647]/10 text-[#067647]" : "bg-[#b54708]/10 text-[#b54708]"
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-[#067647]" : "bg-[#b54708]"}`} />
      {online ? `Saved on this device · ${time}` : "Offline · changes saved on this device"}
    </span>
  );
}
