"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DashboardSectionId, McpActivityEntry } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import { logEvent, readEvents, clearEvents, type VexEventRecord } from "@/lib/analytics";
import { openSprint } from "./Sprint";
import {
  EmptyState,
  KitButton,
  KitCard,
  LoadingRows,
  Modal,
  Pill,
  SCORE_DEFINITIONS,
  ScoreInfo,
} from "./Kit";

type Nav = (s: DashboardSectionId) => void;

/* ================================================================== */
/*  HOME · Next best action + 7-question readiness panel              */
/* ================================================================== */

interface ActionSuggestion {
  key: string;
  title: string;
  why: string;
  cta: string;
  section: DashboardSectionId;
}

function useReadiness() {
  const { profile, jobs, hiddenJobIds, savedJobIds, applications, flags, diffs, mockSessionsCount } =
    useVexWorkspace();

  return useMemo(() => {
    const profileReady = Boolean(profile.name && profile.targetRole && profile.workMode);
    const visibleJobs = jobs.filter((j) => !hiddenJobIds.includes(j.id));
    const allChecks = (a: (typeof applications)[number]) =>
      a.checklist.cvReviewed && a.checklist.letterApproved && a.checklist.questionsAnswered && a.checklist.fieldsChecked;
    const prepared = applications.filter((a) => a.submissionState === "prepared");
    const ready = prepared.filter(allChecks);
    const needsInput = prepared.filter((a) => !allChecks(a));
    const verified = applications.filter((a) => a.submissionState === "verified-submitted").length;
    const reported = applications.filter((a) => a.submissionState === "user-reported-submitted").length;
    const openFlags = flags.filter((f) => !f.resolved).length;
    const riskyDiffs = diffs.filter((d) => d.hasUnsupportedClaim && d.status === "pending").length;
    const quiet = applications.filter((a) => a.submissionState !== "prepared" && a.quietDays >= 5);

    const suggestions: ActionSuggestion[] = [];
    if (!profileReady)
      suggestions.push({ key: "profile", title: "Finish your profile", why: "Every CV, letter and form is filled from it.", cta: "Open profile", section: "profile" });
    if (riskyDiffs > 0)
      suggestions.push({ key: "claims", title: `Fix ${riskyDiffs} unsupported CV claim${riskyDiffs > 1 ? "s" : ""}`, why: "Export stays blocked until each claim is backed up or removed.", cta: "Review CV", section: "documents" });
    if (ready.length > 0)
      suggestions.push({ key: "ready", title: `Review ${ready.length} ready application${ready.length > 1 ? "s" : ""}`, why: "CV, letter and fields are checked. Submit them yourself on the employer's site.", cta: "Review now", section: "applications" });
    if (needsInput.length > 0)
      suggestions.push({ key: "input", title: `Finish ${needsInput.length} prepared application${needsInput.length > 1 ? "s" : ""}`, why: "Some checklist items are still open.", cta: "Open tracker", section: "applications" });
    if (savedJobIds.length === 0)
      suggestions.push({ key: "jobs", title: "Shortlist your first jobs", why: "Save 3 roles you'd apply to so Vex can prepare them.", cta: "Browse jobs", section: "jobs" });
    if (mockSessionsCount === 0)
      suggestions.push({ key: "mock", title: "Practise one interview answer", why: "Interviews can come weeks later — be ready when they do.", cta: "Start practice", section: "interviews" });
    if (quiet.length > 0)
      suggestions.push({ key: "follow", title: `Follow up on ${quiet.length} quiet application${quiet.length > 1 ? "s" : ""}`, why: "No reply for 5+ days. A short, polite follow-up is reasonable.", cta: "Open tracker", section: "applications" });
    if (suggestions.length === 0)
      suggestions.push({ key: "more", title: "Practise another interview", why: "You're up to date. Keep your answers sharp.", cta: "Practise", section: "interviews" });

    const rows: { q: string; status: string; tone: "good" | "warn" | "neutral" | "info"; section: DashboardSectionId }[] = [
      { q: "Is my profile ready?", status: profileReady ? "Ready for applying" : "In progress", tone: profileReady ? "good" : "warn", section: "profile" },
      { q: "Have I found relevant jobs?", status: visibleJobs.length ? `${visibleJobs.length} found · ${savedJobIds.length} saved` : "None yet", tone: savedJobIds.length ? "good" : "neutral", section: "jobs" },
      { q: "Which applications are ready?", status: `${ready.length} ready · ${needsInput.length} need input`, tone: ready.length ? "good" : needsInput.length ? "warn" : "neutral", section: "applications" },
      { q: "Which have actually been submitted?", status: `${verified} verified · ${reported} self-reported`, tone: verified ? "good" : "neutral", section: "applications" },
      { q: "What do I need to improve?", status: openFlags + riskyDiffs ? `${openFlags + riskyDiffs} CV item${openFlags + riskyDiffs > 1 ? "s" : ""}` : "Nothing flagged", tone: openFlags + riskyDiffs ? "warn" : "good", section: "documents" },
      { q: "Am I prepared for an interview?", status: mockSessionsCount ? `Practised (${mockSessionsCount} session${mockSessionsCount > 1 ? "s" : ""})` : "Not started", tone: mockSessionsCount ? "good" : "neutral", section: "interviews" },
      { q: "What should I do next?", status: suggestions[0].title, tone: "info", section: suggestions[0].section },
    ];
    const done = rows.slice(0, 6).filter((r) => r.tone === "good").length;
    return { suggestions, rows, done };
  }, [profile, jobs, hiddenJobIds, savedJobIds, applications, flags, diffs, mockSessionsCount]);
}

