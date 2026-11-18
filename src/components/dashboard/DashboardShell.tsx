"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  type AlertItem,
  type CourseItem,
  type CvDiffSuggestion,
  type CvQualityFlag,
  type DailyPlanTask,
  type DashboardApplication,
  type DashboardJob,
  type DashboardSectionId,
  type ExternalAiAppAccess,
  INITIAL_ALERTS,
  INITIAL_APPLICATIONS,
  INITIAL_CONTACTS,
  INITIAL_COURSES,
  INITIAL_CV_DIFFS,
  INITIAL_CV_QUALITY_FLAGS,
  INITIAL_DAILY_PLAN,
  INITIAL_EXTERNAL_AI_APPS,
  INITIAL_JOBS,
  INITIAL_MCP_ACTIVITY,
  INITIAL_MCP_CONNECTIONS,
  INITIAL_SKILLS,
  type McpActivityEntry,
  type McpConnection,
  type NetworkContact,
  type OnboardingProfileState,
  type SkillRecord,
  type SubmissionState,
  type SubscriptionPlan,
  type TrackerStage,
} from "@/data/dashboard";
import { ArrowRightIcon, VexLogoMark } from "@/components/Icons";
import DashboardOverview from "./DashboardOverview";
import JobsDiscoveryView from "./JobsDiscoveryView";
import ApplicationsTrackerView from "./ApplicationsTrackerView";
import DocumentsStudioView from "./DocumentsStudioView";
import ProfilePortfolioView from "./ProfilePortfolioView";
import NetworkView from "./NetworkView";
import InterviewPrepView from "./InterviewPrepView";
import LearningSkillsView from "./LearningSkillsView";
import McpAssistantView from "./McpAssistantView";
import AlertsView from "./AlertsView";
import SettingsPrivacyView from "./SettingsPrivacyView";
import PhilosopherCoachGuide from "./PhilosopherCoachGuide";
import { IonicTemplePortico } from "./IonicColumnDecoration";

type PillarLabel =
  | "COMMAND"
  | "DISCOVER"
  | "PREPARE"
  | "APPLY"
  | "IMPROVE"
  | "GET HIRED";

const NAV_GROUPS: {
  pillar: PillarLabel;
  items: {
    id: DashboardSectionId;
    label: string;
    sub: string;
  }[];
}[] = [
  {
    pillar: "COMMAND",
    items: [{ id: "overview", label: "Dashboard", sub: "Analytics & 24h plan" }],
  },
  {
    pillar: "DISCOVER",
    items: [{ id: "jobs", label: "Jobs", sub: "Match % & sources" }],
  },
  {
    pillar: "PREPARE",
    items: [
      { id: "documents", label: "Resume", sub: "CV diffs & letters" },
      { id: "profile", label: "Profile", sub: "LinkedIn & portfolio" },
    ],
  },
  {
    pillar: "APPLY",
    items: [
      { id: "applications", label: "Tracker", sub: "3-state, Extension, Inbox" },
      { id: "network", label: "Network", sub: "Contacts & companies" },
    ],
  },
  {
    pillar: "IMPROVE",
    items: [
      { id: "interviews", label: "Interview", sub: "Mock prep & drills" },
      { id: "learning", label: "Learning", sub: "Skills & courses" },
    ],
  },
  {
    pillar: "GET HIRED",
    items: [
      { id: "mcp", label: "Assistant", sub: "Career AI & MCP Hub" },
      { id: "alerts", label: "Alerts", sub: "Deadlines & invites" },
      { id: "settings", label: "Settings", sub: "Plans & data control" },
    ],
  },
];

const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

const DEFAULT_PROFILE: OnboardingProfileState = {
  name: "Candidate",
  email: "candidate@vex.careers",
  intakeMethod: "upload",
  currentRole: "Senior Product Analyst",
  targetRole: "Product Operations Lead",
  track: "SaaS & AI Operations",
  workMode: "Hybrid",
  priorities: ["cv-diffs", "mock-prep"],
  cvExcerpt: "",
  agreedBoundary: true,
};

