"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { DashboardApplication, DashboardJob, DashboardSectionId } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import { triggerQuickAction, type QuickAction } from "@/lib/quick-actions";
import { ArrowRightIcon, VexLogoMark } from "@/components/Icons";
import { InstallAppButton } from "@/components/InstallApp";
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
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileTabBar, { type PrimaryMobileTab } from "@/components/mobile/MobileTabBar";

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

export default function DashboardShell() {
  const [section, setSection] = useState<DashboardSectionId>("overview");
  const [navExpanded, setNavExpanded] = useState(true);

  const {
    profile,
    plan,
    jobs,
    savedJobIds,
    hiddenJobIds,
    applications,
    diffs,
    flags,
    skills,
    courses,
    dailyTasks,
    connections,
    externalApps,
    activityLog,
    alerts,
    contacts,
    mockSessionsCount,
    coachOpen,
    setCoachOpen,
    saveProfile,
    changePlan,
    resetWorkspaceData,
    toggleSaveJob,
    hideJob,
    unhideJob,
    prepareApplication,
    updateApplication,
    decideDiff,
    resolveFlag,
    challengeSkill,
    upgradeSkillDemonstrated,
    toggleTask,
    toggleConnection,
    toggleExternalApp,
    clearActivity,
    recordAssistantRun,
    dismissAlert,
    addContact,
    logInvitation,
    addInterviewSession,
  } = useVexWorkspace();

  // Support deep links back from nested routes (e.g. /dashboard?section=jobs)
  useEffect(() => {
    try {
      const qs = new URLSearchParams(window.location.search).get("section");
      if (
        qs &&
        [
          "overview",
          "jobs",
          "documents",
          "profile",
          "applications",
          "network",
          "interviews",
          "learning",
          "mcp",
          "alerts",
          "settings",
        ].includes(qs)
      ) {
        setSection(qs as DashboardSectionId);
        const act = new URLSearchParams(window.location.search).get("action");
        if (act) triggerQuickAction(act as QuickAction);
      }
    } catch {
      // ignore
    }
  }, []);

  // Phones get snappier, app-like page switches; desktop keeps its slower glide.
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023.98px)");
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function navigateTo(nextSection: DashboardSectionId) {
    setSection(nextSection);
    window.scrollTo({ top: 0, behavior: isPhone ? "auto" : "smooth" });
  }

  function handleToggleSaveJob(jobId: string) {
    toggleSaveJob(jobId);
  }

  function handleHideJob(jobId: string) {
    hideJob(jobId);
  }

  function handleUnhideJob(jobId: string) {
    unhideJob(jobId);
  }

  function handlePrepareApplication(job: DashboardJob) {
    prepareApplication(job);
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

  const primaryTab: PrimaryMobileTab | "other" =
    section === "overview" ||
    section === "jobs" ||
    section === "applications" ||
    section === "learning" ||
    section === "profile"
      ? section
      : "other";

  const activeItem = NAV_ITEMS.find((n) => n.id === section) || NAV_ITEMS[0];

  return (
    <div className="vex-app relative min-h-screen w-full bg-[#f6f1e6] text-[#212d3d] pb-28 lg:bg-[#6d828f] lg:pb-12">
      {/* FULL-BLEED ASCII-DITHERED CLOUD HORIZON — Desktop Only */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden bg-cover bg-bottom bg-no-repeat lg:block"
        style={{
          backgroundImage: "url('/images/vex-ascii-sky.jpg')",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,246,237,0.48) 0%, rgba(250,246,237,0.14) 36%, rgba(110,130,142,0.06) 62%, rgba(250,246,237,0.38) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 hidden h-[44vh] lg:block"
        style={{
          background:
            "radial-gradient(ellipse 110% 75% at 50% 100%, rgba(250,246,237,0.72) 0%, rgba(250,246,237,0.34) 48%, rgba(250,246,237,0) 100%)",
        }}
      />
      {/* Fine Architectural Blueprint Pixel Matrix — Desktop Only */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden opacity-30 lg:block"
        style={{
          backgroundImage:
            "radial-gradient(rgba(33, 45, 61, 0.22) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* MOBILE APPLE-STYLE EDITORIAL HEADER (< lg) */}
      <MobileHeader
        title={activeItem.label}
        subtitle={activeItem.sub}
        onSelectSection={navigateTo}
      />

      {/* DESKTOP FEATHERWEIGHT FLOATING TOP NAVBAR (Limestone Glass) */}
      <header className="sticky top-0 z-30 hidden border-b border-[#dfd7c2]/75 bg-[#faf6ed]/52 backdrop-blur-xl lg:block">
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

            <InstallAppButton variant="glass" label="Install app" className="!px-3 !py-1 !text-[11px]" />

            <Link
              href="/dashboard/extension"
              className="hidden cursor-pointer rounded-full border border-white/60 bg-white/55 px-2.5 py-1 font-mono text-[10.5px] font-medium text-[#212d3d] transition-colors hover:bg-white/85 xl:inline-flex"
            >
              Extension
            </Link>

            <Link
              href="/dashboard/intelligence"
              className="hidden cursor-pointer rounded-full border border-white/60 bg-white/55 px-2.5 py-1 font-mono text-[10.5px] font-medium text-[#212d3d] transition-colors hover:bg-white/85 xl:inline-flex"
            >
              Apollo Intel
            </Link>

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
              initial={isPhone ? { opacity: 0, x: 14 } : { opacity: 0, y: 10 }}
              animate={isPhone ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
              exit={isPhone ? { opacity: 0, x: -10 } : { opacity: 0, y: -6 }}
              transition={{ duration: isPhone ? 0.16 : 0.28, ease: [0.22, 1, 0.36, 1] }}
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
                    onToggleTask={(taskId) => toggleTask(taskId)}
                    onNavigate={navigateTo}
                    onLogInvitation={(company, role, dateText) => {
                      logInvitation(company, role, dateText);
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
                      logInvitation(company, title, deadline || "Planned");
                      void priority;
                      void url;
                    }}
                    onUpdateStage={(appId, stage) =>
                      updateApplication(appId, (a) => ({
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
                      }))
                    }
                    onUpdateSubmission={(appId, state, evidence) =>
                      updateApplication(appId, (a) => ({
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
                      }))
                    }
                    onUpdateNotes={(appId, notes, followUpDate) =>
                      updateApplication(appId, (a) => ({
                        ...a,
                        notes,
                        followUpDate,
                      }))
                    }
                    onFillExtensionField={(appId, fieldId, value) =>
                      updateApplication(appId, (a) => ({
                        ...a,
                        extensionFields: a.extensionFields.map((f) =>
                          f.id === fieldId
                            ? {
                                ...f,
                                value,
                                status: value.trim() ? "Filled" : "Needs input",
                              }
                            : f
                        ),
                      }))
                    }
                    onNavigate={navigateTo}
                  />
                )}

                {section === "documents" && (
                  <DocumentsStudioView
                    profile={profile}
                    diffs={diffs}
                    flags={flags}
                    onDecideDiff={(diffId, decision) =>
                      decideDiff(diffId, decision)
                    }
                    onResolveFlag={(flagId) => resolveFlag(flagId)}
                  />
                )}

                {section === "interviews" && (
                  <InterviewPrepView
                    applications={applications}
                    mockSessionsCount={mockSessionsCount}
                    onCompleteSession={() =>
                      addInterviewSession({
                        id: `sess-${Date.now()}`,
                        applicationId: applications[0]?.id || "app-1",
                        company: applications[0]?.company || "Target Role",
                        roleTitle: applications[0]?.title || "Interview Drill",
                        philosopher: "Socrates",
                        mode: "Behavioral",
                        difficulty: "Mid",
                        createdAt: "Just now",
                        overallScore: 86,
                        voiceUsed: false,
                        turns: [
                          {
                            question: "Interactive Socratic Drill completed inside Interview Studio.",
                            answer: "Recorded response evaluated against structured STAR framing.",
                            mode: "Behavioral",
                            structureScore: 88,
                            clarityScore: 85,
                            relevanceScore: 85,
                            wordCount: 92,
                            feedbackNote: "Strong ownership lead; pair closing sentence with quantitative result.",
                          },
                        ],
                      })
                    }
                  />
                )}

                {section === "learning" && (
                  <LearningSkillsView
                    skills={skills}
                    courses={courses}
                    onChallengeSkill={(skillId, note) =>
                      challengeSkill(skillId, note)
                    }
                    onUpgradeSkillDemonstrated={(skillId, courseId) =>
                      upgradeSkillDemonstrated(skillId, courseId)
                    }
                  />
                )}

                {section === "mcp" && (
                  <McpAssistantView
                    profile={profile}
                    connections={connections}
                    externalApps={externalApps}
                    activityLog={activityLog}
                    onToggleConnection={(id) => toggleConnection(id)}
                    onToggleExternalApp={(id) => toggleExternalApp(id)}
                    onClearActivity={() => clearActivity()}
                    onRecordAssistantPlanRun={(prompt) =>
                      recordAssistantRun(prompt)
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
                    onAddContact={(contact) => addContact(contact)}
                  />
                )}

                {section === "alerts" && (
                  <AlertsView
                    alerts={alerts}
                    onDismissAlert={(id) => dismissAlert(id)}
                    onNavigate={navigateTo}
                  />
                )}

                {section === "settings" && (
                  <SettingsPrivacyView
                    profile={profile}
                    plan={plan}
                    onChangePlan={(nextPlan) => changePlan(nextPlan)}
                    onResetWorkspaceData={resetWorkspaceData}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
      </div>

      {/* APPLE HIG 5-TAB BOTTOM NAVIGATION (Mobile Companion Only) */}
      <MobileTabBar
        activeTab={primaryTab}
        onSelectSection={navigateTo}
        jobsCount={jobs.filter((j) => !hiddenJobIds.includes(j.id)).length}
        appsCount={applications.length}
      />

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

