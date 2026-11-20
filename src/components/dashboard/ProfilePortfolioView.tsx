"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  INITIAL_PORTFOLIO_PROJECTS,
  type OnboardingProfileState,
  type PortfolioProject,
} from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { CheckIcon } from "@/components/Icons";
import {
  CareerTrajectoryCanvas,
  CaseArtifactsBarCanvas,
  LinkedinProgressBarCanvas,
  ReadinessGaugeCanvas,
  RoadmapHorizonCanvas,
  SkillsAreaSparkCanvas,
  VitruvianRadarCanvas,
  type RoadmapPhaseMetric,
  type TrajectoryDatum,
} from "@/components/dashboard/RealProfileCharts";

interface ProfilePortfolioViewProps {
  profile: OnboardingProfileState;
  onSaveProfile: (next: OnboardingProfileState) => void;
}

type StudioPill = "overview" | "baseline" | "linkedin" | "portfolio" | "roadmap";
type PaintingId = "athens" | "vitruvian" | "hands";
type PhilosopherId = "plato" | "aristotle" | "davinci" | "aurelius";

interface MuseumPainting {
  id: PaintingId;
  title: string;
  artist: string;
  year: string;
  image: string;
  collection: string;
  maxim: string;
  objectPosition: string;
}

interface PhilosopherPatron {
  id: PhilosopherId;
  name: string;
  school: string;
  era: string;
  discipline: string;
  quote: string;
  repoBadge: string;
  paintingId: PaintingId;
}

interface GitHubPinnedRepo {
  id: string;
  name: string;
  description: string;
  language: string;
  langDot: string;
  stars: number;
  forks: number;
  philosopherId: PhilosopherId;
  paintingImage: string;
  paintingLabel: string;
  visibility: string;
  updated: string;
  topics: string[];
}

const MUSEUM_PAINTINGS: MuseumPainting[] = [
  {
    id: "athens",
    title: "The School of Athens",
    artist: "Raphael Sanzio",
    year: "1509 - 1511",
    image: "/images/raphael-athens.jpg",
    collection: "Apostolic Palace · Stanza della Segnatura",
    maxim:
      "Dialectical clarity meets architectural harmony: every system should stand on first principles.",
    objectPosition: "center 32%",
  },
  {
    id: "vitruvian",
    title: "Codex & Vitruvian Proportions",
    artist: "Leonardo da Vinci",
    year: "c. 1490",
    image: "/images/davinci-codex.jpg",
    collection: "Gallerie dell'Accademia · Codex Folio",
    maxim:
      "Saper vedere — disciplined observation turns messy execution into verifiable craft.",
    objectPosition: "center 42%",
  },
  {
    id: "hands",
    title: "Harmonic Creation Studies",
    artist: "Michelangelo Buonarroti",
    year: "1508 - 1512",
    image: "/images/michelangelo-hands.jpg",
    collection: "Sistine Chapel · Golden Ratio Folio",
    maxim:
      "Measure every handoff precisely; greatness lives in the tension between intent and proof.",
    objectPosition: "center 48%",
  },
];

const PHILOSOPHER_PATRONS: PhilosopherPatron[] = [
  {
    id: "plato",
    name: "Plato",
    school: "The Academy · Dialectics",
    era: "428 - 348 BCE",
    discipline: "First-Principles Systems",
    quote: "Do not train youths to learning by force, but direct them to what clarifies their craft.",
    repoBadge: "Plato · Academy",
    paintingId: "athens",
  },
  {
    id: "aristotle",
    name: "Aristotle",
    school: "Lyceum · Empiricism",
    era: "384 - 322 BCE",
    discipline: "Observable Evidence",
    quote: "Excellence is never an accident; it is verified repeatedly through disciplined habit.",
    repoBadge: "Aristotle · Proof",
    paintingId: "athens",
  },
  {
    id: "davinci",
    name: "Leonardo da Vinci",
    school: "Renaissance Polymath",
    era: "1452 - 1519",
    discipline: "Codex Telemetry",
    quote: "Details make perfection, and perfection is no trivial detail in production engineering.",
    repoBadge: "Da Vinci · Codex",
    paintingId: "vitruvian",
  },
  {
    id: "aurelius",
    name: "Marcus Aurelius",
    school: "Stoic Governance",
    era: "121 - 180 CE",
    discipline: "Calm Delivery",
    quote: "The impediment to release governance becomes the very path that strengthens the gate.",
    repoBadge: "Stoa · Gatekeeper",
    paintingId: "hands",
  },
];

const GITHUB_PINNED_REPOS: GitHubPinnedRepo[] = [
  {
    id: "repo-release-gates",
    name: "release-readiness-gates",
    description:
      "Deterministic launch-gate checklist & roll-back telemetry suite used across 42 enterprise EMEA rollouts.",
    language: "TypeScript",
    langDot: "#3178c6",
    stars: 48,
    forks: 11,
    philosopherId: "aristotle",
    paintingImage: "/images/raphael-athens.jpg",
    paintingLabel: "School of Athens",
    visibility: "Public · Attested",
    updated: "Updated 2d ago",
    topics: ["release-ops", "sla-telemetry", "zero-fabrication"],
  },
  {
    id: "repo-sql-cohort",
    name: "sql-cohort-audit-kit",
    description:
      "Window-function & retention cohort queries with reproducible schema assertions and markdown evidence dumps.",
    language: "SQL",
    langDot: "#c9963f",
    stars: 34,
    forks: 9,
    philosopherId: "davinci",
    paintingImage: "/images/davinci-codex.jpg",
    paintingLabel: "Vitruvian Codex",
    visibility: "Public · Portfolio",
    updated: "Updated 4d ago",
    topics: ["postgresql", "cohorts", "data-audit"],
  },
  {
    id: "repo-stakeholder-canvas",
    name: "harmonic-stakeholder-matrix",
    description:
      "RACI escalation protocol & executive brief templates uniting product, compliance, and implementation teams.",
    language: "Governance",
    langDot: "#2d6a4f",
    stars: 29,
    forks: 7,
    philosopherId: "plato",
    paintingImage: "/images/michelangelo-hands.jpg",
    paintingLabel: "Harmonic Creation",
    visibility: "Public · Attested",
    updated: "Updated 1w ago",
    topics: ["delivery", "governance", "academy"],
  },
  {
    id: "repo-stoic-playbook",
    name: "stoic-incident-triage",
    description:
      "Post-mortem taxonomy & calm runbook framework eliminating repeat Sev-2 handoff regressions across EU pods.",
    language: "Python",
    langDot: "#3572a5",
    stars: 23,
    forks: 5,
    philosopherId: "aurelius",
    paintingImage: "/images/vex-philosopher.jpg",
    paintingLabel: "Marble Study",
    visibility: "Public · Proof",
    updated: "Updated 2w ago",
    topics: ["runbooks", "sre-mindset", "calm-ops"],
  },
];

const HEATMAP_PALETTE = ["#f0e9d8", "#dcd9c2", "#9ec49f", "#4c8b64", "#212d3d"] as const;
const MONTH_LABELS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

interface RoadmapTaskItem {
  id: string;
  label: string;
  done: boolean;
}

interface RoadmapEpoch {
  id: string;
  roman: string;
  shortLabel: string;
  title: string;
  windowLabel: string;
  greekPrinciple: string;
  horizonBand: string;
  baseReadiness: number;
  tasks: RoadmapTaskItem[];
}

const INITIAL_ROADMAP_EPOCHS: RoadmapEpoch[] = [
  {
    id: "agora",
    roman: "I",
    shortLabel: "I. Agora",
    title: "Agora Foundation & Baseline Truth",
    windowLabel: "Days 1 - 7 · Active Core",
    greekPrinciple: "Dialectical intake without fabricated bullet points",
    horizonBand: "Verified Baseline",
    baseReadiness: 76,
    tasks: [
      { id: "rm-1", label: "Lock canonical CV truth dates & verified credentials", done: true },
      { id: "rm-2", label: "Align LinkedIn headline with target Operations role", done: true },
      { id: "rm-3", label: "Attach 2 verifiable rollout case studies to codex", done: true },
    ],
  },
  {
    id: "lyceum",
    roman: "II",
    shortLabel: "II. Lyceum",
    title: "Lyceum Empirical Proof & SQL Cohort",
    windowLabel: "Days 8 - 21 · In Progress",
    greekPrinciple: "Aristotelian empirical proof across data audits",
    horizonBand: "Proof Expansion",
    baseReadiness: 85,
    tasks: [
      { id: "rm-4", label: "Complete PostgreSQL cohort retention audit repo", done: true },
      { id: "rm-5", label: "Document release rollback runbook metrics (-38% escalations)", done: false },
      { id: "rm-6", label: "Verify 100% LinkedIn featured artifacts", done: false },
    ],
  },
  {
    id: "acropolis",
    roman: "III",
    shortLabel: "III. Acropolis",
    title: "Parthenon Interview Readiness Sprint",
    windowLabel: "Days 22 - 45 · Target Window",
    greekPrinciple: "Stoic calm under technical & stakeholder panels",
    horizonBand: "£65k - £78k Band",
    baseReadiness: 93,
    tasks: [
      { id: "rm-7", label: "Run 3 timed Product Ops architecture mock drills", done: false },
      { id: "rm-8", label: "Tailor ATS truth diffs for top 6 EMEA shortlist roles", done: false },
    ],
  },
  {
    id: "delphi",
    roman: "IV",
    shortLabel: "IV. Delphi",
    title: "Delphi Principal & Head of Ops Horizon",
    windowLabel: "Month 6 - Year 2 · Long Arc",
    greekPrinciple: "Strategic foresight across multi-pod governance",
    horizonBand: "+18% Staff Band",
    baseReadiness: 98,
    tasks: [
      { id: "rm-9", label: "Lead cross-border platform release governance charter", done: false },
      { id: "rm-10", label: "Mentor implementation leads across EU & UK pods", done: false },
    ],
  },
];

