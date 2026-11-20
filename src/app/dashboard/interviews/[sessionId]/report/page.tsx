"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";

export default function InterviewReportPage() {
  const params = useParams<{ sessionId: string }>();
  const { interviewSessions } = useVexWorkspace();
  const [turnModeFilter, setTurnModeFilter] = useState<string>("All");

  const report =
    interviewSessions.find((s) => s.id === params?.sessionId) ||
    interviewSessions[0];

  const avgStructure = report
    ? Math.round(
        report.turns.reduce((a, b) => a + b.structureScore, 0) /
          Math.max(1, report.turns.length)
      )
    : 85;
  const avgClarity = report
    ? Math.round(
        report.turns.reduce((a, b) => a + b.clarityScore, 0) /
          Math.max(1, report.turns.length)
      )
    : 84;
  const avgRelevance = report
    ? Math.round(
        report.turns.reduce((a, b) => a + b.relevanceScore, 0) /
          Math.max(1, report.turns.length)
      )
    : 82;

  const filteredTurns = (report?.turns || []).filter(
    (t) => turnModeFilter === "All" || t.mode === turnModeFilter
  );

  return (
    <DashboardSubpageFrame
      parentSection="interviews"
      parentLabel="Interview Studio"
      pageCode="07.2"
      pageTitle="Aristotle Interview Analytics Report"
      philosopherTag="Aristotle · Analytical Review"
    >
      <div className="space-y-6">
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <Eyebrow label={`Aristotle Performance Report · ${report.company}`} />
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] text-[#212d3d]">
                {report.roleTitle} — Readiness {report.overallScore}/100
              </h1>
              <p className="text-[13px] text-[#5a6675]">
                {report.mode} ({report.difficulty}) · {report.createdAt} ·{" "}
                {report.turns.length} recorded turn(s)
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href={`/dashboard/interviews/session/${report.applicationId}`}
                  className="rounded-full bg-[#212d3d] px-4 py-2 text-[12px] font-medium text-[#faf6ed]"
                >
                  Start New Session -&gt;
                </Link>
                <Link
                  href="/dashboard/learning/catalog"
                  className="rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12px] font-medium text-[#212d3d]"
                >
                  Train Gaps in Learning
                </Link>
              </div>
            </div>

            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              <div className="flex w-full max-w-[300px] items-center gap-3.5 rounded-[20px] border border-[#cfc2a5] bg-[#fffef9] p-3">
                <img
                  src="/images/aristotle-alexander-academy.jpg"
                  alt="Aristotle analyzing structured interview performance"
                  className="h-24 w-20 shrink-0 rounded-[12px] border border-[#cfc2a5] object-cover object-top"
                />
                <div className="space-y-1">
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                    Aristotle · Poetics &amp; Logic
                  </p>
                  <p className="text-[11.5px] leading-snug text-[#212d3d]">
                    “Excellence is a measured habit: sharpen structure, then trim excess.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNICATION & STRUCTURE BARS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "STAR Structure Rigor", score: avgStructure },
            { label: "Spoken Clarity & Conciseness", score: avgClarity },
            { label: "Role Relevance & Metrics", score: avgRelevance },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-[20px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-2"
            >
              <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                {m.label}
              </p>
              <p className="font-serif-display text-[36px] leading-none text-[#212d3d]">
                {m.score}%
              </p>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#efe7d5]">
                <div
                  className="h-full rounded-full bg-[#212d3d]"
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* TRANSCRIPT & TURN FEEDBACK + SESSION HISTORY */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif-display text-[22px] text-[#212d3d]">
                Session Transcript &amp; Rubric Feedback
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Behavioral", "Technical", "HR", "Company-specific"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTurnModeFilter(m)}
                    className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium ${
                      turnModeFilter === m
                        ? "bg-[#212d3d] text-[#faf6ed]"
                        : "border border-[#dad6ca] bg-[#faf6ed] text-[#5a6675]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {filteredTurns.length === 0 ? (
                <p className="rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] p-4 text-[13px] text-[#5a6675]">
                  No recorded turns match &ldquo;{turnModeFilter}&rdquo;. Switch back to All to inspect every answer.
                </p>
              ) : (
                filteredTurns.map((turn, i) => (
                <div
                  key={i}
                  className="rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[10.5px] font-semibold uppercase text-[#7a6b4e]">
                      Turn {i + 1} · {turn.mode} · {turn.wordCount} words
                    </span>
                    <StatusPill
                      label={`Structure ${turn.structureScore}% · Relevance ${turn.relevanceScore}%`}
                      tone="info"
                      dot={false}
                    />
                  </div>
                  <p className="font-serif-editorial text-[16px] text-[#212d3d]">
                    Q: {turn.question}
                  </p>
                  <p className="rounded-[12px] bg-white p-3 text-[13px] text-[#212d3d]">
                    {turn.answer}
                  </p>
                  <p className="text-[12px] font-medium text-[#067647]">
                    Aristotle Feedback: {turn.feedbackNote}
                  </p>
                </div>
              ))
              )}
            </div>
          </section>

          <aside className="space-y-3 rounded-[22px] border border-[#dad6ca] bg-[#f4efe3] p-5 lg:col-span-4">
            <h3 className="font-serif-display text-[20px] text-[#212d3d]">
              Recorded Sessions ({interviewSessions.length})
            </h3>
            <div className="space-y-2">
              {interviewSessions.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/interviews/${s.id}/report`}
                  className={`block rounded-[14px] border p-3 text-[12px] ${
                    s.id === report.id
                      ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                      : "border-[#dfd4be] bg-white text-[#212d3d]"
                  }`}
                >
                  <p className="font-medium">
                    {s.company} · {s.overallScore}/100
                  </p>
                  <p className="font-mono text-[10px] opacity-80">
                    {s.mode} · {s.createdAt}
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
