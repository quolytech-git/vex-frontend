"use client";

import React, { useState } from "react";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import VexApplyNav from "@/components/dashboard/VexApplyNav";
import { StatusPill } from "@/components/dashboard/StatusBadge";

export default function VexApplyExtensionSettingsPage() {
  const { applySettings, updateApplySettings } = useVexWorkspace();
  const [savedNotice, setSavedNotice] = useState("");

  function toggleSetting(
    key:
      | "extensionPaired"
      | "pauseOnScreeningQuestions"
      | "highlightMissingProfileFields"
      | "strictVerifiedSkillsOnly"
      | "desktopReminderToast",
    label: string
  ) {
    updateApplySettings({ [key]: !applySettings[key] });
    setSavedNotice(`Updated "${label}" locally.`);
    setTimeout(() => setSavedNotice(""), 2500);
  }

  return (
    <DashboardSubpageFrame
      parentSection="applications"
      parentLabel="Vex Apply Hub"
      pageCode="05.6"
      pageTitle="Vex Apply · Extension Settings"
      philosopherTag="Hermes · Guardrails & Preferences"
    >
      <div className="space-y-6">
        <VexApplyNav active="settings" />

        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Eyebrow label="Extension Guardrails & Automation Rules" />
            <StatusPill
              label={
                applySettings.extensionPaired
                  ? "Local Companion: Paired"
                  : "Local Companion: Standalone Preview"
              }
              tone={applySettings.extensionPaired ? "success" : "warning"}
            />
          </div>
          <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.5rem)] text-[#212d3d]">
            Extension Preferences &amp;{" "}
            <span className="font-serif-calligraphic text-[#5a6675]">
              Safeguards.
            </span>
          </h1>
          <p className="max-w-[66ch] text-[13px] text-[#5a6675]">
            Configure how Hermes behaves when assisting with desktop ATS forms.
            Mandatory confirm-before-submit remains permanently locked ON by
            policy.
          </p>
        </section>

        {savedNotice && <StatusPill label={savedNotice} tone="success" />}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between gap-3 rounded-[20px] border border-[#067647]/40 bg-[#067647]/8 p-5">
            <div>
              <p className="font-medium text-[#212d3d]">
                Confirm-Before-Submit Hard Lock
              </p>
              <p className="text-[12px] text-[#5a6675]">
                Permanently prevents automatic submission on all employer sites.
              </p>
            </div>
            <StatusPill label="LOCKED ON" tone="success" />
          </div>

          {[
            {
              key: "extensionPaired" as const,
              title: "Simulated Desktop Extension Pairing",
              desc: "Preview paired companion state across Vex Apply workflows.",
            },
            {
              key: "pauseOnScreeningQuestions" as const,
              title: "Pause on Unseen Screening Questions",
              desc: "Stop prefill when custom essay or visa prompts appear.",
            },
            {
              key: "highlightMissingProfileFields" as const,
              title: "Highlight Missing Baseline Fields",
              desc: "Flag gaps in amber inside Pre-Submit Review before syncing.",
            },
            {
              key: "strictVerifiedSkillsOnly" as const,
              title: "Verified Skills Strict Guard",
              desc: "Only populate skills attested on your Profile or verified checks.",
            },
            {
              key: "desktopReminderToast" as const,
              title: "Post-Review Follow-Up Prompt",
              desc: "Remind you to inspect Tracker proof state after closing an ATS tab.",
            },
          ].map((item) => {
            const on = Boolean(applySettings[item.key]);
            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-[20px] border border-[#dad6ca] bg-[#fffef9] p-5"
              >
                <div>
                  <p className="font-medium text-[#212d3d]">{item.title}</p>
                  <p className="text-[12px] text-[#5a6675]">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSetting(item.key, item.title)}
                  className={`cursor-pointer shrink-0 rounded-full px-4 py-1.5 text-[11.5px] font-medium ${
                    on
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "border border-[#cfc2a5] bg-[#faf6ed] text-[#5a6675]"
                  }`}
                >
                  {on ? "Enabled" : "Disabled"}
                </button>
              </div>
            );
          })}
        </section>
      </div>
    </DashboardSubpageFrame>
  );
}