export function HomeTopPanels({ onNavigate }: { onNavigate: Nav }) {
  const { suggestions, rows, done } = useReadiness();
  const [idx, setIdx] = useState(0);
  const s = suggestions[idx % suggestions.length];

  return (
    <div className="mb-5 grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
      {/* Next best action */}
      <section className="vex-kit rounded-[22px] bg-[#212d3d] p-5 text-[#faf6ed] sm:p-6 lg:col-span-5">
        <p className="text-[10.5px] font-semibold tracking-[0.14em] text-[#faf6ed]/60 uppercase">Next best action</p>
        <h2 className="mt-1 font-serif-display text-[26px] leading-tight">{s.title}</h2>
        <p className="mt-1.5 text-[13.5px] leading-snug text-[#faf6ed]/75">{s.why}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              logEvent("next_action_clicked", s.key);
              onNavigate(s.section);
            }}
            className="cursor-pointer rounded-full bg-[#faf6ed] px-5 py-2.5 text-[14px] font-semibold text-[#212d3d]"
          >
            {s.cta}
          </button>
          {suggestions.length > 1 && (
            <button
              type="button"
              onClick={() => setIdx((i) => i + 1)}
              className="cursor-pointer rounded-full px-3 py-2 text-[13px] font-medium text-[#faf6ed]/75 hover:text-[#faf6ed]"
            >
              Not now
            </button>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
          <p className="text-[11.5px] text-[#faf6ed]/55">
            {suggestions.length > 1 ? `${suggestions.length - 1} more worth doing today` : "That's everything for now"}
          </p>
          <button type="button" onClick={openSprint} className="cursor-pointer text-[12.5px] font-semibold text-[#e3cea0]">
            ⚡ 24h Sprint ›
          </button>
        </div>
      </section>

      {/* 7 readiness questions */}
      <section className="vex-kit rounded-[22px] border border-[#e3dccb] bg-white p-5 sm:p-6 lg:col-span-7">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-serif-display text-[22px] text-[#212d3d]">
            Is it ready?
            <ScoreInfo
              label="Readiness checks"
              means="Six honest questions about your first day, each answered from what you have actually done in Vex."
              notMeans="A promise that an employer will reply or invite you."
            />
          </h2>
          <Pill tone={done >= 5 ? "good" : "neutral"}>{done} of 6 done</Pill>
        </div>
        <ul className="divide-y divide-[#ece5d5]">
          {rows.map((r) => (
            <li key={r.q}>
              <button
                type="button"
                onClick={() => onNavigate(r.section)}
                className="flex w-full cursor-pointer items-center gap-3 py-2.5 text-left"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    r.tone === "good" ? "bg-[#067647]" : r.tone === "warn" ? "bg-[#b54708]" : r.tone === "info" ? "bg-[#175cd3]" : "bg-[#c9bfa8]"
                  }`}
                />
                <span className="min-w-0 flex-1 text-[13.5px] text-[#212d3d]">{r.q}</span>
                <span className="max-w-[48%] truncate text-right text-[12.5px] font-medium text-[#5a6675]">{r.status}</span>
                <span className="text-[#b4aa94]">›</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Glossary of every number Vex shows. */
export function ScoreGlossary({ only }: { only?: string[] }) {
  const items = only ? SCORE_DEFINITIONS.filter((d) => only.includes(d.label)) : SCORE_DEFINITIONS;
  return (
    <KitCard eyebrow="No mystery numbers" title="What each score means">
      <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {items.map((d) => (
          <li key={d.label} className="rounded-[16px] bg-[#faf6ed] p-3.5">
            <p className="text-[14px] font-semibold text-[#212d3d]">{d.label}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-[#5a6675]">{d.means}</p>
            <p className="mt-1 text-[12px] leading-snug text-[#b42318]">Not: {d.notMeans}</p>
          </li>
        ))}
      </ul>
    </KitCard>
  );
}

/* ================================================================== */
/*  JOBS · trust summary + refresh                                     */
/* ================================================================== */

export function JobsTrustBar() {
  const { jobs, hiddenJobIds } = useVexWorkspace();
  const [loading, setLoading] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState("");
  useEffect(() => setRefreshedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })), []);
  const visible = jobs.filter((j) => !hiddenJobIds.includes(j.id));
  const noSalary = visible.filter((j) => !j.salary).length;
  const flagged = visible.filter((j) => j.redFlags.length > 0).length;
  const stale = visible.filter((j) => j.isStale).length;
  const merged = visible.filter((j) => j.alsoFoundOn.length > 0).length;

  function refresh() {
    setLoading(true);
    logEvent("job_refreshed");
    window.setTimeout(() => {
      setLoading(false);
      setRefreshedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1100);
  }

  return (
    <div className="mb-4 rounded-[20px] border border-[#e3dccb] bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#212d3d]">
            {visible.length} jobs · checked {loading ? "now…" : `at ${refreshedAt}`}
          </p>
          <p className="text-[12px] text-[#5a6675]">Each card shows its source and when it was last checked.</p>
        </div>
        <KitButton variant="light" onClick={refresh} disabled={loading}>
          <svg viewBox="0 0 24 24" className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {loading ? "Checking…" : "Refresh jobs"}
        </KitButton>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Pill tone="info">{merged} merged duplicates</Pill>
        <Pill tone={noSalary ? "warn" : "good"}>{noSalary} salary not stated</Pill>
        <Pill tone={flagged ? "bad" : "good"}>{flagged} with warnings</Pill>
        <Pill tone={stale ? "warn" : "good"}>{stale} may be closed</Pill>
      </div>
      {loading && (
        <div className="mt-3">
          <LoadingRows rows={2} label="Checking your job sources" />
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  RESUME · AI notice                                                  */
/* ================================================================== */

export function AiNotice() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const on = () => setOnline(navigator.onLine);
    on();
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);
  return online ? (
    <div className="mb-4 flex items-start gap-2.5 rounded-[16px] bg-[#175cd3]/6 px-4 py-3 text-[13px] text-[#1e3a6e]">
      <Pill tone="info">AI draft</Pill>
      <p className="leading-snug">
        Anything marked as a suggestion is an AI draft built only from your profile. Nothing changes your CV until you accept it.
      </p>
    </div>
  ) : (
    <div role="alert" className="mb-4 rounded-[16px] border border-[#b54708]/25 bg-[#fef6e7] px-4 py-3 text-[13px] text-[#7a3d06]">
      <strong>AI is unavailable offline.</strong> Your text is safe — keep editing by hand and try AI again when you're back online.
    </div>
  );
}

/* ================================================================== */
/*  PROFILE · completeness checklist                                    */
/* ================================================================== */

export function ProfileCompleteness({ onNavigate }: { onNavigate: Nav }) {
  const { profile, resumes, skills } = useVexWorkspace();
  const items = [
    { label: "Name", ok: Boolean(profile.name) },
    { label: "Target role", ok: Boolean(profile.targetRole) },
    { label: "Work pattern", ok: Boolean(profile.workMode) },
    { label: "Career track", ok: Boolean(profile.track) },
    { label: "A CV in Vex", ok: resumes.length > 0 },
    { label: "4+ skills", ok: skills.length >= 4 },
  ];
  const missing = items.filter((i) => !i.ok);
  return (
    <div className="mb-4 rounded-[20px] border border-[#e3dccb] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14px] font-semibold text-[#212d3d]">
          {missing.length === 0 ? "Profile complete — ready for applying" : `${missing.length} thing${missing.length > 1 ? "s" : ""} missing before you apply`}
        </p>
        <Pill tone={missing.length ? "warn" : "good"}>
          {items.length - missing.length}/{items.length}
        </Pill>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span
            key={i.label}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] ${
              i.ok ? "bg-[#067647]/10 text-[#067647]" : "bg-[#f2eee2] text-[#5a6675]"
            }`}
          >
            {i.ok ? "✓" : "○"} {i.label}
          </span>
        ))}
      </div>
      {missing.some((m) => m.label === "A CV in Vex") && (
        <div className="mt-3">
          <KitButton onClick={() => onNavigate("documents")}>Add your CV</KitButton>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  INTERVIEW · questions to ask + invitation helper                   */
/* ================================================================== */

export function InterviewExtras() {
  const { applications, logInvitation } = useVexWorkspace();
  const [appId, setAppId] = useState(applications[0]?.id || "");
  const app = applications.find((a) => a.id === appId) || applications[0];
  const [copied, setCopied] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [slot, setSlot] = useState("");
  const [saved, setSaved] = useState(false);

  const questions = app
    ? [
        `What would success look like for the ${app.title} in the first 90 days?`,
        `What is the biggest challenge the team at ${app.company} is facing right now?`,
        "How do you measure performance in this role, and how often is it reviewed?",
        "What does a typical week look like, and who would I work with most?",
        "What are the next steps after this interview, and when can I expect to hear back?",
      ]
    : [];

  const reply = app
    ? `Dear ${app.company} team,\n\nThank you for inviting me to interview for the ${app.title} role. ${
        slot ? `${slot} works well for me.` : "I'd be glad to join at any of the times you suggested."
      } Please let me know if you need anything from me beforehand.\n\nKind regards`
    : "";

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      /* ignore */
    }
  }

  if (!app)
    return (
      <EmptyState title="No applications yet" text="Prepare an application from Jobs, then come back to rehearse for it." />
    );

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <KitCard
        eyebrow="Before you finish"
        title="Questions to ask the employer"
        action={
          <select
            aria-label="Application"
            value={app.id}
            onChange={(e) => setAppId(e.target.value)}
            className="max-w-[150px] cursor-pointer truncate rounded-full border border-[#d6cbb2] bg-white px-3 py-1.5 text-[12px] text-[#212d3d]"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.company}
              </option>
            ))}
          </select>
        }
      >
        <ol className="space-y-2">
          {questions.map((q, i) => (
            <li key={q} className="flex items-start gap-3 rounded-[14px] bg-[#faf6ed] p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#212d3d] text-[11.5px] font-semibold text-[#faf6ed]">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 text-[13.5px] leading-snug text-[#212d3d]">{q}</span>
              <button type="button" onClick={() => copy(q, `q${i}`)} className="shrink-0 cursor-pointer text-[12px] font-semibold text-[#5a6675]">
                {copied === `q${i}` ? "Copied" : "Copy"}
              </button>
            </li>
          ))}
        </ol>
      </KitCard>

      <KitCard tone="cream" eyebrow="When an invitation arrives" title="Respond in two minutes">
        <ol className="space-y-2 text-[13.5px] text-[#212d3d]">
          <li>1. Record the invitation so your tracker and prep plan update.</li>
          <li>2. Draft a polite reply — you send it yourself.</li>
          <li>3. Get a short prep plan for that role.</li>
        </ol>
        <div className="mt-4">
          <KitButton onClick={() => setInviteOpen(true)}>I got an invitation</KitButton>
        </div>
      </KitCard>

      <Modal open={inviteOpen} onClose={() => { setInviteOpen(false); setSaved(false); }} title={`Invitation · ${app.company}`} wide>
        <div className="space-y-4">
          <label className="block">
            <span className="text-[12.5px] font-medium text-[#5a6675]">Date & time they offered (as written)</span>
            <input
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              placeholder="e.g. Tuesday 17 Nov, 10:00"
              className="mt-1 w-full rounded-[14px] border border-[#d6cbb2] bg-white px-3.5 py-2.5 text-[14px] text-[#212d3d] outline-none focus:border-[#212d3d]"
            />
          </label>
          <div>
            <p className="text-[12.5px] font-medium text-[#5a6675]">Draft reply (you send it)</p>
            <pre className="mt-1 rounded-[14px] bg-white p-3.5 text-[13px] whitespace-pre-wrap text-[#212d3d]">{reply}</pre>
            <div className="mt-2">
              <KitButton variant="light" onClick={() => copy(reply, "reply")}>{copied === "reply" ? "Copied ✓" : "Copy reply"}</KitButton>
            </div>
          </div>
          <div className="rounded-[14px] bg-[#f2eee2] p-3.5 text-[13px] text-[#212d3d]">
            <p className="font-semibold">Prep plan</p>
            <ul className="mt-1 space-y-0.5 text-[#5a6675]">
              <li>• Re-read the job's must-have requirements</li>
              <li>• Prepare 3 STAR stories with a measurable result</li>
              <li>• Do 2 practice sessions in this studio</li>
              <li>• Pick 2 questions to ask from the list</li>
            </ul>
          </div>
          <KitButton
            disabled={saved}
            onClick={() => {
              logInvitation(app.company, app.title, slot || "Date to confirm");
              setSaved(true);
            }}
          >
            {saved ? "Recorded in tracker ✓" : "Record invitation in tracker"}
          </KitButton>
          <p className="text-[11.5px] text-[#7a705c]">Vex never books or replies for you — it records what you tell it.</p>
        </div>
      </Modal>
    </div>
  );
}

