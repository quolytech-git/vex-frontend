"use client";

import React, { useState } from "react";
import Link from "next/link";
import type {
  AlertItem,
  DashboardSectionId,
  NetworkContact,
  OnboardingProfileState,
} from "@/data/dashboard";
import Eyebrow from "@/components/Eyebrow";
import { StatusPill } from "./StatusBadge";

interface AccountPrivacyViewProps {
  profile: OnboardingProfileState;
  alerts: AlertItem[];
  contacts: NetworkContact[];
  onSaveProfile: (next: OnboardingProfileState) => void;
  onDismissAlert: (id: string) => void;
  onNavigate: (section: DashboardSectionId) => void;
  onResetWorkspaceData: () => void;
}

export default function AccountPrivacyView({
  profile,
  alerts,
  contacts,
  onSaveProfile,
  onDismissAlert,
  onNavigate,
  onResetWorkspaceData,
}: AccountPrivacyViewProps) {
  const [tab, setTab] = useState<"profile" | "alerts" | "network" | "privacy">("profile");
  const [draft, setDraft] = useState<OnboardingProfileState>(profile);
  const [savedNotice, setSavedNotice] = useState(false);
  const [alertPreset, setAlertPreset] = useState<"Essential" | "Standard" | "Everything">("Essential");
  const [exportJsonVisible, setExportJsonVisible] = useState(false);

  function saveChanges(e: React.FormEvent) {
    e.preventDefault();
    onSaveProfile(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-[22px] border border-[#dad6ca] bg-[#f2eee2] p-6 sm:flex-row sm:items-end">
        <div>
          <Eyebrow label="Templates 17–19 · Profile, Alerts, Network & Privacy" />
          <h1 className="mt-1.5 font-serif-display text-[clamp(1.9rem,3vw,2.6rem)] font-normal leading-[1.06] tracking-[-0.025em] text-[#212d3d]">
            Account, Alerts &amp;{" "}
            <span className="italic text-[#5a6675]">Data Control.</span>
          </h1>
          <p className="mt-1 max-w-[66ch] text-[13.5px] text-[#5a6675]">
            Edit your canonical baseline facts once, choose low-noise alert presets,
            manage contacts per application, or export/clear your frontend workspace.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="cursor-pointer self-start rounded-full border border-[#212d3d]/25 bg-white px-4 py-2 text-[12.5px] font-medium text-[#212d3d] hover:border-[#212d3d]"
        >
          Re-run guided onboarding →
        </Link>
      </div>

      {/* Tab Selector */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "profile" as const, label: "Write-Once Profile" },
          { id: "alerts" as const, label: `Alerts (${alerts.filter((a) => !a.dismissed).length})` },
          { id: "network" as const, label: `Contacts & Notes (${contacts.length})` },
          { id: "privacy" as const, label: "Privacy, Export & Delete" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
              tab === t.id
                ? "bg-[#212d3d] text-[#faf6ed]"
                : "border border-[#dad6ca] bg-white text-[#212d3d] hover:bg-[#f2eee2]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <form
          onSubmit={saveChanges}
          className="rounded-[22px] border border-[#dad6ca] bg-white p-6 space-y-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-[12.5px] font-medium text-[#212d3d]">
                Full name
              </label>
              <input id="accountprivacyview-input-1" name="accountprivacyview-input-1" aria-label="accountprivacyview input 1"
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full rounded-[14px] border border-[#dad6ca] bg-[#faf6ed] px-4 py-2.5 text-[14px] focus:border-[#212d3d] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[12.5px] font-medium text-[#212d3d]">
                Workspace email
              </label>
              <input id="accountprivacyview-input-2" name="accountprivacyview-input-2" aria-label="accountprivacyview input 2"
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                className="w-full rounded-[14px] border border-[#dad6ca] bg-[#faf6ed] px-4 py-2.5 text-[14px] focus:border-[#212d3d] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[12.5px] font-medium text-[#212d3d]">
                Target role
              </label>
              <input id="accountprivacyview-input-3" name="accountprivacyview-input-3" aria-label="accountprivacyview input 3"
                type="text"
                value={draft.targetRole}
                onChange={(e) => setDraft({ ...draft, targetRole: e.target.value })}
                className="w-full rounded-[14px] border border-[#dad6ca] bg-[#faf6ed] px-4 py-2.5 text-[14px] focus:border-[#212d3d] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[12.5px] font-medium text-[#212d3d]">
                Work arrangement preference
              </label>
              <input id="accountprivacyview-input-4" name="accountprivacyview-input-4" aria-label="accountprivacyview input 4"
                type="text"
                value={draft.workMode}
                onChange={(e) => setDraft({ ...draft, workMode: e.target.value })}
                className="w-full rounded-[14px] border border-[#dad6ca] bg-[#faf6ed] px-4 py-2.5 text-[14px] focus:border-[#212d3d] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[12.5px] font-medium text-[#212d3d]">
              Confirmed baseline facts (reused in CV diffs &amp; autofill)
            </label>
            <textarea id="accountprivacyview-textarea-5" name="accountprivacyview-textarea-5" aria-label="accountprivacyview textarea 5"
              rows={3}
              value={draft.cvExcerpt}
              onChange={(e) => setDraft({ ...draft, cvExcerpt: e.target.value })}
              placeholder="Paste confirmed bullets from your real experience..."
              className="w-full rounded-[14px] border border-[#dad6ca] bg-[#faf6ed] p-3.5 text-[13.5px] focus:border-[#212d3d] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {savedNotice ? (
              <span className="text-[13px] font-medium text-[#067647]">
                Baseline saved locally — readiness overview updated.
              </span>
            ) : (
              <span className="text-[12px] text-[#5a6675]">
                Stored cleanly in browser storage (frontend-only mode).
              </span>
            )}
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-[#212d3d] px-5 py-2.5 text-[13px] font-medium text-[#faf6ed]"
            >
              Save changes
            </button>
          </div>
        </form>
      )}

      {tab === "alerts" && (
        <div className="rounded-[22px] border border-[#dad6ca] bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dad6ca] pb-3">
            <p className="font-serif-display text-[21px] text-[#212d3d]">
              Low-Noise Notifications
            </p>
            <div className="flex items-center gap-1.5">
              {(["Essential", "Standard", "Everything"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAlertPreset(p)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium ${
                    alertPreset === p
                      ? "bg-[#212d3d] text-[#faf6ed]"
                      : "bg-[#ece9df] text-[#212d3d]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {alerts
              .filter((a) => !a.dismissed)
              .map((al) => (
                <div
                  key={al.id}
                  className="flex flex-col justify-between gap-3 rounded-[16px] border border-[#dad6ca] bg-[#faf6ed] p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusPill label={`${al.group} · ${al.category}`} tone="neutral" dot={false} />
                      <p className="text-[13.5px] font-medium text-[#212d3d]">
                        {al.title}
                      </p>
                    </div>
                    <p className="mt-1 text-[12.5px] text-[#5a6675]">{al.detail}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(al.targetSection)}
                      className="cursor-pointer rounded-full bg-[#212d3d] px-3.5 py-1.5 text-[12px] font-medium text-[#faf6ed]"
                    >
                      {al.actionLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDismissAlert(al.id)}
                      className="cursor-pointer rounded-full border border-[#dad6ca] bg-white px-3 py-1.5 text-[12px] text-[#5a6675]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            {alerts.every((a) => a.dismissed) && (
              <p className="text-[13px] text-[#5a6675]">You are up to date.</p>
            )}
          </div>
        </div>
      )}

      {tab === "network" && (
        <div className="rounded-[22px] border border-[#dad6ca] bg-white p-6 space-y-4">
          <div>
            <p className="font-serif-display text-[21px] text-[#212d3d]">
              Contacts Tied to Applications
            </p>
            <p className="text-[12.5px] text-[#5a6675]">
              Vex never imports address books automatically without explicit action.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="rounded-[16px] border border-[#dad6ca] bg-[#faf6ed] p-4 space-y-1.5"
              >
                <p className="font-serif-display text-[20px] text-[#212d3d]">{c.name}</p>
                <p className="text-[12.5px] font-medium text-[#5a6675]">
                  {c.role} · {c.company}
                </p>
                <p className="text-[12px] text-[#175cd3]">
                  Linked: {c.linkedApplication} · Next check-in: {c.nextFollowUp}
                </p>
                <p className="pt-1 text-[12.5px] text-[#212d3d]">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "privacy" && (
        <div className="rounded-[22px] border border-[#dad6ca] bg-white p-6 space-y-4">
          <p className="font-serif-display text-[22px] text-[#212d3d]">
            Privacy Disclosure, Export &amp; Workspace Reset
          </p>
          <p className="text-[13.5px] leading-[1.55] text-[#5a6675]">
            Your onboarding answers, saved roles, CV diffs, and mock reflection notes run
            locally in your browser session in this frontend preview — zero external DB
            or hidden model training occurs.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setExportJsonVisible((v) => !v)}
              className="cursor-pointer rounded-full bg-[#212d3d] px-4 py-2 text-[12.5px] font-medium text-[#faf6ed]"
            >
              {exportJsonVisible ? "Hide JSON export" : "Inspect & export my JSON profile"}
            </button>
            <button
              type="button"
              onClick={onResetWorkspaceData}
              className="cursor-pointer rounded-full border border-[#b42318]/40 bg-[#b42318]/10 px-4 py-2 text-[12.5px] font-medium text-[#b42318]"
            >
              Reset local workspace data
            </button>
          </div>
          {exportJsonVisible && (
            <pre className="overflow-x-auto rounded-[14px] border border-[#dad6ca] bg-[#faf6ed] p-4 text-[12px] text-[#212d3d]">
              {JSON.stringify(profile, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

