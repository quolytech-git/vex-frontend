"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type DailyPlanTask,
  type DashboardApplication,
  type DashboardJob,
  type DashboardSectionId,
  FIRST_24H_MILESTONES,
  INITIAL_OFFER_COMPARISONS,
  MARKET_DEMAND_BENCHMARKS,
  type OnboardingProfileState,
  PHILOSOPHER_COUNCIL,
  type SubscriptionPlan,
} from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { ArrowRightIcon, CheckIcon, VexLogoMark } from "@/components/Icons";
import {
  OverviewPrepBarCanvas,
  OverviewReadinessLineCanvas,
  OverviewVelocityCanvas,
} from "./OverviewCanvasCharts";
import { StatusPill, SubmissionStateBadge } from "./StatusBadge";

interface DashboardOverviewProps {
  profile: OnboardingProfileState;
  plan: SubscriptionPlan;
  jobs: DashboardJob[];
  savedJobIds: string[];
  hiddenJobIds: string[];
  applications: DashboardApplication[];
  unresolvedFlagsCount: number;
  mockSessionsCount: number;
  dailyTasks: DailyPlanTask[];
  onToggleTask: (id: string) => void;
  onNavigate: (section: DashboardSectionId) => void;
  onLogInvitation: (company: string, role: string, dateText: string) => void;
}

