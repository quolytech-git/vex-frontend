"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { DashboardSectionId } from "@/data/dashboard";

export type PrimaryMobileTab =
  | "overview"
  | "jobs"
  | "applications"
  | "learning"
  | "profile";

interface MobileTabBarProps {
  activeTab: PrimaryMobileTab | "other";
  onSelectSection?: (sec: DashboardSectionId) => void;
  jobsCount?: number;
  appsCount?: number;
}

type TabId = "overview" | "jobs" | "applications" | "profile";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Home" },
  { id: "jobs", label: "Jobs" },
  { id: "applications", label: "Tracker" },
  { id: "profile", label: "Profile" },
];

const QUICK_ACTIONS: {
  section: DashboardSectionId;
  label: string;
  hint: string;
  icon: string;
  tint: string;
}[] = [
  { section: "mcp", label: "Ask Vex AI", hint: "Plan & run tasks", icon: "spark", tint: "#b88b32" },
  { section: "documents", label: "Tailor CV", hint: "Edits & letters", icon: "doc", tint: "#6b5b95" },
  { section: "applications", label: "Log application", hint: "Track a role", icon: "plus", tint: "#2f6b4f" },
  { section: "interviews", label: "Practice interview", hint: "2-min drills", icon: "mic", tint: "#9c4930" },
  { section: "learning", label: "Learn a skill", hint: "Lessons & quiz", icon: "book", tint: "#3f6b8a" },
  { section: "network", label: "Add contact", hint: "Warm intros", icon: "people", tint: "#5a6675" },
];

