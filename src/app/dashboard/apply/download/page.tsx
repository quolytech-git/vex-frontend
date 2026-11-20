"use client";

import React, { useState } from "react";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import VexApplyNav from "@/components/dashboard/VexApplyNav";
import { StatusPill } from "@/components/dashboard/StatusBadge";

export default function VexApplyDownloadPage() {
  const [browserTarget, setBrowserTarget] = useState<
    "Chrome" | "Edge" | "Brave" | "Arc"
  >("Chrome");
  const [manifestOpen, setManifestOpen] = useState(false);

  return (
    <DashboardSubpageFrame
      parentSection="applications"
      parentLabel="Vex Apply Hub"
      pageCode="05.3"
      pageTitle="Vex Apply · Extension Package"
      philosopherTag="Hermes · Desktop Distribution"
    >
      <div className="space-y-6">
        <VexApplyNav active="download" />

        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label="Hermes Extension Package · Desktop Chromium Only" />
                <StatusPill
                  label="Package Status: Frontend Preview (Not Yet Published)"
                  tone="warning"
                />
              </div>
              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.06] text-[#212d3d]">
                Download Vex Apply for{" "}
                <span className="font-serif-calligraphic text-[#5a6675]">
                  Desktop Chrome.
                </span>
              </h1>
              <p className="max-w-[66ch] text-[13px] text-[#5a6675]">
                This frontend-only release documents the full Desktop Chrome
                extension architecture and permission model cleanly. Because no
                compiled <code>.crx</code> or Chrome Web Store package is bundled
                yet, no placeholder download binary is fabricated here.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href="/dashboard/apply/install"
                  className="rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed] hover:bg-[#314158]"
                >
                  View Step-by-Step Install Guide -&gt;
                </Link>
                <button
                  type="button"
                  onClick={() => setManifestOpen((v) => !v)}
                  className="cursor-pointer rounded-full border border-[#cfc2a5] bg-white px-4 py-2 text-[12px] font-medium text-[#212d3d]"
                >
                  {manifestOpen ? "Hide Manifest v3 Spec" : "Inspect Manifest v3 Permissions"}
                </button>
              </div>
            </div>

            <div className="rounded-[20px] border border-[#cfc2a5] bg-[#fffef9] p-5 space-y-2.5 lg:col-span-4">
              <p className="font-mono text-[10px] uppercase text-[#7a6b4e]">
                Desktop Release Target
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(["Chrome", "Edge", "Brave", "Arc"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrowserTarget(b)}
                    className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium ${
                      browserTarget === b
                        ? "bg-[#212d3d] text-[#faf6ed]"
                        : "border border-[#dad6ca] bg-[#faf6ed] text-[#5a6675]"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#ece5d5] pt-2 text-[12px] text-[#212d3d] space-y-1">
                <p>
                  <strong>Target Browser:</strong> Desktop {browserTarget} 120+
                </p>
                <p>
                  <strong>Manifest Version:</strong> Chrome MV3 (planned)
                </p>
                <p>
                  <strong>iOS / Mobile Browsers:</strong> Unsupported (desktop
                  extension APIs only)
                </p>
              </div>
            </div>
          </div>
        </section>

        {manifestOpen && (
          <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 space-y-3">
            <Eyebrow label="Declared Extension Manifest Specification" />
            <pre className="overflow-x-auto rounded-[14px] border border-[#e3dac5] bg-[#faf6ed] p-4 font-mono text-[11.5px] text-[#212d3d]">
{`{
  "manifest_version": 3,
  "name": "Vex Apply — Confirm-First Career Companion",
  "version": "0.9.0-preview",
  "permissions": ["activeTab", "storage"],
  "host_permissions": [
    "https://boards.greenhouse.io/*",
    "https://jobs.lever.co/*",
    "https://apply.workable.com/*"
  ],
  "notes": "Confirm-first design: submit buttons remain user-triggered only."
}`}
            </pre>
          </section>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "No Hidden Background Scraping",
              body: "Runs only on active supported ATS tabs when you explicitly click Prepare Fields.",
            },
            {
              title: "Mandatory Pre-Submit Pause",
              body: "Highlights unknown screening fields and pauses cleanly until you personally verify the form.",
            },
            {
              title: "Truth-Checked Sync",
              body: "Syncs completed submissions back into Applications Tracker with Verified or User-reported proof.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-[20px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-2"
            >
              <h2 className="font-serif-display text-[20px] text-[#212d3d]">
                {card.title}
              </h2>
              <p className="text-[12.5px] text-[#5a6675]">{card.body}</p>
            </div>
          ))}
        </section>
      </div>
    </DashboardSubpageFrame>
  );
}
