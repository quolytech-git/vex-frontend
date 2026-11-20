"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { CvDiffSuggestion, CvQualityFlag } from "@/data/dashboard";
import MobileSheet from "./MobileSheet";

/* ------------------------------------------------------------------ */
/*  Phone-only editor for the CV & cover letter.                       */
/*  Pure view: every value and action comes from DocumentsStudioView,  */
/*  so the desktop editor and this one share exactly the same logic.   */
/* ------------------------------------------------------------------ */

export interface MobileAiMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  suggestion?: { label: string; content: string; applied?: boolean };
}

type Tone = "Direct" | "Analytical" | "Executive Warm";

interface Props {
  activeTab: "cv" | "cover-letter";
  onTabChange: (tab: "cv" | "cover-letter") => void;
  variantLabel: string;
  showOriginalOnly: boolean;
  wordCount: number;
  atsScore: number;

  candidateName: string;
  onCandidateName: (v: string) => void;
  candidateMeta: string;
  onCandidateMeta: (v: string) => void;
  summaryText: string;
  onSummaryText: (v: string) => void;
  diffs: CvDiffSuggestion[];
  onDecideDiff: (diffId: string, decision: "accepted" | "rejected") => void;
  customBullets: string[];
  onUpdateBullet: (idx: number, v: string) => void;
  onRemoveBullet: (idx: number) => void;
  onAddBullet: () => void;
  skillsText: string;
  onSkillsText: (v: string) => void;

  coverLetterText: string;
  onCoverLetterText: (v: string) => void;
  tone: Tone;
  onTone: (t: Tone) => void;
  letterApproved: boolean;
  onLetterApproved: (v: boolean) => void;

  flags: CvQualityFlag[];
  onResolveFlag: (flagId: string) => void;

  onReset: () => void;
  onExport: (format: "PDF" | "DOCX") => void;
  exportMessage: string;

  aiMessages: MobileAiMessage[];
  onSendAi: (prompt: string) => void;
  onApplyAi: (msgId: string) => void;
}

type Highlight = "none" | "suggestion" | "risk";

interface Block {
  key: string;
  section: string; // gutter label, shown on the first block of a section
  sectionCode: string;
  text: string;
  style: "name" | "meta" | "body";
  highlight: Highlight;
  diff?: CvDiffSuggestion;
  edit?: (v: string) => void;
  remove?: () => void;
}

const TONES: Tone[] = ["Direct", "Analytical", "Executive Warm"];

const QUICK_PROMPTS = {
  cv: [
    "Tighten my Executive Profile summary for seniority",
    "Refine my Core Skills line for ATS keyword coverage",
    "Draft one stronger impact bullet for release governance",
  ],
  "cover-letter": [
    "Rewrite my cover letter opener",
    "Make the letter more concise",
    "Draft a sharper cover letter for this role",
  ],
} as const;