export default function DashboardOverview({
  profile,
  plan,
  jobs,
  savedJobIds,
  hiddenJobIds,
  applications,
  unresolvedFlagsCount,
  mockSessionsCount,
  dailyTasks,
  onToggleTask,
  onNavigate,
  onLogInvitation,
}: DashboardOverviewProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteCompany, setInviteCompany] = useState("Northbridge Systems");
  const [inviteDate, setInviteDate] = useState("Thu 19 Nov · 14:00 GMT");
  const [inviteLogged, setInviteLogged] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [activeSageIndex, setActiveSageIndex] = useState(0);
  const [lowerTab, setLowerTab] = useState<"execution" | "audit" | "academy">(
    "execution"
  );

  const activeSage = PHILOSOPHER_COUNCIL[activeSageIndex];
  const visibleJobs = jobs.filter((j) => !hiddenJobIds.includes(j.id));
  const preparedApps = applications.filter(
    (a) => a.submissionState === "prepared"
  );
  const submittedApps = applications.filter(
    (a) => a.submissionState !== "prepared"
  );
  const verifiedSubmittedCount = applications.filter(
    (a) => a.submissionState === "verified-submitted"
  ).length;
  const userReportedCount = applications.filter(
    (a) => a.submissionState === "user-reported-submitted"
  ).length;
  const upcomingInterviews = applications.filter((a) => a.interviewDate);
  const profileReady = Boolean(profile.targetRole.trim());

  const completedTasksCount = dailyTasks.filter((t) => t.done).length;
  const careerMomentumScore = Math.min(
    96,
    62 +
      completedTasksCount * 4 +
      mockSessionsCount * 3 +
      submittedApps.length * 4
  );
  const applicationQualityScore = unresolvedFlagsCount === 0 ? 94 : 81;
  const avgCompatibility =
    visibleJobs.length > 0
      ? Math.round(
          visibleJobs.reduce((acc, j) => acc + j.compatibilityScore, 0) /
            visibleJobs.length
        )
      : 87;

  const weeklyFocusMinutes = 160 + mockSessionsCount * 26;
  const shortlistRatio = Math.min(
    100,
    Math.round((savedJobIds.length / Math.max(1, visibleJobs.length)) * 100)
  );
  const cvProofRatio = unresolvedFlagsCount === 0 ? 94 : 78;

  const prepDays = [
    { day: "Mon", mins: 25 },
    { day: "Tue", mins: 32 },
    { day: "Wed", mins: 38 },
    { day: "Thu", mins: 42 },
    { day: "Fri", mins: 45 + mockSessionsCount * 8, active: true },
    { day: "Sat", mins: 36 },
    { day: "Sun", mins: 28 },
  ];

  const readinessRows = [
    {
      question: "Is my profile ready?",
      status: profileReady ? "Ready for applying" : "In progress",
      tone: (profileReady ? "success" : "warning") as "success" | "warning",
      evidence: profile.targetRole
        ? `Target: ${profile.targetRole} · Baseline confirmed`
        : "Required target role field needs confirmation",
      target: "profile" as DashboardSectionId,
    },
    {
      question: "Have I found relevant opportunities?",
      status: `Found (${visibleJobs.length}) · Shortlisted (${savedJobIds.length})`,
      tone: "info" as const,
      evidence: `${avgCompatibility}% avg compatibility across deduplicated boards`,
      target: "jobs" as DashboardSectionId,
    },
    {
      question: "Which applications are ready to complete?",
      status: `Prepared (${preparedApps.length}) · Needs review`,
      tone: "warning" as const,
      evidence: "CV diffs & screening fields wait for your explicit approval",
      target: "applications" as DashboardSectionId,
    },
    {
      question: "Which applications are genuinely submitted?",
      status: `Verified (${verifiedSubmittedCount}) · Self (${userReportedCount})`,
      tone:
        verifiedSubmittedCount > 0 ? ("navy" as const) : ("neutral" as const),
      evidence: "Prepared drafts are never counted as submitted applications",
      target: "applications" as DashboardSectionId,
    },
    {
      question: "What needs my approval today?",
      status: `${unresolvedFlagsCount + preparedApps.length} awaiting check`,
      tone: "warning" as const,
      evidence: `${unresolvedFlagsCount} CV check(s) · 1 screening question`,
      target: "documents" as DashboardSectionId,
    },
    {
      question: "Am I making measurable interview progress?",
      status: `${upcomingInterviews.length} scheduled · ${mockSessionsCount} mock done`,
      tone: "success" as const,
      evidence:
        upcomingInterviews[0]?.interviewDate ||
        "Next mock practice queued today",
      target: "interviews" as DashboardSectionId,
    },
    {
      question: "What skills should I improve next?",
      status: "2 priority gaps identified",
      tone: "info" as const,
      evidence: "SQL cohorts (3 roles) · API error recovery (2 roles)",
      target: "learning" as DashboardSectionId,
    },
  ];

  function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogInvitation(inviteCompany, "Candidate Invitation", inviteDate);
    setInviteLogged(true);
    setInviteOpen(false);
    setTimeout(() => setInviteLogged(false), 3500);
  }

  return (
    <div className="space-y-6">
      {/* 1. TRAVERTINE ALABASTER HEADER BAR (Preserves Signature Style + New Fonts) */}
      <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-[#cfc4a7]/90 bg-gradient-to-b from-[#faf6ed]/92 to-[#efe7d5]/86 p-6 shadow-[0_16px_44px_-14px_rgba(33,45,61,0.14)] ring-1 ring-white/80 backdrop-blur-xl lg:flex-row lg:items-end lg:px-8 lg:py-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] text-[#6c624d]">
            <span className="font-serif-caps text-[10px]">VEX · AGORA COMMAND</span>
            <span className="rounded-full border border-[#cfc4a7] bg-[#faf6ed] px-2.5 py-0.5 text-[10px] font-semibold text-[#212d3d]">
              {plan.toUpperCase()}
            </span>
            <span className="hidden items-center gap-1.5 text-[#067647] sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#067647]" />
              TELEMETRY_LIVE
            </span>
          </div>
          <h1 className="mt-1 font-serif-display text-[clamp(2.3rem,3.8vw,3.35rem)] leading-[1.03] tracking-[-0.02em] text-[#212d3d]">
            Career <span className="font-serif-calligraphic text-[#6c624d]">Readiness</span>{" "}
            <span className="font-serif-editorial">Performance</span>
          </h1>
        </div>

      </div>

      {/* Conditional Quick Drawers */}
      {inviteOpen && (
        <form
          onSubmit={handleInviteSubmit}
          className="grid grid-cols-1 gap-3 rounded-[22px] border border-[#dad6ca] bg-white p-4 sm:grid-cols-3 sm:items-end"
        >
          <div>
            <label className="text-[11.5px] font-medium text-[#5a6675]">
              Company
            </label>
            <input
              value={inviteCompany}
              onChange={(e) => setInviteCompany(e.target.value)}
              className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13.5px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11.5px] font-medium text-[#5a6675]">
              Date &amp; time
            </label>
            <input
              value={inviteDate}
              onChange={(e) => setInviteDate(e.target.value)}
              className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13.5px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-2.5 text-[13px] font-medium text-[#faf6ed] hover:bg-[#33445c]"
          >
            Save interview event
          </button>
        </form>
      )}

      {inviteLogged && (
        <div className="rounded-[16px] border border-[#067647]/30 bg-[#067647]/10 px-4 py-2.5 text-[13px] text-[#067647]">
          Recorded interview invitation into Tracker &amp; Interview Prep.
        </div>
      )}

      {showOffersModal && (
        <div className="rounded-[24px] border border-[#212d3d]/20 bg-white p-5">
          <div className="flex items-center justify-between gap-2 border-b border-[#dad6ca] pb-3">
            <div>
              <Eyebrow label="Section 22 · Offer Comparison" />
              <h2 className="mt-0.5 font-serif-display text-[22px] text-[#212d3d]">
                Side-by-Side Offer Benchmark
              </h2>
            </div>
            <StatusPill label="Transparent math" tone="neutral" dot={false} />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-[#dad6ca] text-[10.5px] uppercase tracking-[0.06em] text-[#5a6675]">
                  <th className="py-2 pr-4">Company &amp; Role</th>
                  <th className="py-2 pr-4">Base Salary</th>
                  <th className="py-2 pr-4">Bonus / Equity</th>
                  <th className="py-2 pr-4">Mode / Commute</th>
                  <th className="py-2">Growth &amp; Benefits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece9df]">
                {INITIAL_OFFER_COMPARISONS.map((row) => (
                  <tr key={row.id}>
                    <td className="py-2.5 pr-4 font-medium text-[#212d3d]">
                      {row.company}
                      <span className="block text-[11.5px] font-normal text-[#5a6675]">
                        {row.role}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 font-medium text-[#212d3d]">
                      £{row.baseSalary.toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-4 text-[#5a6675]">
                      {row.bonusOrEquity}
                    </td>
                    <td className="py-2.5 pr-4 text-[#5a6675]">
                      {row.arrangement} · {row.commuteMinutes}m commute
                    </td>
                    <td className="py-2.5 text-[#5a6675]">
                      <span className="text-[#212d3d]">{row.growthFit}</span>
                      <span className="block text-[11px]">
                        {row.benefitsNote}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SIGNATURE 5-CARD BENTO GRID WITH REAL INTERACTIVE CANVAS CHARTS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT TALL ORACLE CARD */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative flex min-h-[670px] flex-col justify-between overflow-hidden rounded-[34px] border border-[#cfc4a7]/90 bg-[#212d3d]/90 p-7 text-[#faf6ed] shadow-[0_26px_68px_-12px_rgba(20,30,41,0.3)] ring-1 ring-white/40 backdrop-blur-xl lg:col-span-4 lg:p-8"
        >
          <img
            src="/images/raphael-athens.jpg"
            alt="School of Athens colonnade atmosphere"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-26 mix-blend-luminosity"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(33,45,61,0.82) 0%, rgba(45,64,82,0.42) 44%, rgba(28,39,52,0.88) 100%)",
            }}
          />

          {/* Top Bar */}
          <div className="relative z-10 flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#a9c4e6]">
                NODE://ORACLE_01 · {plan.toUpperCase()}
              </p>
              <p className="mt-0.5 font-serif-display text-[28px] leading-tight text-[#faf6ed]">
                {activeSage.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setActiveSageIndex((i) => (i + 1) % PHILOSOPHER_COUNCIL.length)
              }
              className="cursor-pointer rounded-full border border-white/30 bg-white/12 px-3.5 py-1.5 font-mono text-[10.5px] font-medium tracking-[0.06em] text-[#faf6ed] backdrop-blur-md transition-all hover:bg-white/25"
            >
              CYCLE
            </button>
          </div>

          {/* Floating Oracle Bust */}
          <div className="relative z-10 mx-auto my-2 flex h-[290px] w-[290px] items-center justify-center">
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
              viewBox="0 0 260 260"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <circle
                cx="130"
                cy="130"
                r="122"
                stroke="#faf6ed"
                strokeOpacity="0.34"
                strokeWidth="1.2"
                strokeDasharray="5 6"
              />
              <circle
                cx="130"
                cy="130"
                r="102"
                stroke="#d6caa9"
                strokeOpacity="0.38"
                strokeWidth="1"
              />
              <circle cx="216" cy="44" r="4" fill="#faf6ed" />
            </motion.svg>

            <div className="animate-coach-float relative h-[260px] w-[216px] overflow-hidden rounded-t-full rounded-b-[28px] border-2 border-[#e8dfc8]/80 bg-[#faf6ed] shadow-[0_24px_50px_rgba(12,20,28,0.42)]">
              <img
                src="/images/vex-philosopher.jpg"
                alt="The Vex Philosopher Oracle"
                className="h-full w-full object-cover object-[center_10%]"
              />
            </div>
          </div>

          {/* Silky Frosted Summary Card */}
          <div className="relative z-20 rounded-[24px] border border-white/75 bg-[#faf6ed]/88 p-5 text-[#212d3d] shadow-[0_22px_52px_rgba(12,20,28,0.34)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <VexLogoMark className="h-4.5 w-4.5" />
                  <p className="font-serif-editorial text-[16px] font-medium text-[#212d3d]">
                    Telos Advantages
                  </p>
                </div>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#5a6675]">
                  {activeSage.greekTerm}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("jobs")}
                className="shrink-0 cursor-pointer rounded-full border border-[#212d3d]/15 bg-white/85 px-3 py-1 font-mono text-[10px] font-semibold text-[#212d3d] transition-colors hover:bg-[#212d3d] hover:text-[#faf6ed]"
              >
                OPEN
              </button>
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-4 border-b border-[#212d3d]/10 pb-3.5">
              <div>
                <p className="font-serif-display text-[36px] leading-none text-[#212d3d]">
                  {avgCompatibility}%
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#5a6675]">
                  FIT_VECTOR_AVG
                </p>
              </div>
              <div>
                <p className="font-serif-display text-[36px] leading-none text-[#212d3d]">
                  {careerMomentumScore}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#5a6675]">
                  MOMENTUM_INDEX
                </p>
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-2 items-end gap-3">
              <div className="flex h-[78px] flex-col justify-between rounded-[16px] border border-white/80 bg-white/80 p-3">
                <span className="font-serif-display text-[22px] leading-none text-[#212d3d]">
                  {preparedApps.length}
                </span>
                <span className="font-mono text-[10px] uppercase text-[#5a6675]">
                  Prepared Drafts
                </span>
              </div>
              <div className="flex h-[94px] flex-col justify-between rounded-[16px] bg-gradient-to-b from-[#212d3d] to-[#2b3b4e] p-3 text-[#faf6ed]">
                <span className="font-serif-display text-[24px] leading-none">
                  {savedJobIds.length} Jobs
                </span>
                <span className="font-mono text-[10px] uppercase text-[#a9c4e6]">
                  SHORTLISTED
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("jobs")}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#212d3d] py-2.5 text-[12.5px] font-medium text-[#faf6ed] shadow-sm transition-colors hover:bg-[#33445c]"
            >
              <span>Swipe Roles (Amor Fati / Ataraxia)</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.section>

        {/* RIGHT 8 COLUMNS: 4 BENTO TELEMETRY CARDS POWERED BY REAL CANVAS CHARTS */}
        <div className="grid grid-cols-1 gap-6 lg:col-span-8 lg:grid-cols-12">
          {/* Card 1: Prep Activity (Real Hover Bar Chart Canvas) */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex flex-col justify-between rounded-[34px] border border-[#cfc4a7]/90 bg-gradient-to-b from-[#faf6ed]/94 to-[#efe7d5]/88 p-7 shadow-[0_18px_48px_-14px_rgba(33,45,61,0.14)] ring-1 ring-white/80 backdrop-blur-xl transition-transform hover:-translate-y-0.5 lg:col-span-5 lg:p-8"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-serif-caps block text-[9.5px] text-[#6c624d]">
                  PREP_WEEK
                </span>
                <h2 className="mt-0.5 font-serif-editorial text-[19px] text-[#212d3d]">
                  Prep Activity
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("interviews")}
                className="cursor-pointer rounded-full border border-[#cfc4a7] bg-[#faf6ed] px-3.5 py-1.5 font-mono text-[10.5px] font-medium text-[#212d3d] hover:border-[#212d3d] hover:bg-white"
              >
                DRILLS
              </button>
            </div>

            <div className="mt-3">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#6c624d]">
                Practised this week
              </p>
              <p className="mt-1 font-serif-display text-[52px] leading-none tracking-[-0.02em] text-[#212d3d]">
                {weeklyFocusMinutes}
                <span className="ml-1.5 font-serif-calligraphic text-[22px] text-[#6c624d]">
                  min
                </span>
              </p>
            </div>

            <div className="mt-3">
              <OverviewPrepBarCanvas days={prepDays} />
            </div>
          </motion.section>

          {/* Card 2: Fit & Readiness Trajectory (Real Interactive Dual-Line Canvas) */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col justify-between rounded-[34px] border border-[#cfc4a7]/90 bg-gradient-to-b from-[#faf6ed]/94 to-[#efe7d5]/88 p-7 shadow-[0_18px_48px_-14px_rgba(33,45,61,0.14)] ring-1 ring-white/80 backdrop-blur-xl transition-transform hover:-translate-y-0.5 lg:col-span-7 lg:p-8"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-serif-caps block text-[9.5px] text-[#6c624d]">
                  FIT_DELTA
                </span>
                <h2 className="mt-0.5 font-serif-editorial text-[19px] text-[#212d3d]">
                  Comparison of Fit &amp; Readiness
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("learning")}
                className="cursor-pointer rounded-full border border-[#cfc4a7] bg-[#faf6ed] px-3.5 py-1.5 font-mono text-[10.5px] font-medium text-[#212d3d] hover:border-[#212d3d] hover:bg-white"
              >
                CALIBRATE
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#6c624d]">
                  24h Sprint Lift
                </p>
                <p className="mt-1 font-serif-display text-[52px] leading-none tracking-[-0.02em] text-[#212d3d]">
                  {avgCompatibility}.4
                  <span className="ml-0.5 font-serif-calligraphic text-[22px] text-[#6c624d]">
                    %
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono text-[10.5px] text-[#6c624d]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#212d3d]" /> VEX_PATH
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-[#6c624d]" />{" "}
                  BASE_CV
                </span>
              </div>
            </div>

            <div className="mt-2">
              <OverviewReadinessLineCanvas
                vexSeries={[64, 70, 76, 83, avgCompatibility, 90, 93]}
                baseSeries={[58, 59, 61, 63, 64, 65, 66]}
                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              />
            </div>
          </motion.section>

          {/* Card 3: Pipeline Velocity (Real Trajectory Canvas) */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.14 }}
            className="flex flex-col justify-between rounded-[34px] border border-[#cfc4a7]/90 bg-gradient-to-b from-[#faf6ed]/94 to-[#efe7d5]/88 p-7 shadow-[0_18px_48px_-14px_rgba(33,45,61,0.14)] ring-1 ring-white/80 backdrop-blur-xl transition-transform hover:-translate-y-0.5 lg:col-span-6 lg:p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-serif-caps block text-[9.5px] text-[#5a6675]">
                  PIPELINE_24H
                </span>
                <h2 className="mt-0.5 font-serif-editorial text-[18px] text-[#212d3d]">
                  Pipeline Velocity
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("applications")}
                className="cursor-pointer rounded-full border border-[#212d3d]/15 bg-[#faf6ed]/85 px-3 py-1.5 font-mono text-[10.5px] font-medium text-[#212d3d] hover:border-[#212d3d] hover:bg-white"
              >
                TRACKER
              </button>
            </div>

            <div className="mt-3 grid grid-cols-12 items-end gap-3">
              <div className="col-span-5 space-y-2.5">
                <div>
                  <p className="font-mono text-[10px] uppercase text-[#5a6675]">
                    Active Roles
                  </p>
                  <p className="mt-1 font-serif-display text-[40px] leading-none text-[#212d3d]">
                    {applications.length}{" "}
                    <span className="font-serif-calligraphic text-[22px]">
                      live
                    </span>
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between rounded-full border border-white/80 bg-[#faf6ed]/90 px-3 py-1.5 text-[11.5px]">
                    <span className="font-mono font-semibold text-[#212d3d]">
                      {submittedApps.length}
                    </span>
                    <span className="text-[#5a6675]">Submitted</span>
                  </div>
                  <div className="flex items-center justify-between rounded-full border border-white/80 bg-[#faf6ed]/90 px-3 py-1.5 text-[11.5px]">
                    <span className="font-mono font-semibold text-[#212d3d]">
                      {preparedApps.length}
                    </span>
                    <span className="text-[#5a6675]">Drafts</span>
                  </div>
                </div>
              </div>

              <div className="col-span-7">
                <OverviewVelocityCanvas
                  points={[2, 3, 4, Math.max(4, applications.length)]}
                  labels={["Mon", "Wed", "Fri", "Sun"]}
                  interviewsCount={upcomingInterviews.length}
                />
              </div>
            </div>
          </motion.section>

          {/* Card 4: Vitruvian Proof Mix */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.18 }}
            className="flex flex-col justify-between rounded-[34px] border border-[#cfc4a7]/90 bg-gradient-to-b from-[#faf6ed]/94 to-[#efe7d5]/88 p-7 shadow-[0_18px_48px_-14px_rgba(33,45,61,0.14)] ring-1 ring-white/80 backdrop-blur-xl transition-transform hover:-translate-y-0.5 lg:col-span-6 lg:p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-serif-caps block text-[9.5px] text-[#5a6675]">
                  VITRUVIAN_SPEC
                </span>
                <h2 className="mt-0.5 font-serif-editorial text-[18px] text-[#212d3d]">
                  Vitruvian Proof Mix
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("documents")}
                className="cursor-pointer rounded-full border border-[#212d3d]/15 bg-[#faf6ed]/85 px-3 py-1.5 font-mono text-[10.5px] font-medium text-[#212d3d] hover:border-[#212d3d] hover:bg-white"
              >
                AUDIT CV
              </button>
            </div>

            <div className="mt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#5a6675]">
                Verified CV &amp; Skill Score
              </p>
              <p className="mt-1 font-serif-display text-[44px] leading-none text-[#212d3d]">
                {applicationQualityScore}
                <span className="ml-1.5 font-serif-calligraphic text-[18px] text-[#5a6675]">
                  / 100
                </span>
              </p>
            </div>

            <div className="mt-4 space-y-2.5">
              {[
                { label: "CV Truth Audit", pct: cvProofRatio, accent: "#212d3d" },
                {
                  label: "Agora Shortlist",
                  pct: Math.max(40, shortlistRatio),
                  accent: "#067647",
                },
                { label: "Skill Mastery", pct: 68, accent: "#84a9dc" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-12 items-center gap-3"
                >
                  <span className="col-span-4 truncate text-[12px] text-[#5a6675]">
                    {row.label}
                  </span>
                  <div className="col-span-8 h-7 overflow-hidden rounded-full border border-[#212d3d]/8 bg-[#f2eee2]/85 p-0.5">
                    <div
                      style={{
                        width: `${row.pct}%`,
                        backgroundColor: row.accent,
                      }}
                      className="flex h-full items-center justify-end rounded-full px-3 font-mono text-[10.5px] font-semibold text-[#faf6ed] transition-all duration-500"
                    >
                      {row.pct}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      {/* 4. SIMPLIFIED SINGLE COMMAND INDEX (Replaces 4 Stacked Grids Below Fold!) */}
      <section className="overflow-hidden rounded-[28px] border border-[#cfc4a7]/90 bg-[#faf6ed]/85 shadow-[0_18px_48px_-14px_rgba(33,45,61,0.12)] backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-3 border-b border-[#e5dac2] px-6 py-4 sm:flex-row sm:items-center">
          <div>
            <Eyebrow label="Daily Command & Provenance" />
            <h2 className="mt-0.5 font-serif-display text-[24px] leading-tight text-[#212d3d]">
              Focus &amp;{" "}
              <span className="font-serif-calligraphic text-[#5a6675]">
                Verification
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5 rounded-[14px] border border-[#e0d6bf] bg-[#f2ecdf] p-1">
            {(
              [
                {
                  id: "execution",
                  label: `01 · Today (${completedTasksCount}/${dailyTasks.length}) & Pipeline`,
                },
                { id: "audit", label: "02 · 7-Point Readiness" },
                { id: "academy", label: "03 · Masterworks & Roadmap" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setLowerTab(t.id)}
                className={`cursor-pointer rounded-[10px] px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  lowerTab === t.id
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "text-[#5a6675] hover:text-[#212d3d]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {lowerTab === "execution" && (
              <motion.div
                key="execution"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-6 lg:grid-cols-12"
              >
                {/* Left 5: Daily Tasks */}
                <div className="space-y-2.5 lg:col-span-5">
                  <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                    Next Measurable Steps (Today)
                  </p>
                  {dailyTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-start justify-between gap-3 rounded-[16px] border p-3.5 transition-colors ${
                        task.done
                          ? "border-[#067647]/30 bg-[#067647]/5"
                          : "border-[#dfd4be] bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        className="flex flex-1 cursor-pointer items-start gap-3 text-left"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            task.done
                              ? "border-[#067647] bg-[#067647] text-white"
                              : "border-[#212d3d]/25 bg-[#faf6ed]"
                          }`}
                        >
                          {task.done && <CheckIcon className="h-3.5 w-3.5" />}
                        </span>
                        <div>
                          <span className="font-mono text-[10px] uppercase text-[#5a6675]">
                            {task.type} · {task.duration}
                          </span>
                          <p
                            className={`text-[13px] font-medium ${
                              task.done
                                ? "line-through text-[#5a6675]"
                                : "text-[#212d3d]"
                            }`}
                          >
                            {task.title}
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate(task.targetSection)}
                        className="shrink-0 cursor-pointer rounded-full border border-[#d6cbb2] bg-[#faf6ed] px-3 py-1 text-[11px] font-medium text-[#212d3d]"
                      >
                        Open
                      </button>
                    </div>
                  ))}
                </div>

                {/* Right 7: Honest Application Pipeline + Demand */}
                <div className="space-y-4 lg:col-span-7">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                      Truthful Pipeline Snapshot
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate("applications")}
                      className="cursor-pointer text-[12px] font-medium text-[#212d3d] underline"
                    >
                      Open full tracker
                    </button>
                  </div>
                  <div className="divide-y divide-[#ece5d5] rounded-[18px] border border-[#dfd4be] bg-white px-4">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="text-[13.5px] font-medium text-[#212d3d]">
                            {app.title}{" "}
                            <span className="text-[#5a6675]">
                              · {app.company}
                            </span>
                          </p>
                          <p className="text-[11.5px] text-[#5a6675]">
                            {app.evidenceText}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                          <SubmissionStateBadge state={app.submissionState} />
                          <StatusPill
                            label={app.stage}
                            tone="neutral"
                            dot={false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {MARKET_DEMAND_BENCHMARKS.map((item) => (
                      <div
                        key={item.skill}
                        className="rounded-[14px] border border-[#dfd4be] bg-white p-3"
                      >
                        <span className="font-mono text-[10px] font-semibold text-[#067647]">
                          {item.medianSalaryLift} · {item.openRolesMatched} roles
                        </span>
                        <p className="mt-0.5 text-[12px] font-medium text-[#212d3d]">
                          {item.skill}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {lowerTab === "audit" && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
              >
                {readinessRows.map((row, idx) => (
                  <button
                    key={row.question}
                    type="button"
                    onClick={() => onNavigate(row.target)}
                    className={`group flex cursor-pointer flex-col justify-between rounded-[18px] border border-[#dfd4be] bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#212d3d] ${
                      idx === 6 ? "md:col-span-2" : ""
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#7a6b4e]">
                        0{idx + 1} · {row.question}
                      </span>
                      <div className="mt-2">
                        <StatusPill label={row.status} tone={row.tone} />
                      </div>
                      <p className="mt-2 text-[12px] text-[#5a6675]">
                        {row.evidence}
                      </p>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-medium text-[#212d3d]">
                      Inspect <ArrowRightIcon className="h-3 w-3" />
                    </span>
                  </button>
                ))}
              </motion.div>
            )}

            {lowerTab === "academy" && (
              <motion.div
                key="academy"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[
                    {
                      master: "Michelangelo · Consent",
                      title: "AI Prepares. You Submit.",
                      img: "/images/michelangelo-hands.jpg",
                      target: "applications" as DashboardSectionId,
                    },
                    {
                      master: "Leonardo · Vitruvian Spec",
                      title: "Proportional Skill Telemetry.",
                      img: "/images/davinci-codex.jpg",
                      target: "learning" as DashboardSectionId,
                    },
                    {
                      master: "Raphael · Agora Deck",
                      title: "Role Choice with Proof.",
                      img: "/images/raphael-athens.jpg",
                      target: "jobs" as DashboardSectionId,
                    },
                  ].map((c) => (
                    <button
                      key={c.master}
                      type="button"
                      onClick={() => onNavigate(c.target)}
                      className="group relative overflow-hidden rounded-[20px] border border-[#212d3d]/20 bg-[#212d3d] text-left text-[#faf6ed]"
                    >
                      <img
                        src={c.img}
                        alt={c.master}
                        className="h-40 w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="p-4">
                        <p className="font-mono text-[10px] uppercase text-[#a9c4e6]">
                          {c.master}
                        </p>
                        <p className="mt-1 font-serif-display text-[20px]">
                          {c.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                  {FIRST_24H_MILESTONES.map((step, idx) => (
                    <button
                      key={step.window}
                      type="button"
                      onClick={() => onNavigate(step.section)}
                      className="flex cursor-pointer flex-col justify-between rounded-[14px] border border-[#dfd4be] bg-white p-3 text-left hover:border-[#212d3d]"
                    >
                      <div>
                        <span className="font-mono text-[10px] text-[#7a6b4e]">
                          0{idx + 1} · {step.window}
                        </span>
                        <p className="mt-1 text-[12.5px] font-medium text-[#212d3d]">
                          {step.title}
                        </p>
                      </div>
                      <p className="mt-1.5 text-[11px] text-[#5a6675]">
                        {step.outcome}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
