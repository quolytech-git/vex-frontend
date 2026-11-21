"use client";

import { useQuickAction, focusField } from "@/lib/quick-actions";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { DashboardApplication } from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { ArrowRightIcon, CheckIcon } from "@/components/Icons";
import { StatusPill } from "./StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";

interface InterviewPrepViewProps {
  applications: DashboardApplication[];
  mockSessionsCount: number;
  onCompleteSession: () => void;
}

type InterviewMode = "Behavioral" | "Technical" | "HR" | "Company-specific";
type DifficultyLevel = "Entry" | "Mid" | "Senior";
type CompanionTab = "checklist" | "history" | "followup";
type PhilosopherKey = "socrates" | "marcus" | "aristotle" | "davinci";

interface PhilosopherMentor {
  key: PhilosopherKey;
  name: string;
  discipline: string;
  image: string;
  maxim: string;
  focusMode: InterviewMode;
}

const PHILOSOPHER_MENTORS: Record<PhilosopherKey, PhilosopherMentor> = {
  socrates: {
    key: "socrates",
    name: "Socrates",
    discipline: "Dialectic & Clarity",
    image: "/images/interview-socrates-dialectic.jpg",
    maxim:
      "Answer the first question simply, state your evidence, and stop before rambling.",
    focusMode: "Behavioral",
  },
  marcus: {
    key: "marcus",
    name: "Marcus Aurelius",
    discipline: "Stoic Composure",
    image: "/images/interview-marcus-stoic.jpg",
    maxim:
      "Under follow-up pressure, pause two seconds, verify the core constraint, and speak evenly.",
    focusMode: "HR",
  },
  aristotle: {
    key: "aristotle",
    name: "Aristotle",
    discipline: "First Principles",
    image: "/images/greek-philosopher-roadmap.jpg",
    maxim:
      "Anchor technical trade-offs cleanly in latency, reliability, and measurable impact.",
    focusMode: "Technical",
  },
  davinci: {
    key: "davinci",
    name: "Leonardo da Vinci",
    discipline: "Systems Design",
    image: "/images/davinci-profile-bust.jpg",
    maxim:
      "Connect the company's product anatomy directly to the mechanics you have already built.",
    focusMode: "Company-specific",
  },
};

const QUESTIONS_BY_MODE: Record<
  InterviewMode,
  Record<DifficultyLevel, string[]>
> = {
  Behavioral: {
    Entry: [
      "Tell me about a time you caught a coordination issue early before it delayed a deadline.",
      "Describe how you organise handoffs when two stakeholders give conflicting priorities.",
    ],
    Mid: [
      "Walk me through a launch or cross-team rollout where something broke mid-flight. What did you personally coordinate and change?",
      "Describe a time you had incomplete data for a decision. How did you communicate uncertainty to stakeholders?",
    ],
    Senior: [
      "Tell me about a high-stakes operational failure where you redesigned the team workflow permanently afterward.",
      "How have you pushed back against leadership urgency when quality or compliance checks were incomplete?",
    ],
  },
  Technical: {
    Entry: [
      "Write or describe a SQL query that groups weekly signups by funnel step to surface where users drop off.",
      "What UI states should an API request render while loading, succeeding, timing out, or retrying?",
    ],
    Mid: [
      "If conversion drops 18% after a schema change, walk through how you isolate the cause using SQL cohorts and event logs.",
      "When a third-party webhook fails intermittently in production, how should retries and user-facing error states behave?",
    ],
    Senior: [
      "Design an idempotent retry + dead-letter triage pipeline for payment onboarding events without silent state corruption.",
      "Explain how you structure frontend + backend contract validation across versioned APIs.",
    ],
  },
  HR: {
    Entry: [
      "What motivated your transition toward product operations and engineering roles, and why this team?",
      "What type of manager feedback helps you do your clearest work?",
    ],
    Mid: [
      "Walk us through your proudest cross-functional contribution and why your background fits our stage.",
      "How do you approach expectations, salary alignment, and remote/hybrid collaboration cadence?",
    ],
    Senior: [
      "How do you evaluate culture fit, decision-writing quality, and long-term scope when joining a scaling org?",
      "Tell us about a time you mentored someone or resolved cross-team tension cleanly.",
    ],
  },
  "Company-specific": {
    Entry: [
      "Based on our public product notes, where do you see the biggest opportunity to streamline customer onboarding?",
      "Why does this specific sector and operating pace match what you want over the next two years?",
    ],
    Mid: [
      "How would your cross-team launch checklists apply to our upcoming enterprise rollout cadence?",
      "Looking at our engineering/ops culture, what 30-day diagnostic would you run in month one?",
    ],
    Senior: [
      "Outline your 30-60-90 day plan for scaling our launch readiness and weekly analytics governance.",
      "Which scaling bottleneck is most common at our company size and how do you instrument it?",
    ],
  },
};

