"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  type OnboardingProfileState,
  SUBSCRIPTION_TIERS,
  type SubscriptionPlan,
} from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { CheckIcon } from "@/components/Icons";
import { StatusPill } from "./StatusBadge";
import MobilePhilosopherPill from "@/components/mobile/MobilePhilosopherPill";

interface SettingsPrivacyViewProps {
  profile: OnboardingProfileState;
  plan: SubscriptionPlan;
  onChangePlan: (plan: SubscriptionPlan) => void;
  onResetWorkspaceData: () => void;
}

export default function SettingsPrivacyView({
  profile,
  plan,
  onChangePlan,
  onResetWorkspaceData,
}: SettingsPrivacyViewProps) {
  const [exportJsonVisible, setExportJsonVisible] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(true);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [extensionPaused, setExtensionPaused] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleDownloadJson = () => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify(
      {
        subscriptionPlan: plan,
        profile,
        twoFactorPreview: twoFactorEnabled,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vex-workspace-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <MobilePhilosopherPill
        name="Themis"
        role="Sovereign Ownership"
        image="/images/themis-governance-scales.jpg"
        quote="Every datum rests in your hands; consent precedes every action."
        guidance={`Active tier: ${plan}. Export local JSON backup or review Plutus billing quotas below.`}
      />

      {/* Header with Classical Themis Governance Hero */}
      <div className="vex-m-flat rounded-[24px] border border-[#cfc4a7] bg-[#f2eee2] p-6">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-8">
            <Eyebrow label="Themis · Subscription, Governance & Data Control" />
            <h1 className="font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] font-normal leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
              Settings, Plans &amp;{" "}
              <span className="italic text-[#5a6675]">Data Control.</span>
            </h1>
            <p className="max-w-[66ch] text-[13.5px] text-[#5a6675]">
              Manage your Free / Pro / Ultra tier access, Gmail &amp; Outlook inbox
              sync, extension safeguards, security checks, and full local workspace
              export/reset.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link
                href="/login"
                onClick={() => {
                  try {
                    localStorage.removeItem("vex_frontend_user");
                  } catch {
                    // ignore storage errors
                  }
                }}
                className="cursor-pointer rounded-full border border-[#212d3d]/25 bg-white px-4 py-2 text-[12.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
              >
                Sign out of session
              </Link>
              <Link
                href="/dashboard/settings/billing"
                className="rounded-full bg-[#212d3d] px-4 py-2 text-[12.5px] font-medium text-[#faf6ed] hover:bg-[#314158]"
              >
                Open Plutus Billing -&gt;
              </Link>
              <Link
                href="/dashboard/integrations/mcp"
                className="rounded-full border border-[#212d3d] bg-white px-4 py-2 text-[12.5px] font-medium text-[#212d3d] hover:bg-[#faf6ed]"
              >
                MCP Forge &amp; Tools
              </Link>
              <Link
                href="/dashboard/settings/integrations"
                className="rounded-full border border-[#cfc2a5] bg-[#faf6ed] px-4 py-2 text-[12.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
              >
                Recruiter Inbox
              </Link>
            </div>
          </div>

          <div className="hidden justify-start lg:col-span-4 lg:flex lg:justify-end">
            <div className="w-full max-w-[290px] overflow-hidden rounded-t-[135px] rounded-b-[18px] border border-[#cfc2a5] bg-[#e9e0cc] shadow-[0_12px_28px_rgba(33,45,61,0.1)]">
              <div className="aspect-[4/3.6] w-full overflow-hidden">
                <img
                  src="/images/themis-governance-scales.jpg"
                  alt="Themis holding bronze scales inside classical marble alcove"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="border-t border-[#d8cbb0] bg-[#fffef9] px-4 py-2.5">
                <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#7a6b4e]">
                  Themis · Sovereign Ownership
                </p>
                <p className="text-[11.5px] leading-snug text-[#212d3d]">
                  “Every datum rests in your hands; consent precedes every action.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Subscription Tiers (Free / Pro / Ultra) */}
      <section className="rounded-[22px] border border-[#dad6ca] bg-white p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <Eyebrow label="Section 1 · Subscription Management" />
            <h2 className="mt-1 font-serif-display text-[23px] text-[#212d3d]">
              Active Plan &amp; Feature Access
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill label={`Current tier: ${plan}`} tone="navy" dot={false} />
            <Link
              href="/dashboard/settings/billing"
              className="rounded-full border border-[#d6cbb2] bg-[#faf6ed] px-3.5 py-1.5 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
            >
              Plutus Billing &amp; Invoices -&gt;
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SUBSCRIPTION_TIERS.map((tier) => {
            const active = plan === tier.plan;
            return (
              <div
                key={tier.plan}
                className={`flex flex-col justify-between rounded-[18px] border p-5 transition-colors ${
                  active
                    ? "border-[#212d3d] bg-[#f2eee2]"
                    : "border-[#dad6ca] bg-[#faf6ed]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif-display text-[24px] text-[#212d3d]">
                      {tier.plan}
                    </span>
                    <span className="text-[14px] font-semibold text-[#212d3d]">
                      {tier.price}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-[#5a6675]">
                    {tier.tagline}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-[12px] text-[#212d3d]">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#067647]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onChangePlan(tier.plan)}
                  className={`mt-4 w-full cursor-pointer rounded-full py-2 text-[12.5px] font-medium transition-colors ${
                    active
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "border border-[#dad6ca] bg-white text-[#212d3d] hover:border-[#212d3d]"
                  }`}
                >
                  {active ? "Active workspace tier" : `Preview ${tier.plan}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Account Security & Integrations */}
        <section className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-white p-6 lg:col-span-6">
          <h2 className="font-serif-display text-[22px] text-[#212d3d]">
            Account Security &amp; Connected Integrations
          </h2>

          <div className="space-y-2.5 text-[13px]">
            <div className="flex items-center justify-between gap-3 rounded-[14px] border border-[#ece9df] bg-[#faf6ed] px-4 py-3 max-lg:flex-col max-lg:items-stretch">
              <div>
                <p className="font-medium text-[#212d3d]">
                  Email Verification ({profile.email || "candidate@vex.careers"})
                </p>
                <p className="text-[11.5px] text-[#5a6675]">
                  Required for email recruiter thread matching
                </p>
              </div>
              <button
                type="button"
                onClick={() => { if (!emailVerified) window.location.href = "/verify-email"; }}
                className="cursor-pointer rounded-full bg-[#067647]/10 px-3 py-1 text-[11.5px] font-medium text-[#067647]"
              >
                {emailVerified ? "Verified [OK]" : "Verify email"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-[14px] border border-[#ece9df] bg-[#faf6ed] px-4 py-3 max-lg:flex-col max-lg:items-stretch">
              <div>
                <p className="font-medium text-[#212d3d]">Password Reset</p>
                <p className="text-[11.5px] text-[#5a6675]">
                  We email you a link that expires in 30 minutes
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setPasswordResetSent(true); window.location.href = "/forgot-password"; }}
                className="cursor-pointer rounded-full border border-[#dad6ca] bg-white px-3.5 py-1 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
              >
                {passwordResetSent ? "Reset link ready" : "Send reset link"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-[14px] border border-[#ece9df] bg-[#faf6ed] px-4 py-3 max-lg:flex-col max-lg:items-stretch">
              <div>
                <p className="font-medium text-[#212d3d]">
                  Gmail &amp; Outlook Recruiter Sync
                </p>
                <p className="text-[11.5px] text-[#5a6675]">
                  Read-only interview invite &amp; status classifier
                </p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setGmailConnected((v) => !v)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium ${
                    gmailConnected
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "border border-[#dad6ca] bg-white text-[#5a6675]"
                  }`}
                >
                  Gmail {gmailConnected ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  onClick={() => setOutlookConnected((v) => !v)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium ${
                    outlookConnected
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "border border-[#dad6ca] bg-white text-[#5a6675]"
                  }`}
                >
                  Outlook {outlookConnected ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-[14px] border border-[#ece9df] bg-[#faf6ed] px-4 py-3 max-lg:flex-col max-lg:items-stretch">
              <div>
                <p className="font-medium text-[#212d3d]">
                  Vex Apply Browser Extension Guard
                </p>
                <p className="text-[11.5px] text-[#5a6675]">
                  Always pauses before Submit for explicit user click
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExtensionPaused((v) => !v)}
                className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium ${
                  extensionPaused
                    ? "bg-[#b42318]/10 text-[#b42318]"
                    : "bg-[#212d3d] text-[#faf6ed]"
                }`}
              >
                {extensionPaused ? "Paused" : "Active (Confirm-first)"}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-[#ece9df] bg-[#faf6ed] px-4 py-3">
              <div>
                <p className="font-medium text-[#212d3d]">
                  2FA Authenticator Preview (Themis Guard)
                </p>
                <p className="text-[11.5px] text-[#5a6675]">
                  Local security preference (server TOTP enrollment requires backend)
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled((v) => !v)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-medium ${
                    twoFactorEnabled
                      ? "bg-[#067647] text-white"
                      : "border border-[#dad6ca] bg-white text-[#212d3d]"
                  }`}
                >
                  {twoFactorEnabled ? "2FA Enabled (Local)" : "Enable 2FA"}
                </button>
                <Link
                  href="/dashboard/settings/integrations"
                  className="rounded-full border border-[#d6cbb2] bg-white px-3 py-1 text-[11.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
                >
                  Hephaestus Integrations -&gt;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Data Export & Delete */}
        <section className="space-y-4 rounded-[22px] border border-[#dad6ca] bg-white p-6 lg:col-span-6">
          <h2 className="font-serif-display text-[22px] text-[#212d3d]">
            Privacy, Data Ownership &amp; Workspace Export
          </h2>
          <p className="text-[13.5px] text-[#5a6675]">
            This frontend runs locally in your browser (`localStorage`). Zero
            records leave your device or touch a remote database.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setExportJsonVisible((v) => !v)}
              className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2.5 text-[13px] font-medium text-[#faf6ed]"
            >
              {exportJsonVisible
                ? "Hide workspace JSON"
                : "Export all data (JSON)"}
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="cursor-pointer rounded-full border border-[#d6cbb2] bg-[#faf6ed] px-5 py-2.5 text-[13px] font-medium text-[#212d3d] hover:border-[#212d3d]"
            >
              Download JSON File
            </button>
            <button
              type="button"
              onClick={onResetWorkspaceData}
              className="cursor-pointer rounded-full border border-[#b42318]/40 bg-[#b42318]/5 px-5 py-2.5 text-[13px] font-medium text-[#b42318] hover:bg-[#b42318]/10"
            >
              Reset &amp; clear local workspace
            </button>
          </div>

          {exportJsonVisible && (
            <pre className="max-h-[220px] overflow-auto rounded-[16px] border border-[#dad6ca] bg-[#faf6ed] p-4 text-[11.5px] text-[#212d3d]">
              {JSON.stringify(
                {
                  subscriptionPlan: plan,
                  profile,
                  exportedAt: new Date().toISOString(),
                },
                null,
                2
              )}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
}

