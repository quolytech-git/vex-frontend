"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { DashboardSectionId } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import MobileSheet from "./MobileSheet";
import { useInstallApp } from "@/components/InstallApp";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  onSelectSection?: (section: DashboardSectionId) => void;
}

export default function MobileHeader({
  title,
  subtitle,
  backHref,
  onSelectSection,
}: MobileHeaderProps) {
  const { alerts, coachOpen, setCoachOpen, profile } = useVexWorkspace();
  const [moreOpen, setMoreOpen] = useState(false);
  const install = useInstallApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const unreadAlerts = alerts.filter((a) => !a.dismissed).length;
  const isHomeRoot = !backHref && title === "Dashboard";

  const destinationLinks: {
    group: string;
    items: { label: string; sub: string; section?: DashboardSectionId; href?: string }[];
  }[] = [
    {
      group: "Writing & Documents",
      items: [
        { label: "Resume Studio", sub: "Leonardo da Vinci", section: "documents" },
        { label: "Full CV Editor", sub: "Structured sections & ATS", href: "/dashboard/documents/resume/res-main" },
        { label: "Cover Letter Studio", sub: "Cicero rhetorical atelier", href: "/dashboard/documents/cover-letters" },
      ],
    },
    {
      group: "Execution & Prep",
      items: [
        { label: "Chrome Extension", sub: "Install & autofill applications", href: "/dashboard/extension" },
        { label: "Vex Apply Review", sub: "Check fields before you submit", href: "/dashboard/apply" },
        { label: "Interview Studio", sub: "Socrates & Marcus sparring", section: "interviews" },
        { label: "Interview Analytics", sub: "Aristotle post-session metrics", href: "/dashboard/interviews/sess-meridian-1/report" },
      ],
    },
    {
      group: "Intelligence & Tools",
      items: [
        { label: "AI Assistant", sub: "Zeus approval-first planner", section: "mcp" },
        { label: "MCP Forge & Tools", sub: "Hephaestus connectors", href: "/dashboard/integrations/mcp" },
        { label: "Recruiter Inbox", sub: "Gmail & Outlook sync", href: "/dashboard/settings/integrations" },
        { label: "Career Oracle", sub: "Apollo market benchmarks", href: "/dashboard/intelligence" },
        { label: "Course Catalog", sub: "Aristotle curriculum", href: "/dashboard/learning/catalog" },
        { label: "Skill Assessments", sub: "Athena practical checks", href: "/dashboard/learning/assessments" },
        { label: "Network & Companies", sub: "Plato Council", section: "network" },
      ],
    },
    {
      group: "Account & Governance",
      items: [
        { label: "Notifications & Alerts", sub: `${unreadAlerts} active updates`, section: "alerts" },
        { label: "Settings & Privacy", sub: "Themis data ownership", section: "settings" },
        { label: "Billing & AI Quotas", sub: "Plutus tier preview", href: "/dashboard/settings/billing" },
        { label: "Help & Support", sub: "Answers, tour, contact", href: "/dashboard/help" },
      ],
    },
  ];

  function handleSectionPick(sec: DashboardSectionId) {
    setMoreOpen(false);
    if (onSelectSection) onSelectSection(sec);
  }

  return (
    <>
      <header
        data-scrolled={scrolled ? "true" : "false"}
        className="vex-glass-bar sticky top-0 z-30 px-4 pt-[max(10px,env(safe-area-inset-top))] pb-2.5 lg:hidden"
      >
        {isHomeRoot ? (
          /* Screen-2 Apple Mobile Style Root Header: Avatar + Greeting + Clean Bell & Overflow Circles */
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onSelectSection?.("profile")}
              className="flex min-w-0 cursor-pointer items-center gap-3 text-left"
            >
              <img
                src="/images/vex-philosopher.jpg"
                alt={profile.name || "Candidate"}
                className="h-11 w-11 shrink-0 rounded-full border border-[#cfc2a5] object-cover object-top shadow-2xs"
              />
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-medium text-[#5a6675]">
                  {profile.targetRole || "Candidate Workspace"}
                </p>
                <h1 className="truncate font-serif-display text-[22px] leading-tight text-[#212d3d]">
                  Welcome Back
                </h1>
              </div>
            </button>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectSection?.("alerts")}
                aria-label="Open notifications"
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full vex-glass-btn text-[#212d3d]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadAlerts > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#b42318]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                aria-label="Open all Vex companion modules"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full vex-glass-btn text-[#212d3d]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <circle cx="6" cy="12" r="1.7" />
                  <circle cx="12" cy="12" r="1.7" />
                  <circle cx="18" cy="12" r="1.7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* Screen-3 Minimal Apple Subpage Bar: Circular Back + Crisp Title + Circular Overflow (...) */
          <div className="flex items-center justify-between gap-2">
            {backHref ? (
              <Link
                href={backHref}
                aria-label={`Back to ${subtitle || "Dashboard"}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full vex-glass-btn text-[#212d3d]"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => onSelectSection?.("overview")}
                aria-label="Back to Home"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full vex-glass-btn text-[#212d3d]"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <div className="min-w-0 flex-1 text-center">
              <h1
                className={`truncate font-serif-display leading-tight text-[#212d3d] ${
                  title.length > 30 ? "text-[16.5px]" : title.length > 22 ? "text-[18px]" : "text-[20px]"
                }`}
              >
                {title}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-label="Open module options"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full vex-glass-btn text-[#212d3d]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <circle cx="6" cy="12" r="1.7" />
                <circle cx="12" cy="12" r="1.7" />
                <circle cx="18" cy="12" r="1.7" />
              </svg>
            </button>
          </div>
        )}
      </header>

      <MobileSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="Vex Companion"
        subtitle={`${profile.name || "Candidate"} · Workspace Navigation`}
      >
        <div className="space-y-4">
          {!install.installed && (
            <button
              type="button"
              onClick={() => {
                setMoreOpen(false);
                install.open();
              }}
              className="flex w-full cursor-pointer items-center gap-3 rounded-[18px] bg-[#212d3d] px-4 py-3 text-left text-[#faf6ed]"
            >
              <img src="/icons/icon-192.png" alt="" className="h-10 w-10 rounded-[11px]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold">Get the Vex app</span>
                <span className="block text-[11.5px] text-[#faf6ed]/70">Add to your home screen in 2 taps</span>
              </span>
              <span className="rounded-full bg-[#e3cea0] px-3 py-1 text-[12px] font-semibold text-[#212d3d]">Get</span>
            </button>
          )}
          <div className="flex items-center justify-between rounded-[18px] border border-[#dfd4be] bg-white px-4 py-3">
            <div>
              <p className="text-[13.5px] font-medium text-[#212d3d]">
                Interactive Coach Guide
              </p>
              <p className="text-[11.5px] text-[#5a6675]">
                Step-by-step philosopher spotlight walk
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMoreOpen(false);
                setCoachOpen((v) => !v);
              }}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[11.5px] font-medium ${
                coachOpen
                  ? "bg-[#b88b32] text-white"
                  : "bg-[#212d3d] text-[#faf6ed]"
              }`}
            >
              {coachOpen ? "Turn Off" : "Start Tour"}
            </button>
          </div>

          {destinationLinks.map((grp) => (
            <div key={grp.group} className="space-y-1.5">
              <p className="px-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                {grp.group}
              </p>
              <div className="divide-y divide-[#ece5d5] overflow-hidden rounded-[18px] border border-[#dfd4be] bg-white">
                {grp.items.map((item) =>
                  item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex min-h-[48px] items-center justify-between px-4 py-2.5 active:bg-[#faf6ed]"
                    >
                      <div>
                        <p className="text-[13.5px] font-medium text-[#212d3d]">
                          {item.label}
                        </p>
                        <p className="text-[11.5px] text-[#5a6675]">{item.sub}</p>
                      </div>
                      <span className="font-mono text-[12px] text-[#7a6b4e]">
                        &gt;
                      </span>
                    </Link>
                  ) : item.section && onSelectSection ? (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSectionPick(item.section!)}
                      className="flex min-h-[48px] w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left active:bg-[#faf6ed]"
                    >
                      <div>
                        <p className="text-[13.5px] font-medium text-[#212d3d]">
                          {item.label}
                        </p>
                        <p className="text-[11.5px] text-[#5a6675]">{item.sub}</p>
                      </div>
                      <span className="font-mono text-[12px] text-[#7a6b4e]">
                        &gt;
                      </span>
                    </button>
                  ) : (
                    <Link
                      key={item.label}
                      href={`/dashboard?section=${item.section}`}
                      onClick={() => setMoreOpen(false)}
                      className="flex min-h-[48px] items-center justify-between px-4 py-2.5 active:bg-[#faf6ed]"
                    >
                      <div>
                        <p className="text-[13.5px] font-medium text-[#212d3d]">
                          {item.label}
                        </p>
                        <p className="text-[11.5px] text-[#5a6675]">{item.sub}</p>
                      </div>
                      <span className="font-mono text-[12px] text-[#7a6b4e]">
                        &gt;
                      </span>
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </MobileSheet>
    </>
  );
}
