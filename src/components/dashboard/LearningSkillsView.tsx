"use client";

import { useQuickAction } from "@/lib/quick-actions";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  type CourseItem,
  MARKET_DEMAND_BENCHMARKS,
  type SkillRecord,
} from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { ArrowRightIcon } from "@/components/Icons";
import {
  LearningTrackerChartCanvas,
  LectureTheaterCanvas,
} from "./LearningTrackerCanvas";
import { SkillTierBadge, StatusPill } from "./StatusBadge";

interface LearningSkillsViewProps {
  skills: SkillRecord[];
  courses: CourseItem[];
  onChallengeSkill: (skillId: string, note: string) => void;
  onUpgradeSkillDemonstrated: (skillId: string, courseId: string) => void;
}

type LearningStepId = "videos" | "homework" | "pdf" | "chatbot" | "skills";
type HwStatus = "Pending" | "In Progress" | "Done";

interface HomeworkTask {
  id: string;
  code: string;
  title: string;
  skillLinked: string;
  dueLabel: string;
  estimatedMins: number;
  loggedMins: number;
  deliverable: string;
  status: HwStatus;
}

interface PdfAuditResult {
  fileName: string;
  sizeLabel: string;
  analyzedAt: string;
  matchedTopics: string[];
  missingGaps: string[];
  recommendedNext: string;
  summary: string;
}

interface ChatMessage {
  id: string;
  sender: "tutor" | "student";
  text: string;
  timestamp: string;
}

interface LectureChapter {
  time: string;
  title: string;
  summary: string;
}

const STEP_ITEMS: {
  id: LearningStepId;
  num: string;
  title: string;
  hint: string;
}[] = [
  { id: "videos", num: "01", title: "Watch Videos", hint: "Guided lessons" },
  { id: "homework", num: "02", title: "Homework & Quiz", hint: "Practice & check" },
  { id: "pdf", num: "03", title: "Check a PDF", hint: "Upload syllabus" },
  { id: "chatbot", num: "04", title: "Ask Tutor", hint: "Aristotle chat" },
  { id: "skills", num: "05", title: "Skill Tracker", hint: "Your levels" },
];

const LECTURE_METADATA: Record<
  string,
  {
    durationLabel: string;
    embedUrl: string;
    externalUrl: string;
    chapters: LectureChapter[];
  }
> = {
  "crs-1": {
    durationLabel: "18:40",
    embedUrl: "https://www.youtube.com/embed/7S_tz1z_5bA?rel=0",
    externalUrl: "https://mode.com/sql-tutorial/",
    chapters: [
      {
        time: "00:00",
        title: "Signup Event Schema",
        summary: "Inspect timestamp columns and remove duplicate events.",
      },
      {
        time: "04:20",
        title: "Cohort CTE Window",
        summary: "Group weekly signups cleanly with DATE_TRUNC.",
      },
      {
        time: "09:15",
        title: "Funnel LEFT JOIN",
        summary: "Keep non-converting users visible so drop-off % stays accurate.",
      },
      {
        time: "14:10",
        title: "Edge-Case Sanity Check",
        summary: "Verify null states and timezones before presenting numbers.",
      },
    ],
  },
  "crs-2": {
    durationLabel: "14:25",
    embedUrl: "https://www.youtube.com/embed/vjf774RKrLc?rel=0",
    externalUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503",
    chapters: [
      {
        time: "00:00",
        title: "Spotting HTTP 429 & 503",
        summary: "Tell temporary server timeouts apart from validation errors.",
      },
      {
        time: "03:50",
        title: "Keeping Draft Text Safe",
        summary: "Save candidate input locally so retries never erase work.",
      },
      {
        time: "07:45",
        title: "Single Safe Retry",
        summary: "Wait briefly with backoff instead of hammering a failing server.",
      },
      {
        time: "11:10",
        title: "Clear Manual Fallback",
        summary: "Show a calm status note and manual save button if down.",
      },
    ],
  },
};

const INITIAL_HOMEWORK: HomeworkTask[] = [
  {
    id: "hw-1",
    code: "HW-01",
    title: "Write Weekly SQL Retention Query",
    skillLinked: "SQL & Cohort Diagnostics",
    dueLabel: "Tue 18 Nov",
    estimatedMins: 45,
    loggedMins: 30,
    deliverable: "Write a 3-step CTE showing Day-1 and Day-7 funnel drop-off.",
    status: "In Progress",
  },
  {
    id: "hw-2",
    code: "HW-02",
    title: "Complete HTTP 503 Retry Lab",
    skillLinked: "API Integration & Error Recovery",
    dueLabel: "Thu 20 Nov",
    estimatedMins: 30,
    loggedMins: 15,
    deliverable: "Pass the quick 1-question knowledge check on the right.",
    status: "Pending",
  },
  {
    id: "hw-3",
    code: "HW-03",
    title: "Draft 1-Page Launch Checklist",
    skillLinked: "Cross-Team Operational Cadence",
    dueLabel: "Sat 22 Nov",
    estimatedMins: 40,
    loggedMins: 40,
    deliverable: "Outline rollout steps, owner sign-offs, and rollback triggers.",
    status: "Done",
  },
];

