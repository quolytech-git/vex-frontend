"use client";

import React, { useState } from "react";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import VexApplyNav from "@/components/dashboard/VexApplyNav";
import { StatusPill } from "@/components/dashboard/StatusBadge";

const INSTALL_STEPS = [
  {
    step: "01",
    title: "Confirm Desktop Chromium Environment",
    detail:
      "Open Desktop Google Chrome (v120+), Edge, or Brave on macOS, Windows, or Linux. Desktop Chrome extensions cannot be installed inside mobile iPhone Chrome.",
  },
  {
    step: "02",
    title: "Open Chrome Extensions Manager",
    detail:
      "Once the unpacked package or Chrome Web Store listing is released, open chrome://extensions in a desktop tab and pin Vex Apply to the toolbar.",
  },
  {
    step: "03",
    title: "Grant Scoped activeTab & Storage Permissions",
    detail:
      "Vex Apply requests activeTab and local storage access only—never blanket access to browsing history or passwords.",
  },
  {
    step: "04",
    title: "Pair Extension Session with Your Vex Workspace",
    detail:
      "Toggle Extension Handshake inside Vex Apply Overview or Settings so mapped CV variants and baseline facts match your active job packet.",
  },
  {
    step: "05",
    title: "Run Your First Supervised Review",
    detail:
      "Open any Greenhouse or Lever application, click Prefill Draft, verify unknown screening fields manually, and confirm submission.",
  },
];

export default function VexApplyInstallPage() {
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  return (
    <DashboardSubpageFrame
      parentSection="applications"
      parentLabel="Vex Apply Hub"
      pageCode="05.4"
      pageTitle="Vex Apply · Install Guide"
      philosopherTag="Hermes · Desktop Setup"
    >
      <div className="space-y-6">
        <VexApplyNav active="install" />

        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Eyebrow label="Step-by-Step Desktop Chrome Installation" />
            <StatusPill label="5 Guided Steps" tone="navy" dot={false} />
          </div>
          <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.5rem)] text-[#212d3d]">
            Install &amp; Pair{" "}
            <span className="font-serif-calligraphic text-[#5a6675]">
              Vex Apply on Desktop Chrome.
            </span>
          </h1>
          <p className="max-w-[66ch] text-[13px] text-[#5a6675]">
            Follow these steps once an official extension build is loaded on your
            desktop browser. Tick steps as you inspect each permission and safety
            check.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-3 lg:col-span-8">
            {INSTALL_STEPS.map((st) => {
              const done = Boolean(checkedSteps[st.step]);
              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() =>
                    setCheckedSteps((p) => ({ ...p, [st.step]: !done }))
                  }
                  className={`flex w-full cursor-pointer items-start justify-between gap-4 rounded-[20px] border p-5 text-left transition-all ${
                    done
                      ? "border-[#067647]/40 bg-[#067647]/8"
                      : "border-[#dad6ca] bg-[#fffef9] hover:border-[#212d3d]"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-mono text-[10.5px] font-semibold uppercase text-[#7a6b4e]">
                      Step {st.step}
                    </span>
                    <h2 className="font-serif-display text-[20px] text-[#212d3d]">
                      {st.title}
                    </h2>
                    <p className="text-[12.5px] leading-relaxed text-[#5a6675]">
                      {st.detail}
                    </p>
                  </div>
                  <StatusPill
                    label={done ? "Reviewed" : "Mark Read"}
                    tone={done ? "success" : "neutral"}
                    dot={false}
                  />
                </button>
              );
            })}
          </section>

          <aside className="space-y-4 lg:col-span-4">
            <div className="rounded-[22px] border border-[#dad6ca] bg-[#f4efe3] p-5 space-y-3">
              <Eyebrow label="Troubleshooting Notes" />
              <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                Common Edge Cases
              </h3>
              <ul className="space-y-2.5 text-[12px] text-[#212d3d]">
                <li>
                  <strong>Custom Workday multi-page widgets:</strong> Complex
                  shadow-DOM portals fall back cleanly to clipboard copy assist
                  so no wrong field gets populated.
                </li>
                <li>
                  <strong>Session timeout on ATS portal:</strong> Draft answers
                  stay saved inside Vex Apply Review so you can resume without
                  re-typing.
                </li>
                <li>
                  <strong>Need to test pre-submit review right now?</strong> Use
                  Application Review directly inside this web app.
                </li>
              </ul>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/dashboard/apply/tutorial"
                  className="rounded-full bg-[#212d3d] py-2 text-center text-[12px] font-medium text-[#faf6ed]"
                >
                  Open Interactive Tutorial -&gt;
                </Link>
                <Link
                  href="/dashboard/apply/review/app-1"
                  className="rounded-full border border-[#cfc2a5] bg-white py-2 text-center text-[12px] font-medium text-[#212d3d]"
                >
                  Inspect Live Review Queue
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
