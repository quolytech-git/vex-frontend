"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FIRST_24H_MILESTONES, type DashboardSectionId } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import { logEvent } from "@/lib/analytics";
import { GOTO_SECTION_EVENT } from "@/components/mobile/PersistentTabBar";
import { KitButton, Modal, Pill } from "./Kit";

/* ------------------------------------------------------------------ */
/*  24h Sprint — a guided path from sign-up to interview-ready.        */
/*  Each step is ticked from what the user has actually done, never    */
/*  from a timer (the windows are targets, not a countdown).           */
/* ------------------------------------------------------------------ */

export const OPEN_SPRINT_EVENT = "vex:open-sprint";

export function openSprint() {
  logEvent("quick_action_used", "24h-sprint");
  window.dispatchEvent(new Event(OPEN_SPRINT_EVENT));
}

function useSprintSteps() {
  const { profile, resumes, savedJobIds, diffs, applications, mockSessionsCount, skills } = useVexWorkspace();
  return useMemo(() => {
    const checks = [
      Boolean(profile.name && profile.targetRole),
      Boolean(profile.workMode && resumes.length > 0),
      savedJobIds.length >= 3,
      !diffs.some((d) => d.hasUnsupportedClaim && d.status === "pending") && applications.some((a) => a.coverLetterApproved),
      applications.some((a) => a.submissionState !== "prepared"),
      applications.some((a) => Boolean(a.followUpDate)) && mockSessionsCount > 0,
      mockSessionsCount >= 2 && skills.some((s) => s.evidenceTier === "Demonstrated in Vex" || s.evidenceTier === "Verified credential"),
    ];
    const hints = [
      "Add your name and target role.",
      "Confirm your work pattern and add a CV.",
      `Save ${Math.max(0, 3 - savedJobIds.length)} more job${3 - savedJobIds.length === 1 ? "" : "s"} you'd apply to.`,
      "Accept or reject the CV suggestions and approve one letter.",
      "Check the filled fields and submit one application yourself.",
      "Set a follow-up date and do your first practice answer.",
      "Do a second practice session and prove one skill.",
    ];
    const steps = FIRST_24H_MILESTONES.map((m, i) => ({ ...m, done: checks[i], hint: hints[i] }));
    const doneCount = steps.filter((s) => s.done).length;
    const next = steps.find((s) => !s.done);
    return { steps, doneCount, next };
  }, [profile, resumes, savedJobIds, diffs, applications, mockSessionsCount, skills]);
}

/** Mounted once in the dashboard layout; opens on OPEN_SPRINT_EVENT. */
export function SprintHost() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { steps, doneCount, next } = useSprintSteps();

  useEffect(() => {
    const o = () => setOpen(true);
    window.addEventListener(OPEN_SPRINT_EVENT, o);
    return () => window.removeEventListener(OPEN_SPRINT_EVENT, o);
  }, []);

  function go(section: DashboardSectionId) {
    setOpen(false);
    if (pathname === "/dashboard") window.dispatchEvent(new CustomEvent(GOTO_SECTION_EVENT, { detail: section }));
    else router.push(`/dashboard?section=${section}`);
  }

  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="24h Sprint" wide>
      <p className="-mt-2 text-[13.5px] text-[#5a6675]">From sign-up to interview-ready. Steps tick themselves as you complete them.</p>

      {/* Progress */}
      <div className="mt-4 rounded-[18px] bg-[#212d3d] p-4 text-[#faf6ed]">
        <div className="flex items-baseline justify-between">
          <span className="font-serif-display text-[30px] leading-none">{doneCount}/{steps.length}</span>
          <span className="text-[12px] text-[#faf6ed]/70">{next ? `Next: ${next.title}` : "Interview-ready ✓"}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
          <motion.div className="h-full rounded-full bg-[#e3cea0]" initial={false} animate={{ width: `${pct}%` }} />
        </div>
        {next && (
          <button
            type="button"
            onClick={() => go(next.section)}
            className="mt-4 w-full cursor-pointer rounded-full bg-[#faf6ed] py-2.5 text-[14px] font-semibold text-[#212d3d]"
          >
            Continue: {next.title}
          </button>
        )}
      </div>

      {/* Steps */}
      <ol className="mt-4 space-y-2">
        {steps.map((s, i) => {
          const current = next?.title === s.title;
          return (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => go(s.section)}
                className={`flex w-full cursor-pointer items-start gap-3 rounded-[16px] border p-3.5 text-left transition-colors ${
                  current ? "border-[#212d3d] bg-white" : "border-[#e3dccb] bg-white/70 hover:bg-white"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                    s.done ? "bg-[#067647] text-white" : current ? "bg-[#212d3d] text-[#faf6ed]" : "bg-[#f2eee2] text-[#7a705c]"
                  }`}
                >
                  {s.done ? "✓" : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[14.5px] font-semibold ${s.done ? "text-[#5a6675] line-through decoration-[#b4aa94]" : "text-[#212d3d]"}`}>{s.title}</span>
                    <Pill tone={s.done ? "good" : current ? "navy" : "neutral"}>{s.window}</Pill>
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-[#5a6675]">{s.done ? s.outcome : s.hint}</span>
                </span>
                <span className="mt-1 text-[#b4aa94]">›</span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-[11.5px] leading-snug text-[#7a705c]">
        Time windows are targets, not a countdown. Vex can get you ready — whether an employer replies or invites you is up to them.
      </p>
      <div className="mt-3 flex justify-end">
        <KitButton variant="light" onClick={() => setOpen(false)}>Close</KitButton>
      </div>
    </Modal>
  );
}

/** Compact button for the PC top bar and Home. */
export function SprintButton({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={openSprint}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#212d3d] font-semibold whitespace-nowrap text-[#faf6ed] transition-colors hover:bg-[#33445c] ${
        compact ? "px-3 py-1 text-[11px]" : "px-4 py-2 text-[13px]"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} fill="none" stroke="#e3cea0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
      </svg>
      24h Sprint
    </button>
  );
}