function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
        </svg>
      );
    case "share":
      return (
        <svg {...common}>
          <path d="M12 3v12M8 7l4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
          <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
        </svg>
      );
    case "send":
      return (
        <svg {...common}>
          <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function MobileManuscriptEditor(p: Props) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isCv = p.activeTab === "cv";
  const unresolvedFlags = p.flags.filter((f) => !f.resolved);
  const pendingDiffs = p.diffs.filter((d) => d.status === "pending");
  const riskDiffs = pendingDiffs.filter((d) => d.hasUnsupportedClaim);

  // Surface parent status messages (export, AI applied…) as a toast.
  useEffect(() => {
    if (p.exportMessage) showToast(p.exportMessage);
  }, [p.exportMessage]);

  useEffect(() => {
    if (aiOpen) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ block: "end" }), 80);
    }
  }, [aiOpen, p.aiMessages.length]);

  // Leaving the tab clears selection / editing.
  useEffect(() => {
    setSelectedKey(null);
    setEditingKey(null);
  }, [p.activeTab]);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? "" : t)), 2600);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    } catch {
      showToast("Copy isn't available in this browser");
    }
  }

  /* ---------------- Build the manuscript as a list of blocks ---------------- */
  const blocks: Block[] = useMemo(() => {
    if (isCv) {
      const list: Block[] = [
        {
          key: "name",
          section: "Header",
          sectionCode: "01",
          text: p.candidateName,
          style: "name",
          highlight: "none",
          edit: p.onCandidateName,
        },
        {
          key: "meta",
          section: "Header",
          sectionCode: "01",
          text: p.candidateMeta,
          style: "meta",
          highlight: "none",
          edit: p.onCandidateMeta,
        },
        {
          key: "summary",
          section: "Profile",
          sectionCode: "02",
          text: p.summaryText,
          style: "body",
          highlight: "none",
          edit: p.onSummaryText,
        },
      ];

      p.diffs
        .filter((d) => !(d.hasUnsupportedClaim && d.status === "rejected"))
        .forEach((d) => {
          const pending = d.status === "pending" && !p.showOriginalOnly;
          list.push({
            key: `diff-${d.id}`,
            section: "Work",
            sectionCode: "03",
            text: p.showOriginalOnly
              ? d.original
              : d.status === "accepted" || pending
              ? d.suggested
              : d.original,
            style: "body",
            highlight: pending ? (d.hasUnsupportedClaim ? "risk" : "suggestion") : "none",
            diff: d,
          });
        });

      p.customBullets.forEach((b, i) =>
        list.push({
          key: `bullet-${i}`,
          section: "Work",
          sectionCode: "03",
          text: b,
          style: "body",
          highlight: "none",
          edit: (v) => p.onUpdateBullet(i, v),
          remove: () => p.onRemoveBullet(i),
        })
      );

      list.push({
        key: "skills",
        section: "Skills",
        sectionCode: "04",
        text: p.skillsText,
        style: "body",
        highlight: "none",
        edit: p.onSkillsText,
      });
      return list;
    }

    // Cover letter: one block per paragraph.
    const paras = p.coverLetterText.split(/\n\s*\n/);
    return paras.map((para, i) => {
      const label =
        i === 0 ? "Hello" : i === paras.length - 1 ? "Close" : i === 1 ? "Open" : "Body";
      return {
        key: `para-${i}`,
        section: label,
        sectionCode: String(i + 1).padStart(2, "0"),
        text: para,
        style: "body" as const,
        highlight: "none" as Highlight,
        edit: (v: string) => {
          const next = [...paras];
          next[i] = v;
          p.onCoverLetterText(next.join("\n\n"));
          p.onLetterApproved(false);
        },
      };
    });
  }, [isCv, p]);

  function startEdit(b: Block) {
    setSelectedKey(b.key);
    setEditingKey(b.key);
    setDraft(b.text);
  }

  function commitEdit(b: Block) {
    b.edit?.(draft.trim() || b.text);
    setEditingKey(null);
    showToast("Saved");
  }

  function askAi(prompt: string) {
    p.onSendAi(prompt);
    setAiOpen(true);
  }

  /* ---------------- Progress track (the "player" bar) ---------------- */
  const markers = [
    ...pendingDiffs.map((d, i) => ({
      key: d.id,
      color: d.hasUnsupportedClaim ? "#c2412d" : "#4a6fa5",
      at: 18 + ((i * 23) % 64),
    })),
    ...unresolvedFlags.map((f, i) => ({ key: f.id, color: "#c2412d", at: 72 + ((i * 9) % 20) })),
  ];

  let lastSection = "";

  return (
    <div className="vex-compact lg:hidden">
      {/* ---------------- Title block ---------------- */}
      <div className="px-1 pt-1">
        <p className="text-[12.5px] text-[#8a8170]">
          Edited just now · {isCv ? p.variantLabel : `${p.tone} tone`}
        </p>
        <h2 className="mt-0.5 font-serif-display text-[32px] leading-[1.05] tracking-[-0.02em] text-[#212d3d]">
          {isCv ? "Curriculum Vitae" : "Cover Letter"}
        </h2>

        {/* Meta chips + actions */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="no-scrollbar flex min-w-0 items-center gap-1.5 overflow-x-auto">
            <div className="flex shrink-0 rounded-full bg-[#ece6d8] p-0.5">
              {(["cv", "cover-letter"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => p.onTabChange(t)}
                  className={`cursor-pointer rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                    p.activeTab === t
                      ? "bg-white text-[#212d3d] shadow-[0_1px_3px_rgba(33,45,61,0.12)]"
                      : "text-[#7a705c]"
                  }`}
                >
                  {t === "cv" ? "CV" : "Letter"}
                </button>
              ))}
            </div>
            <span className="shrink-0 rounded-full border border-[#e3dccb] bg-white px-2.5 py-1 text-[11.5px] text-[#5a6675]">
              {p.wordCount} Words
            </span>
            <button
              type="button"
              onClick={() => setAuditOpen(true)}
              aria-label={`ATS ${p.atsScore}%, ${unresolvedFlags.length} audit flags`}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold ${
                p.atsScore >= 90
                  ? "bg-[#067647]/10 text-[#067647]"
                  : "bg-[#b88b32]/15 text-[#8a651b]"
              }`}
            >
              ATS {p.atsScore}%
              {unresolvedFlags.length > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[#a8361f]">
                  <Icon name="flag" className="h-3 w-3" />
                  {unresolvedFlags.length}
                </span>
              )}
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label={isCv ? "Reset draft" : "Reset letter to tone preset"}
              onClick={() => {
                if (isCv) p.onReset();
                else p.onTone(p.tone);
                showToast(isCv ? "Draft reset to clean baseline" : "Letter reset");
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#c2412d]/10 text-[#b13a24]"
            >
              <Icon name="trash" className="h-[15px] w-[15px]" />
            </button>
            <button
              type="button"
              aria-label="Export PDF"
              onClick={() => p.onExport("PDF")}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-[#212d3d] shadow-[0_1px_4px_rgba(33,45,61,0.1)]"
            >
              <Icon name="share" className="h-[15px] w-[15px]" />
            </button>
          </div>
        </div>

        {!isCv && (
          <div className="no-scrollbar mt-2.5 flex items-center gap-1.5 overflow-x-auto">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => p.onTone(t)}
                className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium ${
                  p.tone === t ? "bg-[#212d3d] text-[#faf6ed]" : "border border-[#e3dccb] bg-white text-[#5a6675]"
                }`}
              >
                {t}
              </button>
            ))}
            <button
              type="button"
              onClick={() => p.onLetterApproved(!p.letterApproved)}
              className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium ${
                p.letterApproved
                  ? "bg-[#067647] text-white"
                  : "border border-dashed border-[#b9ad92] text-[#5a6675]"
              }`}
            >
              {p.letterApproved ? "Approved ✓" : "Approve letter"}
            </button>
          </div>
        )}
      </div>

      {/* ---------------- Manuscript with section gutter ---------------- */}
      <div className="relative mt-5">
        {/* Gutter rail */}
        <div aria-hidden="true" className="absolute top-1 bottom-1 left-[46px] w-px bg-[#e2dacb]" />

        <div className="space-y-3.5">
          {blocks.map((b) => {
            const showLabel = b.section !== lastSection;
            lastSection = b.section;
            const selected = selectedKey === b.key;
            const editing = editingKey === b.key;

            const hl =
              b.highlight === "suggestion"
                ? "bg-[#dfe7f3] text-[#2b4a78]"
                : b.highlight === "risk"
                ? "bg-[#f8ddd6] text-[#9c3320]"
                : selected
                ? "bg-[#efe6cf]"
                : "";

            const textCls =
              b.style === "name"
                ? "font-serif-display text-[23px] leading-tight text-[#212d3d]"
                : b.style === "meta"
                ? "text-[13px] leading-snug text-[#7a705c]"
                : "text-[15px] leading-[1.6] text-[#212d3d]";

            return (
              <div key={b.key} className="grid grid-cols-[46px_1fr] gap-x-3">
                {/* Gutter: section code + active dot */}
                <div className="relative pt-[3px]">
                  {showLabel && (
                    <span className="block font-mono text-[10px] leading-none text-[#9a907b]">
                      {b.sectionCode}
                    </span>
                  )}
                  {showLabel && (
                    <span className="mt-1 block font-mono text-[8.5px] uppercase leading-none tracking-[0.06em] text-[#b4aa94]">
                      {b.section}
                    </span>
                  )}
                  {selected && (
                    <motion.span
                      layoutId="vex-gutter-dot"
                      className="absolute top-[9px] -right-[4px] h-[9px] w-[9px] rounded-full bg-[#212d3d] ring-[3px] ring-[#f6f1e6]"
                    />
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0">
                  {editing ? (
                    <div className="rounded-[14px] border border-[#212d3d]/25 bg-white p-2.5 shadow-[0_4px_14px_rgba(33,45,61,0.08)]">
                      <textarea
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={Math.min(8, Math.max(2, Math.ceil(draft.length / 34)))}
                        className={`w-full resize-none bg-transparent outline-none ${textCls}`}
                      />
                      <div className="mt-1.5 flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingKey(null)}
                          className="cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium text-[#5a6675]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => commitEdit(b)}
                          className="cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1 text-[12px] font-medium text-[#faf6ed]"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedKey(selected ? null : b.key)}
                      className="block w-full cursor-pointer text-left"
                    >
                      <span
                        className={`${textCls} ${hl} rounded-[5px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] ${
                          hl ? "px-1 py-[1px]" : ""
                        } whitespace-pre-line transition-colors`}
                      >
                        {b.text}
                      </span>
                    </button>
                  )}

                  {/* Floating action toolbar for the selected line */}
                  <AnimatePresence>
                    {selected && !editing && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                        transition={{ duration: 0.16 }}
                        className="mt-2"
                      >
                        {b.diff && (
                          <div className="mb-2 space-y-1 rounded-[12px] bg-white/70 px-3 py-2 text-[12px] leading-snug text-[#5a6675]">
                            {b.diff.status === "pending" && (
                              <p>
                                <span className="font-medium text-[#212d3d]">Was: </span>
                                <span className="line-through decoration-[#b4aa94]">{b.diff.original}</span>
                              </p>
                            )}
                            <p>
                              <span className="font-medium text-[#212d3d]">Why: </span>
                              {b.diff.reason}
                            </p>
                            {b.diff.hasUnsupportedClaim && b.diff.unsupportedNote && (
                              <p className="text-[#a8361f]">
                                <span className="font-medium">Unsupported: </span>
                                {b.diff.unsupportedNote}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="inline-flex items-center gap-0.5 rounded-full bg-white p-1 text-[12.5px] shadow-[0_6px_20px_rgba(33,45,61,0.14)] ring-1 ring-[#212d3d]/5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#eef1f6] px-2.5 py-1 font-medium text-[#3d5a87]">
                            <Icon name="doc" className="h-3.5 w-3.5" />
                            {b.section}
                          </span>

                          {b.diff && b.diff.status === "pending" ? (
                            <>
                              <ToolbarBtn
                                onClick={() => {
                                  p.onDecideDiff(b.diff!.id, "accepted");
                                  showToast("Edit accepted");
                                }}
                                tone="good"
                              >
                                Accept
                              </ToolbarBtn>
                              <ToolbarBtn
                                onClick={() => {
                                  p.onDecideDiff(b.diff!.id, "rejected");
                                  setSelectedKey(null);
                                  showToast("Claim rejected — original kept");
                                }}
                                tone="bad"
                              >
                                Reject
                              </ToolbarBtn>
                            </>
                          ) : b.edit ? (
                            <>
                              <ToolbarBtn onClick={() => startEdit(b)}>Edit</ToolbarBtn>
                              <ToolbarBtn
                                onClick={() =>
                                  askAi(
                                    isCv
                                      ? b.key === "skills"
                                        ? "Refine my Core Skills line for ATS keyword coverage"
                                        : b.key === "summary"
                                        ? "Tighten my Executive Profile summary for seniority"
                                        : "Draft one stronger impact bullet for release governance"
                                      : "Rewrite my cover letter opener"
                                  )
                                }
                              >
                                <span className="inline-flex items-center gap-1">
                                  <Icon name="spark" className="h-3.5 w-3.5" /> AI
                                </span>
                              </ToolbarBtn>
                            </>
                          ) : null}

                          {b.remove && (
                            <ToolbarBtn
                              tone="bad"
                              onClick={() => {
                                b.remove!();
                                setSelectedKey(null);
                                showToast("Bullet removed");
                              }}
                            >
                              Remove
                            </ToolbarBtn>
                          )}
                          <ToolbarBtn onClick={() => copy(b.text)}>Copy</ToolbarBtn>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {isCv && (
            <div className="grid grid-cols-[46px_1fr] gap-x-3">
              <span />
              <button
                type="button"
                onClick={() => {
                  p.onAddBullet();
                  showToast("Bullet added to Work experience");
                }}
                className="w-fit cursor-pointer rounded-full border border-dashed border-[#c9bfa8] px-3.5 py-1.5 text-[12.5px] font-medium text-[#7a705c]"
              >
                + Add bullet
              </button>
            </div>
          )}
        </div>

        {/* Soft fade into the bottom bar, like the reference */}
        <div aria-hidden="true" className="pointer-events-none h-28" />
      </div>

      {/* Toast + bottom bar are portaled to <body>: the page template is a transformed
          element, which would otherwise break `position: fixed`. */}
      {mounted &&
        createPortal(
          <div className="lg:hidden">
      {/* ---------------- Toast ---------------- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed inset-x-6 bottom-[calc(168px+env(safe-area-inset-bottom))] z-40 mx-auto w-fit max-w-[calc(100%-3rem)] rounded-full bg-[#212d3d] px-4 py-2 text-center text-[12.5px] font-medium text-[#faf6ed] shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- Bottom "player" bar: AI + ATS progress ---------------- */}
      <div className="fixed inset-x-0 bottom-[calc(96px+env(safe-area-inset-bottom))] z-30 px-4">
        <div className="pointer-events-none absolute inset-x-0 -top-8 -bottom-[110px] bg-gradient-to-t from-[#f6f1e6] via-[#f6f1e6] via-75% to-transparent" />
        <div className="relative mx-auto flex max-w-[520px] items-center gap-3 rounded-full bg-white/95 py-2 pr-4 pl-2 shadow-[0_8px_28px_rgba(33,45,61,0.16)] ring-1 ring-[#212d3d]/5 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setAiOpen(true)}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full py-0.5 pr-1 text-[14px] font-semibold text-[#212d3d]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#212d3d] text-[#e3cea0]">
              <Icon name="spark" className="h-4 w-4" />
            </span>
            Ask AI
          </button>

          <button
            type="button"
            onClick={() => (unresolvedFlags.length ? setAuditOpen(true) : setAiOpen(true))}
            aria-label={`ATS readiness ${p.atsScore}%`}
            className="relative h-6 flex-1 cursor-pointer"
          >
            <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#e7e1d4]" />
            <motion.span
              className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-full bg-[#212d3d]"
              initial={false}
              animate={{ width: `${p.atsScore}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 24 }}
            />
            <motion.span
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#212d3d] ring-2 ring-white"
              initial={false}
              animate={{ left: `${p.atsScore}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 24 }}
            />
            {markers.map((m) => (
              <span
                key={m.key}
                className="absolute top-1/2 h-[3px] w-3 -translate-y-1/2 rounded-full"
                style={{ left: `${m.at}%`, backgroundColor: m.color }}
              />
            ))}
          </button>

          <span className="shrink-0 font-mono text-[13px] font-semibold text-[#212d3d]">
            {p.atsScore}%
          </span>
        </div>
      </div>
          </div>,
          document.body
        )}

      {/* ---------------- AI sheet ---------------- */}
      <MobileSheet
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="Vex Scribe"
        subtitle={isCv ? "AI edits for your CV" : "AI edits for your letter"}
      >
        <div className="space-y-3">
          {p.aiMessages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
              <div
                className={`max-w-[88%] rounded-[18px] px-3.5 py-2.5 text-[13.5px] leading-snug ${
                  m.role === "user"
                    ? "rounded-br-[6px] bg-[#212d3d] text-[#faf6ed]"
                    : "rounded-bl-[6px] border border-[#e3dccb] bg-white text-[#212d3d]"
                }`}
              >
                {m.text}
                {m.suggestion && (
                  <div className="mt-2.5 rounded-[12px] bg-[#dfe7f3] p-2.5 text-[12.5px] text-[#2b4a78]">
                    <p className="whitespace-pre-line">{m.suggestion.content}</p>
                    <button
                      type="button"
                      disabled={m.suggestion.applied}
                      onClick={() => {
                        p.onApplyAi(m.id);
                        setAiOpen(false);
                      }}
                      className="mt-2 cursor-pointer rounded-full bg-[#212d3d] px-3 py-1 text-[11.5px] font-medium text-[#faf6ed] disabled:cursor-default disabled:bg-[#067647]"
                    >
                      {m.suggestion.applied ? "Applied ✓" : m.suggestion.label}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />

          <div className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 pt-1">
            {QUICK_PROMPTS[p.activeTab].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => p.onSendAi(q)}
                className="shrink-0 cursor-pointer rounded-full border border-[#dcd2bd] bg-white px-3 py-1.5 text-[12px] text-[#212d3d]"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!aiInput.trim()) return;
              p.onSendAi(aiInput.trim());
              setAiInput("");
            }}
            className="flex items-center gap-2 rounded-full border border-[#dcd2bd] bg-white py-1 pr-1 pl-4"
          >
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask for an edit…"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#212d3d] outline-none placeholder:text-[#9a907b]"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#212d3d] text-[#faf6ed]"
            >
              <Icon name="send" className="h-4 w-4" />
            </button>
          </form>
        </div>
      </MobileSheet>

      {/* ---------------- Audit sheet ---------------- */}
      <MobileSheet
        open={auditOpen}
        onClose={() => setAuditOpen(false)}
        title="Audit flags"
        subtitle={`${unresolvedFlags.length} open · ${riskDiffs.length} unsupported claims`}
      >
        <div className="space-y-2.5">
          {unresolvedFlags.length === 0 && (
            <p className="rounded-[14px] bg-[#067647]/10 px-4 py-3 text-[13px] text-[#067647]">
              All clear — nothing left to fix.
            </p>
          )}
          {unresolvedFlags.map((f) => (
            <div key={f.id} className="rounded-[16px] border border-[#e3dccb] bg-white p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#c2412d]/10 px-2 py-0.5 text-[11px] font-medium text-[#a8361f]">
                  {f.type}
                </span>
                <span className="font-mono text-[10.5px] text-[#9a907b]">{f.lineRef}</span>
              </div>
              <p className="mt-2 text-[13.5px] leading-snug text-[#212d3d]">{f.message}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-[#5a6675]">
                <span className="font-medium text-[#212d3d]">Fix: </span>
                {f.suggestion}
              </p>
              <button
                type="button"
                onClick={() => {
                  p.onResolveFlag(f.id);
                  showToast("Flag resolved");
                }}
                className="mt-2.5 cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1.5 text-[12px] font-medium text-[#faf6ed]"
              >
                Mark resolved
              </button>
            </div>
          ))}
        </div>
      </MobileSheet>
    </div>
  );
}

function ToolbarBtn({
  children,
  onClick,
  tone,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "good" | "bad";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full px-2.5 py-1 font-medium transition-colors active:bg-[#f2eee2] ${
        tone === "good" ? "text-[#067647]" : tone === "bad" ? "text-[#b13a24]" : "text-[#212d3d]"
      }`}
    >
      {children}
    </button>
  );
}
