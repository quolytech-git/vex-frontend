"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVexWorkspace } from "@/lib/vex-store";
import Eyebrow from "@/components/Eyebrow";
import { ArrowRightIcon, CheckIcon } from "@/components/Icons";
import DashboardSubpageFrame from "@/components/dashboard/DashboardSubpageFrame";
import VexApplyNav from "@/components/dashboard/VexApplyNav";
import { StatusPill } from "@/components/dashboard/StatusBadge";

const SUPPORTED_PORTALS = [
  { name: "Greenhouse Boards", status: "Supported", notes: "Full profile, CV, cover letter & custom text questions." },
  { name: "Lever Postings", status: "Supported", notes: "Maps contact, portfolio URLs, and resume upload." },
  { name: "Ashby HQ", status: "Partial", notes: "Supports core profile; custom multi-select requires manual review." },
  { name: "Workday / Custom SSO", status: "Manual assist", notes: "Detects account wall cleanly and pauses for candidate handoff." },
];

export default function VexApplySetupPage() {
  const {
    profile,
    applications,
    resumes,
    coverLetters,
    applySettings,
    updateApplySettings,
  } = useVexWorkspace();

  const extensionInstalled = applySettings.extensionPaired;
  const setExtensionInstalled = (next: boolean | ((v: boolean) => boolean)) => {
    const val =
      typeof next === "function" ? next(applySettings.extensionPaired) : next;
    updateApplySettings({ extensionPaired: val });
  };
  const [detectedUrl, setDetectedUrl] = useState(
    "https://boards.greenhouse.io/northbridge-systems/jobs/product-ops-lead"
  );
  const [selectedAppId, setSelectedAppId] = useState(
    applications[0]?.id || "app-1"
  );
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id || "");
  const [selectedLetterId, setSelectedLetterId] = useState(
    coverLetters[0]?.id || ""
  );
  const [allowAutofillProfile, setAllowAutofillProfile] = useState(true);
  const [allowAutofillWork, setAllowAutofillWork] = useState(true);
  const [allowAutofillSkills, setAllowAutofillSkills] = useState(true);

  const selectedResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0];
  const lowerUrl = detectedUrl.toLowerCase();
  const detectedPortal = lowerUrl.includes("greenhouse")
    ? "Greenhouse (Supported · High reliability)"
    : lowerUrl.includes("lever")
    ? "Lever (Supported)"
    : lowerUrl.includes("ashby")
    ? "Ashby (Partial — manual screening questions)"
    : "Custom / Unknown ATS (Review all fields before send)";

  return (
    <DashboardSubpageFrame
      parentSection="applications"
      parentLabel="Applications Tracker"
      pageCode="05.2"
      pageTitle="Vex Apply · Browser Extension"
      philosopherTag="Hermes · Supervised Execution"
    >
      <div className="space-y-6">
        <VexApplyNav active="overview" sessionId={selectedAppId} />
        {/* HERMES EXTENSION HERO */}
        <section className="rounded-[24px] border border-[#cfc4a7] bg-[#faf6ed] p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow label="Vex Apply Companion · Chrome / Chromium Extension" />
                <StatusPill
                  label={
                    extensionInstalled
                      ? "Extension Handshake: Connected (Local Preview)"
                      : "Extension: Not Detected in Browser"
                  }
                  tone={extensionInstalled ? "success" : "warning"}
                />
              </div>

              <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.06] text-[#212d3d]">
                Vex Apply{" "}
                <span className="font-serif-calligraphic text-[#5a6675]">
                  Supervised Prefill &amp; Review.
                </span>
              </h1>
              <p className="max-w-[64ch] text-[13px] text-[#5a6675]">
                Hermes carries your verified profile, tailored CV, and Cicero cover
                letter across supported ATS forms — and{" "}
                <strong className="font-medium text-[#212d3d]">
                  always pauses before submission
                </strong>{" "}
                until you inspect every field and confirm.
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setExtensionInstalled((v) => !v)}
                  className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2 text-[12.5px] font-medium text-[#faf6ed] hover:bg-[#314158]"
                >
                  {extensionInstalled
                    ? "Disconnect Local Companion Preview"
                    : "Simulate / Pair Extension Handshake"}
                </button>
                <Link
                  href={`/dashboard/apply/review/${selectedAppId}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#212d3d] bg-white px-5 py-2 text-[12.5px] font-medium text-[#212d3d] hover:bg-[#212d3d] hover:text-[#faf6ed]"
                >
                  <span>Open Pre-Submit Field Review</span>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              <div className="flex w-full max-w-[300px] items-center gap-3.5 rounded-[20px] border border-[#cfc2a5] bg-[#fffef9] p-3.5 shadow-xs">
                <img
                  src="/images/hermes-messenger-alerts.jpg"
                  alt="Hermes extension guide"
                  className="h-24 w-20 shrink-0 rounded-[14px] border border-[#cfc2a5] object-cover object-top"
                />
                <div className="space-y-1">
                  <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                    Hermes Execution Rule
                  </p>
                  <p className="text-[12px] leading-snug text-[#212d3d]">
                    “Carry facts swiftly; never click Submit behind the
                    candidate&apos;s back.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT 7: PORTAL DETECTOR + PACKET SELECTION + FIELD MAP */}
          <section className="space-y-5 rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-6 lg:col-span-7">
            <div className="space-y-2 border-b border-[#ece5d5] pb-4">
              <Eyebrow label="Live Form & Attachment Mapping" />
              <h2 className="font-serif-display text-[22px] text-[#212d3d]">
                Test Application URL &amp; Packet Attachments
              </h2>
              <input id="page-input-1" name="page-input-1" aria-label="page input 1"
                value={detectedUrl}
                onChange={(e) => setDetectedUrl(e.target.value)}
                placeholder="Paste target ATS job URL..."
                className="w-full rounded-[12px] border border-[#dad6ca] bg-[#faf6ed] px-3.5 py-2 font-mono text-[12px] text-[#212d3d]"
              />
              <p className="font-mono text-[11px] text-[#067647]">
                Detected portal: {detectedPortal}
              </p>
            </div>

            {/* Select Target Application + CV + Cover Letter */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="page-select-2"
                  className="font-mono text-[10px] uppercase text-[#7a6b4e]"
                >
                  Application Draft
                </label>
                <select id="page-select-2" name="page-select-2" aria-label="Application Draft"
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[12px]"
                >
                  {applications.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.company} — {a.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="page-select-3"
                  className="font-mono text-[10px] uppercase text-[#7a6b4e]"
                >
                  Attach CV
                </label>
                <select id="page-select-3" name="page-select-3" aria-label="Attach CV"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[12px]"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="page-select-4"
                  className="font-mono text-[10px] uppercase text-[#7a6b4e]"
                >
                  Attach Cover Letter
                </label>
                <select id="page-select-4" name="page-select-4" aria-label="Attach Cover Letter"
                  value={selectedLetterId}
                  onChange={(e) => setSelectedLetterId(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-[#dad6ca] bg-[#faf6ed] px-3 py-2 text-[12px]"
                >
                  {coverLetters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field Preview Mapping Table */}
            <div className="space-y-2 rounded-[16px] border border-[#e3dac5] bg-[#faf6ed] p-4">
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#7a6b4e]">
                Mapped Payload Preview ({selectedResume?.skills.length || 0} skills)
              </p>
              <div className="divide-y divide-[#ece5d5] text-[12.5px]">
                <div className="flex justify-between py-2">
                  <span className="text-[#5a6675]">Identity &amp; Email</span>
                  <span className="font-medium text-[#212d3d]">
                    {allowAutofillProfile
                      ? `${profile.name} · ${profile.email}`
                      : "Blocked by user scope"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#5a6675]">Latest Role &amp; Education</span>
                  <span className="font-medium text-[#212d3d]">
                    {allowAutofillWork
                      ? `${selectedResume?.experience[0]?.role || profile.currentRole} · ${selectedResume?.education[0]?.degree || "Verified Degree"}`
                      : "Manual entry only"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#5a6675]">Verified Skills Tags</span>
                  <span className="font-medium text-[#212d3d]">
                    {allowAutofillSkills
                      ? selectedResume?.skills.slice(0, 4).join(", ")
                      : "Skipped"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#5a6675]">Unknown Screening Inputs</span>
                  <span className="font-medium text-[#b54708]">
                    Paused for manual candidate review
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT 5: INSTALL STEPS + PERMISSION CONTROLS + SUPPORTED SITES */}
          <aside className="space-y-5 lg:col-span-5">
            <section className="rounded-[22px] border border-[#dad6ca] bg-[#fffef9] p-5 space-y-3">
              <h3 className="font-serif-display text-[21px] text-[#212d3d]">
                Extension Permissions
              </h3>
              {[
                {
                  label: "Autofill contact & profile identity",
                  checked: allowAutofillProfile,
                  toggle: () => setAllowAutofillProfile((v) => !v),
                },
                {
                  label: "Autofill work history & education",
                  checked: allowAutofillWork,
                  toggle: () => setAllowAutofillWork((v) => !v),
                },
                {
                  label: "Populate attested skills list",
                  checked: allowAutofillSkills,
                  toggle: () => setAllowAutofillSkills((v) => !v),
                },
              ].map((perm) => (
                <button
                  key={perm.label}
                  type="button"
                  onClick={perm.toggle}
                  className="flex w-full cursor-pointer items-center justify-between rounded-[12px] border border-[#e3dac5] bg-[#faf6ed] px-3.5 py-2.5 text-left text-[12.5px]"
                >
                  <span>{perm.label}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                      perm.checked
                        ? "bg-[#067647] text-white"
                        : "bg-[#dad6ca] text-[#5a6675]"
                    }`}
                  >
                    {perm.checked ? "ALLOWED" : "OFF"}
                  </span>
                </button>
              ))}
              <div className="flex items-center gap-2 rounded-[12px] border border-[#067647]/30 bg-[#067647]/10 px-3 py-2 text-[12px] text-[#067647]">
                <CheckIcon className="h-4 w-4 shrink-0" />
                <span>Hard lock enabled: auto-submit is permanently disabled.</span>
              </div>
            </section>

            <section className="rounded-[22px] border border-[#dad6ca] bg-[#f4efe3] p-5 space-y-3">
              <h3 className="font-serif-display text-[20px] text-[#212d3d]">
                Supported ATS Portals
              </h3>
              <div className="space-y-2">
                {SUPPORTED_PORTALS.map((p) => (
                  <div
                    key={p.name}
                    className="rounded-[12px] border border-[#dfd4be] bg-white px-3.5 py-2.5 text-[12px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#212d3d]">{p.name}</span>
                      <StatusPill
                        label={p.status}
                        tone={
                          p.status === "Supported"
                            ? "success"
                            : p.status === "Partial"
                            ? "warning"
                            : "neutral"
                        }
                        dot={false}
                      />
                    </div>
                    <p className="mt-1 text-[#5a6675]">{p.notes}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </DashboardSubpageFrame>
  );
}
