"use client";

import React, { useState } from "react";
import {
  INITIAL_OFFER_COMPARISONS,
  SOURCED_CAREER_BENCHMARKS,
} from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { StatusPill } from "@/components/dashboard/StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";

export default function CareerAndMarketIntelligencePage() {
  const { jobs, savedJobIds, applications, interviewSessions, skills } =
    useVexWorkspace();

  const [selectedRoleA, setSelectedRoleA] = useState(
    SOURCED_CAREER_BENCHMARKS[0]?.id || "bm-1"
  );
  const [selectedRoleB, setSelectedRoleB] = useState(
    SOURCED_CAREER_BENCHMARKS[1]?.id || "bm-2"
  );
  const [cohortRange, setCohortRange] = useState<"2025-2026" | "90-day">("2025-2026");

  // Honest conversion metrics computed strictly from workspace arrays
  const discoveredCount = jobs.length;
  const savedCount = savedJobIds.length;
  const submittedCount = applications.filter(
    (a) => a.submissionState !== "prepared"
  ).length;
  const interviewCount = applications.filter((a) => a.interviewDate).length;

  const bmA =
    SOURCED_CAREER_BENCHMARKS.find((b) => b.id === selectedRoleA) ||
    SOURCED_CAREER_BENCHMARKS[0];
  const bmB =
    SOURCED_CAREER_BENCHMARKS.find((b) => b.id === selectedRoleB) ||
    SOURCED_CAREER_BENCHMARKS[1];

  return (
    <DashboardSubpageFrame
      parentSection="overview"
      parentLabel="Agora Home"
      pageCode="12.1"
      pageTitle="Apollo Career & Market Intelligence"
      philosopherTag="Apollo · Foresight & Direction"
    >
      <div className="space-y-6">
        <MobilePhilosopherPill
          name="Apollo"
          role="Foresight & Benchmarks"
          image="/images/apollo-career-oracle.jpg"
          quote="Measure every horizon against dated evidence, never conjecture."
          guidance={`${discoveredCount} indexed roles · ${submittedCount} confirmed submissions. All benchmarks below use cited demonstration datasets.`}
        />

        {/* HERO WITH APOLLO ARTWORK */}
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label="Apollo Oracle · Sourced Benchmarks & Funnel Math" />
                <StatusPill
                  label="Seeded Demonstration Data · Cited Sources"
                  tone="info"
                  dot={false}
                />
                <div className="inline-flex rounded-full border border-[#cfc2a5] bg-white p-0.5 text-[11px]">
                  {(
                    [
                      { id: "2025-2026", label: "2025–2026 Annual" },
                      { id: "90-day", label: "90-Day Cohort" },
                    ] as const
                  ).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setCohortRange(r.id)}
                      className={`cursor-pointer rounded-full px-3 py-0.5 font-medium ${
                        cohortRange === r.id ? "bg-[#212d3d] text-[#faf6ed]" : "text-[#5a6675]"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.7rem)] text-[#212d3d]">
                Career &amp;{" "}
                <span className="font-serif-calligraphic text-[#5a6675]">
                  Market Intelligence.
                </span>
              </h1>
              <p className="max-w-[64ch] text-[13px] text-[#5a6675]">
                Compare long-term salary ranges with source citations, track real
                conversion from your own saved roles to interviews, and evaluate
                career track trade-offs cleanly.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Jobs Indexed", value: String(discoveredCount) },
                  { label: "Saved Shortlist", value: String(savedCount) },
                  { label: "Confirmed Submits", value: String(submittedCount) },
                  {
                    label: "Active Interviews",
                    value: `${interviewCount} (${interviewSessions.length} mocks)`,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[14px] border border-[#dfd4be] bg-white p-3"
                  >
                    <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-serif-display text-[24px] leading-none text-[#212d3d]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden justify-start lg:col-span-4 lg:flex lg:justify-end">
              <div className="w-full max-w-[295px] overflow-hidden rounded-t-[140px] rounded-b-[18px] border border-[#cfc2a5] bg-[#e9e0cc] shadow-sm">
                <img
                  src="/images/apollo-career-oracle.jpg"
                  alt="Apollo holding constellation scroll and sundial"
                  className="aspect-[4/3.6] w-full object-cover object-top"
                />
                <div className="border-t border-[#d8cbb0] bg-[#fffef9] px-4 py-2.5">
                  <p className="font-mono text-[9.5px] font-semibold uppercase text-[#7a6b4e]">
                    Apollo · Vision &amp; Trajectory
                  </p>
                  <p className="text-[11.5px] text-[#212d3d]">
                    “Measure every horizon against dated evidence, never conjecture.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOURCED SALARY & SKILL BENCHMARKS + CAREER PATH COMPARISON */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-7">
            <h2 className="font-serif-display text-[22px] text-[#212d3d]">
              Sourced Salary &amp; Role Benchmarks
            </h2>
            <div className="space-y-3">
              {SOURCED_CAREER_BENCHMARKS.map((bm) => (
                <div
                  key={bm.id}
                  className="rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[14.5px] font-medium text-[#212d3d]">
                      {bm.roleFamily}
                    </p>
                    <StatusPill label={bm.yoyDemand} tone="success" dot={false} />
                  </div>
                  <p className="text-[13px] text-[#212d3d]">
                    Median: <strong>{bm.medianUkSalary}</strong> · 75th
                    Percentile: <strong>{bm.p75UkSalary}</strong>
                  </p>
                  <p className="text-[12px] text-[#5a6675]">
                    Top requested capabilities: {bm.topSkills.join(" · ")}
                  </p>
                  <p className="font-mono text-[10.5px] text-[#7a6b4e]">
                    Source: {bm.sourceName} · Published: {bm.sourceDate}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-5 lg:col-span-5">
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#f4efe3] p-5 space-y-3">
              <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                Career Path Comparison
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <select id="page-select-1" name="page-select-1" aria-label="page select 1"
                  value={selectedRoleA}
                  onChange={(e) => setSelectedRoleA(e.target.value)}
                  className="rounded-[10px] border border-[#cfc2a5] bg-white px-2.5 py-1.5 text-[11.5px]"
                >
                  {SOURCED_CAREER_BENCHMARKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.roleFamily}
                    </option>
                  ))}
                </select>
                <select id="page-select-2" name="page-select-2" aria-label="page select 2"
                  value={selectedRoleB}
                  onChange={(e) => setSelectedRoleB(e.target.value)}
                  className="rounded-[10px] border border-[#cfc2a5] bg-white px-2.5 py-1.5 text-[11.5px]"
                >
                  {SOURCED_CAREER_BENCHMARKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.roleFamily}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-[12px]">
                {[bmA, bmB].map((path, i) => (
                  <div
                    key={path.id + i}
                    className="rounded-[14px] border border-[#dfd4be] bg-white p-3 space-y-1"
                  >
                    <p className="font-medium text-[#212d3d]">
                      {path.roleFamily.split(" (")[0]}
                    </p>
                    <p className="font-serif-display text-[22px] text-[#212d3d]">
                      {path.medianUkSalary}
                    </p>
                    <p className="font-mono text-[10px] text-[#067647]">
                      {path.yoyDemand}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-2.5">
              <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                Offer Benchmark Matrix ({INITIAL_OFFER_COMPARISONS.length})
              </h3>
              {INITIAL_OFFER_COMPARISONS.map((o) => (
                <div
                  key={o.id}
                  className="rounded-[12px] border border-[#e3dac5] bg-[#faf6ed] p-3 text-[12px]"
                >
                  <p className="font-medium text-[#212d3d]">
                    {o.company} — £{o.baseSalary.toLocaleString()}
                  </p>
                  <p className="text-[#5a6675]">
                    {o.bonusOrEquity} · {o.arrangement}
                  </p>
                </div>
              ))}
              <p className="font-mono text-[10.5px] text-[#7a6b4e]">
                Your verified profile track: {skills.filter((s) => !s.isMandatoryGap).length}/{skills.length} non-gap skills confirmed.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