function Glyph({ name, className = "h-[22px] w-[22px]", strokeWidth = 1.8 }: { name: string; className?: string; strokeWidth?: number }) {
  const p = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "overview":
      return (
        <svg {...p}>
          <path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "jobs":
      return (
        <svg {...p}>
          <rect x="3" y="7" width="18" height="13" rx="3" />
          <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18" />
        </svg>
      );
    case "applications":
      return (
        <svg {...p}>
          <path d="M9 4.5H7a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="3.5" rx="1" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );
    case "profile":
      return (
        <svg {...p}>
          <circle cx="12" cy="8.5" r="3.6" />
          <path d="M5 20.5a7 7 0 0 1 14 0" />
        </svg>
      );
    case "spark":
      return (
        <svg {...p}>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
        </svg>
      );
    case "doc":
      return (
        <svg {...p}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      );
    case "plus":
      return (
        <svg {...p}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "mic":
      return (
        <svg {...p}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
        </svg>
      );
    case "book":
      return (
        <svg {...p}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
          <path d="M4 19a2.5 2.5 0 0 1 2.5-2.5H20" />
        </svg>
      );
    case "people":
      return (
        <svg {...p}>
          <circle cx="9" cy="8.5" r="3.2" />
          <path d="M3 20a6 6 0 0 1 12 0M16 4.8a3.2 3.2 0 0 1 0 6.4M18 14.5a6 6 0 0 1 3 5.5" />
        </svg>
      );
    default:
      return null;
  }
}

export default function MobileTabBar({
  activeTab,
  onSelectSection,
  jobsCount = 0,
  appsCount = 0,
}: MobileTabBarProps) {
  const [mounted, setMounted] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!actionsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActionsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actionsOpen]);

  if (!mounted) return null;

  const badges: Partial<Record<TabId, number>> = {
    jobs: jobsCount || undefined,
    applications: appsCount || undefined,
  };

  function go(section: DashboardSectionId) {
    setActionsOpen(false);
    onSelectSection?.(section);
  }

  const renderTab = (tab: { id: TabId; label: string }) => {
    const active = activeTab === tab.id;
    const badge = badges[tab.id];
    const inner = (
      <span className="relative flex h-[54px] flex-col items-center justify-center gap-[3px]">
        {active && (
          <motion.span
            layoutId="vex-tab-active"
            className="absolute inset-x-1 inset-y-1 rounded-[18px] bg-white/80 shadow-[0_2px_10px_rgba(33,45,61,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]"
            transition={{ type: "spring", stiffness: 520, damping: 38 }}
          />
        )}
        <span className={`relative transition-colors ${active ? "text-[#212d3d]" : "text-[#6f6a5f]"}`}>
          <Glyph name={tab.id} strokeWidth={active ? 2.1 : 1.7} />
          {typeof badge === "number" && (
            <span className="absolute -top-1.5 -right-2.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#b42318] px-1 text-[9.5px] font-bold text-white ring-2 ring-[#f8f4ea]">
              {badge}
            </span>
          )}
        </span>
        <span
          className={`relative text-[10.5px] leading-none tracking-[0.01em] transition-colors ${
            active ? "font-semibold text-[#212d3d]" : "font-medium text-[#6f6a5f]"
          }`}
        >
          {tab.label}
        </span>
      </span>
    );

    return onSelectSection ? (
      <button
        key={tab.id}
        type="button"
        aria-label={tab.label}
        aria-current={active ? "page" : undefined}
        onClick={() => go(tab.id)}
        className="flex-1 cursor-pointer active:scale-95 transition-transform"
      >
        {inner}
      </button>
    ) : (
      <Link
        key={tab.id}
        href={`/dashboard?section=${tab.id}`}
        aria-label={tab.label}
        aria-current={active ? "page" : undefined}
        className="flex-1 active:scale-95 transition-transform"
      >
        {inner}
      </Link>
    );
  };

  return createPortal(
    <div className="lg:hidden">
      {/* Dimmed backdrop while the quick actions are open */}
      <AnimatePresence>
        {actionsOpen && (
          <motion.button
            type="button"
            aria-label="Close quick actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setActionsOpen(false)}
            className="fixed inset-0 z-[44] cursor-default bg-[#12222e]/30 backdrop-blur-[3px]"
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[45] px-3 pb-[max(10px,env(safe-area-inset-bottom))]">
        {/* Quick-action panel (opens from the centre button) */}
        <AnimatePresence>
          {actionsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 480, damping: 34 }}
              style={{ transformOrigin: "50% 100%" }}
              className="vex-glass pointer-events-auto mx-auto mb-3 max-w-[440px] rounded-[28px] p-3"
            >
              <p className="px-1.5 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a705c]">
                Quick actions
              </p>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_ACTIONS.map((a, i) => {
                  const body = (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i, duration: 0.2 }}
                      className="flex h-full flex-col items-center gap-1.5 rounded-[20px] bg-white/70 px-1.5 pt-3 pb-2.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] active:scale-95 transition-transform"
                    >
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-[14px] text-white shadow-sm"
                        style={{ backgroundColor: a.tint }}
                      >
                        <Glyph name={a.icon} className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <span className="text-[12px] leading-tight font-semibold text-[#212d3d]">{a.label}</span>
                      <span className="text-[10px] leading-tight text-[#7a705c]">{a.hint}</span>
                    </motion.span>
                  );
                  return onSelectSection ? (
                    <button key={a.label} type="button" onClick={() => go(a.section)} className="cursor-pointer">
                      {body}
                    </button>
                  ) : (
                    <Link key={a.label} href={`/dashboard?section=${a.section}`} onClick={() => setActionsOpen(false)}>
                      {body}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glass tab bar */}
        <nav
          aria-label="Main navigation"
          className="vex-glass pointer-events-auto relative mx-auto flex max-w-[440px] items-center rounded-[26px] px-1.5"
        >
          {TABS.slice(0, 2).map(renderTab)}

          {/* Centre call-to-action */}
          <div className="relative flex w-[72px] shrink-0 justify-center">
            <motion.button
              type="button"
              aria-label={actionsOpen ? "Close quick actions" : "Open quick actions"}
              aria-expanded={actionsOpen}
              onClick={() => setActionsOpen((v) => !v)}
              whileTap={{ scale: 0.9 }}
              className="relative -mt-7 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full text-[#e9d3a0] shadow-[0_10px_24px_rgba(33,45,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] ring-[5px] ring-[#f6f1e6]"
              style={{ background: "linear-gradient(160deg, #33465f 0%, #1a2432 100%)" }}
            >
              <motion.span animate={{ rotate: actionsOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                <Glyph name="plus" className="h-7 w-7" strokeWidth={2.4} />
              </motion.span>
            </motion.button>
          </div>

          {TABS.slice(2).map(renderTab)}
        </nav>
      </div>
    </div>,
    document.body
  );
}
