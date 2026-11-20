"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type AlertItem,
  type BillingInvoiceItem,
  type CatalogCourseItem,
  type CourseItem,
  type CoverLetterDraft,
  type CvDiffSuggestion,
  type CvQualityFlag,
  type DailyPlanTask,
  type DashboardApplication,
  type DashboardJob,
  type DashboardSectionId,
  type ExternalAiAppAccess,
  INITIAL_ALERTS,
  INITIAL_APPLICATIONS,
  INITIAL_ASSESSMENTS,
  INITIAL_BILLING_INVOICES,
  INITIAL_CONTACTS,
  INITIAL_COURSE_CATALOG,
  INITIAL_COURSES,
  INITIAL_COVER_LETTERS,
  INITIAL_CV_DIFFS,
  INITIAL_CV_QUALITY_FLAGS,
  INITIAL_DAILY_PLAN,
  INITIAL_EXTERNAL_AI_APPS,
  INITIAL_INTERVIEW_SESSIONS,
  INITIAL_JOBS,
  INITIAL_MCP_ACTIVITY,
  INITIAL_MCP_CONNECTIONS,
  INITIAL_RESUMES,
  INITIAL_SAVED_SEARCHES,
  INITIAL_SKILLS,
  type InterviewSessionRecord,
  type McpActivityEntry,
  type McpConnection,
  type NetworkContact,
  type OnboardingProfileState,
  type ResumeDocument,
  type SavedJobSearch,
  type SkillAssessmentItem,
  type SkillRecord,
  type SubscriptionPlan,
  type VexApplyExtensionSettings,
  DEFAULT_APPLY_SETTINGS,
} from "@/data/dashboard";

