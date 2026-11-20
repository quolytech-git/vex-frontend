"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import VexApplyNav from "@/components/dashboard/VexApplyNav";
import { StatusPill } from "@/components/dashboard/StatusBadge";

const LESSONS = [
  {
    id: "tut-1",
    title: "01 · Connect & Prepare Baseline Packet",
    summary:
      "Select the verified application draft, tailored Leonardo resume variant, and Cicero cover letter inside Vex Apply before opening any ATS tab.",
    checklist: [
      "Ensure mandatory profile fields are accurate.",
      "Pick a tailored resume version aligned to job keywords.",
    ],
  },
  {
    id: "tut-2",
    title: "02 · Supervised Prefill Inside Employer Form",
    summary:
      "On Greenhouse or Lever forms, Hermes fills only confirmed fields (name, email, links, portfolio, attested skills). Screening essays remain blank for your own writing.",
    checklist: [
      "Unknown custom questions trigger an automatic Amber Pause.",
      "Never populates unverified skills onto forms.",
    ],
  },
  {
    id: "tut-3",
    title: "03 · Pre-Submit Human Review & Honest Ledger Sync",
    summary:
      "Confirm every populated value before clicking Submit on the employer portal. Only after explicit confirmation does Vex move the role from Prepared to Submitted.",
    checklist: [
      "Prepared state never masquerades as Submitted.",
      "Interrupted timeouts save answers locally for recovery.",
    ],
  },
];

export default function VexApplyTutorialPage() {
  const { applications } = useVexWorkspace();
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const current = LESSONS[activeLessonIdx];
  const sampleApp = applications[0];

  return (
    <DashboardSubpageFrame
      parentSection="applications"
      parentLabel="Vex Apply Hub"
      pageCode="05.5"
      pageTitle="Vex Apply · Workflow Tutorial"
      philosopherTag="Hermes · Supervised Practice"
    >
      <div className="space-y-6">
        <VexApplyNav active="tutorial" sessionId={sampleApp?.id || "app-1"} />

        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Eyebrow label="Interactive Confirm-First Workflow Walkthrough" />
            <StatusPill
              label={`Lesson ${activeLessonIdx + 1} of ${LESSONS.length}`}
              tone="navy"
              dot={false}
            />
          </div>
          <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.5rem)] text-[#212d3d]">
            Master{" "}
            <span className="font-serif-calligraphic text-[#5a6675]">
              Confirm-First Submissions.
            </span>
          </h1>
          <p className="max-w-[66ch] text-[13px] text-[#5a6675]">
            Learn how Hermes speeds up repetitive ATS fields while keeping final
            judgment and truth checks firmly in your hands.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="space-y-2.5 lg:col-span-4">
            {LESSONS.map((lesson, idx) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setActiveLessonIdx(idx)}
                className={`w-full cursor-pointer rounded-[18px] border p-4 text-left transition-all ${
                  idx === activeLessonIdx
                    ? "border-[#212d3d] bg-white shadow-sm"
                    : "border-[#dad6ca] bg-[#faf6ed]"
                }`}
              >
                <p className="font-serif-display text-[19px] text-[#212d3d]">
                  {lesson.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[12px] text-[#5a6675]">
                  {lesson.summary}
                </p>
              </button>
            ))}
          </aside>

          <section className="space-y-4 rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-8">
            <h2 className="font-serif-display text-[24px] text-[#212d3d]">
              {current.title}
            </h2>
            <p className="text-[13.5px] leading-relaxed text-[#212d3d]">
              {current.summary}
            </p>
            <div className="space-y-2 rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4">
              <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                Key Principles
              </p>
              {current.checklist.map((item) => (
                <p key={item} className="text-[12.5px] text-[#212d3d]">
                  • {item}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={activeLessonIdx === 0}
                  onClick={() => setActiveLessonIdx((i) => Math.max(0, i - 1))}
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-4 py-1.5 text-[12px] disabled:opacity-40"
                >
                  Previous Lesson
                </button>
                <button
                  type="button"
                  disabled={activeLessonIdx >= LESSONS.length - 1}
                  onClick={() =>
                    setActiveLessonIdx((i) => Math.min(LESSONS.length - 1, i + 1))
                  }
                  className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] text-[#faf6ed] disabled:opacity-40"
                >
                  Next Lesson
                </button>
              </div>
              <Link
                href={`/dashboard/apply/review/${sampleApp?.id || "app-1"}`}
                className="rounded-full border border-[#212d3d] bg-white px-4 py-1.5 text-[12px] font-medium text-[#212d3d] hover:bg-[#212d3d] hover:text-[#faf6ed]"
              >
                Try Live Pre-Submit Review -&gt;
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
