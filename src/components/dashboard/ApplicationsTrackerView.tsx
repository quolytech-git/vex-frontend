"use client";

import { useQuickAction, focusField } from "@/lib/quick-actions";
import PhonePortal from "@/components/mobile/PhonePortal";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  type DashboardApplication,
  type DashboardSectionId,
  INITIAL_RECRUITER_EMAILS,
  type SubmissionState,
  type TrackerStage,
} from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { CheckIcon } from "@/components/Icons";
import { StatusPill, SubmissionStateBadge } from "./StatusBadge";
import {
  ApplicationsCadenceCanvas,
  SubmissionShareCanvas,
  TrackerChronometerCanvas,
  type SubmissionFilterMode,
} from "./TrackerCharts";
import TrackerCalendarCard, {
  formatHumanDate,
  type CalendarEventMarker,
} from "./TrackerCalendarCard";

interface CenturyMasterwork {
  id: string;
  century: string;
  paintingTitle: string;
  philosopher: string;
  maxim: string;
  image: string;
}

const CENTURY_MASTERWORKS: CenturyMasterwork[] = [
  {
    id: "raphael-1511",
    century: "XVI Century · 1511",
    paintingTitle: "Raphael · The School of Athens",
    philosopher: "Aristotle & Plato",
    maxim: "Empiricism meets first principles: log only verified evidence before sending.",
    image: "/images/raphael-athens.jpg",
  },
  {
    id: "michelangelo-1512",
    century: "XVI Century · 1512",
    paintingTitle: "Michelangelo · Creation Study",
    philosopher: "Seneca the Younger",
    maxim: "Fortune favors prepared hands — every draft awaits your explicit consent click.",
    image: "/images/michelangelo-hands.jpg",
  },
  {
    id: "davinci-1490",
    century: "XV Century · 1490",
    paintingTitle: "Da Vinci · Vitruvian Codex",
    philosopher: "Leonardo da Vinci",
    maxim: "Measure cadence, proportion, and follow-up timing before committing an outreach.",
    image: "/images/davinci-codex.jpg",
  },
  {
    id: "hellas-447bce",
    century: "Classical Era · 447 BCE",
    paintingTitle: "Athenian Agora Wayfinder",
    philosopher: "Marcus Aurelius",
    maxim: "Discipline over noise: separate Prepared drafts from Verified submissions.",
    image: "/images/greek-philosopher-roadmap.jpg",
  },
];

interface TrackerSessionItem {
  id: string;
  dateKey: string;
  time: string;
  title: string;
  subtitle: string;
  avatars: string[];
  extraCount?: number;
  privateMode: boolean;
}

const TODAY_DATE_KEY = "2026-11-14";

const INITIAL_TRACKER_SESSIONS: TrackerSessionItem[] = [
  {
    id: "sess-1",
    dateKey: "2026-11-14",
    time: "09:20",
    title: "Daily Application Truth Review",
    subtitle: "Aristotle · Prepared vs Verified Evidence",
    avatars: ["/images/raphael-athens.jpg", "/images/davinci-profile-bust.jpg"],
    extraCount: 2,
    privateMode: true,
  },
  {
    id: "sess-2",
    dateKey: "2026-11-14",
    time: "11:00",
    title: "Stoic Interview & Objection Sprint",
    subtitle: "Marcus Aurelius · Calm Panel Readiness",
    avatars: ["/images/michelangelo-hands.jpg"],
    privateMode: false,
  },
  {
    id: "sess-3",
    dateKey: "2026-11-18",
    time: "10:00",
    title: "Live Product Ops Architecture Panel",
    subtitle: "Seneca · Verified Submission Follow-up",
    avatars: ["/images/davinci-codex.jpg"],
    privateMode: true,
  },
  {
    id: "sess-4",
    dateKey: "2026-11-20",
    time: "15:00",
    title: "SQL Cohort Portfolio Sign-off",
    subtitle: "Da Vinci · Evidence Diff Audit",
    avatars: ["/images/greek-philosopher-roadmap.jpg"],
    privateMode: false,
  },
];

