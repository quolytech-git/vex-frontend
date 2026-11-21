"use client";

import React from "react";
import Link from "next/link";
import type { DashboardSectionId } from "@/data/dashboard";
import { useVexWorkspace } from "@/lib/vex-store";
import { VexLogoMark } from "@/components/Icons";
import PhilosopherCoachGuide from "./PhilosopherCoachGuide";
import MobileHeader from "@/components/mobile/MobileHeader";

interface DashboardSubpageFrameProps {
  parentSection: DashboardSectionId;
  parentLabel: string;
  pageCode: string;
  pageTitle: string;
  philosopherTag: string;
  children: React.ReactNode;
}

export default function DashboardSubpageFrame({
  parentSection,
  parentLabel,
  pageCode,
  pageTitle,
  philosopherTag,
  children,
}: DashboardSubpageFrameProps) {
  const { profile, plan, alerts, jobs, applications, hiddenJobIds, coachOpen, setCoachOpen } =
    useVexWorkspace();
  const unreadCount = alerts.filter((a) => !a.dismissed).length;

  return (
    <div className="vex-app relative min-h-screen w-full bg-[#f6f1e6] text-[#212d3d] pb-28 lg:bg-[#6d828f] lg:pb-16">
      {/* FULL-BLEED ASCII SKY BACKDROP — Desktop Only */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden bg-cover bg-bottom bg-no-repeat lg:block"
        style={{ backgroundImage: "url('/images/vex-ascii-sky.jpg')" }}
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
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden opacity-30 lg:block"
        style={{
          backgroundImage:
            "radial-gradient(rgba(33, 45, 61, 0.22) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* APPLE HIG MOBILE HEADER (< lg) */}
      <MobileHeader
        title={pageTitle}
        subtitle={philosopherTag}
        backHref={`/dashboard?section=${parentSection}`}
        backLabel={parentLabel}
      />

      {/* DESKTOP STICKY LIMESTONE FROSTED TOPBAR */}
      <header className="sticky top-0 z-30 hidden border-b border-[#dfd7c2]/75 bg-[#faf6ed]/72 backdrop-blur-xl lg:block">
        <div className="mx-auto flex min-h-[58px] max-w-[1440px] flex-wrap items-center justify-between gap-2 px-3 py-2 sm:flex-nowrap sm:gap-3 sm:px-6 sm:py-0 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center gap-1.5 transition-opacity hover:opacity-80 sm:gap-2"
            >
              <VexLogoMark className="h-7 w-7 rounded-[9px] border border-[#212d3d]/15 shadow-2xs sm:h-8 sm:w-8" />
              <span className="font-serif-display text-[21px] leading-none text-[#212d3d] sm:text-[24px]">
                Vex
              </span>
            </Link>

            <span className="hidden h-4 w-px bg-[#212d3d]/15 sm:block" />

            <Link
              href={`/dashboard?section=${parentSection}`}
              className="inline-flex max-w-[132px] shrink-0 items-center gap-1 truncate rounded-full border border-[#cfc4a7] bg-white/80 px-2.5 py-1 font-mono text-[10px] font-medium text-[#212d3d] hover:border-[#212d3d] hover:bg-white sm:max-w-none sm:px-3 sm:text-[10.5px]"
            >
              <span className="truncate">&lt;- {parentLabel}</span>
            </Link>

            <div className="hidden items-center gap-1.5 truncate font-mono text-[11px] text-[#212d3d]/75 md:flex">
              <span>{pageCode}</span>
              <span>/</span>
              <span className="truncate font-semibold text-[#212d3d]">
                {pageTitle}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="hidden rounded-full border border-[#cfc4a7] bg-[#faf6ed] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#7a6b4e] lg:inline-flex">
              {philosopherTag}
            </span>

            <Link
              href="/dashboard/intelligence"
              className="hidden rounded-full border border-white/60 bg-white/60 px-3 py-1 font-mono text-[10.5px] font-medium text-[#212d3d] hover:bg-white sm:inline-flex"
            >
              Apollo Intel
            </Link>

            <button
              type="button"
              onClick={() => setCoachOpen((v) => !v)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] font-medium transition-colors sm:px-3 sm:text-[11px] ${
                coachOpen
                  ? "bg-[#b88b32] text-white"
                  : "border border-white/60 bg-white/60 text-[#212d3d] hover:bg-white"
              }`}
            >
              {coachOpen ? "Coach: On" : "Coach Guide"}
            </button>

            <Link
              href="/dashboard?section=alerts"
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/60 bg-white/60 px-2.5 py-1 font-mono text-[10px] font-medium text-[#212d3d] hover:bg-white sm:gap-1.5 sm:px-3 sm:text-[11px]"
            >
              <span>Alerts</span>
              {unreadCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#067647] px-1 text-[9.5px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/dashboard?section=settings"
              className="hidden rounded-full border border-white/60 bg-white/60 px-3 py-1 text-[11.5px] font-medium text-[#212d3d] hover:bg-white sm:inline-flex"
            >
              {profile.name || "Candidate"} ({plan})
            </Link>
          </div>
        </div>
      </header>

      {/* SUBPAGE STAGE */}
      <main className="relative z-10 mx-auto max-w-[1380px] px-4 pt-6 sm:px-6 lg:px-8">
        {children}
      </main>


      {/* SHARED PHILOSOPHER COACH GUIDE ACROSS NESTED PAGES */}
      <PhilosopherCoachGuide
        open={coachOpen}
        activeSection={parentSection}
        onNavigate={(nextSection) => {
          window.location.href = `/dashboard?section=${nextSection}`;
        }}
        onClose={() => setCoachOpen(false)}
      />
    </div>
  );
}
