"use client";

import { useQuickAction, focusField } from "@/lib/quick-actions";
import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  CvDiffSuggestion,
  CvQualityFlag,
  OnboardingProfileState,
} from "@/data/dashboard";
import { CheckIcon } from "@/components/Icons";
import { GreekTempleWordFrame } from "./IonicColumnDecoration";
import MobileManuscriptEditor from "@/components/mobile/MobileManuscriptEditor";

interface DocumentsStudioViewProps {
  profile: OnboardingProfileState;
  diffs: CvDiffSuggestion[];
  flags: CvQualityFlag[];
  onDecideDiff: (diffId: string, decision: "accepted" | "rejected") => void;
  onResolveFlag: (flagId: string) => void;
}

type AiSuggestionTarget = "summary" | "bullet" | "skills" | "cover-letter";

interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  suggestion?: {
    target: AiSuggestionTarget;
    label: string;
    content: string;
    applied?: boolean;
  };
}

const TEMPLATES = [
  { id: "editorial", label: "Editorial Clean" },
  { id: "classic", label: "Classic Single-Col" },
  { id: "executive", label: "Executive Brief" },
] as const;

const VARIANTS = [
  { id: "tailored", label: "Northbridge Tailored" },
  { id: "aldermere", label: "Aldermere Variant" },
  { id: "base", label: "Master Base CV" },
] as const;

const TONES: Array<"Direct" | "Analytical" | "Executive Warm"> = [
  "Direct",
  "Analytical",
  "Executive Warm",
];

// Reusable neoclassical Microsoft Word beveled button classes
const BTN_STONE =
  "inline-flex items-center justify-center gap-1.5 rounded-[7px] border border-[#9d8b69] bg-gradient-to-b from-[#fffdf7] to-[#e8dcc2] px-3.5 py-2 text-[11.5px] font-semibold text-[#2a2216] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_2.5px_0_#9b8967] transition-all hover:border-[#6d5938] hover:from-[#ffffff] hover:to-[#efe3c9] active:translate-y-[1.5px] active:shadow-[0_1px_0_#9b8967] cursor-pointer";

const BTN_NAVY =
  "inline-flex items-center justify-center gap-1.5 rounded-[7px] border border-[#1d2735] bg-gradient-to-b from-[#2f4056] to-[#1a2432] px-4 py-2 text-[11.5px] font-semibold text-[#faf6ed] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2.5px_0_#0f1620] transition-all hover:from-[#384c66] hover:to-[#212d3d] active:translate-y-[1.5px] active:shadow-[0_1px_0_#0f1620] cursor-pointer";

const BTN_BRASS =
  "inline-flex items-center justify-center gap-1.5 rounded-[7px] border border-[#7c6131] bg-gradient-to-b from-[#f6e8c7] to-[#dec38b] px-3.5 py-1.5 text-[11px] font-semibold text-[#2c210e] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_2px_0_#8f723c] transition-all hover:from-[#fbf1d9] hover:to-[#e5cd99] active:translate-y-[1.5px] active:shadow-[0_1px_0_#8f723c] cursor-pointer";

function buildInitialSummary(profile: OnboardingProfileState) {
  return `Target role: ${
    profile.targetRole || "Product Operations Lead"
  }. Operator experienced in cross-functional product release coordination, workflow reliability, compliance handoffs, and executive operational reporting (${
    profile.workMode || "Hybrid"
  } / ${profile.track || "Product Operations"}).`;
}

function buildInitialSkills(profile: OnboardingProfileState) {
  return profile.priorities.length
    ? `${profile.priorities.join(" · ")} · Release Checklists · SQL Cohort Audits`
    : "Product Operations · Release Checklists · Cross-Functional Governance · SQL Cohort Audits · Stakeholder Alignment";
}

function createContextualAiReply(
  prompt: string,
  roleName: string,
  candidateName: string,
  activeTab: "cv" | "cover-letter"
): Omit<AiChatMessage, "id"> {
  const q = prompt.toLowerCase();

  if (q.includes("summary") || q.includes("profile") || q.includes("tighten") || q.includes("senior")) {
    return {
      role: "assistant",
      text: `Tightened your Executive Profile for "${roleName}" so the opening sentence highlights release governance and zero-fabrication operational ownership.`,
      suggestion: {
        target: "summary",
        label: "Replace Executive Profile",
        content: `Targeted for ${roleName}. Operations specialist known for aligning engineering, legal compliance, and client readiness teams around predictable release cadences, verifiable SLA checklists, and transparent post-launch reporting.`,
      },
    };
  }

  if (q.includes("cover") || q.includes("letter") || q.includes("opener") || activeTab === "cover-letter") {
    return {
      role: "assistant",
      text: "Drafted a sharper, grounded Cover Letter focused on cross-functional launch reliability without inventing unverified metrics.",
      suggestion: {
        target: "cover-letter",
        label: "Update Cover Letter",
        content: `Dear Northbridge Hiring Team,\n\nI am writing to apply for the ${roleName} position. Over my recent product operations work, I built clear release readiness gates between engineering, compliance, and customer support teams so high-stakes launches shipped without silent handoff failures.\n\nEverything highlighted in my dossier reflects directly documented outcomes, and I have transparently scoped areas where I am deepening hands-on SQL cohort diagnostics.\n\nSincerely,\n${candidateName}`,
      },
    };
  }

  if (q.includes("skill") || q.includes("keyword") || q.includes("ats")) {
    return {
      role: "assistant",
      text: "Refined your attested Skills line so single-column ATS parsers index high-signal operational keywords while staying truthful.",
      suggestion: {
        target: "skills",
        label: "Update Core Skills Strip",
        content:
          "Product Operations · Release Governance · Cross-Functional Handoffs · SLA Checklists · Incident Runbooks · Stakeholder Reporting · SQL Basics (In Progress)",
      },
    };
  }

  return {
    role: "assistant",
    text: `Crafted a stronger action-oriented impact bullet aligned with "${prompt.trim().slice(0, 48)}${prompt.trim().length > 48 ? "..." : ""}". Review and apply directly to your A4 manuscript.`,
    suggestion: {
      target: "bullet",
      label: "Append Bullet to Experience",
      content:
        "Owned cross-functional release readiness sign-off across engineering, QA, and support teams, eliminating unreviewed deployment regressions and keeping stakeholder documentation audit-ready.",
    },
  };
}