/* ================================================================== */
/*  LEARNING · consent, priorities across jobs, origin labels, creator */
/* ================================================================== */

export const LEARNING_CONSENT_KEY = "vex_learning_consent";

export function useLearningConsent() {
  const [consent, setConsent] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      setConsent(localStorage.getItem(LEARNING_CONSENT_KEY) === "1");
    } catch {
      setConsent(false);
    }
    const sync = () => {
      try {
        setConsent(localStorage.getItem(LEARNING_CONSENT_KEY) === "1");
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("vex:consent", sync);
    return () => window.removeEventListener("vex:consent", sync);
  }, []);
  const set = (v: boolean) => {
    try {
      if (v) localStorage.setItem(LEARNING_CONSENT_KEY, "1");
      else localStorage.removeItem(LEARNING_CONSENT_KEY);
    } catch {
      /* ignore */
    }
    setConsent(v);
    window.dispatchEvent(new Event("vex:consent"));
  };
  return [consent, set] as const;
}

export function LearningConsentBanner() {
  const [consent, setConsent] = useLearningConsent();
  if (consent !== false) return null;
  return (
    <div className="mb-4 rounded-[20px] border border-[#212d3d]/15 bg-white p-4 sm:p-5">
      <p className="text-[15px] font-semibold text-[#212d3d]">Can Vex use your CV and practice answers to estimate your skills?</p>
      <p className="mt-1 text-[13px] leading-snug text-[#5a6675]">
        Used only to show skill levels and gaps for your target jobs. Never shared or used for training. You can turn this off in Settings at any time.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <KitButton onClick={() => setConsent(true)}>Allow</KitButton>
        <KitButton variant="light" onClick={() => setConsent(true)}>Allow and remind me later</KitButton>
      </div>
    </div>
  );
}