export const DEFAULT_VEX_PROFILE: OnboardingProfileState = {
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

interface VexWorkspaceContextValue {
  profile: OnboardingProfileState;
  plan: SubscriptionPlan;
  jobs: DashboardJob[];
  savedJobIds: string[];
  hiddenJobIds: string[];
  savedSearches: SavedJobSearch[];
  recentlyViewedJobIds: string[];
  applications: DashboardApplication[];
  diffs: CvDiffSuggestion[];
  flags: CvQualityFlag[];
  resumes: ResumeDocument[];
  coverLetters: CoverLetterDraft[];
  skills: SkillRecord[];
  courses: CourseItem[];
  catalogCourses: CatalogCourseItem[];
  assessments: SkillAssessmentItem[];
  interviewSessions: InterviewSessionRecord[];
  dailyTasks: DailyPlanTask[];
  connections: McpConnection[];
  externalApps: ExternalAiAppAccess[];
  activityLog: McpActivityEntry[];
  alerts: AlertItem[];
  readAlertIds: string[];
  contacts: NetworkContact[];
  invoices: BillingInvoiceItem[];
  mockSessionsCount: number;
  coachOpen: boolean;
  setCoachOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saveProfile: (next: OnboardingProfileState) => void;
  changePlan: (nextPlan: SubscriptionPlan, addInvoiceNote?: string) => void;
  resetWorkspaceData: () => void;
  toggleSaveJob: (jobId: string) => void;
  hideJob: (jobId: string) => void;
  unhideJob: (jobId: string) => void;
  markJobViewed: (jobId: string) => void;
  addSavedSearch: (search: Omit<SavedJobSearch, "id" | "createdAt">) => void;
  deleteSavedSearch: (id: string) => void;
  toggleSavedSearchAlert: (id: string) => void;
  prepareApplication: (job: DashboardJob) => DashboardApplication;
  updateApplication: (appId: string, updater: (prev: DashboardApplication) => DashboardApplication) => void;
  decideDiff: (diffId: string, decision: "accepted" | "rejected") => void;
  resolveFlag: (flagId: string) => void;
  saveResume: (doc: ResumeDocument) => void;
  createResume: (doc: ResumeDocument) => void;
  saveCoverLetter: (letter: CoverLetterDraft) => void;
  createCoverLetter: (letter: CoverLetterDraft) => void;
  deleteCoverLetter: (letterId: string) => void;
  applySettings: VexApplyExtensionSettings;
  updateApplySettings: (patch: Partial<VexApplyExtensionSettings>) => void;
  challengeSkill: (skillId: string, note: string) => void;
  upgradeSkillDemonstrated: (skillId: string, courseId: string) => void;
  toggleCourseEnrollment: (courseId: string) => void;
  updateCourseProgress: (courseId: string, pct: number) => void;
  recordAssessmentResult: (assessmentId: string, scorePct: number, passed: boolean) => void;
  addInterviewSession: (session: InterviewSessionRecord) => void;
  toggleTask: (taskId: string) => void;
  toggleConnection: (id: string) => void;
  toggleExternalApp: (id: string) => void;
  clearActivity: () => void;
  recordAssistantRun: (prompt: string) => void;
  dismissAlert: (id: string) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  addContact: (contact: NetworkContact) => void;
  logInvitation: (company: string, role: string, dateText: string) => void;
}

const VexWorkspaceContext = createContext<VexWorkspaceContextValue | null>(null);
const STORE_KEY = "vex_workspace_state_v2";

export function VexWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<OnboardingProfileState>(DEFAULT_VEX_PROFILE);
  const [plan, setPlan] = useState<SubscriptionPlan>("Pro");
  const [jobs] = useState<DashboardJob[]>(INITIAL_JOBS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([
    "job-northbridge",
    "job-aldermere",
  ]);
  const [hiddenJobIds, setHiddenJobIds] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedJobSearch[]>(INITIAL_SAVED_SEARCHES);
  const [recentlyViewedJobIds, setRecentlyViewedJobIds] = useState<string[]>([
    "job-northbridge",
    "job-aldermere",
  ]);
  const [applications, setApplications] =
    useState<DashboardApplication[]>(INITIAL_APPLICATIONS);
  const [diffs, setDiffs] = useState<CvDiffSuggestion[]>(INITIAL_CV_DIFFS);
  const [flags, setFlags] = useState<CvQualityFlag[]>(INITIAL_CV_QUALITY_FLAGS);
  const [resumes, setResumes] = useState<ResumeDocument[]>(INITIAL_RESUMES);
  const [coverLetters, setCoverLetters] =
    useState<CoverLetterDraft[]>(INITIAL_COVER_LETTERS);
  const [skills, setSkills] = useState<SkillRecord[]>(INITIAL_SKILLS);
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [catalogCourses, setCatalogCourses] = useState<CatalogCourseItem[]>(
    INITIAL_COURSE_CATALOG
  );
  const [assessments, setAssessments] =
    useState<SkillAssessmentItem[]>(INITIAL_ASSESSMENTS);
  const [interviewSessions, setInterviewSessions] = useState<
    InterviewSessionRecord[]
  >(INITIAL_INTERVIEW_SESSIONS);
  const [dailyTasks, setDailyTasks] = useState<DailyPlanTask[]>(INITIAL_DAILY_PLAN);
  const [connections, setConnections] = useState<McpConnection[]>(
    INITIAL_MCP_CONNECTIONS
  );
  const [externalApps, setExternalApps] = useState<ExternalAiAppAccess[]>(
    INITIAL_EXTERNAL_AI_APPS
  );
  const [activityLog, setActivityLog] =
    useState<McpActivityEntry[]>(INITIAL_MCP_ACTIVITY);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [readAlertIds, setReadAlertIds] = useState<string[]>([]);
  const [contacts, setContacts] = useState<NetworkContact[]>(INITIAL_CONTACTS);
  const [invoices, setInvoices] = useState<BillingInvoiceItem[]>(
    INITIAL_BILLING_INVOICES
  );
  const [mockSessionsCount, setMockSessionsCount] = useState(1);
  const [coachOpen, setCoachOpen] = useState(false);
  const [applySettings, setApplySettings] =
    useState<VexApplyExtensionSettings>(DEFAULT_APPLY_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate cleanly from existing onboarding keys + workspace cache
  useEffect(() => {
    try {
      if (!window.localStorage.getItem("vex_coach_tour_done")) {
        setCoachOpen(true);
      }

      const onboardingRaw = window.localStorage.getItem("vex_onboarding_profile");
      const userRaw = window.localStorage.getItem("vex_frontend_user");
      const storedPlan = window.localStorage.getItem("vex_subscription_plan");
      if (storedPlan === "Free" || storedPlan === "Pro" || storedPlan === "Ultra") {
        setPlan(storedPlan);
      }

      let merged = { ...DEFAULT_VEX_PROFILE };
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

      const savedRaw = window.localStorage.getItem(STORE_KEY);
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw) as Partial<{
          savedJobIds: string[];
          hiddenJobIds: string[];
          savedSearches: SavedJobSearch[];
          recentlyViewedJobIds: string[];
          applications: DashboardApplication[];
          resumes: ResumeDocument[];
          coverLetters: CoverLetterDraft[];
          catalogCourses: CatalogCourseItem[];
          assessments: SkillAssessmentItem[];
          interviewSessions: InterviewSessionRecord[];
          contacts: NetworkContact[];
          readAlertIds: string[];
          invoices: BillingInvoiceItem[];
          mockSessionsCount: number;
          connections: McpConnection[];
          externalApps: ExternalAiAppAccess[];
          activityLog: McpActivityEntry[];
          applySettings: VexApplyExtensionSettings;
        }>;
        if (Array.isArray(parsed.savedJobIds)) setSavedJobIds(parsed.savedJobIds);
        if (Array.isArray(parsed.hiddenJobIds)) setHiddenJobIds(parsed.hiddenJobIds);
        if (Array.isArray(parsed.savedSearches)) setSavedSearches(parsed.savedSearches);
        if (Array.isArray(parsed.recentlyViewedJobIds))
          setRecentlyViewedJobIds(parsed.recentlyViewedJobIds);
        if (Array.isArray(parsed.applications)) setApplications(parsed.applications);
        if (Array.isArray(parsed.resumes)) setResumes(parsed.resumes);
        if (Array.isArray(parsed.coverLetters)) setCoverLetters(parsed.coverLetters);
        if (Array.isArray(parsed.catalogCourses))
          setCatalogCourses(parsed.catalogCourses);
        if (Array.isArray(parsed.assessments)) setAssessments(parsed.assessments);
        if (Array.isArray(parsed.interviewSessions))
          setInterviewSessions(parsed.interviewSessions);
        if (Array.isArray(parsed.contacts)) setContacts(parsed.contacts);
        if (Array.isArray(parsed.readAlertIds)) setReadAlertIds(parsed.readAlertIds);
        if (Array.isArray(parsed.invoices)) setInvoices(parsed.invoices);
        if (typeof parsed.mockSessionsCount === "number")
          setMockSessionsCount(parsed.mockSessionsCount);
        if (Array.isArray(parsed.connections)) setConnections(parsed.connections);
        if (Array.isArray(parsed.externalApps)) setExternalApps(parsed.externalApps);
        if (Array.isArray(parsed.activityLog)) setActivityLog(parsed.activityLog);
        if (parsed.applySettings)
          setApplySettings({ ...DEFAULT_APPLY_SETTINGS, ...parsed.applySettings });
      }
    } catch {
      // Safe fallback to defaults
    }
    setHydrated(true);
  }, []);

  // Persist workspace mutations to localStorage after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          savedJobIds,
          hiddenJobIds,
          savedSearches,
          recentlyViewedJobIds,
          applications,
          resumes,
          coverLetters,
          catalogCourses,
          assessments,
          interviewSessions,
          contacts,
          readAlertIds,
          invoices,
          mockSessionsCount,
          connections,
          externalApps,
          activityLog,
          applySettings,
        })
      );
    } catch {
      // Ignore storage quota issues
    }
  }, [
    hydrated,
    savedJobIds,
    hiddenJobIds,
    savedSearches,
    recentlyViewedJobIds,
    applications,
    resumes,
    coverLetters,
    catalogCourses,
    assessments,
    interviewSessions,
    contacts,
    readAlertIds,
    invoices,
    mockSessionsCount,
    connections,
    externalApps,
    activityLog,
    applySettings,
  ]);

  function saveProfile(next: OnboardingProfileState) {
    setProfile(next);
    try {
      window.localStorage.setItem("vex_onboarding_profile", JSON.stringify(next));
      window.localStorage.setItem(
        "vex_frontend_user",
        JSON.stringify({ name: next.name, email: next.email })
      );
    } catch {
      // Ignore
    }
  }

  function changePlan(nextPlan: SubscriptionPlan, addInvoiceNote?: string) {
    setPlan(nextPlan);
    try {
      window.localStorage.setItem("vex_subscription_plan", nextPlan);
    } catch {
      // Ignore
    }
    if (addInvoiceNote) {
      const priceMap: Record<SubscriptionPlan, string> = {
        Free: "£0.00",
        Pro: "£19.00",
        Ultra: "£39.00",
      };
      setInvoices((prev) => [
        {
          id: `INV-${Date.now().toString().slice(-6)}`,
          date: "Today (Preview)",
          plan: nextPlan,
          amount: priceMap[nextPlan],
          status: "Local preview (no charge)",
          note: addInvoiceNote,
        },
        ...prev,
      ]);
    }
  }

  function resetWorkspaceData() {
    try {
      window.localStorage.removeItem("vex_onboarding_profile");
      window.localStorage.removeItem("vex_frontend_user");
      window.localStorage.removeItem(STORE_KEY);
    } catch {
      // Ignore
    }
    setProfile(DEFAULT_VEX_PROFILE);
    setApplications(INITIAL_APPLICATIONS);
    setDiffs(INITIAL_CV_DIFFS);
    setFlags(INITIAL_CV_QUALITY_FLAGS);
    setResumes(INITIAL_RESUMES);
    setCoverLetters(INITIAL_COVER_LETTERS);
    setSkills(INITIAL_SKILLS);
    setCourses(INITIAL_COURSES);
    setCatalogCourses(INITIAL_COURSE_CATALOG);
    setAssessments(INITIAL_ASSESSMENTS);
    setInterviewSessions(INITIAL_INTERVIEW_SESSIONS);
    setAlerts(INITIAL_ALERTS);
    setContacts(INITIAL_CONTACTS);
    setReadAlertIds([]);
    setInvoices(INITIAL_BILLING_INVOICES);
  }

  function toggleSaveJob(jobId: string) {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  }

  function hideJob(jobId: string) {
    setHiddenJobIds((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
  }

  function unhideJob(jobId: string) {
    setHiddenJobIds((prev) => prev.filter((id) => id !== jobId));
  }

  function markJobViewed(jobId: string) {
    setRecentlyViewedJobIds((prev) => [jobId, ...prev.filter((id) => id !== jobId)].slice(0, 6));
  }

  function addSavedSearch(search: Omit<SavedJobSearch, "id" | "createdAt">) {
    setSavedSearches((prev) => [
      {
        ...search,
        id: `ss-${Date.now()}`,
        createdAt: "Today",
      },
      ...prev,
    ]);
  }

  function deleteSavedSearch(id: string) {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleSavedSearchAlert(id: string) {
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, alertEnabled: !s.alertEnabled } : s))
    );
  }

  function prepareApplication(job: DashboardJob): DashboardApplication {
    const existing = applications.find((a) => a.jobId === job.id);
    if (existing) return existing;
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
      cvVariant: resumes[0]?.name || "Master CV",
      coverLetterApproved: false,
      checklist: {
        cvReviewed: false,
        letterApproved: false,
        questionsAnswered: false,
        fieldsChecked: false,
      },
      notes: "Prepared from job discovery flow.",
      followUpDate: "After user-approved submission",
      history: [
        {
          at: "Just now",
          actor: "Vex Workspace",
          event: `Prepared application draft for ${job.company}`,
        },
      ],
      extensionFields: [
        {
          id: `ef-${Date.now()}-1`,
          label: "Full Name",
          value: profile.name || "Candidate",
          source: "Baseline profile",
          status: "Filled",
        },
        {
          id: `ef-${Date.now()}-2`,
          label: "Email",
          value: profile.email || "candidate@vex.careers",
          source: "Account",
          status: "Filled",
        },
        {
          id: `ef-${Date.now()}-3`,
          label: "Role-specific screening note",
          value: "",
          source: "Needs candidate input",
          status: "Needs input",
        },
      ],
    };
    setApplications((prev) => [created, ...prev]);
    return created;
  }

  function updateApplication(
    appId: string,
    updater: (prev: DashboardApplication) => DashboardApplication
  ) {
    setApplications((prev) => prev.map((a) => (a.id === appId ? updater(a) : a)));
  }

  function decideDiff(diffId: string, decision: "accepted" | "rejected") {
    setDiffs((prev) =>
      prev.map((d) => (d.id === diffId ? { ...d, status: decision } : d))
    );
    if (diffId === "diff-2" && decision === "rejected") {
      setFlags((prev) =>
        prev.map((f) => (f.id === "qf-1" ? { ...f, resolved: true } : f))
      );
    }
  }

  function resolveFlag(flagId: string) {
    setFlags((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, resolved: true } : f))
    );
  }

  function saveResume(doc: ResumeDocument) {
    setResumes((prev) => prev.map((r) => (r.id === doc.id ? doc : r)));
  }

  function createResume(doc: ResumeDocument) {
    setResumes((prev) => [doc, ...prev]);
  }

  function saveCoverLetter(letter: CoverLetterDraft) {
    setCoverLetters((prev) =>
      prev.map((l) => (l.id === letter.id ? letter : l))
    );
  }

  function createCoverLetter(letter: CoverLetterDraft) {
    setCoverLetters((prev) => [letter, ...prev]);
  }

  function deleteCoverLetter(letterId: string) {
    setCoverLetters((prev) => prev.filter((l) => l.id !== letterId));
  }

  function updateApplySettings(patch: Partial<VexApplyExtensionSettings>) {
    setApplySettings((prev) => ({
      ...prev,
      ...patch,
      confirmBeforeSubmit: true, // Always enforced by design
    }));
  }

  function challengeSkill(skillId: string, note: string) {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === skillId
          ? {
              ...s,
              challengeHistory: [...s.challengeHistory, `User challenged: "${note}"`],
            }
          : s
      )
    );
  }

  function upgradeSkillDemonstrated(skillId: string, courseId: string) {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === skillId
          ? {
              ...s,
              evidenceTier: "Demonstrated in Vex",
              proficiency: "Intermediate",
              confidence: "High",
              confidenceReason: "Demonstrated in Vex interactive practical check",
            }
          : s
      )
    );
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, status: "Completed" } : c))
    );
  }

  function toggleCourseEnrollment(courseId: string) {
    setCatalogCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              enrolled: !c.enrolled,
              progressPct: !c.enrolled && c.progressPct === 0 ? 10 : c.progressPct,
            }
          : c
      )
    );
  }

  function updateCourseProgress(courseId: string, pct: number) {
    setCatalogCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, progressPct: pct } : c))
    );
  }

  function recordAssessmentResult(
    assessmentId: string,
    scorePct: number,
    passed: boolean
  ) {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === assessmentId
          ? {
              ...a,
              lastScorePct: scorePct,
              passed,
              completedAt: "Just now",
            }
          : a
      )
    );
    const target = assessments.find((a) => a.id === assessmentId);
    if (passed && target) {
      upgradeSkillDemonstrated(target.skillId, "crs-2");
    }
  }

  function addInterviewSession(session: InterviewSessionRecord) {
    setInterviewSessions((prev) => [session, ...prev]);
    setMockSessionsCount((c) => c + 1);
  }

  function toggleTask(taskId: string) {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  }

  function toggleConnection(id: string) {
    setConnections((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === "Connected" ? "Disconnected" : "Connected",
              lastUsed: "Updated locally just now",
            }
          : c
      )
    );
  }

  function toggleExternalApp(id: string) {
    setExternalApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, enabled: !app.enabled } : app))
    );
  }

  function clearActivity() {
    setActivityLog([]);
  }

  function recordAssistantRun(prompt: string) {
    setActivityLog((prev) => [
      {
        id: `log-${Date.now()}`,
        time: "Just now",
        actor: "Vex AI Assistant",
        tool: "Workspace Preview Run",
        action: prompt.slice(0, 72),
        dataShared: "Profile baseline + CV draft categories (supervised)",
        approval: "Approved",
        result: "Succeeded",
      },
      ...prev,
    ]);
  }

  function dismissAlert(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dismissed: true } : a))
    );
  }

  function markAlertRead(id: string) {
    setReadAlertIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function markAllAlertsRead() {
    setReadAlertIds(alerts.map((a) => a.id));
  }

  function addContact(contact: NetworkContact) {
    setContacts((prev) => [contact, ...prev]);
  }

  function logInvitation(company: string, role: string, dateText: string) {
    setApplications((prev) =>
      prev.map((a) =>
        a.company.toLowerCase().includes(company.toLowerCase().split(" ")[0])
          ? {
              ...a,
              stage: "Interview",
              interviewDate: dateText,
              history: [
                {
                  at: "Just now",
                  actor: "User",
                  event: `Logged interview invitation (${role}) for ${dateText}`,
                },
                ...a.history,
              ],
            }
          : a
      )
    );
  }

  return (
    <VexWorkspaceContext.Provider
      value={{
        profile,
        plan,
        jobs,
        savedJobIds,
        hiddenJobIds,
        savedSearches,
        recentlyViewedJobIds,
        applications,
        diffs,
        flags,
        resumes,
        coverLetters,
        skills,
        courses,
        catalogCourses,
        assessments,
        interviewSessions,
        dailyTasks,
        connections,
        externalApps,
        activityLog,
        alerts,
        readAlertIds,
        contacts,
        invoices,
        mockSessionsCount,
        coachOpen,
        setCoachOpen,
        saveProfile,
        changePlan,
        resetWorkspaceData,
        toggleSaveJob,
        hideJob,
        unhideJob,
        markJobViewed,
        addSavedSearch,
        deleteSavedSearch,
        toggleSavedSearchAlert,
        prepareApplication,
        updateApplication,
        decideDiff,
        resolveFlag,
        saveResume,
        createResume,
        saveCoverLetter,
        createCoverLetter,
        deleteCoverLetter,
        applySettings,
        updateApplySettings,
        challengeSkill,
        upgradeSkillDemonstrated,
        toggleCourseEnrollment,
        updateCourseProgress,
        recordAssessmentResult,
        addInterviewSession,
        toggleTask,
        toggleConnection,
        toggleExternalApp,
        clearActivity,
        recordAssistantRun,
        dismissAlert,
        markAlertRead,
        markAllAlertsRead,
        addContact,
        logInvitation,
      }}
    >
      {children}
    </VexWorkspaceContext.Provider>
  );
}

export function useVexWorkspace() {
  const ctx = useContext(VexWorkspaceContext);
  if (!ctx) {
    throw new Error("useVexWorkspace must be used inside VexWorkspaceProvider");
  }
  return ctx;
}
