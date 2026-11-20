"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Generic phone "note" editor: big title, chips, a numbered section  */
/*  gutter, tap-a-line toolbar (Edit / Copy / Remove) and a floating   */
/*  score bar. Pure view — every value and change comes from the page. */
/* ------------------------------------------------------------------ */

export interface NoteBlock {
  key: string;
  section: string;
  text: string;
  placeholder?: string;
  style?: "title" | "meta" | "body" | "chip";
  tone?: "none" | "good" | "warn";
  onChange?: (v: string) => void;
  onRemove?: () => void;
}

export interface NoteAdd {
  section: string;
  label: string;
  onAdd: () => void;
}

interface Props {
  eyebrow: string;
  title: string;
  chips?: React.ReactNode;
  blocks: NoteBlock[];
  adds?: NoteAdd[];
  score: number;
  scoreLabel: string;
  primaryLabel: string;
  onPrimary: () => void;
  message?: string;
  tools?: { label: string; onToggle: (open: boolean) => void };
}

export default function MobileNoteEditor(p: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (p.message) flash(p.message);
  }, [p.message]);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? "" : t)), 2400);
  }

  async function copy(t: string) {
    try {
      await navigator.clipboard.writeText(t);
      flash("Copied");
    } catch {
      flash("Copy isn't available here");
    }
  }

  // Number sections in order of first appearance.
  const codes = new Map<string, string>();
  p.blocks.forEach((b) => {
    if (!codes.has(b.section)) codes.set(b.section, String(codes.size + 1).padStart(2, "0"));
  });

  let last = "";
  const rows: React.ReactNode[] = [];
  const addsBySection = new Map((p.adds || []).map((a) => [a.section, a]));

  const pushAdd = (section: string) => {
    const a = addsBySection.get(section);
    if (!a) return;
    rows.push(
      <div key={`add-${section}`} className="grid grid-cols-[52px_1fr] gap-x-3">
        <span />
        <button
          type="button"
          onClick={() => {
            a.onAdd();
            flash(`${a.label.replace(/^\+\s*/, "")} added`);
          }}
          className="w-fit cursor-pointer rounded-full border border-dashed border-[#c9bfa8] px-3.5 py-1.5 text-[12.5px] font-medium text-[#7a705c]"
        >
          {a.label}
        </button>
      </div>
    );
  };

  p.blocks.forEach((b, i) => {
    const first = b.section !== last;
    if (first && last) pushAdd(last);
    last = b.section;
    const isSel = selected === b.key;
    const isEdit = editing === b.key;
    const empty = !b.text.trim();

    const textCls =
      b.style === "title"
        ? "font-serif-display text-[23px] leading-tight text-[#212d3d]"
        : b.style === "meta"
        ? "text-[13px] leading-snug text-[#7a705c]"
        : b.style === "chip"
        ? "text-[13.5px] leading-snug text-[#212d3d]"
        : "text-[15px] leading-[1.6] text-[#212d3d]";
    const hl =
      b.tone === "good"
        ? "bg-[#dfe7f3] text-[#2b4a78]"
        : b.tone === "warn"
        ? "bg-[#f8ddd6] text-[#9c3320]"
        : isSel
        ? "bg-[#efe6cf]"
        : "";

    rows.push(
      <div key={b.key} className="grid grid-cols-[52px_1fr] gap-x-3">
        <div className="relative pt-[3px]">
          {first && (
            <>
              <span className="block font-mono text-[10px] leading-none text-[#9a907b]">
                {codes.get(b.section)}
              </span>
              <span className="mt-1 block font-mono text-[8.5px] uppercase leading-tight tracking-[0.04em] text-[#b4aa94]">
                {b.section}
              </span>
            </>
          )}
          {isSel && (
            <motion.span
              layoutId="vex-note-dot"
              className="absolute top-[9px] -right-[4px] h-[9px] w-[9px] rounded-full bg-[#212d3d] ring-[3px] ring-[#f6f1e6]"
            />
          )}
        </div>

        <div className="min-w-0">
          {isEdit ? (
            <div className="rounded-[14px] border border-[#212d3d]/25 bg-white p-2.5 shadow-[0_4px_14px_rgba(33,45,61,0.08)]">
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={b.placeholder}
                rows={Math.min(9, Math.max(2, Math.ceil(draft.length / 34)))}
                className={`w-full resize-none bg-transparent outline-none ${textCls}`}
              />
              <div className="mt-1.5 flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium text-[#5a6675]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    b.onChange?.(draft);
                    setEditing(null);
                    flash("Saved");
                  }}
                  className="cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1 text-[12px] font-medium text-[#faf6ed]"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (empty && b.onChange) {
                  setSelected(b.key);
                  setEditing(b.key);
                  setDraft("");
                  return;
                }
                setSelected(isSel ? null : b.key);
              }}
              className="block w-full cursor-pointer text-left"
            >
              <span
                className={`${textCls} ${hl} ${hl ? "px-1 py-[1px]" : ""} ${
                  empty ? "italic text-[#b4aa94]" : ""
                } whitespace-pre-line rounded-[5px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]`}
              >
                {empty ? b.placeholder || "Tap to write…" : b.text}
              </span>
            </button>
          )}

          <AnimatePresence>
            {isSel && !isEdit && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="mt-2"
              >
                <div className="inline-flex items-center gap-0.5 rounded-full bg-white p-1 text-[12.5px] shadow-[0_6px_20px_rgba(33,45,61,0.14)] ring-1 ring-[#212d3d]/5">
                  <span className="rounded-full bg-[#eef1f6] px-2.5 py-1 font-medium text-[#3d5a87]">
                    {b.section}
                  </span>
                  {b.onChange && (
                    <Btn
                      onClick={() => {
                        setEditing(b.key);
                        setDraft(b.text);
                      }}
                    >
                      Edit
                    </Btn>
                  )}
                  <Btn onClick={() => copy(b.text)}>Copy</Btn>
                  {b.onRemove && (
                    <Btn
                      bad
                      onClick={() => {
                        b.onRemove!();
                        setSelected(null);
                        flash("Removed");
                      }}
                    >
                      Remove
                    </Btn>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
    if (i === p.blocks.length - 1) pushAdd(b.section);
  });

  return (
    <div className="vex-compact lg:hidden">
      <div className="px-1 pt-1">
        <p className="text-[12.5px] text-[#8a8170]">{p.eyebrow}</p>
        <h2 className="mt-0.5 font-serif-display text-[30px] leading-[1.08] tracking-[-0.02em] text-[#212d3d]">
          {p.title}
        </h2>
        {p.chips && (
          <div className="no-scrollbar mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5">{p.chips}</div>
        )}
      </div>

      <div className="relative mt-5">
        <div aria-hidden="true" className="absolute top-1 bottom-1 left-[52px] w-px bg-[#e2dacb]" />
        <div className="space-y-3.5">{rows}</div>
      </div>

      {p.tools && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              const next = !toolsOpen;
              setToolsOpen(next);
              p.tools!.onToggle(next);
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-[16px] border border-[#e3dccb] bg-white/80 px-4 py-3 text-[14px] font-semibold text-[#212d3d]"
          >
            {p.tools.label}
            <motion.span animate={{ rotate: toolsOpen ? 90 : 0 }} className="text-[#7a705c]">
              ›
            </motion.span>
          </button>
        </div>
      )}

      {!toolsOpen && <div aria-hidden="true" className="h-28" />}

      {mounted &&
        createPortal(
          <div className="lg:hidden">
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
            <div className="fixed inset-x-0 bottom-[calc(96px+env(safe-area-inset-bottom))] z-30 px-4">
              <div className="pointer-events-none absolute inset-x-0 -top-8 -bottom-[110px] bg-gradient-to-t from-[#f6f1e6] via-[#f6f1e6] via-75% to-transparent" />
              <div className="relative mx-auto flex max-w-[520px] items-center gap-3 rounded-full bg-white/95 py-2 pr-4 pl-2 shadow-[0_8px_28px_rgba(33,45,61,0.16)] ring-1 ring-[#212d3d]/5 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={p.onPrimary}
                  className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full py-0.5 pr-1 text-[14px] font-semibold text-[#212d3d] active:scale-95"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#212d3d] text-[#e3cea0]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </span>
                  {p.primaryLabel}
                </button>
                <div className="relative h-6 flex-1" aria-label={`${p.scoreLabel} ${p.score}%`}>
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#e7e1d4]" />
                  <motion.span
                    className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-full bg-[#212d3d]"
                    initial={false}
                    animate={{ width: `${p.score}%` }}
                  />
                  <motion.span
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#212d3d] ring-2 ring-white"
                    initial={false}
                    animate={{ left: `${p.score}%` }}
                  />
                </div>
                <span className="shrink-0 text-right leading-none">
                  <span className="block font-mono text-[13px] font-semibold text-[#212d3d]">{p.score}%</span>
                  <span className="block text-[9.5px] text-[#7a705c]">{p.scoreLabel}</span>
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function Btn({ children, onClick, bad }: { children: React.ReactNode; onClick: () => void; bad?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full px-2.5 py-1 font-medium active:bg-[#f2eee2] ${
        bad ? "text-[#b13a24]" : "text-[#212d3d]"
      }`}
    >
      {children}
    </button>
  );
}