export function LearningExtras() {
  const { jobs, savedJobIds } = useVexWorkspace();
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [built, setBuilt] = useState(false);

  const targets = jobs.filter((j) => savedJobIds.includes(j.id));
  const pool = targets.length ? targets : jobs.slice(0, 3);
  const ranking = useMemo(() => {
    const m = new Map<string, { jobs: number; mandatory: number }>();
    pool.forEach((j) =>
      j.requirements
        .filter((r) => r.status === "missing" || r.status === "improve")
        .forEach((r) => {
          const cur = m.get(r.text) || { jobs: 0, mandatory: 0 };
          cur.jobs += 1;
          if (r.mandatory) cur.mandatory += 1;
          m.set(r.text, cur);
        })
    );
    return [...m.entries()]
      .map(([skill, v]) => ({ skill, ...v, score: v.jobs * 2 + v.mandatory * 3 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [pool]);

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <KitCard eyebrow={`Across ${pool.length} ${targets.length ? "saved" : "top"} jobs`} title="What to learn first">
        {ranking.length === 0 ? (
          <p className="text-[13.5px] text-[#5a6675]">No shared gaps found — your profile covers these jobs well.</p>
        ) : (
          <ol className="space-y-2">
            {ranking.map((r, i) => (
              <li key={r.skill} className="flex items-start gap-3 rounded-[14px] bg-[#faf6ed] p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#212d3d] text-[11.5px] font-semibold text-[#faf6ed]">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-medium text-[#212d3d]">{r.skill}</span>
                  <span className="block text-[12px] text-[#5a6675]">
                    Needed by {r.jobs} job{r.jobs > 1 ? "s" : ""}
                    {r.mandatory ? ` · must-have in ${r.mandatory}` : " · nice to have"}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        )}
        <p className="mt-3 text-[11.5px] text-[#7a705c]">Ranked by how many of your target jobs need it and whether it's a must-have — never by how easy it is to teach.</p>
      </KitCard>

      <KitCard tone="cream" eyebrow="Honest labels" title="Where lessons come from">
        <ul className="space-y-2 text-[13px] text-[#212d3d]">
          <li className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2"><Pill tone="navy">External course</Pill> Made by another provider; cost and length shown.</li>
          <li className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2"><Pill tone="info">AI-generated lesson</Pill> Written by Vex for your gap; reviewed before release.</li>
          <li className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2"><Pill>Video lesson</Pill> A linked video with chapters.</li>
        </ul>
        <div className="mt-3 rounded-[14px] bg-white p-3 text-[12.5px] leading-snug text-[#5a6675]">
          <strong className="text-[#212d3d]">Course completed ≠ skill demonstrated.</strong> A skill moves up only after a practical check, and Vex never shows “Verified” for its own assessments.
        </div>
        <div className="mt-4">
          <KitButton onClick={() => setCreatorOpen(true)}>Create a custom lesson</KitButton>
        </div>
      </KitCard>

      <Modal open={creatorOpen} onClose={() => { setCreatorOpen(false); setBuilt(false); }} title="AI course creator" wide>
        {!built ? (
          <div className="space-y-3">
            <p className="text-[13.5px] text-[#5a6675]">Used when no good external course exists. Vex drafts a short course for one gap.</p>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={ranking[0]?.skill || "e.g. SQL cohort queries"}
              className="w-full rounded-[14px] border border-[#d6cbb2] bg-white px-3.5 py-2.5 text-[14px] text-[#212d3d] outline-none focus:border-[#212d3d]"
            />
            <KitButton onClick={() => setBuilt(true)}>Draft the course</KitButton>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              <Pill tone="info">AI-generated lesson</Pill>
              <Pill tone="warn">Draft · not yet reviewed</Pill>
            </div>
            <p className="font-serif-display text-[22px] text-[#212d3d]">{topic || ranking[0]?.skill || "Your gap"}: a 3-lesson starter</p>
            <ol className="space-y-2 text-[13.5px] text-[#212d3d]">
              <li className="rounded-[14px] bg-white p-3"><strong>Lesson 1 · Core idea</strong> — explanation with one worked example · 15 min</li>
              <li className="rounded-[14px] bg-white p-3"><strong>Lesson 2 · Practice</strong> — 3 exercises of rising difficulty · 20 min</li>
              <li className="rounded-[14px] bg-white p-3"><strong>Lesson 3 · Practical check</strong> — criteria shown before you start · 15 min</li>
            </ol>
            <p className="text-[12px] text-[#7a705c]">No certificate or accreditation is implied. Passing the check marks the skill “Demonstrated in Vex”.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ================================================================== */
/*  ASSISTANT · task runner (pause/stop), conflicts, activity, connect */
/* ================================================================== */

const STEPS = ["Search your job source", "Compare jobs with your profile", "Find skill gaps", "Draft a tailored CV", "Ask before filling any form"];

export function AssistantExtras() {
  const { activityLog } = useVexWorkspace();
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [step, setStep] = useState(0);
  const [connectOpen, setConnectOpen] = useState(false);
  const [conflictChoice, setConflictChoice] = useState<"" | "a" | "b" | "check">("");
  const [filter, setFilter] = useState<"All" | McpActivityEntry["result"]>("All");

  useEffect(() => {
    if (!running || paused || stopped || step >= STEPS.length - 1) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), 1100);
    return () => window.clearTimeout(t);
  }, [running, paused, stopped, step]);

  const rows = filter === "All" ? activityLog : activityLog.filter((a) => a.result === filter);

  function exportCsv() {
    const head = "time,actor,tool,action,data shared,approval,result";
    const body = activityLog
      .map((a) => [a.time, a.actor, a.tool, a.action, a.dataShared, a.approval, a.result].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([head + "\n" + body], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "vex-activity.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const awaiting = running && !stopped && step === STEPS.length - 1;

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Task in progress */}
        <KitCard
          eyebrow="Task in progress"
          title="Find jobs, gaps and draft a CV"
          action={
            !running ? (
              <KitButton onClick={() => { setRunning(true); setStopped(false); setPaused(false); setStep(0); }}>Start</KitButton>
            ) : undefined
          }
        >
          <ol className="space-y-1.5">
            {STEPS.map((s, i) => {
              const state = !running ? "waiting" : stopped && i >= step ? "stopped" : i < step ? "done" : i === step ? (awaiting ? "approval" : paused ? "paused" : "running") : "waiting";
              return (
                <li key={s} className="flex items-center gap-3 rounded-[12px] bg-[#faf6ed] px-3 py-2.5">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      state === "done" ? "bg-[#067647] text-white" : state === "running" ? "animate-pulse bg-[#212d3d] text-white" : "bg-[#e3dccb] text-[#5a6675]"
                    }`}
                  >
                    {state === "done" ? "✓" : i + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-[13.5px] text-[#212d3d]">{s}</span>
                  <Pill tone={state === "done" ? "good" : state === "approval" ? "warn" : state === "stopped" ? "bad" : "neutral"}>
                    {state === "approval" ? "Needs approval" : state}
                  </Pill>
                </li>
              );
            })}
          </ol>
          {running && (
            <div className="mt-3 flex flex-wrap gap-2">
              {!stopped && !awaiting && (
                <KitButton variant="light" onClick={() => setPaused((p) => !p)}>{paused ? "Resume" : "Pause"}</KitButton>
              )}
              {!stopped && <KitButton variant="danger" onClick={() => setStopped(true)}>Stop</KitButton>}
              {stopped && <KitButton variant="light" onClick={() => setRunning(false)}>Close</KitButton>}
            </div>
          )}
          {stopped && <p className="mt-2 text-[12px] text-[#5a6675]">Stopped. Finished steps stay in your history; nothing else ran.</p>}
        </KitCard>

        {/* Sources disagree */}
        <KitCard tone="cream" eyebrow="Example · sources disagree" title="Closing date doesn't match">
          <div className="grid grid-cols-2 gap-2">
            {[
              { k: "a" as const, src: "Job source A", val: "Closes 28 Nov", when: "checked today 10:42" },
              { k: "b" as const, src: "Company careers page", val: "Closes 21 Nov", when: "checked 3 days ago" },
            ].map((o) => (
              <button
                key={o.k}
                type="button"
                onClick={() => setConflictChoice(o.k)}
                className={`cursor-pointer rounded-[14px] border bg-white p-3 text-left ${conflictChoice === o.k ? "border-[#212d3d]" : "border-[#e3dccb]"}`}
              >
                <span className="block text-[11.5px] text-[#7a705c]">{o.src}</span>
                <span className="block text-[15px] font-semibold text-[#212d3d]">{o.val}</span>
                <span className="block text-[11px] text-[#7a705c]">{o.when}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <KitButton variant="light" onClick={() => setConflictChoice("check")}>I'll check myself</KitButton>
            {conflictChoice && (
              <span className="text-[12.5px] text-[#067647]">
                {conflictChoice === "check" ? "Marked “check manually”." : "Saved your choice — the other source stays visible."}
              </span>
            )}
          </div>
          <p className="mt-2 text-[11.5px] text-[#7a705c]">Vex never picks one silently or averages them.</p>
        </KitCard>
      </div>

      {/* Activity history with filter + export */}
      <KitCard
        eyebrow="Everything the assistant did"
        title="Activity history"
        action={
          <div className="flex gap-2">
            <KitButton variant="light" onClick={() => setConnectOpen(true)}>Add a connection</KitButton>
            <KitButton variant="light" onClick={exportCsv}>Export</KitButton>
          </div>
        }
      >
        <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto">
          {(["All", "Succeeded", "Failed", "Not run", "Not confirmed"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium ${filter === f ? "bg-[#212d3d] text-[#faf6ed]" : "bg-[#f2eee2] text-[#5a6675]"}`}
            >
              {f}
            </button>
          ))}
        </div>
        {rows.length === 0 ? (
          <EmptyState title="Nothing here" text="No activity matches this filter yet." />
        ) : (
          <ul className="divide-y divide-[#ece5d5]">
            {rows.map((a) => (
              <li key={a.id} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-3">
                <span className="w-28 shrink-0 text-[12px] text-[#7a705c]">{a.time}</span>
                <span className="min-w-0 flex-1 text-[13.5px] text-[#212d3d]">
                  <strong>{a.tool}</strong> · {a.action}
                  <span className="block text-[12px] text-[#5a6675]">Shared: {a.dataShared}</span>
                </span>
                <span className="flex gap-1.5">
                  <Pill>{a.approval}</Pill>
                  <Pill tone={a.result === "Succeeded" ? "good" : a.result === "Failed" ? "bad" : "warn"}>{a.result}</Pill>
                </span>
              </li>
            ))}
          </ul>
        )}
      </KitCard>

      <ConnectToolWizard open={connectOpen} onClose={() => setConnectOpen(false)} />
    </div>
  );
}

const TOOL_TYPES = [
  { id: "jobs", name: "Job-listing source", does: "Search jobs and check if they're still open", data: "Search terms, location, role" },
  { id: "calendar", name: "Calendar", does: "Check free time; add interview or study blocks", data: "Only dates you choose" },
  { id: "email", name: "Email (one folder)", does: "Find interview invitations and recruiter replies", data: "Nothing unless you send a message" },
  { id: "docs", name: "Document storage", does: "Fetch a CV or portfolio file you pick", data: "Only the files you choose" },
];

export function ConnectToolWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [tool, setTool] = useState(TOOL_TYPES[0]);
  const [perm, setPerm] = useState({ read: true, draft: false, change: false });
  const [duration, setDuration] = useState("This task only");
  const [testing, setTesting] = useState(false);
  const labels = ["Choose", "Review", "Permissions", "Sign in", "Test", "Connected"];

  function close() {
    onClose();
    window.setTimeout(() => setStep(1), 300);
  }

  return (
    <Modal open={open} onClose={close} title="Connect a tool" wide>
      <div className="no-scrollbar mb-4 flex gap-1 overflow-x-auto">
        {labels.map((l, i) => (
          <span key={l} className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${i + 1 === step ? "bg-[#212d3d] text-[#faf6ed]" : i + 1 < step ? "bg-[#067647]/10 text-[#067647]" : "bg-[#f2eee2] text-[#7a705c]"}`}>
            {i + 1}. {l}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-2">
          {TOOL_TYPES.map((t) => (
            <button key={t.id} type="button" onClick={() => setTool(t)} className={`block w-full cursor-pointer rounded-[16px] border bg-white p-3.5 text-left ${tool.id === t.id ? "border-[#212d3d]" : "border-[#e3dccb]"}`}>
              <span className="block text-[14.5px] font-semibold text-[#212d3d]">{t.name}</span>
              <span className="block text-[12.5px] text-[#5a6675]">{t.does}</span>
            </button>
          ))}
          <p className="text-[11.5px] text-[#7a705c]">Only add tools you trust.</p>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-2 rounded-[16px] bg-white p-4 text-[13.5px] text-[#212d3d]">
          <p><strong>{tool.name}</strong></p>
          <p><span className="text-[#5a6675]">What it can do:</span> {tool.does}</p>
          <p><span className="text-[#5a6675]">Data Vex would send:</span> {tool.data}</p>
          <p className="text-[12px] text-[#7a705c]">The tool's own privacy terms apply on its side.</p>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-3">
          {([
            ["read", "Read only"],
            ["draft", "Read and draft inside Vex"],
            ["change", "Make changes (always asks first)"],
          ] as const).map(([k, l]) => (
            <label key={k} className="flex cursor-pointer items-center gap-3 rounded-[14px] bg-white p-3 text-[13.5px] text-[#212d3d]">
              <input type="checkbox" checked={perm[k]} onChange={(e) => setPerm((p) => ({ ...p, [k]: e.target.checked }))} className="h-4 w-4 accent-[#212d3d]" />
              {l}
            </label>
          ))}
          <div className="flex flex-wrap gap-1.5">
            {["This task only", "30 days", "Until I disconnect"].map((d) => (
              <button key={d} type="button" onClick={() => setDuration(d)} className={`cursor-pointer rounded-full px-3 py-1.5 text-[12.5px] font-medium ${duration === d ? "bg-[#212d3d] text-[#faf6ed]" : "bg-[#f2eee2] text-[#5a6675]"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="rounded-[16px] bg-white p-4 text-[13.5px] text-[#212d3d]">
          <p>You'll sign in on <strong>{tool.name}</strong>'s own page. Vex never sees or stores that password.</p>
          <p className="mt-2 text-[12px] text-[#7a705c]">Preview only — real sign-in arrives with the backend.</p>
        </div>
      )}
      {step === 5 && (
        <div className="rounded-[16px] bg-white p-4">
          {testing ? <LoadingRows rows={1} label="Testing the connection" /> : <p className="text-[13.5px] text-[#067647]">✓ The tool responded. Connection works.</p>}
        </div>
      )}
      {step === 6 && (
        <div className="rounded-[16px] bg-[#067647]/8 p-4 text-[13.5px] text-[#212d3d]">
          <p className="font-semibold text-[#067647]">Connected</p>
          <p className="mt-1">{tool.name} · {[perm.read && "read", perm.draft && "draft", perm.change && "change (asks first)"].filter(Boolean).join(", ")} · {duration}</p>
          <p className="mt-1 text-[12px] text-[#5a6675]">You can disconnect it any time from the hub.</p>
        </div>
      )}

      <div className="mt-5 flex justify-between gap-2">
        <KitButton variant="ghost" onClick={() => (step > 1 ? setStep(step - 1) : close())}>{step > 1 ? "Back" : "Cancel"}</KitButton>
        <KitButton
          onClick={() => {
            if (step === 6) {
              logEvent("tool_connected", tool.id);
              close();
              return;
            }
            if (step === 4) {
              setTesting(true);
              window.setTimeout(() => setTesting(false), 1000);
            }
            setStep(step + 1);
          }}
          disabled={step === 5 && testing}
        >
          {step === 4 ? "Sign in & test" : step === 6 ? "Done" : "Continue"}
        </KitButton>
      </div>
    </Modal>
  );
}

/* ================================================================== */
/*  SETTINGS · plan checkout/cancel, consent, delete, analytics, help  */
/* ================================================================== */

export function SettingsExtras() {
  const { plan, changePlan, resetWorkspaceData } = useVexWorkspace();
  const [consent, setConsent] = useLearningConsent();
  const [checkout, setCheckout] = useState<"" | "Pro" | "Ultra">("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [events, setEvents] = useState<VexEventRecord[]>([]);

  useEffect(() => {
    const load = () => setEvents(readEvents());
    load();
    window.addEventListener("vex:analytics", load);
    return () => window.removeEventListener("vex:analytics", load);
  }, []);

  const price = { Pro: "£19 / month", Ultra: "£39 / month" };

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <KitCard eyebrow={`Current plan · ${plan}`} title="Change plan">
        <div className="flex flex-wrap gap-2">
          {plan !== "Pro" && <KitButton onClick={() => setCheckout("Pro")}>Upgrade to Pro</KitButton>}
          {plan !== "Ultra" && <KitButton variant="light" onClick={() => setCheckout("Ultra")}>Upgrade to Ultra</KitButton>}
          {plan !== "Free" && <KitButton variant="ghost" onClick={() => setCancelOpen(true)}>Cancel plan</KitButton>}
        </div>
        <p className="mt-3 text-[12px] text-[#7a705c]">Cancel any time. You keep paid features until the end of the billing period.</p>
      </KitCard>

      <KitCard eyebrow="Privacy" title="Your data">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[14px] bg-[#faf6ed] p-3">
          <span>
            <span className="block text-[13.5px] font-medium text-[#212d3d]">Use my CV and answers for skill estimates</span>
            <span className="block text-[12px] text-[#5a6675]">Never shared or used for training</span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(consent)}
            onClick={() => setConsent(!consent)}
            className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full ${consent ? "bg-[#067647]" : "bg-[#d6cfbf]"}`}
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${consent ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/dashboard/help" className="inline-flex items-center rounded-full border border-[#d6cbb2] bg-white px-4 py-2 text-[13px] font-semibold text-[#212d3d]">
            Help & support
          </Link>
          <KitButton variant="danger" onClick={() => setDeleteOpen(true)}>Delete account</KitButton>
        </div>
      </KitCard>

      <KitCard
        className="lg:col-span-2"
        eyebrow="Stored only on this device"
        title="First-day activity log"
        action={<KitButton variant="light" onClick={clearEvents}>Clear</KitButton>}
      >
        {events.length === 0 ? (
          <p className="text-[13.5px] text-[#5a6675]">No events yet. Using Vex records simple steps here (no personal content) so first-day progress can be measured.</p>
        ) : (
          <ul className="max-h-[220px] divide-y divide-[#ece5d5] overflow-y-auto">
            {events.slice(0, 30).map((e, i) => (
              <li key={i} className="flex items-center gap-3 py-2 text-[12.5px]">
                <span className="w-[72px] shrink-0 text-[#7a705c]">{new Date(e.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                <span className="font-mono text-[#212d3d]">{e.name}</span>
                {e.detail && <span className="truncate text-[#5a6675]">· {e.detail}</span>}
              </li>
            ))}
          </ul>
        )}
      </KitCard>

      <Modal open={Boolean(checkout)} onClose={() => setCheckout("")} title={`Upgrade to ${checkout}`}>
        {checkout && (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between rounded-[14px] bg-white p-4">
              <span className="text-[14px] text-[#212d3d]">Vex {checkout}</span>
              <span className="font-serif-display text-[24px] text-[#212d3d]">{price[checkout]}</span>
            </div>
            <p className="text-[12.5px] text-[#5a6675]">Billed monthly. Cancel any time from Settings. Payment is a preview until checkout is connected.</p>
            <KitButton
              className="w-full"
              onClick={() => {
                changePlan(checkout, `Preview upgrade to ${checkout}`);
                logEvent("plan_changed", checkout);
                setCheckout("");
              }}
            >
              Confirm upgrade
            </KitButton>
          </div>
        )}
      </Modal>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel your plan?">
        <p className="text-[13.5px] text-[#5a6675]">You'll move to Free at the end of this period. Your profile, CVs and tracker stay.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <KitButton variant="danger" onClick={() => { changePlan("Free", "Plan cancelled"); logEvent("plan_changed", "Free"); setCancelOpen(false); }}>Cancel plan</KitButton>
          <KitButton variant="light" onClick={() => setCancelOpen(false)}>Keep {plan}</KitButton>
        </div>
      </Modal>

      <Modal open={deleteOpen} onClose={() => { setDeleteOpen(false); setConfirmText(""); }} title="Delete your account">
        <p className="text-[13.5px] text-[#5a6675]">This removes your profile, CVs, letters, tracker and settings from this device. It can't be undone.</p>
        <label className="mt-3 block text-[12.5px] text-[#5a6675]">
          Type <strong className="text-[#212d3d]">DELETE</strong> to confirm
          <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="mt-1 w-full rounded-[14px] border border-[#d6cbb2] bg-white px-3.5 py-2.5 text-[14px] text-[#212d3d] outline-none focus:border-[#b42318]" />
        </label>
        <div className="mt-4 flex gap-2">
          <KitButton
            variant="danger"
            disabled={confirmText !== "DELETE"}
            onClick={() => {
              resetWorkspaceData();
              clearEvents();
              try {
                ["vex_frontend_user", "vex_onboarding_profile", "vex_learning_consent"].forEach((k) => localStorage.removeItem(k));
              } catch {
                /* ignore */
              }
              window.location.href = "/";
            }}
          >
            Delete everything
          </KitButton>
          <KitButton variant="light" onClick={() => setDeleteOpen(false)}>Keep my account</KitButton>
        </div>
      </Modal>
    </div>
  );
}

/* ================================================================== */
/*  Dispatch: top / bottom panels per dashboard section                */
/* ================================================================== */

export function SectionTopPanels({ section, onNavigate }: { section: DashboardSectionId; onNavigate: Nav }) {
  const { applications, contacts } = useVexWorkspace();
  switch (section) {
    case "overview":
      return <HomeTopPanels onNavigate={onNavigate} />;
    case "jobs":
      return <JobsTrustBar />;
    case "documents":
      return (
        <>
          <AiNotice />
          <Link
            href="/dashboard/documents/templates"
            className="mb-4 flex items-center gap-3 rounded-[16px] border border-[#e3dccb] bg-white px-4 py-3 transition-colors hover:border-[#212d3d]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#212d3d] text-[#e3cea0]">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="3" width="7" height="9" rx="1.5" />
                <rect x="13" y="3" width="7" height="5" rx="1.5" />
                <rect x="13" y="10" width="7" height="11" rx="1.5" />
                <rect x="4" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold text-[#212d3d]">Explore CV templates</span>
              <span className="block truncate text-[12px] text-[#5a6675]">8 ATS-readable layouts, previewed with your own CV</span>
            </span>
            <span className="text-[#7a705c]">›</span>
          </Link>
        </>
      );
    case "profile":
      return <ProfileCompleteness onNavigate={onNavigate} />;
    case "learning":
      return <LearningConsentBanner />;
    case "applications":
      return applications.length === 0 ? (
        <div className="mb-4">
          <EmptyState title="No applications yet" text="Save a job and choose “Prepare application” — it will appear here." action={<KitButton onClick={() => onNavigate("jobs")}>Find jobs</KitButton>} />
        </div>
      ) : null;
    case "network":
      return contacts.length === 0 ? (
        <div className="mb-4">
          <EmptyState title="No contacts yet" text="Add a recruiter or a warm intro so follow-ups don't slip." />
        </div>
      ) : null;
    default:
      return null;
  }
}

export function SectionBottomPanels({ section }: { section: DashboardSectionId }) {
  switch (section) {
    case "overview":
      return <div className="mt-6"><ScoreGlossary /></div>;
    case "interviews":
      return (
        <>
          <InterviewExtras />
          <div className="mt-4"><ScoreGlossary only={["Interview answer scores"]} /></div>
        </>
      );
    case "learning":
      return <LearningExtras />;
    case "mcp":
      return <AssistantExtras />;
    case "settings":
      return <SettingsExtras />;
    default:
      return null;
  }
}