export default function ProfilePortfolioView({
  profile,
  onSaveProfile,
}: ProfilePortfolioViewProps) {
  const [activePill, setActivePill] = useState<StudioPill>("overview");
  const [rightScheduleTab, setRightScheduleTab] = useState<"cases" | "checks" | "roadmap">("cases");
  const [trajectoryRange, setTrajectoryRange] = useState<"6 Months" | "24 Months">("6 Months");
  const [showFit, setShowFit] = useState(true);
  const [showEvidence, setShowEvidence] = useState(true);
  const [showGrowth, setShowGrowth] = useState(true);

  const [draft, setDraft] = useState<OnboardingProfileState>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  // Shareable profile & lightweight credential pills
  const [profilePublic, setProfilePublic] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [credentials, setCredentials] = useState<string[]>([
    "PRINCE2 Foundation",
    "BSc 2:1 Manchester",
    "SQL Cohort (Active)",
    "EU / UK Right to Work",
  ]);
  const [newCredential, setNewCredential] = useState("");
  // Phone-only: which overview tab is visible.
  const [mPane, setMPane] = useState<"stats" | "growth" | "proof">("stats");

  const [education] = useState(
    "BSc Business Computing & Systems · University of Manchester (2:1)"
  );
  const [languages, setLanguages] = useState("English (Native), Spanish (B1)");
  const [certifications, setCertifications] = useState(
    "PRINCE2 Foundation (#UK-88412)"
  );
  const [salaryTarget, setSalaryTarget] = useState("£65,000 – £78,000");

  const [linkedinChecks, setLinkedinChecks] = useState([
    {
      id: "li-1",
      label: "Headline matches target title & verified core competencies",
      done: true,
    },
    {
      id: "li-2",
      label: "Employment dates match CV Studio (Oct 2024 aligned)",
      done: true,
    },
    {
      id: "li-3",
      label: "Featured section links 1 documented rollout case study",
      done: false,
    },
  ]);

  const [projects, setProjects] = useState<PortfolioProject[]>(
    INITIAL_PORTFOLIO_PROJECTS
  );
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjOutcome, setNewProjOutcome] = useState("");

  // Combined Museum Paintings & Philosophers × GitHub Portfolio state
  const [githubHandle, setGithubHandle] = useState(() =>
    (profile.name || "alex-mercer-ops")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "alex-mercer-ops"
  );
  const [editingHandle, setEditingHandle] = useState(false);
  const [githubFollowing, setGithubFollowing] = useState(false);
  const [activePaintingId, setActivePaintingId] = useState<PaintingId>("athens");
  const [activePhilosopherId, setActivePhilosopherId] =
    useState<PhilosopherId>("davinci");
  const [starredRepos, setStarredRepos] = useState<Record<string, boolean>>({
    "repo-release-gates": true,
  });
  const [repoFilter, setRepoFilter] = useState<"all" | PhilosopherId>("all");
  const [selectedHeatWeek, setSelectedHeatWeek] = useState<number>(47);

  // Ancient Greece Roadmap state
  const [roadmapEpochs, setRoadmapEpochs] = useState<RoadmapEpoch[]>(INITIAL_ROADMAP_EPOCHS);
  const [activePhaseIdx, setActivePhaseIdx] = useState<number>(1);
  const [newMilestoneText, setNewMilestoneText] = useState("");

  const activeEpoch = roadmapEpochs[activePhaseIdx] ?? roadmapEpochs[0];

  const roadmapHorizonMetrics: RoadmapPhaseMetric[] = useMemo(
    () =>
      roadmapEpochs.map((epoch) => {
        const done = epoch.tasks.filter((t) => t.done).length;
        const pct = Math.round((done / Math.max(1, epoch.tasks.length)) * 100);
        return {
          phase: epoch.shortLabel,
          readiness: Math.min(100, epoch.baseReadiness + Math.round(pct * 0.08)),
          completion: pct,
        };
      }),
    [roadmapEpochs]
  );

  function toggleRoadmapTask(epochId: string, taskId: string) {
    setRoadmapEpochs((prev) =>
      prev.map((ep) =>
        ep.id === epochId
          ? {
              ...ep,
              tasks: ep.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
            }
          : ep
      )
    );
  }

  function addRoadmapTask(e: React.FormEvent) {
    e.preventDefault();
    const label = newMilestoneText.trim();
    if (!label) return;
    const targetId = activeEpoch.id;
    setRoadmapEpochs((prev) =>
      prev.map((ep) =>
        ep.id === targetId
          ? {
              ...ep,
              tasks: [...ep.tasks, { id: `rm-${Date.now()}`, label, done: false }],
            }
          : ep
      )
    );
    setNewMilestoneText("");
  }

  const activePainting =
    MUSEUM_PAINTINGS.find((p) => p.id === activePaintingId) ?? MUSEUM_PAINTINGS[0];
  const activePhilosopher =
    PHILOSOPHER_PATRONS.find((p) => p.id === activePhilosopherId) ??
    PHILOSOPHER_PATRONS[2];

  // Deterministic 52-week × 7-day classical contribution ledger
  const heatmapData = useMemo(() => {
    const weeks: { weekIndex: number; days: { level: number; count: number }[]; total: number }[] = [];
    let grandTotal = 0;
    for (let w = 0; w < 52; w += 1) {
      const days: { level: number; count: number }[] = [];
      let weekSum = 0;
      for (let d = 0; d < 7; d += 1) {
        const seed = (w * 13 + d * 7 + (w % 5) * 3) % 19;
        let level = 0;
        if (seed >= 16) level = 4;
        else if (seed >= 12) level = 3;
        else if (seed >= 8) level = 2;
        else if (seed >= 4) level = 1;
        const count = level === 0 ? 0 : level * 2 + (seed % 2);
        weekSum += count;
        days.push({ level, count });
      }
      grandTotal += weekSum;
      weeks.push({ weekIndex: w, days, total: weekSum });
    }
    return { weeks, grandTotal };
  }, []);

  const toggleRepoStar = (repoId: string) => {
    setStarredRepos((prev) => ({ ...prev, [repoId]: !prev[repoId] }));
  };

  const selectPhilosopher = (phil: PhilosopherPatron) => {
    setActivePhilosopherId(phil.id);
    setActivePaintingId(phil.paintingId);
  };

  const doneLinkedinCount = linkedinChecks.filter((c) => c.done).length;
  const linkedinPct = Math.round(
    (doneLinkedinCount / Math.max(1, linkedinChecks.length)) * 100
  );

  const profileSlug = useMemo(() => {
    const clean = (draft.name || "vex-candidate")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `vex.careers/in/${clean || "candidate"}`;
  }, [draft.name]);

  const profileCompleteness = useMemo(() => {
    const fields = [
      draft.name,
      draft.email,
      draft.currentRole,
      draft.targetRole,
      draft.workMode,
      draft.cvExcerpt,
      languages,
      certifications,
    ];
    const filled = fields.filter((v) => v && v.trim().length > 0).length;
    return Math.min(99, Math.round(68 + (filled / fields.length) * 30));
  }, [draft, languages, certifications]);

  const totalSkillsCount = useMemo(() => {
    return projects.reduce((acc, p) => acc + p.verifiedSkills.length, 0) + credentials.length + 8;
  }, [projects, credentials]);

  function copyShareLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`https://${profileSlug}`).catch(() => {});
    }
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 1800);
  }

  function addCredential(e: React.FormEvent) {
    e.preventDefault();
    const val = newCredential.trim();
    if (!val || credentials.includes(val)) return;
    setCredentials((prev) => [...prev, val]);
    setNewCredential("");
  }

  function removeCredential(item: string) {
    setCredentials((prev) => prev.filter((c) => c !== item));
  }

  function saveBaseline(e: React.FormEvent) {
    e.preventDefault();
    onSaveProfile(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  }

  function addPortfolioProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProjTitle.trim()) return;
    setProjects((prev) => [
      {
        id: `proj-${Date.now()}`,
        title: newProjTitle.trim(),
        role: draft.targetRole || "Verified Case Study",
        outcome:
          newProjOutcome.trim() ||
          "Documented artifact ready for portfolio attachment.",
        verifiedSkills: ["Evidence Attached"],
        linkLabel: "vex.careers/portfolio-preview",
      },
      ...prev,
    ]);
    setNewProjTitle("");
    setNewProjOutcome("");
  }

  function toggleLinkedinCheck(id: string) {
    setLinkedinChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  }

  const trajectoryPoints: TrajectoryDatum[] = useMemo(() => {
    const baseFit = Math.max(68, Math.min(96, profileCompleteness));
    const baseEvidence = Math.max(58, Math.min(94, 52 + projects.length * 10 + Math.round(linkedinPct * 0.2)));
    const baseGrowth = Math.max(54, Math.min(90, 48 + credentials.length * 5));

    if (trajectoryRange === "6 Months") {
      return [
        { label: "Base", fit: Math.max(52, baseFit - 22), evidence: Math.max(48, baseEvidence - 24), growth: Math.max(46, baseGrowth - 20) },
        { label: "M1", fit: Math.max(58, baseFit - 16), evidence: Math.max(54, baseEvidence - 17), growth: Math.max(52, baseGrowth - 15) },
        { label: "M2", fit: Math.max(64, baseFit - 11), evidence: Math.max(60, baseEvidence - 12), growth: Math.max(58, baseGrowth - 10) },
        { label: "M3", fit: Math.max(62, baseFit - 13), evidence: Math.max(66, baseEvidence - 8), growth: Math.max(61, baseGrowth - 7) },
        { label: "Now", fit: baseFit, evidence: baseEvidence, growth: baseGrowth },
        { label: "M5", fit: Math.min(98, baseFit + 4), evidence: Math.min(97, baseEvidence + 5), growth: Math.min(94, baseGrowth + 6) },
        { label: "M6", fit: Math.min(99, baseFit + 6), evidence: Math.min(99, baseEvidence + 8), growth: Math.min(97, baseGrowth + 9) },
      ];
    }
    return [
      { label: "Now", fit: baseFit, evidence: baseEvidence, growth: baseGrowth },
      { label: "Q2", fit: Math.min(96, baseFit + 3), evidence: Math.min(95, baseEvidence + 4), growth: Math.min(92, baseGrowth + 5) },
      { label: "Q3", fit: Math.min(97, baseFit + 4), evidence: Math.min(96, baseEvidence + 6), growth: Math.min(94, baseGrowth + 7) },
      { label: "Q4", fit: Math.min(95, baseFit + 2), evidence: Math.min(95, baseEvidence + 5), growth: Math.min(93, baseGrowth + 6) },
      { label: "Y1", fit: Math.min(98, baseFit + 6), evidence: Math.min(98, baseEvidence + 8), growth: Math.min(96, baseGrowth + 9) },
      { label: "Y1.5", fit: Math.min(99, baseFit + 7), evidence: Math.min(99, baseEvidence + 9), growth: Math.min(98, baseGrowth + 11) },
      { label: "Y2", fit: 100, evidence: 99, growth: 98 },
    ];
  }, [trajectoryRange, profileCompleteness, projects.length, linkedinPct, credentials.length]);

  const artifactBars = useMemo(
    () => [
      { label: "Case", value: projects.length + 12, color: "#cadcc9" },
      { label: "Repo", value: GITHUB_PINNED_REPOS.length * 4, color: "#8ab596" },
      { label: "Sync", value: doneLinkedinCount * 5, color: "#b6cbe6" },
      { label: "Cred", value: credentials.length * 4, color: "#dfd3ba" },
    ],
    [projects.length, doneLinkedinCount, credentials.length]
  );

  const skillSparkPoints = useMemo(
    () => [
      { stage: "Intake", count: Math.max(6, Math.round(totalSkillsCount * 0.45)) },
      { stage: "Draft", count: Math.max(9, Math.round(totalSkillsCount * 0.6)) },
      { stage: "Checks", count: Math.max(11, Math.round(totalSkillsCount * 0.72)) },
      { stage: "Proofs", count: Math.max(14, Math.round(totalSkillsCount * 0.88)) },
      { stage: "Cohort", count: totalSkillsCount - 2 },
      { stage: "Now", count: totalSkillsCount },
    ],
    [totalSkillsCount]
  );

  const radarAxes = useMemo(
    () => [
      { label: "Governance", score: Math.min(98, 76 + projects.length * 5) },
      { label: "Release", score: Math.min(97, 74 + doneLinkedinCount * 5) },
      { label: "SQL Audit", score: Math.min(95, 64 + credentials.length * 2) },
      { label: "Briefs", score: Math.min(96, 72 + Math.round(profileCompleteness * 0.2)) },
    ],
    [projects.length, doneLinkedinCount, credentials.length, profileCompleteness]
  );

  return (
    <div className="space-y-5">
      {/* ================================================================== */}
      {/* 1. LIGHT, AIRY LEONARDO DA VINCI & LIMESTONE STUDIO CANVAS         */}
      {/* ================================================================== */}
      <section className="relative overflow-hidden rounded-[26px] border border-[#dcd2bd] bg-[#f5f0e6] p-5 shadow-[0_10px_30px_rgba(33,45,61,0.07)] sm:p-6">
        {/* Delicate Vitruvian Hairline Draftsman Geometry */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 680"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.26]"
        >
          <g fill="none" stroke="#968464" strokeOpacity="0.32" strokeWidth="0.85">
            <circle cx="600" cy="295" r="220" />
            <rect x="380" y="110" width="440" height="390" strokeDasharray="3 4" />
            <circle cx="600" cy="295" r="165" strokeDasharray="5 5" />
          </g>
        </svg>

        {/* Top Studio Pill Bar */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c7b798] bg-[#fffef9]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" stroke="#3a2d1d" strokeWidth="1.2" />
                <rect x="6.5" y="6.5" width="11" height="11" stroke="#3a2d1d" strokeWidth="0.95" strokeOpacity="0.6" />
                <circle cx="12" cy="12" r="1.8" fill="#212d3d" />
              </svg>
            </div>
            <span className="font-serif-display text-[16px] text-[#212d3d]">
              Vex Codex
            </span>
          </div>

          <nav
            aria-label="Profile workspace views"
            className="flex flex-wrap items-center gap-1 rounded-full border border-[#d9ceb8] bg-[#fffef9]/90 p-1"
          >
            {(
              [
                { id: "overview", label: "Overview" },
                { id: "baseline", label: "Baseline Edit" },
                { id: "linkedin", label: "LinkedIn Sync" },
                { id: "portfolio", label: "Portfolio · GitHub" },
                { id: "roadmap", label: "Roadmap" },
              ] as const
            ).map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActivePill(pill.id)}
                className={`cursor-pointer rounded-full px-3.5 py-1 text-[11.5px] font-medium transition-all ${
                  activePill === pill.id
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "text-[#5a503f] hover:bg-[#efe6d1] hover:text-[#212d3d]"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/onboarding"
              className="rounded-full border border-[#cfc3a8] bg-[#fffef9] px-3 py-1 text-[11px] font-medium text-[#212d3d] transition-colors hover:border-[#212d3d]"
            >
              Re-run Intake
            </Link>
            <img
              src="/images/davinci-profile-bust.jpg"
              alt={draft.name || "Candidate"}
              className="h-8 w-8 rounded-full border border-[#c7b798] object-cover object-top"
            />
          </div>
        </div>

        {/* Dynamic Workspace Mode: OVERVIEW vs FOCUSED PANEL */}
        {activePill === "overview" ? (
          <>
            {/* Compact Title Strip */}
            <div className="relative z-20 mt-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="font-serif-display text-[clamp(1.7rem,2.7vw,2.35rem)] font-normal leading-[1.08] tracking-[-0.02em] text-[#212d3d]">
                  Canonical Profile &amp; Portfolio
                </h1>
                <p className="mt-0.5 text-[13px] text-[#5c5344]">
                  {draft.name || "Candidate"} · {draft.targetRole || "Product Operations Lead"} · {draft.workMode}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8ceb8] bg-[#fffef9]/85 px-3 py-1 font-mono text-[10.5px] text-[#4c4233]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                <span>{salaryTarget}</span>
              </div>
            </div>

            {/* Phone: split the overview into three focused tabs */}
            <div className="relative z-20 mt-4 grid grid-cols-3 rounded-[14px] bg-[#e7e0cf] p-1 lg:hidden">
              {(
                [
                  { id: "stats", label: "Stats" },
                  { id: "growth", label: "Growth" },
                  { id: "proof", label: "Proof" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setMPane(t.id)}
                  className={`cursor-pointer rounded-[10px] py-2 text-[12.5px] font-semibold transition-colors ${
                    mPane === t.id ? "bg-white text-[#212d3d] shadow-[0_1px_4px_rgba(33,45,61,0.12)]" : "text-[#6f6a5f]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Light 3-Column Bento Grid Around Leonardo Centerpiece */}
            <div className="relative z-20 mt-5 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
              {/* LEFT STACK */}
              <div className={`${mPane !== "stats" ? "max-lg:hidden" : ""} flex flex-col justify-between gap-3.5 lg:col-span-3`}>
                {/* Readiness Card */}
                <div className="rounded-[20px] border border-[#e2d9c5] bg-[#fffef9]/95 p-4 shadow-[0_4px_16px_rgba(33,45,61,0.04)]">
                  <div className="flex items-start justify-between">
                    <h2 className="text-[14.5px] font-medium text-[#212d3d]">
                      Profile Readiness
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActivePill("baseline")}
                      aria-label="Edit baseline"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#e2d9c5] bg-[#faf6ed] text-[#433626] hover:border-[#212d3d]"
                    >
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <circle cx="8" cy="5.5" r="2.3" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M3.8 13.5c.7-2 2.2-3 4.2-3s3.5 1 4.2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[10.5px] text-[#6d6250]">Verified</p>
                      <p className="font-serif-display text-[28px] leading-none text-[#212d3d]">
                        {profileCompleteness}%
                      </p>
                    </div>
                    <ReadinessGaugeCanvas percentage={profileCompleteness} />
                  </div>
                </div>

                {/* Case Artifacts Capsule Bars */}
                <div className="rounded-[20px] border border-[#e2d9c5] bg-[#fffef9]/95 p-4 shadow-[0_4px_16px_rgba(33,45,61,0.04)]">
                  <div className="flex items-start justify-between">
                    <h2 className="text-[14.5px] font-medium text-[#212d3d]">
                      Case Artifacts
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActivePill("portfolio")}
                      aria-label="Open portfolio"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#e2d9c5] bg-[#faf6ed] text-[#433626] hover:border-[#212d3d]"
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[10.5px] text-[#6d6250]">Proof Links</p>
                      <p className="font-serif-display text-[28px] leading-none text-[#212d3d]">
                        {projects.length + 12}
                      </p>
                    </div>
                    <CaseArtifactsBarCanvas data={artifactBars} />
                  </div>
                </div>

                {/* Attested Skills Sparkline */}
                <div className="rounded-[20px] border border-[#e2d9c5] bg-[#fffef9]/95 p-4 shadow-[0_4px_16px_rgba(33,45,61,0.04)]">
                  <div className="flex items-start justify-between">
                    <h2 className="text-[14.5px] font-medium text-[#212d3d]">
                      Attested Skills
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActivePill("portfolio")}
                      aria-label="Inspect skills"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#e2d9c5] bg-[#faf6ed] text-[#433626] hover:border-[#212d3d]"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <rect x="3" y="2.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M5.5 6h5M5.5 9h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[10.5px] text-[#6d6250]">Credentials</p>
                      <p className="font-serif-display text-[28px] leading-none text-[#212d3d]">
                        {totalSkillsCount}+
                      </p>
                    </div>
                    <SkillsAreaSparkCanvas points={skillSparkPoints} />
                  </div>
                </div>
              </div>

              {/* CENTER: DA VINCI BUST + OVERLAPPING FROSTED TRAJECTORY CARD */}
              <div className={`${mPane !== "growth" ? "max-lg:hidden" : ""} relative flex min-h-[500px] flex-col justify-between lg:col-span-5`}>
                <div className="relative flex min-h-[300px] flex-1 items-center justify-center overflow-hidden rounded-[22px] border border-[#e4dac5] bg-gradient-to-b from-[#f3ecdc] to-[#ebe1cb]">
                  <img
                    src="/images/davinci-profile-bust.jpg"
                    alt="Leonardo da Vinci classical sculpture bust with golden ratio arcs"
                    className="pointer-events-none mx-auto block h-[310px] w-full object-cover object-top sm:h-[340px]"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-[#dfd3ba]/80 bg-[#212d3d]/80 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#faf6ed] backdrop-blur-sm">
                    Leonardo · Polymath Study
                  </span>
                </div>

                {/* Overlapping Lower Center Frosted Real Multi-Series Chart */}
                <div className="relative z-20 -mt-8 rounded-[20px] border border-[#dcd2bd] bg-[#fffef9]/95 p-4 shadow-[0_12px_30px_rgba(33,45,61,0.1)] backdrop-blur-md">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-[15px] font-medium text-[#212d3d]">
                        Career Codex Trajectory
                      </h2>
                      <div className="mt-1 flex items-center gap-2 text-[10.5px]">
                        <button
                          type="button"
                          onClick={() => setShowFit((v) => !v)}
                          className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 transition-opacity ${
                            showFit
                              ? "border-[#c7d5e6] bg-[#eef4fb] text-[#212d3d]"
                              : "border-[#e6dcc7] bg-[#faf6ed] text-[#8a7e6b] opacity-55"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#4775a8]" />
                          Fit
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEvidence((v) => !v)}
                          className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 transition-opacity ${
                            showEvidence
                              ? "border-[#c5dfd0] bg-[#edf6f0] text-[#212d3d]"
                              : "border-[#e6dcc7] bg-[#faf6ed] text-[#8a7e6b] opacity-55"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#4b8b65]" />
                          Evidence
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowGrowth((v) => !v)}
                          className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 transition-opacity ${
                            showGrowth
                              ? "border-[#e8c6c8] bg-[#fdf1f1] text-[#212d3d]"
                              : "border-[#e6dcc7] bg-[#faf6ed] text-[#8a7e6b] opacity-55"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#b5676b]" />
                          Growth
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setTrajectoryRange((r) =>
                          r === "6 Months" ? "24 Months" : "6 Months"
                        )
                      }
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#d6c9ae] bg-[#faf6ed] px-2.5 py-1 text-[10.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                    >
                      {trajectoryRange}
                    </button>
                  </div>

                  <CareerTrajectoryCanvas
                    points={trajectoryPoints}
                    showFit={showFit}
                    showEvidence={showEvidence}
                    showGrowth={showGrowth}
                  />
                </div>
              </div>

              {/* RIGHT STACK */}
              <div className={`${mPane !== "stats" ? "max-lg:hidden" : ""} flex flex-col justify-between gap-3.5 lg:col-span-4`}>
                {/* LinkedIn Alignment */}
                <div className="rounded-[20px] border border-[#e2d9c5] bg-[#fffef9]/95 p-4.5 shadow-[0_4px_16px_rgba(33,45,61,0.04)]">
                  <div className="flex items-start justify-between">
                    <h2 className="text-[15px] font-medium text-[#212d3d]">
                      LinkedIn Alignment
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActivePill("linkedin")}
                      aria-label="Open LinkedIn sync"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#e2d9c5] bg-[#faf6ed] text-[#433626] hover:border-[#212d3d]"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4.5 11.5L11.5 4.5M11.5 4.5H6M11.5 4.5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-serif-display text-[29px] leading-none text-[#212d3d]">
                      {linkedinPct}%
                    </span>
                    <span className="text-[11.5px] text-[#6d6250]">
                      {doneLinkedinCount}/{linkedinChecks.length} Synced
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10.5px]">
                    <span className="font-medium text-[#2d6a4f]">{doneLinkedinCount} Aligned</span>
                    <span className="font-medium text-[#5a6675]">
                      {linkedinChecks.length - doneLinkedinCount} Pending
                    </span>
                    <span className="rounded-full bg-[#cee2c9] px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#212d3d]">
                      Tier A
                    </span>
                  </div>
                  <LinkedinProgressBarCanvas
                    alignedCount={doneLinkedinCount}
                    pendingCount={linkedinChecks.length - doneLinkedinCount}
                  />
                </div>

                {/* Codex Dossier Quick Switcher */}
                <div className="flex flex-1 flex-col justify-between rounded-[20px] border border-[#e2d9c5] bg-[#fffef9]/95 p-4.5 shadow-[0_4px_16px_rgba(33,45,61,0.04)]">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-[15px] font-medium text-[#212d3d]">
                        Codex Dossier
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActivePill("portfolio")}
                        aria-label="Add proof item"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#e2d9c5] bg-[#faf6ed] text-[#212d3d] hover:border-[#212d3d]"
                      >
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5 border-b border-[#ece3cf] pb-2 text-[11px]">
                      {(
                        [
                          { id: "cases", label: "Proof Cases", count: projects.length },
                          { id: "checks", label: "Checks", count: linkedinChecks.length },
                          { id: "roadmap", label: "Roadmap", count: 2 },
                        ] as const
                      ).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setRightScheduleTab(t.id)}
                          className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 font-medium transition-colors ${
                            rightScheduleTab === t.id
                              ? "bg-[#212d3d] text-[#faf6ed]"
                              : "bg-[#faf6ed] text-[#5c5344] hover:bg-[#efe6d1]"
                          }`}
                        >
                          <span>{t.label}</span>
                          <span className="font-mono text-[9.5px] opacity-80">{t.count}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-2.5 space-y-2">
                      {rightScheduleTab === "cases" &&
                        projects.slice(0, 3).map((proj, idx) => (
                          <div key={proj.id} className="grid grid-cols-12 items-center gap-2">
                            <span className="col-span-3 rounded-full bg-[#e6ebb2] px-2 py-0.5 text-center font-mono text-[9.5px] font-semibold text-[#212d3d]">
                              0{idx + 1} Proof
                            </span>
                            <div
                              className={`col-span-9 rounded-[11px] border px-2.5 py-2 ${
                                idx === 0
                                  ? "border-[#e6dcb8] bg-[#fcf6e3]"
                                  : idx === 1
                                  ? "border-[#d4e2d3] bg-[#edf5ed]"
                                  : "border-[#d6dfec] bg-[#eef3fa]"
                              }`}
                            >
                              <p className="truncate text-[11.5px] font-semibold text-[#212d3d]">
                                {proj.title}
                              </p>
                              <p className="line-clamp-1 text-[10.5px] text-[#5c5344]">
                                {proj.outcome}
                              </p>
                            </div>
                          </div>
                        ))}

                      {rightScheduleTab === "checks" &&
                        linkedinChecks.map((item, idx) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleLinkedinCheck(item.id)}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-[10px] border border-[#e2d9c5] bg-[#faf6ed] px-2.5 py-2 text-left hover:border-[#212d3d]"
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                item.done
                                  ? "border-[#067647] bg-[#067647] text-white"
                                  : "border-[#212d3d]/35 bg-white"
                              }`}
                            >
                              {item.done && <CheckIcon className="h-2.5 w-2.5" />}
                            </span>
                            <span className="text-[11px] font-medium text-[#212d3d]">
                              {idx + 1}. {item.label}
                            </span>
                          </button>
                        ))}

                      {rightScheduleTab === "roadmap" && (
                        <div className="space-y-2">
                          <div className="rounded-[10px] bg-[#212d3d] p-2.5 text-[#faf6ed]">
                            <div className="font-mono text-[9.5px] uppercase text-[#9dbce6]">
                              Phase I - II · Agora to Lyceum
                            </div>
                            <p className="mt-0.5 text-[11.5px] font-medium">
                              Land {draft.targetRole || "Product Operations Lead"} interviews &amp; close SQL gap
                            </p>
                          </div>
                          <div className="rounded-[10px] border border-[#d4e2d3] bg-[#edf5ed] p-2.5 text-[#212d3d]">
                            <div className="font-mono text-[9.5px] uppercase text-[#067647]">
                              Phase III - IV · Acropolis to Delphi
                            </div>
                            <p className="mt-0.5 text-[11.5px] font-medium">
                              Head of Product Ops / Staff track (+18% band)
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActivePill("roadmap")}
                            className="w-full cursor-pointer rounded-full border border-[#cfc3a8] bg-[#faf6ed] py-1.5 text-[11px] font-semibold text-[#212d3d] hover:border-[#212d3d]"
                          >
                            Open Greek Philosopher Roadmap
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LIGHT COMPACT LOWER COMPLEMENT BAR (3 Sleek Additions — Zero Heavy Bloat) */}
            <div className={`${mPane !== "proof" ? "max-lg:hidden" : ""} relative z-20 mt-4 grid grid-cols-1 gap-4 md:grid-cols-3`}>
              {/* Component A: Leonardo Polymath Proportion Radar */}
              <div className="flex items-center justify-between gap-3 rounded-[20px] border border-[#e2d9c5] bg-[#fffef9]/95 p-4">
                <div>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#7a6949]">
                    Vitruvian Domain Balance
                  </div>
                  <h3 className="mt-0.5 font-serif-display text-[17px] text-[#212d3d]">
                    Polymath Fit Map
                  </h3>
                  <ul className="mt-2 space-y-1 text-[11px] text-[#5c5344]">
                    {radarAxes.map((ax) => (
                      <li key={ax.label}>
                        {ax.label} · {ax.score}%
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Real Interactive 4-Axis Leonardo Radar Graph (<canvas>) */}
                <VitruvianRadarCanvas axes={radarAxes} />
              </div>

              {/* Component B: Verified Credentials & Tags Strip */}
              <div className="flex flex-col justify-between rounded-[20px] border border-[#e2d9c5] bg-[#fffef9]/95 p-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#7a6949]">
                      Verified Credentials
                    </span>
                    <span className="font-mono text-[10px] text-[#6d6250]">
                      {credentials.length} tags
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {credentials.map((cred) => (
                      <span
                        key={cred}
                        className="inline-flex items-center gap-1 rounded-full border border-[#d8ceb8] bg-[#faf6ed] px-2.5 py-1 text-[11px] font-medium text-[#212d3d]"
                      >
                        {cred}
                        <button
                          type="button"
                          onClick={() => removeCredential(cred)}
                          aria-label={`Remove ${cred}`}
                          className="cursor-pointer text-[#7a6d59] hover:text-rose-700"
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <form onSubmit={addCredential} className="mt-3 flex gap-1.5">
                  <input id="profileportfolioview-input-1" name="profileportfolioview-input-1" aria-label="profileportfolioview input 1"
                    value={newCredential}
                    onChange={(e) => setNewCredential(e.target.value)}
                    placeholder="Add credential or license..."
                    className="min-w-0 flex-1 rounded-full border border-[#dad1bd] bg-[#faf6ed] px-3 py-1 text-[11px] text-[#212d3d] outline-none focus:border-[#212d3d]"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-full bg-[#212d3d] px-3 py-1 text-[11px] font-medium text-[#faf6ed] hover:bg-[#33445c]"
                  >
                    + Add
                  </button>
                </form>
              </div>

              {/* Component C: Public Share Dossier & Quick Actions */}
              <div className="flex flex-col justify-between rounded-[20px] border border-[#e2d9c5] bg-[#fffef9]/95 p-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#7a6949]">
                      Public Dossier Link
                    </span>
                    <button
                      type="button"
                      onClick={() => setProfilePublic((v) => !v)}
                      className={`cursor-pointer rounded-full px-2.5 py-0.5 font-mono text-[9.5px] font-semibold ${
                        profilePublic
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-[#efe6d1] text-[#6d6250]"
                      }`}
                    >
                      {profilePublic ? "Public ON" : "Private"}
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-2 rounded-full border border-[#dad1bd] bg-[#faf6ed] px-3 py-1.5">
                    <span className="truncate font-mono text-[11px] text-[#212d3d]">
                      {profileSlug}
                    </span>
                    <button
                      type="button"
                      onClick={copyShareLink}
                      className="shrink-0 cursor-pointer rounded-full bg-[#212d3d] px-2.5 py-0.5 text-[10.5px] font-medium text-[#faf6ed]"
                    >
                      {copiedSlug ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePill("baseline")}
                    className="flex-1 cursor-pointer rounded-full border border-[#cfc3a8] bg-[#faf6ed] px-3 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                  >
                    Edit Baseline Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePill("portfolio")}
                    className="flex-1 cursor-pointer rounded-full bg-[#212d3d] px-3 py-1.5 text-[11.5px] font-medium text-[#faf6ed] hover:bg-[#33445c]"
                  >
                    GitHub &amp; Gallery
                  </button>
                </div>
              </div>
            </div>

            {/* Compact 2-Column Discovery Strip: GitHub×Gallery & Ancient Greece Roadmap */}
            <div className={`${mPane !== "proof" ? "max-lg:hidden" : ""} relative z-20 mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2`}>
              <div className="flex flex-col justify-between gap-3 rounded-[20px] border border-[#d9ccb2] bg-[#fffef9]/95 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex shrink-0 -space-x-2">
                    {MUSEUM_PAINTINGS.map((painting) => (
                      <img
                        key={painting.id}
                        src={painting.image}
                        alt={painting.title}
                        className="h-10 w-10 rounded-[10px] border-2 border-[#fffef9] object-cover shadow-sm"
                      />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#7a6949]">
                      Academy Gallery · GitHub @{githubHandle}
                    </p>
                    <p className="text-[12.5px] font-medium text-[#212d3d]">
                      Paintings &amp; Philosophers × GitHub ({GITHUB_PINNED_REPOS.length} repos · {heatmapData.grandTotal} commits)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePill("portfolio")}
                  className="shrink-0 cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1.5 text-[11.5px] font-medium text-[#faf6ed] transition-colors hover:bg-[#33445c]"
                >
                  Open GitHub × Museum
                </button>
              </div>

              <div className="flex flex-col justify-between gap-3 rounded-[20px] border border-[#d9ccb2] bg-[#fffef9]/95 p-4 text-[#212d3d]">
                <div className="flex items-center justify-between gap-3 max-lg:flex-wrap">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src="/images/greek-philosopher-roadmap.jpg"
                      alt="Ancient Greek philosopher overlooking road to the Acropolis"
                      className="h-12 w-20 shrink-0 rounded-[10px] border border-[#d6c9ae] object-cover shadow-sm"
                    />
                    <div className="min-w-0">
                      <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#7a6949]">
                        Classical Wayfinder · Career Roadmap
                      </p>
                      <p className="truncate text-[12.5px] font-medium text-[#212d3d]">
                        4-Step Path to {draft.targetRole || "Product Operations Lead"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePill("roadmap")}
                    className="shrink-0 cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1.5 text-[11.5px] font-medium text-[#faf6ed] hover:bg-[#33445c] max-lg:w-full max-lg:py-2.5"
                  >
                    Open Roadmap
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
                  {roadmapEpochs.map((ep, idx) => {
                    const active = idx === activePhaseIdx;
                    return (
                      <button
                        key={ep.id}
                        type="button"
                        onClick={() => {
                          setActivePhaseIdx(idx);
                          setActivePill("roadmap");
                        }}
                        className={`cursor-pointer truncate rounded-full border px-2 py-1 text-center font-mono text-[10px] transition-colors ${
                          active
                            ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                            : "border-[#dfd3ba] bg-[#faf6ed] text-[#5c5344] hover:border-[#8f7d5d]"
                        }`}
                      >
                        {ep.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* FOCUSED LIGHTWEIGHT PANEL VIEW WHEN A TAB IS SELECTED */
          <div className="relative z-20 mt-5">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActivePill("overview")}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#cfc3a8] bg-[#fffef9] px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
              >
                Back to Studio Overview
              </button>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#6d5f47]">
                {activePill} Workspace
              </span>
            </div>

            {activePill === "baseline" && (
              <form
                onSubmit={saveBaseline}
                className="space-y-4 rounded-[22px] border border-[#dcd2bd] bg-[#fffef9] p-6"
              >
                <div className="flex items-center justify-between border-b border-[#e8e0cf] pb-3">
                  <div>
                    <Eyebrow label="Canonical Source · Write-Once Truth" />
                    <h2 className="mt-1 font-serif-display text-[22px] text-[#212d3d]">
                      Professional Baseline &amp; Preferences
                    </h2>
                  </div>
                  <img
                    src="/images/davinci-codex.jpg"
                    alt="Leonardo da Vinci Vitruvian codex folio"
                    className="hidden h-11 w-11 rounded-[10px] border border-[#cfc4aa] object-cover sm:block"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="text-[11.5px] font-medium text-[#5a6675]">Full name</label>
                    <input id="profileportfolioview-input-2" name="profileportfolioview-input-2" aria-label="profileportfolioview input 2"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#5a6675]">Email</label>
                    <input id="profileportfolioview-input-3" name="profileportfolioview-input-3" aria-label="profileportfolioview input 3"
                      value={draft.email}
                      onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                      className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#5a6675]">Current role</label>
                    <input id="profileportfolioview-input-4" name="profileportfolioview-input-4" aria-label="profileportfolioview input 4"
                      value={draft.currentRole}
                      onChange={(e) => setDraft({ ...draft, currentRole: e.target.value })}
                      className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#5a6675]">Desired target role</label>
                    <input id="profileportfolioview-input-5" name="profileportfolioview-input-5" aria-label="profileportfolioview input 5"
                      value={draft.targetRole}
                      onChange={(e) => setDraft({ ...draft, targetRole: e.target.value })}
                      className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#5a6675]">Work arrangement</label>
                    <select id="profileportfolioview-select-6" name="profileportfolioview-select-6" aria-label="profileportfolioview select 6"
                      value={draft.workMode}
                      onChange={(e) => setDraft({ ...draft, workMode: e.target.value })}
                      className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote only">Remote only</option>
                      <option value="On-site / Flexible">On-site / Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#5a6675]">Target salary band</label>
                    <input id="profileportfolioview-input-7" name="profileportfolioview-input-7" aria-label="profileportfolioview input 7"
                      value={salaryTarget}
                      onChange={(e) => setSalaryTarget(e.target.value)}
                      className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#5a6675]">Languages</label>
                    <input id="profileportfolioview-input-8" name="profileportfolioview-input-8" aria-label="profileportfolioview input 8"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#5a6675]">Certifications</label>
                    <input id="profileportfolioview-input-9" name="profileportfolioview-input-9" aria-label="profileportfolioview input 9"
                      value={certifications}
                      onChange={(e) => setCertifications(e.target.value)}
                      className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <label className="text-[11.5px] font-medium text-[#5a6675]">Education history</label>
                    <p className="mt-1 rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3.5 py-2.5 text-[13px] text-[#212d3d]">
                      {education}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11.5px] font-medium text-[#5a6675]">
                      Verified experience facts (shared across CVs &amp; autofill)
                    </label>
                    <textarea id="profileportfolioview-textarea-10" name="profileportfolioview-textarea-10" aria-label="profileportfolioview textarea 10"
                      rows={2}
                      value={draft.cvExcerpt}
                      onChange={(e) => setDraft({ ...draft, cvExcerpt: e.target.value })}
                      placeholder="Only confirmed achievements & duties..."
                      className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] p-2.5 text-[13px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed] hover:bg-[#33445c]"
                  >
                    Save canonical baseline
                  </button>
                  {savedNotice && (
                    <span className="text-[12.5px] font-medium text-[#067647]">
                      Saved [Synced across Workspace &amp; Extension]
                    </span>
                  )}
                </div>
              </form>
            )}

            {activePill === "linkedin" && (
              <section className="space-y-3 rounded-[22px] border border-[#dcd2bd] bg-[#fffef9] p-6">
                <div className="flex items-center justify-between border-b border-[#e8e0cf] pb-3">
                  <div>
                    <Eyebrow label="External Consistency Audit" />
                    <h2 className="mt-1 font-serif-display text-[22px] text-[#212d3d]">
                      LinkedIn Alignment Checklist
                    </h2>
                  </div>
                  <span className="rounded-full border border-[#067647]/30 bg-[#e7f6ee] px-3 py-1 font-mono text-[11px] font-semibold text-[#067647]">
                    {doneLinkedinCount}/{linkedinChecks.length} synced ({linkedinPct}%)
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {linkedinChecks.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleLinkedinCheck(item.id)}
                      className="flex cursor-pointer items-start gap-2.5 rounded-[14px] border border-[#dad6ca] bg-[#faf6ed] p-4 text-left text-[13px] transition-colors hover:border-[#212d3d]"
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          item.done
                            ? "border-[#067647] bg-[#067647] text-white"
                            : "border-[#212d3d]/30 bg-white"
                        }`}
                      >
                        {item.done && <CheckIcon className="h-2.5 w-2.5" />}
                      </span>
                      <span className={item.done ? "text-[#212d3d]" : "text-[#5a6675]"}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activePill === "portfolio" && (
              <section className="space-y-4">
                {/* ── 1. Museum Fresco Header Banner + Gallery Switcher ── */}
                <div className="overflow-hidden rounded-[22px] border border-[#d6c9ae] bg-[#fffef9] shadow-[0_14px_34px_-20px_rgba(33,45,61,0.22)]">
                  <div className="relative h-56 w-full overflow-hidden border-b border-[#dfd3ba] bg-[#212d3d] sm:h-64">
                    <img
                      src={activePainting.image}
                      alt={`${activePainting.title} by ${activePainting.artist}`}
                      style={{ objectPosition: activePainting.objectPosition }}
                      className="h-full w-full object-cover transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16202c]/90 via-[#16202c]/35 to-[#16202c]/20" />

                    {/* Top gallery selector strip */}
                    <div className="absolute inset-x-4 top-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#dfd3ba]/40 bg-[#16202c]/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f5ecd9] backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3a9d68]" />
                        Classical Academy · GitHub Portfolio
                      </span>

                      <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-[#dfd3ba]/30 bg-[#16202c]/70 p-1 backdrop-blur-sm">
                        {MUSEUM_PAINTINGS.map((painting) => {
                          const selected = painting.id === activePainting.id;
                          return (
                            <button
                              key={painting.id}
                              type="button"
                              onClick={() => setActivePaintingId(painting.id)}
                              className={`cursor-pointer rounded-full px-3 py-1 text-[10.5px] font-medium transition-colors ${
                                selected
                                  ? "bg-[#faf6ed] text-[#212d3d]"
                                  : "text-[#e5dcc9] hover:bg-white/10"
                              }`}
                            >
                              {painting.artist.split(" ")[0]} · {painting.title.split(" ").slice(0, 2).join(" ")}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Curator Caption */}
                    <div className="absolute inset-x-5 bottom-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#dfd3ba]">
                          {activePainting.collection} · {activePainting.year}
                        </p>
                        <h2 className="mt-0.5 font-serif-display text-[22px] leading-tight text-[#fffef9] sm:text-[26px]">
                          {activePainting.title} — {activePainting.artist}
                        </h2>
                      </div>
                      <p className="max-w-md border-l-2 border-[#d4af63]/70 pl-3 text-[11.5px] italic leading-relaxed text-[#f1e9d7]">
                        &ldquo;{activePainting.maxim}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* ── GitHub Sub-Navigation Bar ── */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f7f2e7] px-5 py-2.5 text-[12px]">
                    <div className="flex flex-wrap items-center gap-4 text-[#5a6675]">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#212d3d]">
                        <svg className="h-3.5 w-3.5 text-[#8f7d5d]" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
                        </svg>
                        Overview
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        Repositories
                        <span className="rounded-full border border-[#d6c9ae] bg-[#fffef9] px-1.5 py-0.5 text-[10px] font-semibold text-[#212d3d]">
                          {GITHUB_PINNED_REPOS.length + projects.length}
                        </span>
                      </span>
                      <span>Attested Proofs</span>
                      <span>Academy Codex</span>
                    </div>

                    <span className="font-mono text-[11px] text-[#7a6b4e]">
                      github.com/{githubHandle}
                    </span>
                  </div>
                </div>

                {/* ── 2. Authentic 2-Column GitHub Profile Layout ── */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  {/* ── LEFT COLUMN: Classical GitHub Identity & Philosopher Patrons ── */}
                  <aside className="space-y-4 lg:col-span-4">
                    <div className="rounded-[20px] border border-[#dcd2bd] bg-[#fffef9] p-5">
                      <div className="flex items-start gap-4 lg:flex-col lg:items-start">
                        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-[#d4c4a1] bg-[#ece3cf] shadow-[0_8px_20px_-10px_rgba(33,45,61,0.35)]">
                          <img
                            src="/images/davinci-profile-bust.jpg"
                            alt={`${profile.name || "Candidate"} classical bust portrait`}
                            className="h-full w-full object-cover object-top"
                          />
                          <span
                            title="Actively shipping & open to senior interviews"
                            className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#fffef9] bg-[#212d3d] text-[9px] font-bold text-[#faf6ed]"
                          >
                            V
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif-display text-[24px] leading-tight text-[#212d3d]">
                            {profile.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            {editingHandle ? (
                              <input id="profileportfolioview-input-11" name="profileportfolioview-input-11" aria-label="profileportfolioview input 11"
                                value={githubHandle}
                                onChange={(e) => setGithubHandle(e.target.value)}
                                onBlur={() => setEditingHandle(false)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") setEditingHandle(false);
                                }}
                                autoFocus
                                className="w-full rounded-[8px] border border-[#8f7d5d] bg-[#faf6ed] px-2.5 py-1 font-mono text-[12px] text-[#212d3d] focus:outline-none"
                              />
                            ) : (
                              <>
                                <span className="font-mono text-[12.5px] text-[#6d6250]">
                                  @{githubHandle}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setEditingHandle(true)}
                                  className="cursor-pointer rounded-full border border-[#dfd3ba] bg-[#faf6ed] px-2 py-0.5 text-[10px] font-medium text-[#5a6675] hover:text-[#212d3d]"
                                >
                                  Edit handle
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-[12.5px] leading-relaxed text-[#45515f]">
                        {profile.targetRole} building attested release workflows, SQL cohort audits, and Renaissance-grade delivery governance.
                      </p>

                      {/* GitHub Follow Action + Follower Telemetry */}
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGithubFollowing((v) => !v)}
                          className={`flex-1 cursor-pointer rounded-full border px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                            githubFollowing
                              ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                              : "border-[#c7bba1] bg-[#faf6ed] text-[#212d3d] hover:bg-[#efe6d3]"
                          }`}
                        >
                          {githubFollowing ? "Following" : "Follow"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePill("baseline")}
                          className="cursor-pointer rounded-full border border-[#dfd3ba] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#5a6675] hover:text-[#212d3d]"
                        >
                          Edit Profile
                        </button>
                      </div>

                      <div className="mt-3.5 flex items-center gap-4 border-b border-[#ece3cf] pb-3.5 text-[11.5px] text-[#5a6675]">
                        <span>
                          <strong className="font-semibold text-[#212d3d]">
                            {githubFollowing ? 149 : 148}
                          </strong>{" "}
                          followers
                        </span>
                        <span>
                          <strong className="font-semibold text-[#212d3d]">29</strong> following
                        </span>
                        <span>
                          <strong className="font-semibold text-[#212d3d]">
                            {GITHUB_PINNED_REPOS.reduce(
                              (acc, repo) => acc + repo.stars + (starredRepos[repo.id] ? 1 : 0),
                              0
                            )}
                          </strong>{" "}
                          stars
                        </span>
                      </div>

                      {/* Location / Stack Metadata */}
                      <div className="mt-3 space-y-1.5 text-[11.5px] text-[#5a6675]">
                        <p className="flex items-center justify-between">
                          <span>Work Mode</span>
                          <span className="font-medium text-[#212d3d]">{profile.workMode || "London · Hybrid"}</span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span>Target Role</span>
                          <span className="font-medium text-[#212d3d]">{profile.targetRole}</span>
                        </p>
                        <p className="flex items-center justify-between">
                          <span>Attested Cadence</span>
                          <span className="font-medium text-[#2d6a4f]">{heatmapData.grandTotal} commits / yr</span>
                        </p>
                      </div>
                    </div>

                    {/* Philosopher Patrons Card (Clickable Influence Badges) */}
                    <div className="rounded-[20px] border border-[#dcd2bd] bg-[#fffef9] p-5">
                      <Eyebrow label="Philosopher Patrons" />
                      <p className="mt-1 text-[11.5px] text-[#5a6675]">
                        Select a thinker to inspect their maxim & shift the fresco study above.
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {PHILOSOPHER_PATRONS.map((phil) => {
                          const selected = phil.id === activePhilosopher.id;
                          return (
                            <button
                              key={phil.id}
                              type="button"
                              onClick={() => selectPhilosopher(phil)}
                              className={`cursor-pointer rounded-[12px] border p-2.5 text-left transition-all ${
                                selected
                                  ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                                  : "border-[#e2d8c3] bg-[#faf6ed] text-[#212d3d] hover:border-[#8f7d5d]"
                              }`}
                            >
                              <p className="text-[12px] font-semibold leading-tight">
                                {phil.name}
                              </p>
                              <p
                                className={`mt-0.5 text-[10px] ${
                                  selected ? "text-[#d9ceb9]" : "text-[#6d6250]"
                                }`}
                              >
                                {phil.discipline}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3 rounded-[12px] border border-[#e2d8c3] bg-[#faf6ed] p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f7d5d]">
                          {activePhilosopher.school} · {activePhilosopher.era}
                        </p>
                        <p className="mt-1 text-[11.5px] italic leading-relaxed text-[#212d3d]">
                          &ldquo;{activePhilosopher.quote}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Framed Museum Organizations (GitHub Orgs equivalent) */}
                    <div className="rounded-[20px] border border-[#dcd2bd] bg-[#fffef9] p-5">
                      <Eyebrow label="Academy Galleries" />
                      <div className="mt-3 flex items-center gap-2.5">
                        {MUSEUM_PAINTINGS.map((painting) => (
                          <button
                            key={painting.id}
                            type="button"
                            onClick={() => setActivePaintingId(painting.id)}
                            title={`${painting.title} — ${painting.artist}`}
                            className={`relative h-12 w-12 cursor-pointer overflow-hidden rounded-[10px] border-2 transition-transform hover:-translate-y-0.5 ${
                              activePaintingId === painting.id
                                ? "border-[#212d3d] ring-2 ring-[#d4af63]/60"
                                : "border-[#d8ccb2]"
                            }`}
                          >
                            <img
                              src={painting.image}
                              alt={painting.title}
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ))}
                        <div className="min-w-0 flex-1 pl-1">
                          <p className="truncate text-[11.5px] font-medium text-[#212d3d]">
                            {activePainting.title}
                          </p>
                          <p className="truncate text-[10.5px] text-[#6d6250]">
                            {activePainting.artist}
                          </p>
                        </div>
                      </div>
                    </div>
                  </aside>

                  {/* ── RIGHT COLUMN: README.md, Pinned Repositories & Heatmap ── */}
                  <div className="space-y-4 lg:col-span-8">
                    {/* Profile README.md Card */}
                    <div className="overflow-hidden rounded-[20px] border border-[#dcd2bd] bg-[#fffef9]">
                      <div className="flex items-center justify-between border-b border-[#ece3cf] bg-[#faf6ed] px-5 py-2.5">
                        <span className="font-mono text-[11.5px] font-medium text-[#212d3d]">
                          {githubHandle} / README.md
                        </span>
                        <span className="rounded-full border border-[#d6c9ae] bg-white px-2.5 py-0.5 text-[10px] font-medium text-[#8f7d5d]">
                          Guided by {activePhilosopher.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-12 sm:items-center">
                        <div className="space-y-2.5 sm:col-span-8">
                          <h3 className="font-serif-display text-[21px] text-[#212d3d]">
                            First-Principles Delivery &amp; Attested Engineering Craft
                          </h3>
                          <p className="text-[12.5px] leading-relaxed text-[#45515f]">
                            Every repository and rollout case study in this codex blends classical empirical proof with crisp modern delivery. No fabricated claims — every ship gate, SQL audit, and stakeholder ritual maps directly to measurable outcomes.
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(profile.priorities.length > 0
                              ? profile.priorities.slice(0, 6)
                              : ["SQL Audits", "Release Governance", "Stakeholder Clarity", "Python", "TypeScript"]
                            ).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full border border-[#dcd2bd] bg-[#faf6ed] px-2.5 py-0.5 text-[10.5px] font-medium text-[#212d3d]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <div className="overflow-hidden rounded-[14px] border border-[#dcd2bd] bg-[#f4ede0]">
                            <img
                              src="/images/philosopher-cutout.png?v=2"
                              alt="Marble philosopher reading codex at table"
                              className="h-36 w-full object-cover object-top"
                            />
                            <p className="border-t border-[#e5dac2] px-2.5 py-1.5 text-center font-mono text-[10px] text-[#6d6250]">
                              Scriptorium Codex · Zero Fabrication
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pinned Repositories & Attested Case Studies */}
                    <div className="rounded-[20px] border border-[#dcd2bd] bg-[#fffef9] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ece3cf] pb-3">
                        <div>
                          <Eyebrow label="Pinned Repositories & Attested Proofs" />
                          <h3 className="mt-0.5 font-serif-display text-[19px] text-[#212d3d]">
                            Classical Craft × Production Repositories
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 rounded-full border border-[#e2d8c3] bg-[#faf6ed] p-1">
                          <button
                            type="button"
                            onClick={() => setRepoFilter("all")}
                            className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                              repoFilter === "all"
                                ? "bg-[#212d3d] text-[#faf6ed]"
                                : "text-[#5a6675] hover:text-[#212d3d]"
                            }`}
                          >
                            All ({GITHUB_PINNED_REPOS.length})
                          </button>
                          {PHILOSOPHER_PATRONS.map((phil) => (
                            <button
                              key={phil.id}
                              type="button"
                              onClick={() => setRepoFilter(phil.id)}
                              className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                                repoFilter === phil.id
                                  ? "bg-[#212d3d] text-[#faf6ed]"
                                  : "text-[#5a6675] hover:text-[#212d3d]"
                              }`}
                            >
                              {phil.name.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* GitHub Repo Grid */}
                      <div className="mt-3.5 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {GITHUB_PINNED_REPOS.filter(
                          (repo) => repoFilter === "all" || repo.philosopherId === repoFilter
                        ).map((repo) => {
                          const isStarred = !!starredRepos[repo.id];
                          const starCount = repo.stars + (isStarred ? 1 : 0);
                          const phil = PHILOSOPHER_PATRONS.find(
                            (p) => p.id === repo.philosopherId
                          );
                          return (
                            <div
                              key={repo.id}
                              className="flex flex-col justify-between rounded-[14px] border border-[#dcd2bd] bg-[#faf6ed] p-3.5 transition-colors hover:border-[#8f7d5d]"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <img
                                      src={repo.paintingImage}
                                      alt={repo.paintingLabel}
                                      className="h-7 w-7 shrink-0 rounded-[6px] border border-[#d6c9ae] object-cover"
                                    />
                                    <div className="min-w-0">
                                      <p className="truncate font-mono text-[12.5px] font-semibold text-[#212d3d]">
                                        {repo.name}
                                      </p>
                                      <p className="text-[10px] text-[#7a6b4e]">
                                        {phil?.repoBadge ?? "Academy"} · {repo.paintingLabel}
                                      </p>
                                    </div>
                                  </div>

                                  <span className="shrink-0 rounded-full border border-[#d6c9ae] bg-white px-2 py-0.5 text-[9.5px] font-medium text-[#5a6675]">
                                    {repo.visibility}
                                  </span>
                                </div>

                                <p className="mt-2.5 text-[11.5px] leading-relaxed text-[#45515f]">
                                  {repo.description}
                                </p>
                              </div>

                              <div className="mt-3 flex items-center justify-between border-t border-[#e8dfc9] pt-2.5 text-[11px] text-[#5a6675]">
                                <div className="flex items-center gap-3">
                                  <span className="inline-flex items-center gap-1.5 font-medium text-[#212d3d]">
                                    <span
                                      className="h-2.5 w-2.5 rounded-full"
                                      style={{ backgroundColor: repo.langDot }}
                                    />
                                    {repo.language}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => toggleRepoStar(repo.id)}
                                    className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium transition-colors ${
                                      isStarred
                                        ? "border-[#c89f43] bg-[#fff6df] text-[#7a5813]"
                                        : "border-[#dfd3ba] bg-white text-[#5a6675] hover:text-[#212d3d]"
                                    }`}
                                  >
                                    <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                                      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                                    </svg>
                                    {starCount}
                                  </button>
                                  <span className="text-[10.5px]">{repo.forks} forks</span>
                                </div>
                                <span className="text-[10px] text-[#7a6b4e]">{repo.updated}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Verified Portfolio Case Studies Strip */}
                      <div className="mt-4 border-t border-[#ece3cf] pt-4">
                        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7d5d]">
                          Attested Case Studies Linked ({projects.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                          {projects.map((p) => (
                            <div
                              key={p.id}
                              className="rounded-[12px] border border-[#e2d8c3] bg-white p-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-[12.5px] font-semibold text-[#212d3d]">
                                  {p.title}
                                </p>
                                <span className="shrink-0 text-[10px] text-[#7a6b4e]">{p.role}</span>
                              </div>
                              <p className="mt-1 line-clamp-2 text-[11px] text-[#5a6675]">
                                {p.outcome}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {p.verifiedSkills.map((sk) => (
                                  <span
                                    key={sk}
                                    className="rounded-full border border-[#e5dac2] bg-[#faf6ed] px-2 py-0.5 text-[9.5px] font-medium text-[#212d3d]"
                                  >
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── 3. 52-Week Classical Contribution Heatmap ── */}
                    <div className="rounded-[20px] border border-[#dcd2bd] bg-[#fffef9] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <Eyebrow label="Attested Contribution Ledger" />
                          <h3 className="mt-0.5 font-serif-display text-[19px] text-[#212d3d]">
                            {heatmapData.grandTotal} contributions in the last year
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10.5px] text-[#6d6250]">
                          <span>Less</span>
                          {HEATMAP_PALETTE.map((hex) => (
                            <span
                              key={hex}
                              className="h-3 w-3 rounded-[3px] border border-[#dcd2bd]/60"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                          <span>More</span>
                        </div>
                      </div>

                      <div className="mt-3 overflow-x-auto rounded-[12px] border border-[#e6dcc7] bg-[#faf6ed] p-3">
                        <div className="mb-1.5 grid grid-cols-12 text-[9.5px] font-medium text-[#7a6b4e]">
                          {MONTH_LABELS.map((month) => (
                            <span key={month}>{month}</span>
                          ))}
                        </div>
                        <div className="flex gap-[3px]">
                          {heatmapData.weeks.map((week) => {
                            const isSelected = selectedHeatWeek === week.weekIndex;
                            return (
                              <button
                                key={week.weekIndex}
                                type="button"
                                onClick={() => setSelectedHeatWeek(week.weekIndex)}
                                title={`Week ${week.weekIndex + 1}: ${week.total} attested commits`}
                                className={`flex cursor-pointer flex-col gap-[3px] rounded-[3px] p-[1px] transition-all ${
                                  isSelected ? "ring-1 ring-[#212d3d]" : ""
                                }`}
                              >
                                {week.days.map((day, dIdx) => (
                                  <span
                                    key={dIdx}
                                    className="h-[10px] w-[10px] rounded-[2px]"
                                    style={{ backgroundColor: HEATMAP_PALETTE[day.level] }}
                                  />
                                ))}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5a6675]">
                        <span>
                          Inspecting <strong className="text-[#212d3d]">Week {selectedHeatWeek + 1}</strong>:{" "}
                          <strong className="text-[#2d6a4f]">
                            {heatmapData.weeks[selectedHeatWeek]?.total ?? 0} verified updates
                          </strong>{" "}
                          across release gates, SQL audits, and codex documentation.
                        </span>
                        <span className="font-mono text-[10.5px] text-[#7a6b4e]">
                          School of Athens · Classical Parity
                        </span>
                      </div>
                    </div>

                    {/* ── 4. Inline + Pin Repository / Proof Case Form ── */}
                    <form
                      onSubmit={addPortfolioProject}
                      className="flex flex-col gap-2.5 rounded-[18px] border border-[#dcd2bd] bg-[#fffef9] p-4 sm:flex-row sm:items-center"
                    >
                      <input id="profileportfolioview-input-12" name="profileportfolioview-input-12" aria-label="profileportfolioview input 12"
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        placeholder="Repository or proof title..."
                        className="flex-1 rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3.5 py-2 text-[12.5px] focus:border-[#212d3d] focus:outline-none"
                      />
                      <input id="profileportfolioview-input-13" name="profileportfolioview-input-13" aria-label="profileportfolioview input 13"
                        value={newProjOutcome}
                        onChange={(e) => setNewProjOutcome(e.target.value)}
                        placeholder="Observable outcome & verification metric..."
                        className="flex-1 rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3.5 py-2 text-[12.5px] focus:border-[#212d3d] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed] hover:bg-[#33445c]"
                      >
                        + Pin Proof Case
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            )}

            {activePill === "roadmap" && (
              <section className="space-y-4">
                {/* ── 1. Clean Hero Artwork + Interactive Roadmap Horizon Chart ── */}
                <div className="overflow-hidden rounded-[22px] border border-[#dcd2bd] bg-[#fffef9]">
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="relative min-h-[250px] overflow-hidden bg-[#efe6d3] lg:col-span-6">
                      <img
                        src="/images/greek-philosopher-roadmap.jpg"
                        alt="Ancient Greek philosopher holding scroll along marble path to Acropolis"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#16202c]/80 via-transparent to-transparent" />
                      <div className="absolute inset-x-5 bottom-4">
                        <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#e6d7b7]">
                          The Way of the Agora · Classical Horizon
                        </p>
                        <h2 className="mt-0.5 font-serif-display text-[22px] leading-snug text-[#fffef9]">
                          Step-by-Step Path to {draft.targetRole || "Product Operations Lead"}
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between bg-[#212d3d] p-5 text-[#faf6ed] lg:col-span-6">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <Eyebrow label="Career Horizon Curve" />
                          <p className="mt-0.5 text-[12px] text-[#c7d3e0]">
                            Click any stage below or on the graph to view its action steps.
                          </p>
                        </div>
                        <span className="rounded-full border border-[#3a4d66] bg-[#18222e] px-3 py-1 font-mono text-[10.5px] text-[#a6f4c5]">
                          {activeEpoch.horizonBand}
                        </span>
                      </div>

                      <div className="mt-3 rounded-[14px] border border-[#314258] bg-[#18222e] p-3">
                        <RoadmapHorizonCanvas
                          phases={roadmapHorizonMetrics}
                          activeIndex={activePhaseIdx}
                          onSelectPhase={setActivePhaseIdx}
                        />
                      </div>

                      <p className="mt-3 text-[11.5px] italic text-[#d9ccb2]">
                        &ldquo;First principles before speed: every step attested by real evidence.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── 2. Simple 4-Step Stepper & Action Checklist ── */}
                <div className="rounded-[22px] border border-[#dcd2bd] bg-[#fffef9] p-5">
                  <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                    {roadmapEpochs.map((ep, idx) => {
                      const doneCount = ep.tasks.filter((t) => t.done).length;
                      const pct = Math.round((doneCount / Math.max(1, ep.tasks.length)) * 100);
                      const isSelected = idx === activePhaseIdx;
                      return (
                        <button
                          key={ep.id}
                          type="button"
                          onClick={() => setActivePhaseIdx(idx)}
                          className={`cursor-pointer rounded-[14px] border p-3.5 text-left transition-all ${
                            isSelected
                              ? "border-[#212d3d] bg-[#212d3d] text-[#faf6ed]"
                              : "border-[#e2d8c3] bg-[#faf6ed] text-[#212d3d] hover:border-[#8f7d5d]"
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span>Step {ep.roman}</span>
                            <span className={isSelected ? "text-[#a6f4c5]" : "text-[#2d6a4f]"}>
                              {pct}%
                            </span>
                          </div>
                          <p className="mt-1.5 text-[13px] font-semibold leading-snug">
                            {ep.title}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-[16px] border border-[#e5dac2] bg-[#faf6ed] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5">
                      <h3 className="font-serif-display text-[18px] text-[#212d3d]">
                        {activeEpoch.title}
                      </h3>
                      <span className="font-mono text-[10.5px] text-[#6d6250]">
                        {activeEpoch.windowLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {activeEpoch.tasks.map((task) => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => toggleRoadmapTask(activeEpoch.id, task.id)}
                          className="flex cursor-pointer items-center gap-2.5 rounded-[11px] border border-[#dfd3ba] bg-white px-3.5 py-2.5 text-left hover:border-[#212d3d]"
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                              task.done
                                ? "border-[#067647] bg-[#067647] text-white"
                                : "border-[#212d3d]/35 bg-white"
                            }`}
                          >
                            {task.done && <CheckIcon className="h-2.5 w-2.5" />}
                          </span>
                          <span
                            className={`text-[12px] font-medium ${
                              task.done ? "text-[#5a6675] line-through" : "text-[#212d3d]"
                            }`}
                          >
                            {task.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <form onSubmit={addRoadmapTask} className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <input id="profileportfolioview-input-14" name="profileportfolioview-input-14" aria-label="profileportfolioview input 14"
                        value={newMilestoneText}
                        onChange={(e) => setNewMilestoneText(e.target.value)}
                        placeholder={`Add milestone in ${activeEpoch.shortLabel}...`}
                        className="flex-1 rounded-full border border-[#dad1bd] bg-white px-4 py-2 text-[12px] text-[#212d3d] focus:border-[#212d3d] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2 text-[12px] font-medium text-[#faf6ed] hover:bg-[#33445c]"
                      >
                        + Add Milestone
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
