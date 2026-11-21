"use client";

import React from "react";
import Link from "next/link";
import { useVexWorkspace } from "@/lib/vex-store";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import { InstallAppButton, useInstallApp } from "@/components/InstallApp";
import { InfoIcon } from "@/components/web/InfoPage";
import { ExtensionDisclosure, ExtensionPopupPreview, ExtensionSitePermissions } from "@/components/dashboard/kit/SubpagePanels";

/** Dashboard hub for the Chrome extension + the installable app, on phone and PC. */
export default function DashboardExtensionPage() {
  const { applySettings, updateApplySettings, applications } = useVexWorkspace();
  const { platform } = useInstallApp();
  const paired = applySettings.extensionPaired;
  const ready = applications.filter((a) => a.submissionState === "prepared");

  const toggles: { key: keyof typeof applySettings; label: string; hint: string }[] = [
    { key: "confirmBeforeSubmit", label: "Stop before Submit", hint: "Always on — you press Submit yourself" },
    { key: "pauseOnScreeningQuestions", label: "Pause on screening questions", hint: "Leave free-text answers to you" },
    { key: "highlightMissingProfileFields", label: "Highlight missing fields", hint: "Show what your profile can't fill" },
    { key: "strictVerifiedSkillsOnly", label: "Verified skills only", hint: "Never fill skills you haven't proven" },
  ];

  return (
    <DashboardSubpageFrame
      parentSection="applications"
      parentLabel="Tracker"
      pageCode="05.2"
      pageTitle="Extension & Apps"
      philosopherTag="Hermes · Swift & honest"
    >
      <div className="mx-auto max-w-[980px] space-y-5">
        {/* Status card */}
        <section className="overflow-hidden rounded-[26px] bg-[#212d3d] p-6 text-[#faf6ed] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-[#e3cea0] text-[#212d3d]">
                <InfoIcon name="puzzle" className="h-7 w-7" />
              </span>
              <div>
                <p className="font-serif-display text-[26px] leading-tight">Vex Apply for Chrome</p>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-[#faf6ed]/75">
                  <span className={`h-2 w-2 rounded-full ${paired ? "bg-[#4ade80]" : "bg-[#e3cea0]"}`} />
                  {paired ? "Connected to this workspace" : "Not connected yet"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {platform === "desktop" ? (
                <Link href="/dashboard/apply/install" className="rounded-full bg-[#faf6ed] px-5 py-2.5 text-[14px] font-semibold text-[#212d3d]">
                  {paired ? "Reinstall" : "Add to Chrome"}
                </Link>
              ) : (
                <span className="rounded-full bg-white/10 px-4 py-2.5 text-[13px] text-[#faf6ed]/85">
                  Desktop only — open Vex on your computer to install
                </span>
              )}
              <button
                type="button"
                onClick={() => updateApplySettings({ extensionPaired: !paired })}
                className="cursor-pointer rounded-full border border-white/25 px-5 py-2.5 text-[14px] font-semibold text-[#faf6ed] hover:bg-white/10"
              >
                {paired ? "Disconnect" : "Mark as connected"}
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Steps */}
          <section className="rounded-[24px] border border-[#e3dccb] bg-white p-5 sm:p-6">
            <h2 className="font-serif-display text-[22px] text-[#212d3d]">Set up in 3 steps</h2>
            <ol className="mt-4 space-y-3">
              {[
                { t: "Install the extension", d: "Chrome or Edge on your computer.", href: "/dashboard/apply/install" },
                { t: "Learn the flow", d: "2-minute walkthrough of fill → check → submit.", href: "/dashboard/apply/tutorial" },
                { t: "Review before you submit", d: "Check every filled field on one screen.", href: "/dashboard/apply/review/app-1" },
              ].map((s, i) => (
                <li key={s.t}>
                  <Link href={s.href} className="flex items-center gap-3 rounded-[16px] bg-[#faf6ed] px-4 py-3 transition-colors hover:bg-[#f2eee2]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#212d3d] text-[12px] font-semibold text-[#faf6ed]">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-semibold text-[#212d3d]">{s.t}</span>
                      <span className="block text-[12.5px] text-[#5a6675]">{s.d}</span>
                    </span>
                    <span className="text-[#7a705c]">›</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          {/* Settings */}
          <section className="rounded-[24px] border border-[#e3dccb] bg-white p-5 sm:p-6">
            <h2 className="font-serif-display text-[22px] text-[#212d3d]">Safety settings</h2>
            <ul className="mt-3 divide-y divide-[#ece5d5]">
              {toggles.map((t) => {
                const on = Boolean(applySettings[t.key]);
                const locked = t.key === "confirmBeforeSubmit";
                return (
                  <li key={t.key} className="flex items-center gap-3 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium text-[#212d3d]">{t.label}</span>
                      <span className="block text-[12px] text-[#5a6675]">{t.hint}</span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={t.label}
                      disabled={locked}
                      onClick={() => updateApplySettings({ [t.key]: !on })}
                      className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed ${on ? "bg-[#067647]" : "bg-[#d6cfbf]"}`}
                    >
                      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Ready to apply */}
        <section className="rounded-[24px] border border-[#e3dccb] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif-display text-[22px] text-[#212d3d]">Ready to apply</h2>
            <span className="rounded-full bg-[#f2eee2] px-2.5 py-1 text-[12px] font-medium text-[#5a6675]">{ready.length} prepared</span>
          </div>
          {ready.length === 0 ? (
            <p className="mt-3 text-[13.5px] text-[#5a6675]">Nothing waiting. Prepare an application from the Jobs page first.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {ready.map((a) => (
                <li key={a.id}>
                  <Link href={`/dashboard/apply/review/${a.id}`} className="flex items-center gap-3 rounded-[16px] bg-[#faf6ed] px-4 py-3 hover:bg-[#f2eee2]">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-semibold text-[#212d3d]">{a.title}</span>
                      <span className="block truncate text-[12.5px] text-[#5a6675]">{a.company}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[#212d3d] px-3 py-1 text-[12px] font-semibold text-[#faf6ed]">Review</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ExtensionSitePermissions />
          <ExtensionDisclosure />
        </div>
        <ExtensionPopupPreview />

        {/* App install */}
        <section className="flex flex-col gap-4 rounded-[24px] border border-[#e3dccb] bg-[#f2eee2] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3.5">
            <img src="/icons/icon-192.png" alt="" className="h-12 w-12 rounded-[13px] shadow" />
            <div>
              <p className="text-[15px] font-semibold text-[#212d3d]">Vex app for phone & computer</p>
              <p className="text-[12.5px] text-[#5a6675]">Install from your browser — no app store.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <InstallAppButton variant="dark" target="ios" label="iPhone" />
            <InstallAppButton variant="dark" target="android" label="Android" />
            <InstallAppButton variant="light" target="desktop" label="PC / Mac" />
          </div>
        </section>
      </div>
    </DashboardSubpageFrame>
  );
}