export default function DashboardShell() {
  const [section, setSection] = useState<DashboardSectionId>("overview");
  const [navExpanded, setNavExpanded] = useState(true);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const [profile, setProfile] = useState<OnboardingProfileState>(DEFAULT_PROFILE);
  const [jobs] = useState<DashboardJob[]>(INITIAL_JOBS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([
    "job-northbridge",
    "job-aldermere",
  ]);
  const [hiddenJobIds, setHiddenJobIds] = useState<string[]>([]);
  const [applications, setApplications] =
    useState<DashboardApplication[]>(INITIAL_APPLICATIONS);
  const [diffs, setDiffs] = useState<CvDiffSuggestion[]>(INITIAL_CV_DIFFS);
  const [flags, setFlags] = useState<CvQualityFlag[]>(INITIAL_CV_QUALITY_FLAGS);
  const [skills, setSkills] = useState<SkillRecord[]>(INITIAL_SKILLS);
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [dailyTasks, setDailyTasks] =
    useState<DailyPlanTask[]>(INITIAL_DAILY_PLAN);
  const [connections, setConnections] = useState<McpConnection[]>(
    INITIAL_MCP_CONNECTIONS
  );
  const [externalApps, setExternalApps] = useState<ExternalAiAppAccess[]>(
    INITIAL_EXTERNAL_AI_APPS
  );
  const [activityLog, setActivityLog] =
    useState<McpActivityEntry[]>(INITIAL_MCP_ACTIVITY);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [contacts, setContacts] = useState<NetworkContact[]>(INITIAL_CONTACTS);
  const [mockSessionsCount, setMockSessionsCount] = useState(1);
  const [plan, setPlan] = useState<SubscriptionPlan>("Pro");
  const [coachOpen, setCoachOpen] = useState(false);

  // Auto-start the guided tour on a user's first visit only.
  useEffect(() => {
    try {
      if (!window.localStorage.getItem("vex_coach_tour_done")) setCoachOpen(true);
    } catch {
      setCoachOpen(true);
    }
  }, []);

  useEffect(() => {
    try {
      const onboardingRaw = window.localStorage.getItem("vex_onboarding_profile");
      const userRaw = window.localStorage.getItem("vex_frontend_user");
      const storedPlan = window.localStorage.getItem("vex_subscription_plan");
      if (storedPlan === "Free" || storedPlan === "Pro" || storedPlan === "Ultra") {
        setPlan(storedPlan);
      }
      let merged = { ...DEFAULT_PROFILE };
      if (userRaw) {
        const u = JSON.parse(userRaw) as Partial<OnboardingProfileState>;
        if (u.name) merged.name = u.name;
        if (u.email) merged.email = u.email;
      }
      if (onboardingRaw) {
        const ob = JSON.parse(onboardingRaw) as Partial<OnboardingProfileState>;
        merged = {
          ...merged,
          ...ob,
          name: ob.name || merged.name,
          email: ob.email || merged.email,
          targetRole: ob.targetRole || merged.targetRole,
        };
      }
      setProfile(merged);
    } catch {
      // Pure UI fallback
    }
  }, []);

  function saveProfile(next: OnboardingProfileState) {
    setProfile(next);
    try {
      window.localStorage.setItem(
        "vex_onboarding_profile",
        JSON.stringify(next)
      );
      window.localStorage.setItem(
        "vex_frontend_user",
        JSON.stringify({ name: next.name, email: next.email })
      );
    } catch {
      // Ignore browser storage limits
    }
  }

  function resetWorkspaceData() {
    try {
      window.localStorage.removeItem("vex_onboarding_profile");
      window.localStorage.removeItem("vex_frontend_user");
    } catch {
      // Ignore
    }
    setProfile(DEFAULT_PROFILE);
    setApplications(INITIAL_APPLICATIONS);
    setDiffs(INITIAL_CV_DIFFS);
    setFlags(INITIAL_CV_QUALITY_FLAGS);
    setSkills(INITIAL_SKILLS);
    setCourses(INITIAL_COURSES);
    setAlerts(INITIAL_ALERTS);
  }

  function navigateTo(nextSection: DashboardSectionId) {
    setSection(nextSection);
    setMoreDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleToggleSaveJob(jobId: string) {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  }

  function handleHideJob(jobId: string) {
    setHiddenJobIds((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
  }

  function handleUnhideJob(jobId: string) {
    setHiddenJobIds((prev) => prev.filter((id) => id !== jobId));
  }

  function handlePrepareApplication(job: DashboardJob) {
    const existing = applications.find((a) => a.jobId === job.id);
    if (!existing) {
      const created: DashboardApplication = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        title: job.title,
        company: job.company,
        stage: "Prepared",
        submissionState: "prepared",
        evidenceText: "Prepared, not submitted — drafted from baseline profile",
        quietDays: 0,
        deadline: job.deadline || undefined,
        priority: "High",
        cvVariant: `${job.company.split(" ")[0]}_${job.title.split(" ")[0]}_v1 (Draft)`,
        coverLetterApproved: false,
        checklist: {
          cvReviewed: false,
          letterApproved: false,
          questionsAnswered: false,
          fieldsChecked: false,
        },
        notes: "",
        followUpDate: "2026-11-20",
        history: [
          {
            at: "Just now",
            actor: "Vex Workspace",
            event: "Prepared application pack from Job Details",
          },
        ],
        extensionFields: [
          {
            id: "ef-new-1",
            label: "Profile identity & email",
            value: profile.name,
            source: "Baseline profile",
            status: "Filled",
          },
          {
            id: "ef-new-2",
            label: "Role-specific screening answer",
            value: "",
            source: "Needs review before continue",
            status: "Needs input",
          },
        ],
      };
      setApplications((prev) => [created, ...prev]);
    }
    navigateTo("applications");
  }

  const unresolvedFlagsCount = flags.filter((f) => !f.resolved).length;
  const unreadAlertsCount = alerts.filter((a) => !a.dismissed).length;

  const DOCK_CODES: Record<DashboardSectionId, string> = {
    overview: "01",
    jobs: "02",
    documents: "03",
    profile: "04",
    applications: "05",
    network: "06",
    interviews: "07",
    learning: "08",
    mcp: "09",
    alerts: "10",
    settings: "11",
  };

  const activeItem = NAV_ITEMS.find((n) => n.id === section) || NAV_ITEMS[0];

  return (
    <div className="relative min-h-screen w-full bg-[#6d828f] text-[#212d3d] pb-20 lg:pb-12">
      {/* FULL-BLEED ASCII-DITHERED CLOUD HORIZON (Upper Slate Sky -> Dense ASCII Fogs Down Below) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-bottom bg-no-repeat"
        style={{
          backgroundImage: "url('/images/vex-ascii-sky.jpg')",
        }}
      />
      {/* Gentle Upper Atmospheric Luminance + Low Rising Cream Fog Band at Bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,246,237,0.48) 0%, rgba(250,246,237,0.14) 36%, rgba(110,130,142,0.06) 62%, rgba(250,246,237,0.38) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[44vh]"
        style={{
          background:
            "radial-gradient(ellipse 110% 75% at 50% 100%, rgba(250,246,237,0.72) 0%, rgba(250,246,237,0.34) 48%, rgba(250,246,237,0) 100%)",
        }}
      />
      {/* Fine Architectural Blueprint Pixel Matrix */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(33, 45, 61, 0.22) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* FEATHERWEIGHT FLOATING TOP NAVBAR (Limestone Glass, Zero Heavy Bars) */}
      <header className="sticky top-0 z-30 border-b border-[#dfd7c2]/75 bg-[#faf6ed]/52 backdrop-blur-xl">
        <div className="flex h-[58px] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: Vex Wordmark + Expand/Compact Rail Control + Open Module Breadcrumb */}
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <VexLogoMark className="h-8 w-8 rounded-[9px] border border-[#212d3d]/15 shadow-2xs" />
              <span className="font-serif-display text-[25px] leading-none text-[#212d3d]">
                Vex
              </span>
            </Link>

            <span className="hidden h-4 w-px bg-[#212d3d]/15 sm:block" />

            <button
              type="button"
              onClick={() => setNavExpanded((v) => !v)}
              className="hidden cursor-pointer items-center gap-1.5 rounded-full border border-white/60 bg-white/55 px-3 py-1 font-mono text-[10.5px] font-medium text-[#212d3d] backdrop-blur-sm transition-colors hover:bg-white/85 lg:inline-flex"
            >
              <span>{navExpanded ? "NAV: OPEN" : "NAV: MINI"}</span>
            </button>

            <div className="hidden items-center gap-1.5 font-mono text-[11px] text-[#212d3d]/70 md:flex">
              <span>TELOS.OS</span>
              <span>/</span>
              <span className="font-semibold text-[#212d3d]">
                {DOCK_CODES[section]}_{activeItem.label.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Right: Subtle Council Triad + Alerts Badge + Profile Link */}
          <div className="flex items-center gap-2.5">
            <div className="hidden items-center -space-x-1.5 sm:flex">
              {[
                { src: "/images/vex-philosopher.jpg", title: "Vex Philosopher" },
                { src: "/images/michelangelo-hands.jpg", title: "Michelangelo" },
                { src: "/images/davinci-codex.jpg", title: "Leonardo da Vinci" },
              ].map((av) => (
                <img
                  key={av.title}
                  src={av.src}
                  alt={av.title}
                  title={av.title}
                  className="h-7 w-7 rounded-full border border-white/80 object-cover shadow-2xs"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigateTo("settings")}
              className="hidden cursor-pointer rounded-full px-2.5 py-1 font-mono text-[11px] font-medium text-[#212d3d]/80 transition-colors hover:bg-white/55 sm:inline-flex"
            >
              {plan}
            </button>

            <button
              type="button"
              onClick={() => setCoachOpen((v) => !v)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors ${
                coachOpen
                  ? "bg-[#b88b32] text-white"
                  : "border border-white/60 bg-white/55 text-[#212d3d] hover:bg-white/85"
              }`}
            >
              <span>{coachOpen ? "Coach: On" : "Coach Guide"}</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo("alerts")}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors ${
                section === "alerts"
                  ? "bg-[#212d3d] text-[#faf6ed]"
                  : "border border-white/60 bg-white/55 text-[#212d3d] hover:bg-white/85"
              }`}
            >
              <span>Alerts</span>
              {unreadAlertsCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#067647] px-1 text-[9.5px] font-semibold text-white">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigateTo("profile")}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/60 bg-white/55 py-0.5 pl-1 pr-3 text-[12px] font-medium text-[#212d3d] transition-colors hover:bg-white/85"
            >
              <img
                src="/images/vex-philosopher.jpg"
                alt={profile.name || "Candidate"}
                className="h-6.5 w-6.5 rounded-full object-cover object-top"
              />
              <span className="hidden sm:inline">
                {profile.name || "Candidate"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY LAYOUT: FULL-WIDTH CANVAS + GRAND IONIC TEMPLE NAVIGATION PORTICO */}
      <div className="relative z-10 flex w-full gap-6 px-4 pt-4 sm:px-6 lg:px-8">
        {/* Unified One-Piece Classical Ionic Temple Navigation Portico */}
        <aside className="hidden w-fit shrink-0 transition-all duration-300 lg:block">
          <div className="sticky top-[68px]">
            <IonicTemplePortico compact={!navExpanded}>
              <div className="space-y-2.5">
                {NAV_GROUPS.map((group) => (
                  <div key={group.pillar} className="space-y-1">
                    {navExpanded && (
                      <p className="px-2 pt-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.16em] text-[#7a6f59]">
                        {group.pillar}
                      </p>
                    )}
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const active = section === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => navigateTo(item.id)}
                            title={`${item.label} — ${item.sub}`}
                            className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] px-2 py-1.5 text-left transition-all ${
                              active
                                ? "bg-[#212d3d] text-[#faf6ed] shadow-sm ring-1 ring-[#8e8168]/40"
                                : "text-[#2c2821] hover:bg-[#faf6ed] hover:text-[#212d3d] hover:shadow-2xs"
                            } ${navExpanded ? "" : "justify-center px-0"}`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-semibold ${
                                active
                                  ? "bg-white/15 text-[#faf6ed]"
                                  : "border border-[#cfc5aa] bg-[#efe8d5] text-[#6d624d] group-hover:bg-white"
                              }`}
                            >
                              {DOCK_CODES[item.id]}
                            </span>
                            {navExpanded && (
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[12.5px] font-medium leading-tight">
                                  {item.label}
                                </p>
                                <p
                                  className={`truncate text-[10px] leading-tight ${
                                    active ? "text-[#d5cdb8]" : "text-[#7c715c]"
                                  }`}
                                >
                                  {item.sub}
                                </p>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t border-[#cfc5aa]/80 pt-2">
                <Link
                  href="/onboarding"
                  title="Re-run Guided Onboarding"
                  className={`flex items-center gap-2.5 rounded-[10px] px-2 py-1.5 font-mono text-[9.5px] font-medium text-[#6d624d] transition-colors hover:bg-[#faf6ed] hover:text-[#212d3d] ${
                    navExpanded ? "" : "justify-center px-0"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#cfc5aa] bg-[#efe8d5] text-[9px] font-semibold">
                    00
                  </span>
                  {navExpanded && (
                    <span className="truncate leading-[1.35]">RE-RUN INTAKE</span>
                  )}
                </Link>
              </div>
            </IonicTemplePortico>
          </div>
        </aside>

        {/* Active Section Stage */}
        <main className="min-w-0 flex-1 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {section === "overview" && (
                <DashboardOverview
                    profile={profile}
                    plan={plan}
                    jobs={jobs}
                    savedJobIds={savedJobIds}
                    hiddenJobIds={hiddenJobIds}
                    applications={applications}
                    unresolvedFlagsCount={unresolvedFlagsCount}
                    mockSessionsCount={mockSessionsCount}
                    dailyTasks={dailyTasks}
                    onToggleTask={(taskId) =>
                      setDailyTasks((prev) =>
                        prev.map((t) =>
                          t.id === taskId ? { ...t, done: !t.done } : t
                        )
                      )
                    }
                    onNavigate={navigateTo}
                    onLogInvitation={(company, role, dateText) => {
                      const entry: DashboardApplication = {
                        id: `app-inv-${Date.now()}`,
                        jobId: "custom-invite",
                        title: role,
                        company,
                        stage: "Interview",
                        submissionState: "user-reported-submitted",
                        evidenceText:
                          "User-recorded invitation — source noted explicitly",
                        quietDays: 0,
                        priority: "High",
                        interviewDate: dateText,
                        interviewFormat: "Recorded by candidate",
                        cvVariant: "Tailored interview pack",
                        coverLetterApproved: true,
                        checklist: {
                          cvReviewed: true,
                          letterApproved: true,
                          questionsAnswered: true,
                          fieldsChecked: true,
                        },
                        notes: "Review role gaps & complete 1 mock drill before call.",
                        followUpDate: "2026-11-22",
                        history: [
                          {
                            at: "Just now",
                            actor: "User",
                            event: `Logged interview invitation for ${dateText}`,
                          },
                        ],
                        extensionFields: [],
                      };
                      setApplications((prev) => [entry, ...prev]);
                    }}
                  />
                )}

                {section === "jobs" && (
                  <JobsDiscoveryView
                    jobs={jobs}
                    savedJobIds={savedJobIds}
                    hiddenJobIds={hiddenJobIds}
                    onToggleSave={handleToggleSaveJob}
                    onHideJob={handleHideJob}
                    onUnhideJob={handleUnhideJob}
                    onPrepareApplication={handlePrepareApplication}
                    onNavigate={navigateTo}
                  />
                )}

                {section === "applications" && (
                  <ApplicationsTrackerView
                    applications={applications}
                    onAddApplication={(company, title, deadline, priority, url) => {
                      const entry: DashboardApplication = {
                        id: `app-manual-${Date.now()}`,
                        jobId: `manual-${Date.now()}`,
                        title,
                        company,
                        stage: "Planned",
                        submissionState: "prepared",
                        evidenceText: url
                          ? `Added manually · Target link: ${url}`
                          : "Added manually to tracker",
                        quietDays: 0,
                        deadline,
                        priority,
                        cvVariant: "Untouched Base CV",
                        coverLetterApproved: false,
                        checklist: {
                          cvReviewed: false,
                          letterApproved: false,
                          questionsAnswered: false,
                          fieldsChecked: false,
                        },
                        notes: "",
                        followUpDate: "2026-11-24",
                        history: [
                          {
                            at: "Just now",
                            actor: "User",
                            event: `Added manual application for ${title} at ${company}`,
                          },
                        ],
                        extensionFields: [],
                      };
                      setApplications((prev) => [entry, ...prev]);
                    }}
                    onUpdateStage={(appId, stage) =>
                      setApplications((prev) =>
                        prev.map((a) =>
                          a.id === appId
                            ? {
                                ...a,
                                stage,
                                history: [
                                  {
                                    at: "Just now",
                                    actor: "User",
                                    event: `Moved stage to ${stage}`,
                                  },
                                  ...a.history,
                                ],
                              }
                            : a
                        )
                      )
                    }
                    onUpdateSubmission={(appId, state, evidence) =>
                      setApplications((prev) =>
                        prev.map((a) =>
                          a.id === appId
                            ? {
                                ...a,
                                submissionState: state,
                                evidenceText: evidence,
                                history: [
                                  {
                                    at: "Just now",
                                    actor: "User",
                                    event: evidence,
                                  },
                                  ...a.history,
                                ],
                              }
                            : a
                        )
                      )
                    }
                    onUpdateNotes={(appId, notes, followUpDate) =>
                      setApplications((prev) =>
                        prev.map((a) =>
                          a.id === appId ? { ...a, notes, followUpDate } : a
                        )
                      )
                    }
                    onFillExtensionField={(appId, fieldId, value) =>
                      setApplications((prev) =>
                        prev.map((a) =>
                          a.id === appId
                            ? {
                                ...a,
                                extensionFields: a.extensionFields.map((f) =>
                                  f.id === fieldId
                                    ? {
                                        ...f,
                                        value,
                                        status: value.trim()
                                          ? "Filled"
                                          : "Needs input",
                                      }
                                    : f
                                ),
                              }
                            : a
                        )
                      )
                    }
                    onNavigate={navigateTo}
                  />
                )}

                {section === "documents" && (
                  <DocumentsStudioView
                    profile={profile}
                    diffs={diffs}
                    flags={flags}
                    onDecideDiff={(diffId, decision) => {
                      setDiffs((prev) =>
                        prev.map((d) =>
                          d.id === diffId ? { ...d, status: decision } : d
                        )
                      );
                      if (diffId === "diff-2" && decision === "rejected") {
                        setFlags((prev) =>
                          prev.map((f) =>
                            f.id === "qf-1" ? { ...f, resolved: true } : f
                          )
                        );
                      }
                    }}
                    onResolveFlag={(flagId) =>
                      setFlags((prev) =>
                        prev.map((f) =>
                          f.id === flagId ? { ...f, resolved: true } : f
                        )
                      )
                    }
                  />
                )}

                {section === "interviews" && (
                  <InterviewPrepView
                    applications={applications}
                    mockSessionsCount={mockSessionsCount}
                    onCompleteSession={() =>
                      setMockSessionsCount((c) => c + 1)
                    }
                  />
                )}

                {section === "learning" && (
                  <LearningSkillsView
                    skills={skills}
                    courses={courses}
                    onChallengeSkill={(skillId, note) =>
                      setSkills((prev) =>
                        prev.map((s) =>
                          s.id === skillId
                            ? {
                                ...s,
                                challengeHistory: [
                                  ...s.challengeHistory,
                                  `User challenged: "${note}"`,
                                ],
                              }
                            : s
                        )
                      )
                    }
                    onUpgradeSkillDemonstrated={(skillId, courseId) => {
                      setSkills((prev) =>
                        prev.map((s) =>
                          s.id === skillId
                            ? {
                                ...s,
                                evidenceTier: "Demonstrated in Vex",
                                proficiency: "Intermediate",
                                confidence: "High",
                                confidenceReason:
                                  "Passed API retry & error-handling check inside Vex",
                                sourceLabel: "Completed Vex Practical Check",
                              }
                            : s
                        )
                      );
                      setCourses((prev) =>
                        prev.map((c) =>
                          c.id === courseId ? { ...c, status: "Completed" } : c
                        )
                      );
                    }}
                  />
                )}

                {section === "mcp" && (
                  <McpAssistantView
                    profile={profile}
                    connections={connections}
                    externalApps={externalApps}
                    activityLog={activityLog}
                    onToggleConnection={(id) =>
                      setConnections((prev) =>
                        prev.map((c) =>
                          c.id === id
                            ? {
                                ...c,
                                status:
                                  c.status === "Connected"
                                    ? "Disconnected"
                                    : "Connected",
                                statusNote:
                                  c.status === "Connected"
                                    ? "Disconnected by user — zero external calls"
                                    : "Reconnected & tested healthy just now",
                                lastUsed: "Just now",
                              }
                            : c
                        )
                      )
                    }
                    onToggleExternalApp={(id) =>
                      setExternalApps((prev) =>
                        prev.map((a) =>
                          a.id === id ? { ...a, enabled: !a.enabled } : a
                        )
                      )
                    }
                    onClearActivity={() => setActivityLog([])}
                    onRecordAssistantPlanRun={(prompt) =>
                      setActivityLog((prev) => [
                        {
                          id: `act-${Date.now()}`,
                          time: "Just now",
                          actor: "You",
                          tool: "Coordinator Plan",
                          action: `Ran supervised plan: "${prompt.slice(0, 52)}..."`,
                          dataShared: "Target role, read-only jobs, CV draft",
                          approval: "Approved",
                          result: "Succeeded",
                        },
                        ...prev,
                      ])
                    }
                  />
                )}

                {section === "profile" && (
                  <ProfilePortfolioView
                    profile={profile}
                    onSaveProfile={saveProfile}
                  />
                )}

                {section === "network" && (
                  <NetworkView
                    contacts={contacts}
                    onAddContact={(contact) =>
                      setContacts((prev) => [contact, ...prev])
                    }
                  />
                )}

                {section === "alerts" && (
                  <AlertsView
                    alerts={alerts}
                    onDismissAlert={(id) =>
                      setAlerts((prev) =>
                        prev.map((a) =>
                          a.id === id ? { ...a, dismissed: true } : a
                        )
                      )
                    }
                    onNavigate={navigateTo}
                  />
                )}

                {section === "settings" && (
                  <SettingsPrivacyView
                    profile={profile}
                    plan={plan}
                    onChangePlan={(nextPlan) => {
                      setPlan(nextPlan);
                      try {
                        window.localStorage.setItem(
                          "vex_subscription_plan",
                          nextPlan
                        );
                      } catch {
                        // Ignore
                      }
                    }}
                    onResetWorkspaceData={resetWorkspaceData}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
      </div>

      {/* MOBILE BOTTOM BAR (Template 21: Home, Jobs, Track, More) */}
      <nav
        aria-label="Mobile dashboard navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dad6ca] bg-[#18222e] px-2 py-2 text-[#faf6ed] lg:hidden"
      >
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: "overview" as const, label: "Home" },
            { id: "jobs" as const, label: "Jobs" },
            { id: "applications" as const, label: "Track" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => navigateTo(m.id)}
              className={`min-h-[44px] cursor-pointer rounded-[12px] text-[12px] font-medium ${
                section === m.id
                  ? "bg-[#faf6ed] text-[#212d3d]"
                  : "text-[#faf6ed]/80"
              }`}
            >
              {m.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setMoreDrawerOpen((v) => !v)}
            className={`min-h-[44px] cursor-pointer rounded-[12px] text-[12px] font-medium ${
              moreDrawerOpen
                ? "bg-[#33445c] text-[#faf6ed]"
                : "text-[#faf6ed]/80"
            }`}
          >
            More ({moreDrawerOpen ? "−" : "+"})
          </button>
        </div>

        {moreDrawerOpen && (
          <div className="mt-2 grid grid-cols-2 gap-1.5 border-t border-white/10 pt-2">
            {NAV_ITEMS.filter(
              (n) => !["overview", "jobs", "applications"].includes(n.id)
            ).map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => navigateTo(n.id)}
                className="min-h-[44px] cursor-pointer rounded-[10px] bg-white/[0.08] px-3 text-left text-[12px] font-medium text-[#faf6ed]"
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* GLOBAL FIFA-MOBILE INTERACTIVE PHILOSOPHER GUIDE ACROSS EVERY PAGE */}
      <PhilosopherCoachGuide
        open={coachOpen}
        activeSection={section}
        onNavigate={navigateTo}
        onClose={() => setCoachOpen(false)}
      />
    </div>
  );
}