export default function LearningSkillsView({
  skills,
  courses,
  onChallengeSkill,
  onUpgradeSkillDemonstrated,
}: LearningSkillsViewProps) {
  // Single active step at a time so first-time users never feel overwhelmed
  const [step, setStep] = useState<LearningStepId>("videos");
  useQuickAction("learn-skill", () => {
    setStep("videos");
    document.querySelector("main")?.scrollIntoView({ behavior: "smooth" });
  });

  // Weekly study tracker state
  const [studyDays, setStudyDays] = useState([
    { day: "Mon", mins: 45 },
    { day: "Tue", mins: 70 },
    { day: "Wed", mins: 30 },
    { day: "Thu", mins: 85 },
    { day: "Fri", mins: 55 },
    { day: "Sat", mins: 40 },
    { day: "Sun", mins: 60 },
  ]);

  // Step 1: Video Theater state
  const [activeCourseId, setActiveCourseId] = useState(
    courses[0]?.id ?? "crs-1"
  );
  const [chapterIdx, setChapterIdx] = useState(0);
  const [playbackPct, setPlaybackPct] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [showYoutubeEmbed, setShowYoutubeEmbed] = useState(false);
  const [watchedCourseIds, setWatchedCourseIds] = useState<
    Record<string, boolean>
  >({
    "crs-1": true,
  });
  const [noteInput, setNoteInput] = useState("");
  const [videoNotes, setVideoNotes] = useState<
    { id: string; timestamp: string; text: string }[]
  >([
    {
      id: "vn-1",
      timestamp: "04:20",
      text: "Group weekly signups with DATE_TRUNC before joining conversion events.",
    },
  ]);

  // Step 2: Homework + Quiz state
  const [homework, setHomework] = useState<HomeworkTask[]>(INITIAL_HOMEWORK);
  const [addingHw, setAddingHw] = useState(false);
  const [newHwTitle, setNewHwTitle] = useState("");
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string>("");
  const [quizResult, setQuizResult] = useState<"idle" | "passed" | "retry">(
    "idle"
  );

  // Step 3: PDF Upload & Checker state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pdfExcerpt, setPdfExcerpt] = useState("");
  const [pdfAudit, setPdfAudit] = useState<PdfAuditResult | null>(null);

  // Step 4: Aristotle Chatbot state
  const chatSectionRef = useRef<HTMLElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "tutor",
      timestamp: "Aristotle Tutor",
      text: "Hello. I am your Lyceum study tutor. Pick a question on the right or ask me anything about your video lesson, homework (HW-01 / HW-02), or uploaded PDF notes.",
    },
  ]);

  // Step 5: Skill challenge state
  const [challengeOpenId, setChallengeOpenId] = useState<string | null>(null);
  const [challengeNote, setChallengeNote] = useState("");

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setPlaybackPct((prev) => {
        const next = prev + 1.5 * playbackSpeed;
        if (next >= 100) {
          setIsPlaying(false);
          setWatchedCourseIds((w) => ({ ...w, [activeCourseId]: true }));
          return 100;
        }
        return next;
      });
    }, 350);
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, activeCourseId]);

  const activeCourse =
    courses.find((c) => c.id === activeCourseId) || courses[0];
  const lectureMeta =
    LECTURE_METADATA[activeCourseId] || LECTURE_METADATA["crs-1"];
  const currentChapter =
    lectureMeta.chapters[chapterIdx] || lectureMeta.chapters[0];

  const hwDoneCount = homework.filter((h) => h.status === "Done").length;
  const watchedCount = Object.values(watchedCourseIds).filter(Boolean).length;
  const totalStudyMins = useMemo(
    () => studyDays.reduce((acc, d) => acc + d.mins, 0),
    [studyDays]
  );

  function addStudyMinutes(mins: number) {
    setStudyDays((prev) =>
      prev.map((d, i) =>
        i === prev.length - 1 ? { ...d, mins: d.mins + mins } : d
      )
    );
  }

  function toggleHomeworkDone(id: string) {
    setHomework((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const next: HwStatus = h.status === "Done" ? "In Progress" : "Done";
        return {
          ...h,
          status: next,
          loggedMins:
            next === "Done"
              ? Math.max(h.loggedMins, h.estimatedMins)
              : h.loggedMins,
        };
      })
    );
  }

  function handleCreateHomework(e: React.FormEvent) {
    e.preventDefault();
    if (!newHwTitle.trim()) return;
    setHomework((prev) => [
      {
        id: `hw-${Date.now()}`,
        code: `HW-0${prev.length + 1}`,
        title: newHwTitle.trim(),
        skillLinked: skills[0]?.name || "Core Skill",
        dueLabel: "This week",
        estimatedMins: 30,
        loggedMins: 0,
        deliverable: "Custom study task added by you.",
        status: "Pending",
      },
      ...prev,
    ]);
    setNewHwTitle("");
    setAddingHw(false);
  }

  function submitPracticalQuiz() {
    if (selectedQuizAnswer === "backoff") {
      setQuizResult("passed");
      onUpgradeSkillDemonstrated("sk-3", "crs-2");
      setHomework((prev) =>
        prev.map((h) =>
          h.id === "hw-2"
            ? { ...h, status: "Done", loggedMins: h.estimatedMins }
            : h
        )
      );
      addStudyMinutes(20);
    } else {
      setQuizResult("retry");
    }
  }

  function analyzePdf(file?: File) {
    const fname = file ? file.name : "Study_Syllabus_Sample.pdf";
    const sizeLabel = file
      ? `${Math.max(1, Math.round(file.size / 1024))} KB`
      : "215 KB";
    const gapNames = skills
      .filter((s) => s.isMandatoryGap)
      .map((s) => s.name);
    const strongNames = skills
      .filter((s) => !s.isMandatoryGap)
      .slice(0, 3)
      .map((s) => s.name);

    setPdfAudit({
      fileName: fname,
      sizeLabel,
      analyzedAt: "Checked just now",
      matchedTopics:
        strongNames.length > 0 ? strongNames : ["Product Operations"],
      missingGaps:
        gapNames.length > 0
          ? gapNames
          : ["SQL Funnel Queries", "HTTP 503 Retries"],
      recommendedNext:
        "Finish Step 02 (HW-01 & Practical Quiz) to close these gaps.",
      summary: `We compared "${fname}" against your ${skills.length} tracked skills and highlighted the topics to focus on first.`,
    });
    addStudyMinutes(10);
  }

  function buildTutorReply(promptText: string): string {
    const q = promptText.toLowerCase();
    const gapList = skills
      .filter((s) => s.isMandatoryGap)
      .map((s) => s.name)
      .join(", ");
    if (q.includes("sql") || q.includes("hw-01") || q.includes("cohort")) {
      return `For HW-01 (${activeCourse?.title}), wrap DATE_TRUNC('week', created_at) in a base CTE first, then LEFT JOIN your conversion table so users who never converted still show up in the denominator.`;
    }
    if (q.includes("503") || q.includes("retry") || q.includes("hw-02")) {
      return `For HTTP 503 retries: (1) keep the user's draft answers safe locally, (2) retry once with a short wait, and (3) offer a plain fallback option if the server is still down.`;
    }
    if (q.includes("pdf") || q.includes("gap")) {
      return `Your top gaps right now are ${gapList || "SQL & API recovery"}. Upload your PDF in Step 03 or go back to Step 02 to mark HW-01 and the Quick Quiz complete.`;
    }
    return `You currently have ${watchedCount}/${courses.length} video lessons watched and ${hwDoneCount}/${homework.length} homework items done. Focus on "${homework.find((h) => h.status !== "Done")?.title || "HW-01"}" next for the fastest boost.`;
  }

  function sendTutorMessage(custom?: string) {
    const txt = (custom ?? chatInput).trim();
    if (!txt) return;
    setChatMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: "student", timestamp: "You", text: txt },
      {
        id: `t-${Date.now() + 1}`,
        sender: "tutor",
        timestamp: "Aristotle Tutor",
        text: buildTutorReply(txt),
      },
    ]);
    if (!custom) setChatInput("");
  }

  function openTutorChat(initialPrompt?: string) {
    setStep("chatbot");
    if (initialPrompt) {
      sendTutorMessage(initialPrompt);
    }
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        chatSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        chatInputRef.current?.focus();
      }, 60);
    }
  }

  const currentStepIdx = STEP_ITEMS.findIndex((s) => s.id === step);
  const nextStep =
    currentStepIdx < STEP_ITEMS.length - 1
      ? STEP_ITEMS[currentStepIdx + 1]
      : null;
  const prevStep = currentStepIdx > 0 ? STEP_ITEMS[currentStepIdx - 1] : null;

  return (
    <div className="space-y-6">
      {/* 1. CLEAN ORIENTATION HEADER (Simple summary + Aristotle & Alexander image) */}
      <section className="rounded-[24px] border border-[#dcd2bd] bg-[#faf6ed] p-5 sm:p-6">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <div className="space-y-1.5">
              <Eyebrow label="Lyceum Learning Path · Guided 4-Step Studio" />
              <h1 className="font-serif-display text-[clamp(1.85rem,3vw,2.5rem)] leading-[1.06] tracking-[-0.02em] text-[#212d3d]">
                Learn Step by Step,{" "}
                <span className="italic text-[#5a6675]">Verify With Proof.</span>
              </h1>
              <p className="max-w-[58ch] text-[13.5px] leading-relaxed text-[#5a6675]">
                New here? Follow Steps 01 to 04 below in order: watch a short
                lesson, finish your homework check, upload any PDF to scan, or
                ask the Aristotle Tutor whenever you get stuck.
              </p>
            </div>

            {/* 3 Simple Progress Stats + Quick Log Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusPill
                label={`Lessons: ${watchedCount}/${courses.length} watched`}
                tone="info"
                dot={false}
              />
              <StatusPill
                label={`Homework: ${hwDoneCount}/${homework.length} done`}
                tone="success"
                dot={false}
              />
              <StatusPill
                label={`Studied: ${Math.round((totalStudyMins / 60) * 10) / 10} hrs`}
                tone="navy"
                dot={false}
              />
              <button
                type="button"
                onClick={() => addStudyMinutes(15)}
                className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-3.5 py-1 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
              >
                +15m Log Study
              </button>
              <Link
                href="/dashboard/learning/catalog"
                className="rounded-full border border-[#cfc2a5] bg-white px-3.5 py-1 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
              >
                Full Course Catalog -&gt;
              </Link>
              <Link
                href="/dashboard/learning/assessments"
                className="rounded-full bg-[#212d3d] px-3.5 py-1 text-[11.5px] font-medium text-[#faf6ed] hover:bg-[#314158]"
              >
                Athena Skill Assessments
              </Link>
            </div>
          </div>

          {/* Right: Aristotle Tutoring Alexander the Great */}
          <div className="flex justify-start lg:col-span-4 lg:justify-end">
            <div className="flex w-full items-center gap-3.5 rounded-[20px] lg:max-w-[310px] border border-[#d6cbb2] bg-[#fffef9] p-3 shadow-xs">
              <img
                src="/images/aristotle-alexander-academy.jpg"
                alt="Aristotle tutoring Alexander the Great at Mieza"
                className="h-24 w-20 shrink-0 rounded-[14px] border border-[#cfc2a5] object-cover object-top"
              />
              <div className="min-w-0 space-y-1">
                <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                  Aristotle × Alexander
                </p>
                <p className="text-[12px] leading-snug text-[#212d3d]">
                  “Master one principle at a time before moving forward.”
                </p>
                <button
                  type="button"
                  onClick={() => openTutorChat()}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#212d3d] px-3 py-1 text-[11px] font-medium text-[#faf6ed] transition-colors hover:bg-[#314158]"
                >
                  <span>Open Tutor Chat</span>
                  <ArrowRightIcon className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. NUMBERED STEP NAVIGATION (Clear left-to-right guide) */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#e5dac2] pt-4 sm:grid-cols-5">
          {STEP_ITEMS.map((item) => {
            const active = step === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setStep(item.id)}
                className={`flex cursor-pointer flex-col rounded-[14px] border px-3.5 py-2.5 text-left transition-all ${
                  active
                    ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed] shadow-sm"
                    : "border-[#dfd4be] bg-white text-[#212d3d] hover:border-[#8f7d5d]"
                }`}
              >
                <span
                  className={`font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    active ? "text-[#d9be83]" : "text-[#7a6b4e]"
                  }`}
                >
                  Step {item.num}
                </span>
                <span className="mt-0.5 text-[13px] font-medium">
                  {item.title}
                </span>
                <span
                  className={`text-[11px] ${
                    active ? "text-[#c8d1de]" : "text-[#6d6250]"
                  }`}
                >
                  {item.hint}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. SINGLE FOCUSED WORKSPACE PANEL FOR THE SELECTED STEP */}
      {/* ==================== STEP 01: WATCH VIDEOS ==================== */}
      {step === "videos" && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7: Video / Lesson Player */}
          <div className="space-y-4 rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-5 sm:p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece5d5] pb-3.5">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                  Step 01 · Choose Lesson &amp; Watch
                </p>
                <h2 className="mt-0.5 font-serif-display text-[22px] text-[#212d3d]">
                  {activeCourse?.title}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowYoutubeEmbed((v) => !v)}
                  className="cursor-pointer rounded-full border border-[#d6cbb2] bg-[#faf6ed] px-3 py-1 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                >
                  {showYoutubeEmbed ? "Show Visual Player" : "Watch Video Stream"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWatchedCourseIds((p) => ({
                      ...p,
                      [activeCourseId]: !p[activeCourseId],
                    }));
                    addStudyMinutes(15);
                  }}
                  className={`cursor-pointer rounded-full px-3.5 py-1 text-[11.5px] font-medium ${
                    watchedCourseIds[activeCourseId]
                      ? "bg-[#067647] text-white"
                      : "bg-[#212d3d] text-[#faf6ed]"
                  }`}
                >
                  {watchedCourseIds[activeCourseId]
                    ? "Completed Lesson"
                    : "Mark Lesson Watched"}
                </button>
              </div>
            </div>

            {/* Select Course */}
            <div className="flex flex-wrap gap-2">
              {courses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveCourseId(c.id);
                    setChapterIdx(0);
                    setPlaybackPct(15);
                    setIsPlaying(false);
                  }}
                  className={`cursor-pointer rounded-[12px] border px-3.5 py-2 text-left text-[12px] ${
                    c.id === activeCourseId
                      ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                      : "border-[#dfd4be] bg-[#faf6ed] text-[#212d3d]"
                  }`}
                >
                  <p className="font-medium">{c.title}</p>
                  <p className="font-mono text-[10px] opacity-80">
                    {c.duration} · {watchedCourseIds[c.id] ? "Watched" : "New"}
                  </p>
                </button>
              ))}
            </div>

            {/* Player View */}
            {showYoutubeEmbed ? (
              <div className="overflow-hidden rounded-[16px] border border-[#2d3b4e] bg-[#1c2635]">
                <div className="aspect-video w-full">
                  <iframe
                    title={activeCourse?.title || "Video lesson"}
                    src={lectureMeta.embedUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-2 text-[11.5px] text-[#ebe4d4]">
                  <span>{activeCourse?.provider}</span>
                  <a
                    href={lectureMeta.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#d9be83] underline"
                  >
                    Open Source Page
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <LectureTheaterCanvas
                  courseId={activeCourseId}
                  chapterIndex={chapterIdx}
                  progressPct={playbackPct}
                  isPlaying={isPlaying}
                />
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                    >
                      {isPlaying ? "Pause" : "Play Lesson"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next =
                          (chapterIdx + 1) % lectureMeta.chapters.length;
                        setChapterIdx(next);
                        setPlaybackPct(Math.round((next / 3) * 85) + 10);
                      }}
                      className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-3 py-1.5 text-[11.5px] font-medium text-[#212d3d]"
                    >
                      Next Chapter
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#5a6675]">
                      {currentChapter.time} / {lectureMeta.durationLabel}
                    </span>
                    <div className="inline-flex rounded-full border border-[#d6cbb2] bg-white p-0.5">
                      {([1, 1.5, 2] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setPlaybackSpeed(s)}
                          className={`cursor-pointer rounded-full px-2 py-0.5 font-mono text-[10px] ${
                            playbackSpeed === s
                              ? "bg-[#212d3d] text-[#faf6ed]"
                              : "text-[#5a6675]"
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapters List */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {lectureMeta.chapters.map((ch, idx) => (
                <button
                  key={ch.time}
                  type="button"
                  onClick={() => {
                    setChapterIdx(idx);
                    setPlaybackPct(Math.round((idx / 3) * 85) + 10);
                  }}
                  className={`cursor-pointer rounded-[12px] border p-3 text-left ${
                    chapterIdx === idx
                      ? "border-[#212d3d] bg-[#f4efe3]"
                      : "border-[#ece5d5] bg-white hover:border-[#cfc2a5]"
                  }`}
                >
                  <p className="font-mono text-[10px] font-semibold text-[#7a6b4e]">
                    {ch.time} · Chapter {idx + 1}
                  </p>
                  <p className="mt-0.5 text-[12.5px] font-medium text-[#212d3d]">
                    {ch.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right 5: Weekly Tracker + Simple Study Notes */}
          <div className="space-y-4 rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-5 sm:p-6 lg:col-span-5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                Your Progress This Week
              </p>
              <h3 className="mt-0.5 font-serif-display text-[20px] text-[#212d3d]">
                Study Activity Tracker
              </h3>
            </div>

            <LearningTrackerChartCanvas
              hoursByDay={studyDays}
              hwDone={hwDoneCount}
              hwTotal={homework.length}
              watchedCount={watchedCount}
            />

            <div className="border-t border-[#ece5d5] pt-4 space-y-2.5">
              <p className="text-[12.5px] font-medium text-[#212d3d]">
                Jot Down a Quick Note at {currentChapter.time}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!noteInput.trim()) return;
                  setVideoNotes((p) => [
                    {
                      id: `vn-${Date.now()}`,
                      timestamp: currentChapter.time,
                      text: noteInput.trim(),
                    },
                    ...p,
                  ]);
                  setNoteInput("");
                }}
                className="flex gap-2"
              >
                <input id="learningskillsview-input-1" name="learningskillsview-input-1" aria-label="learningskillsview input 1"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Write takeaway here..."
                  className="flex-1 rounded-full border border-[#d6cbb2] bg-[#faf6ed] px-3.5 py-1.5 text-[12px]"
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                >
                  Save
                </button>
              </form>
              <div className="space-y-1.5">
                {videoNotes.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    className="rounded-[10px] bg-[#faf6ed] px-3 py-2 text-[12px] text-[#212d3d]"
                  >
                    <span className="mr-2 font-mono text-[10.5px] font-semibold text-[#7a6b4e]">
                      {n.timestamp}
                    </span>
                    {n.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== STEP 02: HOMEWORK & QUIZ ==================== */}
      {step === "homework" && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7: Simple Homework Checklist */}
          <div className="space-y-4 rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-5 sm:p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece5d5] pb-3.5">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                  Step 02 · What To Practice Next
                </p>
                <h2 className="mt-0.5 font-serif-display text-[22px] text-[#212d3d]">
                  Your Homework Checklist ({hwDoneCount}/{homework.length} Done)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAddingHw((v) => !v)}
                className="cursor-pointer rounded-full border border-[#212d3d] bg-[#faf6ed] px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d]"
              >
                {addingHw ? "Cancel" : "+ Add Homework"}
              </button>
            </div>

            {addingHw && (
              <form
                onSubmit={handleCreateHomework}
                className="flex flex-col gap-2 rounded-[14px] border border-[#dcd2bd] bg-[#faf6ed] p-3 sm:flex-row"
              >
                <input id="learningskillsview-input-2" name="learningskillsview-input-2" aria-label="learningskillsview input 2"
                  required
                  value={newHwTitle}
                  onChange={(e) => setNewHwTitle(e.target.value)}
                  placeholder="Enter a homework task..."
                  className="flex-1 rounded-[10px] border border-[#dad6ca] bg-white px-3 py-1.5 text-[12.5px]"
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                >
                  Save Task
                </button>
              </form>
            )}

            <div className="divide-y divide-[#ece5d5]">
              {homework.map((hw) => {
                const isDone = hw.status === "Done";
                return (
                  <div
                    key={hw.id}
                    className="flex flex-col justify-between gap-3 py-3.5 first:pt-1 last:pb-1 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#f2eee2] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#212d3d]">
                          {hw.code}
                        </span>
                        <p
                          className={`text-[14px] font-medium ${
                            isDone
                              ? "line-through text-[#6d6250]"
                              : "text-[#212d3d]"
                          }`}
                        >
                          {hw.title}
                        </p>
                        <StatusPill
                          label={hw.status}
                          tone={isDone ? "success" : "warning"}
                          dot={false}
                        />
                      </div>
                      <p className="text-[12px] text-[#5a6675]">
                        {hw.deliverable} · Due {hw.dueLabel}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleHomeworkDone(hw.id)}
                        className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[11.5px] font-medium ${
                          isDone
                            ? "border border-[#d8ceb9] bg-white text-[#212d3d]"
                            : "bg-[#212d3d] text-[#faf6ed]"
                        }`}
                      >
                        {isDone ? "Reopen" : "Mark Done"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          openTutorChat(`Help me finish ${hw.code}: ${hw.title}`)
                        }
                        className="cursor-pointer rounded-full border border-[#d8ceb9] bg-[#faf6ed] px-3 py-1.5 text-[11.5px] font-medium text-[#212d3d]"
                      >
                        Ask Tutor
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5: Simple 1-Question Practical Quiz */}
          <div className="space-y-4 rounded-[24px] border border-[#dad6ca] bg-[#f4efe3] p-5 sm:p-6 lg:col-span-5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                HW-02 Verification Quiz
              </p>
              <h3 className="mt-0.5 font-serif-display text-[21px] text-[#212d3d]">
                Prove API Recovery Skill
              </h3>
              <p className="mt-1 text-[12.5px] text-[#5a6675]">
                Answer correctly to upgrade your skill profile from estimate to
                Demonstrated in Vex.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[13px] font-medium text-[#212d3d]">
                What should happen first if a third-party job source returns HTTP
                503?
              </p>
              {[
                {
                  id: "silent",
                  text: "Silently invent placeholder job listings so the screen stays full.",
                },
                {
                  id: "backoff",
                  text: "Keep saved jobs intact, retry once cleanly, and show a manual fallback.",
                },
                {
                  id: "wipe",
                  text: "Clear user drafts and send them back to login.",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedQuizAnswer(opt.id);
                    setQuizResult("idle");
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-[12px] border px-3.5 py-2.5 text-left text-[12.5px] ${
                    selectedQuizAnswer === opt.id
                      ? "border-[#212d3d] bg-white font-medium text-[#212d3d]"
                      : "border-[#dad6ca] bg-[#faf6ed] text-[#212d3d]"
                  }`}
                >
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[#212d3d]">
                    {selectedQuizAnswer === opt.id && (
                      <span className="h-2 w-2 rounded-full bg-[#212d3d]" />
                    )}
                  </span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={submitPracticalQuiz}
              className="w-full cursor-pointer rounded-full bg-[#212d3d] px-4 py-2 text-[12.5px] font-medium text-[#faf6ed] hover:bg-[#314158]"
            >
              Submit Answer
            </button>

            {quizResult === "passed" && (
              <p className="rounded-[12px] border border-[#067647]/30 bg-white px-3.5 py-2 text-[12px] font-medium text-[#067647]">
                Correct! HW-02 marked Done and skill promoted to Demonstrated in
                Vex.
              </p>
            )}
            {quizResult === "retry" && (
              <p className="rounded-[12px] border border-[#b42318]/30 bg-white px-3.5 py-2 text-[12px] font-medium text-[#b42318]">
                Not quite — never discard drafts or invent data. Try option 2!
              </p>
            )}
          </div>
        </section>
      )}

      {/* ==================== STEP 03: UPLOAD PDF CHECKER ==================== */}
      {step === "pdf" && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 6: Upload Zone */}
          <div className="space-y-4 rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-5 sm:p-6 lg:col-span-6">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                Step 03 · Upload a Study Document
              </p>
              <h2 className="mt-0.5 font-serif-display text-[22px] text-[#212d3d]">
                Upload PDF To Check What To Study
              </h2>
              <p className="mt-1 text-[12.5px] text-[#5a6675]">
                Drop a syllabus, homework PDF, or job study sheet. We check what
                matches your skills and what needs practice.
              </p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-[18px] border-2 border-dashed border-[#cfc2a5] bg-[#faf6ed] p-6 text-center transition-colors hover:border-[#212d3d]"
            >
              <input id="learningskillsview-input-3" name="learningskillsview-input-3" aria-label="learningskillsview input 3"
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf,.txt,.md"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) analyzePdf(file);
                }}
              />
              <p className="text-[13.5px] font-medium text-[#212d3d]">
                Click here to choose a PDF file
              </p>
              <p className="mt-1 text-[12px] text-[#5a6675]">
                Accepts `.pdf`, `.txt`, `.md` files right in your browser
              </p>
              <span className="mt-3 inline-block rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed]">
                Choose PDF File
              </span>
            </div>

            <div className="space-y-2">
              <textarea id="learningskillsview-textarea-4" name="learningskillsview-textarea-4" aria-label="learningskillsview textarea 4"
                rows={2}
                value={pdfExcerpt}
                onChange={(e) => setPdfExcerpt(e.target.value)}
                placeholder="Or paste notes from your PDF here..."
                className="w-full rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] p-3 text-[12.5px]"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => analyzePdf()}
                  className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-4 py-1.5 text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                >
                  Run Sample PDF Check
                </button>
              </div>
            </div>
          </div>

          {/* Right 6: Clear Plain-English Results */}
          <div className="flex flex-col justify-between space-y-4 rounded-[24px] border border-[#dad6ca] bg-[#faf6ed] p-5 sm:p-6 lg:col-span-6">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                Scan Results
              </p>
              <h3 className="mt-0.5 font-serif-display text-[21px] text-[#212d3d]">
                {pdfAudit ? pdfAudit.fileName : "No PDF Uploaded Yet"}
              </h3>
            </div>

            {pdfAudit ? (
              <div className="space-y-3 rounded-[16px] border border-[#e0d6c1] bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#5a6675]">
                    Size: {pdfAudit.sizeLabel}
                  </span>
                  <StatusPill
                    label={pdfAudit.analyzedAt}
                    tone="success"
                    dot={false}
                  />
                </div>
                <p className="text-[12.5px] text-[#212d3d]">{pdfAudit.summary}</p>
                <div className="space-y-1.5 rounded-[12px] bg-[#faf6ed] p-3 text-[12px]">
                  <p className="font-medium text-[#067647]">
                    Already Strong: {pdfAudit.matchedTopics.join(", ")}
                  </p>
                  <p className="font-medium text-[#b54708]">
                    Needs Practice: {pdfAudit.missingGaps.join(", ")}
                  </p>
                  <p className="text-[#212d3d]">
                    <strong>Suggested Next Step:</strong>{" "}
                    {pdfAudit.recommendedNext}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    openTutorChat("Help me review the gaps in my uploaded PDF")
                  }
                  className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-2 text-[12px] font-medium text-[#faf6ed]"
                >
                  Ask Aristotle Tutor About These Gaps
                </button>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-[16px] border border-dashed border-[#d6cbb2] bg-white p-6 text-center text-[13px] text-[#5a6675]">
                Upload a PDF or click &ldquo;Run Sample PDF Check&rdquo; on the
                left to inspect matched topics and suggested homework.
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================== STEP 04: ARISTOTLE CHATBOT ==================== */}
      {step === "chatbot" && (
        <section
          ref={chatSectionRef}
          className="grid grid-cols-1 gap-6 scroll-mt-20 lg:grid-cols-12"
        >
          {/* Left 8: Dedicated Clean Chatbot Window */}
          <div className="flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#dad6ca] bg-[#fffef9] lg:col-span-8">
            <div className="flex items-center justify-between border-b border-[#ece5d5] bg-[#faf6ed] px-5 py-4">
              <div className="flex items-center gap-3">
                <img
                  src="/images/aristotle-alexander-academy.jpg"
                  alt="Aristotle Tutor"
                  className="h-11 w-11 rounded-full border border-[#cfc2a5] object-cover object-top"
                />
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                    Step 04 · Personal Study Assistant
                  </p>
                  <h2 className="font-serif-display text-[21px] leading-none text-[#212d3d]">
                    Aristotle Lyceum Tutor
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatMessages((p) => p.slice(0, 1))}
                className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-3 py-1 text-[11.5px] font-medium text-[#5a6675] hover:text-[#212d3d]"
              >
                Clear Chat
              </button>
            </div>

            <div className="max-h-[360px] flex-1 space-y-3 overflow-y-auto p-5">
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-[16px] p-3.5 text-[13px] leading-relaxed ${
                    m.sender === "student"
                      ? "ml-10 bg-[#212d3d] text-[#faf6ed]"
                      : "mr-10 border border-[#e3dac5] bg-[#faf6ed] text-[#212d3d]"
                  }`}
                >
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] opacity-75">
                    {m.timestamp}
                  </p>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendTutorMessage();
              }}
              className="flex gap-2 border-t border-[#ece5d5] bg-[#faf6ed] p-4"
            >
              <input id="learningskillsview-input-5" name="learningskillsview-input-5" aria-label="learningskillsview input 5"
                ref={chatInputRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your question here (e.g. Explain HW-01 SQL CTEs)..."
                className="flex-1 rounded-full border border-[#d6cbb2] bg-white px-4 py-2 text-[13px]"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed]"
              >
                Send
              </button>
            </form>
          </div>

          {/* Right 4: One-Click Quick Prompts for Beginners */}
          <div className="space-y-3 rounded-[24px] border border-[#dad6ca] bg-[#f4efe3] p-5 lg:col-span-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
              Quick Prompts (Click To Ask)
            </p>
            <div className="space-y-2">
              {[
                "Help me solve HW-01 SQL query",
                "Explain HTTP 503 safe retries",
                "What should I study from my PDF gaps?",
                "What homework should I finish first?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendTutorMessage(prompt)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-[14px] border border-[#d6cbb2] bg-white px-3.5 py-2.5 text-left text-[12.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                >
                  <span>{prompt}</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== STEP 05: MY SKILL TRACKER ==================== */}
      {step === "skills" && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 rounded-[24px] border border-[#dad6ca] bg-[#fffef9] p-5 sm:p-6 lg:col-span-8">
            <h2 className="font-serif-display text-[22px] text-[#212d3d]">
              Your Tracked Skills ({skills.length})
            </h2>
            <div className="divide-y divide-[#ece5d5]">
              {skills.map((sk) => (
                <div key={sk.id} className="py-3.5 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-serif-display text-[19px] text-[#212d3d]">
                      {sk.name}
                    </p>
                    <SkillTierBadge tier={sk.evidenceTier} />
                  </div>
                  <p className="text-[12px] text-[#5a6675]">
                    {sk.category} · Level: {sk.proficiency} · Confidence:{" "}
                    {sk.confidence}
                  </p>
                  {sk.challengeHistory.length > 0 && (
                    <p className="rounded-[10px] bg-[#faf6ed] px-3 py-1.5 text-[11.5px] text-[#5a6675]">
                      Note: {sk.challengeHistory[sk.challengeHistory.length - 1]}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setChallengeOpenId(challengeOpenId === sk.id ? null : sk.id)
                    }
                    className="cursor-pointer text-[12px] font-medium text-[#175cd3] underline"
                  >
                    {challengeOpenId === sk.id ? "Close" : "Challenge / Add Proof"}
                  </button>
                  {challengeOpenId === sk.id && (
                    <div className="flex gap-2 pt-1">
                      <input id="learningskillsview-input-6" name="learningskillsview-input-6" aria-label="learningskillsview input 6"
                        value={challengeNote}
                        onChange={(e) => setChallengeNote(e.target.value)}
                        placeholder="Add proof link or correction..."
                        className="flex-1 rounded-full border border-[#d6cbb2] bg-[#faf6ed] px-3 py-1 text-[12px]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (challengeNote.trim()) {
                            onChallengeSkill(sk.id, challengeNote.trim());
                            setChallengeNote("");
                            setChallengeOpenId(null);
                          }
                        }}
                        className="cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1 text-[11.5px] font-medium text-[#faf6ed]"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-[24px] border border-[#dad6ca] bg-[#f2eee2] p-5 lg:col-span-4">
            <h3 className="font-serif-display text-[20px] text-[#212d3d]">
              In-Demand Benchmarks
            </h3>
            {MARKET_DEMAND_BENCHMARKS.map((m) => (
              <div
                key={m.skill}
                className="flex items-center justify-between gap-2 rounded-[12px] border border-[#dad6ca] bg-white px-3 py-2 text-[12px]"
              >
                <div>
                  <p className="font-medium text-[#212d3d]">{m.skill}</p>
                  <p className="text-[11px] text-[#5a6675]">{m.demandChange}</p>
                </div>
                <StatusPill label={m.priority} tone="navy" dot={false} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. GUIDED NEXT / PREVIOUS STEP FOOTER (Makes navigation unmistakable) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#e3dac5] bg-[#faf6ed] px-5 py-3">
        <div>
          {prevStep ? (
            <button
              type="button"
              onClick={() => setStep(prevStep.id)}
              className="cursor-pointer rounded-full border border-[#d6cbb2] bg-white px-4 py-1.5 text-[12px] font-medium text-[#212d3d] hover:border-[#212d3d]"
            >
              Back: Step {prevStep.num} · {prevStep.title}
            </button>
          ) : (
            <span className="font-mono text-[11px] text-[#7a6b4e]">
              You are on Step 01 of 05
            </span>
          )}
        </div>

        {nextStep && (
          <button
            type="button"
            onClick={() => setStep(nextStep.id)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed] hover:bg-[#314158]"
          >
            <span>
              Next: Step {nextStep.num} · {nextStep.title}
            </span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