export default function DocumentsStudioView({
  profile,
  diffs,
  flags,
  onDecideDiff,
  onResolveFlag,
}: DocumentsStudioViewProps) {
  const [activeTab, setActiveTab] = useState<"cv" | "cover-letter">("cv");
  const [variant, setVariant] = useState<"tailored" | "base" | "aldermere">(
    "tailored"
  );
  const [template, setTemplate] = useState<"editorial" | "classic" | "executive">(
    "editorial"
  );
  const [tone, setTone] = useState<"Direct" | "Analytical" | "Executive Warm">(
    "Direct"
  );
  const [uploadedFileName, setUploadedFileName] = useState<string>(
    "Base_Candidate_CV_2025.pdf"
  );

  // Word ribbon & view controls
  const [showRuler, setShowRuler] = useState(true);
  const [showGuides, setShowGuides] = useState(false);
  const [fontStep, setFontStep] = useState<0 | 1 | 2>(1);
  const [zoomPct, setZoomPct] = useState<95 | 100 | 115>(100);
  const [exportMessage, setExportMessage] = useState("");
  const [letterApproved, setLetterApproved] = useState(false);

  // Right side-rail switcher ("ai" open immediately so user can talk to AI right away)
  const [rightRailTab, setRightRailTab] = useState<"ai" | "audit">("ai");

  // Directly editable Word canvas fields
  const [candidateName, setCandidateName] = useState(
    profile.name || "Vex Candidate"
  );
  const [candidateMeta, setCandidateMeta] = useState(
    `${profile.targetRole || "Product Operations Lead"} · ${
      profile.workMode || "Hybrid"
    } · ${profile.email || "candidate@vex-academia.io"}`
  );
  const [summaryText, setSummaryText] = useState(() =>
    buildInitialSummary(profile)
  );
  const [customBullets, setCustomBullets] = useState<string[]>([
    "Coordinated bi-weekly product releases across engineering, legal compliance, and customer operations teams with zero unannounced SLA regressions.",
    "Standardised post-launch incident runbooks and cross-team handoff criteria across three core enterprise workflows.",
  ]);
  const [skillsText, setSkillsText] = useState(() => buildInitialSkills(profile));

  const [coverLetterText, setCoverLetterText] = useState(
    `Dear Hiring Team,\n\nI am applying for the ${
      profile.targetRole || "Product Operations Lead"
    } role at Northbridge Systems. Across my recent work coordinating cross-functional product launches, I standardised release checklists between engineering, compliance, and customer support teams.\n\nWhere listing metrics require direct SQL cohort diagnostics, I have documented my current baseline honestly and outlined my immediate practical upskilling plan.\n\nSincerely,\n${
      profile.name || "Vex Candidate"
    }`
  );

  // Interactive AI Scribe State (Side Panel Chat)
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([
    {
      id: "ai-welcome",
      role: "assistant",
      text: `Vex Scribe ready. Tell me how to refine your ${
        profile.targetRole || "Product Operations Lead"
      } manuscript, or pick a quick edit below—zero invented metrics.`,
      suggestion: {
        target: "summary",
        label: "Sharpen Executive Profile",
        content: `Results-driven ${
          profile.targetRole || "Product Operations Lead"
        } experienced in structuring cross-team launch gates, compliance readiness handoffs, and dependable release governance (${
          profile.workMode || "Hybrid"
        }).`,
      },
    },
  ]);

  // Section focus & AI chat scroll refs
  const headerRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLInputElement>(null);
  const aiInputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  useQuickAction("tailor-cv", () => {
    setRightRailTab("ai");
    aiInputRef.current?.focus();
  });

  const hasBlockedUnsupported = diffs.some(
    (d) => d.hasUnsupportedClaim && d.status !== "rejected"
  );
  const unresolvedCount = flags.filter((f) => !f.resolved).length;
  const atsScore = hasBlockedUnsupported ? 78 : unresolvedCount === 0 ? 96 : 89;

  // Live bullets shown inside the A4 Word sheet
  const diffLines = useMemo(() => {
    return diffs
      .filter((d) => !(d.hasUnsupportedClaim && d.status === "rejected"))
      .map((d) => {
        if (variant === "base") return d.original;
        return d.status === "accepted" ? d.suggested : d.original;
      });
  }, [diffs, variant]);

  const wordCount = useMemo(() => {
    const raw =
      activeTab === "cv"
        ? `${candidateName} ${candidateMeta} ${summaryText} ${diffLines.join(
            " "
          )} ${customBullets.join(" ")} ${skillsText}`
        : coverLetterText;
    return raw.trim().split(/\s+/).filter(Boolean).length;
  }, [
    activeTab,
    candidateName,
    candidateMeta,
    summaryText,
    diffLines,
    customBullets,
    skillsText,
    coverLetterText,
  ]);

  function sendAiPrompt(overrideText?: string) {
    const prompt = (overrideText ?? aiInput).trim();
    if (!prompt) return;

    setRightRailTab("ai");
    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: prompt,
    };
    const reply = createContextualAiReply(
      prompt,
      profile.targetRole || "Product Operations Lead",
      candidateName || profile.name || "Vex Candidate",
      activeTab
    );
    const botMsg: AiChatMessage = {
      id: `ai-${Date.now() + 1}`,
      ...reply,
    };

    setAiMessages((prev) => [...prev, userMsg, botMsg]);
    if (!overrideText) setAiInput("");
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 60);
  }

  function applyAiSuggestion(msgId: string) {
    const msg = aiMessages.find((m) => m.id === msgId);
    if (!msg?.suggestion) return;

    const { target, content } = msg.suggestion;
    if (target === "summary") {
      setActiveTab("cv");
      setSummaryText(content);
      setExportMessage("AI edit applied to Executive Profile on A4 sheet.");
    } else if (target === "bullet") {
      setActiveTab("cv");
      setCustomBullets((prev) => [...prev, content]);
      setExportMessage("AI bullet inserted into Experience & Key Impact.");
    } else if (target === "skills") {
      setActiveTab("cv");
      setSkillsText(content);
      setExportMessage("AI keywords updated in Core Skills & Tools.");
    } else if (target === "cover-letter") {
      setActiveTab("cover-letter");
      setCoverLetterText(content);
      setLetterApproved(false);
      setExportMessage("AI draft applied to Cover Letter manuscript.");
    }

    setAiMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.suggestion
          ? { ...m, suggestion: { ...m.suggestion, applied: true } }
          : m
      )
    );
  }

  function applyTonePreset(nextTone: "Direct" | "Analytical" | "Executive Warm") {
    setTone(nextTone);
    setLetterApproved(false);
    const role = profile.targetRole || "Product Operations Lead";
    const signoff = candidateName || profile.name || "Vex Candidate";

    if (nextTone === "Direct") {
      setCoverLetterText(
        `Dear Hiring Team,\n\nI am applying for the ${role} role at Northbridge Systems. My background centres on coordinating releases across engineering, operations, and client readiness without inflating metrics or overclaiming scope.\n\nI would welcome a focused conversation regarding how this operational discipline supports your upcoming launch cycle.\n\nSincerely,\n${signoff}`
      );
    } else if (nextTone === "Analytical") {
      setCoverLetterText(
        `Dear Hiring Team,\n\nI am writing to express interest in the ${role} position. In previous roles, I reduced coordination friction by formalising release acceptance criteria, tracking defect handoffs, and auditing stakeholder readiness before launch.\n\nAll role capabilities listed in my CV are strictly grounded in documented experience.\n\nRegards,\n${signoff}`
      );
    } else {
      setCoverLetterText(
        `Dear Northbridge Hiring Team,\n\nYour emphasis on calm, dependable operational ownership aligns closely with how I work alongside product and engineering partners. I enjoy turning complex launch dependencies into predictable routines that teams trust.\n\nThank you for considering my application.\n\nWarm regards,\n${signoff}`
      );
    }
  }

  function handleUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setExportMessage(`Loaded source manuscript: ${file.name}`);
  }

  function handleNewDraft() {
    setCandidateName(profile.name || "Vex Candidate");
    setCandidateMeta(
      `${profile.targetRole || "Product Operations Lead"} · ${
        profile.workMode || "Hybrid"
      } · ${profile.email || "candidate@vex-academia.io"}`
    );
    setSummaryText(buildInitialSummary(profile));
    setCustomBullets([
      "Coordinated bi-weekly product releases across engineering, legal compliance, and customer operations teams with zero unannounced SLA regressions.",
      "Standardised post-launch incident runbooks and cross-team handoff criteria across three core enterprise workflows.",
    ]);
    setSkillsText(buildInitialSkills(profile));
    setExportMessage("Draft reset to clean baseline.");
  }

  function handleExport(format: "PDF" | "DOCX") {
    if (activeTab === "cv" && hasBlockedUnsupported) {
      setExportMessage(
        "Blocked: resolve or reject the unverified claim in the left panel before exporting."
      );
      return;
    }
    setExportMessage(
      `Prepared 1-column ATS ${format} package from "${uploadedFileName}" (${wordCount} words).`
    );
  }

  function updateCustomBullet(idx: number, val: string) {
    setCustomBullets((prev) => prev.map((item, i) => (i === idx ? val : item)));
  }

  function addCustomBullet() {
    setCustomBullets((prev) => [
      ...prev,
      "Delivered measurable cross-functional milestone backed by attested project documentation.",
    ]);
  }

  function removeCustomBullet(idx: number) {
    setCustomBullets((prev) => prev.filter((_, i) => i !== idx));
  }

  const fontSizeClass =
    fontStep === 0
      ? "text-[12.5px]"
      : fontStep === 2
      ? "text-[14.5px]"
      : "text-[13.5px]";

  const headingFontClass =
    template === "classic"
      ? "font-sans tracking-tight font-semibold"
      : template === "executive"
      ? "font-serif-display tracking-[0.04em] uppercase"
      : "font-serif-display tracking-[-0.015em]";

  return (
    <div className="space-y-4">
      {/* Phone: focused note-style manuscript editor (same state & actions). */}
      <MobileManuscriptEditor
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variantLabel={VARIANTS.find((v) => v.id === variant)?.label || "Tailored"}
        showOriginalOnly={variant === "base"}
        wordCount={wordCount}
        atsScore={atsScore}
        candidateName={candidateName}
        onCandidateName={setCandidateName}
        candidateMeta={candidateMeta}
        onCandidateMeta={setCandidateMeta}
        summaryText={summaryText}
        onSummaryText={setSummaryText}
        diffs={diffs}
        onDecideDiff={onDecideDiff}
        customBullets={customBullets}
        onUpdateBullet={updateCustomBullet}
        onRemoveBullet={removeCustomBullet}
        onAddBullet={addCustomBullet}
        skillsText={skillsText}
        onSkillsText={setSkillsText}
        coverLetterText={coverLetterText}
        onCoverLetterText={setCoverLetterText}
        tone={tone}
        onTone={applyTonePreset}
        letterApproved={letterApproved}
        onLetterApproved={setLetterApproved}
        flags={flags}
        onResolveFlag={onResolveFlag}
        onReset={handleNewDraft}
        onExport={handleExport}
        exportMessage={exportMessage}
        aiMessages={aiMessages}
        onSendAi={(prompt) => sendAiPrompt(prompt)}
        onApplyAi={applyAiSuggestion}
      />

      {/* Desktop: full Word-style scriptorium (unchanged). */}
      <div className="hidden lg:block">
      <GreekTempleWordFrame inscription="VEX · SCRIPTORIUM">
        {/* ================================================================ */}
        {/* 0. TOP SCULPTURAL PHILOSOPHER DESK SCENE (NO BACKGROUND ROOM)     */}
        {/* ================================================================ */}
        <div className="relative overflow-hidden border-b border-[#bcae90] bg-gradient-to-b from-[#ebe2cc] via-[#f6f1e4] to-[#f3ecdc] px-5 pt-4 sm:px-8 sm:pt-5">
          {/* Soft Architrave Skylight Ambient Wash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#3a2d1d]/18 to-transparent"
          />

          <div className="relative flex flex-col items-center justify-between gap-4 lg:flex-row lg:items-end">
            {/* Clean Inscription Title Sitting Directly on Limestone Surface */}
            <div className="w-full pb-4 lg:w-auto lg:max-w-[44%] lg:pb-7">
              <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6d5938]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                Atelier · Grounded Manuscript Station
              </div>
              <h2 className="mt-1.5 font-serif-display text-[26px] leading-[1.12] tracking-[-0.015em] text-[#212d3d] sm:text-[31px]">
                Compose with Clarity &amp; Proof.
              </h2>
              <p className="mt-1.5 max-lg:hidden text-[12.5px] leading-relaxed text-[#524634]">
                Single-column A4 manuscript synced with tracked CV diffs, source
                evidence, and your docked AI Scribe.
              </p>
            </div>

            {/* Background-Free Carved Marble Philosopher + Table + Open Book */}
            <div className="relative hidden w-full justify-center lg:flex lg:w-[56%] lg:justify-end">
              <img
                src="/images/philosopher-cutout.png?v=2"
                alt="Limestone philosopher seated at carved table reading open manuscript"
                className="pointer-events-none block h-[185px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_14px_18px_rgba(45,35,20,0.26)] sm:h-[225px] lg:h-[245px]"
              />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 1. ENGRAVED MICROSOFT WORD RIBBON WITH COOL BEVELED BUTTONS      */}
        {/* ================================================================ */}
        <div className="border-b-2 border-[#a89878] bg-gradient-to-b from-[#f3ecdc] to-[#e7dec7]">
          {/* Upper Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c9bba0] px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Segmented Document Switcher */}
              <div className="inline-flex rounded-[8px] border border-[#9d8b69] bg-[#ebe2cc] p-0.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("cv");
                    setExportMessage("");
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-[6px] px-4 py-1.5 text-[12px] font-semibold tracking-wide transition-all cursor-pointer ${
                    activeTab === "cv"
                      ? "bg-gradient-to-b from-[#2f4056] to-[#1a2432] text-[#faf6ed] shadow-[0_2px_6px_rgba(26,36,50,0.3)]"
                      : "text-[#433626] hover:bg-[#faf6ed]/70"
                  }`}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3.5 2h6.2L13 5.3V14H3.5V2z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
                    <path d="M9.5 2v3.5H13M5.5 8h5M5.5 10.7h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  CV Document
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("cover-letter");
                    setExportMessage("");
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-[6px] px-4 py-1.5 text-[12px] font-semibold tracking-wide transition-all cursor-pointer ${
                    activeTab === "cover-letter"
                      ? "bg-gradient-to-b from-[#2f4056] to-[#1a2432] text-[#faf6ed] shadow-[0_2px_6px_rgba(26,36,50,0.3)]"
                      : "text-[#433626] hover:bg-[#faf6ed]/70"
                  }`}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="2" y="3" width="12" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.35" />
                    <path d="M2.5 4.2L8 8.6l5.5-4.4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
                  </svg>
                  Cover Letter
                </button>
              </div>

              <label className={BTN_STONE}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 10.5V2.5M8 2.5L4.8 5.7M8 2.5L11.2 5.7M2.5 11.5V13.5H13.5V11.5"
                    stroke="currentColor"
                    strokeWidth="1.45"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Upload CV
                <input id="documentsstudioview-input-1" name="documentsstudioview-input-1" aria-label="documentsstudioview input 1"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleUploadChange}
                  className="hidden"
                />
              </label>

              <button type="button" onClick={handleNewDraft} className={BTN_STONE}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M13 8a5 5 0 1 1-1.3-3.35M13 2.8v2.5h-2.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Reset Draft
              </button>

              <Link href="/dashboard/documents/resume/res-main" className={BTN_STONE}>
                Full CV Editor
              </Link>
              <Link href="/dashboard/documents/resume/res-main/preview" className={BTN_STONE}>
                Print Preview
              </Link>
              <Link href="/dashboard/documents/cover-letters" className={BTN_STONE}>
                Cicero Cover Letters
              </Link>
              <button
                type="button"
                onClick={() => {
                  setRightRailTab("ai");
                  aiInputRef.current?.focus();
                }}
                className={BTN_BRASS}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 1.8l1.35 3.65L13 6.8l-3.65 1.35L8 11.8 6.65 8.15 3 6.8l3.65-1.35L8 1.8z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
                Ask Vex AI
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-[7px] border px-3 py-1.5 font-mono text-[11px] font-semibold shadow-inner ${
                  hasBlockedUnsupported
                    ? "border-amber-700/45 bg-amber-100 text-amber-950"
                    : "border-emerald-800/40 bg-emerald-100/90 text-emerald-950"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    hasBlockedUnsupported ? "bg-amber-600" : "bg-emerald-600"
                  }`}
                />
                ATS {atsScore}%
              </span>

              <button
                type="button"
                onClick={() => handleExport("DOCX")}
                className={BTN_STONE}
              >
                Export DOCX
              </button>
              <button
                type="button"
                onClick={() => handleExport("PDF")}
                className={BTN_NAVY}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 2.5v7.5M8 10l-3-3M8 10l3-3M2.5 11.5v2h11v-2"
                    stroke="currentColor"
                    strokeWidth="1.45"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Export PDF
              </button>
            </div>
          </div>

          {/* Lower Typography, Version & Canvas Toolbar Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-[11.5px] text-[#3a2f1f] sm:px-5">
            <div className="flex flex-wrap items-center gap-3.5">
              {/* Version Selector */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6a5c44]">
                  Version
                </span>
                <div className="inline-flex rounded-[7px] border border-[#a89674] bg-[#f8f3e6] p-0.5">
                  {VARIANTS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariant(v.id)}
                      className={`rounded-[5px] px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                        variant === v.id
                          ? "bg-[#332719] text-[#faf6ed] shadow-sm"
                          : "text-[#433626] hover:bg-[#e7dec6]"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden h-5 w-px bg-[#b8a786] sm:block" />

              {/* Layout Style */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6a5c44]">
                  Layout
                </span>
                <div className="inline-flex rounded-[7px] border border-[#a89674] bg-[#f8f3e6] p-0.5">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setTemplate(tpl.id)}
                      className={`rounded-[5px] px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                        template === tpl.id
                          ? "bg-[#332719] text-[#faf6ed] shadow-sm"
                          : "text-[#433626] hover:bg-[#e7dec6]"
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Word View & Scale Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-[7px] border border-[#a89674] bg-[#faf6ed] shadow-[0_1.5px_0_#9b8967]">
                <button
                  type="button"
                  onClick={() =>
                    setFontStep((s) => (s === 0 ? 0 : ((s - 1) as 0 | 1 | 2)))
                  }
                  className="px-2.5 py-1 font-serif-display text-[12px] text-[#332719] hover:bg-[#e7dec6] cursor-pointer"
                  title="Decrease base text size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFontStep((s) => (s === 2 ? 2 : ((s + 1) as 0 | 1 | 2)))
                  }
                  className="border-l border-[#cfc3a9] px-2.5 py-1 font-serif-display text-[12px] text-[#332719] hover:bg-[#e7dec6] cursor-pointer"
                  title="Increase base text size"
                >
                  A+
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowRuler((r) => !r)}
                className={`rounded-[7px] border px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                  showRuler
                    ? "border-[#2a2117] bg-gradient-to-b from-[#433626] to-[#2c2317] text-[#faf6ed] shadow-[0_2px_0_#19130b]"
                    : "border-[#a89674] bg-[#faf6ed] text-[#433626] shadow-[0_2px_0_#9b8967] hover:bg-[#e7dec6]"
                }`}
              >
                Ruler
              </button>

              <button
                type="button"
                onClick={() => setShowGuides((g) => !g)}
                className={`rounded-[7px] border px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                  showGuides
                    ? "border-[#2a2117] bg-gradient-to-b from-[#433626] to-[#2c2317] text-[#faf6ed] shadow-[0_2px_0_#19130b]"
                    : "border-[#a89674] bg-[#faf6ed] text-[#433626] shadow-[0_2px_0_#9b8967] hover:bg-[#e7dec6]"
                }`}
              >
                Guides
              </button>

              <div className="inline-flex rounded-[7px] border border-[#a89674] bg-[#f8f3e6] p-0.5 font-mono text-[10.5px]">
                {([95, 100, 115] as const).map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZoomPct(z)}
                    className={`rounded-[5px] px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                      zoomPct === z
                        ? "bg-[#212d3d] text-[#faf6ed]"
                        : "text-[#433626] hover:bg-[#e7dec6]"
                    }`}
                  >
                    {z}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {exportMessage && (
            <div
              className={`border-t px-5 py-2 text-[11.5px] font-medium ${
                exportMessage.startsWith("Blocked")
                  ? "border-amber-700/30 bg-amber-100/95 text-amber-950"
                  : "border-[#c9bba0] bg-[#ece3cb] text-[#212d3d]"
              }`}
            >
              {exportMessage}
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* 2. GRAND DOCKED 3-COLUMN WORD STATION (RAILS + HUGE A4 PAGE)     */}
        {/* ================================================================ */}
        <div className="flex flex-col xl:flex-row">
          {/* LEFT DOCKED SIDEBAR RAIL — Outline + Diffs / Tone */}
          <aside className="flex w-full shrink-0 flex-col border-b border-[#bcae90] bg-[#f4ede0] xl:w-[236px] 2xl:w-[264px] xl:border-b-0 xl:border-r">
            {/* Active Source Manuscript Header */}
            <div className="border-b border-[#cfc3a9] px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#75664e]">
                Active Manuscript
              </div>
              <div className="mt-1 truncate text-[13px] font-semibold text-[#212d3d]">
                {uploadedFileName}
              </div>
              <div className="mt-0.5 text-[11px] text-[#5e523f]">
                {activeTab === "cv" ? "Curriculum Vitae (A4)" : "Cover Letter (A4)"}
              </div>
            </div>

            {/* Quick Section Navigator */}
            {activeTab === "cv" && (
              <div className="border-b border-[#cfc3a9] px-4 py-3">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#75664e]">
                  Document Outline
                </div>
                <div className="divide-y divide-[#dfd5bd] overflow-hidden rounded-[6px] border border-[#bfa982] bg-[#faf6ed]">
                  {[
                    {
                      num: "01",
                      label: "Candidate Header",
                      onClick: () => headerRef.current?.focus(),
                    },
                    {
                      num: "02",
                      label: "Executive Profile",
                      onClick: () => summaryRef.current?.focus(),
                    },
                    {
                      num: "03",
                      label: "Experience & Diffs",
                      onClick: () =>
                        experienceRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        }),
                    },
                    {
                      num: "04",
                      label: "Core Skills & Tools",
                      onClick: () => skillsRef.current?.focus(),
                    },
                  ].map((item) => (
                    <button
                      key={item.num}
                      type="button"
                      onClick={item.onClick}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-[11.5px] font-medium text-[#332719] transition-colors hover:bg-[#efe5cf] cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-semibold text-[#7c6c51]">
                          {item.num}
                        </span>
                        <span>{item.label}</span>
                      </span>
                      <span className="font-mono text-[10px] text-[#8c7b5e]">
                        Jump
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tracked Revisions OR Cover Letter Controls */}
            {activeTab === "cv" ? (
              <div className="flex-1 divide-y divide-[#cfc3a9]">
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#75664e]">
                    Tracked Revisions ({diffs.length})
                  </span>
                  <span className="font-mono text-[9.5px] font-semibold text-[#5e523f]">
                    1-Col Verified
                  </span>
                </div>

                {diffs.map((diff) => {
                  const statusLabel =
                    diff.status === "accepted"
                      ? "Applied"
                      : diff.status === "rejected"
                      ? diff.hasUnsupportedClaim
                        ? "Blocked"
                        : "Original"
                      : diff.hasUnsupportedClaim
                      ? "Needs Audit"
                      : "Pending";

                  return (
                    <div key={diff.id} className="space-y-2.5 px-4 py-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] font-semibold text-[#212d3d]">
                          {diff.section}
                        </span>
                        <span
                          className={`rounded-[5px] border px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase ${
                            diff.hasUnsupportedClaim && diff.status !== "rejected"
                              ? "border-amber-700/40 bg-amber-100 text-amber-900"
                              : diff.status === "accepted"
                              ? "border-emerald-800/35 bg-emerald-100 text-emerald-900"
                              : "border-[#bcae90] bg-[#faf6ed] text-[#5e523f]"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="border-l-2 border-rose-700/50 pl-2.5 text-[11px] leading-snug text-[#6a5d47] line-through">
                        {diff.original}
                      </div>

                      <div className="border-l-2 border-emerald-700/75 bg-[#faf6ed] p-2.5 text-[11px] leading-snug text-[#212d3d]">
                        {diff.suggested}
                      </div>

                      <div className="text-[10.5px] leading-snug text-[#6b5d47]">
                        Source: <span className="font-medium">{diff.sourceFact}</span>
                      </div>

                      {diff.hasUnsupportedClaim && diff.unsupportedNote && (
                        <div className="rounded-[5px] border border-amber-700/35 bg-amber-100/85 p-2 text-[10.5px] leading-snug text-amber-950">
                          {diff.unsupportedNote}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => onDecideDiff(diff.id, "accepted")}
                          className={`flex-1 rounded-[6px] border px-2.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                            diff.status === "accepted"
                              ? "border-emerald-900 bg-gradient-to-b from-emerald-700 to-emerald-900 text-white shadow-[0_2px_0_#064e3b]"
                              : "border-[#9d8b69] bg-gradient-to-b from-[#fffdf7] to-[#e9dec6] text-[#212d3d] shadow-[0_2px_0_#9b8967] hover:from-[#ffffff] hover:to-[#f0e5ce] active:translate-y-[1px]"
                          }`}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => onDecideDiff(diff.id, "rejected")}
                          className={`flex-1 rounded-[6px] border px-2.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                            diff.status === "rejected"
                              ? "border-rose-950 bg-gradient-to-b from-rose-800 to-rose-950 text-white shadow-[0_2px_0_#4c0519]"
                              : "border-[#9d8b69] bg-gradient-to-b from-[#fffdf7] to-[#e9dec6] text-[#433626] shadow-[0_2px_0_#9b8967] hover:from-[#ffffff] hover:to-[#f0e5ce] active:translate-y-[1px]"
                          }`}
                        >
                          {diff.hasUnsupportedClaim ? "Reject Claim" : "Keep Orig"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 divide-y divide-[#cfc3a9]">
                <div className="px-4 py-3.5">
                  <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#75664e]">
                    Voice & Tone Presets
                  </div>
                  <div className="space-y-2">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => applyTonePreset(t)}
                        className={`flex w-full items-center justify-between rounded-[7px] border px-3 py-2 text-left text-[11.5px] font-semibold transition-all cursor-pointer ${
                          tone === t
                            ? "border-[#1d2735] bg-gradient-to-b from-[#2f4056] to-[#1a2432] text-[#faf6ed] shadow-[0_2px_0_#0f1620]"
                            : "border-[#9d8b69] bg-gradient-to-b from-[#fffdf7] to-[#e9dec6] text-[#332719] shadow-[0_2px_0_#9b8967] hover:from-[#ffffff] hover:to-[#f0e5ce]"
                        }`}
                      >
                        <span>{t}</span>
                        {tone === t && <CheckIcon className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 px-4 py-3.5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#75664e]">
                    Grounded Role Facts
                  </div>
                  <div className="border-l-2 border-[#212d3d] bg-[#faf6ed] p-2.5 text-[11px] leading-relaxed text-[#332719]">
                    Northbridge Systems · Cross-functional launch coordination &
                    release governance.
                  </div>
                  <div className="border-l-2 border-[#7c6c51] bg-[#faf6ed] p-2.5 text-[11px] leading-relaxed text-[#332719]">
                    Strict Truth Mode: SQL metrics phrased accurately without
                    exaggerated ownership.
                  </div>
                </div>

                <div className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => setLetterApproved((v) => !v)}
                    className={`w-full ${letterApproved ? "inline-flex items-center justify-center gap-1.5 rounded-[7px] border border-emerald-950 bg-gradient-to-b from-emerald-700 to-emerald-900 px-4 py-2 text-[11.5px] font-semibold text-white shadow-[0_2.5px_0_#064e3b] cursor-pointer" : BTN_NAVY}`}
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                    {letterApproved
                      ? "Approved for Applications"
                      : "Approve Final Draft"}
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* CENTER BIGGER EDITABLE MICROSOFT WORD A4 CANVAS */}
          <main className="flex min-w-0 flex-1 flex-col items-center bg-[#dbd0b5] px-4 py-6 sm:px-8 sm:py-8">
            {/* Word A4 Inch Ruler (210mm = 8.27in) */}
            {showRuler && (
              <div
                className="mb-3 hidden w-full max-w-[660px] items-end justify-between rounded-[4px] border border-[#aa9a7a] bg-[#f8f3e6] px-5 py-1.5 font-mono text-[9.5px] text-[#6d5f47] shadow-sm sm:flex"
                style={{
                  transform: `scale(${zoomPct / 100})`,
                  transformOrigin: "bottom center",
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((inch) => (
                  <div key={inch} className="flex flex-1 flex-col items-start">
                    <span className="leading-none">{inch}&quot;</span>
                    <div className="mt-1 flex w-full items-end justify-between pr-2">
                      <span className="h-2.5 w-px bg-[#433626]" />
                      <span className="h-1 w-px bg-[#9c8c71]" />
                      <span className="h-1.5 w-px bg-[#7c6c51]" />
                      <span className="h-1 w-px bg-[#9c8c71]" />
                    </div>
                  </div>
                ))}
                <span className="text-[9px] font-semibold text-[#433626]">
                  8.27&quot; (A4)
                </span>
              </div>
            )}

            {/* Authentic ISO A4 Portrait Sheet (210mm x 297mm = aspect 210/297) */}
            <div
              className="relative w-full max-w-[660px] origin-top transition-transform duration-150"
              style={{
                transform: `scale(${zoomPct / 100})`,
              }}
            >
              <div
                className={`relative aspect-[210/297] w-full overflow-y-auto border border-[#b2a282] border-b-[3px] border-b-[#d7ccb2] bg-[#fffef9] px-7 py-9 text-[#1f1b16] shadow-[0_1px_1px_rgba(0,0,0,0.06),0_10px_22px_rgba(33,45,61,0.13),0_26px_54px_rgba(33,45,61,0.16)] sm:px-12 sm:py-11 ${fontSizeClass}`}
              >
                {showGuides && (
                  <div className="pointer-events-none absolute inset-7 border border-dashed border-[#bcae90]/80" />
                )}

                {activeTab === "cv" ? (
                  <div className="relative space-y-6">
                    {/* Editable Candidate Header */}
                    <div
                      className={`border-b-2 border-[#212d3d] pb-4 ${
                        template === "classic" ? "text-center" : "text-left"
                      }`}
                    >
                      <input id="documentsstudioview-input-2" name="documentsstudioview-input-2"
                        ref={headerRef}
                        type="text"
                        aria-label="Candidate Name"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className={`w-full bg-transparent text-[28px] text-[#181512] outline-none focus:bg-[#f4ede0]/60 ${headingFontClass} ${
                          template === "classic" ? "text-center" : "text-left"
                        }`}
                      />
                      <input id="documentsstudioview-input-3" name="documentsstudioview-input-3"
                        type="text"
                        aria-label="Target Role and Contact Line"
                        value={candidateMeta}
                        onChange={(e) => setCandidateMeta(e.target.value)}
                        className={`mt-1.5 w-full bg-transparent font-mono text-[11px] uppercase tracking-[0.09em] text-[#5e523f] outline-none focus:bg-[#f4ede0]/60 ${
                          template === "classic" ? "text-center" : "text-left"
                        }`}
                      />
                    </div>

                    {/* Executive Profile */}
                    <section>
                      <div className="mb-2 flex items-center justify-between border-b border-[#d6c9ae] pb-1">
                        <h3
                          className={`text-[13px] tracking-[0.14em] uppercase text-[#212d3d] ${headingFontClass}`}
                        >
                          Executive Profile
                        </h3>
                        <button
                          type="button"
                          onClick={() =>
                            sendAiPrompt("Tighten my Executive Profile summary for seniority")
                          }
                          className="rounded-[5px] border border-[#bcae90] bg-[#faf6ed] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#433626] transition-colors hover:border-[#7c6131] hover:bg-[#efe3c8] cursor-pointer"
                        >
                          AI Polish
                        </button>
                      </div>
                      <textarea id="documentsstudioview-textarea-4" name="documentsstudioview-textarea-4"
                        ref={summaryRef}
                        rows={4}
                        aria-label="Executive Profile Summary"
                        value={summaryText}
                        onChange={(e) => setSummaryText(e.target.value)}
                        className="w-full resize-none bg-transparent leading-relaxed text-[#25211b] outline-none focus:bg-[#f7f2e5]/75"
                      />
                    </section>

                    {/* Experience & Impact Bullets */}
                    <section ref={experienceRef}>
                      <div className="mb-2.5 flex items-center justify-between border-b border-[#d6c9ae] pb-1.5">
                        <h3
                          className={`text-[13px] tracking-[0.14em] uppercase text-[#212d3d] ${headingFontClass}`}
                        >
                          Experience & Key Impact
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              sendAiPrompt("Draft one stronger impact bullet for release governance")
                            }
                            className="rounded-[5px] border border-[#bcae90] bg-[#faf6ed] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#433626] transition-colors hover:border-[#7c6131] hover:bg-[#efe3c8] cursor-pointer"
                          >
                            + AI Suggest Bullet
                          </button>
                          <button
                            type="button"
                            onClick={addCustomBullet}
                            className="rounded-[5px] border border-[#9d8b69] bg-gradient-to-b from-[#fffdf7] to-[#e9dec6] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#212d3d] shadow-[0_1.5px_0_#9b8967] hover:from-[#ffffff] cursor-pointer"
                          >
                            + Add Bullet
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {diffLines.map((line, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#212d3d]" />
                            <p className="flex-1 leading-relaxed text-[#1f1b16]">
                              {line}
                            </p>
                          </div>
                        ))}

                        {customBullets.map((bullet, idx) => (
                          <div
                            key={idx}
                            className="group flex items-start gap-2.5"
                          >
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-[#7c6c51]" />
                            <textarea id="documentsstudioview-textarea-5" name="documentsstudioview-textarea-5"
                              rows={2}
                              aria-label={`Experience bullet ${idx + 1}`}
                              value={bullet}
                              onChange={(e) =>
                                updateCustomBullet(idx, e.target.value)
                              }
                              className="flex-1 resize-none bg-transparent leading-relaxed text-[#1f1b16] outline-none focus:bg-[#f7f2e5]/75"
                            />
                            {customBullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCustomBullet(idx)}
                                className="mt-1 rounded border border-[#cfc3a9] px-1.5 py-0.5 font-mono text-[10px] text-[#6d5f47] opacity-0 transition-opacity group-hover:opacity-100 hover:text-rose-800 cursor-pointer"
                                title="Remove bullet"
                              >
                                x
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Attested Core Competencies */}
                    <section>
                      <div className="mb-2 flex items-center justify-between border-b border-[#d6c9ae] pb-1">
                        <h3
                          className={`text-[13px] tracking-[0.14em] uppercase text-[#212d3d] ${headingFontClass}`}
                        >
                          Core Skills & Tools
                        </h3>
                        <button
                          type="button"
                          onClick={() =>
                            sendAiPrompt("Refine my Core Skills line for ATS keyword coverage")
                          }
                          className="rounded-[5px] border border-[#bcae90] bg-[#faf6ed] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#433626] transition-colors hover:border-[#7c6131] hover:bg-[#efe3c8] cursor-pointer"
                        >
                          AI Keywords
                        </button>
                      </div>
                      <input id="documentsstudioview-input-6" name="documentsstudioview-input-6"
                        ref={skillsRef}
                        type="text"
                        aria-label="Core Skills and Tools"
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        className="w-full bg-transparent leading-relaxed text-[#25211b] outline-none focus:bg-[#f7f2e5]/75"
                      />
                    </section>

                    {/* Footer Attribution Stamp inside Sheet */}
                    <div className="flex flex-wrap items-center justify-between border-t border-[#e5dcc6] pt-4 font-mono text-[10px] text-[#7c6c51]">
                      <span>
                        VARIANT:{" "}
                        {VARIANTS.find((v) => v.id === variant)?.label} ·{" "}
                        {TEMPLATES.find((t) => t.id === template)?.label}
                      </span>
                      <span>
                        {hasBlockedUnsupported
                          ? "AUDIT REQUIRED BEFORE EXPORT"
                          : "TRUTH-VERIFIED SINGLE COLUMN"}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* COVER LETTER A4 WORD SHEET */
                  <div className="relative flex h-full flex-col space-y-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-[#212d3d] pb-4">
                      <div>
                        <h3
                          className={`text-[26px] text-[#181512] ${headingFontClass}`}
                        >
                          {candidateName}
                        </h3>
                        <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.09em] text-[#5e523f]">
                          {candidateMeta}
                        </p>
                      </div>
                      <span
                        className={`rounded-[5px] border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase ${
                          letterApproved
                            ? "border-emerald-800/40 bg-emerald-100 text-emerald-900"
                            : "border-[#bcae90] bg-[#faf6ed] text-[#5e523f]"
                        }`}
                      >
                        {letterApproved ? "Approved Final" : `Tone: ${tone}`}
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-[#5e523f]">
                      TO: HIRING TEAM, NORTHBRIDGE SYSTEMS · RE:{" "}
                      {(profile.targetRole || "PRODUCT OPERATIONS LEAD").toUpperCase()}
                    </div>

                    <textarea id="documentsstudioview-textarea-7" name="documentsstudioview-textarea-7"
                      rows={21}
                      aria-label="Cover Letter Body"
                      value={coverLetterText}
                      onChange={(e) => {
                        setCoverLetterText(e.target.value);
                        setLetterApproved(false);
                      }}
                      className="w-full flex-1 resize-none bg-transparent leading-[1.75] text-[#1f1b16] outline-none focus:bg-[#f7f2e5]/65"
                    />
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* RIGHT DOCKED SIDEBAR RAIL — TALK WITH AI + TRUTH AUDIT */}
          <aside className="flex w-full shrink-0 flex-col border-t border-[#bcae90] bg-[#f4ede0] xl:w-[252px] 2xl:w-[280px] xl:border-t-0 xl:border-l">
            {/* Persistent ATS Meter & Rail Mode Switcher */}
            <div className="border-b border-[#cfc3a9] px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#75664e]">
                  Workstation Copilot
                </span>
                <span className="font-mono text-[11.5px] font-semibold text-[#212d3d]">
                  ATS {atsScore}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#dcd0b6]">
                <div
                  className={`h-full transition-all duration-300 ${
                    hasBlockedUnsupported ? "bg-amber-700" : "bg-emerald-700"
                  }`}
                  style={{ width: `${atsScore}%` }}
                />
              </div>

              {/* Sculpted Two-Tab Toggle: Talk to AI vs Audit & Stats */}
              <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-[8px] border border-[#a89674] bg-[#e8dec6] p-1">
                <button
                  type="button"
                  onClick={() => setRightRailTab("ai")}
                  className={`rounded-[6px] px-2.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                    rightRailTab === "ai"
                      ? "bg-gradient-to-b from-[#2f4056] to-[#1a2432] text-[#faf6ed] shadow-sm"
                      : "text-[#433626] hover:bg-[#faf6ed]/70"
                  }`}
                >
                  Talk to AI
                </button>
                <button
                  type="button"
                  onClick={() => setRightRailTab("audit")}
                  className={`rounded-[6px] px-2.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                    rightRailTab === "audit"
                      ? "bg-gradient-to-b from-[#2f4056] to-[#1a2432] text-[#faf6ed] shadow-sm"
                      : "text-[#433626] hover:bg-[#faf6ed]/70"
                  }`}
                >
                  Audit ({unresolvedCount})
                </button>
              </div>
            </div>

            {rightRailTab === "ai" ? (
              /* INTERACTIVE AI SCRIBE SIDE CHAT */
              <div className="flex min-h-[540px] flex-1 flex-col justify-between">
                {/* Prompt Quick Chips */}
                <div className="border-b border-[#cfc3a9] px-4 py-2.5">
                  <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#75664e]">
                    Quick AI Instructions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Sharpen Summary", prompt: "Tighten my summary to be sharper and senior" },
                      { label: "Upgrade Bullets", prompt: "Draft a stronger impact bullet for my CV" },
                      { label: "ATS Keywords", prompt: "Optimize core skills for ATS keywords" },
                      { label: "Polish Letter", prompt: "Rewrite my cover letter opener cleanly" },
                    ].map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => sendAiPrompt(chip.prompt)}
                        className="rounded-[6px] border border-[#9d8b69] bg-gradient-to-b from-[#fffdf7] to-[#ebdfc6] px-2.5 py-1 text-[10.5px] font-semibold text-[#2d2316] shadow-[0_1.5px_0_#9b8967] transition-all hover:border-[#6d5938] hover:from-[#ffffff] active:translate-y-[1px] cursor-pointer"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversation Thread */}
                <div
                  data-lenis-prevent
                  className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
                  style={{ maxHeight: "520px" }}
                >
                  {aiMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-[8px] border p-3 text-[11.5px] leading-relaxed ${
                        msg.role === "user"
                          ? "ml-4 border-[#1d2735] bg-[#212d3d] text-[#faf6ed]"
                          : "mr-2 border-[#bfa982] bg-[#faf6ed] text-[#262018] shadow-sm"
                      }`}
                    >
                      <div
                        className={`mb-1 font-mono text-[9.5px] uppercase tracking-wider ${
                          msg.role === "user"
                            ? "text-[#faf6ed]/70"
                            : "text-[#7a643c]"
                        }`}
                      >
                        {msg.role === "user" ? "You" : "Vex AI Scribe"}
                      </div>
                      <p>{msg.text}</p>

                      {msg.suggestion && (
                        <div className="mt-2.5 space-y-2 border-t border-[#ddd1b7] pt-2">
                          <div className="rounded-[6px] border border-[#cfc3a9] bg-[#f4ede0] p-2 text-[11px] leading-snug text-[#1f1b16]">
                            {msg.suggestion.content}
                          </div>
                          <button
                            type="button"
                            onClick={() => applyAiSuggestion(msg.id)}
                            className={`w-full ${
                              msg.suggestion.applied
                                ? "inline-flex items-center justify-center gap-1.5 rounded-[6px] border border-emerald-800 bg-emerald-800 px-3 py-1.5 text-[11px] font-semibold text-white cursor-default"
                                : BTN_NAVY
                            }`}
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                            {msg.suggestion.applied
                              ? "Applied to Word Sheet"
                              : msg.suggestion.label}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Bottom Write-to-AI Composer */}
                <div className="border-t border-[#bfa982] bg-[#ece3cd] p-3.5">
                  <label
                    htmlFor="ai-scribe-composer"
                    className="mb-1.5 block font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#6d5f47]"
                  >
                    Write Instructions to AI
                  </label>
                  <textarea name="documentsstudioview-textarea-8" aria-label="documentsstudioview textarea 8"
                    id="ai-scribe-composer"
                    ref={aiInputRef}
                    rows={3}
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendAiPrompt();
                      }
                    }}
                    placeholder="Ask AI to rewrite summary, sharpen a bullet, tailor tone, or add skills..."
                    className="w-full resize-none rounded-[7px] border border-[#a89674] bg-[#fffef9] p-2.5 text-[12px] leading-snug text-[#1f1b16] placeholder:text-[#8c7e65] outline-none focus:border-[#212d3d]"
                  />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[9.5px] text-[#6d5f47]">
                      Enter to send
                    </span>
                    <button
                      type="button"
                      onClick={() => sendAiPrompt()}
                      className={BTN_NAVY}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M14 2L7.2 8.8M14 2l-4.2 12-2.6-5.2L2 6.2 14 2z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Send to AI
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* TRUTH AUDIT & DOCUMENT STATISTICS VIEW */
              <div className="flex-1 divide-y divide-[#cfc3a9]">
                {hasBlockedUnsupported && (
                  <div className="bg-amber-100/85 px-4 py-3 text-[11px] leading-snug text-amber-950">
                    Unsupported claim remains pending in Tracked Revisions.
                    Reject or verify before exporting.
                  </div>
                )}

                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#75664e]">
                    Audit Flags ({unresolvedCount} open)
                  </span>
                </div>

                {flags.map((flag) => (
                  <div
                    key={flag.id}
                    className={`space-y-2 px-4 py-3.5 ${
                      flag.resolved ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-semibold uppercase text-[#5e523f]">
                        {flag.lineRef}
                      </span>
                      <span
                        className={`rounded-[5px] border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase ${
                          flag.resolved
                            ? "border-emerald-800/35 bg-emerald-100 text-emerald-900"
                            : flag.type === "Unsupported claim"
                            ? "border-rose-800/35 bg-rose-100 text-rose-900"
                            : "border-amber-700/35 bg-amber-100 text-amber-900"
                        }`}
                      >
                        {flag.resolved ? "Resolved" : flag.type}
                      </span>
                    </div>

                    <p className="text-[11.5px] font-medium leading-snug text-[#212d3d]">
                      {flag.message}
                    </p>
                    <p className="text-[11px] leading-snug text-[#625440]">
                      Fix: {flag.suggestion}
                    </p>

                    {!flag.resolved && (
                      <button
                        type="button"
                        onClick={() => onResolveFlag(flag.id)}
                        className={BTN_STONE}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                ))}

                <div className="px-4 py-3.5">
                  <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#75664e]">
                    Page Statistics
                  </div>
                  <dl className="space-y-1.5 text-[11.5px]">
                    <div className="flex justify-between">
                      <dt className="text-[#625440]">Word count</dt>
                      <dd className="font-mono font-semibold text-[#212d3d]">
                        {wordCount}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#625440]">Columns</dt>
                      <dd className="font-mono font-semibold text-[#212d3d]">
                        1-Col ATS
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#625440]">Page format</dt>
                      <dd className="font-mono font-semibold text-[#212d3d]">
                        A4 Print
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#625440]">Open flags</dt>
                      <dd className="font-mono font-semibold text-[#212d3d]">
                        {unresolvedCount}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* ================================================================ */}
        {/* 3. BOTTOM MICROSOFT WORD STATUS BAR (#212d3d)                    */}
        {/* ================================================================ */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#433626] bg-[#212d3d] px-5 py-2 font-mono text-[10.5px] text-[#faf6ed]">
          <div className="flex flex-wrap items-center gap-3">
            <span>Page 1 of 1</span>
            <span className="text-[#faf6ed]/40">|</span>
            <span>{wordCount} words</span>
            <span className="text-[#faf6ed]/40">|</span>
            <span>{unresolvedCount} audit flags</span>
            <span className="hidden text-[#faf6ed]/40 sm:inline">|</span>
            <span className="hidden sm:inline">1-Column ATS Verified</span>
          </div>
          <div className="flex items-center gap-3 text-[#faf6ed]/85">
            <span className="max-w-[210px] truncate">{uploadedFileName}</span>
            <span>{zoomPct}%</span>
          </div>
        </div>
      </GreekTempleWordFrame>
      </div>
    </div>
  );
}