export default function InterviewPrepView({
  applications,
  mockSessionsCount,
  onCompleteSession,
}: InterviewPrepViewProps) {
  useQuickAction("practice-interview", () => focusField("#interviewprepview-textarea-1"));
  const [selectedAppId, setSelectedAppId] = useState(
    applications.find((a) => a.interviewDate)?.id || applications[0]?.id || ""
  );
  const [philosopher, setPhilosopher] = useState<PhilosopherKey>("socrates");
  const [mode, setMode] = useState<InterviewMode>("Behavioral");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Mid");
  const [companionTab, setCompanionTab] = useState<CompanionTab>("checklist");

  const [timedDrill, setTimedDrill] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [qIndex, setQIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [feedbackShown, setFeedbackShown] = useState(false);

  const [historyLog, setHistoryLog] = useState<
    {
      id: string;
      company: string;
      mode: string;
      difficulty: string;
      snippet: string;
      time: string;
    }[]
  >([
    {
      id: "ih-1",
      company: "Meridian Advisory",
      mode: "Behavioral",
      difficulty: "Mid",
      snippet: "Rollout checklist triage — strong ownership; add funnel metric.",
      time: "Yesterday · 17:10",
    },
  ]);

  const [checklist, setChecklist] = useState([
    { id: "c1", label: "Review mandatory & preferred requirements", done: true },
    { id: "c2", label: "Prepare 3 evidence-backed STAR stories", done: true },
    { id: "c3", label: "Verify panel link, quiet room & notes", done: false },
    { id: "c4", label: "Prepare 2 thoughtful panel questions", done: false },
  ]);

  const [reflectionNote, setReflectionNote] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [thankYouCopied, setThankYouCopied] = useState(false);

  useEffect(() => {
    if (!timedDrill) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timedDrill]);

  const activeApp =
    applications.find((a) => a.id === selectedAppId) || applications[0];
  const activeMentor = PHILOSOPHER_MENTORS[philosopher];
  const questions = QUESTIONS_BY_MODE[mode][difficulty];
  const currentQuestion = questions[qIndex % questions.length];
  const readinessScore = Math.min(96, 74 + mockSessionsCount * 3);
  const completedChecks = checklist.filter((c) => c.done).length;

  function handleSelectMentor(key: PhilosopherKey) {
    setPhilosopher(key);
    setMode(PHILOSOPHER_MENTORS[key].focusMode);
    setFeedbackShown(false);
  }

  function insertStarSkeleton() {
    setAnswerText(
      `Situation (${activeApp?.company ?? "Role"}): \nTask: \nAction: \nVerified Result: `
    );
  }

  function submitAnswer() {
    const cleanText =
      answerText.trim() ||
      `For ${activeApp?.company ?? "the team"}, I coordinated an operational checklist between engineering and support when webhook retries slipped, verified staging latency, and eliminated repeat alerts.`;
    setAnswerText(cleanText);
    setFeedbackShown(true);
    setTimedDrill(false);
    setHistoryLog((prev) => [
      {
        id: `ih-${Date.now()}`,
        company: activeApp?.company ?? "Target Role",
        mode,
        difficulty,
        snippet: cleanText.slice(0, 74) + "...",
        time: "Just now",
      },
      ...prev,
    ]);
    onCompleteSession();
  }

  function handleCopyThankYou() {
    const draft =
      reflectionNote.trim() ||
      `Thank you for today's ${mode.toLowerCase()} conversation regarding ${activeApp?.title ?? "the role"} at ${activeApp?.company ?? "your team"}. I particularly appreciated discussing your operational rigor and rollout cadence.`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(draft).catch(() => {});
    }
    setThankYouCopied(true);
    setTimeout(() => setThankYouCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* SECTION 1: SIMPLER HEADER + APPLIED JOBS STRIP */}
      <section className="rounded-[24px] border border-[#dcd2bd] bg-[#faf6ed] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="space-y-1.5">
            <Eyebrow label="The Lyceum · Socratic Interview Studio" />
            <h1 className="font-serif-display text-[clamp(1.85rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.025em] text-[#212d3d]">
              Dialectic &amp;{" "}
              <span className="italic text-[#5a6675]">Real Rehearsal.</span>
            </h1>
            <p className="max-w-[60ch] text-[13px] text-[#5a6675]">
              Pick an active role you are applying to, spar with a classical
              thinker, and tighten your STAR evidence before every real call.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              label={`Readiness ${readinessScore}%`}
              tone="success"
            />
            <StatusPill
              label={`${mockSessionsCount} Mock Sessions`}
              tone="navy"
              dot={false}
            />
            <StatusPill
              label={`${completedChecks}/${checklist.length} Ready`}
              tone="info"
              dot={false}
            />
            <Link
              href={`/dashboard/interviews/session/${activeApp?.id || "sess-1"}`}
              className="rounded-full bg-[#212d3d] px-3.5 py-1.5 text-[11.5px] font-medium text-[#faf6ed] hover:bg-[#314158]"
            >
              Live Voice/Text Session -&gt;
            </Link>
            <Link
              href="/dashboard/interviews/sess-meridian-1/report"
              className="rounded-full border border-[#cfc2a5] bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
            >
              Analytics Report
            </Link>
          </div>
        </div>

        {/* Applied Jobs Strip ("the jobs he is applying to") */}
        <div className="space-y-2 border-t border-[#e5dac2] pt-4">
          <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start max-lg:gap-0.5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6b4e]">
              <span className="lg:hidden">Pick a role to rehearse ({applications.length})</span>
              <span className="hidden lg:inline">
                Active Applications In Your Pipeline ({applications.length}) — Select
                Role To Rehearse
              </span>
            </p>
            {activeApp?.interviewDate && (
              <span className="font-mono text-[11px] font-semibold text-[#067647]">
                Next Call: {activeApp.interviewDate}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {applications.map((app) => {
              const isSelected = app.id === activeApp?.id;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    setSelectedAppId(app.id);
                    setFeedbackShown(false);
                  }}
                  className={`flex cursor-pointer flex-col justify-between rounded-[16px] border p-3.5 text-left transition-all ${
                    isSelected
                      ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed] shadow-sm"
                      : "border-[#dfd4be] bg-white text-[#212d3d] hover:border-[#8f7d5d]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                        isSelected ? "text-[#d4c6a8]" : "text-[#7a6b4e]"
                      }`}
                    >
                      {app.company}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        isSelected
                          ? "bg-[#faf6ed]/15 text-[#faf6ed]"
                          : app.interviewDate
                          ? "bg-[#067647]/10 text-[#067647]"
                          : "bg-[#f2eee2] text-[#5a6675]"
                      }`}
                    >
                      {app.interviewDate ? "Interview" : app.stage}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-[13.5px] font-medium">
                    {app.title}
                  </p>
                  <p
                    className={`mt-1 truncate font-mono text-[10.5px] ${
                      isSelected ? "text-[#b9c4d4]" : "text-[#6d6250]"
                    }`}
                  >
                    {app.interviewDate || app.cvVariant}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: STREAMLINED 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* LEFT PANEL (7 Cols): INTERACTIVE REHEARSAL DESK */}
        <section className="space-y-4 rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-5 sm:p-6 lg:col-span-7">
          {/* Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece5d5] pb-3.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  "Behavioral",
                  "Technical",
                  "HR",
                  "Company-specific",
                ] as const
              ).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setFeedbackShown(false);
                  }}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    mode === m
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "border border-[#dfd4be] bg-[#faf6ed] text-[#5a6675] hover:text-[#212d3d]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <div className="inline-flex rounded-full border border-[#dfd4be] bg-[#faf6ed] p-0.5">
                {(["Entry", "Mid", "Senior"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setDifficulty(lvl);
                      setFeedbackShown(false);
                    }}
                    className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      difficulty === lvl
                        ? "bg-[#212d3d] text-[#faf6ed]"
                        : "text-[#5a6675]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setTimedDrill((v) => !v);
                  setSecondsLeft(120);
                }}
                className={`cursor-pointer rounded-full border px-3 py-1 font-mono text-[11px] font-medium transition-colors ${
                  timedDrill
                    ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                    : "border-[#dfd4be] bg-white text-[#212d3d]"
                }`}
              >
                {timedDrill
                  ? `${Math.floor(secondsLeft / 60)}:${String(
                      secondsLeft % 60
                    ).padStart(2, "0")}`
                  : "2:00 Timer"}
              </button>
            </div>
          </div>

          {/* Active Question + Mentor Context */}
          <div className="flex flex-col gap-4 rounded-[20px] border border-[#e3dac5] bg-[#f4efe3] p-5 sm:flex-row sm:items-center">
            <img
              src={activeMentor.image}
              alt={activeMentor.name}
              className="h-16 w-16 shrink-0 rounded-full border-2 border-[#cfc2a5] object-cover object-top"
            />
            <div className="min-w-0 space-y-1">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                {activeApp?.company} · {activeMentor.name} ({activeMentor.discipline}) · Q
                {(qIndex % questions.length) + 1}/{questions.length}
              </p>
              <p className="font-serif-display text-[21px] leading-[1.28] text-[#212d3d]">
                “{currentQuestion}”
              </p>
            </div>
          </div>

          {/* Answer Composer */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-[12.5px] font-medium text-[#212d3d]">
                Structured Response ({activeApp?.title})
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={insertStarSkeleton}
                  className="cursor-pointer rounded-full border border-[#dfd4be] bg-[#faf6ed] px-3 py-1 text-[11px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                >
                  Insert STAR Frame
                </button>
                {answerText && (
                  <button
                    type="button"
                    onClick={() => {
                      setAnswerText("");
                      setFeedbackShown(false);
                    }}
                    className="cursor-pointer rounded-full border border-[#dfd4be] bg-white px-2.5 py-1 text-[11px] text-[#5a6675] hover:text-[#212d3d]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <textarea id="interviewprepview-textarea-1" name="interviewprepview-textarea-1" aria-label="interviewprepview textarea 1"
              rows={5}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder={`Draft your grounded response for ${activeApp?.company ?? "this role"} (Situation -> Task -> Action -> Confirmed Result)...`}
              className="w-full rounded-[16px] border border-[#dad6ca] bg-[#faf6ed] p-4 text-[13.5px] leading-[1.55] text-[#212d3d] placeholder:text-[#5a6675]/70 focus:border-[#212d3d] focus:outline-none"
            />
          </div>

          {/* Primary Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={submitAnswer}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed] transition-all hover:bg-[#314158]"
              >
                <span>Evaluate Answer</span>
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setQIndex((q) => q + 1);
                  setAnswerText("");
                  setFeedbackShown(false);
                }}
                className="cursor-pointer rounded-full border border-[#dfd4be] bg-white px-4 py-2 text-[12.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
              >
                Next Question
              </button>
            </div>
            <span className="font-mono text-[11px] text-[#7a6b4e]">
              Honest rehearsal · Zero invented stories
            </span>
          </div>

          {/* Inline Structured Feedback */}
          {feedbackShown && (
            <div className="grid grid-cols-1 gap-3 rounded-[16px] border border-[#d6cbb2] bg-[#faf6ed] p-4 sm:grid-cols-2">
              <div className="rounded-[12px] border border-[#067647]/25 bg-white p-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#067647]">
                  Strength Observed
                </p>
                <p className="mt-1 text-[12.5px] text-[#212d3d]">
                  Strong ownership lead (“{answerText.slice(0, 62)}...”) keeps
                  the panel anchored on real execution.
                </p>
              </div>
              <div className="rounded-[12px] border border-[#b54708]/25 bg-white p-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#b54708]">
                  Next Refinement
                </p>
                <p className="mt-1 text-[12.5px] text-[#212d3d]">
                  End with one crisp diagnostic metric aligned to{" "}
                  {activeApp?.company}&apos;s workflow ({activeApp?.stage}).
                </p>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT PANEL (5 Cols): PHILOSOPHER MENTOR PORTRAIT + SINGLE TABBED COMPANION */}
        <aside className="flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#dcd2bd] bg-[#fffef9] lg:col-span-5">
          {/* Top Philosopher Cast Portrait Frame */}
          <div className="border-b border-[#ece5d5] bg-[#faf6ed] p-5 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6b4e]">
                Philosopher Sparring Council
              </p>
              <span className="font-mono text-[10.5px] font-semibold text-[#212d3d]">
                {activeMentor.name}
              </span>
            </div>

            {/* 4 Selectable Philosopher Image Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {(
                Object.values(PHILOSOPHER_MENTORS) as PhilosopherMentor[]
              ).map((m) => {
                const selected = philosopher === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => handleSelectMentor(m.key)}
                    className={`flex cursor-pointer flex-col items-center gap-1 rounded-[12px] border p-1.5 transition-all ${
                      selected
                        ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed] shadow-sm"
                        : "border-[#dfd4be] bg-white text-[#212d3d] hover:border-[#8f7d5d]"
                    }`}
                  >
                    <img
                      src={m.image}
                      alt={m.name}
                      className="h-11 w-full rounded-[8px] object-cover object-top"
                    />
                    <span className="w-full truncate text-center text-[10.5px] font-medium">
                      {m.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Featured Arched Classical Portrait (Desktop Only) */}
            <div className="hidden overflow-hidden rounded-t-[110px] rounded-b-[16px] border border-[#cfc2a5] bg-[#e9e0cc] lg:block">
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={activeMentor.image}
                  alt={activeMentor.name}
                  className="h-full w-full object-cover object-top transition-all duration-300"
                />
              </div>
              <div className="border-t border-[#d8cbb0] bg-[#fffef9] px-4 py-2.5">
                <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                  {activeMentor.name} · {activeMentor.discipline}
                </p>
                <p className="mt-0.5 text-[12px] leading-snug text-[#212d3d]">
                  “{activeMentor.maxim}”
                </p>
              </div>
            </div>
            <MobilePhilosopherPill
              name={activeMentor.name}
              role={activeMentor.discipline}
              image={activeMentor.image}
              quote={activeMentor.maxim}
              guidance="Practise out loud with the 2-minute timer and STAR outline before saving your evaluation."
            />
          </div>

          {/* Bottom Tabbed Companion Workspace (Replaces 3 separate stacked boxes) */}
          <div className="flex-1 p-5 space-y-3.5">
            <div className="grid grid-cols-3 gap-1.5 rounded-[14px] border border-[#e3dac5] bg-[#f4efe3] p-1">
              {(
                [
                  {
                    id: "checklist",
                    label: `Checklist (${completedChecks}/${checklist.length})`,
                  },
                  { id: "history", label: `History (${historyLog.length})` },
                  { id: "followup", label: "Thank-You" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCompanionTab(t.id)}
                  className={`cursor-pointer rounded-[10px] px-2 py-1.5 text-[11px] font-medium transition-colors ${
                    companionTab === t.id
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "text-[#5a6675] hover:text-[#212d3d]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {companionTab === "checklist" && (
              <div className="space-y-2">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setChecklist((prev) =>
                        prev.map((c) =>
                          c.id === item.id ? { ...c, done: !c.done } : c
                        )
                      )
                    }
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-[12px] border border-[#e5dac2] bg-[#faf6ed] px-3 py-2 text-left text-[12.5px] hover:border-[#8f7d5d]"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        item.done
                          ? "border-[#067647] bg-[#067647] text-white"
                          : "border-[#212d3d]/30 bg-white"
                      }`}
                    >
                      {item.done && <CheckIcon className="h-2.5 w-2.5" />}
                    </span>
                    <span
                      className={
                        item.done
                          ? "line-through text-[#5a6675]"
                          : "text-[#212d3d]"
                      }
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {companionTab === "history" && (
              <div className="space-y-2">
                {historyLog.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[12px] border border-[#e5dac2] bg-[#faf6ed] px-3 py-2.5 text-[12px]"
                  >
                    <div className="flex items-center justify-between font-medium text-[#212d3d]">
                      <span>
                        {item.company} · {item.mode} ({item.difficulty})
                      </span>
                      <span className="font-mono text-[10px] text-[#7a6b4e]">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[#5a6675]">{item.snippet}</p>
                  </div>
                ))}
              </div>
            )}

            {companionTab === "followup" && (
              <div className="space-y-2.5">
                <textarea id="interviewprepview-textarea-2" name="interviewprepview-textarea-2" aria-label="interviewprepview textarea 2"
                  rows={3}
                  value={reflectionNote}
                  onChange={(e) => {
                    setReflectionNote(e.target.value);
                    setReflectionSaved(false);
                  }}
                  placeholder={`Draft reflection or thank-you follow-up for ${activeApp?.company}...`}
                  className="w-full rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] p-3 text-[12.5px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReflectionSaved(true)}
                    className="cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1.5 text-[11.5px] font-medium text-[#faf6ed]"
                  >
                    {reflectionSaved ? "Saved Draft" : "Save Note"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyThankYou}
                    className="cursor-pointer rounded-full border border-[#d8ceb9] bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                  >
                    {thankYouCopied ? "Copied Note" : "Copy Thank-You"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