const STAGES: TrackerStage[] = [
  "Planned",
  "Prepared",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const SUPPORTED_SITES = [
  { site: "Greenhouse Boards", status: "Supported", checked: "Tested today", enabled: true },
  { site: "Lever Careers", status: "Partly supported", checked: "Tested 2d ago", enabled: true },
  { site: "Workday Custom Portals", status: "Partly supported", checked: "Tested 4d ago", enabled: false },
  { site: "Proprietary PDF / Custom Forms", status: "Unsupported (Manual Pack)", checked: "Always honest", enabled: false },
];

interface ApplicationsTrackerViewProps {
  applications: DashboardApplication[];
  onAddApplication: (
    company: string,
    title: string,
    deadline: string,
    priority: "High" | "Standard",
    url?: string
  ) => void;
  onUpdateStage: (appId: string, stage: TrackerStage) => void;
  onUpdateSubmission: (appId: string, state: SubmissionState, evidence: string) => void;
  onUpdateNotes: (appId: string, notes: string, followUpDate: string) => void;
  onFillExtensionField: (appId: string, fieldId: string, value: string) => void;
  onNavigate: (section: DashboardSectionId) => void;
}

export default function ApplicationsTrackerView({
  applications,
  onAddApplication,
  onUpdateStage,
  onUpdateSubmission,
  onUpdateNotes,
  onFillExtensionField,
  onNavigate,
}: ApplicationsTrackerViewProps) {
  const [viewMode, setViewMode] = useState<"board" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "company" | "stage">("priority");
  const [selectedId, setSelectedId] = useState<string>(applications[0]?.id || "");
  // Phone-only layout state: which pane is visible and whether details are open full-screen.
  const [mobilePane, setMobilePane] = useState<"apps" | "calendar" | "focus">("apps");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  function openApp(id: string) {
    setSelectedId(id);
    setMobileDetailOpen(true);
  }
  const [activeDrawerTab, setActiveDrawerTab] = useState<
    "readiness" | "extension" | "history" | "inbox"
  >("readiness");
  const [extensionScenario, setExtensionScenario] = useState<
    "supported" | "review" | "unsupported"
  >("supported");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  useQuickAction("log-application", () => setShowAddModal(true));
  const [manualCompany, setManualCompany] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [manualDeadline, setManualDeadline] = useState("In 5 days");
  const [manualPriority, setManualPriority] = useState<"High" | "Standard">("High");
  const [manualUrl, setManualUrl] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [siteToggles, setSiteToggles] = useState<Record<string, boolean>>({
    "Greenhouse Boards": true,
    "Lever Careers": true,
    "Workday Custom Portals": false,
  });

  // Bento Chronometer, Calendar, Cadence, & Sessions state
  const [chronoMinutes, setChronoMinutes] = useState<number>(436); // 07:16
  const [chronoRunning, setChronoRunning] = useState<boolean>(true);
  const [chronoPeriod, setChronoPeriod] = useState<"Today" | "Week" | "Sprint">("Today");
  const [centuryIdx, setCenturyIdx] = useState<number>(0);
  const [cadenceFilter, setCadenceFilter] = useState<"All" | "High Priority" | "Interviews">("All");
  const [submissionFilter, setSubmissionFilter] = useState<SubmissionFilterMode>("all");

  // Full Interactive Calendar state
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(10); // November
  const [selectedDateKey, setSelectedDateKey] = useState<string>(TODAY_DATE_KEY);

  const [sessions, setSessions] = useState<TrackerSessionItem[]>(INITIAL_TRACKER_SESSIONS);
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionTime, setNewSessionTime] = useState("14:30");

  useEffect(() => {
    if (!chronoRunning) return;
    const timer = setInterval(() => {
      setChronoMinutes((m) => m + 1);
    }, 15000);
    return () => clearInterval(timer);
  }, [chronoRunning]);

  const activeCentury = CENTURY_MASTERWORKS[centuryIdx] ?? CENTURY_MASTERWORKS[0];

  const submissionBreakdown = useMemo(() => {
    const prepared = applications.filter((a) => a.submissionState === "prepared").length;
    const reported = applications.filter((a) => a.submissionState === "user-reported-submitted").length;
    const verified = applications.filter((a) => a.submissionState === "verified-submitted").length;
    return { prepared, reported, verified };
  }, [applications]);

  const cadenceApps = useMemo(() => {
    if (cadenceFilter === "High Priority") {
      return applications.filter((a) => a.priority === "High");
    }
    if (cadenceFilter === "Interviews") {
      return applications.filter((a) => a.stage === "Interview" || Boolean(a.interviewDate));
    }
    return applications;
  }, [applications, cadenceFilter]);

  const calendarMarkers: CalendarEventMarker[] = useMemo(() => {
    const list: CalendarEventMarker[] = sessions.map((s) => ({
      dateKey: s.dateKey,
      kind: "session",
    }));
    list.push(
      { dateKey: "2026-11-18", kind: "interview" },
      { dateKey: "2026-11-24", kind: "interview" },
      { dateKey: "2026-11-16", kind: "deadline" },
      { dateKey: "2026-11-21", kind: "deadline" }
    );
    return list;
  }, [sessions]);

  const sessionsForSelectedDate = useMemo(
    () => sessions.filter((s) => s.dateKey === selectedDateKey),
    [sessions, selectedDateKey]
  );

  function changeMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function jumpToday() {
    setViewYear(2026);
    setViewMonth(10);
    setSelectedDateKey(TODAY_DATE_KEY);
  }

  function toggleSessionPrivacy(id: string) {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, privateMode: !s.privateMode } : s))
    );
  }

  function removeSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  function addTrackerSession(e: React.FormEvent) {
    e.preventDefault();
    const title = newSessionTitle.trim();
    if (!title) return;
    setSessions((prev) => [
      ...prev,
      {
        id: `sess-${Date.now()}`,
        dateKey: selectedDateKey,
        time: newSessionTime || "15:00",
        title,
        subtitle: `${activeCentury.philosopher} · Scheduled Block`,
        avatars: [activeCentury.image],
        privateMode: true,
      },
    ]);
    setNewSessionTitle("");
    setShowNewSessionForm(false);
  }

  const filteredApplications = applications
    .filter((app) => {
      if (submissionFilter !== "all" && app.submissionState !== submissionFilter) {
        return false;
      }
      if (!searchTerm.trim()) return true;
      const q = searchTerm.trim().toLowerCase();
      return `${app.title} ${app.company} ${app.stage} ${app.notes}`
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "company") return a.company.localeCompare(b.company);
      if (sortBy === "stage") return a.stage.localeCompare(b.stage);
      if (a.priority === b.priority) return 0;
      return a.priority === "High" ? -1 : 1;
    });

  const activeApp =
    filteredApplications.find((a) => a.id === selectedId) ||
    filteredApplications[0] ||
    applications[0] ||
    null;

  function copyPackValue(key: string, text: string) {
    try {
      navigator.clipboard?.writeText(text);
    } catch {
      // Clipboard optional in sandboxed preview
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1600);
  }

  return (
    <div className="space-y-6">
      {/* ==================================================================== */}
      {/* 1. CLASSICAL CHRONOMETER & TRACKER BENTO (Adapted from Reference UI) */}
      {/* ==================================================================== */}
      <div className="vex-m-flat rounded-[28px] border border-[#dcd2bd] bg-[#ede8dc] p-4 shadow-[0_14px_40px_rgba(33,45,61,0.06)] sm:p-6">
        {/* Top Century Masterwork & Mode Switcher Strip */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className={`${mobilePane !== "focus" ? "max-lg:hidden" : ""} flex flex-wrap items-center gap-2.5`}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#cbbda0] bg-[#fffef9] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#212d3d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4c7b59]" />
              {activeCentury.century} · {activeCentury.philosopher}
            </span>
            <span className="text-[12px] text-[#5c5344]">
              {activeCentury.paintingTitle}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-1.5 text-[12px] font-medium text-[#faf6ed] hover:bg-[#33445c]"
            >
              + Add application manually
            </button>
            <div className="inline-flex rounded-full border border-[#d4c7ac] bg-[#fffef9] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`cursor-pointer rounded-full px-3.5 py-1 text-[11.5px] font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "text-[#5a6675] hover:text-[#212d3d]"
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("board")}
                className={`cursor-pointer rounded-full px-3.5 py-1 text-[11.5px] font-medium transition-colors ${
                  viewMode === "board"
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "text-[#5a6675] hover:text-[#212d3d]"
                }`}
              >
                Board
              </button>
            </div>
          </div>
        </div>

        {/* Phone: one pane at a time instead of the stacked desktop bento */}
        <div className="mb-4 grid grid-cols-3 rounded-[14px] bg-[#e7e0cf] p-1 lg:hidden">
          {(
            [
              { id: "apps", label: `Applications (${applications.length})` },
              { id: "calendar", label: "Calendar" },
              { id: "focus", label: "Focus" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setMobilePane(t.id)}
              className={`relative cursor-pointer rounded-[10px] px-1 py-2 text-[12.5px] font-semibold transition-colors ${
                mobilePane === t.id ? "bg-white text-[#212d3d] shadow-[0_1px_4px_rgba(33,45,61,0.12)]" : "text-[#6f6a5f]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 2x2 Reference Bento Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* TOP-LEFT: OUTREACH CHRONOMETER (Blurred Renaissance Painting + Olive Stone Glass) */}
          <div className={`${mobilePane !== "focus" ? "max-lg:hidden" : ""} relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-[#566a4f]/40 bg-[#465c43] p-5 text-[#fffef9] shadow-[0_18px_40px_-18px_rgba(33,45,61,0.35)] lg:col-span-6`}>
            <img
              src={activeCentury.image}
              alt={activeCentury.paintingTitle}
              className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-md"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, rgba(139,165,112,0.48) 0%, rgba(56,74,52,0.82) 72%, rgba(33,45,61,0.92) 100%)",
              }}
            />

            {/* Card Header */}
            <div className="relative z-10 flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#fffef9]">
                  Outreach Tracker
                </p>
                <p className="mt-0.5 text-[12px] text-[#e4decb]">
                  Week total: {Math.round((chronoMinutes / 60) * 8)}h · {applications.length} roles
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setChronoPeriod((p) =>
                    p === "Today" ? "Week" : p === "Week" ? "Sprint" : "Today"
                  )
                }
                className="cursor-pointer rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[11.5px] font-medium text-[#fffef9] backdrop-blur-sm hover:bg-white/20"
              >
                {chronoPeriod}
              </button>
            </div>

            {/* Centerpiece Carved Chronometer Dial */}
            <div className="relative z-10 my-4">
              <TrackerChronometerCanvas
                elapsedMinutes={chronoMinutes}
                isRunning={chronoRunning}
              />
              <p className="mt-2 text-center text-[11px] italic text-[#efe7d3]">
                &ldquo;{activeCentury.maxim}&rdquo;
              </p>
            </div>

            {/* Bottom Controls: Stop, Play/Pause, Century Switcher & + Add time */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title="Reset session timer"
                  onClick={() => {
                    setChronoRunning(false);
                    setChronoMinutes(436);
                  }}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[12px] bg-[#fffef9] text-[#212d3d] shadow-sm transition-transform hover:scale-105"
                >
                  <span className="h-3 w-3 rounded-[2px] bg-[#212d3d]" />
                </button>
                <button
                  type="button"
                  title={chronoRunning ? "Pause tracker" : "Resume tracker"}
                  onClick={() => setChronoRunning((r) => !r)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[12px] border border-white/25 bg-white/20 text-[#fffef9] backdrop-blur-sm hover:bg-white/30"
                >
                  {chronoRunning ? (
                    <span className="flex gap-1">
                      <span className="h-3.5 w-1 rounded-full bg-white" />
                      <span className="h-3.5 w-1 rounded-full bg-white" />
                    </span>
                  ) : (
                    <svg width="13" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
                      <path d="M1 1.5v11l10-5.5L1 1.5z" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCenturyIdx((i) => (i + 1) % CENTURY_MASTERWORKS.length)}
                  className="cursor-pointer rounded-full border border-white/25 bg-black/20 px-2.5 py-1 text-[10.5px] font-medium text-[#f5ecd9] hover:bg-black/35"
                >
                  Next Painting
                </button>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute -top-6 right-0 whitespace-nowrap rounded-full bg-[#fffef9] px-2 py-0.5 text-[9.5px] font-semibold text-[#212d3d] shadow-sm">
                  Add time
                </span>
                <button
                  type="button"
                  onClick={() => setChronoMinutes((m) => m + 15)}
                  aria-label="Add 15 minutes to focus tracker"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[12px] bg-[#1e261f] text-[18px] font-medium text-[#fffef9] shadow-sm hover:bg-[#2a362c]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* TOP-RIGHT: APPLICATIONS CADENCE & 3-STATE PIPELINE GRAPH */}
          <div className={`${mobilePane !== "focus" ? "max-lg:hidden" : ""} flex flex-col justify-between rounded-[26px] border border-[#dcd2bd] bg-[#fffef9] p-5 lg:col-span-6`}>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#212d3d]">
                  Applications Cadence
                </p>

                <select id="applicationstrackerview-select-1" name="applicationstrackerview-select-1" aria-label="applicationstrackerview select 1"
                  value={cadenceFilter}
                  onChange={(e) =>
                    setCadenceFilter(
                      e.target.value as "All" | "High Priority" | "Interviews"
                    )
                  }
                  className="cursor-pointer rounded-full border border-[#dfd3ba] bg-[#faf6ed] px-3 py-1 text-[11.5px] font-medium text-[#212d3d] focus:outline-none"
                >
                  <option value="All">All Applications</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Interviews">Interviews Only</option>
                </select>
              </div>

              <div className="my-2">
                <ApplicationsCadenceCanvas
                  applications={cadenceApps.length > 0 ? cadenceApps : applications}
                  selectedDayLabel={formatHumanDate(selectedDateKey).slice(0, 6)}
                  onSelectApp={(id) => setSelectedId(id)}
                />
              </div>
            </div>

            <div className="space-y-3 border-t border-[#efe7d3] pt-3">
              <div className="flex flex-wrap items-center gap-4 text-[11.5px] text-[#5c5344]">
                {(cadenceApps.length > 0 ? cadenceApps : applications)
                  .slice(0, 3)
                  .map((app, idx) => {
                    const dots = ["#648349", "#a67bb8", "#98ac70"];
                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedId(app.id)}
                        className="inline-flex cursor-pointer items-center gap-1.5 hover:text-[#212d3d]"
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: dots[idx % dots.length] }}
                        />
                        <span className="font-medium text-[#212d3d]">{app.company}</span>
                      </button>
                    );
                  })}
              </div>

              {/* Interactive 3-State Submission Share Canvas Chart */}
              <div className="rounded-[16px] border border-[#e5dac2] bg-[#faf6ed] p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                    Tracked Proof Share (Click segment to filter list)
                  </span>
                  <span className="font-mono text-[10.5px] font-semibold text-[#212d3d]">
                    {applications.length} Total Roles
                  </span>
                </div>
                <SubmissionShareCanvas
                  prepared={submissionBreakdown.prepared}
                  reported={submissionBreakdown.reported}
                  verified={submissionBreakdown.verified}
                  activeFilter={submissionFilter}
                  onSelectFilter={setSubmissionFilter}
                />
              </div>
            </div>
          </div>

          {/* ROW 2 LEFT: FULL INTERACTIVE MONTHLY CALENDAR */}
          <div className={`${mobilePane !== "calendar" ? "max-lg:hidden" : ""} lg:col-span-5`}>
            <TrackerCalendarCard
              viewYear={viewYear}
              viewMonth={viewMonth}
              selectedDateKey={selectedDateKey}
              todayDateKey={TODAY_DATE_KEY}
              markers={calendarMarkers}
              onSelectDate={setSelectedDateKey}
              onChangeMonth={changeMonth}
              onJumpToday={jumpToday}
            />
          </div>

          {/* ROW 2 RIGHT: SELECTED DAY MILESTONE + WORKING SESSIONS SCHEDULER */}
          <div className={`${mobilePane !== "calendar" ? "max-lg:hidden" : ""} flex flex-col justify-between gap-4 lg:col-span-7`}>
            {/* Milestone Card Linked Live to Calendar Selection & Active Role */}
            <div
              onClick={() => activeApp && setSelectedId(activeApp.id)}
              className="flex cursor-pointer items-center gap-4 rounded-[22px] border border-[#dcd2bd] bg-[#fffef9] p-4 transition-colors hover:border-[#8f7d5d]"
            >
              <div className="shrink-0 rounded-[12px] border border-[#dfd3ba] bg-[#faf6ed] px-3 py-1.5 text-center">
                <p className="font-mono text-[9.5px] uppercase text-[#7a6b4e]">
                  {formatHumanDate(selectedDateKey).slice(0, 3)}
                </p>
                <p className="font-serif-display text-[22px] leading-none text-[#212d3d]">
                  {selectedDateKey.slice(8, 10)}
                </p>
              </div>

              <img
                src="/images/davinci-profile-bust.jpg"
                alt="Classical bust portrait"
                className="h-12 w-12 shrink-0 rounded-full border border-[#d6c9ae] object-cover object-top"
              />

              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7a6b4e]">
                  {activeApp?.interviewDate ? "Interview Active" : "Consent Gate"} ·{" "}
                  {activeCentury.philosopher.split(" ")[0]}
                </p>
                <p className="truncate text-[14px] font-medium text-[#212d3d]">
                  {activeApp ? `${activeApp.company} — ${activeApp.title}` : "Select role"}
                </p>
              </div>
            </div>

            {/* Interactive Sessions Panel Bound Live to Selected Calendar Day */}
            <div className="flex flex-1 flex-col justify-between rounded-[24px] border border-[#dcd2bd] bg-[#fffef9] p-5">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#212d3d]">
                      Sessions · {formatHumanDate(selectedDateKey)}
                    </p>
                    <span className="rounded-full border border-[#dfd3ba] bg-[#faf6ed] px-2 py-0.5 font-mono text-[10.5px] font-semibold text-[#212d3d]">
                      {sessionsForSelectedDate.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNewSessionForm((v) => !v)}
                    className="cursor-pointer rounded-full border border-[#d6c9ae] bg-[#faf6ed] px-3 py-1 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                  >
                    {showNewSessionForm ? "Close" : `+ Schedule on ${selectedDateKey.slice(8)}`}
                  </button>
                </div>

                {showNewSessionForm && (
                  <form
                    onSubmit={addTrackerSession}
                    className="mb-3 flex flex-col gap-2 rounded-[14px] border border-[#dfd3ba] bg-[#faf6ed] p-2.5 sm:flex-row"
                  >
                    <input id="applicationstrackerview-input-2" name="applicationstrackerview-input-2" aria-label="applicationstrackerview input 2"
                      type="time"
                      value={newSessionTime}
                      onChange={(e) => setNewSessionTime(e.target.value)}
                      className="rounded-full border border-[#d6c9ae] bg-white px-2.5 py-1 font-mono text-[11.5px] text-[#212d3d]"
                    />
                    <input id="applicationstrackerview-input-3" name="applicationstrackerview-input-3" aria-label="applicationstrackerview input 3"
                      value={newSessionTitle}
                      onChange={(e) => setNewSessionTitle(e.target.value)}
                      placeholder={`Schedule block on ${formatHumanDate(selectedDateKey)}...`}
                      className="flex-1 rounded-full border border-[#d6c9ae] bg-white px-3 py-1 text-[12px] text-[#212d3d] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1 text-[11.5px] font-medium text-[#faf6ed]"
                    >
                      Save
                    </button>
                  </form>
                )}

                {sessionsForSelectedDate.length === 0 ? (
                  <div className="my-3 rounded-[14px] border border-dashed border-[#d6c9ae] bg-[#faf6ed] p-4 text-center">
                    <p className="text-[12.5px] font-medium text-[#212d3d]">
                      No sessions scheduled on {formatHumanDate(selectedDateKey)}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-[#6d6250]">
                      Click &ldquo;+ Schedule on {selectedDateKey.slice(8)}&rdquo; to pin an interview or follow-up review block.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#efe7d3]">
                    {sessionsForSelectedDate.map((sess) => (
                      <div
                        key={sess.id}
                        className="flex flex-wrap items-center justify-between gap-3 py-2.5 first:pt-1 last:pb-0"
                      >
                        <div className="flex min-w-0 items-center gap-3.5">
                          <span className="font-mono text-[14.5px] font-semibold text-[#212d3d]">
                            {sess.time}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-[#212d3d]">
                              {sess.title}
                            </p>
                            <p className="truncate text-[11px] text-[#6d6250]">{sess.subtitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {sess.avatars.map((src, idx) => (
                              <img
                                key={idx}
                                src={src}
                                alt="Philosopher artwork"
                                className="h-7 w-7 rounded-full border-2 border-[#fffef9] object-cover"
                              />
                            ))}
                            {sess.extraCount && (
                              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#fffef9] bg-[#efe7d3] font-mono text-[10px] font-semibold text-[#212d3d]">
                                +{sess.extraCount}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleSessionPrivacy(sess.id)}
                            className="flex cursor-pointer items-center gap-1.5 text-[11px] text-[#5c5344]"
                          >
                            <span>{sess.privateMode ? "Private" : "Shared"}</span>
                            <span
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                sess.privateMode ? "bg-[#31442c]" : "bg-[#dcd2bd]"
                              }`}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                  sess.privateMode ? "translate-x-4.5" : "translate-x-1"
                                }`}
                              />
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => removeSession(sess.id)}
                            aria-label={`Delete ${sess.title}`}
                            className="cursor-pointer rounded-full border border-[#e2d8c3] px-2 py-0.5 font-mono text-[10px] text-[#6d6250] hover:border-rose-300 hover:text-rose-700"
                          >
                            x
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Famous Paintings & Philosophers Gallery Selector for Tracker Context */}
      <div className={`${mobilePane !== "focus" ? "max-lg:hidden" : ""} grid grid-cols-2 gap-3 lg:grid-cols-4`}>
        {CENTURY_MASTERWORKS.map((work, idx) => {
          const selected = idx === centuryIdx;
          return (
            <button
              key={work.id}
              type="button"
              onClick={() => setCenturyIdx(idx)}
              className={`flex cursor-pointer items-center gap-3 rounded-[16px] border p-2.5 text-left transition-all ${
                selected
                  ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                  : "border-[#dcd2bd] bg-[#fffef9] text-[#212d3d] hover:border-[#8f7d5d]"
              }`}
            >
              <img
                src={work.image}
                alt={work.paintingTitle}
                className="h-11 w-11 shrink-0 rounded-[10px] border border-white/20 object-cover"
              />
              <div className="min-w-0">
                <p
                  className={`truncate font-mono text-[9.5px] uppercase ${
                    selected ? "text-[#d4af63]" : "text-[#7a6b4e]"
                  }`}
                >
                  {work.century}
                </p>
                <p className="truncate text-[12px] font-semibold">{work.philosopher}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Sort Filter Bar */}
      <div className={`${mobilePane !== "apps" ? "max-lg:hidden" : ""} flex flex-col gap-3 rounded-[18px] border border-[#dad6ca] bg-white p-3.5 sm:flex-row sm:items-center`}>
        <input id="applicationstrackerview-input-4" name="applicationstrackerview-input-4" aria-label="applicationstrackerview input 4"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search applications by company, role, stage, or notes…"
          className="flex-1 rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-1.5 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
        />
        {submissionFilter !== "all" && (
          <button
            type="button"
            onClick={() => setSubmissionFilter("all")}
            className="cursor-pointer rounded-[10px] border border-[#212d3d] bg-[#212d3d] px-3 py-1.5 text-[12px] font-medium text-white transition hover:bg-[#314158]"
          >
            Proof Filter: {submissionFilter.replace(/-/g, " ")} (Clear)
          </button>
        )}
        <select id="applicationstrackerview-select-5" name="applicationstrackerview-select-5" aria-label="applicationstrackerview select 5"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "priority" | "company" | "stage")
          }
          className="cursor-pointer rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-1.5 text-[12.5px] font-medium text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
        >
          <option value="priority">Sort by Priority</option>
          <option value="company">Sort by Company (A–Z)</option>
          <option value="stage">Sort by Stage</option>
        </select>
      </div>

      {/* Main Layout: Tracker List/Board + Persistent Side Details & Extension Drawer */}
      <div className={`${mobilePane !== "apps" ? "max-lg:hidden" : ""} grid grid-cols-1 gap-6 lg:grid-cols-12`}>
        {/* Left List or Columns */}
        <div className="space-y-3 lg:col-span-5">
          {viewMode === "list" ? (
            filteredApplications.map((app) => {
              const selected = activeApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => openApp(app.id)}
                  className={`cursor-pointer rounded-[22px] border p-5 transition-colors ${
                    selected
                      ? "border-[#212d3d] bg-[#ece9df]"
                      : "border-[#dad6ca] bg-white hover:bg-[#faf6ed]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-serif-display text-[21px] leading-tight text-[#212d3d]">
                        {app.title}
                      </p>
                      <p className="text-[13px] text-[#5a6675]">
                        {app.company} · Stage: {app.stage}
                      </p>
                    </div>
                    <span className="rounded-full border border-[#dad6ca] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#212d3d]">
                      {app.priority}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <SubmissionStateBadge state={app.submissionState} />
                    {app.quietDays >= 5 && (
                      <StatusPill
                        label={`Quiet ${app.quietDays}d · Follow up?`}
                        tone="warning"
                        dot={false}
                      />
                    )}
                    {app.interviewDate && (
                      <StatusPill
                        label={app.interviewDate}
                        tone="success"
                        dot={false}
                      />
                    )}
                  </div>

                  <p className="mt-2.5 text-[12px] text-[#5a6675]">
                    {app.evidenceText}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["Prepared", "Applied", "Interview", "Planned", "Assessment", "Offer"] as TrackerStage[]).map(
                (stageName) => {
                  const items = filteredApplications.filter((a) => a.stage === stageName);
                  return (
                    <div
                      key={stageName}
                      className="rounded-[18px] border border-[#dad6ca] bg-[#f2eee2] p-3.5"
                    >
                      <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-[#5a6675]">
                        {stageName} ({items.length})
                      </p>
                      <div className="mt-2.5 space-y-2">
                        {items.length === 0 ? (
                          <p className="text-[12px] text-[#5a6675]/75">
                            No roles in this stage
                          </p>
                        ) : (
                          items.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => openApp(item.id)}
                              className={`w-full cursor-pointer rounded-[14px] border p-3 text-left transition-colors ${
                                activeApp?.id === item.id
                                  ? "border-[#212d3d] bg-white"
                                  : "border-[#dad6ca] bg-white/80 hover:bg-white"
                              }`}
                            >
                              <p className="text-[13.5px] font-medium text-[#212d3d]">
                                {item.title}
                              </p>
                              <p className="text-[12px] text-[#5a6675]">
                                {item.company}
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Right Persistent Details & Extension Drawer */}
        {activeApp && (
          <PhonePortal when={mobileDetailOpen}>
          <div className={`space-y-5 rounded-[22px] border border-[#dad6ca] bg-white p-6 lg:col-span-7 ${mobileDetailOpen ? "max-lg:fixed max-lg:inset-0 max-lg:z-[60] max-lg:overflow-y-auto max-lg:rounded-none max-lg:border-0 max-lg:bg-[#f6f1e6] max-lg:px-4 max-lg:pt-0 max-lg:pb-16" : "max-lg:hidden"}`}>
            {/* Phone: native-style nav bar for the full-screen details */}
            <div className="vex-glass-bar sticky top-0 z-10 -mx-4 flex items-center gap-2 px-4 pt-[max(10px,env(safe-area-inset-top))] pb-2.5 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileDetailOpen(false)}
                className="vex-glass-btn flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#212d3d]"
                aria-label="Back to applications"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <p className="min-w-0 flex-1 truncate text-center font-serif-display text-[19px] text-[#212d3d]">{activeApp.company}</p>
              <span className="w-10" />
            </div>
            {/* Top Role + Keyboard Accessible Stage Move */}
            <div className="flex flex-col justify-between gap-4 border-b border-[#dad6ca] pb-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#5a6675]">
                  Application Details
                </p>
                <h2 className="mt-1 font-serif-display text-[26px] leading-tight text-[#212d3d]">
                  {activeApp.title} — {activeApp.company}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SubmissionStateBadge state={activeApp.submissionState} />
                  <Link
                    href={`/dashboard/applications/${activeApp.id}`}
                    className="rounded-full border border-[#cfc4a7] bg-[#faf6ed] px-3 py-1 text-[11px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                  >
                    Open Full Dossier -&gt;
                  </Link>
                  <Link
                    href={`/dashboard/apply/review/${activeApp.id}`}
                    className="rounded-full border border-[#212d3d] bg-white px-3 py-1 text-[11px] font-medium text-[#212d3d] hover:bg-[#212d3d] hover:text-[#faf6ed]"
                  >
                    Vex Apply Review -&gt;
                  </Link>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5a6675]">
                  Move stage (keyboard accessible)
                </label>
                <select id="applicationstrackerview-select-6" name="applicationstrackerview-select-6" aria-label="applicationstrackerview select 6"
                  value={activeApp.stage}
                  onChange={(e) =>
                    onUpdateStage(activeApp.id, e.target.value as TrackerStage)
                  }
                  className="cursor-pointer rounded-full border border-[#dad6ca] bg-[#faf6ed] px-4 py-2 text-[13px] font-medium text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub-Tabs Inside Drawer */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "readiness" as const, label: "Readiness, Notes & Follow-up" },
                { id: "extension" as const, label: "Vex Apply Extension" },
                { id: "inbox" as const, label: "Gmail & Outlook Inbox" },
                { id: "history" as const, label: "History & Sites List" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDrawerTab(tab.id)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                    activeDrawerTab === tab.id
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "bg-[#ece9df] text-[#212d3d] hover:bg-[#e1dcd0]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeDrawerTab === "readiness" && (
              <div className="space-y-5">
                {/* Per-Application Readiness Checklist (#122) */}
                <div className="rounded-[18px] border border-[#dad6ca] bg-[#f2eee2] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-[#212d3d]">
                      Application Readiness Checklist
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate("documents")}
                      className="cursor-pointer text-[12px] font-medium text-[#175cd3] underline"
                    >
                      Open in CV &amp; Letters Studio
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      {
                        label: `CV Variant (${activeApp.cvVariant})`,
                        ok: activeApp.checklist.cvReviewed,
                      },
                      {
                        label: "Tailored cover letter approved",
                        ok: activeApp.checklist.letterApproved,
                      },
                      {
                        label: "Screening answers reviewed",
                        ok: activeApp.checklist.questionsAnswered,
                      },
                      {
                        label: "Extension fields checked",
                        ok: activeApp.checklist.fieldsChecked,
                      },
                    ].map((chk) => (
                      <div
                        key={chk.label}
                        className="flex items-center gap-2 rounded-[12px] bg-white px-3 py-2 text-[12.5px]"
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            chk.ok
                              ? "bg-[#067647] text-white"
                              : "bg-[#b54708]/15 text-[#b54708]"
                          }`}
                        >
                          {chk.ok ? <CheckIcon className="h-2.5 w-2.5" /> : "!"}
                        </span>
                        <span className="text-[#212d3d]">{chk.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Notes & Follow-Up Reminder (#47, #49) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[12.5px] font-medium text-[#212d3d]">
                      Application notes &amp; contacts
                    </label>
                    <textarea id="applicationstrackerview-textarea-7" name="applicationstrackerview-textarea-7" aria-label="applicationstrackerview textarea 7"
                      rows={3}
                      value={activeApp.notes}
                      onChange={(e) =>
                        onUpdateNotes(
                          activeApp.id,
                          e.target.value,
                          activeApp.followUpDate
                        )
                      }
                      className="w-full rounded-[14px] border border-[#dad6ca] bg-[#faf6ed] p-3 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[12.5px] font-medium text-[#212d3d]">
                      Follow-up reminder date
                    </label>
                    <input id="applicationstrackerview-input-8" name="applicationstrackerview-input-8" aria-label="applicationstrackerview input 8"
                      type="date"
                      value={activeApp.followUpDate}
                      onChange={(e) =>
                        onUpdateNotes(activeApp.id, activeApp.notes, e.target.value)
                      }
                      className="w-full rounded-[14px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2.5 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                    <p className="text-[11.5px] text-[#5a6675]">
                      Quiet {activeApp.quietDays}d · Reminder never fabricates employer timing.
                    </p>
                  </div>
                </div>

                {/* Explicit Authorisation Action */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#dad6ca] bg-[#faf6ed] p-4">
                  <div>
                    <p className="text-[13.5px] font-medium text-[#212d3d]">
                      {activeApp.evidenceText}
                    </p>
                    <p className="text-[12px] text-[#5a6675]">
                      Submission status changes only with explicit confirmation or confirmation evidence.
                    </p>
                  </div>
                  {activeApp.submissionState === "prepared" && (
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(true)}
                      className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-2 text-[12.5px] font-medium text-[#faf6ed] hover:bg-[#33445c]"
                    >
                      Authorise &amp; Record Submission
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeDrawerTab === "extension" && (
              <div className="space-y-4">
                {/* Template 11: Three Extension Popup States Preview */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] bg-[#f2eee2] p-3">
                  <span className="text-[12.5px] font-medium text-[#212d3d]">
                    Extension State Preview (Chapter 8):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "supported" as const, label: "1. Supported ATS" },
                      { id: "review" as const, label: "2. Needs Review" },
                      { id: "unsupported" as const, label: "3. Unsupported Fallback" },
                    ].map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setExtensionScenario(sc.id)}
                        className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium ${
                          extensionScenario === sc.id
                            ? "bg-[#212d3d] text-[#faf6ed]"
                            : "bg-white text-[#5a6675]"
                        }`}
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {extensionScenario === "unsupported" ? (
                  <div className="rounded-[18px] border border-[#b54708]/30 bg-[#faf6ed] p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-serif-display text-[20px] text-[#212d3d]">
                        This form is not supported for autofill
                      </p>
                      <StatusPill label="Manual Application Pack" tone="warning" />
                    </div>
                    <p className="text-[13px] text-[#5a6675]">
                      Vex says plainly when an employer form blocks safe automation. Use one-click copy values below — zero silent guessing.
                    </p>
                    <div className="space-y-2">
                      {[
                        { k: "name", label: "Candidate Baseline Name & Email", v: "Confirmed profile header" },
                        { k: "cv", label: "Tailored CV File", v: activeApp.cvVariant },
                        { k: "summary", label: "Role Fit Summary Answer", v: "Coordinated cross-functional product launches with repeatable release readiness checklists." },
                      ].map((row) => (
                        <div
                          key={row.k}
                          className="flex items-center justify-between gap-3 rounded-[12px] border border-[#dad6ca] bg-white px-3.5 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="text-[11.5px] font-medium text-[#5a6675]">
                              {row.label}
                            </p>
                            <p className="truncate text-[13px] text-[#212d3d]">
                              {row.v}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyPackValue(row.k, row.v)}
                            className="shrink-0 cursor-pointer rounded-full bg-[#212d3d] px-3 py-1 text-[11.5px] font-medium text-[#faf6ed]"
                          >
                            {copiedKey === row.k ? "Copied [OK]" : "Copy value"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {activeApp.extensionFields.map((field) => (
                      <div
                        key={field.id}
                        className="flex flex-col justify-between gap-2 rounded-[14px] border border-[#dad6ca] bg-[#faf6ed] p-3.5 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium text-[#212d3d]">
                            {field.label}
                          </p>
                          <p className="text-[11.5px] text-[#5a6675]">
                            Source: {field.source}
                          </p>
                          {field.status === "Needs input" && (
                            <input id="applicationstrackerview-input-9" name="applicationstrackerview-input-9" aria-label="applicationstrackerview input 9"
                              type="text"
                              value={field.value}
                              onChange={(e) =>
                                onFillExtensionField(
                                  activeApp.id,
                                  field.id,
                                  e.target.value
                                )
                              }
                              placeholder="Enter notice period (e.g. 4 weeks)..."
                              className="mt-2 w-full rounded-[10px] border border-[#dad6ca] bg-white px-3 py-1.5 text-[12.5px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                            />
                          )}
                        </div>
                        <StatusPill
                          label={field.status}
                          tone={
                            field.status === "Filled"
                              ? "success"
                              : field.status === "Needs input"
                              ? "warning"
                              : field.status === "Needs review"
                              ? "info"
                              : "neutral"
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeDrawerTab === "history" && (
              <div className="space-y-5">
                <div>
                  <p className="text-[12.5px] font-medium text-[#212d3d]">
                    Stage &amp; Evidence Timeline
                  </p>
                  <div className="mt-2.5 space-y-2">
                    {activeApp.history.map((h, i) => (
                      <div
                        key={i}
                        className="rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] px-3.5 py-2.5 text-[12.5px]"
                      >
                        <span className="font-medium text-[#212d3d]">{h.actor}</span>{" "}
                        · <span className="text-[#5a6675]">{h.at}</span>
                        <p className="mt-0.5 text-[#212d3d]">{h.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extension Supported-Site Coverage List & Per-Site Permissions (#58-60) */}
                <div>
                  <p className="text-[12.5px] font-medium text-[#212d3d]">
                    Extension Per-Site Permissions &amp; Coverage Disclosure
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#5a6675]">
                    What we never read: banking details, passwords, or unrelated browser tabs.
                  </p>
                  <div className="mt-2.5 divide-y divide-[#dad6ca] rounded-[14px] border border-[#dad6ca] bg-[#f2eee2]">
                    {SUPPORTED_SITES.map((s) => (
                      <div
                        key={s.site}
                        className="flex items-center justify-between gap-3 px-4 py-2.5 text-[12.5px]"
                      >
                        <div>
                          <p className="font-medium text-[#212d3d]">{s.site}</p>
                          <p className="text-[11.5px] text-[#5a6675]">
                            {s.status} · {s.checked}
                          </p>
                        </div>
                        {s.site !== "Proprietary PDF / Custom Forms" && (
                          <button
                            type="button"
                            onClick={() =>
                              setSiteToggles((prev) => ({
                                ...prev,
                                [s.site]: !prev[s.site],
                              }))
                            }
                            className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium ${
                              siteToggles[s.site]
                                ? "bg-[#212d3d] text-[#faf6ed]"
                                : "bg-white text-[#5a6675] border border-[#dad6ca]"
                            }`}
                          >
                            {siteToggles[s.site] ? "Permitted" : "Blocked"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeDrawerTab === "inbox" && (
              <div className="space-y-4">
                <div className="rounded-[18px] border border-[#dad6ca] bg-[#f2eee2] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <Eyebrow label="Section 14 · Email & Recruiter Intelligence" />
                      <p className="mt-0.5 text-[13.5px] font-medium text-[#212d3d]">
                        Gmail &amp; Outlook Recruiter Thread Detection
                      </p>
                    </div>
                    <StatusPill label="Read-only OAuth scope" tone="navy" dot={false} />
                  </div>
                  <p className="mt-1 text-[12px] text-[#5a6675]">
                    Automatically classifies interview invites, confirmations, assessments, and notices without sending replies without your approval.
                  </p>
                </div>

                <div className="space-y-3">
                  {INITIAL_RECRUITER_EMAILS.map((email) => (
                    <div
                      key={email.id}
                      className="rounded-[18px] border border-[#dad6ca] bg-[#faf6ed] p-4 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <StatusPill label={email.provider} tone="info" dot={false} />
                          <StatusPill label={email.classification} tone="success" />
                        </div>
                        <span className="text-[11.5px] text-[#5a6675]">
                          {email.receivedAt}
                        </span>
                      </div>
                      <div>
                        <p className="text-[13.5px] font-medium text-[#212d3d]">
                          {email.subject}
                        </p>
                        <p className="text-[11.5px] text-[#5a6675]">
                          From: {email.sender}
                        </p>
                      </div>
                      <p className="text-[12.5px] text-[#212d3d]">
                        {email.extractedSummary}
                      </p>
                      <div className="rounded-[12px] border border-[#dad6ca] bg-white p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#5a6675]">
                            Suggested Reply Draft
                          </span>
                          <button
                            type="button"
                            onClick={() => copyPackValue(email.id, email.suggestedReply)}
                            className="cursor-pointer text-[11.5px] font-medium text-[#175cd3] underline"
                          >
                            {copiedKey === email.id ? "Copied [OK]" : "Copy reply"}
                          </button>
                        </div>
                        <p className="text-[12px] leading-[1.5] text-[#5a6675]">
                          {email.suggestedReply}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          </PhonePortal>
        )}
      </div>

      {/* Add Application Manually Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#141c24]/55 p-4 backdrop-blur-xs"
          >
            <motion.form
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (!manualCompany.trim() || !manualTitle.trim()) return;
                onAddApplication(
                  manualCompany.trim(),
                  manualTitle.trim(),
                  manualDeadline.trim() || "In 7 days",
                  manualPriority,
                  manualUrl.trim()
                );
                setManualCompany("");
                setManualTitle("");
                setManualUrl("");
                setShowAddModal(false);
              }}
              className="w-full max-w-[500px] rounded-[24px] border border-[#dad6ca] bg-[#faf6ed] p-6 shadow-2xl space-y-4"
            >
              <div>
                <Eyebrow label="Section 7 · Manual Application Entry" />
                <h3 className="mt-1 font-serif-display text-[26px] leading-tight text-[#212d3d]">
                  Track an External Application
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11.5px] font-medium text-[#5a6675]">
                    Company Name
                  </label>
                  <input id="applicationstrackerview-input-10" name="applicationstrackerview-input-10" aria-label="applicationstrackerview input 10"
                    required
                    value={manualCompany}
                    onChange={(e) => setManualCompany(e.target.value)}
                    placeholder="e.g. Monzo"
                    className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-white px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-medium text-[#5a6675]">
                    Job Title
                  </label>
                  <input id="applicationstrackerview-input-11" name="applicationstrackerview-input-11" aria-label="applicationstrackerview input 11"
                    required
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="e.g. Product Ops Manager"
                    className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-white px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-medium text-[#5a6675]">
                    Deadline
                  </label>
                  <input id="applicationstrackerview-input-12" name="applicationstrackerview-input-12" aria-label="applicationstrackerview input 12"
                    value={manualDeadline}
                    onChange={(e) => setManualDeadline(e.target.value)}
                    className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-white px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-medium text-[#5a6675]">
                    Priority
                  </label>
                  <select id="applicationstrackerview-select-13" name="applicationstrackerview-select-13" aria-label="applicationstrackerview select 13"
                    value={manualPriority}
                    onChange={(e) =>
                      setManualPriority(e.target.value as "High" | "Standard")
                    }
                    className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-white px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11.5px] font-medium text-[#5a6675]">
                  Application URL (optional)
                </label>
                <input id="applicationstrackerview-input-14" name="applicationstrackerview-input-14" aria-label="applicationstrackerview input 14"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://…"
                  className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-white px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="cursor-pointer text-[13px] font-medium text-[#5a6675] underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2 text-[13px] font-medium text-[#faf6ed] hover:bg-[#33445c]"
                >
                  Add to Planned stage
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explicit Submission Authorization Modal (Feature #43 & Section 8.5) */}
      <AnimatePresence>
        {showAuthModal && activeApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#141c24]/55 p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              className="w-full max-w-[520px] rounded-[24px] border border-[#dad6ca] bg-[#faf6ed] p-6 shadow-2xl"
            >
              <Eyebrow label="Explicit Submission Authorization" />
              <h3 className="mt-2 font-serif-display text-[26px] leading-tight text-[#212d3d]">
                Record how you submitted to {activeApp.company}
              </h3>
              <p className="mt-1.5 text-[13.5px] text-[#5a6675]">
                Vex never presses submit automatically. Choose the truthful status so your tracker separates guesses from proof.
              </p>

              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSubmission(
                      activeApp.id,
                      "verified-submitted",
                      "Verified submitted — confirmation page & timestamp recorded by user click"
                    );
                    onUpdateStage(activeApp.id, "Applied");
                    setShowAuthModal(false);
                  }}
                  className="w-full cursor-pointer rounded-[16px] bg-[#212d3d] p-4 text-left text-[#faf6ed] hover:bg-[#33445c]"
                >
                  <p className="text-[14px] font-medium">
                    Verified submitted (confirmation page seen)
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#faf6ed]/75">
                    Records confirmation evidence &amp; moves stage to Applied.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateSubmission(
                      activeApp.id,
                      "user-reported-submitted",
                      "User-reported submitted — marked applied manually without portal confirmation capture"
                    );
                    onUpdateStage(activeApp.id, "Applied");
                    setShowAuthModal(false);
                  }}
                  className="w-full cursor-pointer rounded-[16px] border border-[#dad6ca] bg-white p-4 text-left text-[#212d3d] hover:bg-[#f2eee2]"
                >
                  <p className="text-[14px] font-medium">
                    User-reported submitted
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#5a6675]">
                    Honest status when you applied directly on an unsupported site.
                  </p>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="mt-4 cursor-pointer text-[13px] font-medium text-[#5a6675] underline"
              >
                Cancel — keep as Prepared
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

